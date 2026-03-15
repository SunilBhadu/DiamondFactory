import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { DiamondsService } from '../diamonds/diamonds.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma, ItemType } from '@prisma/client';

const GST_RATE = 0.03; // 3% GST on diamonds/jewelry in India

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DF-${year}${month}-${random}`;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private diamondsService: DiamondsService
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Validate and price all items
    let subtotal = 0;
    const itemsData: Array<{
      itemType: ItemType;
      diamondId?: string;
      ringSettingId?: string;
      unitPrice: number;
      quantity: number;
      metalType?: string;
      ringSizeUs?: number;
      engravingText?: string;
      engravingFont?: string;
    }> = [];

    for (const item of dto.items) {
      // For diamonds, verify availability and reserve
      if (item.diamondId) {
        const diamond = await this.prisma.diamond.findUnique({
          where: { id: item.diamondId },
          select: { id: true, isAvailable: true, isReserved: true, priceInr: true },
        });

        if (!diamond) {
          throw new NotFoundException(`Diamond ${item.diamondId} not found`);
        }

        if (!diamond.isAvailable) {
          throw new BadRequestException(`Diamond ${item.diamondId} is no longer available`);
        }

        // Check if reserved by another user
        const reserveKey = `reserve:diamond:${item.diamondId}`;
        const reservedBy = await this.redis.get<string>(reserveKey);
        if (reservedBy && reservedBy !== userId) {
          throw new BadRequestException(
            `Diamond ${item.diamondId} is currently reserved. Please try again later.`
          );
        }
      }

      itemsData.push({
        itemType: item.itemType as ItemType,
        diamondId: item.diamondId,
        ringSettingId: item.ringSettingId,
        unitPrice: item.unitPrice,
        quantity: 1,
        metalType: item.metalType,
        ringSizeUs: item.ringSizeUs,
        engravingText: item.engravingText,
        engravingFont: item.engravingFont,
      });

      subtotal += item.unitPrice;
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let coupon = null;

    if (dto.couponCode) {
      coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Invalid or expired coupon code');
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('This coupon has expired');
      }

      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(
          `Minimum order amount for this coupon is ₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')}`
        );
      }

      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = Math.round(subtotal * (Number(coupon.discountValue) / 100));
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
        }
      } else {
        discountAmount = Number(coupon.discountValue);
      }
    }

    // Shipping
    let shippingAmount = 0;
    if (subtotal < 500000) {
      // Free shipping above ₹5 lakh
      shippingAmount = 500; // ₹500 shipping
    }

    const taxableAmount = subtotal - discountAmount;
    const gstAmount = Math.round(taxableAmount * GST_RATE);
    const totalAmount = taxableAmount + gstAmount + shippingAmount;

    // Create order in DB
    const order = await this.prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentGateway: dto.paymentGateway,
        subtotal,
        discountAmount,
        couponCode: dto.couponCode?.toUpperCase(),
        shippingAmount,
        gstAmount,
        totalAmount,
        shippingAddress: dto.shippingAddress as object,
        notes: dto.notes,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Update coupon usage
    if (coupon) {
      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Mark diamonds as reserved
    for (const item of dto.items) {
      if (item.diamondId) {
        await this.diamondsService.reserveDiamond(item.diamondId, userId);
      }
    }

    this.logger.log(
      `Order ${order.orderNumber} created for user ${userId}, total: ₹${totalAmount}`
    );

    return order;
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              diamond: {
                include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
              },
              ringSetting: {
                include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
              },
            },
          },
          payments: { select: { id: true, status: true, gateway: true, amount: true } },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            diamond: {
              include: { images: { orderBy: { sortOrder: 'asc' } } },
            },
            ringSetting: {
              include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
        payments: true,
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancel(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { select: { diamondId: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('This order cannot be cancelled');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', paymentStatus: 'CANCELLED' },
    });

    // Release diamond reservations
    for (const item of order.items) {
      if (item.diamondId) {
        await this.diamondsService.releaseReservation(item.diamondId);
      }
    }

    this.logger.log(`Order ${order.orderNumber} cancelled by user ${userId}`);
    return updated;
  }

  async updateStatus(id: string, status: string, adminNote?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: {
        status: status as Parameters<typeof this.prisma.order.update>[0]['data']['status'],
        notes: adminNote ? `${order.notes ?? ''}\n[Admin] ${adminNote}`.trim() : undefined,
      },
    });
  }

  // Admin: list all orders
  async findAllAdmin(page = 1, limit = 20, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      where['status'] = status;
    }

    if (search) {
      where['OR'] = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: where as Prisma.OrderWhereInput,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { select: { itemType: true, unitPrice: true } },
          payments: { select: { status: true, gateway: true } },
        },
      }),
      this.prisma.order.count({ where: where as Prisma.OrderWhereInput }),
    ]);

    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getStats() {
    const [totalRevenue, totalOrders, pendingOrders, monthlyRevenue] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return { totalRevenue, totalOrders, pendingOrders, monthlyRevenue };
  }
}

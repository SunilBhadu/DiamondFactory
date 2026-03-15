import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../database/prisma.service';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CART_TTL = 7 * 24 * 60 * 60; // 7 days

export class CartItemDto {
  @ApiProperty({ enum: ['DIAMOND', 'RING', 'RING_WITH_DIAMOND', 'JEWELRY'] })
  @IsEnum(['DIAMOND', 'RING', 'RING_WITH_DIAMOND', 'JEWELRY'])
  itemType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diamondId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ringSettingId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metalType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(15)
  ringSizeUs?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  engravingText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  engravingFont?: string;
}

export interface CartItem extends CartItemDto {
  id: string;
  addedAt: string;
  diamondSnapshot?: {
    stockId: string;
    shape: string;
    caratWeight: number;
    color: string;
    clarity: string;
    cut?: string;
    priceInr: number;
    imageUrl?: string;
  };
  ringSnapshot?: {
    name: string;
    style: string;
    priceInr: number;
    imageUrl?: string;
  };
  totalPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private redis: RedisService,
    private prisma: PrismaService
  ) {}

  private cartKey(userId: string): string {
    return `cart:${userId}`;
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.redis.get<Cart>(this.cartKey(userId));
    return (
      cart ?? {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      }
    );
  }

  async addItem(userId: string, dto: CartItemDto): Promise<Cart> {
    const cart = await this.getCart(userId);

    // Validate diamond if adding
    let diamondSnapshot: CartItem['diamondSnapshot'] | undefined;
    let ringSnapshot: CartItem['ringSnapshot'] | undefined;
    let totalPrice = 0;

    if (dto.diamondId) {
      const diamond = await this.prisma.diamond.findUnique({
        where: { id: dto.diamondId },
        include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
      });

      if (!diamond) throw new NotFoundException('Diamond not found');
      if (!diamond.isAvailable) throw new BadRequestException('Diamond is no longer available');

      diamondSnapshot = {
        stockId: diamond.stockId ?? diamond.id,
        shape: diamond.shape,
        caratWeight: Number(diamond.caratWeight),
        color: diamond.color,
        clarity: diamond.clarity,
        cut: diamond.cut ?? undefined,
        priceInr: Number(diamond.priceInr),
        imageUrl: diamond.images[0]?.url,
      };
      totalPrice += Number(diamond.priceInr);
    }

    if (dto.ringSettingId) {
      const ring = await this.prisma.ringSetting.findUnique({
        where: { id: dto.ringSettingId },
        include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
      });

      if (!ring) throw new NotFoundException('Ring setting not found');
      if (!ring.isAvailable) throw new BadRequestException('Ring setting is no longer available');

      ringSnapshot = {
        name: ring.name,
        style: ring.style,
        priceInr: Number(ring.basePrice),
        imageUrl: ring.images[0]?.url,
      };
      totalPrice += Number(ring.basePrice);
    }

    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...dto,
      addedAt: new Date().toISOString(),
      diamondSnapshot,
      ringSnapshot,
      totalPrice,
    };

    cart.items.push(newItem);
    cart.updatedAt = new Date().toISOString();

    await this.redis.setEx(this.cartKey(userId), CART_TTL, cart);
    return cart;
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.updatedAt = new Date().toISOString();
    await this.redis.setEx(this.cartKey(userId), CART_TTL, cart);
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.redis.del(this.cartKey(userId));
  }

  async validateCart(userId: string): Promise<{
    valid: boolean;
    issues: string[];
    cart: Cart;
  }> {
    const cart = await this.getCart(userId);
    const issues: string[] = [];

    for (const item of cart.items) {
      if (item.diamondId) {
        const diamond = await this.prisma.diamond.findUnique({
          where: { id: item.diamondId },
          select: { isAvailable: true, priceInr: true, stockId: true },
        });

        if (!diamond || !diamond.isAvailable) {
          issues.push(
            `Diamond ${item.diamondSnapshot?.stockId ?? item.diamondId} is no longer available`
          );
        } else if (Number(diamond.priceInr) !== item.diamondSnapshot?.priceInr) {
          issues.push(
            `Price changed for diamond ${item.diamondSnapshot?.stockId}: was ₹${item.diamondSnapshot?.priceInr?.toLocaleString('en-IN')}, now ₹${Number(diamond.priceInr).toLocaleString('en-IN')}`
          );
          // Update snapshot price
          if (item.diamondSnapshot) {
            item.diamondSnapshot.priceInr = Number(diamond.priceInr);
            item.totalPrice = Number(diamond.priceInr) + (item.ringSnapshot?.priceInr ?? 0);
          }
        }
      }

      if (item.ringSettingId) {
        const ring = await this.prisma.ringSetting.findUnique({
          where: { id: item.ringSettingId },
          select: { isAvailable: true, basePrice: true },
        });

        if (!ring || !ring.isAvailable) {
          issues.push(
            `Ring setting ${item.ringSnapshot?.name ?? item.ringSettingId} is no longer available`
          );
        }
      }
    }

    // Save updated cart with fresh prices
    if (issues.length > 0) {
      cart.updatedAt = new Date().toISOString();
      await this.redis.setEx(this.cartKey(userId), CART_TTL, cart);
    }

    return { valid: issues.length === 0, issues, cart };
  }

  async saveSnapshot(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    if (!cart.items.length) return;

    await this.prisma.cartSnapshot.create({
      data: {
        userId,
        cartData: cart as object,
        totalAmount: cart.items.reduce((sum, i) => sum + i.totalPrice, 0),
      },
    });
  }

  async mergeGuestCart(userId: string, guestItems: CartItemDto[]): Promise<Cart> {
    const cart = await this.getCart(userId);

    for (const guestItem of guestItems) {
      const alreadyInCart = cart.items.some(
        (item) =>
          item.diamondId === guestItem.diamondId && item.ringSettingId === guestItem.ringSettingId
      );

      if (!alreadyInCart) {
        try {
          await this.addItem(userId, guestItem);
        } catch (error) {
          this.logger.warn(`Failed to merge guest cart item: ${JSON.stringify(guestItem)}`, error);
        }
      }
    }

    return this.getCart(userId);
  }

  async applyCoupon(
    userId: string,
    couponCode: string
  ): Promise<{ cart: Cart; discount: number; message: string }> {
    const cart = await this.getCart(userId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new BadRequestException('Coupon is inactive');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount for this coupon is ₹${Number(coupon.minOrderAmount).toLocaleString('en-IN')}`
      );
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round(subtotal * (Number(coupon.discountValue) / 100));
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, Number(coupon.maxDiscountAmount));
      }
    } else {
      // FLAT discount
      discount = Math.min(Number(coupon.discountValue), subtotal);
    }

    // Store coupon info on the cart in Redis
    const enrichedCart: Cart & { couponCode?: string; discount?: number } = {
      ...cart,
      couponCode,
      discount,
      updatedAt: new Date().toISOString(),
    } as any;

    await this.redis.setEx(this.cartKey(userId), CART_TTL, enrichedCart);

    return {
      cart: enrichedCart,
      discount,
      message: `Coupon applied! You save ₹${discount.toLocaleString('en-IN')}`,
    };
  }

  async removeCoupon(userId: string): Promise<Cart> {
    const cart = (await this.getCart(userId)) as any;
    delete cart.couponCode;
    delete cart.discount;
    cart.updatedAt = new Date().toISOString();
    await this.redis.setEx(this.cartKey(userId), CART_TTL, cart);
    return cart;
  }

  getCartTotals(cart: Cart & { discount?: number }): {
    subtotal: number;
    discount: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
  } {
    const subtotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    const discount = cart.discount ?? 0;
    const taxableAmount = subtotal - discount;
    // GST 3% on jewelry/diamonds
    const taxAmount = Math.round(taxableAmount * 0.03);
    // Free shipping above ₹50,000
    const shippingAmount = subtotal >= 50_000 ? 0 : 499;
    const total = taxableAmount + taxAmount + shippingAmount;

    return { subtotal, discount, taxAmount, shippingAmount, total };
  }
}

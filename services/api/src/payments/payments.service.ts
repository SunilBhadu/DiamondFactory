import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { DiamondsService } from '../diamonds/diamonds.service';

// Razorpay types (using require for CommonJS module)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay') as {
  new (options: { key_id: string; key_secret: string }): {
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt: string;
        notes: Record<string, string>;
      }): Promise<{ id: string; amount: number; currency: string }>;
    };
  };
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;
  private razorpay: InstanceType<typeof Razorpay>;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private configService: ConfigService,
    private diamondsService: DiamondsService
  ) {
    this.stripe = new Stripe(this.configService.get<string>('stripe.secretKey') ?? '', {
      apiVersion: '2025-02-24.acacia',
    });

    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('razorpay.keyId') ?? '',
      key_secret: this.configService.get<string>('razorpay.keySecret') ?? '',
    });
  }

  async createStripePaymentIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        paymentGateway: true,
        paymentStatus: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order is already paid');
    if (order.paymentGateway !== 'STRIPE')
      throw new BadRequestException('Order is set to Razorpay gateway');

    // Amount in paise (INR smallest unit)
    const amount = Math.round(Number(order.totalAmount) * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        orderId,
        orderNumber: order.orderNumber,
        userId,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Record the payment attempt
    await this.prisma.payment.create({
      data: {
        orderId,
        gateway: 'STRIPE',
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
        gatewayPaymentId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      publishableKey: this.configService.get<string>('stripe.publishableKey'),
    };
  }

  async createRazorpayOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        paymentGateway: true,
        paymentStatus: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order is already paid');
    if (order.paymentGateway !== 'RAZORPAY')
      throw new BadRequestException('Order is set to Stripe gateway');

    // Amount in paise
    const amount = Math.round(Number(order.totalAmount) * 100);

    const razorpayOrder = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId, userId },
    });

    await this.prisma.payment.create({
      data: {
        orderId,
        gateway: 'RAZORPAY',
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
        gatewayPaymentId: razorpayOrder.id,
      },
    });

    return {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: this.configService.get<string>('razorpay.keyId'),
    };
  }

  async handleStripeWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret') ?? '';

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error('Stripe webhook signature verification failed', err);
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleStripePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handleStripePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        this.logger.log(`Unhandled Stripe event: ${event.type}`);
    }
  }

  private async handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { orderId } = paymentIntent.metadata;

    await this.prisma.payment.updateMany({
      where: { gatewayPaymentId: paymentIntent.id },
      data: { status: 'PAID', paidAt: new Date() },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    });

    // Mark diamonds as sold
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { select: { diamondId: true } } },
    });

    if (order) {
      for (const item of order.items) {
        if (item.diamondId) {
          await this.prisma.diamond.update({
            where: { id: item.diamondId },
            data: { isAvailable: false, isSold: true },
          });
          await this.diamondsService.releaseReservation(item.diamondId);
        }
      }
    }

    this.logger.log(`Stripe payment succeeded for order ${orderId}`);
  }

  private async handleStripePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { orderId } = paymentIntent.metadata;

    await this.prisma.payment.updateMany({
      where: { gatewayPaymentId: paymentIntent.id },
      data: { status: 'FAILED' },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'FAILED' },
    });

    this.logger.warn(`Stripe payment failed for order ${orderId}`);
  }

  async verifyRazorpayPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const keySecret = this.configService.get<string>('razorpay.keySecret') ?? '';

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      this.logger.error('Razorpay signature mismatch');
      throw new BadRequestException('Payment verification failed: invalid signature');
    }

    // Verify order belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { select: { diamondId: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');

    await this.prisma.payment.updateMany({
      where: { orderId, status: 'PENDING' },
      data: {
        status: 'PAID',
        gatewayPaymentId: razorpayPaymentId,
        paidAt: new Date(),
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    });

    for (const item of order.items) {
      if (item.diamondId) {
        await this.prisma.diamond.update({
          where: { id: item.diamondId },
          data: { isAvailable: false, isSold: true },
        });
        await this.diamondsService.releaseReservation(item.diamondId);
      }
    }

    this.logger.log(`Razorpay payment verified for order ${orderId}`);
    return { success: true, message: 'Payment verified successfully' };
  }

  async getPaymentStatus(orderId: string, userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { orderId, order: { userId } },
      orderBy: { createdAt: 'desc' },
    });

    if (!payments.length) throw new NotFoundException('No payment records found');
    return payments;
  }
}

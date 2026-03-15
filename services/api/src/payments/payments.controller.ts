import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Req,
  UseGuards,
  RawBodyRequest,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class VerifyRazorpayDto {
  @ApiProperty()
  @IsString()
  razorpayOrderId!: string;

  @ApiProperty()
  @IsString()
  razorpayPaymentId!: string;

  @ApiProperty()
  @IsString()
  razorpaySignature!: string;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stripe/create-intent/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe PaymentIntent for an order' })
  createStripeIntent(@Param('orderId') orderId: string, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.createStripePaymentIntent(orderId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('razorpay/create-order/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order for payment' })
  createRazorpayOrder(@Param('orderId') orderId: string, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.createRazorpayOrder(orderId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('razorpay/verify/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  verifyRazorpay(
    @Param('orderId') orderId: string,
    @Body() dto: VerifyRazorpayDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.paymentsService.verifyRazorpayPayment(
      orderId,
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
      user.sub
    );
  }

  @Public()
  @Post('stripe/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new Error('No raw body available');
    }
    await this.paymentsService.handleStripeWebhook(rawBody, signature);
    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status for an order' })
  getStatus(@Param('orderId') orderId: string, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.getPaymentStatus(orderId, user.sub);
  }
}

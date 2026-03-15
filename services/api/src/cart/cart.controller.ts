import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CartService, CartItemDto } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

class ApplyCouponDto {
  @ApiProperty({ example: 'WELCOME10' })
  @IsString()
  couponCode!: string;
}

class UpdateQuantityDto {
  @ApiProperty({ minimum: 1, maximum: 99 })
  quantity!: number;
}

class MergeGuestCartDto {
  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];
}

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Get('totals')
  @ApiOperation({ summary: 'Get cart price breakdown' })
  async getCartTotals(@CurrentUser() user: JwtPayload) {
    const cart = (await this.cartService.getCart(user.sub)) as any;
    return this.cartService.getCartTotals(cart);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: CartItemDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@CurrentUser() user: JwtPayload, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.sub, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.sub);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate cart items (availability + price check)' })
  validateCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.validateCart(user.sub);
  }

  @Post('coupon')
  @ApiOperation({ summary: 'Apply coupon code to cart' })
  applyCoupon(@CurrentUser() user: JwtPayload, @Body() dto: ApplyCouponDto) {
    return this.cartService.applyCoupon(user.sub, dto.couponCode);
  }

  @Delete('coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  removeCoupon(@CurrentUser() user: JwtPayload) {
    return this.cartService.removeCoupon(user.sub);
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart items into authenticated user cart' })
  mergeGuestCart(@CurrentUser() user: JwtPayload, @Body() dto: MergeGuestCartDto) {
    return this.cartService.mergeGuestCart(user.sub, dto.items);
  }

  @Post('snapshot')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Persist cart snapshot to DB for abandoned cart recovery' })
  saveSnapshot(@CurrentUser() user: JwtPayload) {
    return this.cartService.saveSnapshot(user.sub);
  }
}

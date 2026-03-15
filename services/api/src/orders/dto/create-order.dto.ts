import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentGatewayDto {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
}

export class OrderItemDto {
  @ApiProperty({ enum: ['DIAMOND', 'RING', 'RING_WITH_DIAMOND', 'JEWELRY'] })
  @IsEnum(['DIAMOND', 'RING', 'RING_WITH_DIAMOND', 'JEWELRY'])
  itemType!: string;

  @ApiPropertyOptional({ description: 'Diamond ID if ordering a loose diamond' })
  @IsOptional()
  @IsString()
  diamondId?: string;

  @ApiPropertyOptional({ description: 'Ring setting product ID' })
  @IsOptional()
  @IsString()
  ringSettingId?: string;

  @ApiProperty({ description: 'Unit price in INR (paise)' })
  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Metal type for ring' })
  @IsOptional()
  @IsString()
  metalType?: string;

  @ApiPropertyOptional({ description: 'Ring size (US)' })
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(15)
  ringSizeUs?: number;

  @ApiPropertyOptional({ description: 'Engraving text (max 30 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  engravingText?: string;

  @ApiPropertyOptional({ description: 'Engraving font style' })
  @IsOptional()
  @IsString()
  engravingFont?: string;
}

export class ShippingAddressDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsString()
  addressLine1!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsString()
  postalCode!: string;

  @ApiProperty({ default: 'India' })
  @IsString()
  country!: string;

  @ApiProperty()
  @IsString()
  phone!: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @ApiPropertyOptional({ description: 'Shipping method ID' })
  @IsOptional()
  @IsString()
  shippingMethodId?: string;

  @ApiPropertyOptional({ description: 'Coupon/promo code' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  couponCode?: string;

  @ApiProperty({ enum: PaymentGatewayDto })
  @IsEnum(PaymentGatewayDto)
  paymentGateway!: PaymentGatewayDto;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

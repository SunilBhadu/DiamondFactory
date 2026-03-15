import type { UserAddress } from './user.types';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentGateway = 'stripe' | 'razorpay' | 'paypal';

export type ItemType = 'diamond' | 'setting' | 'ring' | 'jewelry' | 'gift_card';

export interface OrderItem {
  id: string;
  orderId: string;
  itemType: ItemType;
  diamondId?: string;
  settingId?: string;
  productId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  engravingText?: string;
  engravingFont?: string;
  customizations?: Record<string, unknown>;
  snapshot?: Record<string, unknown>;
}

export interface Payment {
  id: string;
  orderId: string;
  gateway: PaymentGateway;
  gatewayPaymentId?: string;
  gatewayIntentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  methodDetails?: Record<string, unknown>;
  riskScore?: number;
  riskLevel?: string;
  failureReason?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  couponCode?: string;
  shippingAddressId?: string;
  shippingAddressSnapshot?: Record<string, unknown>;
  billingAddressSnapshot?: Record<string, unknown>;
  notes?: string;
  giftMessage?: string;
  isGift: boolean;
  estimatedDelivery?: Date;
  fulfilledAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  metadata?: Record<string, unknown>;
  items: OrderItem[];
  payments?: Payment[];
  shippingAddress?: UserAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemDto {
  itemType: ItemType;
  diamondId?: string;
  settingId?: string;
  productId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  engravingText?: string;
  engravingFont?: string;
  customizations?: Record<string, unknown>;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  shippingAddressId: string;
  billingAddressId?: string;
  couponCode?: string;
  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  currency?: string;
}

export interface CartItem {
  id: string;
  itemType: ItemType;
  diamondId?: string;
  settingId?: string;
  productId?: string;
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  engravingText?: string;
  engravingFont?: string;
  metalType?: string;
  ringSize?: number;
  customizations?: Record<string, unknown>;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  updatedAt: Date;
}

export interface PriceBreakdown {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  taxRate: number;
  shippingAmount: number;
  total: number;
  currency: string;
  couponCode?: string;
  couponDescription?: string;
}

import { get, post, del } from '@/lib/api-client';
import type { CartItem, PriceBreakdown, RingBuilderConfig } from '@diamond-factory/types';

export interface ValidateRingConfigResponse {
  valid: boolean;
  pricing: PriceBreakdown;
  errors?: string[];
}

export interface ServerCart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
}

export interface AddCartItemDto {
  itemType: 'DIAMOND' | 'SETTING' | 'RING' | 'JEWELRY';
  diamondId?: string;
  settingId?: string;
  quantity?: number;
}

export const cartApi = {
  /** Fetch the current user's server-side cart */
  async getCart(): Promise<ServerCart> {
    return get<ServerCart>('/cart');
  },

  /** Get price totals for the current cart */
  async getCartTotals(): Promise<PriceBreakdown> {
    return get<PriceBreakdown>('/cart/totals');
  },

  /** Add an item to the server-side Redis cart */
  async addItem(dto: AddCartItemDto): Promise<ServerCart> {
    return post<ServerCart>('/cart/items', dto);
  },

  /** Remove an item from the cart by its cart item ID */
  async removeItem(itemId: string): Promise<ServerCart> {
    return del<ServerCart>(`/cart/items/${itemId}`);
  },

  /** Clear all items from the cart */
  async clearCart(): Promise<void> {
    return del<void>('/cart');
  },

  /**
   * Validate a ring builder config before adding to cart
   * Returns whether the combination is valid and the price breakdown
   */
  async validateRingConfig(config: RingBuilderConfig): Promise<ValidateRingConfigResponse> {
    return post<ValidateRingConfigResponse>('/cart/ring-builder/validate', config);
  },

  /**
   * Add a ring builder result to the cart
   */
  async addRingToCart(config: RingBuilderConfig): Promise<CartItem> {
    return post<CartItem>('/cart/ring-builder/add', config);
  },
};

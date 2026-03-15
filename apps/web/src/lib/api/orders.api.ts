import { get, post } from '@/lib/api-client';
import type { Order, CreateOrderDto } from '@diamond-factory/types';

export const ordersApi = {
  /**
   * Get all orders for the current user
   */
  async getOrders(): Promise<Order[]> {
    return get<Order[]>('/orders');
  },

  /**
   * Get a single order by ID
   */
  async getOrder(id: string): Promise<Order> {
    return get<Order>(`/orders/${id}`);
  },

  /**
   * Create a new order
   */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    return post<Order>('/orders', dto);
  },

  /**
   * Cancel an order
   */
  async cancelOrder(id: string, reason: string): Promise<Order> {
    return post<Order>(`/orders/${id}/cancel`, { reason });
  },
};

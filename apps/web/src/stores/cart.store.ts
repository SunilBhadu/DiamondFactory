import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@diamond-factory/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discount: number;
  itemCount: number;
  subtotal: number;
  total: number;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

type CartStore = CartState & CartActions;

function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function computeItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discount: 0,
      itemCount: 0,
      subtotal: 0,
      total: 0,

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        let newItems: CartItem[];

        if (existing) {
          newItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...items, item];
        }

        const subtotal = computeSubtotal(newItems);
        const discount = get().discount;

        set({
          items: newItems,
          itemCount: computeItemCount(newItems),
          subtotal,
          total: subtotal - discount,
        });
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        const subtotal = computeSubtotal(newItems);
        const discount = get().discount;

        set({
          items: newItems,
          itemCount: computeItemCount(newItems),
          subtotal,
          total: subtotal - discount,
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const newItems = get().items.map((i) => (i.id === id ? { ...i, quantity } : i));
        const subtotal = computeSubtotal(newItems);
        const discount = get().discount;

        set({
          items: newItems,
          itemCount: computeItemCount(newItems),
          subtotal,
          total: subtotal - discount,
        });
      },

      clearCart: () =>
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          total: 0,
          couponCode: null,
          discount: 0,
        }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code) => {
        // Simple coupon logic
        const upper = code.toUpperCase().trim();
        let discount = 0;
        const subtotal = get().subtotal;

        if (upper === 'WELCOME10') {
          discount = Math.round(subtotal * 0.1);
        } else if (upper === 'DIAMOND500') {
          discount = 500;
        } else if (upper === 'LUXURY15') {
          discount = Math.round(subtotal * 0.15);
        }

        if (discount > 0) {
          set({
            couponCode: upper,
            discount,
            total: subtotal - discount,
          });
        }
      },

      removeCoupon: () => {
        const subtotal = get().subtotal;
        set({ couponCode: null, discount: 0, total: subtotal });
      },
    }),
    {
      name: 'diamond-factory-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        total: state.total,
      }),
    }
  )
);

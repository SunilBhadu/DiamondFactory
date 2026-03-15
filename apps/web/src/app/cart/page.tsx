'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, Shield } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    couponCode,
    discount,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const gst = subtotal * 0.03;
  const shipping = subtotal >= 50000 ? 0 : 999;

  if (items.length === 0) {
    return (
      <div className="bg-charcoal-50 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="text-charcoal-300 mx-auto mb-6 h-20 w-20" />
          <h1 className="font-display text-charcoal-900 mb-4 text-3xl font-bold">
            Your cart is empty
          </h1>
          <p className="text-charcoal-500 mx-auto mb-8 max-w-sm">
            Discover our collection of certified diamonds and fine jewelry.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/diamonds"
              className="bg-gold-500 hover:bg-gold-600 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              Browse Diamonds
            </Link>
            <Link
              href="/engagement-rings"
              className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 inline-flex items-center gap-2 rounded-full border-2 px-8 py-3 font-semibold transition-colors"
            >
              Engagement Rings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-50 min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="font-display text-charcoal-900 mb-2 text-3xl font-bold">Shopping Cart</h1>
        <p className="text-charcoal-500 mb-8">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="shadow-card rounded-2xl bg-white p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="bg-charcoal-100 relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="clip-diamond via-diamond-200 to-diamond-400 h-10 w-10 bg-gradient-to-br from-white" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-charcoal-900 font-semibold">{item.name}</h3>
                        {item.description && (
                          <p className="text-charcoal-500 mt-0.5 text-sm">{item.description}</p>
                        )}
                        {item.metalType && (
                          <p className="text-charcoal-400 mt-1 text-xs">Metal: {item.metalType}</p>
                        )}
                        {item.ringSize && (
                          <p className="text-charcoal-400 text-xs">Ring Size: US {item.ringSize}</p>
                        )}
                        {item.engravingText && (
                          <p className="text-gold-600 mt-1 text-xs italic">
                            Engraving: "{item.engravingText}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-charcoal-400 shrink-0 p-1 transition-colors hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="border-charcoal-300 hover:border-gold-500 hover:bg-gold-50 flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border-charcoal-300 hover:border-gold-500 hover:bg-gold-50 flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-charcoal-900 font-bold">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-charcoal-400 text-xs">
                            {formatPrice(item.unitPrice)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <div className="pt-4">
              <Link
                href="/diamonds"
                className="text-gold-600 hover:text-gold-700 flex items-center gap-2 font-medium transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="shadow-card sticky top-24 rounded-2xl bg-white p-6">
              <h2 className="font-display text-charcoal-900 mb-6 text-lg font-bold">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="text-charcoal-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      defaultValue={couponCode || ''}
                      className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm transition-colors focus:outline-none"
                      id="coupon-input"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const input = document.getElementById('coupon-input') as HTMLInputElement;
                      if (input?.value) applyCoupon(input.value);
                    }}
                    className="bg-charcoal-900 hover:bg-charcoal-800 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600">
                      "{couponCode}" applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-charcoal-400 text-xs transition-colors hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="mb-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal-500">GST (3%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600' : ''}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-charcoal-400 text-xs">
                    Add {formatPrice(50000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-charcoal-200 flex justify-between border-t pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-gold-600">
                    {formatPrice(subtotal + gst + shipping - discount)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="bg-gold-500 hover:bg-gold-600 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white transition-colors"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust badges */}
              <div className="text-charcoal-400 mt-4 flex items-center justify-center gap-1 text-xs">
                <Shield className="h-3 w-3" />
                <span>Secure checkout · 256-bit SSL encryption</span>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Stripe'].map((brand) => (
                  <span
                    key={brand}
                    className="border-charcoal-200 text-charcoal-400 rounded border px-2 py-1 text-xs"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const orders = [
  {
    id: 'DF-2025-001',
    orderNumber: 'DF-2025-001',
    date: 'January 10, 2025',
    items: '1.01ct Round Diamond Ring (Aria Solitaire · Platinum · Size 6)',
    total: '₹3,45,000',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    trackingUrl: '#',
  },
  {
    id: 'DF-2024-089',
    orderNumber: 'DF-2024-089',
    date: 'December 22, 2024',
    items: '0.75ct Oval Lab Grown Diamond',
    total: '₹1,25,000',
    status: 'Shipped',
    statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    trackingUrl: '#',
  },
  {
    id: 'DF-2024-034',
    orderNumber: 'DF-2024-034',
    date: 'September 5, 2024',
    items: '0.50ct Princess Diamond Earrings (Pair)',
    total: '₹85,000',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    trackingUrl: '#',
  },
];

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-gold-500 h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-charcoal-50 min-h-screen py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-charcoal-400 hover:text-charcoal-700 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="text-charcoal-300 h-4 w-4" />
          <span className="text-charcoal-900 font-semibold">My Orders</span>
        </div>

        <h1 className="font-display text-charcoal-900 mb-8 text-3xl font-bold">My Orders</h1>

        {orders.length === 0 ? (
          <div className="shadow-card rounded-2xl bg-white p-16 text-center">
            <Package className="text-charcoal-300 mx-auto mb-4 h-16 w-16" />
            <h2 className="font-display text-charcoal-900 mb-2 text-xl font-bold">No orders yet</h2>
            <p className="text-charcoal-500 mb-8">When you place an order, it will appear here.</p>
            <Link
              href="/diamonds"
              className="bg-gold-500 hover:bg-gold-600 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="shadow-card overflow-hidden rounded-2xl bg-white">
                {/* Order header */}
                <div className="bg-charcoal-50 border-charcoal-100 flex flex-wrap items-center justify-between gap-4 border-b p-6">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-charcoal-400 mb-1 text-xs tracking-wide uppercase">
                        Order
                      </p>
                      <p className="text-charcoal-900 text-sm font-bold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-charcoal-400 mb-1 text-xs tracking-wide uppercase">Date</p>
                      <p className="text-charcoal-900 text-sm font-medium">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-charcoal-400 mb-1 text-xs tracking-wide uppercase">
                        Total
                      </p>
                      <p className="text-charcoal-900 text-sm font-bold">{order.total}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order items */}
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-charcoal-100 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg">
                      <Package className="text-charcoal-400 h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-charcoal-900 text-sm font-medium">{order.items}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 px-6 pb-6">
                  <Link
                    href={`/orders/${order.id}`}
                    className="border-charcoal-300 hover:border-gold-500 text-charcoal-700 hover:text-gold-600 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  >
                    View Details <ChevronRight className="h-3 w-3" />
                  </Link>
                  {order.status === 'Shipped' && (
                    <a
                      href={order.trackingUrl}
                      className="bg-gold-500 hover:bg-gold-600 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      Track Package <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {order.status === 'Delivered' && (
                    <button className="border-charcoal-300 hover:border-gold-500 text-charcoal-700 hover:text-gold-600 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

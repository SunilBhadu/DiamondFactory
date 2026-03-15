import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Track Your Order | Diamond Factory',
  description: 'Track your Diamond Factory order in real time.',
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Track Your Order</h1>
        <p className="text-charcoal-300 text-lg">
          Enter your order number or email to get real-time shipping updates.
        </p>
      </div>

      <div className="container mx-auto py-20">
        <div className="mx-auto max-w-lg">
          <div className="bg-charcoal-50 rounded-2xl p-8">
            <div className="mb-6 space-y-4">
              <div>
                <label className="text-charcoal-700 mb-1 block text-sm font-medium">
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DF-2026-001234"
                  className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-charcoal-700 mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="The email used to place the order"
                  className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
            <button className="bg-gold-500 hover:bg-gold-600 w-full rounded-full py-3 font-semibold text-white transition-colors">
              Track Order
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-charcoal-500 text-sm">
              Logged in?{' '}
              <Link href="/orders" className="text-gold-600 underline">
                View all your orders →
              </Link>
            </p>
            <p className="text-charcoal-500 mt-2 text-sm">
              Need help?{' '}
              <Link href="/contact" className="text-gold-600 underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

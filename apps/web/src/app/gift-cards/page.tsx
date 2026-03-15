import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gift Cards | Diamond Factory',
  description: 'Give the gift of choice with a Diamond Factory gift card. Available in any amount.',
};

const amounts = [5000, 10000, 25000, 50000, 100000, 200000];

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">Gift Cards</h1>
        <p className="text-charcoal-300 mx-auto max-w-xl text-lg">
          The perfect gift for every occasion. Let them choose the diamond of their dreams.
        </p>
      </div>

      <div className="container mx-auto py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-charcoal-900 mb-8 text-2xl font-bold text-center">
            Select an Amount
          </h2>
          <div className="mb-10 grid grid-cols-3 gap-4">
            {amounts.map((amount) => (
              <button
                key={amount}
                className="border-charcoal-200 hover:border-gold-500 hover:text-gold-600 rounded-xl border-2 py-5 text-lg font-semibold transition-colors"
              >
                ₹{(amount / 100).toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="border-charcoal-200 rounded-2xl border p-8">
            <h3 className="text-charcoal-900 mb-4 font-semibold">Custom Amount</h3>
            <input
              type="number"
              placeholder="Enter amount in ₹"
              className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-charcoal-500 mb-6 text-sm">
              Gift cards are delivered by email and never expire. Valid on all diamonds, rings, and
              jewelry.
            </p>
            <Link
              href="/contact"
              className="bg-gold-500 hover:bg-gold-600 inline-block rounded-full px-10 py-4 font-semibold text-white transition-colors"
            >
              Purchase Gift Card
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

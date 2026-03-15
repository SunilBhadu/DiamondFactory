import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Diamond Factory',
  description: '30-day hassle-free returns on all Diamond Factory orders. Learn how to start a return.',
};

const steps = [
  {
    step: '01',
    title: 'Contact Us',
    desc: 'Email returns@diamondfactory.in or call +91 261 234 5678 within 30 days of delivery.',
  },
  {
    step: '02',
    title: 'Get a Return Label',
    desc: 'We\'ll email you a prepaid FedEx shipping label. No courier costs for you.',
  },
  {
    step: '03',
    title: 'Pack Securely',
    desc: 'Include the original packaging, the diamond certificate, and all accessories. Use the original box if possible.',
  },
  {
    step: '04',
    title: 'Ship & Track',
    desc: 'Drop off at any FedEx location. Your parcel is fully insured during transit.',
  },
  {
    step: '05',
    title: 'Refund Issued',
    desc: 'Once we receive and inspect the item (1–2 business days), your full refund is processed within 5–7 business days.',
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Returns & Exchanges</h1>
        <p className="text-charcoal-300 text-lg">
          30-day hassle-free returns. No questions asked.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Policy highlights */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            { emoji: '📅', title: '30-Day Window', desc: 'Return any item within 30 days of delivery for a full refund.' },
            { emoji: '🚚', title: 'Free Returns', desc: 'We cover all return shipping costs with a prepaid label.' },
            { emoji: '💳', title: 'Full Refund', desc: 'Refunds are issued to your original payment method — no store credit required.' },
          ].map((item) => (
            <div key={item.title} className="bg-charcoal-50 rounded-2xl p-6 text-center">
              <div className="mb-3 text-4xl">{item.emoji}</div>
              <h3 className="text-charcoal-900 mb-2 font-semibold">{item.title}</h3>
              <p className="text-charcoal-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <h2 className="font-display text-charcoal-900 mb-8 text-2xl font-bold">
          How to Return
        </h2>
        <div className="mb-16 space-y-6">
          {steps.map((s) => (
            <div key={s.step} className="border-charcoal-200 flex gap-6 rounded-xl border p-5">
              <span className="font-display text-gold-500 mt-0.5 text-2xl font-bold shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="text-charcoal-900 mb-1 font-semibold">{s.title}</h3>
                <p className="text-charcoal-500 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="border-charcoal-200 rounded-2xl border p-8">
          <h2 className="font-display text-charcoal-900 mb-4 text-xl font-bold">
            Return Conditions
          </h2>
          <ul className="text-charcoal-600 space-y-2 text-sm">
            {[
              'Item must be in original, unworn condition with no signs of damage or alteration.',
              'Original diamond certificate (GIA/IGI) must be included — a ₹15,000 fee applies for lost certificates.',
              'Custom-engraved or resized rings cannot be returned (but may be exchanged — contact us).',
              'Sale items are final sale and non-returnable.',
            ].map((cond) => (
              <li key={cond} className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                {cond}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="bg-gold-500 hover:bg-gold-600 inline-block rounded-full px-10 py-4 font-semibold text-white transition-colors"
          >
            Start a Return
          </Link>
        </div>
      </div>
    </div>
  );
}

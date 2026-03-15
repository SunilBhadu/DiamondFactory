import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lifetime Warranty | Diamond Factory',
  description:
    'Every Diamond Factory diamond and ring is backed by our lifetime warranty. Learn what\'s covered.',
};

const covered = [
  'Diamond replacement if the stone chips or breaks under normal wear conditions',
  'Prong repair and retipping to prevent stone loss',
  'Ring shank repair for cracks or breaks',
  'Rhodium re-plating for white gold settings (annually)',
  'Annual cleaning and polishing at our Surat workshop',
  'Certificate replacement service (fee applies for lost certificates)',
];

const notCovered = [
  'Loss or theft of the diamond (recommend jewellery insurance)',
  'Intentional damage or misuse',
  'Normal wear and scratching of metal surfaces',
  'Damage from chemicals, perfumes, or chlorine',
  'Third-party modifications or repairs not authorised by Diamond Factory',
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Lifetime Warranty</h1>
        <p className="text-charcoal-300 mx-auto max-w-xl text-lg">
          Every diamond and piece of jewellery from Diamond Factory is protected by our
          comprehensive lifetime warranty — because a diamond is forever.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Highlights */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            { emoji: '♾️', title: 'Lifetime', desc: 'The warranty lasts for the lifetime of the original owner.' },
            { emoji: '🏪', title: 'In-store Service', desc: 'Bring your piece to our Surat workshop for free cleaning and inspection every year.' },
            { emoji: '🔐', title: 'Registered', desc: 'Warranty is activated on purchase and linked to your account and certificate number.' },
          ].map((item) => (
            <div key={item.title} className="bg-charcoal-50 rounded-2xl p-6 text-center">
              <div className="mb-3 text-4xl">{item.emoji}</div>
              <h3 className="text-charcoal-900 mb-2 font-semibold">{item.title}</h3>
              <p className="text-charcoal-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* What's covered */}
          <div className="border-charcoal-200 rounded-2xl border p-8">
            <h2 className="font-display text-charcoal-900 mb-6 text-xl font-bold">
              ✅ What&apos;s Covered
            </h2>
            <ul className="space-y-3">
              {covered.map((item) => (
                <li key={item} className="text-charcoal-600 flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What's not covered */}
          <div className="bg-charcoal-50 rounded-2xl p-8">
            <h2 className="font-display text-charcoal-900 mb-6 text-xl font-bold">
              ❌ What&apos;s Not Covered
            </h2>
            <ul className="space-y-3">
              {notCovered.map((item) => (
                <li key={item} className="text-charcoal-600 flex items-start gap-2 text-sm">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claim warranty */}
        <div className="bg-charcoal-950 mt-16 rounded-2xl p-10 text-center text-white">
          <h2 className="font-display mb-4 text-2xl font-bold">Make a Warranty Claim</h2>
          <p className="text-charcoal-300 mb-8 text-sm">
            To initiate a warranty service, contact our support team with your order number and a
            description of the issue. We&apos;ll guide you through the next steps.
          </p>
          <Link
            href="/contact"
            className="bg-gold-500 hover:bg-gold-600 inline-block rounded-full px-10 py-4 font-semibold text-white transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

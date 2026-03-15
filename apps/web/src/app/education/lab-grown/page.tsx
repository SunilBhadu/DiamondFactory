import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lab Grown Diamonds — Real Diamonds, Smarter Value | Diamond Factory',
  description:
    'Lab grown diamonds are chemically, physically, and optically identical to mined diamonds. Learn about the benefits and differences.',
};

const comparisons = [
  { aspect: 'Chemical Composition', natural: 'Pure Carbon (C)', lab: 'Pure Carbon (C)' },
  { aspect: 'Crystal Structure', natural: 'Cubic', lab: 'Cubic' },
  { aspect: 'Refractive Index', natural: '2.417', lab: '2.417' },
  { aspect: 'Hardness (Mohs)', natural: '10', lab: '10' },
  { aspect: 'Certification', natural: 'GIA / IGI / AGS', lab: 'GIA / IGI / AGS' },
  { aspect: 'Origin', natural: 'Earth (1–3 billion years)', lab: 'Laboratory (6–10 weeks)' },
  { aspect: 'Price', natural: 'Market price', lab: '50–80% less' },
  { aspect: 'Environmental Impact', natural: 'Mining required', lab: 'No mining' },
];

export default function LabGrownPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <p className="text-gold-400 mb-3 text-sm font-semibold uppercase tracking-widest">
          Diamond Education
        </p>
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
          Lab Grown Diamonds
        </h1>
        <p className="text-charcoal-300 mx-auto max-w-2xl text-lg">
          Lab grown diamonds are 100% real diamonds — not simulants. They share the same physical,
          chemical, and optical properties as earth-mined diamonds.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Real diamond badge */}
        <div className="border-gold-200 bg-gold-50 mb-12 rounded-2xl border p-8 text-center">
          <h2 className="font-display text-charcoal-900 mb-3 text-2xl font-bold">
            A Lab Grown Diamond IS a Real Diamond
          </h2>
          <p className="text-charcoal-600 mx-auto max-w-2xl">
            The FTC (Federal Trade Commission) and GIA both confirm that lab grown diamonds are
            diamonds. They are NOT cubic zirconia, moissanite, or any other simulant.
          </p>
        </div>

        {/* Comparison table */}
        <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
          Natural vs Lab Grown: Side by Side
        </h2>
        <div className="border-charcoal-200 mb-16 overflow-hidden rounded-2xl border">
          <div className="bg-charcoal-900 grid grid-cols-3 px-6 py-4 text-sm font-semibold text-white">
            <span>Property</span>
            <span className="text-center">Natural Diamond</span>
            <span className="text-center">Lab Grown Diamond</span>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.aspect}
              className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-charcoal-50' : 'bg-white'}`}
            >
              <span className="text-charcoal-700 font-medium">{row.aspect}</span>
              <span className="text-charcoal-600 text-center">{row.natural}</span>
              <span className="text-emerald-700 text-center font-medium">{row.lab}</span>
            </div>
          ))}
        </div>

        {/* How they're made */}
        <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
          How Lab Grown Diamonds Are Made
        </h2>
        <div className="mb-16 grid gap-6 sm:grid-cols-2">
          {[
            {
              name: 'CVD (Chemical Vapor Deposition)',
              description:
                'A diamond seed crystal is placed in a chamber filled with carbon-rich gas. Microwaves ionize the gas, and carbon atoms precipitate onto the seed, growing layer by layer into a diamond.',
            },
            {
              name: 'HPHT (High Pressure High Temperature)',
              description:
                'Mimics the conditions deep in the Earth. A carbon source is subjected to extreme pressure (1.5 million PSI) and heat (2,700°F), causing it to crystallize around a diamond seed.',
            },
          ].map((method) => (
            <div key={method.name} className="border-charcoal-200 rounded-2xl border p-6">
              <h3 className="text-charcoal-900 mb-3 text-lg font-semibold">{method.name}</h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">{method.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-charcoal-950 rounded-2xl p-10 text-center text-white">
          <h2 className="font-display mb-4 text-3xl font-bold">
            Explore Lab Grown Diamonds
          </h2>
          <p className="text-charcoal-300 mb-8">
            Browse our collection of IGI and GIA certified lab grown diamonds — same brilliance,
            better value.
          </p>
          <Link
            href="/diamonds?labGrown=true"
            className="bg-gold-500 hover:bg-gold-600 inline-block rounded-full px-10 py-4 font-semibold text-white transition-colors"
          >
            Shop Lab Grown Diamonds
          </Link>
        </div>
      </div>
    </div>
  );
}

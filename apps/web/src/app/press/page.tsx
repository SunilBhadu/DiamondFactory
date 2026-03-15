import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media | Diamond Factory',
  description:
    'Press releases, media coverage, and brand assets for Diamond Factory Pvt Ltd.',
};

const coverage = [
  {
    outlet: 'Economic Times',
    headline: 'Diamond Factory disrupts India\'s ₹75,000 crore diamond jewellery market',
    date: 'February 2026',
    type: 'Feature',
  },
  {
    outlet: 'YourStory',
    headline: 'How a Surat startup is bringing certified diamonds to India\'s online shoppers',
    date: 'January 2026',
    type: 'Interview',
  },
  {
    outlet: 'Livemint',
    headline: 'Lab grown diamonds see 300% YoY growth as Indian consumers embrace modern gems',
    date: 'December 2025',
    type: 'Feature',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Press & Media</h1>
        <p className="text-charcoal-300 text-lg">
          News and media resources for Diamond Factory Pvt Ltd.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Press contact */}
        <div className="border-gold-200 bg-gold-50 mb-16 rounded-2xl border p-8">
          <h2 className="font-display text-charcoal-900 mb-3 text-2xl font-bold">Press Enquiries</h2>
          <p className="text-charcoal-600 mb-4">
            For press enquiries, interview requests, and high-resolution brand assets, please contact
            our media team.
          </p>
          <a
            href="mailto:press@diamondfactory.in"
            className="text-gold-600 hover:text-gold-700 font-semibold"
          >
            press@diamondfactory.in
          </a>
        </div>

        {/* Coverage */}
        <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">As Seen In</h2>
        <div className="space-y-4">
          {coverage.map((item) => (
            <div
              key={item.headline}
              className="border-charcoal-200 rounded-xl border p-5"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="bg-charcoal-100 text-charcoal-700 rounded px-2 py-0.5 text-xs font-semibold">
                  {item.outlet}
                </span>
                <span className="text-charcoal-400 text-xs">{item.type}</span>
                <span className="text-charcoal-400 text-xs">{item.date}</span>
              </div>
              <p className="text-charcoal-800 font-medium">{item.headline}</p>
            </div>
          ))}
        </div>

        {/* Brand assets note */}
        <div className="bg-charcoal-50 mt-16 rounded-2xl p-8 text-center">
          <h2 className="font-display text-charcoal-900 mb-3 text-xl font-bold">Brand Assets</h2>
          <p className="text-charcoal-600 mb-4 text-sm">
            Download our logo, brand guidelines, and product imagery by contacting our press team.
          </p>
          <a
            href="mailto:press@diamondfactory.in"
            className="bg-charcoal-900 hover:bg-charcoal-700 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white transition-colors"
          >
            Request Brand Kit
          </a>
        </div>
      </div>
    </div>
  );
}

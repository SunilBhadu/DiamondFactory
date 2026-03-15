import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The 4Cs of Diamonds — Cut, Color, Clarity, Carat | Diamond Factory',
  description:
    'Learn about the 4Cs of diamond quality: Cut, Color, Clarity, and Carat weight. Use this guide to choose the perfect certified diamond.',
};

const fourCs = [
  {
    letter: 'C',
    name: 'Cut',
    subtitle: 'The Sparkle Factor',
    description:
      'Cut is widely considered the most important of the 4Cs. It refers to how well a diamond\'s facets interact with light — determining its brilliance, fire, and scintillation. A well-cut diamond will appear more brilliant than a larger, poorly cut stone.',
    grades: ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    tip: 'Always prioritize cut over the other Cs. An Ideal or Excellent cut is the foundation of a beautiful diamond.',
  },
  {
    letter: 'C',
    name: 'Color',
    subtitle: 'Colorless to Light Yellow',
    description:
      'Diamond color grading measures the absence of color on a D-to-Z scale. D is completely colorless and the most valuable. Most customers cannot distinguish between adjacent grades (e.g., G vs H) once set in a ring.',
    grades: ['D–F (Colorless)', 'G–J (Near Colorless)', 'K–M (Faint)', 'N–R (Very Light)', 'S–Z (Light)'],
    tip: 'G or H color in a white gold/platinum setting is an excellent value — the slight warmth is undetectable to the naked eye.',
  },
  {
    letter: 'C',
    name: 'Clarity',
    subtitle: 'Internal & External Characteristics',
    description:
      'Clarity refers to the absence of inclusions (internal characteristics) and blemishes (external). Diamonds form under extreme pressure — most inclusions are microscopic and invisible without magnification.',
    grades: ['FL/IF (Flawless)', 'VVS1/VVS2 (Very Very Slightly Included)', 'VS1/VS2 (Very Slightly Included)', 'SI1/SI2 (Slightly Included)', 'I1/I2/I3 (Included)'],
    tip: 'VS2 or SI1 eye-clean diamonds offer the best value — inclusions are invisible to the naked eye but cost significantly less than flawless grades.',
  },
  {
    letter: 'C',
    name: 'Carat',
    subtitle: 'Weight, Not Size',
    description:
      'Carat refers to the weight of a diamond, not its physical size. One carat equals 200 milligrams. Two diamonds of the same carat weight can appear very different in size based on their cut proportions.',
    grades: ['0.25 ct (4.1 mm)', '0.50 ct (5.2 mm)', '1.00 ct (6.5 mm)', '1.50 ct (7.4 mm)', '2.00 ct (8.2 mm)'],
    tip: 'Buy just below popular carat weights (0.9 ct vs 1.0 ct) for significant savings with no visible size difference.',
  },
];

export default function FourCsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <p className="text-gold-400 mb-3 text-sm font-semibold uppercase tracking-widest">
          Diamond Education
        </p>
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
          The 4Cs of Diamonds
        </h1>
        <p className="text-charcoal-300 mx-auto max-w-2xl text-lg">
          Every diamond is unique. The 4Cs — Cut, Color, Clarity, and Carat — are the universal
          language for describing diamond quality and value.
        </p>
      </div>

      {/* 4Cs */}
      <div className="container mx-auto py-20">
        <div className="space-y-16">
          {fourCs.map((c, idx) => (
            <div
              key={c.name}
              className={`flex flex-col gap-10 lg:flex-row ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Icon column */}
              <div className="flex shrink-0 items-start justify-center lg:w-1/3">
                <div className="bg-gold-50 border-gold-200 flex h-48 w-48 flex-col items-center justify-center rounded-full border-2">
                  <span className="font-display text-gold-500 text-7xl font-bold">{c.letter}</span>
                  <span className="text-charcoal-700 mt-1 text-xl font-semibold">{c.name}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="font-display text-charcoal-900 mb-1 text-3xl font-bold">
                  {c.name} — {c.subtitle}
                </h2>
                <p className="text-charcoal-600 mb-6 leading-relaxed">{c.description}</p>

                <div className="mb-6">
                  <h3 className="text-charcoal-800 mb-3 text-sm font-semibold uppercase tracking-wider">
                    Grade Scale
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {c.grades.map((grade) => (
                      <span
                        key={grade}
                        className="border-charcoal-200 text-charcoal-700 rounded-full border px-3 py-1 text-sm"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-gold-200 bg-gold-50 rounded-xl border p-4">
                  <p className="text-gold-800 text-sm font-medium">
                    <span className="font-bold">Expert Tip: </span>
                    {c.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-charcoal-950 mt-20 rounded-2xl p-10 text-center text-white">
          <h2 className="font-display mb-4 text-3xl font-bold">
            Ready to Find Your Perfect Diamond?
          </h2>
          <p className="text-charcoal-300 mb-8">
            Use our advanced filters to search by the 4Cs and find a GIA or IGI certified diamond
            that fits your budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/diamonds"
              className="bg-gold-500 hover:bg-gold-600 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              Search Diamonds
            </Link>
            <Link
              href="/education"
              className="border-charcoal-600 hover:border-charcoal-400 rounded-full border px-8 py-3 font-semibold text-white transition-colors"
            >
              More Education
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

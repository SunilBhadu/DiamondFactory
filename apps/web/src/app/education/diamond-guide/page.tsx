import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Diamond Buying Guide | Diamond Factory',
  description:
    'Everything you need to know before buying a diamond. Learn about certification, the 4Cs, shapes, and how to get the best value.',
};

const topics = [
  {
    title: 'Understanding the 4Cs',
    href: '/education/4cs',
    description: 'Cut, Color, Clarity, and Carat — the universal standards for diamond quality.',
  },
  {
    title: 'Natural vs Lab Grown Diamonds',
    href: '/education/lab-grown',
    description: 'Both are real diamonds. Understand the differences and find what suits you.',
  },
  {
    title: 'Diamond Certification',
    href: '/education/4cs',
    description: 'Why GIA and IGI certificates matter and how to read a grading report.',
  },
  {
    title: 'Diamond Shapes',
    href: '/diamonds',
    description: 'Round, oval, cushion, princess — each shape has its own personality.',
  },
];

export default function DiamondGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <p className="text-gold-400 mb-3 text-sm font-semibold uppercase tracking-widest">
          Diamond Education
        </p>
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">Diamond Buying Guide</h1>
        <p className="text-charcoal-300 mx-auto max-w-2xl text-lg">
          Whether it&apos;s your first diamond purchase or your tenth, our guide will help you
          choose with confidence.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Topics grid */}
        <h2 className="font-display text-charcoal-900 mb-10 text-3xl font-bold">
          Topics in This Guide
        </h2>
        <div className="mb-16 grid gap-6 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="border-charcoal-200 hover:border-gold-400 group rounded-2xl border p-6 transition-colors"
            >
              <h3 className="text-charcoal-900 group-hover:text-gold-600 mb-2 text-lg font-semibold transition-colors">
                {topic.title}
              </h3>
              <p className="text-charcoal-500 text-sm">{topic.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick tips */}
        <div className="bg-charcoal-50 rounded-2xl p-10">
          <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
            5 Rules for Smart Diamond Buying
          </h2>
          <ol className="text-charcoal-700 space-y-4">
            {[
              'Prioritize cut above all other Cs — a well-cut diamond will always outshine a poorly cut one.',
              'Only buy GIA or IGI certified diamonds. Certification is your guarantee of authenticity.',
              'Choose eye-clean over highest clarity grade — VS2/SI1 are eye-clean and much better value.',
              'Buy slightly below popular weights (e.g., 0.9 ct instead of 1.0 ct) for significant savings.',
              'Consider lab grown diamonds — identical chemically, optically, and physically to natural, at 50–80% less cost.',
            ].map((rule, i) => (
              <li key={i} className="flex gap-3">
                <span className="bg-gold-500 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/diamonds"
            className="bg-gold-500 hover:bg-gold-600 inline-block rounded-full px-10 py-4 font-semibold text-white transition-colors"
          >
            Browse Certified Diamonds
          </Link>
        </div>
      </div>
    </div>
  );
}

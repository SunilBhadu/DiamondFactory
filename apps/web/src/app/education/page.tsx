import Link from 'next/link';
import { BookOpen, Diamond, Star, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diamond Education',
  description:
    'Learn everything about diamonds — the 4Cs, lab grown vs natural, certifications, and how to choose the perfect stone.',
};

const guides = [
  {
    icon: Layers,
    title: 'Understanding the 4Cs',
    description:
      'Cut, Color, Clarity, and Carat — the four universal measures of diamond quality explained by our gemologists.',
    href: '/education/4cs',
    readTime: '10 min',
  },
  {
    icon: Diamond,
    title: 'Lab Grown vs Natural Diamonds',
    description:
      'Chemically identical, visually indistinguishable. Learn the real differences in origin, price, and sustainability.',
    href: '/education/lab-grown',
    readTime: '8 min',
  },
  {
    icon: Star,
    title: 'Diamond Certifications',
    description:
      'GIA, IGI, AGS — what each grading lab measures and why an independent certificate matters for every purchase.',
    href: '/education/certifications',
    readTime: '6 min',
  },
  {
    icon: BookOpen,
    title: 'Complete Diamond Buying Guide',
    description:
      'Everything from setting a budget and choosing a shape to understanding resale value and insurance.',
    href: '/education/diamond-guide',
    readTime: '15 min',
  },
];

const faqs = [
  {
    q: 'What is the most important of the 4Cs?',
    a: 'Cut is generally considered the most important factor because it determines how brilliantly a diamond sparkles. A well-cut diamond will outshine a stone with better color or clarity grades.',
  },
  {
    q: 'Are lab grown diamonds real diamonds?',
    a: 'Yes — lab grown diamonds are chemically, physically, and optically identical to mined diamonds. They are graded by the same laboratories (GIA, IGI) using the same standards.',
  },
  {
    q: 'What carat weight should I choose for an engagement ring?',
    a: 'The average engagement ring diamond in India is 0.5–1.0 carat. Budget, finger size, and personal preference all matter more than a specific number. Our gemologists can help you find the best balance.',
  },
  {
    q: 'How do I verify a diamond certificate is authentic?',
    a: "Every GIA and IGI certificate has a unique report number. You can verify it for free on the GIA's or IGI's official websites. All Diamond Factory diamonds include a verification QR code.",
  },
];

export default function EducationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal-950 py-24 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-gold-400 mb-4 text-sm tracking-[0.2em] font-sans uppercase">
            Diamond Education
          </p>
          <h1 className="font-display mb-6 text-4xl font-bold md:text-5xl">
            Buy with Confidence
          </h1>
          <p className="text-charcoal-300 text-lg leading-relaxed">
            Our in-house gemologists have distilled decades of diamond expertise into clear,
            jargon-free guides. Whether you&apos;re buying your first diamond or your tenth, start
            here.
          </p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-display text-charcoal-900 text-3xl font-bold md:text-4xl">
              Education Guides
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="border-charcoal-100 hover:border-gold-300 hover:shadow-luxury group rounded-2xl border p-8 transition-all duration-300"
              >
                <div className="bg-gold-50 group-hover:bg-gold-100 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
                  <guide.icon className="text-gold-600 h-7 w-7" />
                </div>
                <h3 className="font-display text-charcoal-900 mb-3 text-xl font-bold">
                  {guide.title}
                </h3>
                <p className="text-charcoal-500 mb-4 text-sm leading-relaxed">
                  {guide.description}
                </p>
                <span className="text-gold-600 text-sm font-semibold">
                  Read guide · {guide.readTime} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-charcoal-50 py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-charcoal-900 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl bg-white p-8">
                <h3 className="text-charcoal-900 mb-3 font-semibold">{faq.q}</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto max-w-xl">
          <h2 className="font-display text-charcoal-900 mb-4 text-3xl font-bold">
            Ready to Find Your Diamond?
          </h2>
          <p className="text-charcoal-500 mb-8">
            Browse our collection of 50,000+ GIA & IGI certified diamonds with every filter you
            need.
          </p>
          <Link
            href="/diamonds"
            className="bg-gold-500 hover:bg-gold-600 inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-colors"
          >
            Shop Diamonds
          </Link>
        </div>
      </section>
    </div>
  );
}

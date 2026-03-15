import Image from 'next/image';
import Link from 'next/link';
import { Shield, Award, Truck, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Diamond Factory Pvt Ltd — India's premier destination for certified lab grown and natural diamonds, based in Surat, Gujarat.",
};

const values = [
  {
    icon: Shield,
    title: 'Ethically Sourced',
    description:
      'Every diamond adheres to the Kimberley Process Certification Scheme and our own strict supplier code of conduct.',
  },
  {
    icon: Award,
    title: 'Certified Quality',
    description:
      'All diamonds carry independent GIA, IGI, or AGS grading reports — no in-house grading, ever.',
  },
  {
    icon: Truck,
    title: 'Insured Delivery',
    description:
      'Orders are packed in tamper-evident, fully insured packaging and tracked door-to-door across India.',
  },
  {
    icon: Heart,
    title: 'Lifetime Guarantee',
    description:
      'We stand behind every piece with a lifetime warranty on craftsmanship and complimentary annual cleaning.',
  },
];

const team = [
  { name: 'Vikram Mehta', role: 'Founder & CEO', bio: '20+ years in the Surat diamond trade.' },
  { name: 'Anjali Shah', role: 'Head Gemologist (GIA Graduate)', bio: 'GIA Graduate Gemologist with 15 years of grading experience.' },
  { name: 'Rohan Patel', role: 'Head of Technology', bio: 'Former engineering lead at a Bangalore fintech unicorn.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-charcoal-950 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1920&q=80"
            alt="Diamond crafting"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <p className="text-gold-400 mb-4 text-sm tracking-[0.2em] font-sans uppercase">
            Our Story
          </p>
          <h1 className="font-display mb-6 text-4xl font-bold md:text-5xl">
            Born in Surat,<br />Built for India
          </h1>
          <p className="text-charcoal-300 text-lg leading-relaxed">
            Diamond Factory was founded in Surat — the world&apos;s diamond cutting and polishing
            capital — to make certified fine diamonds accessible to every Indian family, online.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-gold-600 mb-3 text-sm tracking-[0.2em] font-sans uppercase">
            Our Mission
          </p>
          <h2 className="font-display text-charcoal-900 mb-6 text-3xl font-bold md:text-4xl">
            Transparency at Every Step
          </h2>
          <p className="text-charcoal-600 text-lg leading-relaxed">
            The diamond industry has historically been opaque. We built Diamond Factory to change
            that — every stone on our platform comes with a third-party grading report, real
            photography, and a price you can actually understand.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-charcoal-50 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-display text-charcoal-900 text-3xl font-bold md:text-4xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="border-charcoal-100 rounded-2xl border bg-white p-8 text-center"
              >
                <div className="bg-gold-50 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl">
                  <v.icon className="text-gold-600 h-7 w-7" />
                </div>
                <h3 className="font-display text-charcoal-900 mb-3 text-lg font-bold">
                  {v.title}
                </h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-charcoal-900 text-3xl font-bold md:text-4xl">
              The Team
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="border-charcoal-100 rounded-2xl border p-8 text-center"
              >
                <div className="bg-charcoal-100 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-charcoal-500">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-charcoal-900 mb-1 font-semibold">{member.name}</h3>
                <p className="text-gold-600 mb-3 text-sm font-medium">{member.role}</p>
                <p className="text-charcoal-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address + CTA */}
      <section className="bg-charcoal-950 py-20 text-white">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="font-display mb-4 text-3xl font-bold">Visit Us</h2>
          <p className="text-charcoal-400 mb-2">Diamond Factory Pvt Ltd</p>
          <p className="text-charcoal-400 mb-2">Dhanlaxmi Estate, 3/2 Vasta Devdi Rd</p>
          <p className="text-charcoal-400 mb-8">Surat, Gujarat 395004, India</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hello@diamondfactory.in"
              className="border-gold-500 text-gold-400 hover:bg-gold-500 rounded-full border px-8 py-3 font-semibold transition-colors hover:text-white"
            >
              Email Us
            </a>
            <Link
              href="/diamonds"
              className="bg-gold-500 hover:bg-gold-400 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              Shop Diamonds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

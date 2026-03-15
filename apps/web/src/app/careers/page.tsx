import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers | Diamond Factory',
  description:
    'Join India\'s premier diamond ecommerce company. Explore open roles at Diamond Factory in Surat and remotely.',
};

const openings = [
  {
    title: 'Senior Full Stack Engineer',
    team: 'Engineering',
    location: 'Surat / Remote',
    type: 'Full-time',
  },
  {
    title: 'Diamond Grading Specialist',
    team: 'Operations',
    location: 'Surat, Gujarat',
    type: 'Full-time',
  },
  {
    title: 'Digital Marketing Manager',
    team: 'Marketing',
    location: 'Surat / Remote',
    type: 'Full-time',
  },
  {
    title: 'Customer Experience Associate',
    team: 'Support',
    location: 'Surat, Gujarat',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Careers at Diamond Factory</h1>
        <p className="text-charcoal-300 mx-auto max-w-xl text-lg">
          Help us build India&apos;s most trusted diamond ecommerce platform from the diamond
          capital of the world — Surat, Gujarat.
        </p>
      </div>

      <div className="container mx-auto py-20">
        {/* Values */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            { emoji: '💎', title: 'Craft Excellence', desc: 'We care about quality in everything we do — from cut grades to code quality.' },
            { emoji: '🚀', title: 'Move Fast', desc: 'We\'re building category-defining products. Speed matters, but so does doing it right.' },
            { emoji: '🌿', title: 'Ethical First', desc: 'We\'re committed to sustainable, ethical sourcing and a fair workplace.' },
          ].map((v) => (
            <div key={v.title} className="bg-charcoal-50 rounded-2xl p-6 text-center">
              <div className="mb-3 text-4xl">{v.emoji}</div>
              <h3 className="text-charcoal-900 mb-2 font-semibold">{v.title}</h3>
              <p className="text-charcoal-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Open roles */}
        <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job) => (
            <div
              key={job.title}
              className="border-charcoal-200 hover:border-gold-400 flex items-center justify-between rounded-xl border p-5 transition-colors"
            >
              <div>
                <h3 className="text-charcoal-900 font-semibold">{job.title}</h3>
                <p className="text-charcoal-500 mt-1 text-sm">
                  {job.team} · {job.location} · {job.type}
                </p>
              </div>
              <Link
                href="/contact"
                className="bg-gold-500 hover:bg-gold-600 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>

        <p className="text-charcoal-500 mt-10 text-center text-sm">
          Don&apos;t see a role that fits?{' '}
          <Link href="/contact" className="text-gold-600 underline">
            Send us your resume anyway.
          </Link>
        </p>
      </div>
    </div>
  );
}

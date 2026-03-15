import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const styleFilters = ['All', 'Solitaire', 'Halo', 'Three-Stone', 'Vintage', 'Pavé', 'Tension'];
const metalFilters = ['All', 'Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'];

const ringSettings = [
  {
    id: 'rs-001',
    name: 'The Aria Solitaire',
    style: 'Solitaire',
    metals: ['platinum', 'white-gold', 'yellow-gold', 'rose-gold'],
    startingPrice: 45000,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
    slug: 'the-aria-solitaire',
  },
  {
    id: 'rs-002',
    name: 'The Celestial Halo',
    style: 'Halo',
    metals: ['platinum', 'white-gold'],
    startingPrice: 65000,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80',
    slug: 'the-celestial-halo',
  },
  {
    id: 'rs-003',
    name: 'The Eternity Three-Stone',
    style: 'Three-Stone',
    metals: ['platinum', 'white-gold', 'yellow-gold'],
    startingPrice: 85000,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
    slug: 'the-eternity-three-stone',
  },
  {
    id: 'rs-004',
    name: 'The Vintage Milgrain',
    style: 'Vintage',
    metals: ['yellow-gold', 'rose-gold'],
    startingPrice: 72000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    slug: 'the-vintage-milgrain',
  },
  {
    id: 'rs-005',
    name: 'The Pavé Crown',
    style: 'Pavé',
    metals: ['platinum', 'white-gold', 'rose-gold'],
    startingPrice: 58000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    slug: 'the-pave-crown',
  },
  {
    id: 'rs-006',
    name: 'The Bezel Modern',
    style: 'Tension',
    metals: ['platinum', 'white-gold'],
    startingPrice: 52000,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=80',
    slug: 'the-bezel-modern',
  },
  {
    id: 'rs-007',
    name: 'The Grand Solitaire',
    style: 'Solitaire',
    metals: ['platinum', 'white-gold', 'yellow-gold'],
    startingPrice: 55000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    slug: 'the-grand-solitaire',
  },
  {
    id: 'rs-008',
    name: 'The Floral Halo',
    style: 'Halo',
    metals: ['rose-gold', 'yellow-gold'],
    startingPrice: 78000,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
    slug: 'the-floral-halo',
  },
  {
    id: 'rs-009',
    name: 'The Art Deco Vintage',
    style: 'Vintage',
    metals: ['platinum', 'yellow-gold'],
    startingPrice: 92000,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
    slug: 'the-art-deco-vintage',
  },
];

const metalColors: Record<string, string> = {
  platinum: '#E8E8E8',
  'white-gold': '#D4D4D4',
  'yellow-gold': '#D4AF37',
  'rose-gold': '#E8A598',
};

export default function EngagementRingsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative flex h-80 items-center overflow-hidden md:h-96">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1920&q=80"
            alt="Engagement rings"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container mx-auto">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Engagement Rings</span>
          </nav>
          <h1 className="font-display mb-4 text-4xl font-bold text-white md:text-6xl">
            Engagement Rings
          </h1>
          <p className="max-w-xl text-lg text-white/80">
            Over 200 handcrafted settings. Each one designed to hold your perfect diamond forever.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="border-charcoal-200 sticky top-20 z-30 border-b bg-white">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Style Filter */}
            <div>
              <span className="text-charcoal-400 mr-2 text-xs tracking-wide uppercase">Style:</span>
              <div className="inline-flex flex-wrap gap-1">
                {styleFilters.map((style) => (
                  <button
                    key={style}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      style === 'All'
                        ? 'bg-charcoal-900 text-white'
                        : 'border-charcoal-200 text-charcoal-600 hover:border-gold-500 hover:text-gold-600 border'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-charcoal-200 hidden h-6 w-px md:block" />

            {/* Metal Filter */}
            <div>
              <span className="text-charcoal-400 mr-2 text-xs tracking-wide uppercase">Metal:</span>
              <div className="inline-flex flex-wrap gap-1">
                {metalFilters.map((metal) => (
                  <button
                    key={metal}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      metal === 'All'
                        ? 'bg-charcoal-900 text-white'
                        : 'border-charcoal-200 text-charcoal-600 hover:border-gold-500 hover:text-gold-600 border'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto py-12">
        <p className="text-charcoal-500 mb-8 text-sm">
          Showing {ringSettings.length} ring settings
        </p>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {ringSettings.map((ring) => (
            <div key={ring.id} className="group">
              <Link href={`/build-your-ring?setting=${ring.id}`} className="block">
                <div className="bg-charcoal-50 img-zoom-container relative mb-4 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={ring.image}
                    alt={ring.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  <div className="absolute right-0 bottom-0 left-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <button className="text-charcoal-900 hover:bg-gold-500 w-full rounded-full bg-white py-2 text-sm font-semibold transition-colors hover:text-white">
                      Select Setting
                    </button>
                  </div>
                </div>
              </Link>

              <div>
                <h3 className="text-charcoal-900 group-hover:text-gold-600 mb-1 font-semibold transition-colors">
                  {ring.name}
                </h3>
                <p className="text-charcoal-400 mb-2 text-sm">{ring.style}</p>

                {/* Metal color dots */}
                <div className="mb-2 flex gap-1.5">
                  {ring.metals.map((metal) => (
                    <div
                      key={metal}
                      className="border-charcoal-200 h-4 w-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: metalColors[metal] || '#ccc' }}
                      title={metal.replace('-', ' ')}
                    />
                  ))}
                </div>

                <p className="text-charcoal-500 text-sm">
                  Starting at{' '}
                  <span className="text-charcoal-900 font-bold">
                    {formatPrice(ring.startingPrice)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to build your ring */}
        <div className="bg-charcoal-50 mt-16 rounded-2xl p-12 text-center">
          <h2 className="font-display text-charcoal-900 mb-4 text-3xl font-bold">
            Don't see the perfect setting?
          </h2>
          <p className="text-charcoal-500 mx-auto mb-8 max-w-lg">
            Speak with our master jewelers to design a completely custom setting. We bring your
            vision to life.
          </p>
          <Link
            href="/contact"
            className="bg-gold-500 hover:bg-gold-600 inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-colors"
          >
            Enquire About Custom Design <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

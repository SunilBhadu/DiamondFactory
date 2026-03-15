import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Fine Jewelry — Necklaces, Earrings & Bracelets',
  description:
    "Explore Diamond Factory's collection of fine diamond jewelry — necklaces, earrings, bracelets, and pendants. Certified diamonds, handcrafted in Surat.",
};

const CATEGORIES = [
  {
    label: 'Necklaces',
    slug: 'necklaces',
    description: 'Diamond pendants & chains',
    image: null,
    count: 48,
  },
  {
    label: 'Earrings',
    slug: 'earrings',
    description: 'Studs, drops & hoops',
    image: null,
    count: 62,
  },
  {
    label: 'Bracelets',
    slug: 'bracelets',
    description: 'Tennis & bangle styles',
    image: null,
    count: 31,
  },
  {
    label: 'Pendants',
    slug: 'pendants',
    description: 'Solitaire & cluster pendants',
    image: null,
    count: 29,
  },
];

// Static placeholder products for MVP — replace with API fetch in Phase 2
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Eternal Solitaire Necklace',
    type: 'necklace',
    metal: 'Platinum',
    price: 85000,
    originalPrice: null,
    isNew: true,
    carat: 0.5,
    shape: 'Round',
  },
  {
    id: '2',
    name: 'Pavé Diamond Studs',
    type: 'earring',
    metal: '18k White Gold',
    price: 45000,
    originalPrice: 52000,
    isNew: false,
    carat: 0.4,
    shape: 'Round',
  },
  {
    id: '3',
    name: 'Classic Tennis Bracelet',
    type: 'bracelet',
    metal: '18k White Gold',
    price: 195000,
    originalPrice: null,
    isNew: true,
    carat: 3.0,
    shape: 'Round',
  },
  {
    id: '4',
    name: 'Halo Pendant',
    type: 'pendant',
    metal: '18k Rose Gold',
    price: 72000,
    originalPrice: null,
    isNew: false,
    carat: 0.6,
    shape: 'Oval',
  },
  {
    id: '5',
    name: 'Drop Diamond Earrings',
    type: 'earring',
    metal: '18k Yellow Gold',
    price: 68000,
    originalPrice: 75000,
    isNew: false,
    carat: 0.8,
    shape: 'Pear',
  },
  {
    id: '6',
    name: 'Eternity Band',
    type: 'bracelet',
    metal: 'Platinum',
    price: 125000,
    originalPrice: null,
    isNew: true,
    carat: 1.5,
    shape: 'Round',
  },
];

export default function JewelryPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 relative overflow-hidden px-6 py-20 text-center text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-gold-400 mb-3 text-sm font-medium tracking-[0.2em] uppercase">
            Fine Jewelry
          </p>
          <h1 className="font-display text-5xl leading-tight font-bold">
            Crafted to Last <span className="text-gold-400">Forever</span>
          </h1>
          <p className="text-charcoal-300 mt-4 text-lg">
            Every piece handcrafted in Surat using GIA & IGI certified diamonds. Free shipping
            across India.
          </p>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-charcoal-900 mb-8 text-3xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/jewelry/${cat.slug}`}
              className="group border-charcoal-200 bg-charcoal-50 hover:border-gold-400 relative overflow-hidden rounded-2xl border p-6 transition hover:shadow-lg"
            >
              <div className="bg-charcoal-100 text-charcoal-400 mb-4 flex h-32 items-center justify-center rounded-xl text-sm">
                {cat.label} image
              </div>
              <h3 className="font-display text-charcoal-900 group-hover:text-gold-600 text-lg font-semibold">
                {cat.label}
              </h3>
              <p className="text-charcoal-500 mt-1 text-sm">{cat.description}</p>
              <p className="text-charcoal-400 mt-2 text-xs">{cat.count} styles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-charcoal-900 text-3xl font-bold">New Arrivals</h2>
          <Link
            href="/jewelry/all"
            className="text-gold-600 hover:text-gold-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/jewelry/${product.type}s/${product.id}`}
              className="group border-charcoal-200 block overflow-hidden rounded-2xl border bg-white transition hover:shadow-xl"
            >
              {/* Product Image Placeholder */}
              <div className="bg-charcoal-50 relative flex aspect-square items-center justify-center overflow-hidden">
                <div className="text-charcoal-300 p-4 text-center text-sm">
                  <div className="mb-2 text-3xl">💎</div>
                  {product.name}
                </div>
                {product.isNew && (
                  <Badge className="bg-gold-500 absolute top-3 left-3 text-xs text-white">
                    New
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-xs text-white">
                    Sale
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-charcoal-400 mb-1 text-xs tracking-wide uppercase">
                  {product.metal}
                </p>
                <h3 className="font-display text-charcoal-900 group-hover:text-gold-600 font-semibold transition">
                  {product.name}
                </h3>
                <p className="text-charcoal-500 mt-1 text-sm">
                  {product.carat}ct {product.shape}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-charcoal-900 font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-charcoal-400 text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Craftsmanship CTA ────────────────────────────────── */}
      <section className="bg-charcoal-950 px-6 py-16 text-center text-white">
        <h2 className="font-display mb-4 text-3xl font-bold">Want Something Custom?</h2>
        <p className="text-charcoal-300 mx-auto mb-8 max-w-md">
          Our master craftsmen in Surat can create any jewelry piece to your exact specifications.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-gold-500 text-charcoal-950 hover:bg-gold-400">
            <Link href="/build-your-ring">Design Your Ring</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link href="/appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

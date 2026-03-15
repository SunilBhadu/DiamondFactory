import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Truck, RotateCcw, Award, Star, ChevronRight } from 'lucide-react';

const diamondShapes = [
  { name: 'Round', slug: 'round', icon: '⬤' },
  { name: 'Oval', slug: 'oval', icon: '⬭' },
  { name: 'Cushion', slug: 'cushion', icon: '▣' },
  { name: 'Princess', slug: 'princess', icon: '◼' },
  { name: 'Emerald', slug: 'emerald', icon: '▬' },
  { name: 'Pear', slug: 'pear', icon: '🍐' },
  { name: 'Radiant', slug: 'radiant', icon: '◆' },
  { name: 'Marquise', slug: 'marquise', icon: '◈' },
  { name: 'Asscher', slug: 'asscher', icon: '▤' },
  { name: 'Heart', slug: 'heart', icon: '♥' },
];

const collections = [
  {
    title: 'Natural Diamonds',
    subtitle: 'Timeless. Rare. Authentic.',
    description:
      "Sourced from the world's finest mines, each natural diamond tells a billion-year story.",
    href: '/diamonds?labGrown=false',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    cta: 'Shop Natural',
  },
  {
    title: 'Lab Grown Diamonds',
    subtitle: 'Sustainable. Brilliant. Identical.',
    description:
      'Chemically and optically identical to mined diamonds, grown with cutting-edge technology.',
    href: '/diamonds?labGrown=true',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80',
    cta: 'Shop Lab Grown',
  },
  {
    title: 'Engagement Rings',
    subtitle: 'Designed for Forever.',
    description: 'Over 200 handcrafted settings in platinum, white, yellow, and rose gold.',
    href: '/engagement-rings',
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
    cta: 'Explore Rings',
  },
];

const whyUs = [
  {
    icon: Shield,
    title: 'Ethically Sourced',
    description:
      'Every diamond we sell adheres to the Kimberley Process and our strict ethical sourcing standards.',
  },
  {
    icon: Award,
    title: 'GIA & IGI Certified',
    description:
      'All diamonds come with internationally recognized certificates — no compromises, ever.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Shop with complete confidence. Free returns within 30 days, no questions asked.',
  },
  {
    icon: Truck,
    title: 'Free Insured Shipping',
    description:
      'Complimentary insured shipping on all orders. Delivered in secure, discreet packaging.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Diamond Factory made our engagement ring purchase absolutely magical. The 1.2ct oval lab-grown diamond we chose is breathtaking, and the service was impeccable from start to finish.',
    ring: 'Oval Lab Grown, 1.2ct, VS1, F',
  },
  {
    name: 'Rahul & Anika Gupta',
    location: 'Delhi',
    rating: 5,
    text: 'We designed a custom three-stone ring using the ring builder tool. The process was seamless, and the final piece exceeded every expectation. Simply stunning.',
    ring: 'Three-Stone Ring, GIA Certified',
  },
  {
    name: 'Deepika Nair',
    location: 'Bangalore',
    rating: 5,
    text: 'The quality and transparency of Diamond Factory is unmatched. We received our GIA certificate, detailed photos, and the diamond arrived perfectly. Highly recommend.',
    ring: 'Round Natural, 0.9ct, VVS2, G',
  },
];

const blogPosts = [
  {
    title: 'Lab Grown vs Natural Diamonds: The Complete 2025 Guide',
    excerpt:
      'Everything you need to know about choosing between lab grown and natural diamonds — quality, price, sustainability, and resale value explained.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    href: '/blog/lab-grown-vs-natural-diamonds',
    readTime: '8 min read',
    date: 'Jan 15, 2025',
  },
  {
    title: 'Understanding the 4Cs: How to Choose the Perfect Diamond',
    excerpt:
      'Cut, Color, Clarity, Carat — our expert gemologists break down each quality factor so you can make a confident, informed purchase.',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80',
    href: '/blog/understanding-the-4cs',
    readTime: '6 min read',
    date: 'Jan 8, 2025',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=90"
            alt="Luxury diamond jewelry"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <p className="text-gold-400 mb-6 font-sans text-sm tracking-[0.3em] uppercase">
            Diamond Factory Pvt Ltd · Surat, India
          </p>
          <h1 className="font-display mb-8 text-5xl leading-tight font-bold text-white md:text-7xl lg:text-8xl">
            Diamonds Crafted
            <br />
            <span className="text-gold-gradient">for Forever</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-light text-white/80 md:text-xl">
            Discover our curated collection of GIA & IGI certified natural and lab grown diamonds.
            Ethically sourced, exquisitely crafted, delivered to your door.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/diamonds"
              className="bg-gold-500 hover:bg-gold-600 hover:shadow-luxury-hover group inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-lg font-semibold text-white transition-all duration-300"
            >
              Shop Diamonds
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/build-your-ring"
              className="hover:text-charcoal-900 inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white"
            >
              Build Your Ring
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 pt-2">
            <div className="h-3 w-1 animate-pulse rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-charcoal-950 py-4 text-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium tracking-wide md:gap-12">
            <span className="flex items-center gap-2">
              <Truck className="text-gold-400 h-4 w-4" />
              Free Insured Shipping
            </span>
            <span className="text-charcoal-600 hidden sm:block">|</span>
            <span className="flex items-center gap-2">
              <RotateCcw className="text-gold-400 h-4 w-4" />
              30-Day Returns
            </span>
            <span className="text-charcoal-600 hidden sm:block">|</span>
            <span className="flex items-center gap-2">
              <Award className="text-gold-400 h-4 w-4" />
              GIA & IGI Certified
            </span>
            <span className="text-charcoal-600 hidden sm:block">|</span>
            <span className="flex items-center gap-2">
              <Shield className="text-gold-400 h-4 w-4" />
              Lifetime Warranty
            </span>
          </div>
        </div>
      </section>

      {/* Shape Selector Section */}
      <section className="bg-charcoal-50 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-display text-charcoal-900 mb-4 text-3xl font-bold md:text-4xl">
              Shop by Diamond Shape
            </h2>
            <p className="text-charcoal-500 text-lg">
              From timeless round brilliants to unique fancy shapes
            </p>
          </div>
          <div className="scroll-container flex gap-4 overflow-x-auto pb-4">
            <div className="mx-auto flex gap-4">
              {diamondShapes.map((shape) => (
                <Link
                  key={shape.slug}
                  href={`/diamonds?shapes=${shape.slug}`}
                  className="group flex min-w-[80px] flex-col items-center gap-3"
                >
                  <div className="border-charcoal-200 group-hover:border-gold-500 shadow-card group-hover:shadow-luxury flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white text-2xl transition-all duration-300">
                    <span className="text-charcoal-700 group-hover:text-gold-500 text-xl transition-colors">
                      {shape.icon}
                    </span>
                  </div>
                  <span className="text-charcoal-600 group-hover:text-gold-600 text-center text-xs font-medium transition-colors">
                    {shape.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <p className="text-gold-600 mb-3 font-sans text-sm tracking-[0.2em] uppercase">
              Curated Collections
            </p>
            <h2 className="font-display text-charcoal-900 text-4xl font-bold md:text-5xl">
              Find Your Perfect Diamond
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {collections.map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-8">
                  <p className="text-gold-400 mb-2 text-xs tracking-widest uppercase">
                    {col.subtitle}
                  </p>
                  <h3 className="font-display mb-3 text-2xl font-bold text-white">{col.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-white/70">{col.description}</p>
                  <span className="text-gold-400 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3">
                    {col.cta}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Ring CTA */}
      <section className="bg-charcoal-950 overflow-hidden py-24 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-gold-400 mb-4 font-sans text-sm tracking-[0.2em] uppercase">
                Ring Builder
              </p>
              <h2 className="font-display mb-6 text-4xl leading-tight font-bold md:text-5xl">
                Design Your
                <br />
                <span className="text-gold-gradient">Dream Ring</span>
              </h2>
              <p className="text-charcoal-300 mb-10 text-lg leading-relaxed">
                Create a one-of-a-kind engagement ring by choosing your perfect diamond and pairing
                it with our handcrafted settings. Preview in 3D before you buy.
              </p>
              <div className="mb-10 space-y-4">
                {[
                  { step: '01', text: 'Choose Your Diamond', desc: '50,000+ certified diamonds' },
                  { step: '02', text: 'Choose Your Setting', desc: '200+ handcrafted designs' },
                  { step: '03', text: 'Preview in 3D', desc: 'See before you buy' },
                  { step: '04', text: 'Checkout Securely', desc: 'Insured delivery in 7-10 days' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <span className="text-gold-500 font-display w-8 shrink-0 text-xl font-bold">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.text}</p>
                      <p className="text-charcoal-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/build-your-ring"
                className="bg-gold-500 hover:bg-gold-400 group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300"
              >
                Start Building
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-charcoal-800 relative flex aspect-square items-center justify-center rounded-full">
                <Image
                  src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80"
                  alt="Diamond ring"
                  width={500}
                  height={500}
                  className="animate-float rounded-full object-cover"
                />
                {/* Decorative rings */}
                <div className="border-gold-500/20 absolute inset-0 scale-110 rounded-full border" />
                <div className="border-gold-500/10 absolute inset-0 scale-125 rounded-full border" />
                <div className="border-gold-500/5 absolute inset-0 scale-150 rounded-full border" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Diamond Factory */}
      <section className="bg-white py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <p className="text-gold-600 mb-3 font-sans text-sm tracking-[0.2em] uppercase">
              Our Promise
            </p>
            <h2 className="font-display text-charcoal-900 text-4xl font-bold md:text-5xl">
              Why Diamond Factory?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="border-charcoal-100 hover:border-gold-300 hover:shadow-luxury group rounded-2xl border p-8 text-center transition-all duration-300"
              >
                <div className="bg-gold-50 group-hover:bg-gold-100 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors">
                  <item.icon className="text-gold-600 h-8 w-8" />
                </div>
                <h3 className="font-display text-charcoal-900 mb-3 text-xl font-bold">
                  {item.title}
                </h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-charcoal-50 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <p className="text-gold-600 mb-3 font-sans text-sm tracking-[0.2em] uppercase">
              Customer Stories
            </p>
            <h2 className="font-display text-charcoal-900 text-4xl font-bold">
              Love at First Sight
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="shadow-card hover:shadow-card-hover rounded-2xl bg-white p-8 transition-shadow duration-300"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="fill-gold-400 text-gold-400 h-5 w-5" />
                  ))}
                </div>
                <p className="text-charcoal-600 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="border-charcoal-100 border-t pt-4">
                  <p className="text-charcoal-900 font-semibold">{t.name}</p>
                  <p className="text-charcoal-400 text-sm">{t.location}</p>
                  <p className="text-gold-600 mt-1 text-xs font-medium">{t.ring}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24">
        <div className="container mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-gold-600 mb-3 font-sans text-sm tracking-[0.2em] uppercase">
                Most Loved
              </p>
              <h2 className="font-display text-charcoal-900 text-4xl font-bold">Best Sellers</h2>
            </div>
            <Link
              href="/diamonds"
              className="text-gold-600 hover:text-gold-700 hidden items-center gap-2 font-semibold transition-colors md:flex"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              {
                carat: '1.01ct',
                shape: 'Round',
                color: 'F',
                clarity: 'VS1',
                price: '₹2,85,000',
                lab: 'GIA',
              },
              {
                carat: '0.90ct',
                shape: 'Oval',
                color: 'G',
                clarity: 'VS2',
                price: '₹1,95,000',
                lab: 'IGI',
              },
              {
                carat: '1.20ct',
                shape: 'Cushion',
                color: 'E',
                clarity: 'VVS2',
                price: '₹4,20,000',
                lab: 'GIA',
              },
              {
                carat: '0.75ct',
                shape: 'Princess',
                color: 'H',
                clarity: 'SI1',
                price: '₹98,000',
                lab: 'IGI',
              },
              {
                carat: '1.50ct',
                shape: 'Emerald',
                color: 'F',
                clarity: 'VS1',
                price: '₹5,60,000',
                lab: 'GIA',
              },
              {
                carat: '0.85ct',
                shape: 'Pear',
                color: 'G',
                clarity: 'VS2',
                price: '₹1,45,000',
                lab: 'IGI',
              },
            ].map((diamond, i) => (
              <Link
                key={i}
                href="/diamonds"
                className="group bg-charcoal-50 hover:shadow-card-hover overflow-hidden rounded-xl transition-all duration-300"
              >
                <div className="bg-charcoal-100 relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="clip-diamond via-diamond-200 to-diamond-400 h-16 w-16 bg-gradient-to-br from-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${diamond.lab === 'GIA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {diamond.lab}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-charcoal-900 text-sm font-semibold">
                    {diamond.carat} {diamond.shape}
                  </p>
                  <p className="text-charcoal-500 mb-1 text-xs">
                    {diamond.color} / {diamond.clarity}
                  </p>
                  <p className="text-gold-600 text-sm font-bold">{diamond.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-charcoal-50 py-24">
        <div className="container mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-gold-600 mb-3 font-sans text-sm tracking-[0.2em] uppercase">
                Education & Inspiration
              </p>
              <h2 className="font-display text-charcoal-900 text-4xl font-bold">From Our Blog</h2>
            </div>
            <Link
              href="/blog"
              className="text-gold-600 hover:text-gold-700 hidden items-center gap-2 font-semibold transition-colors md:flex"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="group shadow-card hover:shadow-card-hover overflow-hidden rounded-2xl bg-white transition-shadow duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8">
                  <div className="text-charcoal-400 mb-4 flex items-center gap-4 text-sm">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-charcoal-900 group-hover:text-gold-700 mb-3 text-xl font-bold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-charcoal-500 text-sm leading-relaxed">{post.excerpt}</p>
                  <span className="text-gold-600 mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3">
                    Read More <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gold-500 py-20">
        <div className="container mx-auto text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-white md:text-4xl">
            Stay in the Loop
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Get early access to new arrivals, exclusive offers, and diamond education delivered
            straight to your inbox.
          </p>
          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              className="text-charcoal-900 placeholder:text-charcoal-400 flex-1 rounded-full px-5 py-3 focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-charcoal-900 hover:bg-charcoal-800 rounded-full px-8 py-3 font-semibold whitespace-nowrap text-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

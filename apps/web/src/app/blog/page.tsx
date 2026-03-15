import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Diamond Tips & Trends | Diamond Factory',
  description:
    'Expert advice on buying diamonds, engagement ring trends, jewelry care tips, and more from the Diamond Factory team in Surat.',
};

const posts = [
  {
    slug: 'how-to-choose-an-engagement-ring',
    title: 'How to Choose the Perfect Engagement Ring',
    excerpt:
      'From setting styles to metal types, here\'s everything you need to know before popping the question.',
    category: 'Buying Guide',
    date: 'March 10, 2026',
  },
  {
    slug: 'lab-grown-vs-natural-diamonds-2026',
    title: 'Lab Grown vs Natural Diamonds in 2026',
    excerpt:
      'The market has shifted dramatically. Here\'s the latest on pricing, resale value, and which is right for you.',
    category: 'Education',
    date: 'February 28, 2026',
  },
  {
    slug: 'best-diamond-shapes-for-small-hands',
    title: 'Best Diamond Shapes for Small Hands',
    excerpt:
      'Elongated shapes like oval, pear, and marquise can make fingers appear longer and more elegant.',
    category: 'Style',
    date: 'February 15, 2026',
  },
  {
    slug: 'how-to-care-for-your-diamond-ring',
    title: 'How to Care for Your Diamond Ring',
    excerpt:
      'Simple maintenance tips to keep your ring sparkling for a lifetime — from cleaning to professional servicing.',
    category: 'Care',
    date: 'January 30, 2026',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Diamond Factory Blog</h1>
        <p className="text-charcoal-300 text-lg">
          Expert advice, trends, and buying guides from our gemologists in Surat.
        </p>
      </div>

      <div className="container mx-auto py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-charcoal-200 group overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
            >
              <div className="bg-charcoal-100 h-48" />
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="bg-gold-100 text-gold-700 rounded-full px-3 py-1 text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-charcoal-400 text-xs">{post.date}</span>
                </div>
                <h2 className="font-display text-charcoal-900 group-hover:text-gold-600 mb-2 text-xl font-bold transition-colors">
                  {post.title}
                </h2>
                <p className="text-charcoal-500 text-sm leading-relaxed">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gold-600 hover:text-gold-700 mt-4 inline-block text-sm font-semibold"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

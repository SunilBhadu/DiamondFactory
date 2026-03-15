import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://diamondfactory.in';

// Static routes with their priorities and change frequencies
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  {
    url: `${BASE_URL}/diamonds`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.95,
  },
  {
    url: `${BASE_URL}/engagement-rings`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  { url: `${BASE_URL}/jewelry`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  {
    url: `${BASE_URL}/build-your-ring`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },

  // Diamond shape pages
  ...(
    [
      'round',
      'princess',
      'oval',
      'cushion',
      'marquise',
      'pear',
      'radiant',
      'asscher',
      'emerald',
      'heart',
    ] as const
  ).map((shape) => ({
    url: `${BASE_URL}/diamonds?shape=${shape}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })),

  // Ring style pages
  ...(['solitaire', 'halo', 'three-stone', 'vintage', 'pave', 'tension'] as const).map((style) => ({
    url: `${BASE_URL}/engagement-rings?style=${style}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  })),

  // Jewelry categories
  ...(['necklaces', 'earrings', 'bracelets', 'pendants'] as const).map((cat) => ({
    url: `${BASE_URL}/jewelry/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })),

  // Education / guides
  {
    url: `${BASE_URL}/education/4cs-of-diamonds`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/education/lab-grown-vs-natural`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/education/diamond-shapes-guide`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  },
  {
    url: `${BASE_URL}/education/engagement-ring-guide`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  },

  // Lab-grown category page (high SEO value)
  {
    url: `${BASE_URL}/diamonds/lab-grown`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/diamonds/gia-certified`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/diamonds/igi-certified`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.75,
  },

  // Company pages
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  {
    url: `${BASE_URL}/appointment`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/shipping`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/returns`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // In Phase 2: fetch live diamond IDs and ring setting slugs from API
  // const diamonds = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diamonds/sitemap`).then(r => r.json());
  // const dynamicDiamondRoutes = diamonds.map(d => ({ url: `${BASE_URL}/diamonds/${d.id}`, ... }));

  return staticRoutes;
}

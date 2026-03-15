import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required: tells Next.js to compile TypeScript source from workspace packages
  transpilePackages: ['@diamond-factory/types'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.diamondfactory.in' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [{ source: '/rings', destination: '/engagement-rings', permanent: true }];
  },
};

export default nextConfig;

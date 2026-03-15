import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Diamond Factory | Luxury Lab Grown & Natural Diamonds',
    template: '%s | Diamond Factory',
  },
  description:
    "Shop certified lab grown and natural diamonds, engagement rings, and fine jewelry. Diamond Factory Pvt Ltd — Surat, India's premier diamond destination.",
  keywords: [
    'lab grown diamonds',
    'engagement rings',
    'diamond jewelry',
    'GIA certified diamonds',
    'diamond factory',
    'surat diamonds',
  ],
  authors: [{ name: 'Diamond Factory Pvt Ltd' }],
  creator: 'Diamond Factory Pvt Ltd',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://diamondfactory.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://diamondfactory.in',
    siteName: 'Diamond Factory',
    title: 'Diamond Factory | Luxury Lab Grown & Natural Diamonds',
    description: 'Shop certified diamonds, engagement rings, and fine jewelry.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Diamond Factory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diamond Factory | Luxury Diamonds',
    description: 'Shop certified lab grown and natural diamonds.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="text-charcoal-900 bg-white font-sans antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

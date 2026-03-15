import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronDown,
  ExternalLink,
  Heart,
  GitCompareArrows,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import type { Diamond } from '@diamond-factory/types';
import { formatPrice, formatCarat } from '@/lib/utils';

async function getDiamond(id: string): Promise<Diamond | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/diamonds/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const diamond = await getDiamond(id);
  if (!diamond) return { title: 'Diamond Not Found' };

  const title = `${formatCarat(diamond.carat)} ${diamond.shape} Diamond - ${diamond.color}/${diamond.clarity} ${diamond.certificateLab}`;
  const description = `Shop this certified ${formatCarat(diamond.carat)} ${diamond.shape} diamond. Color: ${diamond.color}, Clarity: ${diamond.clarity}, Cut: ${diamond.cut || 'N/A'}. ${diamond.certificateLab} certified. ${diamond.labGrown ? 'Lab grown' : 'Natural'} diamond from Diamond Factory.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: diamond.images[0] ? [{ url: diamond.images[0].url }] : [],
    },
  };
}

export default async function DiamondDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diamond = await getDiamond(id);

  if (!diamond) notFound();

  const labBadgeColor =
    {
      GIA: 'bg-blue-100 text-blue-700 border-blue-200',
      IGI: 'bg-green-100 text-green-700 border-green-200',
      AGS: 'bg-purple-100 text-purple-700 border-purple-200',
      HRD: 'bg-orange-100 text-orange-700 border-orange-200',
      EGL: 'bg-gray-100 text-gray-700 border-gray-200',
    }[diamond.certificateLab] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-charcoal-50 border-charcoal-100 border-b">
        <div className="container mx-auto py-3">
          <nav className="text-charcoal-500 flex items-center gap-2 text-sm">
            <Link href="/" className="hover:text-gold-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/diamonds" className="hover:text-gold-600 transition-colors">
              Diamonds
            </Link>
            <span>/</span>
            <span className="text-charcoal-900">
              {formatCarat(diamond.carat)} {diamond.shape}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-20">
          {/* Left: Image Gallery */}
          <div>
            <div className="bg-charcoal-50 relative mb-4 aspect-square overflow-hidden rounded-2xl">
              {diamond.images[0] ? (
                <Image
                  src={diamond.images[0].url}
                  alt={`${diamond.shape} diamond`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="clip-diamond via-diamond-200 to-diamond-400 h-32 w-32 bg-gradient-to-br from-white" />
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {diamond.images.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className="border-charcoal-200 hover:border-gold-500 h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors"
                >
                  <Image
                    src={img.url}
                    alt={`View ${i + 1}`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {diamond.v360Url && (
                <a
                  href={diamond.v360Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-charcoal-200 hover:border-gold-500 text-charcoal-500 hover:text-gold-600 flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 text-xs font-medium transition-colors"
                >
                  <span className="text-lg">360°</span>
                  <span>View</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {diamond.labGrown && (
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Lab Grown
                </span>
              )}
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${labBadgeColor}`}
              >
                {diamond.certificateLab} Certified
              </span>
              {diamond.eyeClean && (
                <span className="bg-gold-100 text-gold-700 border-gold-200 rounded-full border px-3 py-1 text-xs font-semibold">
                  Eye Clean
                </span>
              )}
            </div>

            <h1 className="font-display text-charcoal-900 mb-2 text-3xl font-bold md:text-4xl">
              {formatCarat(diamond.carat)}{' '}
              {diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)} Diamond
            </h1>
            <p className="text-charcoal-500 mb-6 text-sm">SKU: {diamond.sku}</p>

            {/* Price */}
            <div className="mb-8">
              <p className="font-display text-charcoal-900 text-4xl font-bold">
                {formatPrice(diamond.retailPrice)}
              </p>
              <p className="text-charcoal-400 mt-1 text-sm">
                Inclusive of GST · Free insured shipping
              </p>
            </div>

            {/* 4Cs Highlight */}
            <div className="mb-8 grid grid-cols-4 gap-3">
              {[
                { label: 'Carat', value: diamond.carat.toFixed(2) },
                { label: 'Cut', value: diamond.cut || '—' },
                { label: 'Color', value: diamond.color },
                { label: 'Clarity', value: diamond.clarity },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-charcoal-50 border-charcoal-100 rounded-xl border p-4 text-center"
                >
                  <p className="text-charcoal-900 text-lg font-bold">{item.value}</p>
                  <p className="text-charcoal-500 mt-1 text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Certificate */}
            <div className="bg-charcoal-50 mb-6 flex items-center justify-between rounded-xl p-4">
              <div>
                <p className="text-charcoal-500 mb-1 text-xs">Certificate</p>
                <p className="text-charcoal-900 font-semibold">
                  {diamond.certificateLab} #{diamond.certificateNo || 'N/A'}
                </p>
              </div>
              {diamond.certificateUrl && (
                <a
                  href={diamond.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:text-gold-700 flex items-center gap-1 text-sm font-medium"
                >
                  View PDF <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Measurements Table */}
            <div className="border-charcoal-200 mb-6 overflow-hidden rounded-xl border">
              <div className="bg-charcoal-50 border-charcoal-200 border-b px-4 py-2">
                <h3 className="text-charcoal-700 text-sm font-semibold">Measurements & Grades</h3>
              </div>
              <div className="divide-charcoal-100 grid grid-cols-2 divide-y">
                {[
                  { label: 'Depth %', value: diamond.depthPct ? `${diamond.depthPct}%` : '—' },
                  { label: 'Table %', value: diamond.tablePct ? `${diamond.tablePct}%` : '—' },
                  {
                    label: 'Dimensions',
                    value:
                      diamond.lengthMm && diamond.widthMm && diamond.depthMm
                        ? `${diamond.lengthMm} × ${diamond.widthMm} × ${diamond.depthMm} mm`
                        : '—',
                  },
                  { label: 'L/W Ratio', value: diamond.lwRatio ? diamond.lwRatio.toFixed(2) : '—' },
                  { label: 'Polish', value: diamond.polish || '—' },
                  { label: 'Symmetry', value: diamond.symmetry || '—' },
                  { label: 'Fluorescence', value: diamond.fluorescence || 'None' },
                  { label: 'Girdle', value: diamond.girdle || '—' },
                  { label: 'Culet', value: diamond.culet || 'None' },
                  {
                    label: 'Origin',
                    value: diamond.originCountry || diamond.labGrown ? 'Laboratory' : '—',
                  },
                ]
                  .filter((_, i) => i % 2 === 0)
                  .map((_, rowIdx) => {
                    const items = [
                      { label: 'Depth %', value: diamond.depthPct ? `${diamond.depthPct}%` : '—' },
                      { label: 'Table %', value: diamond.tablePct ? `${diamond.tablePct}%` : '—' },
                      {
                        label: 'Dimensions',
                        value:
                          diamond.lengthMm && diamond.widthMm && diamond.depthMm
                            ? `${diamond.lengthMm} × ${diamond.widthMm} × ${diamond.depthMm} mm`
                            : '—',
                      },
                      {
                        label: 'L/W Ratio',
                        value: diamond.lwRatio ? diamond.lwRatio.toFixed(2) : '—',
                      },
                      { label: 'Polish', value: diamond.polish || '—' },
                      { label: 'Symmetry', value: diamond.symmetry || '—' },
                      { label: 'Fluorescence', value: diamond.fluorescence || 'None' },
                      { label: 'Girdle', value: diamond.girdle || '—' },
                      { label: 'Culet', value: diamond.culet || 'None' },
                      {
                        label: 'Origin',
                        value: diamond.originCountry || (diamond.labGrown ? 'Laboratory' : '—'),
                      },
                    ];
                    const left = items[rowIdx * 2];
                    const right = items[rowIdx * 2 + 1];
                    return (
                      <div key={rowIdx} className="contents">
                        <div className="border-charcoal-100 border-r px-4 py-3">
                          <p className="text-charcoal-400 text-xs">{left?.label}</p>
                          <p className="text-charcoal-900 text-sm font-medium">{left?.value}</p>
                        </div>
                        {right && (
                          <div className="px-4 py-3">
                            <p className="text-charcoal-400 text-xs">{right.label}</p>
                            <p className="text-charcoal-900 text-sm font-medium">{right.value}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Link
                href={`/build-your-ring?diamond=${diamond.id}`}
                className="bg-gold-500 hover:bg-gold-600 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-semibold text-white transition-colors"
              >
                Choose This Diamond
              </Link>
              <div className="flex gap-3">
                <button className="border-charcoal-300 hover:border-gold-500 text-charcoal-700 hover:text-gold-600 flex flex-1 items-center justify-center gap-2 rounded-full border-2 py-3 font-medium transition-colors">
                  <Heart className="h-5 w-5" />
                  Add to Wishlist
                </button>
                <button className="border-charcoal-300 hover:border-gold-500 text-charcoal-700 hover:text-gold-600 flex flex-1 items-center justify-center gap-2 rounded-full border-2 py-3 font-medium transition-colors">
                  <GitCompareArrows className="h-5 w-5" />
                  Compare
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Free Insured Shipping' },
                { icon: RotateCcw, text: '30-Day Returns' },
                { icon: Shield, text: 'Lifetime Warranty' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="bg-charcoal-50 flex flex-col items-center gap-1 rounded-xl p-3 text-center"
                >
                  <item.icon className="text-gold-500 h-5 w-5" />
                  <p className="text-charcoal-600 text-xs font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4Cs Education Accordion */}
        <div className="border-charcoal-100 mt-20 border-t pt-16">
          <h2 className="font-display text-charcoal-900 mb-8 text-3xl font-bold">
            Understanding Your Diamond
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Cut — The Sparkle Factor',
                content:
                  "Cut is widely considered the most important of the 4Cs. It refers to how well a diamond's facets interact with light. An ideal cut maximizes brilliance, fire, and scintillation. Your diamond's cut grade is " +
                  (diamond.cut || 'not specified') +
                  '.',
              },
              {
                title: 'Color — From Colorless to Light Yellow',
                content: `Color grades range from D (completely colorless) to Z (light yellow). Your diamond is graded ${diamond.color}, which is ${['D', 'E', 'F'].includes(diamond.color) ? 'colorless — the highest color tier' : ['G', 'H', 'I', 'J'].includes(diamond.color) ? 'near colorless — an excellent value choice' : 'faint color — visible to trained eyes under magnification'}.`,
              },
              {
                title: 'Clarity — Internal & External Characteristics',
                content: `Clarity refers to the absence of inclusions (internal) and blemishes (external). Your diamond is graded ${diamond.clarity}${['FL', 'IF'].includes(diamond.clarity) ? ' — flawless, the rarest clarity grade' : ['VVS1', 'VVS2'].includes(diamond.clarity) ? ' — very very slightly included, inclusions are extremely difficult to detect under 10x magnification' : ['VS1', 'VS2'].includes(diamond.clarity) ? ' — very slightly included, minor inclusions seen with effort under 10x magnification' : ' — inclusions visible under 10x magnification'}.`,
              },
              {
                title: 'Carat — Weight, Not Size',
                content: `Carat refers to the weight of the diamond, not its size. Your ${formatCarat(diamond.carat)} diamond weighs ${diamond.carat} carats (${(diamond.carat * 200).toFixed(0)} mg). A well-cut diamond will appear larger than a poorly-cut diamond of the same carat weight.`,
              },
            ].map((item) => (
              <details
                key={item.title}
                className="border-charcoal-200 group overflow-hidden rounded-xl border"
              >
                <summary className="hover:bg-charcoal-50 flex cursor-pointer items-center justify-between p-6 transition-colors">
                  <h3 className="text-charcoal-900 font-semibold">{item.title}</h3>
                  <ChevronDown className="text-charcoal-400 h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="text-charcoal-600 px-6 pb-6 leading-relaxed">{item.content}</div>
              </details>
            ))}

            <details className="border-charcoal-200 group overflow-hidden rounded-xl border">
              <summary className="hover:bg-charcoal-50 flex cursor-pointer items-center justify-between p-6 transition-colors">
                <h3 className="text-charcoal-900 font-semibold">Shipping & Returns</h3>
                <ChevronDown className="text-charcoal-400 h-5 w-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-3 px-6 pb-6">
                {[
                  'Free insured shipping on all orders via FedEx Priority',
                  'Delivered in 5-7 business days within India',
                  'International shipping available — contact us for rates',
                  '30-day hassle-free returns — full refund, no questions asked',
                  'All returns must be in original condition with certificate',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle className="text-gold-500 mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-charcoal-600 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

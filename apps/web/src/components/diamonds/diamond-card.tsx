'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, GitCompareArrows, Eye } from 'lucide-react';
import type { Diamond } from '@diamond-factory/types';
import { formatPrice, formatCarat } from '@/lib/utils';
import { useWishlist } from '@/lib/hooks/use-wishlist';

interface DiamondCardProps {
  diamond: Diamond;
  onCompare?: (id: string) => void;
  isComparing?: boolean;
  showCompare?: boolean;
}

const labBadgeStyles: Record<string, string> = {
  GIA: 'bg-blue-100 text-blue-700',
  IGI: 'bg-green-100 text-green-700',
  AGS: 'bg-purple-100 text-purple-700',
  HRD: 'bg-orange-100 text-orange-700',
  EGL: 'bg-gray-100 text-gray-600',
};

export function DiamondCard({
  diamond,
  onCompare,
  isComparing = false,
  showCompare = false,
}: DiamondCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist('diamond', diamond.id);

  return (
    <div className="group border-charcoal-100 hover:border-gold-300 hover:shadow-card-hover luxury-card relative overflow-hidden rounded-2xl border bg-white transition-all duration-300">
      {/* Image */}
      <Link
        href={`/diamonds/${diamond.id}`}
        className="bg-charcoal-50 relative block aspect-square"
      >
        {diamond.images[0] ? (
          <Image
            src={diamond.images[0].url}
            alt={`${diamond.carat}ct ${diamond.shape} diamond`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="clip-diamond via-diamond-200 to-diamond-400 h-16 w-16 bg-gradient-to-br from-white transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {diamond.labGrown && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Lab Grown
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${labBadgeStyles[diamond.certificateLab] || 'bg-gray-100 text-gray-600'}`}
          >
            {diamond.certificateLab}
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist('diamond', diamond.id);
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-white"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-charcoal-500 hover:text-red-500'}`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-charcoal-900 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-lg">
            <Eye className="h-3 w-3" />
            View Diamond
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Shape + carat */}
        <Link href={`/diamonds/${diamond.id}`}>
          <h3 className="text-charcoal-900 hover:text-gold-600 mb-1 text-sm leading-tight font-semibold transition-colors">
            {formatCarat(diamond.carat)}{' '}
            {diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}
          </h3>
        </Link>

        {/* 4Cs chips */}
        <div className="mb-3 flex flex-wrap gap-1">
          {[
            diamond.color,
            diamond.clarity,
            ...(diamond.cut ? [diamond.cut.replace('Very Good', 'V.Good')] : []),
          ].map((val) => (
            <span
              key={val}
              className="bg-charcoal-50 text-charcoal-600 rounded px-1.5 py-0.5 text-xs font-medium"
            >
              {val}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-charcoal-900 price font-bold">{formatPrice(diamond.retailPrice)}</p>
          {showCompare && onCompare && (
            <button
              onClick={() => onCompare(diamond.id)}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                isComparing
                  ? 'bg-gold-100 text-gold-700'
                  : 'text-charcoal-400 hover:text-gold-600 hover:bg-gold-50'
              }`}
              title="Compare"
            >
              <GitCompareArrows className="h-3 w-3" />
              {isComparing ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

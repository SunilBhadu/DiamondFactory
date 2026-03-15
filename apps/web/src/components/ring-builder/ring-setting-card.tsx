'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { RingSetting, MetalType } from '@diamond-factory/types';
import { formatPrice } from '@/lib/utils';

interface RingSettingCardProps {
  setting: RingSetting & { image?: string };
  isSelected?: boolean;
  onSelect: (setting: RingSetting) => void;
}

const metalColors: Record<MetalType, { bg: string; border: string; label: string }> = {
  platinum: { bg: '#E8E8E8', border: '#C8C8C8', label: 'Platinum' },
  '18k-white-gold': { bg: '#D4D4D4', border: '#B4B4B4', label: '18K WG' },
  '18k-yellow-gold': { bg: '#D4AF37', border: '#B49327', label: '18K YG' },
  '18k-rose-gold': { bg: '#E8A598', border: '#C8857A', label: '18K RG' },
  '14k-white-gold': { bg: '#C8C8C8', border: '#A8A8A8', label: '14K WG' },
  '14k-yellow-gold': { bg: '#C8A030', border: '#A88020', label: '14K YG' },
  '14k-rose-gold': { bg: '#D8958A', border: '#B87568', label: '14K RG' },
};

const styleColors: Record<string, string> = {
  solitaire: 'bg-blue-100 text-blue-700',
  halo: 'bg-purple-100 text-purple-700',
  'three-stone': 'bg-pink-100 text-pink-700',
  vintage: 'bg-amber-100 text-amber-700',
  pave: 'bg-emerald-100 text-emerald-700',
  tension: 'bg-slate-100 text-slate-700',
  bezel: 'bg-cyan-100 text-cyan-700',
  channel: 'bg-orange-100 text-orange-700',
};

export function RingSettingCard({ setting, isSelected = false, onSelect }: RingSettingCardProps) {
  const imageUrl =
    (setting as unknown as { image?: string }).image ||
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80';

  const availableMetals: MetalType[] = setting.compatibleShapes
    ? ['platinum', '18k-white-gold', '18k-yellow-gold', '18k-rose-gold']
    : [setting.metalType];

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
        isSelected
          ? 'border-gold-500 shadow-luxury'
          : 'border-charcoal-200 hover:border-gold-300 hover:shadow-card-hover'
      }`}
      onClick={() => onSelect(setting)}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="bg-gold-500 absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Image */}
      <div className="bg-charcoal-50 relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={setting.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        <div className="absolute right-0 bottom-0 left-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button className="text-charcoal-900 hover:bg-gold-500 w-full rounded-full bg-white py-2 text-xs font-semibold shadow-md transition-colors hover:text-white">
            Select Setting
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Style badge */}
        <span
          className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styleColors[setting.style] || 'bg-gray-100 text-gray-600'}`}
        >
          {setting.style.charAt(0).toUpperCase() + setting.style.slice(1)}
        </span>

        <h3 className="text-charcoal-900 mb-2 text-sm leading-tight font-semibold">
          {setting.name}
        </h3>

        {/* Metal color dots */}
        <div className="mb-3 flex gap-1.5">
          {availableMetals.slice(0, 4).map((metal) => {
            const config = metalColors[metal];
            if (!config) return null;
            return (
              <div
                key={metal}
                className="h-4 w-4 rounded-full border shadow-sm"
                style={{
                  backgroundColor: config.bg,
                  borderColor: config.border,
                }}
                title={config.label}
              />
            );
          })}
        </div>

        {/* Price */}
        <p className="text-charcoal-500 text-xs">
          Starting at{' '}
          <span className="text-charcoal-900 text-sm font-bold">
            {formatPrice(setting.basePrice)}
          </span>
        </p>
      </div>
    </div>
  );
}

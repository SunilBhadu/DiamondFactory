'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type {
  DiamondSearchFilters,
  DiamondShape,
  DiamondColor,
  DiamondClarity,
  DiamondCut,
  CertificateLab,
  DiamondFluorescence,
} from '@diamond-factory/types';

interface DiamondFiltersProps {
  filters: DiamondSearchFilters;
  onChange: (filters: Partial<DiamondSearchFilters>) => void;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-charcoal-100 mb-4 border-b pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="text-charcoal-900 text-sm font-semibold">{title}</span>
        {open ? (
          <ChevronUp className="text-charcoal-400 h-4 w-4" />
        ) : (
          <ChevronDown className="text-charcoal-400 h-4 w-4" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const shapes: DiamondShape[] = [
  'round',
  'oval',
  'cushion',
  'princess',
  'emerald',
  'pear',
  'radiant',
  'marquise',
  'asscher',
  'heart',
];

const shapeLabels: Record<DiamondShape, string> = {
  round: 'Round',
  oval: 'Oval',
  cushion: 'Cushion',
  princess: 'Princess',
  emerald: 'Emerald',
  pear: 'Pear',
  radiant: 'Radiant',
  marquise: 'Marquise',
  asscher: 'Asscher',
  heart: 'Heart',
};

const colors: DiamondColor[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const clarities: DiamondClarity[] = [
  'FL',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
  'I1',
  'I2',
  'I3',
];
const cuts: DiamondCut[] = ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair'];
const labs: CertificateLab[] = ['GIA', 'IGI', 'AGS', 'HRD', 'EGL'];
const fluorescences: DiamondFluorescence[] = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'];

export function DiamondFilters({ filters, onChange }: DiamondFiltersProps) {
  const toggleShape = (shape: DiamondShape) => {
    const current = filters.shapes || [];
    const next = current.includes(shape) ? current.filter((s) => s !== shape) : [...current, shape];
    onChange({ shapes: next.length > 0 ? next : undefined });
  };

  const toggleCut = (cut: DiamondCut) => {
    const current = filters.cutGrades || [];
    const next = current.includes(cut) ? current.filter((c) => c !== cut) : [...current, cut];
    onChange({ cutGrades: next.length > 0 ? next : undefined });
  };

  const toggleLab = (lab: CertificateLab) => {
    const current = filters.labs || [];
    const next = current.includes(lab) ? current.filter((l) => l !== lab) : [...current, lab];
    onChange({ labs: next.length > 0 ? next : undefined });
  };

  const toggleFluorescence = (f: DiamondFluorescence) => {
    const current = filters.fluorescence || [];
    const next = current.includes(f) ? current.filter((x) => x !== f) : [...current, f];
    onChange({ fluorescence: next.length > 0 ? next : undefined });
  };

  return (
    <div className="space-y-0">
      {/* Shape */}
      <FilterSection title="Diamond Shape">
        <div className="grid grid-cols-5 gap-1.5">
          {shapes.map((shape) => (
            <button
              key={shape}
              onClick={() => toggleShape(shape)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-all ${
                filters.shapes?.includes(shape)
                  ? 'border-gold-500 bg-gold-50 text-gold-700'
                  : 'border-charcoal-200 text-charcoal-600 hover:border-gold-300'
              }`}
            >
              <span className="text-sm">💎</span>
              <span className="text-center leading-tight">{shapeLabels[shape]}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price (₹)">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-charcoal-400 mb-1 block text-xs">Min</label>
              <input
                type="number"
                min="0"
                value={filters.priceMin || ''}
                onChange={(e) =>
                  onChange({ priceMin: e.target.value ? Number(e.target.value) : undefined })
                }
                className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-charcoal-400 mb-1 block text-xs">Max</label>
              <input
                type="number"
                min="0"
                value={filters.priceMax || ''}
                onChange={(e) =>
                  onChange({ priceMax: e.target.value ? Number(e.target.value) : undefined })
                }
                className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                placeholder="Any"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {[
              { label: 'Under ₹1L', max: 100000 },
              { label: '₹1L–₹3L', min: 100000, max: 300000 },
              { label: '₹3L–₹5L', min: 300000, max: 500000 },
              { label: '₹5L+', min: 500000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onChange({ priceMin: preset.min, priceMax: preset.max })}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  filters.priceMin === preset.min && filters.priceMax === preset.max
                    ? 'border-gold-500 bg-gold-50 text-gold-700'
                    : 'border-charcoal-200 text-charcoal-600 hover:border-gold-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Carat Weight */}
      <FilterSection title="Carat Weight">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-charcoal-400 mb-1 block text-xs">Min ct</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.caratMin || ''}
              onChange={(e) =>
                onChange({ caratMin: e.target.value ? Number(e.target.value) : undefined })
              }
              className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="text-charcoal-400 mb-1 block text-xs">Max ct</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.caratMax || ''}
              onChange={(e) =>
                onChange({ caratMax: e.target.value ? Number(e.target.value) : undefined })
              }
              className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              placeholder="Any"
            />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {['0.5', '0.75', '1.0', '1.5', '2.0+'].map((size) => (
            <button
              key={size}
              onClick={() => {
                if (size === '2.0+') {
                  onChange({ caratMin: 2 });
                } else {
                  const val = parseFloat(size);
                  onChange({ caratMin: val - 0.12, caratMax: val + 0.12 });
                }
              }}
              className="border-charcoal-200 text-charcoal-600 hover:border-gold-300 rounded-full border px-2.5 py-1 text-xs transition-colors"
            >
              {size}ct
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color Grade">
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  const fromIdx = colors.indexOf(color);
                  const toColor = filters.colorTo
                    ? colors.indexOf(filters.colorTo)
                    : colors.length - 1;
                  if (!filters.colorFrom || fromIdx <= colors.indexOf(filters.colorFrom)) {
                    onChange({ colorFrom: color });
                  } else {
                    onChange({ colorTo: color });
                  }
                }}
                className={`rounded border py-1.5 text-xs font-bold transition-colors ${
                  filters.colorFrom &&
                  filters.colorTo &&
                  colors.indexOf(color) >= colors.indexOf(filters.colorFrom) &&
                  colors.indexOf(color) <= colors.indexOf(filters.colorTo)
                    ? 'border-gold-500 bg-gold-100 text-gold-700'
                    : color === filters.colorFrom || color === filters.colorTo
                      ? 'border-gold-500 bg-gold-500 text-white'
                      : 'border-charcoal-200 text-charcoal-700 hover:border-gold-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          <div className="text-charcoal-400 flex justify-between gap-2 text-xs">
            <span>D (Colorless)</span>
            <span>M (Light)</span>
          </div>
          {(filters.colorFrom || filters.colorTo) && (
            <div className="flex items-center justify-between">
              <span className="text-charcoal-500 text-xs">
                {filters.colorFrom || 'D'} → {filters.colorTo || 'M'}
              </span>
              <button
                onClick={() => onChange({ colorFrom: undefined, colorTo: undefined })}
                className="text-charcoal-400 flex items-center gap-0.5 text-xs hover:text-red-500"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>
          )}
        </div>
      </FilterSection>

      {/* Clarity */}
      <FilterSection title="Clarity Grade">
        <div className="grid grid-cols-4 gap-1">
          {clarities.map((clarity) => (
            <button
              key={clarity}
              onClick={() => {
                const fromIdx = clarities.indexOf(clarity);
                if (!filters.clarityFrom) {
                  onChange({ clarityFrom: clarity });
                } else {
                  const curFromIdx = clarities.indexOf(filters.clarityFrom);
                  if (fromIdx <= curFromIdx) {
                    onChange({ clarityFrom: clarity });
                  } else {
                    onChange({ clarityTo: clarity });
                  }
                }
              }}
              className={`rounded border py-1.5 text-xs font-semibold transition-colors ${
                filters.clarityFrom &&
                filters.clarityTo &&
                clarities.indexOf(clarity) >= clarities.indexOf(filters.clarityFrom) &&
                clarities.indexOf(clarity) <= clarities.indexOf(filters.clarityTo)
                  ? 'border-gold-500 bg-gold-100 text-gold-700'
                  : clarity === filters.clarityFrom || clarity === filters.clarityTo
                    ? 'border-gold-500 bg-gold-500 text-white'
                    : 'border-charcoal-200 text-charcoal-700 hover:border-gold-300'
              }`}
            >
              {clarity}
            </button>
          ))}
        </div>
        {(filters.clarityFrom || filters.clarityTo) && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-charcoal-500 text-xs">
              {filters.clarityFrom || 'FL'} → {filters.clarityTo || 'I3'}
            </span>
            <button
              onClick={() => onChange({ clarityFrom: undefined, clarityTo: undefined })}
              className="text-charcoal-400 flex items-center gap-0.5 text-xs hover:text-red-500"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        )}
      </FilterSection>

      {/* Cut */}
      <FilterSection title="Cut Grade">
        <div className="space-y-1.5">
          {cuts.map((cut) => (
            <label key={cut} className="group flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.cutGrades?.includes(cut) || false}
                onChange={() => toggleCut(cut)}
                className="accent-gold-500"
              />
              <span className="text-charcoal-700 group-hover:text-gold-600 text-sm transition-colors">
                {cut}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Certificate */}
      <FilterSection title="Certificate">
        <div className="space-y-1.5">
          {labs.map((lab) => (
            <label key={lab} className="group flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.labs?.includes(lab) || false}
                onChange={() => toggleLab(lab)}
                className="accent-gold-500"
              />
              <span className="text-charcoal-700 group-hover:text-gold-600 text-sm transition-colors">
                {lab}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fluorescence */}
      <FilterSection title="Fluorescence" defaultOpen={false}>
        <div className="space-y-1.5">
          {fluorescences.map((f) => (
            <label key={f} className="group flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.fluorescence?.includes(f) || false}
                onChange={() => toggleFluorescence(f)}
                className="accent-gold-500"
              />
              <span className="text-charcoal-700 group-hover:text-gold-600 text-sm transition-colors">
                {f}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Lab Grown Toggle */}
      <FilterSection title="Diamond Type" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { label: 'All Diamonds', value: undefined },
            { label: 'Natural Only', value: false },
            { label: 'Lab Grown Only', value: true },
          ].map((option) => (
            <label key={String(option.value)} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="labGrown"
                checked={filters.labGrown === option.value}
                onChange={() => onChange({ labGrown: option.value })}
                className="accent-gold-500"
              />
              <span className="text-charcoal-700 text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Eye Clean */}
      <div className="pb-4">
        <label className="flex cursor-pointer items-center gap-3">
          <div
            onClick={() => onChange({ eyeClean: filters.eyeClean ? undefined : true })}
            className={`relative h-5 w-10 cursor-pointer rounded-full transition-colors ${
              filters.eyeClean ? 'bg-gold-500' : 'bg-charcoal-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                filters.eyeClean ? 'translate-x-5' : ''
              }`}
            />
          </div>
          <span className="text-charcoal-700 text-sm font-medium">Eye Clean Only</span>
        </label>
      </div>
    </div>
  );
}

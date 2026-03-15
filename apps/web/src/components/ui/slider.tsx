'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative flex h-6 items-center', className)}>
      <div className="bg-charcoal-200 relative h-1.5 w-full rounded-full">
        <div
          className="bg-gold-500 absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-6 w-full cursor-pointer opacity-0"
      />
      <div
        className="border-gold-500 pointer-events-none absolute h-5 w-5 rounded-full border-2 bg-white shadow-md transition-transform hover:scale-110"
        style={{ left: `calc(${pct}% - 10px)` }}
      />
    </div>
  );
}

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  className?: string;
  formatLabel?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  values,
  onChange,
  className,
  formatLabel,
}: RangeSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [low, high] = values;
  const lowPct = ((low - min) / (max - min)) * 100;
  const highPct = ((high - min) / (max - min)) * 100;

  const handleLowChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLow = Math.min(Number(e.target.value), high - step);
      onChange([newLow, high]);
    },
    [high, step, onChange]
  );

  const handleHighChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHigh = Math.max(Number(e.target.value), low + step);
      onChange([low, newHigh]);
    },
    [low, step, onChange]
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div ref={containerRef} className="relative flex h-6 items-center">
        {/* Track */}
        <div className="bg-charcoal-200 relative h-1.5 w-full rounded-full">
          <div
            className="bg-gold-500 absolute h-full rounded-full"
            style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
          />
        </div>

        {/* Low thumb input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLowChange}
          className="absolute inset-0 h-6 w-full cursor-pointer opacity-0"
          style={{ zIndex: low > max - (max - min) / 2 ? 5 : 3 }}
        />

        {/* High thumb input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHighChange}
          className="absolute inset-0 h-6 w-full cursor-pointer opacity-0"
          style={{ zIndex: high <= min + (max - min) / 2 ? 5 : 4 }}
        />

        {/* Low thumb visual */}
        <div
          className="border-gold-500 pointer-events-none absolute h-5 w-5 rounded-full border-2 bg-white shadow-md"
          style={{ left: `calc(${lowPct}% - 10px)`, zIndex: 2 }}
        />

        {/* High thumb visual */}
        <div
          className="border-gold-500 pointer-events-none absolute h-5 w-5 rounded-full border-2 bg-white shadow-md"
          style={{ left: `calc(${highPct}% - 10px)`, zIndex: 2 }}
        />
      </div>

      {/* Labels */}
      <div className="text-charcoal-500 flex justify-between text-xs">
        <span>{formatLabel ? formatLabel(low) : low}</span>
        <span>{formatLabel ? formatLabel(high) : high}</span>
      </div>
    </div>
  );
}

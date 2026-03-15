import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showLabel?: boolean;
  showOriginal?: number;
  prefix?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
  '2xl': 'text-4xl',
};

/**
 * Formats a number in Indian number system (lakhs, crores)
 */
function formatIndianCurrency(amount: number, currency = 'INR'): string {
  if (currency !== 'INR') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Use Indian locale
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns human readable abbreviated form: ₹1.25L, ₹2.5Cr etc.
 */
function getShortLabel(amount: number): string | null {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return null;
}

export function PriceDisplay({
  amount,
  currency = 'INR',
  size = 'md',
  className,
  showLabel = false,
  showOriginal,
  prefix,
}: PriceDisplayProps) {
  const formatted = formatIndianCurrency(amount, currency);
  const shortLabel = showLabel ? getShortLabel(amount) : null;

  return (
    <span className={cn('price font-bold tabular-nums', sizeClasses[size], className)}>
      {prefix && <span className="text-charcoal-400 mr-1 font-normal">{prefix}</span>}
      {formatted}
      {shortLabel && (
        <span className="text-charcoal-400 ml-1 text-xs font-normal">({shortLabel})</span>
      )}
      {showOriginal && showOriginal > amount && (
        <span className="text-charcoal-400 ml-2 text-xs font-normal line-through">
          {formatIndianCurrency(showOriginal, currency)}
        </span>
      )}
    </span>
  );
}

export function SavingsBadge({ original, current }: { original: number; current: number }) {
  const savings = original - current;
  const pct = Math.round((savings / original) * 100);

  if (savings <= 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      Save {pct}%
    </span>
  );
}

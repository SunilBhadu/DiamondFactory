import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-charcoal-900 text-white',
        secondary: 'bg-charcoal-100 text-charcoal-700',
        outline: 'border border-charcoal-300 text-charcoal-700',
        gold: 'bg-gold-500 text-white',
        'gold-light': 'bg-gold-100 text-gold-700 border border-gold-200',
        destructive: 'bg-red-500 text-white',
        'destructive-light': 'bg-red-100 text-red-700 border border-red-200',
        success: 'bg-emerald-500 text-white',
        'success-light': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        info: 'bg-blue-500 text-white',
        'info-light': 'bg-blue-100 text-blue-700 border border-blue-200',
        warning: 'bg-orange-500 text-white',
        'warning-light': 'bg-orange-100 text-orange-700 border border-orange-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };

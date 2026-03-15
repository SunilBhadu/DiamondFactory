import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'gold' | 'white' | 'charcoal';
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const colorClasses = {
  gold: 'border-gold-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  charcoal: 'border-charcoal-600 border-t-transparent',
};

export function LoadingSpinner({ size = 'md', color = 'gold', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full', sizeClasses[size], colorClasses[color], className)}
    />
  );
}

export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="xl" />
      {message && <p className="text-charcoal-600 animate-pulse font-medium">{message}</p>}
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="text-charcoal-500 flex items-center gap-2 text-sm">
      <LoadingSpinner size="sm" />
      {text && <span>{text}</span>}
    </div>
  );
}

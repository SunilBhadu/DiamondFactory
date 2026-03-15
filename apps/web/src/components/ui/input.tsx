import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-charcoal-700 mb-1.5 block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="text-charcoal-400 absolute top-1/2 left-3 -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'text-charcoal-900 placeholder:text-charcoal-400 w-full rounded-xl border px-4 py-3',
              'focus:ring-gold-500/30 focus:border-gold-500 focus:ring-2 focus:outline-none',
              'disabled:bg-charcoal-50 disabled:cursor-not-allowed disabled:opacity-60',
              'transition-colors duration-200',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-charcoal-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="text-charcoal-400 absolute top-1/2 right-3 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-charcoal-400 mt-1 text-xs">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

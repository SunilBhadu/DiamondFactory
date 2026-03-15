import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gold-500 hover:bg-gold-600 text-white shadow-luxury hover:shadow-luxury-hover',
        secondary: 'bg-charcoal-900 hover:bg-charcoal-800 text-white',
        outline:
          'border-2 border-charcoal-300 text-charcoal-700 hover:border-gold-500 hover:text-gold-600 bg-transparent',
        ghost: 'text-charcoal-700 hover:bg-charcoal-100 hover:text-charcoal-900',
        destructive: 'bg-red-500 hover:bg-red-600 text-white',
        link: 'text-gold-600 hover:text-gold-700 underline-offset-4 hover:underline p-0 h-auto',
        'outline-gold':
          'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white bg-transparent',
      },
      size: {
        sm: 'text-xs px-4 py-2 h-8',
        md: 'text-sm px-6 py-2.5 h-10',
        lg: 'text-base px-8 py-3.5 h-12',
        xl: 'text-lg px-10 py-4 h-14',
        icon: 'w-10 h-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : leftIcon ? (
              leftIcon
            ) : null}
            {children}
            {!isLoading && rightIcon ? rightIcon : null}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };

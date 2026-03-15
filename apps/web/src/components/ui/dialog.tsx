'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogContextValue {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextValue>({ onClose: () => {} });

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return <span onClick={onClick}>{children}</span>;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { onClose } = useContext(DialogContext);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        'animate-slide-up relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl',
        className
      )}
      {...props}
    >
      <button
        onClick={onClose}
        className="text-charcoal-400 hover:text-charcoal-700 absolute top-4 right-4 z-10 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-charcoal-100 border-b px-6 pt-6 pb-4', className)} {...props} />
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('font-display text-charcoal-900 pr-8 text-xl font-bold', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-charcoal-500 mt-1 text-sm', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-charcoal-50 border-charcoal-100 flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

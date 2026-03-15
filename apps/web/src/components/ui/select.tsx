'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  setLabel: (label: string) => void;
}

const SelectContext = createContext<SelectContextValue>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  label: '',
  setLabel: () => {},
});

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, defaultValue, onValueChange, children, disabled }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleChange,
        open,
        setOpen: disabled ? () => {} : setOpen,
        label,
        setLabel,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

export function SelectTrigger({ className, placeholder, ...props }: SelectTriggerProps) {
  const { open, setOpen, value } = useContext(SelectContext);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'border-charcoal-300 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm',
        'focus:ring-gold-500/30 focus:border-gold-500 focus:ring-2 focus:outline-none',
        'hover:border-charcoal-400 bg-white transition-colors',
        open && 'border-gold-500 ring-gold-500/30 ring-2',
        className
      )}
      {...props}
    >
      <SelectValue placeholder={placeholder} />
      <ChevronDown
        className={cn('text-charcoal-400 h-4 w-4 transition-transform', open && 'rotate-180')}
      />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, label } = useContext(SelectContext);
  return (
    <span className={value ? 'text-charcoal-900' : 'text-charcoal-400'}>
      {label || value || placeholder || 'Select...'}
    </span>
  );
}

export function SelectContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SelectContext);

  if (!open) return null;

  return (
    <div className="relative">
      <div
        className={cn(
          'border-charcoal-200 animate-slide-down absolute top-1 right-0 left-0 z-50 max-h-64 overflow-y-auto rounded-xl border bg-white py-1 shadow-xl',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const { value: selected, onValueChange, setLabel } = useContext(SelectContext);
  const isSelected = selected === value;

  const handleClick = () => {
    onValueChange(value);
    if (typeof children === 'string') setLabel(children);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors',
        isSelected
          ? 'bg-gold-50 text-gold-700 font-medium'
          : 'text-charcoal-700 hover:bg-charcoal-50',
        className
      )}
      {...props}
    >
      {children}
      {isSelected && <Check className="text-gold-600 h-4 w-4" />}
    </div>
  );
}

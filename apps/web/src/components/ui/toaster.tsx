'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, type?: ToastType, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const toastIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-orange-500',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300',
        toastStyles[toast.type],
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconStyles[toast.type])} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-current opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useContext(ToastContext);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={() => dismiss(toast.id)} />
        </div>
      ))}
    </div>
  );
}

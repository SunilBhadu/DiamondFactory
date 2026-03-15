'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Diamond,
  Package,
  Users,
  Tag,
  Settings,
  BarChart3,
  ShoppingCart,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Diamonds', href: '/admin/diamonds', icon: Diamond },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Products', href: '/admin/products', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'staff'))) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-gold-500 h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-charcoal-50 flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-charcoal-950 flex w-64 shrink-0 flex-col text-white">
        <div className="border-charcoal-800 border-b p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Diamond className="text-gold-400 h-5 w-5" />
            <div>
              <p className="font-display text-sm font-bold text-white">Diamond Factory</p>
              <p className="text-charcoal-400 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-500 text-white'
                    : 'text-charcoal-400 hover:bg-charcoal-800 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-charcoal-800 border-t p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="bg-gold-500 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
              {user?.firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-charcoal-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="text-charcoal-400 flex w-full items-center gap-2 text-sm transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

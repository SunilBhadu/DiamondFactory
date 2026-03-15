'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Heart,
  Diamond,
  User,
  MapPin,
  Star,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', href: '/orders', icon: Package },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Saved Rings', href: '/saved-rings', icon: Diamond },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Addresses', href: '/addresses', icon: MapPin },
];

const recentOrders = [
  {
    id: 'DF-2025-001',
    date: 'Jan 10, 2025',
    item: '1.01ct Round Diamond Ring',
    total: '₹3,45,000',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'DF-2024-089',
    date: 'Dec 22, 2024',
    item: '0.75ct Oval Lab Grown Diamond',
    total: '₹1,25,000',
    status: 'Shipped',
    statusColor: 'bg-blue-100 text-blue-700',
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-gold-500 h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="bg-charcoal-50 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="shadow-card rounded-2xl bg-white p-6">
              {/* User info */}
              <div className="border-charcoal-100 mb-6 flex items-center gap-3 border-b pb-6">
                <div className="bg-gold-100 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-gold-700 text-lg font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-charcoal-900 font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-charcoal-400 text-xs">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-charcoal-600 hover:bg-gold-50 hover:text-gold-700 group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Welcome */}
            <div className="from-charcoal-950 to-charcoal-800 rounded-2xl bg-gradient-to-r p-8 text-white">
              <p className="text-gold-400 mb-2 text-sm">Welcome back</p>
              <h1 className="font-display mb-2 text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-charcoal-300">
                Member since {new Date(user.createdAt).getFullYear()}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Orders', value: '3', icon: ShoppingBag },
                { label: 'Wishlist Items', value: '7', icon: Heart },
                { label: 'Saved Rings', value: '2', icon: Diamond },
                { label: 'Reviews', value: '1', icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="shadow-card rounded-xl bg-white p-5 text-center">
                  <stat.icon className="text-gold-500 mx-auto mb-2 h-6 w-6" />
                  <p className="font-display text-charcoal-900 text-2xl font-bold">{stat.value}</p>
                  <p className="text-charcoal-400 mt-1 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="shadow-card overflow-hidden rounded-2xl bg-white">
              <div className="border-charcoal-100 flex items-center justify-between border-b p-6">
                <h2 className="font-display text-charcoal-900 text-lg font-bold">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="text-gold-600 hover:text-gold-700 flex items-center gap-1 text-sm font-medium"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-charcoal-100 divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-charcoal-900 text-sm font-semibold">{order.id}</p>
                      <p className="text-charcoal-500 text-sm">{order.item}</p>
                      <p className="text-charcoal-400 mt-1 text-xs">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-charcoal-900 font-bold">{order.total}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="shadow-card rounded-2xl bg-white p-6">
              <h2 className="font-display text-charcoal-900 mb-4 text-lg font-bold">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/diamonds"
                  className="border-charcoal-200 hover:border-gold-500 hover:bg-gold-50 group flex items-center gap-3 rounded-xl border p-4 transition-all"
                >
                  <Diamond className="text-gold-500 h-5 w-5" />
                  <div>
                    <p className="text-charcoal-900 text-sm font-medium">Browse Diamonds</p>
                    <p className="text-charcoal-400 text-xs">50,000+ certified gems</p>
                  </div>
                </Link>
                <Link
                  href="/build-your-ring"
                  className="border-charcoal-200 hover:border-gold-500 hover:bg-gold-50 group flex items-center gap-3 rounded-xl border p-4 transition-all"
                >
                  <Star className="text-gold-500 h-5 w-5" />
                  <div>
                    <p className="text-charcoal-900 text-sm font-medium">Build a Ring</p>
                    <p className="text-charcoal-400 text-xs">Start from scratch</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

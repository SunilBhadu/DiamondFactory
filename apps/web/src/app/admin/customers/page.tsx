'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  _count: { orders: number };
  totalSpent?: number;
}

function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <tr className="border-charcoal-100 hover:bg-charcoal-50 border-b transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-gold-100 text-gold-700 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <div>
            <p className="text-charcoal-900 font-medium">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-charcoal-500 flex items-center gap-1 text-xs">
              <Mail className="h-3 w-3" /> {customer.email}
            </p>
          </div>
        </div>
      </td>
      <td className="text-charcoal-600 px-4 py-3 text-sm">
        {customer.phone ? (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> {customer.phone}
          </span>
        ) : (
          <span className="text-charcoal-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="text-charcoal-600 flex items-center gap-1 text-sm">
          <ShoppingBag className="h-3 w-3" /> {customer._count.orders} orders
        </span>
      </td>
      <td className="text-charcoal-900 px-4 py-3 text-sm font-medium">
        {customer.totalSpent ? formatPrice(customer.totalSpent) : '—'}
      </td>
      <td className="px-4 py-3">
        <Badge variant={customer.emailVerified ? 'default' : 'secondary'} className="text-xs">
          {customer.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      </td>
      <td className="text-charcoal-500 flex items-center gap-1 px-4 py-3 text-xs">
        <Calendar className="h-3 w-3" />
        {new Date(customer.createdAt).toLocaleDateString('en-IN')}
      </td>
      <td className="px-4 py-3">
        <Button variant="ghost" size="sm" asChild>
          <a href={`/admin/customers/${customer.id}`}>View</a>
        </Button>
      </td>
    </tr>
  );
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: () =>
      apiClient.get('/users', { params: { search, page, limit: 20 } }).then((r) => r.data),
  });

  const customers: Customer[] = data?.users ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-charcoal-900 text-2xl font-bold">Customers</h1>
          <p className="text-charcoal-500 text-sm">{total.toLocaleString()} registered customers</p>
        </div>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="text-charcoal-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border-charcoal-200 focus:ring-gold-400 w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="border-charcoal-200 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-charcoal-100 bg-charcoal-50 text-charcoal-500 border-b text-xs font-semibold tracking-wide uppercase">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              : customers.map((c) => <CustomerRow key={c.id} customer={c} />)}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="text-charcoal-500 mt-4 flex items-center justify-between text-sm">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

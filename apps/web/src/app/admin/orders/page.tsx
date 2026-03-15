'use client';

import { useState } from 'react';
import { Search, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const mockOrders = [
  {
    id: 'DF-2025-127',
    date: new Date('2025-01-14'),
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    items: '1.01ct Round Diamond Ring',
    total: 345000,
    status: 'confirmed',
  },
  {
    id: 'DF-2025-126',
    date: new Date('2025-01-13'),
    customer: 'Rahul Gupta',
    email: 'rahul@example.com',
    items: '0.75ct Oval Lab Grown Diamond',
    total: 125000,
    status: 'shipped',
  },
  {
    id: 'DF-2025-125',
    date: new Date('2025-01-13'),
    customer: 'Deepika Nair',
    email: 'deepika@example.com',
    items: '1.50ct Emerald Diamond Ring',
    total: 785000,
    status: 'pending',
  },
  {
    id: 'DF-2025-124',
    date: new Date('2025-01-12'),
    customer: 'Amir Khan',
    email: 'amir@example.com',
    items: '0.90ct Cushion Diamond',
    total: 195000,
    status: 'delivered',
  },
  {
    id: 'DF-2025-123',
    date: new Date('2025-01-12'),
    customer: 'Sunita Patel',
    email: 'sunita@example.com',
    items: '2.01ct Round Diamond Ring',
    total: 1250000,
    status: 'confirmed',
  },
  {
    id: 'DF-2025-122',
    date: new Date('2025-01-11'),
    customer: 'Vikram Singh',
    email: 'vikram@example.com',
    items: '0.60ct Heart Lab Diamond',
    total: 78000,
    status: 'delivered',
  },
  {
    id: 'DF-2025-121',
    date: new Date('2025-01-10'),
    customer: 'Meera Iyer',
    email: 'meera@example.com',
    items: '1.20ct Princess Diamond',
    total: 320000,
    status: 'cancelled',
  },
  {
    id: 'DF-2025-120',
    date: new Date('2025-01-09'),
    customer: 'Rohan Mehta',
    email: 'rohan@example.com',
    items: '0.85ct Pear Diamond Pendant',
    total: 165000,
    status: 'delivered',
  },
];

const statusTabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  in_production: 'bg-orange-100 text-orange-700 border-orange-200',
  quality_check: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  refunded: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockOrders.filter((o) => {
    const matchesTab = activeTab === 'All' || o.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-charcoal-900 text-2xl font-bold">Orders</h1>
          <p className="text-charcoal-500 mt-1 text-sm">{filtered.length} orders</p>
        </div>
        <button className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Status tabs */}
      <div className="bg-charcoal-100 mb-4 flex w-fit gap-1 rounded-xl p-1">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-charcoal-900 bg-white shadow-sm'
                : 'text-charcoal-500 hover:text-charcoal-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="shadow-card mb-4 rounded-2xl bg-white p-4">
        <div className="relative max-w-md">
          <Search className="text-charcoal-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, email..."
            className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="shadow-card overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-50 border-charcoal-100 border-b">
              <tr>
                {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-charcoal-500 px-4 py-3 text-left text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-charcoal-100 divide-y">
              {filtered.slice((page - 1) * perPage, page * perPage).map((order) => (
                <tr key={order.id} className="hover:bg-charcoal-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-gold-700 text-sm font-bold">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-600 text-sm">{formatDate(order.date)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-charcoal-900 text-sm font-medium">{order.customer}</p>
                    <p className="text-charcoal-400 text-xs">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-700 block max-w-xs truncate text-sm">
                      {order.items}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[order.status] || 'border-gray-200 bg-gray-100 text-gray-600'}`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="text-charcoal-400 rounded-lg p-1.5 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        className="border-charcoal-300 focus:border-gold-500 text-charcoal-700 rounded-lg border px-2 py-1 text-xs focus:outline-none"
                        value={order.status}
                        onChange={() => {}}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_production">In Production</option>
                        <option value="quality_check">Quality Check</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-charcoal-100 flex items-center justify-between border-t p-4">
          <p className="text-charcoal-500 text-sm">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="border-charcoal-300 hover:border-gold-500 rounded-lg border p-2 transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(Math.ceil(filtered.length / perPage), page + 1))}
              disabled={page >= Math.ceil(filtered.length / perPage)}
              className="border-charcoal-300 hover:border-gold-500 rounded-lg border p-2 transition-colors disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

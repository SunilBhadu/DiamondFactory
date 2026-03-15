'use client';

import { useState } from 'react';
import {
  Search,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { formatPrice, formatCarat } from '@/lib/utils';

const mockDiamonds = [
  {
    id: '1',
    sku: 'DF-RND-101',
    shape: 'Round',
    carat: 1.01,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 285000,
    status: true,
    lab: 'GIA',
    labGrown: false,
  },
  {
    id: '2',
    sku: 'DF-OVL-089',
    shape: 'Oval',
    carat: 0.89,
    color: 'G',
    clarity: 'VS2',
    cut: 'Excellent',
    price: 185000,
    status: true,
    lab: 'IGI',
    labGrown: true,
  },
  {
    id: '3',
    sku: 'DF-CUS-120',
    shape: 'Cushion',
    carat: 1.2,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Ideal',
    price: 420000,
    status: true,
    lab: 'GIA',
    labGrown: false,
  },
  {
    id: '4',
    sku: 'DF-PRI-075',
    shape: 'Princess',
    carat: 0.75,
    color: 'H',
    clarity: 'SI1',
    cut: 'Very Good',
    price: 98000,
    status: false,
    lab: 'IGI',
    labGrown: true,
  },
  {
    id: '5',
    sku: 'DF-EMR-150',
    shape: 'Emerald',
    carat: 1.5,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 560000,
    status: true,
    lab: 'GIA',
    labGrown: false,
  },
  {
    id: '6',
    sku: 'DF-PEA-085',
    shape: 'Pear',
    carat: 0.85,
    color: 'G',
    clarity: 'VS2',
    cut: 'Very Good',
    price: 145000,
    status: true,
    lab: 'IGI',
    labGrown: true,
  },
  {
    id: '7',
    sku: 'DF-RND-202',
    shape: 'Round',
    carat: 2.02,
    color: 'D',
    clarity: 'FL',
    cut: 'Ideal',
    price: 1850000,
    status: true,
    lab: 'GIA',
    labGrown: false,
  },
  {
    id: '8',
    sku: 'DF-HRT-060',
    shape: 'Heart',
    carat: 0.6,
    color: 'H',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 78000,
    status: true,
    lab: 'IGI',
    labGrown: true,
  },
];

export default function AdminDiamondsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockDiamonds.filter(
    (d) =>
      d.sku.toLowerCase().includes(search.toLowerCase()) ||
      d.shape.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-charcoal-900 text-2xl font-bold">Diamond Catalog</h1>
          <p className="text-charcoal-500 mt-1 text-sm">
            {filtered.length} diamonds · Last synced 2 hours ago
          </p>
        </div>
        <div className="flex gap-3">
          <button className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors">
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button className="bg-gold-500 hover:bg-gold-600 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors">
            <Plus className="h-4 w-4" />
            Add Diamond
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="shadow-card mb-4 flex items-center gap-3 rounded-2xl bg-white p-4">
        <div className="relative max-w-md flex-1">
          <Search className="text-charcoal-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, shape..."
            className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:outline-none"
          />
        </div>
        <select className="border-charcoal-300 focus:border-gold-500 rounded-xl border px-3 py-2 text-sm focus:outline-none">
          <option>All Shapes</option>
          {['Round', 'Oval', 'Cushion', 'Princess', 'Emerald', 'Pear', 'Heart'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="border-charcoal-300 focus:border-gold-500 rounded-xl border px-3 py-2 text-sm focus:outline-none">
          <option>All Labs</option>
          <option>GIA</option>
          <option>IGI</option>
          <option>AGS</option>
        </select>
        <select className="border-charcoal-300 focus:border-gold-500 rounded-xl border px-3 py-2 text-sm focus:outline-none">
          <option>All Types</option>
          <option>Natural</option>
          <option>Lab Grown</option>
        </select>
      </div>

      {/* Table */}
      <div className="shadow-card overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-50 border-charcoal-100 border-b">
              <tr>
                {[
                  'SKU',
                  'Shape',
                  'Carat',
                  'Color',
                  'Clarity',
                  'Cut',
                  'Price',
                  'Type',
                  'Status',
                  'Actions',
                ].map((col) => (
                  <th
                    key={col}
                    className="text-charcoal-500 px-4 py-3 text-left text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-charcoal-100 divide-y">
              {filtered.slice((page - 1) * perPage, page * perPage).map((d) => (
                <tr key={d.id} className="hover:bg-charcoal-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 font-mono text-sm">{d.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-medium">{d.shape}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-700 text-sm">{formatCarat(d.carat)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">{d.color}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">{d.clarity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-700 text-sm">{d.cut}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">
                      {formatPrice(d.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${d.lab === 'GIA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {d.lab}
                      </span>
                      <span
                        className={`w-fit rounded-full px-2 py-0.5 text-xs ${d.labGrown ? 'bg-emerald-100 text-emerald-700' : 'bg-charcoal-100 text-charcoal-600'}`}
                      >
                        {d.labGrown ? 'Lab' : 'Natural'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${d.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {d.status ? 'Available' : 'Unavailable'}
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
                      <button
                        className="text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg p-1.5 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className={`rounded-lg p-1.5 transition-colors ${d.status ? 'text-charcoal-400 hover:bg-red-50 hover:text-red-500' : 'text-charcoal-400 hover:bg-green-50 hover:text-green-600'}`}
                        title={d.status ? 'Deactivate' : 'Activate'}
                      >
                        {d.status ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </button>
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

import {
  TrendingUp,
  Package,
  Users,
  Diamond,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const kpis = [
  {
    title: 'Revenue (This Month)',
    value: '₹48,75,000',
    change: '+23.5%',
    up: true,
    icon: TrendingUp,
    color: 'bg-gold-100 text-gold-600',
  },
  {
    title: 'New Orders',
    value: '127',
    change: '+12.1%',
    up: true,
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Active Customers',
    value: '3,482',
    change: '+8.3%',
    up: true,
    icon: Users,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Diamonds in Catalog',
    value: '52,341',
    change: '+1,200',
    up: true,
    icon: Diamond,
    color: 'bg-purple-100 text-purple-600',
  },
];

const recentOrders = [
  {
    id: 'DF-2025-127',
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    items: '1.01ct Round Diamond Ring',
    total: 345000,
    status: 'confirmed',
    date: 'Jan 14, 2025',
  },
  {
    id: 'DF-2025-126',
    customer: 'Rahul Gupta',
    email: 'rahul@example.com',
    items: '0.75ct Oval Diamond',
    total: 125000,
    status: 'shipped',
    date: 'Jan 13, 2025',
  },
  {
    id: 'DF-2025-125',
    customer: 'Deepika Nair',
    email: 'deepika@example.com',
    items: '1.50ct Emerald Diamond Ring',
    total: 785000,
    status: 'pending',
    date: 'Jan 13, 2025',
  },
  {
    id: 'DF-2025-124',
    customer: 'Amir Khan',
    email: 'amir@example.com',
    items: '0.90ct Cushion Diamond',
    total: 195000,
    status: 'delivered',
    date: 'Jan 12, 2025',
  },
  {
    id: 'DF-2025-123',
    customer: 'Sunita Patel',
    email: 'sunita@example.com',
    items: '2.01ct Round Diamond Ring',
    total: 1250000,
    status: 'confirmed',
    date: 'Jan 12, 2025',
  },
];

const lowStockAlerts = [
  { sku: 'SET-ARIA-PLT', name: 'Aria Solitaire (Platinum)', stock: 2 },
  { sku: 'SET-CELESTIAL-WG', name: 'Celestial Halo (White Gold)', stock: 1 },
  { sku: 'SET-VINTAGE-YG', name: 'Vintage Milgrain (Yellow Gold)', stock: 3 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Simple SVG revenue chart
function RevenueChart() {
  const data = [32, 45, 38, 52, 48, 65, 72, 58, 80, 75, 90, 88];
  const max = Math.max(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ');

  return (
    <div className="relative h-32">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={100 - (v / max) * 100}
            r="1.5"
            fill="#d4af37"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="text-charcoal-400 absolute right-0 bottom-0 left-0 flex justify-between text-xs">
        {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(
          (m) => (
            <span key={m}>{m}</span>
          )
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-charcoal-900 text-2xl font-bold">Dashboard</h1>
        <p className="text-charcoal-500 mt-1 text-sm">Diamond Factory Admin · January 2025</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="shadow-card rounded-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  kpi.up ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="font-display text-charcoal-900 mb-1 text-2xl font-bold">{kpi.value}</p>
            <p className="text-charcoal-400 text-xs">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="shadow-card rounded-2xl bg-white p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-charcoal-900 font-bold">Revenue (12 Months)</h2>
            <span className="text-charcoal-400 bg-charcoal-50 rounded-lg px-2 py-1 text-xs">
              ₹ INR
            </span>
          </div>
          <RevenueChart />
        </div>

        {/* Low Stock */}
        <div className="shadow-card rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h2 className="font-display text-charcoal-900 font-bold">Low Stock Alerts</h2>
          </div>
          <div className="space-y-3">
            {lowStockAlerts.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 p-3"
              >
                <div>
                  <p className="text-charcoal-900 text-sm font-medium">{item.name}</p>
                  <p className="text-charcoal-400 text-xs">{item.sku}</p>
                </div>
                <span className="text-sm font-bold text-orange-600">{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="shadow-card overflow-hidden rounded-2xl bg-white">
        <div className="border-charcoal-100 flex items-center justify-between border-b p-6">
          <h2 className="font-display text-charcoal-900 font-bold">Recent Orders</h2>
          <a href="/admin/orders" className="text-gold-600 hover:text-gold-700 text-sm font-medium">
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-50 border-charcoal-100 border-b">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((col) => (
                  <th
                    key={col}
                    className="text-charcoal-500 px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-charcoal-100 divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-charcoal-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-charcoal-900 text-sm font-medium">{order.customer}</p>
                    <p className="text-charcoal-400 text-xs">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-charcoal-700 max-w-xs truncate text-sm">{order.items}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-900 text-sm font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-charcoal-500 text-sm">{order.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

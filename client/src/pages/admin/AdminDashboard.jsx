import React from 'react';
import { Package, FolderTree, ShoppingBag, TrendingUp } from 'lucide-react';
import Badge from '../../components/common/Badge';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '25', icon: Package, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Categories', value: '5', icon: FolderTree, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Orders', value: '12', icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Active Revenue', value: '₹14,250', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Store overview, catalog metrics, and quick admin controls
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Admin Features Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm">
            <span className="font-medium text-slate-700">Category Management (CRUD)</span>
            <Badge status="Confirmed">Phase 10a</Badge>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm">
            <span className="font-medium text-slate-700">Product Management (CRUD & Stock)</span>
            <Badge status="Confirmed">Phase 10b</Badge>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm">
            <span className="font-medium text-slate-700">Order Management & Status Controls</span>
            <Badge status="Confirmed">Phase 10b</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

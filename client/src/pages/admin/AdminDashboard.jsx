import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Package,
  FolderTree,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Plus,
  Store,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" message="Loading admin metrics & statistics..." />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'text-indigo-600 bg-indigo-50',
      link: '/admin/products',
    },
    {
      label: 'Categories',
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      color: 'text-purple-600 bg-purple-50',
      link: '/admin/categories',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'text-emerald-600 bg-emerald-50',
      link: '/admin/orders',
    },
    {
      label: 'Gross Sales',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            Overview
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time overview of store inventory, orders, and fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/">
            <Button variant="secondary" size="sm" icon={Store}>
              Storefront
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="primary" size="sm" icon={Plus}>
              New Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const CardContent = (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );

          return card.link ? (
            <Link key={card.label} to={card.link} className="block group">
              {CardContent}
            </Link>
          ) : (
            <div key={card.label}>{CardContent}</div>
          );
        })}
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest purchases placed through the storefront</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-xl">
                    Order ID
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-3 rounded-r-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-800">
                      #{ord._id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {ord.shippingAddress?.name || 'Customer'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={ord.status} dot size="sm">
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-slate-400">
            No recent orders recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingBag,
  ArrowLeft,
  Store,
} from 'lucide-react';

const Sidebar = ({ className = '', onItemClick }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-purple-600 text-white shadow-sm font-semibold'
        : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
    }`;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree, end: false },
    { to: '/admin/products', label: 'Products', icon: Package, end: false },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, end: false },
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            Admin Console
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Management</h2>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onItemClick}
                className={navLinkClass}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Return to public storefront */}
      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

const AdminOrders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review customer orders, inspect COD details, and update fulfillment statuses
        </p>
      </div>

      <EmptyState
        icon={ShoppingBag}
        title="Orders Management"
        message="Order fulfillment list and status dropdowns (Pending, Confirmed, Shipped, Delivered, Cancelled) will be active in Phase 10b."
      />
    </div>
  );
};

export default AdminOrders;

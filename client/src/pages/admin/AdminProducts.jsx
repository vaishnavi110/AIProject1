import React from 'react';
import EmptyState from '../../components/common/EmptyState';
import { Package } from 'lucide-react';

const AdminProducts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Products</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create, update inventory, edit pricing, and remove catalog items
        </p>
      </div>

      <EmptyState
        icon={Package}
        title="Products Management"
        message="Product CRUD table and inventory modification modals will be active in Phase 10b."
      />
    </div>
  );
};

export default AdminProducts;

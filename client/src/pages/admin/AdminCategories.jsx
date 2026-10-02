import React from 'react';
import EmptyState from '../../components/common/EmptyState';
import { FolderTree } from 'lucide-react';

const AdminCategories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Categories</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create, edit, and organize product categories across the storefront
        </p>
      </div>

      <EmptyState
        icon={FolderTree}
        title="Category Management"
        message="Full Category CRUD APIs and management table will be active in Phase 10a."
      />
    </div>
  );
};

export default AdminCategories;

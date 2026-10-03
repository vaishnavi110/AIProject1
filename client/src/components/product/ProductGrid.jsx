import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No Products Found',
  emptyMessage = 'We could not find any items matching your selected criteria.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3"
          >
            <div className="aspect-square w-full bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 bg-slate-200 rounded w-16" />
              <div className="h-8 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={onResetFilters ? 'Clear Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

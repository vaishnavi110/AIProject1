import React, { useState } from 'react';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import { Search, Filter, ShoppingBag } from 'lucide-react';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Fashion', 'Footwear', 'Home & Kitchen'];

  return (
    <div className="py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore our curated catalog of quality items at verified prices.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Search products by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Container / Empty State */}
        <EmptyState
          icon={ShoppingBag}
          title="Catalog Loading & Phase Setup"
          message="Frontend routing and common components are active. Product integration will connect to backend APIs in Phase 8."
          actionLabel="Return Home"
          actionLink="/"
        />
      </Container>
    </div>
  );
};

export default ProductsPage;

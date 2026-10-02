import React from 'react';
import { Layers } from 'lucide-react';

const CategoryFilter = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 ${className}`}
    >
      {/* "All" Category Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory('All')}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 focus:outline-none ${
          selectedCategory === 'All'
            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
            : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>All Items</span>
      </button>

      {/* Dynamic Categories */}
      {categories.map((cat) => {
        const catId = cat._id || cat.name;
        const isActive =
          selectedCategory === cat._id ||
          selectedCategory === cat.name;

        return (
          <button
            key={catId}
            type="button"
            onClick={() => onSelectCategory(cat._id || cat.name)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 focus:outline-none ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

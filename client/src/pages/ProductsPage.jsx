import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import ProductGrid from '../components/product/ProductGrid';
import CategoryFilter from '../components/product/CategoryFilter';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { Search, RotateCcw } from 'lucide-react';
import Button from '../components/common/Button';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter from URL params if present
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  const debounceTimeoutRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Sync state if URL search params change externally
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchTerm(s);
  }, [searchParams]);

  // Fetch filtered products
  const fetchProducts = useCallback(async (cat, search) => {
    try {
      setLoading(true);
      const params = {};
      if (cat && cat !== 'All') params.category = cat;
      if (search && search.trim()) params.search = search.trim();

      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch filtered products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search and category filter update
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      // Update URL query parameters
      const newParams = {};
      if (selectedCategory && selectedCategory !== 'All') {
        newParams.category = selectedCategory;
      }
      if (searchTerm && searchTerm.trim()) {
        newParams.search = searchTerm.trim();
      }
      setSearchParams(newParams, { replace: true });

      fetchProducts(selectedCategory, searchTerm);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [selectedCategory, searchTerm, fetchProducts, setSearchParams]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSearchParams({}, { replace: true });
  };

  const isFiltered = selectedCategory !== 'All' || Boolean(searchTerm.trim());

  return (
    <div className="py-8 space-y-8">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Store Catalog
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Browse Products
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} available for delivery
            </p>
          </div>

          {/* Reset Filters CTA if filter is active */}
          {isFiltered && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilters}
              icon={RotateCcw}
              className="self-start md:self-auto"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          <div className="max-w-xl">
            <Input
              type="text"
              placeholder="Search products by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              autoComplete="off"
            />
          </div>

          {/* Category Filter Pills */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          emptyTitle="No matching products"
          emptyMessage={`No items found matching "${searchTerm || selectedCategory}". Try adjusting your query.`}
          onResetFilters={isFiltered ? handleResetFilters : undefined}
        />
      </Container>
    </div>
  );
};

export default ProductsPage;

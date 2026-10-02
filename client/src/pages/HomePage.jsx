import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import ProductGrid from '../components/product/ProductGrid';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  Layers,
  Smartphone,
  Shirt,
  Footprints,
  Home,
} from 'lucide-react';

const HomePage = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          categoryService.getCategories(),
        ]);
        setLatestProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('elect')) return Smartphone;
    if (lower.includes('fash')) return Shirt;
    if (lower.includes('foot') || lower.includes('shoe')) return Footprints;
    if (lower.includes('home') || lower.includes('kitchen')) return Home;
    return Layers;
  };

  return (
    <div className="py-6 sm:py-10 space-y-16">
      <Container>
        {/* Modern Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Next-Gen MERN Storefront</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Curated Products at{' '}
              <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Exceptional Value
              </span>
            </h1>

            <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-xl">
              Discover top-rated electronics, seasonal fashion, and everyday essentials with
              reliable Cash on Delivery and server-validated pricing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg shadow-indigo-950/20 font-semibold"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Categories Carousel / Cards */}
        {categories.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Featured Categories
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Browse items categorized by industry leading quality
                </p>
              </div>
              <Link
                to="/products"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.name);
                return (
                  <Link
                    key={cat._id}
                    to={`/products?category=${encodeURIComponent(cat._id || cat.name)}`}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {cat.description || 'Explore products'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Latest Products Section */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Latest Products
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Fresh arrivals in stock and ready for immediate delivery
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={latestProducts} loading={loading} />

          <div className="mt-10 text-center">
            <Link to="/products">
              <Button variant="outline" size="lg">
                <span>View Complete Store Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200/80">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Instant Fulfillment</h3>
            <p className="text-sm text-slate-500">
              Orders are packaged and dispatched directly upon confirmation with full tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Price Protection</h3>
            <p className="text-sm text-slate-500">
              Zero surprises at checkout. Prices are authenticated by MongoDB server logic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Cash on Delivery</h3>
            <p className="text-sm text-slate-500">
              Enjoy complete peace of mind with safe Cash on Delivery across all serviceable zipcodes.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;

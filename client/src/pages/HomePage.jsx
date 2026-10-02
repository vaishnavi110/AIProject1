import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="py-8 space-y-12">
      <Container>
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Next-Gen MERN E-Commerce</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Discover Quality Products at{' '}
              <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Unbeatable Prices
              </span>
            </h1>

            <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed">
              Explore curated electronics, fashion trends, and everyday lifestyle essentials with
              reliable Cash on Delivery and tamper-proof real-time pricing.
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

        {/* Feature Badges Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Instant Catalog Navigation</h3>
            <p className="text-sm text-slate-500">
              Filter by category, search by product name, and enjoy lightning-fast browsing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Stock Protection</h3>
            <p className="text-sm text-slate-500">
              Strict inventory validation stops over-ordering and guarantees product availability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Cash on Delivery</h3>
            <p className="text-sm text-slate-500">
              Convenient and risk-free payment directly at your doorstep upon order arrival.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Banknote, Heart } from 'lucide-react';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-600">
      {/* Feature highlights banner */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-6">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Reliable Delivery</h4>
                <p className="text-xs text-slate-500">Quick dispatch with real-time tracking</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Cash on Delivery</h4>
                <p className="text-xs text-slate-500">Pay when your order reaches your door</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Tamper-Proof Pricing</h4>
                <p className="text-xs text-slate-500">Guaranteed authentic server-verified prices</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main footer navigation */}
      <div className="py-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900">ShopEase</span>
              </div>
              <p className="text-sm text-slate-500 max-w-sm">
                Your premier destination for high-quality electronics, fashion, and lifestyle
                essentials. Engineered for seamless shopping and dependable customer satisfaction.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h5 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-3">
                Explore
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-indigo-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-indigo-600 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-indigo-600 transition-colors">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Account */}
            <div>
              <h5 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-3">
                Account
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-indigo-600 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-indigo-600 transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="hover:text-indigo-600 transition-colors">
                    Order History
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} ShopEase Demo Project. Built with MERN Stack.</p>
            <p className="flex items-center gap-1">
              Developed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Project
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

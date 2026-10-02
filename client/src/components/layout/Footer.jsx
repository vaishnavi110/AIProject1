import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>StyleStore</span>
            </div>
            <p className="text-sm text-slate-400">
              Your one-stop destination for modern fashion, accessories, and lifestyle products.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">All Products</a></li>
              <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition">Featured</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Team</h4>
            <p className="text-sm text-slate-400">
              Built with ❤️ by Sayali, Shweta & Vaishnavi.
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} StyleStore MERN E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

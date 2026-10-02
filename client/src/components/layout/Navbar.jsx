import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight hover:opacity-90 transition">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span>StyleStore</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition">
            Home
          </Link>
          <Link to="/products" className="text-slate-600 hover:text-indigo-600 font-medium transition">
            Products
          </Link>
          {isAuthenticated && (
            <Link to="/orders" className="text-slate-600 hover:text-indigo-600 font-medium transition">
              My Orders
            </Link>
          )}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with badge */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                Hi, {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition border border-slate-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

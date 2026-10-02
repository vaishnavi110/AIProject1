import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname || (isAdmin ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      const redirectPath =
        location.state?.from?.pathname || (result.user?.role === 'admin' ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    }
  };

  // Quick fill helper for quick evaluation
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@shopease.com',
        password: 'password123',
      });
    } else {
      setFormData({
        email: 'customer@example.com',
        password: 'password123',
      });
    }
    setErrors({});
  };

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage your cart, orders, and preferences
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email Address"
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                icon={Mail}
                required
                autoComplete="email"
              />

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 focus:outline-none"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    autoComplete="current-password"
                    required
                    className={`
                      block w-full rounded-lg text-sm pl-10 pr-10 py-2.5 transition-colors duration-150
                      ${
                        errors.password
                          ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30'
                          : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 bg-white'
                      }
                      border focus:outline-none focus:ring-2 focus:ring-offset-0
                    `}
                  />
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <span>•</span> {errors.password}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={LogIn}
                >
                  Sign In
                </Button>
              </div>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
                Quick Fill Credentials
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('customer')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

            {/* Link to Register */}
            <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;

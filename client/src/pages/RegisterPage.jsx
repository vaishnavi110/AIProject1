import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  User,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errs.name = 'Name must not exceed 50 characters';
    }

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

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error as user corrects the field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      formData.confirmPassword
    );
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  // Password matching indicator helper
  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

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
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join ShopEase for fast checkout and direct order tracking
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Full Name"
                id="register-name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                icon={User}
                required
                autoComplete="name"
              />

              <Input
                label="Email Address"
                id="register-email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                icon={Mail}
                required
                autoComplete="email"
              />

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="register-password"
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
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 focus:outline-none"
                  >
                    {showConfirmPassword ? (
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
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    autoComplete="new-password"
                    required
                    className={`
                      block w-full rounded-lg text-sm pl-10 pr-10 py-2.5 transition-colors duration-150
                      ${
                        errors.confirmPassword
                          ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30'
                          : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 bg-white'
                      }
                      border focus:outline-none focus:ring-2 focus:ring-offset-0
                    `}
                  />
                  {formData.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {passwordsMatch ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <span>•</span> {errors.confirmPassword}
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
                  icon={UserPlus}
                >
                  Create Account
                </Button>
              </div>
            </form>

            {/* Link to Login */}
            <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegisterPage;

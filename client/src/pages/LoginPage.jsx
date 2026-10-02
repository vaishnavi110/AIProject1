import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname || (isAdmin ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      const redirectPath =
        location.state?.from?.pathname || (result.user.role === 'admin' ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Brand & Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white mb-4 shadow-md shadow-indigo-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage orders, cart items, or admin controls
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                icon={Mail}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                icon={Lock}
                required
                autoComplete="current-password"
              />

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

            <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;

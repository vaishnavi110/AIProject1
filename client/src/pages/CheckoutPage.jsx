import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Building,
  User,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <Container>
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            message="You need to add products to your cart before proceeding to checkout."
            actionLabel="Browse Catalog"
            actionLink="/products"
          />
        </Container>
      </div>
    );
  }

  const validate = () => {
    const errs = {};

    if (!shippingData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (shippingData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const phoneClean = shippingData.phone.replace(/[\s-]/g, '');
    if (!shippingData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(phoneClean)) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!shippingData.address.trim()) {
      errs.address = 'Street address is required';
    }

    if (!shippingData.city.trim()) {
      errs.city = 'City is required';
    }

    const pinClean = shippingData.pincode.replace(/\s/g, '');
    if (!shippingData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^\d{5,6}$/.test(pinClean)) {
      errs.pincode = 'Enter a valid 6-digit postal code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, val) => {
    setShippingData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the shipping information errors.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
        })),
        shippingAddress: {
          name: shippingData.name.trim(),
          phone: shippingData.phone.trim(),
          address: shippingData.address.trim(),
          city: shippingData.city.trim(),
          pincode: shippingData.pincode.trim(),
        },
      };

      const createdOrder = await orderService.placeOrder(orderPayload);
      clearCart();
      toast.success('Order placed successfully! Cash on Delivery confirmed.');
      navigate('/my-orders', { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-8">
      <Container>
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-sm text-slate-500 mt-1">
              Provide your delivery address to confirm your Cash on Delivery order
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Shipping Details</h2>
                  <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    id="shipping-name"
                    placeholder="John Doe"
                    value={shippingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    icon={User}
                    required
                  />

                  <Input
                    label="Phone Number"
                    id="shipping-phone"
                    placeholder="10-digit mobile number"
                    value={shippingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    icon={Phone}
                    required
                  />
                </div>

                <Input
                  label="Street Address"
                  id="shipping-address"
                  placeholder="Flat/House No., Building, Street, Landmark"
                  value={shippingData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={errors.address}
                  icon={MapPin}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    id="shipping-city"
                    placeholder="e.g. Mumbai, Pune, Bengaluru"
                    value={shippingData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    icon={Building}
                    required
                  />

                  <Input
                    label="Pincode"
                    id="shipping-pincode"
                    placeholder="6-digit postal code"
                    value={shippingData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    error={errors.pincode}
                    required
                  />
                </div>

                {/* Payment Option Selection */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Payment Method</h3>
                  <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/60 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</p>
                        <p className="text-xs text-slate-500">Pay safely in cash upon package delivery</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                      Free COD
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="font-bold text-base shadow-md shadow-indigo-600/25"
                  >
                    Confirm & Place Order ({formatCurrency(cartTotal)})
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Review ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-slate-800 truncate font-medium">{item.product.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Payable Amount</span>
                  <span className="text-indigo-600 text-xl">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tamper-Proof Database Verified Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

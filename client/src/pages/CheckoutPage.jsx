import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, cartCount, cartTotal } = useCart();
  const { user } = useAuth();

  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="py-12">
        <Container>
          <EmptyState
            icon={ShoppingBag}
            title="Cart is Empty"
            message="You must add products to your cart before proceeding to checkout."
            actionLabel="Browse Products"
            actionLink="/products"
          />
        </Container>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    alert('Checkout order placement endpoint will be integrated in Phase 9b!');
  };

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide your delivery details and confirm your Cash on Delivery order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Shipping Information
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    id="shipping-name"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    id="shipping-phone"
                    placeholder="10-digit mobile number"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Street Address"
                  id="shipping-address"
                  placeholder="Flat/House No., Street, Landmark"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    id="shipping-city"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                  />
                  <Input
                    label="Pincode"
                    id="shipping-pincode"
                    placeholder="6-digit postal code"
                    value={shippingData.pincode}
                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Payment Option</h3>
                  <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Cash on Delivery (COD)</p>
                        <p className="text-xs text-slate-500">Pay in cash when order arrives</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full">
                      Zero Fees
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    Confirm & Place Order ({formatCurrency(cartTotal)})
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Items Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Items in Order ({cartCount})
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-medium shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-slate-700 truncate">{item.product.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 ml-2">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-bold text-slate-900">
                  <span>Payable Amount</span>
                  <span className="text-indigo-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

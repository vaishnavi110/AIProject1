import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [clearModalOpen, setClearModalOpen] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="py-12">
        <Container>
          <EmptyState
            icon={ShoppingCart}
            title="Your Cart is Empty"
            message="Looks like you haven't added any items to your shopping cart yet."
            actionLabel="Start Shopping"
            actionLink="/products"
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-slate-500 mt-1">
              You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <Button
            variant="ghost"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => setClearModalOpen(true)}
            icon={Trash2}
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              const isMaxStock = quantity >= (product.stock || 99);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingCart className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <Link
                        to={`/products/${product._id}`}
                        className="text-base font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Unit Price: {formatCurrency(product.price)}
                      </p>
                      <span className="inline-block mt-1 text-[11px] text-emerald-600 font-medium">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-slate-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isMaxStock}
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="text-base font-bold text-slate-900">
                        {formatCurrency(product.price * quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(cartTotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Payment Method</span>
                  <span className="font-medium text-slate-800">Cash on Delivery</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600 text-lg">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full">
                <Button variant="primary" size="lg" fullWidth>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Price & Stock Verified Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Dialog */}
        <ConfirmDialog
          isOpen={clearModalOpen}
          onCancel={() => setClearModalOpen(false)}
          onConfirm={() => {
            clearCart();
            setClearModalOpen(false);
          }}
          title="Clear Shopping Cart"
          message="Are you sure you want to remove all items from your cart? This cannot be undone."
          confirmText="Yes, Clear Cart"
        />
      </Container>
    </div>
  );
};

export default CartPage;

import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet. Explore our products and find something you love!"
          actionLabel="Continue Shopping"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5">
                {/* Product Image */}
                <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product._id}`}
                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  {product.category && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
                      {product.category.name || product.category}
                    </span>
                  )}
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.stock > 0 ? (
                      <span className="text-emerald-600">{product.stock} in stock</span>
                    ) : (
                      <span className="text-red-500">Out of stock</span>
                    )}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 sm:gap-2">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-2 hover:bg-gray-200 transition-colors disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[3rem] text-center bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="hidden sm:block text-right min-w-[5rem]">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(product.price * quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Line Total */}
              <div className="sm:hidden flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Summary Header */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>

            {/* Summary Details */}
            <div className="p-5 space-y-4">
              {/* Items Breakdown */}
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[60%]">
                      {product.name} × {quantity}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-gray-800">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                fullWidth
                size="lg"
                className="mt-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Continue Shopping Link */}
              <Link
                to="/products"
                className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

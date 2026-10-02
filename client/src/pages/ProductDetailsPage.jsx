import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  PackageCheck,
  Truck,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" message="Loading product specifications..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16">
        <Container>
          <EmptyState
            icon={ShoppingBag}
            title="Product Not Found"
            message="The item you requested does not exist or may have been removed."
            actionLabel="Return to Catalog"
            actionLink="/products"
          />
        </Container>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const maxAvailable = product.stock - qtyInCart;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="py-8 space-y-8">
      <Container>
        {/* Back Navigation */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left: Large Product Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
            <img
              src={imgError || !product.image ? fallbackImage : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center"
            />
            {product.category?.name && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-white/60">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h1>

              {/* Price & Stock Status */}
              <div className="mt-4 flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-black text-indigo-600 tracking-tight">
                  {formatCurrency(product.price)}
                </span>

                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-full">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                    <PackageCheck className="w-3.5 h-3.5" />
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-slate-100 py-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description ||
                  'No detailed description available. Built with premium materials for maximum durability.'}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isOutOfStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">Quantity:</span>
                  <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {qtyInCart > 0 && (
                    <span className="text-xs text-indigo-600 font-medium">
                      ({qtyInCart} already in cart)
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant={addedSuccess ? 'secondary' : 'primary'}
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    className={`transition-all ${
                      addedSuccess
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                        : ''
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add {quantity} to Cart ({formatCurrency(product.price * quantity)})</span>
                      </>
                    )}
                  </Button>

                  <Link to="/cart" className="sm:w-auto">
                    <Button variant="outline" size="lg" fullWidth>
                      View Cart
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500">
                This item is currently sold out. Please check back later or browse other available products.
              </div>
            )}

            {/* Delivery & Payment Badges */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Fast Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600 shrink-0" />
                <span>7-Day Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailsPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, PackageX, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const success = addToCart(product);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-100 block"
      >
        <img
          src={imgError || !product.image ? fallbackImage : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        {product.category?.name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700 bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-white/60">
            {product.category.name}
          </span>
        )}

        {/* Stock Badge Overlay if Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-full shadow-md">
              <PackageX className="w-4 h-4" />
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${product._id}`} className="block focus:outline-none">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality verified item.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="text-right">
            {!isOutOfStock && (
              <span className="text-[11px] font-medium text-emerald-600 block mb-0.5">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <div className="mt-3">
          <Button
            variant={justAdded ? 'secondary' : isOutOfStock ? 'ghost' : 'primary'}
            fullWidth
            size="sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`transition-all ${
              justAdded
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : ''
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to Cart</span>
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {qtyInCart > 0 ? `Add More (${qtyInCart})` : 'Add to Cart'}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

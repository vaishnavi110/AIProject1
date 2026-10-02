import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    _id: 'prod-1',
    title: 'Classic Unisex Cotton T-Shirt',
    name: 'Classic Unisex Cotton T-Shirt',
    price: 499,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
    stock: 15,
  },
  {
    id: 'prod-2',
    _id: 'prod-2',
    title: 'Urban Denim Jacket',
    name: 'Urban Denim Jacket',
    price: 1999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60',
    stock: 8,
  },
  {
    id: 'prod-3',
    _id: 'prod-3',
    title: 'Minimalist Wireless Headphones',
    name: 'Minimalist Wireless Headphones',
    price: 2499,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    stock: 5,
  },
  {
    id: 'prod-4',
    _id: 'prod-4',
    title: 'Leather Smartwatch Strap',
    name: 'Leather Smartwatch Strap',
    price: 899,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    stock: 20,
  }
];

const HomePage = () => {
  const { addToCart } = useCart();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-200 border border-white/10">
            Summer Collection 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Style That Fits Your Lifestyle.
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg">
            Explore premium fashion and lifestyle products crafted with quality and care.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 shadow-lg transition"
            >
              View Cart <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-500 text-sm">Add items directly to test the cart page functionality.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base line-clamp-1">{product.title}</h3>
                  <p className="text-slate-500 text-xs">In Stock: {product.stock}</p>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-lg">₹{product.price}</span>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

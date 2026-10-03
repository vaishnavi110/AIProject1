import api from './api';

// Realistic fallback products for resilient UI preview and testing
export const MOCK_PRODUCTS = [
  {
    _id: 'prod-1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with 40mm drivers, active noise cancellation, and 30-hour battery life.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-1', name: 'Electronics' },
    stock: 15,
  },
  {
    _id: 'prod-2',
    name: 'Mechanical RGB Gaming Keyboard',
    description: 'Tactile blue switches with per-key RGB backlighting and durable aircraft-grade aluminum frame.',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-1', name: 'Electronics' },
    stock: 8,
  },
  {
    _id: 'prod-3',
    name: 'Classic Vintage Denim Jacket',
    description: 'Premium heavyweight cotton denim with tailored comfort fit and antique brass buttons.',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-2', name: 'Fashion' },
    stock: 20,
  },
  {
    _id: 'prod-4',
    name: 'Ultra-Lightweight Trail Running Shoes',
    description: 'Breathable mesh upper with high-traction rubber lug outsole for city jogging and outdoor trails.',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-3', name: 'Footwear' },
    stock: 12,
  },
  {
    _id: 'prod-5',
    name: 'Smart AMOLED Fitness Tracker Watch',
    description: 'Continuous heart rate tracking, SpO2 sensor, 100+ sport modes, and 5ATM water resistance.',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-1', name: 'Electronics' },
    stock: 10,
  },
  {
    _id: 'prod-6',
    name: 'Architectural LED Desk Lamp',
    description: 'Adjustable dual-arm task light with warm-to-cool color temperature slider and USB-C port.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-4', name: 'Home & Living' },
    stock: 25,
  },
  {
    _id: 'prod-7',
    name: 'Polarized Retro Sunglasses',
    description: 'UV400 protective polarized lenses in a lightweight tortoiseshell handcrafted acetate frame.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-2', name: 'Fashion' },
    stock: 18,
  },
  {
    _id: 'prod-8',
    name: 'Waterproof Minimalist Commuter Backpack',
    description: '15.6 inch padded laptop compartment, concealed anti-theft pockets, and water-repellent shell.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    category: { _id: 'cat-2', name: 'Fashion' },
    stock: 5,
  },
];

export const productService = {
  /**
   * Fetches products with optional category and search filters.
   * @param {Object} params - { category, search, limit }
   * @returns {Promise<Array>} List of products
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn('Backend products endpoint not reachable, filtering mock catalog:', error.message);
    }

    // Client-side fallback filter logic
    let result = [...MOCK_PRODUCTS];

    if (params.category && params.category !== 'All') {
      result = result.filter(
        (p) =>
          p.category?._id === params.category ||
          p.category?.name?.toLowerCase() === params.category?.toLowerCase()
      );
    }

    if (params.search && params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (params.limit && Number(params.limit) > 0) {
      result = result.slice(0, Number(params.limit));
    }

    return result;
  },

  /**
   * Fetches single product details by ID.
   * @param {string} id
   * @returns {Promise<Object>} Single product data
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn('Backend product endpoint not reachable, finding in mock catalog:', error.message);
      const mock = MOCK_PRODUCTS.find((p) => p._id === id);
      if (mock) return mock;
      throw error;
    }
  },
};

export default productService;

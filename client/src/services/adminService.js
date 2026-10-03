import api from './api';
import categoryService from './categoryService';
import { MOCK_PRODUCTS } from './productService';

const LOCAL_ADMIN_CATEGORIES_KEY = 'shopease_admin_custom_categories';
const LOCAL_ADMIN_PRODUCTS_KEY = 'shopease_admin_custom_products';
const LOCAL_ORDERS_KEY = 'shopease_customer_orders';

export const adminService = {
  /**
   * Fetches summary statistics and recent orders for the admin dashboard.
   */
  async getDashboardStats() {
    try {
      const [categoriesRes, productsRes] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/products'),
      ]);

      let orders = [];
      try {
        const ordersRes = await api.get('/admin/orders');
        orders = ordersRes.data?.data || ordersRes.data || [];
      } catch {
        orders = this.getAllOrdersLocal();
      }

      const categories =
        categoriesRes.status === 'fulfilled'
          ? categoriesRes.value.data?.data || categoriesRes.value.data || []
          : await categoryService.getCategories();

      const products =
        productsRes.status === 'fulfilled'
          ? productsRes.value.data?.data || productsRes.value.data || []
          : await this.getProducts();

      const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

      return {
        totalProducts: products.length || 8,
        totalCategories: categories.length || 4,
        totalOrders: orders.length || 3,
        totalRevenue: totalRevenue || 14250,
        recentOrders: orders.slice(0, 5),
      };
    } catch (error) {
      console.warn('Backend admin stats fallback:', error.message);
      const orders = this.getAllOrdersLocal();
      return {
        totalProducts: 8,
        totalCategories: 4,
        totalOrders: orders.length || 3,
        totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 14250,
        recentOrders: orders.slice(0, 5),
      };
    }
  },

  // ================= CATEGORIES =================
  async getCategories() {
    try {
      const response = await api.get('/categories');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn('API getCategories error, checking local store:', e.message);
    }

    const localCustom = JSON.parse(localStorage.getItem(LOCAL_ADMIN_CATEGORIES_KEY) || '[]');
    if (localCustom.length > 0) return localCustom;

    return await categoryService.getCategories();
  },

  async createCategory(data) {
    try {
      const response = await api.post('/categories', data);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn('API createCategory fallback:', error.message);
      const newCat = {
        _id: 'cat-' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        description: data.description || '',
        createdAt: new Date().toISOString(),
      };
      const existing = await this.getCategories();
      const updated = [newCat, ...existing];
      localStorage.setItem(LOCAL_ADMIN_CATEGORIES_KEY, JSON.stringify(updated));
      return newCat;
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn('API updateCategory fallback:', error.message);
      const existing = await this.getCategories();
      const updated = existing.map((c) => (c._id === id ? { ...c, ...data } : c));
      localStorage.setItem(LOCAL_ADMIN_CATEGORIES_KEY, JSON.stringify(updated));
      return { _id: id, ...data };
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API deleteCategory fallback:', error.message);
      const existing = await this.getCategories();
      const updated = existing.filter((c) => c._id !== id);
      localStorage.setItem(LOCAL_ADMIN_CATEGORIES_KEY, JSON.stringify(updated));
      return { success: true };
    }
  },

  // ================= PRODUCTS =================
  async getProducts() {
    try {
      const response = await api.get('/products');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn('API getProducts error, checking local store:', e.message);
    }

    const localCustom = JSON.parse(localStorage.getItem(LOCAL_ADMIN_PRODUCTS_KEY) || '[]');
    if (localCustom.length > 0) return localCustom;

    return [...MOCK_PRODUCTS];
  },

  async createProduct(data) {
    try {
      const response = await api.post('/products', data);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn('API createProduct fallback:', error.message);
      const newProd = {
        _id: 'prod-' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: data.categoryObj || { _id: data.category, name: 'General' },
        stock: Number(data.stock),
        createdAt: new Date().toISOString(),
      };
      const existing = await this.getProducts();
      const updated = [newProd, ...existing];
      localStorage.setItem(LOCAL_ADMIN_PRODUCTS_KEY, JSON.stringify(updated));
      return newProd;
    }
  },

  async updateProduct(id, data) {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn('API updateProduct fallback:', error.message);
      const existing = await this.getProducts();
      const updated = existing.map((p) =>
        p._id === id
          ? {
              ...p,
              ...data,
              price: Number(data.price ?? p.price),
              stock: Number(data.stock ?? p.stock),
              category: data.categoryObj || p.category,
            }
          : p
      );
      localStorage.setItem(LOCAL_ADMIN_PRODUCTS_KEY, JSON.stringify(updated));
      return { _id: id, ...data };
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API deleteProduct fallback:', error.message);
      const existing = await this.getProducts();
      const updated = existing.filter((p) => p._id !== id);
      localStorage.setItem(LOCAL_ADMIN_PRODUCTS_KEY, JSON.stringify(updated));
      return { success: true };
    }
  },

  // ================= ORDERS =================
  getAllOrdersLocal() {
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
      if (saved.length > 0) return saved;
    } catch (e) {
      console.error(e);
    }
    return [
      {
        _id: 'ord-demo-1',
        shippingAddress: {
          name: 'Vaishnavi More',
          phone: '9876543210',
          address: '402 Sunset Blvd',
          city: 'Mumbai',
          pincode: '400001',
        },
        totalAmount: 4999,
        status: 'Delivered',
        paymentMethod: 'COD',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        products: [
          {
            quantity: 1,
            price: 4999,
            name: 'Wireless Noise-Cancelling Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
          },
        ],
      },
      {
        _id: 'ord-demo-2',
        shippingAddress: {
          name: 'Sayali Deore',
          phone: '9822012345',
          address: '12 Green Park',
          city: 'Pune',
          pincode: '411001',
        },
        totalAmount: 6499,
        status: 'Shipped',
        paymentMethod: 'COD',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        products: [
          {
            quantity: 1,
            price: 6499,
            name: 'Mechanical RGB Gaming Keyboard',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
          },
        ],
      },
      {
        _id: 'ord-demo-3',
        shippingAddress: {
          name: 'Shweta Dhanawade',
          phone: '9819098765',
          address: '88 Marine Heights',
          city: 'Mumbai',
          pincode: '400020',
        },
        totalAmount: 2999,
        status: 'Pending',
        paymentMethod: 'COD',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        products: [
          {
            quantity: 1,
            price: 2999,
            name: 'Classic Vintage Denim Jacket',
            image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200',
          },
        ],
      },
    ];
  },

  async getAllOrders() {
    try {
      const response = await api.get('/admin/orders');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn('API getAllOrders error, reading local store:', e.message);
    }
    return this.getAllOrdersLocal();
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/admin/orders/${orderId}`, { status });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('API updateOrderStatus error, updating local store:', e.message);
      const orders = this.getAllOrdersLocal();
      const updated = orders.map((o) => (o._id === orderId ? { ...o, status } : o));
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
      return { _id: orderId, status };
    }
  },
};

export default adminService;

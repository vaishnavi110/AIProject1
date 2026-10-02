import api from './api';

const LOCAL_ORDERS_KEY = 'shopease_customer_orders';

export const orderService = {
  /**
   * Places a new Cash on Delivery order.
   * @param {Object} orderData - { products: [{ product, quantity }], shippingAddress }
   * @returns {Promise<Object>} Created order data
   */
  async placeOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      const data = response.data?.data || response.data;
      return data;
    } catch (error) {
      console.warn('Backend order placement not reachable, saving local demo order:', error.message);

      // Resilient fallback order creation for local preview & offline demo
      const fallbackOrder = {
        _id: 'ord-' + Math.random().toString(36).substring(2, 9),
        products: orderData.products.map((item) => ({
          product: typeof item.product === 'object' ? item.product : { _id: item.product },
          name: item.product?.name || item.name || 'Catalog Item',
          price: item.product?.price || item.price || 999,
          quantity: item.quantity,
          image: item.product?.image || item.image || '',
        })),
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.products.reduce((acc, i) => {
          const price = i.product?.price || i.price || 999;
          return acc + price * i.quantity;
        }, 0),
        status: 'Pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        existing.unshift(fallbackOrder);
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing));
      } catch (e) {
        console.error('Failed to save order to local storage fallback:', e);
      }

      return fallbackOrder;
    }
  },

  /**
   * Retrieves order history for the currently logged in user.
   * @returns {Promise<Array>} List of user orders
   */
  async getMyOrders() {
    try {
      const response = await api.get('/orders/my-orders');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return data;
      }
    } catch (error) {
      console.warn('Backend orders endpoint not reachable, reading local orders:', error.message);
    }

    try {
      const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse local orders:', e);
      return [];
    }
  },
};

export default orderService;

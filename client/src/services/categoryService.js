import api from './api';

export const categoryService = {
  /**
   * Fetches all categories.
   * @returns {Promise<Array>} List of categories
   */
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.warn('Backend categories endpoint not reachable, using fallback list:', error.message);
      // Fallback categories for seamless demo if backend server is offline
      return [
        { _id: 'cat-1', name: 'Electronics', description: 'Gadgets, devices, and accessories' },
        { _id: 'cat-2', name: 'Fashion', description: 'Clothing, apparel, and style' },
        { _id: 'cat-3', name: 'Footwear', description: 'Shoes, sneakers, and sandals' },
        { _id: 'cat-4', name: 'Home & Living', description: 'Decor, kitchenware, and furniture' },
      ];
    }
  },

  /**
   * Fetches single category by ID.
   * @param {string} id
   */
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data?.data || response.data;
  },
};

export default categoryService;

import api from './api';

/**
 * Service methods for user authentication and session management.
 */
export const authService = {
  /**
   * Registers a new user account.
   * @param {Object} data - { name, email, password, confirmPassword }
   * @returns {Promise<Object>} { user, token }
   */
  async registerUser(data) {
    const response = await api.post('/auth/register', data);
    return response.data?.data || response.data;
  },

  /**
   * Authenticates user with email and password.
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} { user, token }
   */
  async loginUser(data) {
    const response = await api.post('/auth/login', data);
    return response.data?.data || response.data;
  },

  /**
   * Fetches current authenticated user profile using stored JWT.
   * @returns {Promise<Object>} { user }
   */
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data?.data || response.data;
  },
};

export default authService;

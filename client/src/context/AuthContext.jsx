import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register a new user
  const register = useCallback(async (name, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      throw new Error('Passwords do not match');
    }

    const { data } = await api.post('/auth/register', { name, email, password });

    const userData = data.data.user;
    const userToken = data.data.token;

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
    toast.success('Registration successful!');

    return userData;
  }, []);

  // Login existing user
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    const userData = data.data.user;
    const userToken = data.data.token;

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);

    return userData;
  }, []);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    isLoading,
    isAdmin,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

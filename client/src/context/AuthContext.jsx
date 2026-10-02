import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Optionally revalidate session in background
          try {
            const profileData = await authService.getProfile();
            if (profileData?.user) {
              setUser(profileData.user);
              localStorage.setItem('user', JSON.stringify(profileData.user));
            }
          } catch (e) {
            // If token expired, clear invalid session
            if (e.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore auth session from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.loginUser({ email, password });
      const { user: userData, token: authToken } = data;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData, token: authToken };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Register handler
  const register = useCallback(async (name, email, password, confirmPassword) => {
    try {
      const data = await authService.registerUser({
        name,
        email,
        password,
        confirmPassword,
      });
      const { user: userData, token: authToken } = data;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success(`Account created successfully! Welcome, ${userData.name}!`);
      return { success: true, user: userData, token: authToken };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

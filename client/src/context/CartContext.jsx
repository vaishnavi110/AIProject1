import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

// Custom hook for consuming cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Computed: total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Computed: total price of all items
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Add a product to cart (quantity 1), or increment if already exists
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);

      if (existingIndex > -1) {
        // Product exists — increment quantity (bounded by stock)
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;

        if (currentQty >= product.stock) {
          toast.error(`Maximum stock limit (${product.stock}) reached`);
          return prev;
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + 1,
        };
        toast.success('Cart updated');
        return updated;
      }

      // New product — add with quantity 1
      if (product.stock <= 0) {
        toast.error('Product is out of stock');
        return prev;
      }

      toast.success('Added to cart');
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  // Update quantity for a specific product (bounded by stock)
  const updateQuantity = useCallback((productId, qty) => {
    setCartItems((prev) => {
      if (qty <= 0) {
        // Remove item if quantity drops to 0 or below
        return prev.filter((item) => item.product._id !== productId);
      }

      return prev.map((item) => {
        if (item.product._id === productId) {
          const cappedQty = Math.min(qty, item.product.stock);
          if (qty > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available`);
          }
          return { ...item, quantity: cappedQty };
        }
        return item;
      });
    });
  }, []);

  // Remove an item entirely from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Item removed from cart');
  }, []);

  // Clear entire cart (used after order placement)
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

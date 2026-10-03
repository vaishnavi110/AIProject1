import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shopease_cart_items';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart items from localStorage:', e);
      return [];
    }
  });

  // Sync cart items with localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Derived calculations: Total items and total price
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  // Add to cart
  const addToCart = useCallback((product, qty = 1) => {
    if (!product || !product._id) return false;

    // Check stock
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return false;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.stock) {
          toast.error(`Cannot add more. Only ${product.stock} items in stock.`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          // Update product snapshot in case price or stock refreshed
          product: { ...product },
        };
        toast.success(`Updated ${product.name} quantity in cart (${newQty})`);
        return updated;
      } else {
        if (qty > product.stock) {
          toast.error(`Cannot add more. Only ${product.stock} items in stock.`);
          return prevItems;
        }
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, { product: { ...product }, quantity: qty }];
      }
    });

    return true;
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.product._id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevItems.filter((item) => item.product._id !== productId);
    });
  }, []);

  // Update specific item quantity (bounded by product.stock)
  const updateQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product._id === productId) {
          const maxStock = item.product.stock;
          if (qty > maxStock) {
            toast.error(`Only ${maxStock} in stock.`);
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      });
    });
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

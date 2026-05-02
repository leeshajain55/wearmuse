'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from backend or localStorage
  const fetchCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/cart');
        setCart(res.data.cart || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('guest_cart');
      if (saved) setCart(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (productId, quantity = 1, size = 'M', product = null) => {
    if (user) {
      try {
        const res = await api.post('/cart', { productId, quantity, size });
        setCart(res.data.cart || []);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    } else {
      // Guest cart using localStorage
      setCart(prev => {
        const existing = prev.find(i => i.product?._id === productId && i.size === size);
        if (existing) {
          return prev.map(i =>
            i.product?._id === productId && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { _id: Date.now().toString(), product, quantity, size }];
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity });
        setCart(res.data.cart || []);
      } catch (err) {
        console.error('Failed to update cart:', err);
      }
    } else {
      setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        setCart(res.data.cart || []);
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    } else {
      setCart(prev => prev.filter(i => i._id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
        setCart([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setCart([]);
    }
  };

  const cartCount = cart.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const cartTotal = cart.reduce((acc, i) => acc + ((i.product?.price || 0) * (i.quantity || 0)), 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

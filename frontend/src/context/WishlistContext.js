'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    try {
      const res = await api.post('/wishlist', { productId });
      setWishlist(res.data.wishlist || []);
      return true;
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

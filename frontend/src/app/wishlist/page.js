'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-7xl mb-6">🔒</p>
          <h2 className="font-heading font-bold text-2xl mb-3">Login to See Your Wishlist</h2>
          <p className="text-gray-500 text-sm mb-6">Save your favorite items and access them anytime</p>
          <Link href="/login?redirect=/wishlist" className="btn-primary inline-flex items-center gap-2 text-sm">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-dark mb-2">
          My Wishlist <FiHeart className="inline w-6 h-6 text-primary" />
        </h1>
        <p className="text-gray-500 text-sm mb-8">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-7xl mb-6">💔</p>
            <h2 className="font-heading font-bold text-xl mb-3">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-sm mb-6">Start adding items you love!</p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm">
              <FiShoppingBag className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

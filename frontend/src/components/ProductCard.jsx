'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getDiscount } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);

  const discount = getDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, 1, product.sizes?.[0] || 'M', product);
    toast.success('Added to cart! 🛒');
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    await toggleWishlist(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div
        className="card overflow-hidden"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          <img
            src={hovering && product.images?.[1] ? product.images[1] : product.images?.[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge-sale text-[10px] px-2 py-0.5">{discount}% OFF</span>
            )}
            {product.tags?.includes('new-arrival') && (
              <span className="badge-new text-[10px] px-2 py-0.5">NEW</span>
            )}
            {product.tags?.includes('trending') && (
              <span className="badge-trending text-[10px] px-2 py-0.5">🔥 TRENDING</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                inWishlist ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white text-dark flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all duration-200"
            >
              <FiShoppingBag className="w-4 h-4" />
            </button>
          </div>

          {/* Quick View */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-all duration-300 ${hovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-center gap-2 text-white text-xs font-semibold">
              <FiEye className="w-3.5 h-3.5" />
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-sm text-dark leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5 bg-success/10 px-1.5 py-0.5 rounded">
                <FiStar className="w-3 h-3 text-success fill-success" />
                <span className="text-[11px] font-bold text-success">{product.rating.average}</span>
              </div>
              <span className="text-[10px] text-gray-400">({product.rating.count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-dark">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Colors preview */}
          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1 mt-2.5">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') === 'white' ? '#f5f5f5' : color.toLowerCase().split('/')[0].split(' ')[0] }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

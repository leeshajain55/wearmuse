'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, cartTotal, cartCount, fetchCart } = useCart();
  const { user } = useAuth();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-7xl mb-6">🛒</p>
          <h2 className="font-heading font-bold text-2xl mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm">
            <FiShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const deliveryCharge = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-dark mb-8">
          Shopping Bag <span className="text-primary">({cartCount})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item._id} className="card p-4 flex gap-4 sm:gap-6">
                  <Link href={`/products/${product._id}`} className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{product.brand}</p>
                      <Link href={`/products/${product._id}`}>
                        <h3 className="font-semibold text-sm sm:text-base text-dark line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">Size: {item.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm sm:text-base">{formatPrice(product.price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 hover:bg-danger/10 rounded-lg text-gray-400 hover:text-danger transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-heading font-bold text-lg mb-6">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className={`font-semibold ${deliveryCharge === 0 ? 'text-success' : ''}`}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-[11px] text-success bg-success/10 rounded-lg px-3 py-2">
                    Add {formatPrice(999 - cartTotal)} more for free delivery!
                  </p>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-heading font-black text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href={user ? '/checkout' : '/login?redirect=/checkout'} className="btn-primary w-full flex items-center justify-center gap-2 mt-6 text-base">
                Proceed to Checkout <FiArrowRight />
              </Link>

              <Link href="/products" className="block text-center text-sm text-primary font-semibold mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

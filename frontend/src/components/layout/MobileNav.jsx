'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const links = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/products', icon: FiSearch, label: 'Shop' },
    { href: '/wishlist', icon: FiHeart, label: 'Wishlist', badge: wishlist.length },
    { href: '/cart', icon: FiShoppingBag, label: 'Cart', badge: cartCount },
    { href: user ? '/profile' : '/login', icon: FiUser, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors relative ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <link.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {link.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {link.label}
              </span>
              {isActive && (
                <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

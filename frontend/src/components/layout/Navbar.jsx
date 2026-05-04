'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/products?tag=new-arrival', label: 'New In' },
    //{ href: '/products?category=men', label: 'Men' },
    { href: '/products?category=women', label: 'Women' },
    //{ href: '/products?category=kids', label: 'Kids' },
    { href: '/products?category=accessories', label: 'Accessories' },
    //{ href: '/products?category=footwear', label: 'Footwear' },
  ];

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-dark text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          🔥 FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 🎉 USE CODE GENZ20 FOR 20% OFF &nbsp;&nbsp;|&nbsp;&nbsp; ✨ NEW ARRIVALS JUST DROPPED &nbsp;&nbsp;|&nbsp;&nbsp;
          🔥 FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 🎉 USE CODE GENZ20 FOR 20% OFF &nbsp;&nbsp;|&nbsp;&nbsp; ✨ NEW ARRIVALS JUST DROPPED &nbsp;&nbsp;|&nbsp;&nbsp;
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl md:text-3xl font-heading font-black gradient-text tracking-tight">
                WearMuse
              </span>
            </Link>

            {/* Center: Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-dark/70 hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative hidden sm:block">
                <FiHeart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <FiShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-bounce-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-card-hover py-2 animate-slide-down z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm" onClick={() => setProfileOpen(false)}>
                        <FiUser className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm" onClick={() => setProfileOpen(false)}>
                        <FiPackage className="w-4 h-4" /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-accent" onClick={() => setProfileOpen(false)}>
                          <FiSettings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-danger w-full"
                      >
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-2 btn-primary !py-2 !px-5 text-sm">
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="Menu"
              >
                {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white animate-slide-down">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for hoodies, sneakers, dresses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/30 border-2 border-transparent focus:border-primary outline-none transition-all text-sm"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-semibold text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              {user ? (
                <>
                  <Link href="/profile" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-semibold text-sm" onClick={() => setMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-semibold text-sm" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-semibold text-sm text-accent" onClick={() => setMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-semibold text-sm text-danger">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="block px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm text-center" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for dropdowns */}
      {(profileOpen || menuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setMenuOpen(false); }} />
      )}
    </>
  );
}

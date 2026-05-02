'use client';
import Link from 'next/link';
import { FiInstagram, FiTwitter, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white hidden md:block">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-heading font-bold text-white">Join the WearMuse Fam 💜</h3>
            <p className="text-white/80 mt-1">Get 15% off your first order + early access to drops</p>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-l-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:bg-white/30 w-full md:w-72 text-sm"
            />
            <button type="submit" className="px-6 py-3 rounded-r-full bg-white text-dark font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-heading font-black gradient-text mb-4">WearMuse</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your Gen Z fashion destination. Bold styles, unbeatable prices, and vibes that match your energy. ✨
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Trending Now', 'Best Sellers', 'Sale'].map((link) => (
                <li key={link}>
                  <Link href="/products" className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Categories</h4>
            <ul className="space-y-3">
              {['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Beauty'].map((cat) => (
                <li key={cat}>
                  <Link href={`/products?category=${cat.toLowerCase()}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail className="w-4 h-4 text-primary" />
                hello@WearMuse.com
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>WeWork Galaxy, Residency Rd,<br />Bangalore, 560025</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© {currentYear} WearMuse. All rights reserved. Made with 💜</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

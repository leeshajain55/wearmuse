'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/api/products?limit=8'),
          api.get('/api/categories'),
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendingProducts = products.filter(p => p.tags?.includes('trending')).slice(0, 4);
  const newArrivals = products.filter(p => p.tags?.includes('new-arrival')).slice(0, 4);
  const bestsellers = products.filter(p => p.tags?.includes('bestseller')).slice(0, 4);

  const categoryIcons = {
    'Men': '🧥',
    'Women': '👗',
    'Kids': '🧸',
    'Accessories': '💍',
    'Footwear': '👟',
    'Beauty': '💄',
  };

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-light via-white to-light-warm overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="animate-pulse">🔥</span> New Season Drop — Spring 2026
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] mb-6">
                Explore
                <br />
                <span className="gradient-text">Unique</span>
                <br />
                Clothes
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-dark/60 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Discover the boldest styles crafted for the Gen Z vibe. From streetwear to sleek aesthetics — your wardrobe upgrade starts here.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products" className="btn-primary text-center flex items-center justify-center gap-2 group text-base">
                  Shop Now
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products?tag=new-arrival" className="btn-outline text-center text-base">
                  New Arrivals
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex items-center justify-center lg:justify-start gap-8 mt-10">
                <div>
                  <p className="text-2xl font-heading font-black text-dark">200+</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-2xl font-heading font-black text-dark">15k+</p>
                  <p className="text-xs text-gray-500">Happy Customers</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-2xl font-heading font-black text-dark">4.9</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[550px]">
                {/* Main image */}
                <div className="absolute top-0 right-0 w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" alt="Fashion model" className="w-full h-full object-cover" />
                </div>
                {/* Secondary image */}
                <div className="absolute bottom-0 left-0 w-[260px] h-[340px] rounded-3xl overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" alt="Street style" className="w-full h-full object-cover" />
                </div>
                {/* Floating badge */}
                <div className="absolute top-10 left-10 bg-white rounded-2xl shadow-card p-4 animate-bounce-in">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <FiStar className="w-5 h-5 text-success fill-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Trending</p>
                      <p className="text-xs text-gray-400">This week</p>
                    </div>
                  </div>
                </div>
                {/* Price tag */}
                <div className="absolute bottom-12 right-12 bg-dark text-white rounded-2xl shadow-lg px-5 py-3 animate-bounce-in" style={{ animationDelay: '0.3s' }}>
                  <p className="text-xs text-gray-400">Starting at</p>
                  <p className="text-xl font-heading font-bold">₹499</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiTruck, label: 'Free Shipping', sub: 'Orders over ₹999' },
              { icon: FiRefreshCw, label: '30 Day Returns', sub: 'Hassle-free returns' },
              { icon: FiShield, label: 'Secure Payment', sub: '100% protected' },
              { icon: FiStar, label: 'Top Quality', sub: 'Premium materials' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-16 sm:py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Browse By</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">Shop Categories</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <motion.div key={cat._id} variants={fadeUp}>
                <Link
                  href={`/products?category=${cat.slug || cat.name.toLowerCase()}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-card overflow-hidden group-hover:shadow-card-hover group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{categoryIcons[cat.name] || '🛍️'}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-dark group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ NEW ARRIVALS ═══════════════ */}
      {newArrivals.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="flex items-end justify-between mb-10">
              <div>
                <motion.p variants={fadeUp} className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">Just Dropped</motion.p>
                <motion.h2 variants={fadeUp} className="section-title">New Arrivals ✨</motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link href="/products?tag=new-arrival" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group">
                  View All
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                <motion.div key={product._id} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <div className="sm:hidden mt-8 text-center">
              <Link href="/products?tag=new-arrival" className="btn-primary inline-flex items-center gap-2 text-sm">
                View All New Arrivals <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ SALE BANNER ═══════════════ */}
      <section className="py-16 sm:py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-dark via-dark-light to-dark-lighter text-white"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')] bg-cover bg-center opacity-20" />
            <div className="relative px-8 sm:px-16 py-16 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-3">Limited Time</p>
                <h2 className="text-4xl sm:text-5xl font-heading font-black mb-4">
                  Up to <span className="text-secondary">50% OFF</span>
                </h2>
                <p className="text-white/70 max-w-md">
                  Grab your favorites before they are gone! Season-end clearance on the hottest styles.
                </p>
              </div>
              <Link href="/products?sort=price-asc" className="btn-secondary whitespace-nowrap text-base flex items-center gap-2 group">
                Shop Sale
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TRENDING NOW ═══════════════ */}
      {trendingProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="flex items-end justify-between mb-10">
              <div>
                <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Hot Right Now</motion.p>
                <motion.h2 variants={fadeUp} className="section-title">Trending 🔥</motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link href="/products?tag=trending" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group">
                  View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {trendingProducts.map((product) => (
                <motion.div key={product._id} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ BESTSELLERS ═══════════════ */}
      {bestsellers.length > 0 && (
        <section className="py-16 sm:py-20 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="flex items-end justify-between mb-10">
              <div>
                <motion.p variants={fadeUp} className="text-sm font-semibold text-success uppercase tracking-widest mb-2">Customer Favorites</motion.p>
                <motion.h2 variants={fadeUp} className="section-title">Best Sellers 💎</motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link href="/products?tag=bestseller" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group">
                  View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((product) => (
                <motion.div key={product._id} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-heading font-black mb-6">
              Ready to Upgrade Your Wardrobe?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of Gen Z fashionistas who trust StyleVerse for the freshest styles. No cap. 💯
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-dark font-bold py-4 px-10 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base group">
                Start Shopping
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

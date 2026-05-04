'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedTag(searchParams.get('tag') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    api.get('/api/categories').then(res => setCategories(res.data.categories || [])).catch(() => { });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', '12');
        if (sortBy) params.set('sort', sortBy);
        if (searchQuery) params.set('search', searchQuery);
        if (selectedTag) params.set('tag', selectedTag);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        // Resolve category by slug/name
        if (selectedCategory) {
          const cat = categories.find(c =>
            c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
          );
          if (cat) params.set('category', cat._id);
        }

        const res = await api.get(`/api/products?${params.toString()}`);
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedTag, searchQuery, sortBy, minPrice, maxPrice, page, categories]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const activeFilterCount = [selectedCategory, selectedTag, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-light">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-black mb-3">
            {searchQuery ? `Results for "${searchQuery}"` :
              selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) :
                selectedTag === 'new-arrival' ? 'New Arrivals' :
                  selectedTag === 'trending' ? 'Trending Now' :
                    selectedTag === 'bestseller' ? 'Best Sellers' :
                      'All Products'}
          </h1>
          <p className="text-white/60 text-sm">{pagination.total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-card text-sm font-semibold hover:shadow-card-hover transition-all relative"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl bg-white shadow-card text-sm font-semibold border-none outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent lg:z-auto' : 'hidden lg:block'} lg:w-64 flex-shrink-0`}>
            <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto lg:static lg:shadow-none lg:p-0 lg:w-auto' : ''}`}>
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-heading font-bold text-lg">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}>
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    className="input-field pl-10 !py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Category</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => { setSelectedCategory(cat.slug || cat.name.toLowerCase()); setPage(1); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === (cat.slug || cat.name.toLowerCase()) ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Collection</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: 'All' },
                    { value: 'new-arrival', label: '✨ New' },
                    { value: 'trending', label: '🔥 Trending' },
                    { value: 'bestseller', label: '💎 Bestseller' },
                    { value: 'sale', label: '🏷️ Sale' },
                  ].map(tag => (
                    <button
                      key={tag.value}
                      onClick={() => { setSelectedTag(tag.value); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedTag === tag.value ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-dark'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="input-field !py-2 text-sm w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="input-field !py-2 text-sm w-1/2"
                  />
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="w-full btn-outline !py-2 text-sm">
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded-full w-1/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded-full w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">😔</p>
                <h3 className="font-heading font-bold text-xl mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${page === i + 1 ? 'bg-primary text-white shadow-glow-pink' : 'bg-white hover:bg-gray-50 shadow-card'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

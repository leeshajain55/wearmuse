'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw, FiShield, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getDiscount, getStars } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const prod = res.data.product;
        setProduct(prod);
        setSelectedSize(prod.sizes?.[0] || '');
        setSelectedColor(prod.colors?.[0] || '');

        // Fetch related products
        if (prod.category) {
          const catId = prod.category._id || prod.category;
          const relRes = await api.get(`/products?category=${catId}&limit=4`);
          setRelatedProducts((relRes.data.products || []).filter(p => p._id !== prod._id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity, selectedSize, product);
    toast.success('Added to cart! 🛒');
  };

  const handleBuyNow = async () => {
    await addToCart(product._id, quantity, selectedSize, product);
    router.push('/cart');
  };

  const handleToggleWishlist = async () => {
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    await toggleWishlist(product._id);
    toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    if (!reviewText.trim()) { toast.error('Please write a review'); return; }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      setProduct(res.data.product);
      setReviewText('');
      toast.success('Review added! ⭐');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🤷</p>
          <h2 className="font-heading font-bold text-xl mb-4">Product Not Found</h2>
          <button onClick={() => router.push('/products')} className="btn-primary text-sm">Browse Products</button>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-light">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors">
            <FiChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ═══ Images ═══ */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-card mb-4">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 badge-sale">{discount}% OFF</span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-primary shadow-glow-pink' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ═══ Product Info ═══ */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="space-y-6">
              {/* Brand & Title */}
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{product.brand}</p>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-dark leading-tight">{product.name}</h1>
              </div>

              {/* Rating */}
              {product.rating?.count > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getStars(product.rating.average).map((star, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${star === 'full' ? 'text-warning fill-warning' : star === 'half' ? 'text-warning' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{product.rating.average}</span>
                  <span className="text-sm text-gray-400">({product.rating.count} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-heading font-black text-dark">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="badge-sale">{discount}% OFF</span>
                  </>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-sm font-bold mb-3">Size: <span className="text-primary">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] h-11 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <p className="text-sm font-bold mb-3">Color: <span className="text-primary">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-bold mb-3">Quantity</p>
                <div className="flex items-center gap-1 bg-white rounded-xl shadow-card w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-l-xl">
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-r-xl">
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 text-base">
                  <FiShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 btn-accent flex items-center justify-center gap-2 text-base">
                  Buy Now
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-13 h-13 rounded-xl flex items-center justify-center border-2 transition-all ${
                    inWishlist ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: FiTruck, label: 'Free Delivery' },
                  { icon: FiRefreshCw, label: '30 Day Returns' },
                  { icon: FiShield, label: 'Secure Pay' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100" />

              {/* Tabs */}
              <div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
                  {['description', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === tab ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:text-dark'
                      }`}
                    >
                      {tab === 'description' ? 'Description' : `Reviews (${product.reviews?.length || 0})`}
                    </button>
                  ))}
                </div>

                {activeTab === 'description' ? (
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                    {product.stock > 0 ? (
                      <p className="text-success font-semibold mt-3">✅ In Stock ({product.stock} available)</p>
                    ) : (
                      <p className="text-danger font-semibold mt-3">❌ Out of Stock</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Review Form */}
                    {user && (
                      <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl p-4 shadow-card mb-4">
                        <h4 className="font-semibold text-sm mb-3">Write a Review</h4>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-0.5"
                            >
                              <FiStar className={`w-5 h-5 ${star <= reviewRating ? 'text-warning fill-warning' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="input-field text-sm resize-none h-20 mb-3"
                        />
                        <button type="submit" disabled={submittingReview} className="btn-primary !py-2 text-sm">
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}

                    {/* Reviews List */}
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((review, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                                {review.userName?.charAt(0)}
                              </div>
                              <span className="font-semibold text-sm">{review.userName}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <FiStar key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-warning fill-warning' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-6 text-sm">No reviews yet. Be the first! ⭐</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="section-title text-center mb-8">You May Also Like 💜</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

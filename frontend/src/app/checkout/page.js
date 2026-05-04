'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiCreditCard, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Address form
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'India' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(-1);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    if (cart.length === 0 && !orderPlaced) { router.push('/cart'); return; }
    // Fetch user addresses
    api.get('/api/auth/me').then(res => {
      const addrs = res.data.user?.addresses || [];
      setSavedAddresses(addrs);
      if (addrs.length > 0) {
        setSelectedAddressIdx(0);
        setAddress(addrs[0]);
      }
    }).catch(() => { });
  }, [user, cart.length, orderPlaced, router]);

  const deliveryCharge = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      toast.error('Please fill in complete address');
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const items = cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
      }));

      const res = await api.post('/api/orders', {
        items,
        shippingAddress: address,
        totalAmount: total,
        paymentMethod,
      });

      setOrderId(res.data.order._id);
      setOrderPlaced(true);
      await clearCart();
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <FiCheck className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-heading font-black mb-3">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-2">Thank you for shopping with StyleVerse</p>
          <p className="text-xs text-gray-400 mb-8">Order ID: {orderId}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/orders')} className="btn-primary text-sm">View Orders</button>
            <button onClick={() => router.push('/products')} className="btn-outline text-sm">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-dark mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setStep(s.num)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
              </button>
              <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-dark' : 'text-gray-400'}`}>{s.label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s.num ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card p-6">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FiMapPin className="text-primary" /> Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 mb-3">Saved Addresses</p>
                    <div className="grid gap-3">
                      {savedAddresses.map((addr, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setSelectedAddressIdx(idx); setAddress(addr); }}
                          className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${selectedAddressIdx === idx ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                            }`}
                        >
                          {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Or enter a new address below:</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold mb-1.5 block">Street Address</label>
                    <input value={address.street} onChange={e => { setAddress({ ...address, street: e.target.value }); setSelectedAddressIdx(-1); }} className="input-field" placeholder="123 Main St, Apt 4" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">City</label>
                    <input value={address.city} onChange={e => { setAddress({ ...address, city: e.target.value }); setSelectedAddressIdx(-1); }} className="input-field" placeholder="Bangalore" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">State</label>
                    <input value={address.state} onChange={e => { setAddress({ ...address, state: e.target.value }); setSelectedAddressIdx(-1); }} className="input-field" placeholder="Karnataka" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">ZIP Code</label>
                    <input value={address.zip} onChange={e => { setAddress({ ...address, zip: e.target.value }); setSelectedAddressIdx(-1); }} className="input-field" placeholder="560001" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Country</label>
                    <input value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="input-field" />
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary mt-6">Continue to Payment</button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-primary" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                    { value: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Mock payment — no real charge' },
                    { value: 'UPI', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, etc.' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                        }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                      {paymentMethod === method.value && (
                        <FiCheck className="ml-auto text-primary w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card p-6">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FiShoppingBag className="text-primary" /> Order Review
                </h2>

                {/* Address summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Delivering to</p>
                  <p className="text-sm">{address.street}, {address.city}, {address.state} - {address.zip}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Payment</p>
                  <p className="text-sm">{paymentMethod === 'COD' ? '💵 Cash on Delivery' : paymentMethod === 'Card' ? '💳 Card' : '📱 UPI'}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={item.product?.images?.[0]} alt="" className="w-12 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">{formatPrice(item.product?.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 text-base">
                    {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Place Order — {formatPrice(total)}</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({cartCount})</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className={`font-semibold ${deliveryCharge === 0 ? 'text-success' : ''}`}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-heading font-black text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

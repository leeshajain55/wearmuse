'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPackage, FiChevronRight, FiTruck, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

const statusConfig = {
  Pending: { icon: FiClock, color: 'text-warning', bg: 'bg-warning/10', label: 'Order Placed' },
  Shipped: { icon: FiTruck, color: 'text-accent', bg: 'bg-accent/10', label: 'Shipped' },
  Delivered: { icon: FiCheck, color: 'text-success', bg: 'bg-success/10', label: 'Delivered' },
  Cancelled: { icon: FiX, color: 'text-danger', bg: 'bg-danger/10', label: 'Cancelled' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login?redirect=/orders'); return; }
    if (user) {
      api.get('/orders').then(res => setOrders(res.data.orders || []))
        .catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-dark mb-8 flex items-center gap-2">
          <FiPackage className="text-primary" /> My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-7xl mb-6">📦</p>
            <h2 className="font-heading font-bold text-xl mb-3">No Orders Yet</h2>
            <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary text-sm">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = status.icon;
              const isExpanded = selectedOrder === order._id;

              return (
                <div key={order._id} className="card overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatPrice(order.totalAmount)}</p>
                        <p className={`text-xs font-semibold ${status.color}`}>{status.label}</p>
                      </div>
                      <FiChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 space-y-4 animate-slide-down">
                      {/* Tracking */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Order Tracking</p>
                        <div className="flex items-center gap-2">
                          {['Pending', 'Shipped', 'Delivered'].map((s, i) => {
                            const isActive = ['Pending', 'Shipped', 'Delivered'].indexOf(order.status) >= i;
                            const isCurrent = order.status === s;
                            return (
                              <div key={s} className="flex items-center gap-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                  isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                  {isActive ? <FiCheck className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < 2 && <div className={`flex-1 h-1 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-200'}`} />}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          {['Placed', 'Shipped', 'Delivered'].map(s => (
                            <span key={s} className="text-[10px] text-gray-400">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                              <img src={item.image || item.product?.images?.[0]} alt="" className="w-12 h-14 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold line-clamp-1">{item.name || item.product?.name}</p>
                                <p className="text-xs text-gray-400">Size: {item.size} × {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Shipping Address</p>
                        <p className="text-sm">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <span className="text-sm text-gray-500">Payment</span>
                        <span className="text-sm font-semibold">{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : order.paymentMethod === 'Card' ? '💳 Card' : '📱 UPI'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

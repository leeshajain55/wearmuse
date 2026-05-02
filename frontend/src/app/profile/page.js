'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut, FiPlus, FiTrash2, FiEdit2, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zip: '', country: 'India' });

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login?redirect=/profile'); return; }
    if (user) {
      api.get('/auth/me').then(res => {
        setUserData(res.data.user);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zip) {
      toast.error('Please fill in all fields'); return;
    }
    try {
      const addresses = [...(userData.addresses || [])];
      if (editingIdx >= 0) {
        addresses[editingIdx] = addressForm;
      } else {
        addresses.push(addressForm);
      }
      await api.put('/auth/addresses', { addresses });
      const res = await api.get('/auth/me');
      setUserData(res.data.user);
      setShowAddressForm(false);
      setEditingIdx(-1);
      setAddressForm({ street: '', city: '', state: '', zip: '', country: 'India' });
      toast.success(editingIdx >= 0 ? 'Address updated!' : 'Address added!');
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (idx) => {
    try {
      const addresses = [...(userData.addresses || [])];
      addresses.splice(idx, 1);
      await api.put('/auth/addresses', { addresses });
      const res = await api.get('/auth/me');
      setUserData(res.data.user);
      toast.success('Address deleted');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  ];

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card p-6 sm:p-8 mb-6 bg-gradient-to-r from-primary to-accent text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-heading font-black">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold">{user.name}</h1>
              <p className="text-white/70 text-sm">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  <FiSettings className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Link href="/orders" className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors">
              <FiPackage className="w-5 h-5" />
              <span className="text-xs font-medium">Orders</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors">
              <FiHeart className="w-5 h-5" />
              <span className="text-xs font-medium">Wishlist</span>
            </Link>
            {user.role === 'admin' ? (
              <Link href="/admin" className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors">
                <FiSettings className="w-5 h-5" />
                <span className="text-xs font-medium">Admin</span>
              </Link>
            ) : (
              <button onClick={handleLogout} className="flex flex-col items-center gap-1 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors">
                <FiLogOut className="w-5 h-5" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-glow-pink' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">Name</label>
                <p className="text-dark font-medium">{userData?.name || user.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">Email</label>
                <p className="text-dark font-medium">{userData?.email || user.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">Role</label>
                <p className="text-dark font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">Member Since</label>
                <p className="text-dark font-medium">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="mt-6 flex items-center gap-2 text-danger text-sm font-semibold hover:underline">
              <FiLogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">Saved Addresses</h2>
              <button
                onClick={() => { setShowAddressForm(true); setEditingIdx(-1); setAddressForm({ street: '', city: '', state: '', zip: '', country: 'India' }); }}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <FiPlus className="w-4 h-4" /> Add New
              </button>
            </div>

            {showAddressForm && (
              <div className="card p-6">
                <h3 className="font-semibold text-sm mb-4">{editingIdx >= 0 ? 'Edit Address' : 'New Address'}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="Street Address" className="input-field" />
                  </div>
                  <input value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="input-field" />
                  <input value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" className="input-field" />
                  <input value={addressForm.zip} onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })} placeholder="ZIP Code" className="input-field" />
                  <input value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })} placeholder="Country" className="input-field" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveAddress} className="btn-primary !py-2 text-sm">Save Address</button>
                  <button onClick={() => { setShowAddressForm(false); setEditingIdx(-1); }} className="btn-outline !py-2 text-sm">Cancel</button>
                </div>
              </div>
            )}

            {(userData?.addresses || []).length === 0 && !showAddressForm ? (
              <div className="card p-8 text-center">
                <p className="text-4xl mb-3">📍</p>
                <p className="text-gray-500 text-sm">No saved addresses yet</p>
              </div>
            ) : (
              (userData?.addresses || []).map((addr, idx) => (
                <div key={idx} className="card p-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{addr.street}</p>
                    <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.zip}, {addr.country}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingIdx(idx); setAddressForm(addr); setShowAddressForm(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-dark transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="p-2 hover:bg-danger/10 rounded-lg text-gray-400 hover:text-danger transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

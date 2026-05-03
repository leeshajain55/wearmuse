'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPackage, FiShoppingBag, FiUsers, FiGrid, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiArrowLeft, FiCheck, FiX, FiStar } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '', image: '' });
  const [editingCat, setEditingCat] = useState(null);

  const emptyProduct = { name: '', description: '', price: '', originalPrice: '', category: '', images: [''], sizes: ['S', 'M', 'L', 'XL'], colors: [''], stock: '', brand: 'StyleVerse', tags: [] };
  const [productForm, setProductForm] = useState(emptyProduct);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (user?.role === 'admin') fetchAll();
  }, [user, authLoading, router]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, oRes, uRes] = await Promise.all([
        api.get('/api/products?limit=100'),
        api.get('/api/categories'),
        api.get('/api/orders/admin/all'),
        api.get('/api/auth/users'),
      ]);
      setProducts(pRes.data.products || []);
      setCategories(cRes.data.categories || []);
      setOrders(oRes.data.orders || []);
      setUsers(uRes.data.users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSaveProduct = async () => {
    const data = { ...productForm, price: Number(productForm.price), originalPrice: Number(productForm.originalPrice) || undefined, stock: Number(productForm.stock), images: productForm.images.filter(Boolean), colors: productForm.colors.filter(Boolean) };
    if (!data.name || !data.price || !data.category) { toast.error('Fill required fields'); return; }
    try {
      if (editingProduct) { await api.put(`/api/products/${editingProduct._id}`, data); toast.success('Product updated!'); }
      else { await api.post('/api/products', data); toast.success('Product created!'); }
      setShowProductForm(false); setEditingProduct(null); setProductForm(emptyProduct); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/api/products/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSaveCat = async () => {
    if (!catForm.name) { toast.error('Name required'); return; }
    try {
      if (editingCat) { await api.put(`/api/categories/${editingCat._id}`, catForm); toast.success('Updated!'); }
      else { await api.post('/api/categories', catForm); toast.success('Created!'); }
      setShowCatForm(false); setEditingCat(null); setCatForm({ name: '', description: '', image: '' }); fetchAll();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDeleteCat = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await api.delete(`/api/categories/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try { await api.put(`/api/orders/${orderId}/status`, { status }); toast.success(`Status → ${status}`); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }
  if (!user || user.role !== 'admin') return null;

  const stats = [
    { label: 'Products', value: products.length, icon: FiShoppingBag, color: 'bg-primary/10 text-primary' },
    { label: 'Orders', value: orders.length, icon: FiPackage, color: 'bg-accent/10 text-accent' },
    { label: 'Users', value: users.length, icon: FiUsers, color: 'bg-success/10 text-success' },
    { label: 'Revenue', value: formatPrice(orders.reduce((a, o) => a + (o.totalAmount || 0), 0)), icon: FiStar, color: 'bg-secondary/10 text-secondary-dark' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'products', label: 'Products', icon: FiShoppingBag },
    { id: 'categories', label: 'Categories', icon: FiGrid },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-dark text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-lg"><FiArrowLeft /></button>
            <h1 className="font-heading font-bold text-lg">Admin Panel</h1>
          </div>
          <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">{user.email}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap rounded-lg transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ══════ DASHBOARD ══════ */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
                  <p className="text-2xl font-heading font-black">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-400"><th className="pb-3 font-medium">Order</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 10).map(o => (
                      <tr key={o._id} className="border-b border-gray-50">
                        <td className="py-3 font-semibold">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3">{o.user?.name || 'N/A'}</td>
                        <td className="py-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                        <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === 'Delivered' ? 'bg-success/10 text-success' : o.status === 'Shipped' ? 'bg-accent/10 text-accent' : o.status === 'Cancelled' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>{o.status}</span></td>
                        <td className="py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════ PRODUCTS ══════ */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl">Products ({products.length})</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm(emptyProduct); }} className="btn-primary !py-2 text-sm flex items-center gap-2"><FiPlus /> Add Product</button>
            </div>

            {showProductForm && (
              <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-bold mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Name *</label><input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="input-field" /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Description *</label><textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="input-field h-20 resize-none" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Price *</label><input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Original Price</label><input type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Category *</label>
                    <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="input-field">
                      <option value="">Select</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Stock *</label><input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Brand</label><input value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Tags</label>
                    <div className="flex flex-wrap gap-2">{['new-arrival', 'trending', 'bestseller', 'sale'].map(t => (
                      <button key={t} type="button" onClick={() => { const tags = productForm.tags.includes(t) ? productForm.tags.filter(x => x !== t) : [...productForm.tags, t]; setProductForm({ ...productForm, tags }); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${productForm.tags.includes(t) ? 'bg-primary text-white' : 'bg-gray-100'}`}>{t}</button>
                    ))}</div>
                  </div>
                  <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Image URLs (one per line)</label>
                    <textarea value={productForm.images.join('\n')} onChange={e => setProductForm({ ...productForm, images: e.target.value.split('\n') })} className="input-field h-20 resize-none" placeholder="https://..." />
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Sizes (comma separated)</label><input value={productForm.sizes.join(',')} onChange={e => setProductForm({ ...productForm, sizes: e.target.value.split(',') })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Colors (comma separated)</label><input value={productForm.colors.join(',')} onChange={e => setProductForm({ ...productForm, colors: e.target.value.split(',') })} className="input-field" /></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveProduct} className="btn-primary !py-2 text-sm">{editingProduct ? 'Update' : 'Create'}</button>
                  <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="btn-outline !py-2 text-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-400 bg-gray-50"><th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Stock</th><th className="p-4 font-medium">Category</th><th className="p-4 font-medium">Actions</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4"><div className="flex items-center gap-3"><img src={p.images?.[0]} alt="" className="w-10 h-12 rounded-lg object-cover" /><div><p className="font-semibold line-clamp-1">{p.name}</p><p className="text-xs text-gray-400">{p.brand}</p></div></div></td>
                        <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                        <td className="p-4"><span className={p.stock > 0 ? 'text-success' : 'text-danger'}>{p.stock}</span></td>
                        <td className="p-4 text-gray-500">{p.category?.name || 'N/A'}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingProduct(p); setProductForm({ ...p, category: p.category?._id || p.category, images: p.images || [''], colors: p.colors || [''], sizes: p.sizes || [], tags: p.tags || [], originalPrice: p.originalPrice || '' }); setShowProductForm(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="p-2 hover:bg-danger/10 rounded-lg text-danger"><FiTrash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════ CATEGORIES ══════ */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl">Categories ({categories.length})</h2>
              <button onClick={() => { setShowCatForm(true); setEditingCat(null); setCatForm({ name: '', description: '', image: '' }); }} className="btn-primary !py-2 text-sm flex items-center gap-2"><FiPlus /> Add Category</button>
            </div>
            {showCatForm && (
              <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-bold mb-4">{editingCat ? 'Edit' : 'New'} Category</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Name *</label><input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} className="input-field" /></div>
                  <div><label className="text-xs font-bold text-gray-500 mb-1 block">Image URL</label><input value={catForm.image} onChange={e => setCatForm({ ...catForm, image: e.target.value })} className="input-field" /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Description</label><input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} className="input-field" /></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveCat} className="btn-primary !py-2 text-sm">Save</button>
                  <button onClick={() => setShowCatForm(false)} className="btn-outline !py-2 text-sm">Cancel</button>
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(c => (
                <div key={c._id} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4">
                  {c.image && <img src={c.image} alt="" className="w-14 h-14 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0"><p className="font-semibold">{c.name}</p><p className="text-xs text-gray-400 line-clamp-1">{c.description}</p></div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingCat(c); setCatForm({ name: c.name, description: c.description || '', image: c.image || '' }); setShowCatForm(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCat(c._id)} className="p-2 hover:bg-danger/10 rounded-lg text-danger"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════ ORDERS ══════ */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-heading font-bold text-xl mb-6">All Orders ({orders.length})</h2>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-400 bg-gray-50"><th className="p-4 font-medium">Order ID</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Items</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Action</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 font-semibold">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="p-4"><p className="font-medium">{o.user?.name}</p><p className="text-xs text-gray-400">{o.user?.email}</p></td>
                        <td className="p-4">{o.items?.length}</td>
                        <td className="p-4 font-semibold">{formatPrice(o.totalAmount)}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === 'Delivered' ? 'bg-success/10 text-success' : o.status === 'Shipped' ? 'bg-accent/10 text-accent' : o.status === 'Cancelled' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>{o.status}</span></td>
                        <td className="p-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="p-4">
                          <select value={o.status} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)} className="text-xs border rounded-lg px-2 py-1.5 bg-white">
                            <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════ USERS ══════ */}
        {activeTab === 'users' && (
          <div>
            <h2 className="font-heading font-bold text-xl mb-6">Users ({users.length})</h2>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-400 bg-gray-50"><th className="p-4 font-medium">User</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div><span className="font-medium">{u.name}</span></div></td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                        <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

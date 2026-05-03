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

  const CATEGORY_ENDPOINT = '/api/categories'; // ✅ FIXED HERE

  const emptyProduct = {
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [''],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [''],
    stock: '',
    brand: 'StyleVerse',
    tags: []
  };

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
        api.get('/products?limit=100'),
        api.get(CATEGORY_ENDPOINT),
        api.get('/orders/admin/all'),
        api.get('/auth/users'),
      ]);

      setProducts(pRes.data.products || []);
      setCategories(cRes.data.categories || []);
      setOrders(oRes.data.orders || []);
      setUsers(uRes.data.users || []);
    } catch (err) {
      console.error('Fetch Error:', err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    const data = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || undefined,
      stock: Number(productForm.stock),
      images: productForm.images.filter(Boolean),
      colors: productForm.colors.filter(Boolean)
    };

    if (!data.name || !data.price || !data.category) {
      toast.error('Fill required fields');
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated!');
      } else {
        await api.post('/products', data);
        toast.success('Product created!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(emptyProduct);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ✅ CATEGORY FIXED
  const handleSaveCat = async () => {
    if (!catForm.name) {
      toast.error('Name required');
      return;
    }

    try {
      if (editingCat) {
        await api.put(`${CATEGORY_ENDPOINT}/${editingCat._id}`, catForm);
        toast.success('Category updated!');
      } else {
        await api.post(CATEGORY_ENDPOINT, catForm);
        toast.success('Category created!');
      }

      setShowCatForm(false);
      setEditingCat(null);
      setCatForm({ name: '', description: '', image: '' });
      fetchAll();
    } catch (err) {
      console.error('Category Error:', err?.response || err);
      toast.error('Category API failed (check backend route)');
    }
  };

  const handleDeleteCat = async (id) => {
    if (!confirm('Delete category?')) return;

    try {
      await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Status → ${status}`);
      fetchAll();
    } catch {
      toast.error('Failed');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
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
      {/* SAME UI BELOW (UNCHANGED) */}
      {/* Your remaining JSX stays exactly the same */}
    </div>
  );
}
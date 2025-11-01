'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

interface Booking {
  booking_id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  status: string;
  payment_screenshot?: string;
  payment_reference?: string;
  payment_status?: 'pending' | 'success' | 'failed';
  amount: number;
}

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
  is_available: boolean;
}

interface ProductCategory {
  category_id: string;
  name: string;
  description: string;
  display_order: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'products' | 'categories'>('bookings');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check for existing session on page load
  useEffect(() => {
    const session = sessionStorage.getItem('adminSession');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  });

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const [editingServiceData, setEditingServiceData] = useState<Partial<Service>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    is_available: true,
    image_url: '',
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingProductData, setEditingProductData] = useState<Partial<Product>>({});

  // Categories state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    display_order: '',
  });
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryData, setEditingCategoryData] = useState<Partial<ProductCategory>>({});

  // Handle service image selection
  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setServiceImage(file);
      setServiceImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle product image selection
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image to server
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.url;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchServices();
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    setBookings(data);
  };

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data);
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: loginData.username,
          password: loginData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminSession', 'active');
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }
    
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          username: 'MB barbershop',
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('Password changed successfully! Please log in again with your new password.');
        setShowPasswordChange(false);
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminSession');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      alert('Failed to change password. Please try again.');
    }
  };

  const handleAddService = async () => {
    try {
      // Upload image if selected
      let imageUrl = newService.image_url;
      if (serviceImage) {
        imageUrl = await uploadImage(serviceImage);
      }

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          price: parseFloat(newService.price),
          image_url: imageUrl,
        }),
      });

      if (res.ok) {
        fetchServices();
        setNewService({ name: '', description: '', price: '', image_url: '' });
        setServiceImage(null);
        setServiceImagePreview(null);
        setShowAddForm(false);
      }
    } catch (err) {
      alert('Failed to add service: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateService = async (id: string, updates: Partial<Service>) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        fetchServices();
        setEditingService(null);
      }
    } catch (err) {
      alert('Failed to update service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const handleAddProduct = async () => {
    try {
      // Upload image if selected
      let imageUrl = newProduct.image_url;
      if (productImage) {
        imageUrl = await uploadImage(productImage);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity),
          image_url: imageUrl,
        }),
      });
      if (res.ok) {
        fetchProducts();
        setNewProduct({ name: '', description: '', price: '', category: '', stock_quantity: '', is_available: true, image_url: '' });
        setProductImage(null);
        setProductImagePreview(null);
        setShowAddProductForm(false);
      }
    } catch (err) {
      alert('Failed to add product: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleAddCategory = async () => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCategory,
          display_order: newCategory.display_order ? parseInt(newCategory.display_order) : 999,
        }),
      });
      if (res.ok) {
        fetchCategories();
        setNewCategory({ name: '', description: '', display_order: '' });
        setShowAddCategoryForm(false);
      }
    } catch (err) {
      alert('Failed to add category');
    }
  };

  const handleUpdateCategory = async (id: string, updates: Partial<ProductCategory>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchCategories();
        setEditingCategory(null);
      }
    } catch (err) {
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Check if any products use this category
    const productsInCategory = products.filter(p => p.category === categories.find(c => c.category_id === id)?.name);
    if (productsInCategory.length > 0) {
      alert(`Cannot delete category. ${productsInCategory.length} product(s) are using it.`);
      return;
    }
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get service price
    const selectedService = services.find(s => s.name === walkInData.service);
    if (!selectedService) {
      alert('Please select a valid service');
      return;
    }

    try {
      // Create walk-in booking (paid status)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...walkInData,
          status: 'Paid',
          payment_status: 'success',
          amount: selectedService.price,
          payment_reference: `WALKIN-${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add walk-in booking');
      }

      // Reset form and refresh bookings
      setWalkInData({ name: '', phone: '', service: '', date: '', time: '' });
      setShowAddWalkIn(false);
      fetchBookings();
      alert('Walk-in customer added successfully!');
    } catch (err) {
      alert('Failed to add walk-in customer');
    }
  };

  const filteredBookings =
    filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="text-center mb-8">
            <span className="text-5xl">🔐</span>
            <h1 className="text-3xl font-bold text-black mt-4">Admin Login</h1>
            <p className="text-gray-700 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Username</label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-amber-700 hover:text-amber-600 underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✂️</span>
              <h1 className="text-2xl font-bold text-black">MB Barbershop Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, MB barbershop</span>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
              >
                {showPasswordChange ? 'Cancel' : 'Change Password'}
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem('adminSession');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Password Change Form */}
      {showPasswordChange && (
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <h3 className="text-xl font-bold text-black mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-black"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-black"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-black"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 border-b border-amber-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'bookings'
                ? 'border-b-2 border-amber-900 text-amber-900'
                : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'services'
                ? 'border-b-2 border-amber-900 text-amber-900'
                : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'products'
                ? 'border-b-2 border-amber-900 text-amber-900'
                : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'categories'
                ? 'border-b-2 border-amber-900 text-amber-900'
                : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Manage Bookings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddWalkIn(!showAddWalkIn)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
                >
                  {showAddWalkIn ? 'Cancel' : 'Add Walk-in Customer'}
                </button>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200"
                >
                  <option value="all">All Bookings</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Add Walk-in Customer Form */}
            {showAddWalkIn && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-red-200">
                <h3 className="text-xl font-bold text-black mb-4">Add Walk-in Customer</h3>
                <form onSubmit={handleAddWalkIn} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={walkInData.name}
                        onChange={(e) => setWalkInData({ ...walkInData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-black"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={walkInData.phone}
                        onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-black"
                        placeholder="e.g., 0912345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Service</label>
                      <select
                        required
                        value={walkInData.service}
                        onChange={(e) => setWalkInData({ ...walkInData, service: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.service_id} value={service.name}>
                            {service.name} - {service.price} Birr
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Date</label>
                      <input
                        type="date"
                        required
                        value={walkInData.date}
                        onChange={(e) => setWalkInData({ ...walkInData, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Time</label>
                      <input
                        type="time"
                        required
                        value={walkInData.time}
                        onChange={(e) => setWalkInData({ ...walkInData, time: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Add Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddWalkIn(false)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Service</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Payment</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr
                        key={booking.booking_id}
                        className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}
                      >
                        <td className="px-4 py-3">{booking.name}</td>
                        <td className="px-4 py-3">{booking.phone}</td>
                        <td className="px-4 py-3">{booking.service}</td>
                        <td className="px-4 py-3">{booking.date}</td>
                        <td className="px-4 py-3">{booking.time}</td>
                        <td className="px-4 py-3">
                          {booking.payment_status === 'success' ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              ✓ Paid ({booking.amount} ETB)
                            </span>
                          ) : booking.payment_screenshot ? (
                            <button
                              onClick={() => setViewingScreenshot(booking.payment_screenshot || null)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No receipt</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {booking.status === 'Paid' ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              ✓ Confirmed
                            </span>
                          ) : booking.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.booking_id, 'Approved')}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-semibold"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.booking_id, 'Rejected')}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-semibold"
                              >
                                ✗ Reject
                              </button>
                            </div>
                          ) : (
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                handleUpdateBookingStatus(booking.booking_id, e.target.value)
                              }
                              className="px-2 py-1 rounded border border-amber-200 text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {booking.status === 'Paid' ? (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.booking_id, 'Cancelled')}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-semibold"
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteBooking(booking.booking_id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-amber-700">No bookings found</div>
              )}
            </div>

            {/* Payment Screenshot Modal */}
            {viewingScreenshot && (
              <div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setViewingScreenshot(null)}
              >
                <div className="bg-white rounded-xl p-6 max-w-2xl max-h-[90vh] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-amber-900">Payment Screenshot</h3>
                    <button
                      onClick={() => setViewingScreenshot(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <img 
                    src={viewingScreenshot} 
                    alt="Payment receipt" 
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-900">Manage Services</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                {showAddForm ? 'Cancel' : 'Add New Service'}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Add New Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Service Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Haircut, Beard Trim"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Price (Birr) *</label>
                    <input
                      type="number"
                      placeholder="e.g., 150"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                    <textarea
                      placeholder="Describe the service in detail..."
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Service Image</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleServiceImageChange}
                          className="px-4 py-3 rounded-lg border border-amber-200 w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image (JPG, PNG, GIF) or enter URL below</p>
                      </div>
                      {serviceImagePreview && (
                        <div className="flex flex-col items-center">
                          <img 
                            src={serviceImagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-amber-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setServiceImage(null);
                              setServiceImagePreview(null);
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-black mb-2">Or enter image URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={newService.image_url}
                        onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddService}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    Add Service
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewService({ name: '', description: '', price: '', image_url: '' });
                      setServiceImage(null);
                      setServiceImagePreview(null);
                    }}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.service_id} className="bg-white rounded-xl shadow-lg p-6">
                  {editingService === service.service_id ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Service Name *</label>
                          <input
                            type="text"
                            defaultValue={service.name}
                            onChange={(e) => setEditingServiceData({...editingServiceData, name: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Service Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Price (Birr) *</label>
                          <input
                            type="number"
                            defaultValue={service.price}
                            onChange={(e) => setEditingServiceData({...editingServiceData, price: parseFloat(e.target.value) || 0})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Price (Birr)"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                          <textarea
                            defaultValue={service.description}
                            onChange={(e) => setEditingServiceData({...editingServiceData, description: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Description"
                            rows={4}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">Service Image URL</label>
                          <input
                            type="text"
                            defaultValue={service.image_url || ''}
                            onChange={(e) => setEditingServiceData({...editingServiceData, image_url: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Image URL"
                          />
                          {service.image_url && (
                            <div className="mt-2">
                              <img 
                                src={service.image_url} 
                                alt={service.name} 
                                className="w-32 h-32 object-cover rounded-lg border border-amber-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleUpdateService(service.service_id, editingServiceData);
                            setEditingService(null);
                            setEditingServiceData({});
                          }}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setEditingServiceData({});
                          }}
                          className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-amber-900">{service.name}</h3>
                        <p className="text-amber-700">{service.description}</p>
                        <p className="text-2xl font-bold text-amber-900 mt-2">
                          {service.price} Birr
                        </p>
                        {service.image_url && (
                          <div className="mt-2">
                            <img src={service.image_url} alt={service.name} className="w-16 h-16 object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service.service_id);
                            setEditingServiceData({
                              name: service.name,
                              price: service.price,
                              description: service.description,
                              image_url: service.image_url || ''
                            });
                          }}
                          className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.service_id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-900">Manage Products</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                  className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
                >
                  {showAddProductForm ? 'Cancel' : '+ Add Product'}
                </button>
                <a
                  href="/shop"
                  target="_blank"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Shop
                </a>
              </div>
            </div>

            {showAddProductForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Add New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Hair Gel, Beard Oil" 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Category *</label>
                    <select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.category_id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Price (Birr) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 250" 
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Stock Quantity *</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 20" 
                      value={newProduct.stock_quantity} 
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                    <textarea 
                      placeholder="Describe the product in detail..." 
                      value={newProduct.description} 
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newProduct.is_available}
                        onChange={(e) => setNewProduct({ ...newProduct, is_available: e.target.checked })}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="font-medium">Product is available for sale</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Product Image</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageChange}
                          className="px-4 py-3 rounded-lg border border-amber-200 w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image (JPG, PNG, GIF) or enter URL below</p>
                      </div>
                      {productImagePreview && (
                        <div className="flex flex-col items-center">
                          <img 
                            src={productImagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-amber-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setProductImage(null);
                              setProductImagePreview(null);
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-black mb-2">Or enter image URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAddProduct} 
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProductForm(false);
                      setNewProduct({ 
                        name: '', 
                        description: '', 
                        price: '', 
                        category: '', 
                        stock_quantity: '', 
                        is_available: true, 
                        image_url: '' 
                      });
                      setProductImage(null);
                      setProductImagePreview(null);
                    }}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.product_id} className="bg-white rounded-xl shadow-lg p-6">
                  {editingProduct === product.product_id ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Product Name *</label>
                          <input
                            type="text"
                            defaultValue={product.name}
                            onChange={(e) => setEditingProductData({...editingProductData, name: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Product Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Category *</label>
                          <select 
                            defaultValue={product.category}
                            onChange={(e) => setEditingProductData({...editingProductData, category: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.category_id} value={cat.name}>{cat.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Price (Birr) *</label>
                          <input
                            type="number"
                            defaultValue={product.price}
                            onChange={(e) => setEditingProductData({...editingProductData, price: parseFloat(e.target.value) || 0})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Stock Quantity *</label>
                          <input
                            type="number"
                            defaultValue={product.stock_quantity}
                            onChange={(e) => setEditingProductData({...editingProductData, stock_quantity: parseInt(e.target.value) || 0})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Stock Quantity"
                            min="0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">Description *</label>
                          <textarea
                            defaultValue={product.description}
                            onChange={(e) => setEditingProductData({...editingProductData, description: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                            placeholder="Description"
                            rows={4}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              defaultChecked={product.is_available}
                              onChange={(e) => setEditingProductData({...editingProductData, is_available: e.target.checked})}
                              className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                            />
                            <span className="font-medium">Product is available for sale</span>
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">Product Image URL</label>
                          <input
                            type="text"
                            defaultValue={product.image_url || ''}
                            onChange={(e) => setEditingProductData({...editingProductData, image_url: e.target.value})}
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Image URL"
                          />
                          {product.image_url && (
                            <div className="mt-2">
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-32 h-32 object-cover rounded-lg border border-amber-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleUpdateProduct(product.product_id, editingProductData);
                            setEditingProduct(null);
                            setEditingProductData({});
                          }}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setEditingProductData({});
                          }}
                          className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-amber-900">{product.name}</h3>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">{product.category}</span>
                          <span className={`text-xs px-2 py-1 rounded ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.is_available ? 'Available' : 'Hidden'}</span>
                        </div>
                        <p className="text-amber-700 text-sm mb-2">{product.description}</p>
                        <div className="flex gap-4">
                          <span className="text-lg font-bold text-amber-900">{product.price} Birr</span>
                          <span className="text-sm text-amber-600">Stock: {product.stock_quantity}</span>
                        </div>
                        {product.image_url && (
                          <div className="mt-2">
                            <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product.product_id);
                            setEditingProductData({
                              name: product.name,
                              category: product.category,
                              price: product.price,
                              stock_quantity: product.stock_quantity,
                              is_available: product.is_available,
                              description: product.description,
                              image_url: product.image_url || ''
                            });
                          }}
                          className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 text-sm"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleUpdateProduct(product.product_id, { is_available: !product.is_available })} className={`px-4 py-2 rounded-lg text-sm ${product.is_available ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>{product.is_available ? 'Hide' : 'Show'}</button>
                        <button onClick={() => { const newStock = prompt('Enter new stock:', product.stock_quantity.toString()); if (newStock) handleUpdateProduct(product.product_id, { stock_quantity: parseInt(newStock) }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Update Stock</button>
                        <button onClick={() => handleDeleteProduct(product.product_id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-900">Manage Product Categories</h2>
              <button onClick={() => setShowAddCategoryForm(!showAddCategoryForm)} className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition">{showAddCategoryForm ? 'Cancel' : '+ Add Category'}</button>
            </div>
            {showAddCategoryForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Category Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Hair Care, Beard Care" 
                      value={newCategory.name} 
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Display Order</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 1" 
                      value={newCategory.display_order} 
                      onChange={(e) => setNewCategory({ ...newCategory, display_order: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2">Description</label>
                    <textarea 
                      placeholder="Describe the category..." 
                      value={newCategory.description} 
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} 
                      className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAddCategory} 
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategoryForm(false);
                      setNewCategory({ name: '', description: '', display_order: '' });
                    }}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-4">
              {categories.map((cat) => (
                <div key={cat.category_id} className="bg-white rounded-xl shadow-lg p-6">
                  {editingCategory === cat.category_id ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Category Name *</label>
                          <input 
                            type="text" 
                            defaultValue={cat.name} 
                            onChange={(e) => setEditingCategoryData({...editingCategoryData, name: e.target.value})} 
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Display Order</label>
                          <input 
                            type="number" 
                            defaultValue={cat.display_order} 
                            onChange={(e) => setEditingCategoryData({...editingCategoryData, display_order: parseInt(e.target.value) || 999})} 
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            min="0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">Description</label>
                          <textarea 
                            defaultValue={cat.description} 
                            onChange={(e) => setEditingCategoryData({...editingCategoryData, description: e.target.value})} 
                            className="px-4 py-3 rounded-lg border border-amber-200 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { 
                            handleUpdateCategory(cat.category_id, editingCategoryData); 
                            setEditingCategory(null);
                            setEditingCategoryData({});
                          }} 
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCategory(null);
                            setEditingCategoryData({});
                          }} 
                          className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-amber-900">{cat.name}</h3>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Order: {cat.display_order}</span>
                        </div>
                        <p className="text-amber-700">{cat.description}</p>
                        <p className="text-sm text-amber-600 mt-2">{products.filter(p => p.category === cat.name).length} product(s)</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingCategory(cat.category_id)} 
                          className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.category_id)} 
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-amber-700 text-lg">No categories yet!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

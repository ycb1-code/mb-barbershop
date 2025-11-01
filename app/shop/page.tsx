'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?available=true');
      const data = await res.json();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category)));
      setCategories(uniqueCategories as string[]);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b border-red-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">✂️</span>
              <h1 className="text-2xl font-bold text-red-900">MB Barbershop</h1>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-red-800 hover:text-red-600 transition">
                Home
              </Link>
              <Link href="/catalogue" className="text-red-800 hover:text-red-600 transition">
                Services
              </Link>
              <Link href="/book" className="text-red-800 hover:text-red-600 transition">
                Book Now
              </Link>
              <Link href="/manage" className="text-red-800 hover:text-red-600 transition">
                My Bookings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">🛍️ Barbershop Products</h2>
          <p className="text-lg text-black">
            Premium grooming products to keep you looking sharp at home
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-red-900 text-white'
                : 'bg-white text-red-900 border-2 border-red-200 hover:border-red-400'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-red-900 text-white'
                  : 'bg-white text-red-900 border-2 border-red-200 hover:border-red-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-black">No products available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border border-red-100 flex flex-col"
              >
                {/* Product Image */}
                <div className="h-56 bg-gradient-to-br from-red-200 to-red-100 flex items-center justify-center relative">
                  <span className="text-6xl">🧴</span>
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Only {product.stock_quantity} left!
                    </div>
                  )}
                  {product.stock_quantity === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-700 text-sm mb-4 flex-1">
                    {product.description}
                  </p>

                  {/* Stock Info */}
                  <div className="text-sm text-gray-600 mb-3">
                    📦 {product.stock_quantity} in stock
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-red-100">
                    <span className="text-2xl font-bold text-red-900">
                      {product.price} Birr
                    </span>
                    <a
                      href={`tel:0920224604`}
                      className={`px-5 py-2 rounded-full font-semibold transition ${
                        product.stock_quantity > 0
                          ? 'bg-red-900 text-white hover:bg-red-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (product.stock_quantity === 0) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {product.stock_quantity > 0 ? '📞 Order' : 'Sold Out'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Contact Info */}
      <section className="bg-gradient-to-r from-red-900 to-red-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to Order?</h3>
          <p className="text-red-100 mb-6">
            Call us or visit the shop to purchase any of our premium products
          </p>
          <a
            href="tel:0920224604"
            className="inline-block bg-white text-red-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition"
          >
            📞 Call: 0920224604
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2">MB Barbershop</h4>
            <p className="text-gray-300">Addis Ababa, Ethiopia</p>
            <p className="text-gray-300">Hours: 2:00 AM – 2:00 PM (EAT)</p>
            <p className="text-gray-300 mt-2">
              <a href="tel:0920224604" className="hover:text-white">📞 0920224604</a> | 
              <a href="mailto:belaynehamsal20@gmail.com" className="hover:text-white">✉️ belaynehamsal20@gmail.com</a>
            </p>
          </div>
          <p className="text-gray-300 text-sm">
            © 2025 MB Barbershop. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">Made by promo4s</p>
        </div>
      </footer>
    </div>
  );
}

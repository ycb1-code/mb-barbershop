'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export default function CataloguePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch services:', err);
        setLoading(false);
      });
  }, []);

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
              <Link href="/shop" className="text-red-800 hover:text-red-600 transition">
                Shop
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
          <h2 className="text-4xl font-bold text-black mb-4">Our Services</h2>
          <p className="text-lg text-black">
            Choose from our range of professional barbering services
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.service_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border border-red-100"
              >
                <div className="h-48 bg-gradient-to-br from-red-200 to-red-100 flex items-center justify-center">
                  <span className="text-6xl">💈</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-red-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-red-900">
                      {service.price} Birr
                    </span>
                    <Link
                      href={`/book?service=${encodeURIComponent(service.name)}`}
                      className="bg-red-900 text-white px-6 py-2 rounded-full hover:bg-red-800 transition"
                    >
                      Book This
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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

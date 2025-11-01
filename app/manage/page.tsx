'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Booking {
  booking_id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Paid' | 'Completed' | 'Cancelled';
  payment_reference?: string;
  payment_status?: 'pending' | 'success' | 'failed';
  amount: number;
  created_at: string;
  updated_at: string;
}

export default function ManagePage() {
  const [bookingId, setBookingId] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ date: '', time: '', service: '' });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking not found');
      }

      setBookings([data]); // Return single booking as array
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.booking_id);
    setEditData({
      date: booking.date,
      time: booking.time,
      service: booking.service,
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      // Refresh bookings
      const updatedBookings = bookings.map((b) =>
        b.booking_id === id ? { ...b, ...editData } : b
      );
      setBookings(updatedBookings);
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Update local state
      setBookings(bookings.map((b) => (b.booking_id === id ? { ...b, status: 'Cancelled' } : b)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b border-red-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">✂️</span>
              <h1 className="text-2xl font-bold text-red-900">MB Barbershop</h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-red-800 hover:text-red-600 transition">
                Home
              </Link>
              <Link href="/book" className="text-red-800 hover:text-red-600 transition">
                Book Now
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-red-900 mb-4">Manage Your Booking</h2>
            <p className="text-lg text-gray-700">
              Enter your booking ID to view and manage your appointment
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="bookingId" className="block text-sm font-semibold text-black mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  id="bookingId"
                  required
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition uppercase text-black"
                  placeholder="e.g., W6I7DNM6R"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find My Booking'}
              </button>
              
              {searched && (
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-sm mt-2"
                >
                  Refresh
                </button>
              )}
            </form>
          </div>

          {/* Bookings List */}
          {searched && (
            <div>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
                  <p className="text-gray-700 text-lg">No booking found with this ID.</p>
                  <Link
                    href="/book"
                    className="inline-block mt-4 text-red-900 hover:text-red-700 underline"
                  >
                    Create a new booking
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.booking_id}
                      className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
                    >
                      {editingId === booking.booking_id ? (
                        <div className="space-y-4">
                          <h3 className="font-bold text-red-900 mb-2">Edit Booking</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                value={editData.date}
                                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Time
                              </label>
                              <input
                                type="time"
                                value={editData.time}
                                onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-black"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Service
                              </label>
                              <input
                                type="text"
                                value={editData.service}
                                onChange={(e) => setEditData({ ...editData, service: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-black"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(booking.booking_id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-red-900">{booking.service}</h3>
                              <p className="text-gray-700">{booking.name}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                booking.status === 'Paid' || booking.status === 'Completed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-black">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold text-black">{booking.time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Amount Paid</p>
                              <p className="font-semibold text-black">{booking.amount} ETB</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Booking ID</p>
                              <p className="font-semibold text-black uppercase">{booking.booking_id}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Contact Info</p>
                            <p className="font-semibold text-black">{booking.phone}{booking.email ? ` • ${booking.email}` : ''}</p>
                          </div>

                          <div className="mb-4 bg-red-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Booking Created</p>
                            <p className="font-semibold text-black">{new Date(booking.created_at).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>

                          {booking.status === 'Pending' && (
                            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center">
                              <p className="text-yellow-700 font-semibold">⏳ Awaiting Admin Approval</p>
                            </div>
                          )}
                          {booking.status === 'Paid' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(booking)}
                                className="flex-1 bg-red-900 text-white py-2 rounded-lg hover:bg-red-800"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancel(booking.booking_id)}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {booking.status === 'Pending' && (
                            <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-center">
                              <p className="text-red-700 font-semibold">✗ Payment Rejected</p>
                              <p className="text-sm text-red-600 mt-1">Please contact admin</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2">MB Barbershop</h4>
            <p className="text-gray-400">Addis Ababa, Ethiopia</p>
            <p className="text-gray-400">Hours: 2:00 AM – 2:00 PM (EAT)</p>
            <p className="text-gray-400 mt-2">
              <a href="tel:0920224604" className="hover:text-white">📞 0920224604</a> | 
              <a href="mailto:belaynehamsal20@gmail.com" className="hover:text-white">✉️ belaynehamsal20@gmail.com</a>
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 MB Barbershop. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">Made by promo4s</p>
        </div>
      </footer>
    </div>
  );
}

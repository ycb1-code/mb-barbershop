'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';

interface BookingDetails {
  booking_id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  phone: string;
}

function ReceiptPageContent() {
  const [isClient, setIsClient] = useState(false);
  const [txRef, setTxRef] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Process URL params only on client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      setTxRef(ref);
    }
  }, []);

  useEffect(() => {
    if (txRef) {
      fetchBookingDetails();
    }
  }, [txRef]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch('/api/payment/verify-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_ref: txRef }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success' && data.booking) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    if (!booking) return;

    const receiptContent = `
MB BARBERSHOP - BOOKING RECEIPT
================================

PAYMENT SUCCESSFUL ✓

Booking Details:
----------------
Booking ID: ${booking.booking_id.toUpperCase()}
Customer Name: ${booking.name}
Phone Number: ${booking.phone}
Service: ${booking.service}
Date: ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${booking.time}

Payment Information:
-------------------
Total Paid: ${booking.amount} ETB
Transaction Reference: ${txRef}

Your appointment is confirmed!
We look forward to seeing you.

Need help? Call us at 09012345678

================================
Made by promo4s
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MB-Barbershop-Receipt-${booking.booking_id.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-900"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Receipt Not Found</h1>
          <Link href="/" className="text-amber-900 underline">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl p-8 border-b-4 border-amber-900">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">MB Barbershop</h1>
            <p className="text-amber-700">Payment Receipt</p>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 rounded-full p-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <p className="text-center text-green-600 font-bold text-xl mb-2">Payment Successful</p>
          <p className="text-center text-gray-600 text-sm">Your booking has been confirmed</p>
        </div>

        {/* Receipt Details */}
        <div className="bg-white shadow-xl p-8">
          <h2 className="text-xl font-bold text-amber-900 mb-6 border-b-2 border-amber-200 pb-2">
            Booking Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Booking ID:</span>
              <span className="text-amber-900 font-bold">{booking.booking_id.toUpperCase()}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Customer Name:</span>
              <span className="text-amber-900 font-semibold">{booking.name}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Phone Number:</span>
              <span className="text-amber-900 font-semibold">{booking.phone}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Service:</span>
              <span className="text-amber-900 font-semibold">{booking.service}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Date:</span>
              <span className="text-amber-900 font-semibold">
                {new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Time:</span>
              <span className="text-amber-900 font-semibold">{booking.time}</span>
            </div>
            
            <div className="flex justify-between py-4 bg-amber-50 rounded-lg px-4 mt-4">
              <span className="text-amber-900 font-bold text-lg">Total Paid:</span>
              <span className="text-amber-900 font-bold text-2xl">{booking.amount} ETB</span>
            </div>
          </div>

          <div className="mt-6 bg-green-50 rounded-xl p-4">
            <p className="text-green-800 text-sm text-center">
              ✅ Your appointment is confirmed. We look forward to seeing you!
            </p>
          </div>

          <div className="mt-4 bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
            <p className="text-amber-900 text-sm font-semibold text-center mb-2">
              🔑 Save this Booking ID to manage your appointment:
            </p>
            <p className="text-amber-900 text-2xl font-bold text-center uppercase tracking-wider">
              {booking.booking_id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.print()}
                className="bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              
              <button
                onClick={downloadReceipt}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
            
            <Link
              href="/"
              className="block w-full bg-white text-amber-900 py-3 rounded-lg font-semibold hover:bg-amber-50 transition border-2 border-amber-900"
            >
              Back to Homepage
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-1">
              Need help? Call us at <a href="tel:09012345678" className="text-amber-900 font-semibold">09012345678</a>
            </p>
            <p className="text-xs text-gray-500">Transaction Reference: {txRef}</p>
          </div>
        </div>

        {/* Made by promo4s watermark */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Made by promo4s</p>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-900"></div>
      </div>
    }>
      <ReceiptPageContent />
    </Suspense>
  );
}
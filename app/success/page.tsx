'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessPageContent() {
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Process URL params only on client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setName(urlParams.get('name'));
      setService(urlParams.get('service'));
      setDate(urlParams.get('date'));
      setTime(urlParams.get('time'));
      setPrice(urlParams.get('price'));
      setStatus(urlParams.get('status'));
    }
  }, []);

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-4 border-green-500">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Booking Submitted!</h1>
          <p className="text-lg text-amber-800 mb-4">
            Thanks {name}! Your booking request has been received.
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-8">
            <p className="text-amber-900 font-semibold">⏳ Pending Admin Approval</p>
            <p className="text-sm text-amber-700 mt-2">
              Your payment screenshot is being reviewed. You&apos;ll be notified once approved.
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-bold text-amber-900 mb-4 text-center">Appointment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-amber-700">Service:</span>
                <span className="font-semibold text-amber-900">{service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Date:</span>
                <span className="font-semibold text-amber-900">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Time:</span>
                <span className="font-semibold text-amber-900">{time}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-3">
                <span className="text-amber-700">Price:</span>
                <span className="font-bold text-amber-900 text-xl">{price} Birr</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-amber-700 mb-8">
            Once approved, your time slot will be confirmed and you&apos;ll see you at MB Barbershop!
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Go Home
            </Link>
            <Link
              href="/manage"
              className="block w-full bg-white text-amber-900 py-3 rounded-lg font-semibold hover:bg-amber-50 transition border-2 border-amber-900"
            >
              Manage Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
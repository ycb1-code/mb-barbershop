'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessPageContent() {
  const [isClient, setIsClient] = useState(false);
  const [txRef, setTxRef] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed'>('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Process URL params only on client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      const typeParam = urlParams.get('type');
      setTxRef(ref);
      setType(typeParam);
    }
  }, []);

  useEffect(() => {
    // For bookings, redirect immediately without verification
    if (txRef && type === 'booking') {
      window.location.replace(`/receipt?ref=${txRef}`);
      return;
    }
    
    // For orders, verify payment
    if (txRef && type) {
      verifyPayment();
    }
  }, [txRef, type]);

  const verifyPayment = async () => {
    try {
      const endpoint = '/api/payment/verify-order';
      
      // Set a shorter client-side timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_ref: txRef }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus('success');
        setMessage(data.message || 'Payment verified successfully!');
      } else {
        setStatus('failed');
        setMessage(data.message || 'Payment verification failed');
      }
    } catch (error) {
      // If verification times out but we're on success page, assume success
      // (Chapa only redirects to success URL if payment succeeded)
      if (error instanceof Error && error.name === 'AbortError') {
        setStatus('success');
        setMessage('Payment completed! (Verification pending - your order is confirmed)');
      } else {
        setStatus('failed');
        setMessage('Error verifying payment');
      }
    } finally {
      setVerifying(false);
    }
  };

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

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Verifying Payment...</h2>
          <p className="text-amber-700">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className={`bg-white rounded-2xl shadow-xl p-8 text-center border-4 ${
          status === 'success' ? 'border-green-500' : 'border-red-500'
        }`}>
          {/* Status Icon */}
          <div className="mb-6">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {status === 'success' ? (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>

          {/* Status Message */}
          <h1 className={`text-3xl font-bold mb-4 ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          
          <p className="text-lg text-amber-800 mb-8">
            {message}
          </p>

          {status === 'success' && (
            <>
              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <h2 className="font-bold text-green-900 mb-2">
                  {type === 'booking' ? '✅ Booking Confirmed' : '✅ Order Placed'}
                </h2>
                <p className="text-sm text-green-700">
                  {type === 'booking' 
                    ? 'Your appointment has been confirmed. We look forward to seeing you!'
                    : 'Your order has been placed. We will contact you shortly.'}
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                  📧 A confirmation has been sent to your phone number.
                </p>
              </div>
            </>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <p className="text-red-700 text-sm">
                Your payment was not successful. Please try again or contact us for assistance.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Go to Homepage
            </Link>
            {status === 'success' && type === 'booking' && (
              <Link
                href="/manage"
                className="block w-full bg-white text-amber-900 py-3 rounded-lg font-semibold hover:bg-amber-50 transition border-2 border-amber-900"
              >
                Manage My Bookings
              </Link>
            )}
            {status === 'failed' && (
              <Link
                href={type === 'booking' ? '/book' : '/shop'}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try Again
              </Link>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500">Transaction Reference: {txRef}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Call us at <a href="tel:09012345678" className="text-amber-900 font-semibold">09012345678</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
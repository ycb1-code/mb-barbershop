'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

interface Service {
  service_id: string;
  name: string;
  price: number;
}

function BookPageContent() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Generate time slots in 45-minute intervals from 2 AM to 2 PM
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 2; // 2 AM
    const endHour = 14; // 2 PM (14:00)
    
    // Generate 45-minute intervals
    let totalMinutes = startHour * 60; // Start at 2 AM in minutes
    const endMinutes = endHour * 60; // End at 2 PM in minutes
    
    while (totalMinutes < endMinutes && slots.length < 15) {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Convert to 12-hour format
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      
      slots.push(JSON.stringify({ time24, time12 }));
      
      // Add 45 minutes for next slot
      totalMinutes += 45;
    }
    
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Process URL params only on client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service');
      if (serviceParam) {
        setPreSelectedService(serviceParam);
        setFormData(prev => ({ ...prev, service: serviceParam }));
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error('Failed to fetch services:', err));
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const response = await fetch('/api/bookings');
      const allBookings = await response.json();
      
      // Filter paid/completed bookings for the selected date
      const bookedSlots = allBookings
        .filter((b: { date: string; status: string; time: string; }) => b.date === date && (b.status === 'Paid' || b.status === 'Completed'))
        .map((b: { time: string; }) => b.time);
      
      // Get all slots and filter out booked ones
      const available = allTimeSlots.filter(slotStr => {
        const slot = JSON.parse(slotStr);
        return !bookedSlots.includes(slot.time24);
      });
      
      setAvailableSlots(available);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
      setAvailableSlots(allTimeSlots); // Show all if fetch fails
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get service price
      const selectedService = services.find(s => s.name === formData.service);
      if (!selectedService) {
        throw new Error('Please select a service');
      }

      // Initialize payment
      const response = await fetch('/api/payment/initialize-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: selectedService.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to Chapa payment page
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  // Don't render the form until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-black mb-4">Loading...</h2>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black mb-4">Book Your Appointment</h2>
            <p className="text-lg text-black">
              Fill in the details below to secure your spot
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black"
                  placeholder="e.g., 0912345678"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="block text-sm font-semibold text-black mb-2">
                  Select Service
                </label>
                <select
                  id="service"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black appearance-none bg-white"
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service.service_id} value={service.name}>
                      {service.name} - {service.price} Birr
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-black mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black"
                />
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-black mb-2">
                  Select Time
                </label>
                {loadingSlots ? (
                  <div className="text-center py-3 text-gray-500">
                    Loading available slots...
                  </div>
                ) : availableSlots.length === 0 && formData.date ? (
                  <div className="text-center py-3 text-gray-500">
                    No available slots for this date
                  </div>
                ) : (
                  <select
                    id="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-black appearance-none bg-white"
                    disabled={!formData.date}
                  >
                    <option value="">Choose a time slot</option>
                    {availableSlots.map((slotStr, index) => {
                      const slot = JSON.parse(slotStr);
                      return (
                        <option key={index} value={slot.time24}>
                          {slot.time12} ({slot.time24})
                        </option>
                      );
                    })}
                  </select>
                )}
                {!formData.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Please select a date first to see available time slots
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  ℹ️ <strong>How it works:</strong> Click &quot;Proceed to Payment&quot; and you&apos;ll be redirected to Chapa&apos;s secure payment page to complete your booking payment.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Redirecting to Payment...' : '💳 Proceed to Payment'}
              </button>
              
              <p className="text-sm text-black text-center">
                🔒 Secured by Chapa Payment Gateway
              </p>
            </form>

            <div className="mt-6 text-center">
              <Link href="/manage" className="text-black hover:text-gray-800 underline">
                Manage existing bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-black mb-4">Loading...</h2>
            </div>
          </div>
        </main>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
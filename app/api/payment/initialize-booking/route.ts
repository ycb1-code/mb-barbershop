import { NextResponse } from 'next/server';
import { initializeChapaPayment, generateTxRef } from '@/lib/chapa';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, amount } = body;

    console.log('Booking payment request:', { name, phone, email, service, date, time, amount });

    if (!name || !phone || !service || !date || !time || !amount) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate time is within working hours (2 AM - 2 PM)
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to minutes for easier comparison
    const totalMinutes = hour * 60 + minute;
    const startMinutes = 2 * 60; // 2 AM = 120 minutes
    const endMinutes = 14 * 60; // 2 PM = 840 minutes
    
    if (totalMinutes < startMinutes || totalMinutes >= endMinutes) {
      return NextResponse.json(
        { error: 'Bookings are only available from 2:00 AM to 2:00 PM' },
        { status: 400 }
      );
    }

    // Check if time slot is already booked
    const existingBookings = await db.bookings.getApprovedByDateTime(date, time);
    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another time.' },
        { status: 400 }
      );
    }

    // Generate unique transaction reference
    const txRef = generateTxRef('BOOKING');
    console.log('Generated tx_ref:', txRef);

    // Create pending booking
    const booking = await db.bookings.create({
      name,
      phone,
      email,
      service,
      date,
      time,
      status: 'Pending',
      payment_reference: txRef,
      payment_status: 'pending',
      amount: parseFloat(amount),
    });

    console.log('Booking created:', booking.booking_id);

    // Verify booking was saved
    const allBookings = await db.bookings.getAll();
    console.log('Total bookings in DB after creation:', allBookings.length);
    console.log('All booking refs:', allBookings.map(b => b.payment_reference));

    // Initialize Chapa payment
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    const customerEmail = email || `${phone.replace(/\D/g, '')}@mbshop.com`;
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits

    const paymentData = {
      amount: parseFloat(amount),
      currency: 'ETB',
      email: customerEmail,
      first_name: firstName.substring(0, 50),
      last_name: lastName.substring(0, 50),
      phone_number: cleanPhone.startsWith('251') ? cleanPhone : `251${cleanPhone.replace(/^0/, '')}`,
      tx_ref: txRef,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-booking`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/receipt?ref=${txRef}`,
      customization: {
        title: 'MB Barbershop',
        description: `${service.replace(/[^a-zA-Z0-9\s\-_.]/g, '')} ${time.replace(':', '.')}`,
      },
    };

    console.log('Payment data prepared:', { ...paymentData, amount: paymentData.amount });

    const chapaResponse = await initializeChapaPayment(paymentData);

    console.log('Chapa response received, checkout URL:', chapaResponse.data.checkout_url);

    return NextResponse.json({
      booking_id: booking.booking_id,
      checkout_url: chapaResponse.data.checkout_url,
      tx_ref: txRef,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}

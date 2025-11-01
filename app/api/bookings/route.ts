import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (phone) {
      const bookings = await db.bookings.getByPhone(phone);
      return NextResponse.json(bookings);
    }

    const bookings = await db.bookings.getAll();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, date, time, email } = body;

    if (!name || !phone || !service || !date || !time) {
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

    const booking = await db.bookings.create({
      name,
      phone,
      email,
      service,
      date,
      time,
      status: 'Pending',
      payment_status: 'pending',
      amount: 0, // Will be updated during payment
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

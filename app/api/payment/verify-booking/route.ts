import { NextResponse } from 'next/server';
import { verifyChapaPayment } from '@/lib/chapa';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tx_ref } = body;

    if (!tx_ref) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    // Verify payment with Chapa
    const verificationResponse = await verifyChapaPayment(tx_ref);

    if (verificationResponse.data.status === 'success') {
      // Find booking by payment reference
      const allBookings = await db.bookings.getAll();
      const booking = allBookings.find(b => b.payment_reference === tx_ref);

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // Update booking status
      await db.bookings.update(booking.booking_id, {
        status: 'Paid',
        payment_status: 'success',
      });

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        booking: {
          booking_id: booking.booking_id,
          name: booking.name,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          amount: booking.amount,
          phone: booking.phone,
        },
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment verification failed',
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// Webhook endpoint for Chapa callbacks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get('tx_ref') || searchParams.get('trx_ref'); // Chapa uses both
    const status = searchParams.get('status');

    console.log('Webhook received:', { tx_ref, status });

    if (!tx_ref) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    const allBookings = await db.bookings.getAll();
    const booking = allBookings.find(b => b.payment_reference === tx_ref);

    console.log('Found booking:', booking ? booking.booking_id : 'NOT FOUND');

    if (!booking) {
      console.error('Booking not found for tx_ref:', tx_ref);
      console.error('Available bookings:', allBookings.map(b => ({ id: b.booking_id, ref: b.payment_reference })));
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (status === 'success') {
      await db.bookings.update(booking.booking_id, {
        status: 'Paid',
        payment_status: 'success',
      });
      console.log('Booking updated to Paid:', booking.booking_id);
      
      // Return success with booking details for receipt
      return NextResponse.json({ 
        status: 'processed',
        booking: {
          booking_id: booking.booking_id,
          name: booking.name,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          amount: booking.amount,
        }
      });
    } else {
      await db.bookings.update(booking.booking_id, {
        payment_status: 'failed',
      });
    }

    return NextResponse.json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

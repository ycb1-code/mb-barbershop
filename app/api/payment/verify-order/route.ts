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
      // Update order status
      await db.orders.updateByPaymentReference(tx_ref, {
        payment_status: 'success',
        order_status: 'confirmed',
      });

      const order = await db.orders.getByPaymentReference(tx_ref);

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        order_id: order?.order_id,
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

    if (!tx_ref) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    if (status === 'success') {
      await db.orders.updateByPaymentReference(tx_ref, {
        payment_status: 'success',
        order_status: 'confirmed',
      });
    } else {
      await db.orders.updateByPaymentReference(tx_ref, {
        payment_status: 'failed',
      });
    }

    return NextResponse.json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

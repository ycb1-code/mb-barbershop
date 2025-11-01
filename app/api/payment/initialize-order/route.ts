import { NextResponse } from 'next/server';
import { initializeChapaPayment, generateTxRef } from '@/lib/chapa';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, items, total_amount } = body;

    if (!customer_name || !customer_phone || !items || !total_amount) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Generate unique transaction reference
    const txRef = generateTxRef('ORDER');

    // Create pending order
    const order = await db.orders.create({
      customer_name,
      customer_phone,
      customer_email,
      items,
      total_amount: parseFloat(total_amount),
      payment_reference: txRef,
      payment_status: 'pending',
      order_status: 'pending',
    });

    // Initialize Chapa payment
    const [firstName, ...lastNameParts] = customer_name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    const customerEmail = customer_email || `${customer_phone.replace(/\D/g, '')}@mbshop.com`;
    const cleanPhone = customer_phone.replace(/\D/g, '');

    const paymentData = {
      amount: parseFloat(total_amount),
      currency: 'ETB',
      email: customerEmail,
      first_name: firstName.substring(0, 50),
      last_name: lastName.substring(0, 50),
      phone_number: cleanPhone.startsWith('251') ? cleanPhone : `251${cleanPhone.replace(/^0/, '')}`,
      tx_ref: txRef,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-order`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?ref=${txRef}&type=order`,
      customization: {
        title: 'MB Shop',
        description: `Order ${order.order_id}`,
      },
    };

    const chapaResponse = await initializeChapaPayment(paymentData);

    return NextResponse.json({
      order_id: order.order_id,
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

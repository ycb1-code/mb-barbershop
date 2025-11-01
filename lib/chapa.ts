// Chapa Payment Gateway Integration for Ethiopia

export interface ChapaPaymentData {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title: string;
    description: string;
  };
}

export interface ChapaInitializeResponse {
  status: string;
  message: string;
  data: {
    checkout_url: string;
  };
}

export interface ChapaVerifyResponse {
  status: string;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: number;
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
    };
    created_at: string;
    updated_at: string;
  };
}

const CHAPA_API_URL = 'https://api.chapa.co/v1';

export async function initializeChapaPayment(
  paymentData: ChapaPaymentData
): Promise<ChapaInitializeResponse> {
  try {
    console.log('Initializing Chapa payment with data:', JSON.stringify(paymentData, null, 2));
    
    const response = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const responseData = await response.json();
    console.log('Chapa API response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('Chapa API error:', responseData);
      throw new Error(responseData.message || JSON.stringify(responseData) || 'Failed to initialize payment');
    }

    return responseData;
  } catch (error) {
    console.error('Chapa payment initialization error:', error);
    throw error;
  }
}

export async function verifyChapaPayment(txRef: string): Promise<ChapaVerifyResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${CHAPA_API_URL}/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Payment verification timeout - please check your booking status later');
    }
    throw error;
  }
}

export function generateTxRef(prefix: string = 'MB'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

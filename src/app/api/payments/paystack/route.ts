import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const PRICE_KOBO = 3_000_000; // ₦30,000 in kobo

export async function POST(req: NextRequest) {
  try {
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Registration already completed' }, { status: 400 });
    }

    // Initialise transaction with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: registration.email,
        amount: PRICE_KOBO,
        currency: 'NGN',
        reference: registration.referenceId,
        metadata: {
          registrationId: registration.id,
          referenceId: registration.referenceId,
          fullName: registration.fullName,
        },
        callback_url: `${BASE_URL}/api/webhooks/paystack/verify?registrationId=${registration.id}`,
      }),
    });

    const data = await response.json();

    if (!data.status || !data.data?.authorization_url) {
      console.error('[Paystack init error]', data);
      return NextResponse.json(
        { error: data.message || 'Failed to initialise Paystack payment' },
        { status: 502 }
      );
    }

    // Upsert Payment record
    await prisma.payment.upsert({
      where: { registrationId: registration.id },
      create: {
        registrationId: registration.id,
        provider: 'PAYSTACK',
        status: 'PENDING',
        amount: PRICE_KOBO,
        currency: 'NGN',
        providerReference: registration.referenceId,
        customerEmail: registration.email,
        metadata: { paystackReference: registration.referenceId },
      },
      update: {
        provider: 'PAYSTACK',
        status: 'PENDING',
        providerReference: registration.referenceId,
        metadata: { paystackReference: registration.referenceId },
      },
    });

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (err) {
    console.error('[POST /api/payments/paystack]', err);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
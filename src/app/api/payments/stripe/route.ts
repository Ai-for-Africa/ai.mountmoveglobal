import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const PRICE_USD_CENTS = 4900; // $49.00

export async function POST(req: NextRequest) {
  try {
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { payment: true },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Registration already completed' }, { status: 400 });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: registration.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: PRICE_USD_CENTS,
            product_data: {
              name: 'AI Digital Wealth Masterclass',
              description: '12-Week Cohort · MountMove Global',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: registration.id,
        referenceId: registration.referenceId,
      },
      success_url: `${BASE_URL}/success?id=${registration.id}&provider=stripe`,
      cancel_url: `${BASE_URL}/payment?id=${registration.id}&cancelled=1`,
    });

    // Upsert Payment record
    await prisma.payment.upsert({
      where: { registrationId: registration.id },
      create: {
        registrationId: registration.id,
        provider: 'STRIPE',
        status: 'PENDING',
        amount: PRICE_USD_CENTS,
        currency: 'USD',
        providerReference: session.id,
        customerEmail: registration.email,
        metadata: { sessionId: session.id },
      },
      update: {
        provider: 'STRIPE',
        status: 'PENDING',
        providerReference: session.id,
        metadata: { sessionId: session.id },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[POST /api/payments/stripe]', err);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
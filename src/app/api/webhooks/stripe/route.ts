import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendRegistrationConfirmation, sendAdminNotification } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16', });

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[Stripe webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency: skip already-processed events
  const existing = await prisma.webhookEvent.findUnique({ where: { eventId: event.id } });
  if (existing?.processed) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // Log the event
  await prisma.webhookEvent.upsert({
    where: { eventId: event.id },
    create: {
      provider: 'stripe',
      eventId: event.id,
      eventType: event.type,
      payload: event as object,
      processed: false,
    },
    update: {},
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registrationId;

    if (!registrationId) {
      console.error('[Stripe webhook] No registrationId in metadata');
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 });
    }

    try {
      // Update payment and registration atomically
      await prisma.$transaction([
        prisma.payment.update({
          where: { registrationId },
          data: {
            status: 'COMPLETED',
            providerPaymentId: session.payment_intent as string,
            verifiedAt: new Date(),
          },
        }),
        prisma.registration.update({
          where: { id: registrationId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        }),
      ]);

      // Mark event as processed
      await prisma.webhookEvent.update({
        where: { eventId: event.id },
        data: { processed: true, processedAt: new Date() },
      });

      // Send emails (non-blocking)
      const registration = await prisma.registration.findUnique({ where: { id: registrationId } });
      if (registration) {
        await Promise.allSettled([
          sendRegistrationConfirmation({
            to: registration.email,
            fullName: registration.fullName,
            referenceId: registration.referenceId,
            paymentMethod: 'stripe',
          }),
          sendAdminNotification({
            fullName: registration.fullName,
            email: registration.email,
            referenceId: registration.referenceId,
            paymentMethod: 'Stripe',
          }),
        ]);
      }
    } catch (err) {
      console.error('[Stripe webhook] processing error:', err);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
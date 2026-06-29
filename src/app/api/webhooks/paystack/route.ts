import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendRegistrationConfirmation, sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Shared helper: verify and complete a Paystack payment
async function verifyAndComplete(reference: string) {
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );
  const verifyData = await verifyRes.json();

  if (!verifyData.status || verifyData.data?.status !== 'success') {
    throw new Error(`Payment not successful: ${verifyData.message}`);
  }

  const txData = verifyData.data;
  const registrationId = txData.metadata?.registrationId;

  if (!registrationId) throw new Error('No registrationId in Paystack metadata');

  const registration = await prisma.registration.findUnique({ where: { id: registrationId } });
  if (!registration) throw new Error(`Registration not found: ${registrationId}`);

  if (registration.status === 'COMPLETED') return registration; // already done

  await prisma.$transaction([
    prisma.payment.update({
      where: { registrationId },
      data: {
        status: 'COMPLETED',
        providerPaymentId: String(txData.id),
        verifiedAt: new Date(),
      },
    }),
    prisma.registration.update({
      where: { id: registrationId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    }),
  ]);

  await Promise.allSettled([
    sendRegistrationConfirmation({
      to: registration.email,
      fullName: registration.fullName,
      referenceId: registration.referenceId,
      paymentMethod: 'paystack',
    }),
    sendAdminNotification({
      fullName: registration.fullName,
      email: registration.email,
      referenceId: registration.referenceId,
      paymentMethod: 'Paystack',
    }),
  ]);

  return registration;
}

// ── Webhook (server-to-server push from Paystack) ───────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex');

  if (hash !== req.headers.get('x-paystack-signature')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  // Idempotency
  const existing = await prisma.webhookEvent.findUnique({ where: { eventId: event.id } });
  if (existing?.processed) return NextResponse.json({ received: true, skipped: true });

  await prisma.webhookEvent.upsert({
    where: { eventId: event.id },
    create: {
      provider: 'paystack',
      eventId: event.id,
      eventType: event.event,
      payload: event,
      processed: false,
    },
    update: {},
  });

  if (event.event === 'charge.success') {
    try {
      await verifyAndComplete(event.data.reference);
      await prisma.webhookEvent.update({
        where: { eventId: event.id },
        data: { processed: true, processedAt: new Date() },
      });
    } catch (err) {
      console.error('[Paystack webhook] error:', err);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// ── Redirect callback (user returns from Paystack checkout) ─────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const registrationId = searchParams.get('registrationId');
  const trxref = searchParams.get('trxref') || searchParams.get('reference');

  if (!trxref || !registrationId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/failure?reason=missing_params`);
  }

  try {
    await verifyAndComplete(trxref);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/success?id=${registrationId}&provider=paystack`
    );
  } catch (err) {
    console.error('[Paystack verify callback] error:', err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment?id=${registrationId}&cancelled=1`
    );
  }
}
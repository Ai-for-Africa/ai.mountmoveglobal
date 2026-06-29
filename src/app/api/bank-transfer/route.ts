import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin, RECEIPT_BUCKET } from '@/lib/supabase';
import { sendRegistrationConfirmation, sendAdminNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const registrationId = formData.get('registrationId') as string | null;
    const file = formData.get('receipt') as File | null;
    const transferNarration = (formData.get('transferNarration') as string) || '';

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

    let receiptUrl: string | null = null;
    let receiptFileName: string | null = null;

    // Upload file to Supabase Storage if provided
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Upload a JPG, PNG, WEBP, or PDF.' },
          { status: 400 }
        );
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `receipts/${registration.referenceId}-${Date.now()}.${ext}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await supabaseAdmin.storage
        .from(RECEIPT_BUCKET)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('[Bank transfer] Supabase upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload receipt. Please try again.' }, { status: 500 });
      }

      const { data: urlData } = supabaseAdmin.storage.from(RECEIPT_BUCKET).getPublicUrl(fileName);
      receiptUrl = urlData.publicUrl;
      receiptFileName = file.name;
    }

    // Create or update Payment record
    await prisma.payment.upsert({
      where: { registrationId: registration.id },
      create: {
        registrationId: registration.id,
        provider: 'BANK_TRANSFER',      // ✅ matches PaymentProvider enum
        status: 'RECEIPT_SUBMITTED',     // ✅ matches PaymentStatus enum
        amount: 3_000_000,               // ₦30,000 in kobo
        currency: 'NGN',
        customerEmail: registration.email,
        receiptUrl,
        receiptFileName,
        transferNarration,
      },
      update: {
        provider: 'BANK_TRANSFER',       // ✅ was 'bank_transfer' (wrong casing) — fixed
        status: 'RECEIPT_SUBMITTED',     // ✅ matches PaymentStatus enum
        receiptUrl,
        receiptFileName,
        transferNarration,
      },
    });

    // Update registration to awaiting manual verification
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: 'PAYMENT_PENDING' },
    });

    // Notify admin and send receipt-received email to user
    await Promise.allSettled([
      sendRegistrationConfirmation({
        to: registration.email,
        fullName: registration.fullName,
        referenceId: registration.referenceId,
        paymentMethod: 'bank_transfer',
      }),
      sendAdminNotification({
        fullName: registration.fullName,
        email: registration.email,
        referenceId: registration.referenceId,
        paymentMethod: 'Bank Transfer',
        receiptUrl: receiptUrl ?? undefined,
      }),
    ]);

    return NextResponse.json({
      success: true,
      referenceId: registration.referenceId,
      receiptUrl,
    });
  } catch (err) {
    console.error('[POST /api/bank-transfer/submit]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
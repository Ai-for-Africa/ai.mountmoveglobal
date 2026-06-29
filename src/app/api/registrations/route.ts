import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registrationSchema } from '@/lib/validation/registration';
import { nanoid } from 'nanoid';

function generateReferenceId(): string {
  return `MMG-${nanoid(6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      // Log the exact validation errors so you can see what field is failing
      console.error('[POST /api/registrations] Zod validation failed:', JSON.stringify(parsed.error.flatten(), null, 2));
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate a unique reference ID
    let referenceId = generateReferenceId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.registration.findUnique({ where: { referenceId } });
      if (!existing) break;
      referenceId = generateReferenceId();
      attempts++;
    }

    const registration = await prisma.registration.create({
      data: {
        referenceId,
        fullName: data.fullName,
        phoneWhatsapp: data.phoneWhatsapp,
        email: data.email,
        cityState: data.cityState,
        attendanceMode: data.attendanceMode,
        profileType: data.profileType,
        aiExperience: data.aiExperience,
        aiToolsUsed: data.aiToolsUsed ?? [],
        currentSkills: data.currentSkills ?? [],
        learningGoals: data.learningGoals,
        primaryGoal: data.primaryGoal,
        incomeStreams: data.incomeStreams ?? [],
        devices: data.devices,
        internetAccess: data.internetAccess,
        saturdayCommitment: data.saturdayCommitment,
        howHeard: data.howHeard,
        specificStruggle: data.specificStruggle ?? null,
        organisationInterest: data.organisationInterest ?? null,
        consentGiven: data.consentGiven,
        status: 'PAYMENT_PENDING',
      },
    });

    return NextResponse.json({
      registrationId: registration.id,
      referenceId: registration.referenceId,
    });
  } catch (err: unknown) {
    
    console.error('[POST /api/registrations] Caught error:', err);

    
    const isDev = process.env.NODE_ENV === 'development';
    const message =
      isDev && err instanceof Error
        ? err.message
        : 'Internal server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
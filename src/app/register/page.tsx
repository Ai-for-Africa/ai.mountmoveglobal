'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validation/registration';
import { Section1Personal } from '@/components/form/Section1Personal';
import { Section2Background } from '@/components/form/Section2Background';
import { Section3Goals } from '@/components/form/Section3Goals';
import { Section4Commitment } from '@/components/form/Section4Commitment';
import { Section5Final } from '@/components/form/Section5Final';
import { ReviewSummary } from '@/components/form/ReviewSummary';
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Background' },
  { id: 3, label: 'Goals' },
  { id: 4, label: 'Logistics' },
  { id: 5, label: 'Final' },
  { id: 6, label: 'Review' },
];

const SECTION_FIELDS: Record<number, (keyof RegistrationFormData)[]> = {
  1: ['fullName', 'phoneWhatsapp', 'email', 'cityState', 'attendanceMode'],
  2: ['profileType', 'aiExperience'],
  3: ['learningGoals', 'primaryGoal'],
  4: ['devices', 'internetAccess', 'saturdayCommitment', 'howHeard'],
  5: ['consentGiven'],
};

const SECTION_SUBTITLES: Record<number, string> = {
  1: 'Tell us about yourself so we can personalise your experience.',
  2: 'Help us understand where you\'re starting from.',
  3: 'Tell us what you want to get out of this programme.',
  4: 'Let\'s make sure the logistics work for you.',
  5: 'A few final details before we proceed to payment.',
  6: 'Review your information before completing payment.',
};

function MMGNav({ step, total }: { step: number; total: number }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(13,8,32,0.97)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="site-width" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img
            src="https://www.mountmoveglobal.com/logo1.png"
            alt="MountMove Global"
            style={{ height: '24px', objectFit: 'contain' }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = 'none';
              const fb = img.nextElementSibling as HTMLElement;
              if (fb) fb.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none', width: '28px', height: '28px', background: 'var(--purple)', borderRadius: '6px', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '10px' }}>M</span>
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.1 }}>MountMove Global</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Digital Wealth Masterclass</div>
          </div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Step {step} of {total}</span>
      </div>
      {/* Purple progress bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--purple), var(--purple-light))',
          width: `${((step - 1) / (total - 1)) * 100}%`,
          transition: 'width 0.35s ease',
        }} />
      </div>
    </header>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      aiToolsUsed: [], currentSkills: [], learningGoals: [],
      incomeStreams: [], devices: [], consentGiven: true,
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const fields = SECTION_FIELDS[currentStep];
    const valid = fields ? await trigger(fields) : true;
    if (valid) { setCurrentStep((s) => Math.min(s + 1, 6)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { setSubmitError(result.error || 'Registration failed. Please try again.'); return; }
      router.push(`/payment?id=${result.registrationId}`);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-mid)' }}>
      <MMGNav step={currentStep} total={STEPS.length} />

      <div className="site-width" style={{ maxWidth: '680px', padding: '3rem 2rem 5rem' }}>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '14px', left: '14px', width: `${progress}%`, height: '1px', background: 'var(--purple)', zIndex: 1, transition: 'width 0.35s ease' }} />
          {STEPS.map((step) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            return (
              <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, transition: 'all 0.25s',
                  background: done ? 'var(--purple)' : active ? 'var(--purple)' : 'var(--bg-card)',
                  border: done || active ? '2px solid var(--purple)' : '2px solid rgba(255,255,255,0.15)',
                  color: done || active ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: active ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
                }}>
                  {done ? <Check size={13} /> : step.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="eyebrow" style={{ marginBottom: '0.5rem', display: 'block' }}>Step {currentStep} of {STEPS.length}</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {STEPS[currentStep - 1].label}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {SECTION_SUBTITLES[currentStep]}
          </p>
        </div>

        {/* Form card — light surface for readability */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{
              background: '#ffffff', borderRadius: '0.875rem',
              border: '1px solid rgba(124,58,237,0.15)',
              padding: '2rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,58,237,0.08)',
            }}>
              {currentStep === 1 && <Section1Personal />}
              {currentStep === 2 && <Section2Background />}
              {currentStep === 3 && <Section3Goals />}
              {currentStep === 4 && <Section4Commitment />}
              {currentStep === 5 && <Section5Final />}
              {currentStep === 6 && <ReviewSummary />}
            </div>

            {submitError && (
              <div style={{
                marginTop: '1rem', padding: '1rem 1.125rem',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '0.5rem', fontSize: '0.9rem', color: '#fca5a5',
              }}>
                {submitError}
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' }}>
              {currentStep > 1 ? (
                <button type="button" onClick={handleBack} className="btn btn-ghost-dark btn-sm">
                  <ArrowLeft size={15} /> Back
                </button>
              ) : <div />}

              {currentStep < 6 ? (
                <button type="button" onClick={handleNext} className="btn btn-purple">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn btn-purple">
                  {isSubmitting
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                    : <>Continue to Payment <ArrowRight size={16} /></>
                  }
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
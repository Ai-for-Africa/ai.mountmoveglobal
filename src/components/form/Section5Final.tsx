'use client';
import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/validation/registration';

const orgOptions: { value: RegistrationFormData['organisationInterest']; label: string }[] = [
  { value: 'YES', label: "Yes — I'd love to discuss a group or corporate booking" },
  { value: 'MAYBE', label: "Maybe — I'd share information with my team first" },
  { value: 'NO', label: "No — I'm registering for myself only" },
];

export function Section5Final() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
  const organisationInterest = watch('organisationInterest');
  const consentGiven = watch('consentGiven');

  return (
    <div>

      {/* Struggle */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label" style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          What are you struggling with that you hope AI will solve?
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>optional</span>
        </label>
        <span className="field-hint">Helps us tailor the programme content for the cohort</span>
        <textarea
          {...register('specificStruggle')}
          rows={3}
          placeholder="e.g. I spend hours creating content and can't keep up with demand…"
          className="field-input"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Organisation */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label" style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          Interested in bringing this to your organisation?
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>optional</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.375rem' }}>
          {orgOptions.map(({ value, label }) => {
            const selected = organisationInterest === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('organisationInterest', value)}
                className={`option-item${selected ? ' is-selected' : ''}`}
                style={{ padding: '0.75rem 1rem' }}
              >
                <div className={`option-indicator${selected ? ' is-selected' : ''}`} />
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: selected ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment preview */}
      <div style={{
        background: '#0f1e3c', borderRadius: '0.875rem',
        padding: '1.5rem', marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d4a843', marginBottom: '1rem' }}>
          Payment required to complete registration
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          {[
            { amount: '₦30,000', label: 'Nigeria', note: 'via Paystack' },
            { amount: '$49', label: 'International', note: 'via Stripe' },
          ].map(({ amount, label, note }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: '0.625rem', padding: '1rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#d4a843', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {amount}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginTop: '0.375rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.125rem' }}>{note}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8125rem', marginTop: '0.875rem', textAlign: 'center' }}>
          Your spot is only confirmed after successful payment
        </p>
      </div>

      {/* Consent */}
      <div>
        <button
          type="button"
          onClick={() => setValue('consentGiven', !consentGiven as RegistrationFormData['consentGiven'], { shouldValidate: true })}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
            width: '100%', textAlign: 'left', padding: '1.125rem 1.25rem',
            border: `1.5px solid ${errors.consentGiven ? '#fca5a5' : consentGiven ? '#d4a843' : '#e2e8f0'}`,
            borderRadius: '0.625rem', cursor: 'pointer',
            background: consentGiven ? 'rgba(212,168,67,0.06)' : '#ffffff',
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, marginTop: '1px',
            border: `2px solid ${consentGiven ? '#d4a843' : '#d1d5db'}`,
            background: consentGiven ? '#d4a843' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {consentGiven && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#0f1e3c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              I agree to be contacted by MountMove Global <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>
              Via WhatsApp and email about this programme and related opportunities.
              Your data will not be shared with third parties.
            </p>
          </div>
        </button>
        {errors.consentGiven && <p className="field-error">{errors.consentGiven.message}</p>}
      </div>
    </div>
  );
}

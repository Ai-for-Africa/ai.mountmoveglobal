'use client';
import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/validation/registration';

const deviceOptions = [
  'Laptop (Windows)',
  'Laptop (Mac)',
  'Smartphone (Android)',
  'Smartphone (iPhone)',
  "I don't have a device yet but I'm working on it",
];

// Values MUST match the Zod schema enum for internetAccess
const internetOptions = [
  { value: 'RELIABLE',            label: 'Strong',       desc: 'Stable WiFi or fast 4G consistently' },
  { value: 'MOSTLY_RELIABLE',     label: 'Moderate',     desc: 'I manage fine most of the time' },
  { value: 'SOMETIMES_UNRELIABLE',label: 'Limited',      desc: 'I rely on data bundles and manage carefully' },
  { value: 'OFTEN_UNRELIABLE',    label: 'Very limited', desc: "This is a challenge I'm working on" },
];

// Values MUST match the Zod schema enum for saturdayCommitment
const saturdayOptions = [
  { value: 'DEFINITELY',  label: "Yes — I'm fully committed" },
  { value: 'MOSTLY_YES',  label: "Mostly — I may miss 1–2 sessions but will catch up on recordings" },
  { value: 'WILL_TRY',    label: "Not sure yet — depends on the start date" },
  { value: 'UNCERTAIN',   label: "I'd prefer to join the next cohort when dates are confirmed" },
];

// Values MUST match the Zod schema enum for howHeard
const howHeardOptions = [
  { value: 'WHATSAPP',     label: 'WhatsApp (friend or group)' },
  { value: 'INSTAGRAM',    label: 'Instagram' },
  { value: 'FACEBOOK',     label: 'Facebook' },
  { value: 'LINKEDIN',     label: 'LinkedIn' },
  { value: 'TWITTER_X',    label: 'Twitter / X' },
  { value: 'FRIEND_FAMILY',label: 'A friend or family member' },
  { value: 'GOOGLE_SEARCH',label: 'Google search' },
  { value: 'YOUTUBE',      label: 'YouTube' },
  { value: 'FLYER_POSTER', label: 'Flyer or poster' },
  { value: 'OTHER',        label: 'Other' },
];

function RadioGroup({ options, value: currentValue, onChange, error }: {
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map(({ value, label, desc }) => {
          const selected = currentValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`option-item${selected ? ' is-selected' : ''}`}
              style={{ padding: '0.75rem 1rem' }}
            >
              <div className={`option-indicator${selected ? ' is-selected' : ''}`} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: selected ? 600 : 400, color: '#374151', lineHeight: 1.3 }}>{label}</div>
                {desc && <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.1rem' }}>{desc}</div>}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="field-error">{error}</p>}
    </>
  );
}

export function Section4Commitment() {
  const { watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
  const devices = watch('devices') || [];
  const internetAccess = watch('internetAccess');
  const saturdayCommitment = watch('saturdayCommitment');
  const howHeard = watch('howHeard');

  const toggleDevice = (d: string) => {
    setValue(
      'devices',
      devices.includes(d) ? devices.filter((x) => x !== d) : [...devices, d],
      { shouldValidate: true }
    );
  };

  return (
    <div>

      {/* Devices */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label">Device access <span style={{ color: '#ef4444' }}>*</span></label>
        <span className="field-hint">Select all that apply</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {deviceOptions.map((device) => {
            const selected = devices.includes(device);
            return (
              <button
                key={device}
                type="button"
                onClick={() => toggleDevice(device)}
                className={`option-item${selected ? ' is-selected' : ''}${errors.devices ? ' is-error' : ''}`}
                style={{ padding: '0.75rem 1rem' }}
              >
                <div style={{
                  width: '17px', height: '17px', borderRadius: '4px', flexShrink: 0,
                  border: `2px solid ${selected ? '#7c3aed' : '#d1d5db'}`,
                  background: selected ? '#7c3aed' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  {selected && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: selected ? 600 : 400 }}>{device}</span>
              </button>
            );
          })}
        </div>
        {errors.devices && <p className="field-error">{errors.devices.message as string}</p>}
      </div>

      {/* Internet reliability */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label">Internet access reliability <span style={{ color: '#ef4444' }}>*</span></label>
        <RadioGroup
          options={internetOptions}
          value={internetAccess || ''}
          onChange={(v) => setValue('internetAccess', v as RegistrationFormData['internetAccess'], { shouldValidate: true })}
          error={errors.internetAccess?.message}
        />
      </div>

      {/* Saturday commitment */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label">Can you commit to Saturdays, 9 AM – 1 PM for 12 weeks? <span style={{ color: '#ef4444' }}>*</span></label>
        <RadioGroup
          options={saturdayOptions}
          value={saturdayCommitment || ''}
          onChange={(v) => setValue('saturdayCommitment', v as RegistrationFormData['saturdayCommitment'], { shouldValidate: true })}
          error={errors.saturdayCommitment?.message}
        />
      </div>

      {/* How heard */}
      <div>
        <label className="field-label">How did you hear about this programme? <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.375rem' }}>
          {howHeardOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('howHeard', value as RegistrationFormData['howHeard'], { shouldValidate: true })}
              className={`chip${howHeard === value ? ' is-selected' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.howHeard && <p className="field-error">{errors.howHeard.message}</p>}
      </div>
    </div>
  );
}
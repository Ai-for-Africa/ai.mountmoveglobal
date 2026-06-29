'use client';
import { useFormContext } from 'react-hook-form';
import { Building2, Monitor, HelpCircle } from 'lucide-react';

type Section1PersonalFormData = {
  fullName?: string;
  phoneWhatsapp?: string;
  email?: string;
  cityState?: string;
  attendanceMode?: 'PHYSICAL' | 'VIRTUAL' | 'UNSURE';
};

// Minimal form data type for this section. Adjust/import a shared RegistrationFormData
// if available elsewhere in the project.
type RegistrationFormData = Section1PersonalFormData;

const attendanceOptions = [
  {
    value: 'PHYSICAL',
    label: 'Physical',
    desc: 'In-person at our venue',
    icon: Building2,
  },
  {
    value: 'VIRTUAL',
    label: 'Virtual — Online',
    desc: 'Live stream from anywhere with internet',
    icon: Monitor,
  },
  {
    value: 'UNSURE',
    label: 'Not sure yet',
    desc: 'I\'d like more information before deciding',
    icon: HelpCircle,
  },
] as const;

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: '1.5rem' }}>{children}</div>;
}

export function Section1Personal() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
  const attendanceMode = watch('attendanceMode');

  return (
    <div>
      <FieldGroup>
        <label className="field-label">
          Full Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          {...register('fullName')}
          type="text"
          placeholder="e.g. Chidinma Okafor"
          className={`field-input${errors.fullName ? ' is-error' : ''}`}
        />
        {errors.fullName && (
          <p className="field-error">{errors.fullName.message}</p>
        )}
      </FieldGroup>

      <FieldGroup>
        <label className="field-label">
          WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <span className="field-hint">Cohort updates and resources will be sent via WhatsApp</span>
        <input
          {...register('phoneWhatsapp')}
          type="tel"
          placeholder="e.g. +234 801 234 5678"
          className={`field-input${errors.phoneWhatsapp ? ' is-error' : ''}`}
        />
        {errors.phoneWhatsapp && (
          <p className="field-error">{errors.phoneWhatsapp.message}</p>
        )}
      </FieldGroup>

      <FieldGroup>
        <label className="field-label">
          Email Address <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="e.g. chidinma@email.com"
          className={`field-input${errors.email ? ' is-error' : ''}`}
        />
        {errors.email && (
          <p className="field-error">{errors.email.message}</p>
        )}
      </FieldGroup>

      <FieldGroup>
        <label className="field-label">
          City / State <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <span className="field-hint">Helps us plan physical vs virtual capacity</span>
        <input
          {...register('cityState')}
          type="text"
          placeholder="e.g. Port Harcourt, Rivers State"
          className={`field-input${errors.cityState ? ' is-error' : ''}`}
        />
        {errors.cityState && (
          <p className="field-error">{errors.cityState.message}</p>
        )}
      </FieldGroup>

      <FieldGroup>
        <label className="field-label">
          Preferred attendance mode <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.375rem' }}>
          {attendanceOptions.map(({ value, label, desc, icon: Icon }) => {
            const selected = attendanceMode === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('attendanceMode', value, { shouldValidate: true })}
                className={`option-item${selected ? ' is-selected' : ''}${errors.attendanceMode ? ' is-error' : ''}`}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                  background: selected ? 'rgba(212,168,67,0.15)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={selected ? '#d4a843' : '#6b7280'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{label}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.125rem' }}>{desc}</div>
                </div>
                {selected && (
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#d4a843', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#0f1e3c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.attendanceMode && (
          <p className="field-error">{errors.attendanceMode.message}</p>
        )}
      </FieldGroup>
    </div>
  );
}

'use client';
import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/validation/registration';

const labelMaps: Record<string, Record<string, string>> = {
  attendanceMode: { PHYSICAL: 'Physical', VIRTUAL: 'Virtual — Online', UNSURE: 'Not sure yet' },
  profileType: {
    STUDENT_GRADUATE: 'Student or fresh graduate',
    EMPLOYED_PROFESSIONAL: 'Employed professional / executive',
    FREELANCER_CREATIVE: 'Freelancer or creative',
    ENTREPRENEUR: 'Entrepreneur / business owner',
    JOB_SEEKER: 'Job seeker',
    TEACHER_TRAINER: 'Teacher / trainer',
    CONTENT_CREATOR: 'Content creator or influencer',
    NGO_GOVERNMENT: 'NGO / government staff',
    OTHER: 'Other',
  },
  aiExperience: {
    COMPLETE_BEGINNER: 'Complete beginner',
    CURIOUS_EXPLORER: 'Curious explorer',
    OCCASIONAL_USER: 'Occasional user',
    REGULAR_USER: 'Regular user',
  },
};

function Row({ label, value }: { label: string; value: string | string[] | undefined }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div style={{
      display: 'flex', gap: '1rem', padding: '0.75rem 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <span style={{ width: '140px', flexShrink: 0, fontSize: '0.8125rem', color: '#9ca3af', paddingTop: '1px' }}>
        {label}
      </span>
      <div style={{ flex: 1 }}>
        {Array.isArray(value) ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {value.map((v) => (
              <span key={v} className="badge badge-navy" style={{ fontSize: '0.75rem' }}>{v}</span>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: '0.9rem', color: '#111827', lineHeight: 1.5 }}>{value}</span>
        )}
      </div>
    </div>
  );
}

export function ReviewSummary() {
  const { watch } = useFormContext<RegistrationFormData>();
  const d = watch();

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.875rem 1rem', background: '#f0fdf4',
        border: '1px solid #bbf7d0', borderRadius: '0.5rem', marginBottom: '1.5rem',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" fill="#16a34a"/>
          <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d', margin: 0 }}>All sections complete</p>
          <p style={{ fontSize: '0.8125rem', color: '#16a34a', margin: 0 }}>Review your details below before proceeding to payment</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Row label="Full Name" value={d.fullName} />
        <Row label="Email" value={d.email} />
        <Row label="WhatsApp" value={d.phoneWhatsapp} />
        <Row label="City / State" value={d.cityState} />
        <Row label="Attendance" value={labelMaps.attendanceMode[d.attendanceMode] || d.attendanceMode} />
        <Row label="Profile" value={labelMaps.profileType[d.profileType] || d.profileType} />
        <Row label="AI Experience" value={labelMaps.aiExperience[d.aiExperience] || d.aiExperience} />
        <Row label="Learning Goals" value={d.learningGoals} />
        <Row label="Primary Goal" value={d.primaryGoal} />
        <Row label="Devices" value={d.devices} />
        <Row label="Commitment" value={d.saturdayCommitment?.replace(/_/g, ' ')} />
        <Row label="How Heard" value={d.howHeard?.replace(/_/g, ' ')} />
      </div>

      <div style={{
        padding: '1rem 1.125rem',
        background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.5rem',
        fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.6,
      }}>
        <strong>Please verify your email address is correct</strong> — your confirmation and payment receipt will be sent there.
        Registration is only confirmed once payment succeeds.
      </div>
    </div>
  );
}

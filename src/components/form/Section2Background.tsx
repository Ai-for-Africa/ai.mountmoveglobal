'use client';
import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/validation/registration';

const profileOptions = [
  { value: 'STUDENT_GRADUATE', label: 'Student or fresh graduate' },
  { value: 'EMPLOYED_PROFESSIONAL', label: 'Employed professional / executive' },
  { value: 'FREELANCER_CREATIVE', label: 'Freelancer or creative' },
  { value: 'ENTREPRENEUR', label: 'Entrepreneur / business owner' },
  { value: 'JOB_SEEKER', label: 'Job seeker' },
  { value: 'TEACHER_TRAINER', label: 'Teacher, trainer, or educator' },
  { value: 'CONTENT_CREATOR', label: 'Content creator or influencer' },
  { value: 'NGO_GOVERNMENT', label: 'NGO / government staff' },
  { value: 'OTHER', label: 'Other' },
] as const;

const experienceOptions = [
  { value: 'COMPLETE_BEGINNER', dot: '#ef4444', label: 'Complete beginner', desc: "I've never used any AI tool" },
  { value: 'CURIOUS_EXPLORER', dot: '#f59e0b', label: 'Curious explorer', desc: "I've tried ChatGPT or Gemini a few times" },
  { value: 'OCCASIONAL_USER', dot: '#22c55e', label: 'Occasional user', desc: 'I use AI tools sometimes but not consistently' },
  { value: 'REGULAR_USER', dot: '#3b82f6', label: 'Regular user', desc: 'AI is already part of how I work' },
] as const;

const aiToolOptions = [
  'ChatGPT', 'Claude', 'Gemini / Google AI',
  'Midjourney or DALL-E', 'Canva AI',
  'Suno or Udio (AI music)', 'Runway or CapCut AI',
  'Notion AI', 'None of the above',
];

const skillOptions = [
  'Writing / content creation', 'Graphic design', 'Video editing',
  'Social media management', 'Web development or coding',
  'Business / entrepreneurship', 'Teaching or training',
  'Music or audio production', 'Sales or marketing',
  "None — I'm starting fresh",
];

function SectionLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="field-label" style={{ marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      {children}
      {optional && (
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>optional</span>
      )}
    </label>
  );
}

export function Section2Background() {
  const { watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
  const profileType = watch('profileType');
  const aiExperience = watch('aiExperience');
  const aiToolsUsed = watch('aiToolsUsed') || [];
  const currentSkills = watch('currentSkills') || [];

  const toggleArr = (field: 'aiToolsUsed' | 'currentSkills', value: string) => {
    const arr = field === 'aiToolsUsed' ? aiToolsUsed : currentSkills;
    setValue(field, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value], { shouldValidate: true });
  };

  return (
    <div>

      {/* Profile type */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionLabel>Which best describes you? <span style={{ color: '#ef4444' }}>*</span></SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {profileOptions.map(({ value, label }) => {
            const selected = profileType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('profileType', value, { shouldValidate: true })}
                className={`option-item${selected ? ' is-selected' : ''}`}
                style={{ padding: '0.75rem 1rem' }}
              >
                <div className={`option-indicator${selected ? ' is-selected' : ''}`} />
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: selected ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
        </div>
        {errors.profileType && <p className="field-error">{errors.profileType.message}</p>}
      </div>

      {/* AI Experience */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionLabel>Your current AI experience level <span style={{ color: '#ef4444' }}>*</span></SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {experienceOptions.map(({ value, dot, label, desc }) => {
            const selected = aiExperience === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('aiExperience', value, { shouldValidate: true })}
                className={`option-item${selected ? ' is-selected' : ''}`}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot, flexShrink: 0, marginTop: '5px' }} />
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{label}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.1rem' }}>{desc}</div>
                </div>
                {selected && (
                  <div style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', background: '#d4a843', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="#0f1e3c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.aiExperience && <p className="field-error">{errors.aiExperience.message}</p>}
      </div>

      {/* AI Tools */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionLabel optional>AI tools you've used before</SectionLabel>
        <span className="field-hint">Select all that apply</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {aiToolOptions.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => toggleArr('aiToolsUsed', tool)}
              className={`chip${aiToolsUsed.includes(tool) ? ' is-selected' : ''}`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <SectionLabel optional>Your current skills</SectionLabel>
        <span className="field-hint">Select all that apply</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleArr('currentSkills', skill)}
              className={`chip${currentSkills.includes(skill) ? ' is-selected' : ''}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

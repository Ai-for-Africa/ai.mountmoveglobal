'use client';
import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/validation/registration';

const learningGoalOptions = [
  'How to use AI to earn money online',
  'AI-powered writing and content creation',
  'AI image and graphic design',
  'AI music and audio production',
  'AI video creation and editing',
  'Building websites and apps with AI',
  'Selling digital products using AI',
  'Automating my business with AI',
  'Freelancing and consulting with AI',
  'Starting an AI-powered business or startup',
  'Learning to teach others about AI',
];

const incomeStreamOptions = [
  'AI copywriting and content writing',
  'AI graphic design services',
  'AI video production for businesses',
  'AI music and jingles',
  'Building websites with AI',
  'Selling digital products (ebooks, courses, templates)',
  'Running AI training workshops',
  'AI consulting for companies',
  'Building an AI-powered startup / SaaS',
];

export function Section3Goals() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
  const learningGoals = watch('learningGoals') || [];
  const incomeStreams = watch('incomeStreams') || [];

  const toggleGoal = (goal: string) => {
    if (learningGoals.includes(goal)) {
      setValue('learningGoals', learningGoals.filter((g) => g !== goal), { shouldValidate: true });
    } else if (learningGoals.length < 2) {
      setValue('learningGoals', [...learningGoals, goal], { shouldValidate: true });
    }
  };

  return (
    <div>

      {/* Learning goals */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label">
          Top 2 things you want to learn <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <span className="field-hint" style={{ margin: 0 }}>Select exactly 1–2</span>
          <span style={{
            padding: '0.125rem 0.5rem', borderRadius: '999px',
            background: learningGoals.length === 2 ? 'rgba(212,168,67,0.15)' : '#f1f5f9',
            color: learningGoals.length === 2 ? '#7a5a10' : '#6b7280',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            {learningGoals.length}/2
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {learningGoalOptions.map((goal) => {
            const selected = learningGoals.includes(goal);
            const disabled = !selected && learningGoals.length >= 2;
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                disabled={disabled}
                className={`option-item${selected ? ' is-selected' : ''}`}
                style={{
                  opacity: disabled ? 0.38 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  padding: '0.75rem 1rem',
                }}
              >
                <div style={{
                  width: '17px', height: '17px', borderRadius: '4px', flexShrink: 0,
                  border: `2px solid ${selected ? '#d4a843' : '#d1d5db'}`,
                  background: selected ? '#d4a843' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  {selected && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="#0f1e3c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: selected ? 600 : 400 }}>{goal}</span>
              </button>
            );
          })}
        </div>
        {errors.learningGoals && <p className="field-error">{errors.learningGoals.message as string}</p>}
      </div>

      {/* Primary goal */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="field-label">
          Your #1 goal from this programme <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{
          padding: '0.875rem 1rem', marginBottom: '0.75rem',
          background: '#f8fafc', border: '1px solid #e8edf5',
          borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6,
        }}>
          <strong style={{ color: '#374151' }}>Examples:</strong>{' '}
          "Start earning ₦100k/month freelancing with AI" · "Build a website for my fashion brand" · "Teach AI tools to my church group"
        </div>
        <textarea
          {...register('primaryGoal')}
          rows={4}
          placeholder="Describe your goal in as much detail as you like…"
          className={`field-input${errors.primaryGoal ? ' is-error' : ''}`}
          style={{ resize: 'vertical' }}
        />
        {errors.primaryGoal && <p className="field-error">{errors.primaryGoal.message}</p>}
      </div>

      {/* Income streams */}
      <div>
        <label className="field-label" style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          AI income streams that interest you
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>optional</span>
        </label>
        <span className="field-hint">Select all that apply</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {incomeStreamOptions.map((stream) => {
            const selected = incomeStreams.includes(stream);
            return (
              <button
                key={stream}
                type="button"
                onClick={() => setValue('incomeStreams', selected ? incomeStreams.filter((s) => s !== stream) : [...incomeStreams, stream])}
                className={`chip${selected ? ' is-selected' : ''}`}
              >
                {stream}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

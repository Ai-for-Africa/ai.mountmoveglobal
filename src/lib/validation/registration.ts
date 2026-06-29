import { z } from 'zod';

export const registrationSchema = z.object({
  // Section 1 — Personal
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneWhatsapp: z
    .string()
    .min(7, 'Please enter a valid WhatsApp number')
    .regex(/^[+\d\s()-]{7,20}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  cityState: z.string().min(2, 'Please enter your city and state'),
  attendanceMode: z.enum(['PHYSICAL', 'VIRTUAL', 'UNSURE'], {
    required_error: 'Please select an attendance mode',
  }),

  // Section 2 — Background
  profileType: z.enum(
    [
      'STUDENT_GRADUATE',
      'EMPLOYED_PROFESSIONAL',
      'FREELANCER_CREATIVE',
      'ENTREPRENEUR',
      'JOB_SEEKER',
      'TEACHER_TRAINER',
      'CONTENT_CREATOR',
      'NGO_GOVERNMENT',
      'OTHER',
    ],
    { required_error: 'Please select a profile type' }
  ),
  aiExperience: z.enum(
    ['COMPLETE_BEGINNER', 'CURIOUS_EXPLORER', 'OCCASIONAL_USER', 'REGULAR_USER'],
    { required_error: 'Please select your experience level' }
  ),
  aiToolsUsed: z.array(z.string()).default([]),
  currentSkills: z.array(z.string()).default([]),

  // Section 3 — Goals
  learningGoals: z
    .array(z.string())
    .min(1, 'Please select at least one learning goal'),
  primaryGoal: z.string().min(5, 'Please describe your primary goal'),
  incomeStreams: z.array(z.string()).default([]),

  // Section 4 — Commitment / Logistics
  devices: z
    .array(z.string())
    .min(1, 'Please select at least one device you have access to'),
  internetAccess: z.enum(
    ['RELIABLE', 'MOSTLY_RELIABLE', 'SOMETIMES_UNRELIABLE', 'OFTEN_UNRELIABLE'],
    { required_error: 'Please select your internet access level' }
  ),
  saturdayCommitment: z.enum(
    ['DEFINITELY', 'MOSTLY_YES', 'WILL_TRY', 'UNCERTAIN'],
    { required_error: 'Please select your commitment level' }
  ),
  howHeard: z.enum(
    [
      'WHATSAPP',
      'INSTAGRAM',
      'FACEBOOK',
      'TWITTER_X',
      'LINKEDIN',
      'FRIEND_FAMILY',
      'GOOGLE_SEARCH',
      'YOUTUBE',
      'FLYER_POSTER',
      'OTHER',
    ],
    { required_error: 'Please tell us how you heard about this programme' }
  ),

  // Section 5 — Final
  specificStruggle: z.string().optional(),
  organisationInterest: z.enum(['YES', 'MAYBE', 'NO']).optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to be contacted to proceed' }),
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
// Application Constants

// Roles
export const ROLES = {
  PATIENT: 'PATIENT',
  THERAPIST: 'THERAPIST',
  ADMIN: 'ADMIN',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Achievement Points
export const ACHIEVEMENT_POINTS = {
  FIRST_LOGIN: 10,
  COMPLETE_PROFILE: 25,
  FIRST_MOOD_LOG: 15,
  MOOD_LOG_STREAK_7: 50,
  MOOD_LOG_STREAK_30: 150,
  FIRST_EXERCISE: 20,
  COMPLETE_10_EXERCISES: 100,
  COMPLETE_50_EXERCISES: 500,
  FIRST_POST: 15,
  HELPFUL_MEMBER: 100, // 10+ likes on posts
  FIRST_APPOINTMENT: 30,
  ATTEND_5_APPOINTMENTS: 150,
} as const;

// Gamification
export const STREAK_BONUS_MULTIPLIER = 1.1; // 10% bonus per streak milestone
export const ENGAGEMENT_WEIGHTS = {
  MOOD_LOG: 3,
  EXERCISE_COMPLETE: 5,
  POST_CREATED: 4,
  COMMENT_CREATED: 2,
  APPOINTMENT_ATTENDED: 10,
  DAILY_LOGIN: 1,
};

// Risk Levels
export const RISK_LEVELS = {
  NONE: 0,
  LOW: 1,
  MODERATE: 2,
  CRITICAL: 3,
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// Anonymous Name Components
export const ADJECTIVES = [
  'Brave',
  'Calm',
  'Gentle',
  'Kind',
  'Peaceful',
  'Strong',
  'Wise',
  'Bold',
  'Cheerful',
  'Hopeful',
  'Resilient',
  'Serene',
  'Thoughtful',
  'Vibrant',
  'Warm',
];

export const ANIMALS = [
  'Lion',
  'Eagle',
  'Dolphin',
  'Owl',
  'Butterfly',
  'Phoenix',
  'Turtle',
  'Deer',
  'Wolf',
  'Fox',
  'Bear',
  'Tiger',
  'Panda',
  'Hummingbird',
  'Swan',
];

// Email Templates
export const EMAIL_SUBJECTS = {
  WELCOME: 'Welcome to Mindora',
  EMAIL_VERIFICATION: 'Verify Your Email',
  PASSWORD_RESET: 'Reset Your Password',
  APPOINTMENT_CONFIRMATION: 'Appointment Confirmed',
  APPOINTMENT_REMINDER: 'Appointment Reminder',
  THERAPIST_APPROVED: 'Your Therapist Application Approved',
  THERAPIST_REJECTED: 'Therapist Application Update',
};

// Time Constants
export const APPOINTMENT_DURATION_MINUTES = 50;
export const APPOINTMENT_REMINDER_HOURS = 24;
export const PASSWORD_RESET_EXPIRY_HOURS = 2;
export const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

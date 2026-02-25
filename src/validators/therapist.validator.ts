import { z } from 'zod';

// Create therapist profile schema
export const createTherapistSchema = z.object({
  body: z.object({
    licenseNumber: z.string().min(1, 'License number is required').max(100),
    yearsOfExperience: z.number().int().min(0).max(100),
    specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
    bio: z.string().max(1000).optional(),
    hourlyRate: z.number().int().positive('Hourly rate must be positive'),
  }),
});

// Update therapist profile schema
export const updateTherapistSchema = z.object({
  body: z.object({
    yearsOfExperience: z.number().int().min(0).max(100).optional(),
    specialization: z.array(z.string()).optional(),
    bio: z.string().max(1000).optional(),
    hourlyRate: z.number().int().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

// Set availability schema
export const setAvailabilitySchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6, 'Day of week must be 0-6'),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  }),
});

// Get therapists query schema
export const getTherapistsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    specialization: z.string().optional(),
    minRating: z.string().optional(),
    maxRate: z.string().optional(),
  }),
});

// Approve/reject therapist schema
export const therapistStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid therapist ID'),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'SUSPENDED']),
    reason: z.string().optional(),
  }),
});

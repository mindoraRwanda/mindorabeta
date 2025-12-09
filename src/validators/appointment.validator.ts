import { z } from 'zod';

// Create appointment schema
export const createAppointmentSchema = z.object({
    body: z.object({
        therapistId: z.string().uuid('Invalid therapist ID'),
        startTime: z.string().datetime('Invalid start time'),
        endTime: z.string().datetime('Invalid end time'),
        type: z.enum(['VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON']).optional(),
        notes: z.string().max(1000).optional(),
    }),
});

// Update appointment schema
export const updateAppointmentSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid appointment ID'),
    }),
    body: z.object({
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional(),
        type: z.enum(['VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON']).optional(),
        notes: z.string().max(1000).optional(),
    }),
});

// Update appointment status schema
export const updateAppointmentStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid appointment ID'),
    }),
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
    }),
});

// Create session notes schema
export const createSessionNotesSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid appointment ID'),
    }),
    body: z.object({
        content: z.string().min(1, 'Session notes cannot be empty'),
        moodBefore: z.enum(['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY']).optional(),
        moodAfter: z.enum(['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY']).optional(),
    }),
});

// Get appointments query schema
export const getAppointmentsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

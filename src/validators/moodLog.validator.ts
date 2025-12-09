import { z } from 'zod';

// Create mood log schema
export const createMoodLogSchema = z.object({
    body: z.object({
        mood: z.enum(['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY']),
        anxietyLevel: z.enum(['NONE', 'MILD', 'MODERATE', 'SEVERE', 'EXTREME']).optional(),
        note: z.string().max(1000).optional(),
    }),
});

// Get mood logs query schema
export const getMoodLogsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

// Get mood trends query schema
export const getMoodTrendsSchema = z.object({
    query: z.object({
        days: z.string().optional(), // Number of days to look back
    }),
});

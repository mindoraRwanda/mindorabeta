import { z } from 'zod';

// Create review schema
export const createReviewSchema = z.object({
    params: z.object({
        therapistId: z.string().uuid('Invalid therapist ID'),
    }),
    body: z.object({
        rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
        comment: z.string().max(1000).optional(),
    }),
});

// Get reviews query schema
export const getReviewsSchema = z.object({
    params: z.object({
        therapistId: z.string().uuid('Invalid therapist ID'),
    }),
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

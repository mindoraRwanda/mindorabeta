import { z } from 'zod';

// Create exercise schema
export const createExerciseSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().optional(),
        category: z.string().max(100).optional(),
        durationMinutes: z.number().int().positive().optional(),
        difficulty: z.number().int().min(1).max(5).optional(),
        imageUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
        isPremium: z.boolean().optional(),
    }),
});

// Update exercise schema
export const updateExerciseSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid exercise ID'),
    }),
    body: z.object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        category: z.string().max(100).optional(),
        durationMinutes: z.number().int().positive().optional(),
        difficulty: z.number().int().min(1).max(5).optional(),
        imageUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
        isPremium: z.boolean().optional(),
    }),
});

// Complete exercise schema
export const completeExerciseSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid exercise ID'),
    }),
    body: z.object({
        rating: z.number().int().min(1).max(5).optional(),
        notes: z.string().max(500).optional(),
    }),
});

// Get exercises query schema
export const getExercisesSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        isPremium: z.string().optional(),
    }),
});

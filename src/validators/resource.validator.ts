import { z } from 'zod';

// Create resource schema
export const createResourceSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().optional(),
        type: z.string().max(50).optional(), // article, video, helpline
        url: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        isPremium: z.boolean().optional(),
    }),
});

// Update resource schema
export const updateResourceSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid resource ID'),
    }),
    body: z.object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        type: z.string().max(50).optional(),
        url: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        isPremium: z.boolean().optional(),
    }),
});

// Get resources query schema
export const getResourcesSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        type: z.string().optional(),
        isPremium: z.string().optional(),
    }),
});

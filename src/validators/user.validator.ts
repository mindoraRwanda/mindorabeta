import { z } from 'zod';

// Update profile schema
export const updateProfileSchema = z.object({
    body: z.object({
        fullName: z.string().min(2).max(100).optional(),
        bio: z.string().max(500).optional(),
        dateOfBirth: z.string().optional(), // ISO date string
        gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
        phone: z.string().max(20).optional(),
        address: z.string().max(500).optional(),
    }),
});

// Get user by ID schema
export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
});



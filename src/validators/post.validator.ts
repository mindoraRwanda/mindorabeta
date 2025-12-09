import { z } from 'zod';

// Create post schema
export const createPostSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Post content is required').max(5000),
        imageUrl: z.string().url().optional(),
        visibility: z.enum(['PUBLIC', 'ANONYMOUS', 'PRIVATE']).optional(),
    }),
});

// Update post schema
export const updatePostSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid post ID'),
    }),
    body: z.object({
        content: z.string().min(1).max(5000).optional(),
        imageUrl: z.string().url().optional(),
        visibility: z.enum(['PUBLIC', 'ANONYMOUS', 'PRIVATE']).optional(),
    }),
});

// Create comment schema
export const createCommentSchema = z.object({
    params: z.object({
        postId: z.string().uuid('Invalid post ID'),
    }),
    body: z.object({
        content: z.string().min(1, 'Comment content is required').max(1000),
        parentId: z.string().uuid().optional(), // For nested comments
    }),
});

// Moderate post schema
export const moderatePostSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid post ID'),
    }),
    body: z.object({
        isModerated: z.boolean(),
        reason: z.string().optional(),
    }),
});

// Get posts query schema
export const getPostsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        visibility: z.enum(['PUBLIC', 'ANONYMOUS', 'PRIVATE']).optional(),
    }),
});

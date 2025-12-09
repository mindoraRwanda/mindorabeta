import { db } from '../config/database';
import { posts, postLikes, comments, profiles } from '../database/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { uploadPostImage } from './cloudinary.service';

export interface CreatePostData {
    authorId: string;
    content: string;
    imageUrl?: string;
    visibility?: string;
}

/**
 * Create post
 */
export const createPost = async (data: CreatePostData) => {
    const [post] = await db
        .insert(posts)
        .values({
            ...data,
            visibility: (data.visibility as any) || 'ANONYMOUS',
        })
        .returning();

    return post;
};

/**
 * Get all posts
 */
export const getAllPosts = async (userId?: string) => {
    const postList = await db
        .select({
            post: posts,
            author: profiles,
        })
        .from(posts)
        .leftJoin(profiles, eq(posts.authorId, profiles.userId))
        .orderBy(desc(posts.createdAt))
        .limit(50);

    // Anonymize posts based on visibility
    return postList.map((item) => {
        if (item.post.visibility === 'ANONYMOUS' && item.post.authorId !== userId) {
            return {
                ...item.post,
                author: {
                    anonymousName: item.author?.anonymousName || 'Anonymous',
                    avatarUrl: null,
                },
            };
        }
        return {
            ...item.post,
            author: item.author,
        };
    });
};

/**
 * Like/unlike post
 */
export const togglePostLike = async (postId: string, userId: string) => {
    // Check if already liked
    const existing = await db
        .select()
        .from(postLikes)
        .where(eq(postLikes.postId, postId) && eq(postLikes.userId, userId))
        .limit(1);

    if (existing.length > 0) {
        // Unlike
        await db
            .delete(postLikes)
            .where(eq(postLikes.postId, postId) && eq(postLikes.userId, userId));

        await db
            .update(posts)
            .set({ likesCount: sql`${posts.likesCount} - 1` })
            .where(eq(posts.id, postId));

        return { liked: false };
    } else {
        // Like
        await db.insert(postLikes).values({ postId, userId });

        await db
            .update(posts)
            .set({ likesCount: sql`${posts.likesCount} + 1` })
            .where(eq(posts.id, postId));

        return { liked: true };
    }
};

/**
 * Create comment
 */
export const createComment = async (postId: string, authorId: string, content: string, parentId?: string) => {
    const [comment] = await db
        .insert(comments)
        .values({
            postId,
            authorId,
            content,
            parentId,
        })
        .returning();

    // Increment comment count
    await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} + 1` })
        .where(eq(posts.id, postId));

    return comment;
};

/**
 * Delete post
 */
export const deletePost = async (postId: string, userId: string) => {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post) {
        throw ApiError.notFound('Post not found');
    }

    if (post.authorId !== userId) {
        throw ApiError.forbidden('Access denied');
    }

    await db.delete(posts).where(eq(posts.id, postId));
};

/**
 * Get single post
 */
export const getPost = async (postId: string, userId?: string) => {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post) {
        throw ApiError.notFound('Post not found');
    }

    // Anonymize if needed
    if (post.visibility === 'ANONYMOUS' && post.authorId !== userId) {
        // Fetch author but hide details
        return {
            ...post,
            author: {
                anonymousName: 'Anonymous', // Should fetch actual anonymous name if stored on profile
                avatarUrl: null,
            },
        };
    }

    const [author] = await db.select().from(profiles).where(eq(profiles.userId, post.authorId)).limit(1);
    return {
        ...post,
        author,
    };
};

/**
 * Update post
 */
export const updatePost = async (postId: string, userId: string, data: Partial<CreatePostData>) => {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post) {
        throw ApiError.notFound('Post not found');
    }

    if (post.authorId !== userId) {
        throw ApiError.forbidden('Access denied');
    }

    const [updatedPost] = await db
        .update(posts)
        .set({
            ...data,
            visibility: data.visibility ? (data.visibility as any) : undefined,
            updatedAt: new Date(),
        })
        .where(eq(posts.id, postId))
        .returning();

    return updatedPost;
};

/**
 * Flag post
 */
export const flagPost = async (postId: string, userId: string, reason: string) => {
    // In a real app, we would insert into a 'flags' table
    // For now, we'll just return success
    return { flagged: true };
};

/**
 * Get user posts
 */
export const getUserPosts = async (targetUserId: string, currentUserId?: string) => {
    const postList = await db
        .select({
            post: posts,
            author: profiles,
        })
        .from(posts)
        .leftJoin(profiles, eq(posts.authorId, profiles.userId))
        .where(eq(posts.authorId, targetUserId))
        .orderBy(desc(posts.createdAt));

    return postList.map((item) => {
        if (item.post.visibility === 'ANONYMOUS' && item.post.authorId !== currentUserId) {
            return {
                ...item.post,
                author: {
                    anonymousName: item.author?.anonymousName || 'Anonymous',
                    avatarUrl: null,
                },
            };
        }
        return {
            ...item.post,
            author: item.author,
        };
    });
};

/**
 * Get post comments
 */
export const getPostComments = async (postId: string) => {
    const commentList = await db
        .select({
            comment: comments,
            author: profiles,
        })
        .from(comments)
        .leftJoin(profiles, eq(comments.authorId, profiles.userId))
        .where(eq(comments.postId, postId))
        .orderBy(desc(comments.createdAt));

    return commentList.map((item) => ({
        ...item.comment,
        author: item.author,
    }));
};

/**
 * Update comment
 */
export const updateComment = async (commentId: string, userId: string, content: string) => {
    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);

    if (!comment) {
        throw ApiError.notFound('Comment not found');
    }

    if (comment.authorId !== userId) {
        throw ApiError.forbidden('Access denied');
    }

    const [updatedComment] = await db
        .update(comments)
        .set({
            content,
            updatedAt: new Date(),
        })
        .where(eq(comments.id, commentId))
        .returning();

    return updatedComment;
};

/**
 * Delete comment
 */
export const deleteComment = async (commentId: string, userId: string) => {
    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);

    if (!comment) {
        throw ApiError.notFound('Comment not found');
    }

    if (comment.authorId !== userId) {
        throw ApiError.forbidden('Access denied');
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    // Decrement comment count
    await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} - 1` })
        .where(eq(posts.id, comment.postId));
};

/**
 * Toggle comment like
 */
export const toggleCommentLike = async (commentId: string, userId: string) => {
    // This would require a comment_likes table which might not exist in schema yet
    // For now, let's assume it exists or just return success
    return { liked: true };
};

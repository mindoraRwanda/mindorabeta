import { db } from '../config/database';
import { reviews, therapists } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Create review
 */
export const createReview = async (therapistId: string, patientId: string, rating: number, comment?: string) => {
    const [review] = await db
        .insert(reviews)
        .values({
            therapistId,
            patientId,
            rating: rating as any,
            comment,
        })
        .returning();

    // Update therapist rating
    await updateTherapistRating(therapistId);

    return review;
};

/**
 * Get therapist reviews
 */
export const getTherapistReviews = async (therapistId: string) => {
    const reviewList = await db.select().from(reviews).where(eq(reviews.therapistId, therapistId));

    return reviewList;
};

/**
 * Update therapist rating
 */
const updateTherapistRating = async (therapistId: string) => {
    const reviewList = await db.select().from(reviews).where(eq(reviews.therapistId, therapistId));

    if (reviewList.length === 0) return;

    const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviewList.length;

    await db
        .update(therapists)
        .set({
            rating: Math.round(avgRating * 10), // Store as integer (e.g., 45 for 4.5)
            totalReviews: reviewList.length,
        })
        .where(eq(therapists.id, therapistId));
};

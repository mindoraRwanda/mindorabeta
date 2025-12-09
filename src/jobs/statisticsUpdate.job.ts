import cron from 'node-cron';
import { db } from '../config/database';
import { therapists, reviews, appointments } from '../database/schema';
import { eq, and, count, avg, sql } from 'drizzle-orm';

import { logger } from '../utils/logger';

/**
 * Statistics Update Job
 * Updates therapist ratings and review counts
 * Runs every hour
 */
export function startStatisticsUpdateJob() {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        logger.info('[Job] Running statistics update...');

        try {
            // Get all therapists
            const allTherapists = await db
                .select({ id: therapists.id })
                .from(therapists);

            for (const therapist of allTherapists) {
                // Calculate average rating and total reviews
                const [reviewStats] = await db
                    .select({
                        avgRating: avg(reviews.rating),
                        totalReviews: count(),
                    })
                    .from(reviews)
                    .where(eq(reviews.therapistId, therapist.id));

                // Calculate completed appointments count
                const [appointmentStats] = await db
                    .select({ completed: count() })
                    .from(appointments)
                    .where(and(
                        eq(appointments.therapistId, therapist.id),
                        eq(appointments.status, 'COMPLETED')
                    ));

                // Update therapist record
                const avgRating = reviewStats?.avgRating ? Math.round(Number(reviewStats.avgRating) * 10) : 0;
                const totalReviews = reviewStats?.totalReviews || 0;

                await db
                    .update(therapists)
                    .set({
                        rating: avgRating, // Stored as integer (e.g., 45 = 4.5 stars)
                        totalReviews: totalReviews,
                        updatedAt: new Date(),
                    })
                    .where(eq(therapists.id, therapist.id));
            }

            logger.info(`[Job] Statistics update complete. ${allTherapists.length} therapists updated.`);
        } catch (error) {
            logger.error('[Job] Statistics update job failed:', error);
        }
    });

    logger.info('[Job] Statistics update job scheduled (hourly)');
}

import cron from 'node-cron';
import { db } from '../config/database';
import { tokens } from '../database/schema';
import { lt } from 'drizzle-orm';
import { logger } from '../utils/logger';

/**
 * Token Cleanup Job
 * Removes expired refresh tokens and session data
 * Runs daily at 3 AM
 */
export function startTokenCleanupJob() {
    // Run daily at 3 AM
    cron.schedule('0 3 * * *', async () => {
        logger.info('[Job] Running token cleanup...');

        try {
            // Delete expired tokens
            const result = await db
                .delete(tokens)
                .where(lt(tokens.expiresAt, new Date()));

            logger.info(`[Job] Token cleanup complete. Removed expired tokens.`);
        } catch (error) {
            logger.error('[Job] Token cleanup job failed:', error);
        }
    });

    logger.info('[Job] Token cleanup job scheduled (daily at 3 AM)');
}

/**
 * Clean up old read notifications
 */
export async function cleanupOldNotifications(daysOld: number = 90): Promise<number> {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // This would delete old read notifications
        // Uncomment when notifications table cleanup is needed:
        // const result = await db.execute(sql`
        //   DELETE FROM notifications 
        //   WHERE created_at < ${cutoffDate} AND is_read = true
        // `);
        // return result.rowCount || 0;

        return 0;
    } catch (error) {
        console.error('[Cleanup] Failed to clean up notifications:', error);
        return 0;
    }
}

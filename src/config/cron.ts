import { CronJob } from 'cron';
import { logger } from '../utils/logger';
import { db } from './database';
import { profiles, notifications } from '../database/schema';
import { eq, lt, and } from 'drizzle-orm';
import { subDays } from 'date-fns';

// Reset streaks for users who haven't logged in today
export const resetStreaksJob = new CronJob(
    '0 0 * * *', // Run at midnight every day
    async () => {
        try {
            logger.info('Running streak reset job...');
            const yesterday = subDays(new Date(), 1);

            // Reset streaks for users who haven't been active
            await db
                .update(profiles)
                .set({ streakCount: 0 })
                .where(lt(profiles.updatedAt, yesterday));

            logger.info('Streak reset job completed');
        } catch (error) {
            logger.error('Streak reset job failed:', error);
        }
    },
    null,
    false,
    'UTC',
);

// Clean up old notifications
export const cleanupNotificationsJob = new CronJob(
    '0 2 * * *', // Run at 2 AM every day
    async () => {
        try {
            logger.info('Running notification cleanup job...');
            const thirtyDaysAgo = subDays(new Date(), 30);

            // Delete old read notifications
            await db
                .delete(notifications)
                .where(and(eq(notifications.isRead, true), lt(notifications.createdAt, thirtyDaysAgo)));

            logger.info('Notification cleanup job completed');
        } catch (error) {
            logger.error('Notification cleanup job failed:', error);
        }
    },
    null,
    false,
    'UTC',
);

// Start all cron jobs
export const startCronJobs = () => {
    resetStreaksJob.start();
    cleanupNotificationsJob.start();
    logger.info('Cron jobs started');
};

// Stop all cron jobs
export const stopCronJobs = () => {
    resetStreaksJob.stop();
    cleanupNotificationsJob.stop();
    logger.info('Cron jobs stopped');
};

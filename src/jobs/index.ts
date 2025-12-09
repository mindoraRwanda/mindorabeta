import { startAppointmentReminderJob } from './appointmentReminder.job';
import { startDailyMonitoringJob } from './dailyMonitoring.job';
import { startStatisticsUpdateJob } from './statisticsUpdate.job';
import { startStreakUpdateJob } from './streakUpdate.job';
import { startTokenCleanupJob } from './tokenCleanup.job';

import { logger } from '../utils/logger';

/**
 * Initialize all scheduled jobs
 * Call this function when the server starts
 */
export function initializeJobs(): void {
    logger.info('[Jobs] Initializing scheduled jobs...');

    try {
        // Appointment reminders - every 15 minutes
        startAppointmentReminderJob();

        // Daily monitoring - midnight
        startDailyMonitoringJob();

        // Statistics update - every hour
        startStatisticsUpdateJob();

        // Streak update - 1 AM daily
        startStreakUpdateJob();

        // Token cleanup - 3 AM daily
        startTokenCleanupJob();

        logger.info('[Jobs] All scheduled jobs initialized successfully');
    } catch (error) {
        logger.error('[Jobs] Failed to initialize jobs:', error);
        throw error;
    }
}

/**
 * Job schedule summary:
 * 
 * | Job                    | Schedule           | Description                                    |
 * |------------------------|-------------------|------------------------------------------------|
 * | Appointment Reminder   | Every 15 minutes  | Sends reminders 1 hour before appointments     |
 * | Daily Monitoring       | Daily at midnight | Checks patient activity and updates risk levels|
 * | Statistics Update      | Every hour        | Recalculates therapist ratings and stats       |
 * | Streak Update          | Daily at 1 AM     | Updates user streaks and awards achievements   |
 * | Token Cleanup          | Daily at 3 AM     | Cleans up expired tokens and old data          |
 */

// Re-export individual job starters for manual control if needed
export { startAppointmentReminderJob } from './appointmentReminder.job';
export { startDailyMonitoringJob } from './dailyMonitoring.job';
export { startStatisticsUpdateJob } from './statisticsUpdate.job';
export { startStreakUpdateJob } from './streakUpdate.job';
export { startTokenCleanupJob } from './tokenCleanup.job';

import cron from 'node-cron';
import { db } from '../config/database';
import { patientMonitoring, moodLogs, users, profiles } from '../database/schema';
import { eq, and, gte, lt, desc } from 'drizzle-orm';
import * as notificationService from '../services/notification.service';

import { logger } from '../utils/logger';

/**
 * Daily Monitoring Job
 * Checks patient activity and updates risk levels based on engagement
 * Runs daily at midnight
 */
export function startDailyMonitoringJob() {
    // Run daily at midnight
    cron.schedule('0 0 * * *', async () => {
        logger.info('[Job] Running daily monitoring check...');

        try {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            // Get all patients with monitoring records
            const monitoredPatients = await db
                .select()
                .from(patientMonitoring);

            for (const patient of monitoredPatients) {
                // Check recent mood logs to determine activity
                const recentMoodLogs = await db
                    .select()
                    .from(moodLogs)
                    .where(and(
                        eq(moodLogs.userId, patient.patientId),
                        gte(moodLogs.loggedAt, oneDayAgo)
                    ));

                // Check mood trends
                const weekMoodLogs = await db
                    .select()
                    .from(moodLogs)
                    .where(and(
                        eq(moodLogs.userId, patient.patientId),
                        gte(moodLogs.loggedAt, sevenDaysAgo)
                    ))
                    .orderBy(desc(moodLogs.loggedAt));

                // Determine risk level based on activity and mood patterns
                let newRiskLevel: 0 | 1 | 2 | 3 = 0;
                let notes = '';

                // Check for inactivity (no mood logs)
                if (recentMoodLogs.length === 0) {
                    const thirtyDayLogs = await db
                        .select()
                        .from(moodLogs)
                        .where(and(
                            eq(moodLogs.userId, patient.patientId),
                            gte(moodLogs.loggedAt, threeDaysAgo)
                        ));

                    if (thirtyDayLogs.length === 0) {
                        newRiskLevel = 2; // HIGH - No activity for 3+ days
                        notes = 'No activity for 3+ days';
                    } else {
                        newRiskLevel = 1; // MEDIUM - No activity today
                        notes = 'No recent mood log';
                    }
                }

                // Check for consistently negative moods
                if (weekMoodLogs.length >= 5) {
                    const negativeMoods = weekMoodLogs.filter(
                        log => log.mood === 'VERY_SAD' || log.mood === 'SAD'
                    );

                    if (negativeMoods.length >= 4) {
                        newRiskLevel = Math.max(newRiskLevel, 2) as 0 | 1 | 2 | 3;
                        notes += ' Consistently negative mood patterns';
                    }
                }

                // Check for severe anxiety
                const severeAnxiety = weekMoodLogs.filter(
                    log => log.anxietyLevel === 'SEVERE' || log.anxietyLevel === 'EXTREME'
                );

                if (severeAnxiety.length >= 3) {
                    newRiskLevel = 3; // CRITICAL
                    notes += ' Multiple severe anxiety episodes';
                }

                // Update monitoring record if risk level changed
                if (newRiskLevel !== patient.riskLevel) {
                    await db
                        .update(patientMonitoring)
                        .set({
                            riskLevel: newRiskLevel,
                            notes: notes.trim(),
                            updatedAt: now,
                        })
                        .where(eq(patientMonitoring.id, patient.id));

                    // Notify therapist if risk level increased to HIGH or CRITICAL
                    if (newRiskLevel >= 2 && patient.therapistId) {
                        // Get patient name for notification
                        const [profile] = await db
                            .select({ fullName: profiles.fullName })
                            .from(profiles)
                            .where(eq(profiles.userId, patient.patientId));

                        // Note: In production, would notify therapist's userId, not therapistId
                        logger.info(`[Job] Risk level increased for patient. Therapist notification would be sent.`);
                    }
                }
            }

            logger.info(`[Job] Daily monitoring complete. ${monitoredPatients.length} patients checked.`);
        } catch (error) {
            logger.error('[Job] Daily monitoring job failed:', error);
        }
    });

    logger.info('[Job] Daily monitoring job scheduled (daily at midnight)');
}

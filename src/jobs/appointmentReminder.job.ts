import cron from 'node-cron';
import { db } from '../config/database';
import { appointments, users, profiles } from '../database/schema';
import { eq, and, gte, lte, lt } from 'drizzle-orm';
import * as notificationService from '../services/notification.service';

import { logger } from '../utils/logger';

/**
 * Appointment Reminder Job
 * Sends reminders to patients 1 hour before their appointments
 * Runs every 15 minutes
 */
export function startAppointmentReminderJob() {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    logger.info('[Job] Running appointment reminder check...');

    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

      // Find appointments starting in the next hour that haven't been reminded
      const upcomingAppointments = await db
        .select({
          appointmentId: appointments.id,
          patientId: appointments.patientId,
          startTime: appointments.startTime,
          type: appointments.type,
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.status, 'CONFIRMED'),
            gte(appointments.startTime, fifteenMinutesFromNow),
            lte(appointments.startTime, oneHourFromNow),
          ),
        );

      for (const appointment of upcomingAppointments) {
        // Get patient info
        const [patient] = await db
          .select({ fullName: profiles.fullName })
          .from(profiles)
          .where(eq(profiles.userId, appointment.patientId));

        const startTime = new Date(appointment.startTime);
        const timeString = startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Send notification to patient
        await notificationService.createNotification(
          appointment.patientId,
          'Appointment Reminder',
          `Your ${appointment.type} appointment is scheduled for ${timeString}. Please be ready!`,
          'APPOINTMENT',
          { appointmentId: appointment.appointmentId },
        );

        logger.info(`[Job] Sent reminder for appointment ${appointment.appointmentId}`);
      }

      logger.info(
        `[Job] Appointment reminder check complete. ${upcomingAppointments.length} reminders sent.`,
      );
    } catch (error) {
      logger.error('[Job] Appointment reminder job failed:', error);
    }
  });

  logger.info('[Job] Appointment reminder job scheduled (every 15 minutes)');
}

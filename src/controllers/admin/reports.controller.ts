import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { users, appointments, therapists, moodLogs } from '../../database/schema';
import { count, eq, gte, and, sql } from 'drizzle-orm';

/**
 * Get platform reports - returns detailed platform analytics reports
 */
export const getReports = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { period = '30' } = req.query;
  const days = parseInt(period as string);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // User registration report
  const [newUsers] = await db
    .select({ total: count() })
    .from(users)
    .where(gte(users.createdAt, startDate));

  // Appointment report
  const [totalAppointments] = await db
    .select({ total: count() })
    .from(appointments)
    .where(gte(appointments.createdAt, startDate));

  const [completedAppointments] = await db
    .select({ total: count() })
    .from(appointments)
    .where(and(gte(appointments.createdAt, startDate), eq(appointments.status, 'COMPLETED')));

  const [cancelledAppointments] = await db
    .select({ total: count() })
    .from(appointments)
    .where(and(gte(appointments.createdAt, startDate), eq(appointments.status, 'CANCELLED')));

  // Therapist report
  const [newTherapists] = await db
    .select({ total: count() })
    .from(therapists)
    .where(gte(therapists.createdAt, startDate));

  const [approvedTherapists] = await db
    .select({ total: count() })
    .from(therapists)
    .where(and(gte(therapists.createdAt, startDate), eq(therapists.status, 'APPROVED')));

  // Mood logs report
  const [totalMoodLogs] = await db
    .select({ total: count() })
    .from(moodLogs)
    .where(gte(moodLogs.loggedAt, startDate));

  const reports = {
    period: `Last ${days} days`,
    startDate: startDate.toISOString(),
    endDate: new Date().toISOString(),
    users: {
      newRegistrations: newUsers?.total || 0,
    },
    appointments: {
      total: totalAppointments?.total || 0,
      completed: completedAppointments?.total || 0,
      cancelled: cancelledAppointments?.total || 0,
      completionRate: totalAppointments?.total
        ? (((completedAppointments?.total || 0) / totalAppointments.total) * 100).toFixed(1) + '%'
        : '0%',
    },
    therapists: {
      newApplications: newTherapists?.total || 0,
      approved: approvedTherapists?.total || 0,
    },
    engagement: {
      moodLogsCreated: totalMoodLogs?.total || 0,
    },
  };

  successResponse(res, reports);
});

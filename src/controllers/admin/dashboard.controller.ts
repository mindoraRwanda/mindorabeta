import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { users, therapists, appointments, posts, exercises } from '../../database/schema';
import { count, eq, gte, and, sql } from 'drizzle-orm';

/**
 * Get admin dashboard stats - returns platform-wide statistics
 */
export const getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Total users count
  const [usersCount] = await db.select({ total: count() }).from(users);

  // Total patients count
  const [patientsCount] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, 'PATIENT'));

  // Total therapists count
  const [therapistsCount] = await db.select({ total: count() }).from(therapists);

  // Approved therapists count
  const [approvedTherapistsCount] = await db
    .select({ total: count() })
    .from(therapists)
    .where(eq(therapists.status, 'APPROVED'));

  // Pending therapists count
  const [pendingTherapistsCount] = await db
    .select({ total: count() })
    .from(therapists)
    .where(eq(therapists.status, 'PENDING'));

  // Total appointments count
  const [appointmentsCount] = await db.select({ total: count() }).from(appointments);

  // Active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [activeUsersCount] = await db
    .select({ total: count() })
    .from(users)
    .where(and(eq(users.isActive, true), gte(users.lastLoginAt, thirtyDaysAgo)));

  // Total posts count
  const [postsCount] = await db.select({ total: count() }).from(posts);

  // Total exercises count
  const [exercisesCount] = await db.select({ total: count() }).from(exercises);

  const stats = {
    totalUsers: usersCount?.total || 0,
    totalPatients: patientsCount?.total || 0,
    totalTherapists: therapistsCount?.total || 0,
    approvedTherapists: approvedTherapistsCount?.total || 0,
    pendingTherapists: pendingTherapistsCount?.total || 0,
    totalAppointments: appointmentsCount?.total || 0,
    activeUsers: activeUsersCount?.total || 0,
    totalPosts: postsCount?.total || 0,
    totalExercises: exercisesCount?.total || 0,
  };

  successResponse(res, stats);
});

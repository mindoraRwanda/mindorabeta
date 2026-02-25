import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { getUserExerciseProgress } from '../../services/exercise.service';
import { getUserMoodLogs } from '../../services/moodLog.service';
import { db } from '../../config/database';
import { appointments, profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';

/**
 * Get user statistics
 */
export const getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.userId;

  // Get exercises completed
  const exercises = await getUserExerciseProgress(userId);

  // Get mood logs
  const moodLogs = await getUserMoodLogs(userId, 30);

  // Get appointments
  const userAppointments = await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, userId));

  // Get profile points and streak
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));

  const stats = {
    exercisesCompleted: exercises.length,
    moodLogsCount: moodLogs.length,
    appointmentsCount: userAppointments.length,
    totalPoints: profile?.totalPoints || 0,
    streakCount: profile?.streakCount || 0,
  };

  successResponse(res, stats);
});

/**
 * Get dashboard summary
 */
export const getDashboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.userId;

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));

  const dashboard = {
    user: profile,
    recentActivity: [],
    upcomingAppointments: [],
  };

  successResponse(res, dashboard);
});

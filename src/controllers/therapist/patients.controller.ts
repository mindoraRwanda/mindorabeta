import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { appointments, users, profiles, therapists } from '../../database/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get therapist patients - returns all patients who have had appointments with this therapist
 */
export const getPatients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const therapistUserId = req.user!.userId;

  // First get the therapist record
  const [therapist] = await db
    .select()
    .from(therapists)
    .where(eq(therapists.userId, therapistUserId));

  if (!therapist) {
    return res.status(404).json({ success: false, message: 'Therapist profile not found' });
  }

  // Get all unique patients who have had appointments with this therapist
  const patientAppointments = await db
    .select({
      patientId: appointments.patientId,
      email: users.email,
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      lastAppointment: appointments.startTime,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.patientId, users.id))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(appointments.therapistId, therapist.id))
    .orderBy(desc(appointments.startTime));

  // Group by patient and get unique patients with their last appointment
  const uniquePatients = patientAppointments.reduce((acc: any[], curr) => {
    if (!acc.find(p => p.patientId === curr.patientId)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  successResponse(res, uniquePatients);
});

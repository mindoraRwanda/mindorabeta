import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { appointments, reviews, therapists } from '../../database/schema';
import { eq, count, avg, and, gte } from 'drizzle-orm';

/**
 * Get therapist analytics - returns statistics about the therapist's practice
 */
export const getAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const therapistUserId = req.user!.userId;

    // Get therapist record
    const [therapist] = await db
        .select()
        .from(therapists)
        .where(eq(therapists.userId, therapistUserId));

    if (!therapist) {
        return res.status(404).json({ success: false, message: 'Therapist profile not found' });
    }

    // Get total appointments count
    const [appointmentStats] = await db
        .select({ total: count() })
        .from(appointments)
        .where(eq(appointments.therapistId, therapist.id));

    // Get completed appointments count
    const [completedStats] = await db
        .select({ completed: count() })
        .from(appointments)
        .where(and(
            eq(appointments.therapistId, therapist.id),
            eq(appointments.status, 'COMPLETED')
        ));

    // Get unique patients count
    const uniquePatients = await db
        .selectDistinct({ patientId: appointments.patientId })
        .from(appointments)
        .where(eq(appointments.therapistId, therapist.id));

    // Get review stats
    const [reviewStats] = await db
        .select({
            totalReviews: count(),
            avgRating: avg(reviews.rating)
        })
        .from(reviews)
        .where(eq(reviews.therapistId, therapist.id));

    // Get this month's appointments
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [monthlyStats] = await db
        .select({ count: count() })
        .from(appointments)
        .where(and(
            eq(appointments.therapistId, therapist.id),
            gte(appointments.startTime, startOfMonth)
        ));

    const analytics = {
        totalPatients: uniquePatients.length,
        totalAppointments: appointmentStats?.total || 0,
        completedAppointments: completedStats?.completed || 0,
        thisMonthAppointments: monthlyStats?.count || 0,
        totalReviews: reviewStats?.totalReviews || 0,
        averageRating: reviewStats?.avgRating ? Number(reviewStats.avgRating).toFixed(1) : '0.0',
        status: therapist.status,
        isAvailable: therapist.isAvailable,
    };

    successResponse(res, analytics);
});

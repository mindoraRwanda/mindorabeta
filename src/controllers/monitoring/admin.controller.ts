import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { patientMonitoring, users, profiles } from '../../database/schema';
import { eq, desc, gte, and } from 'drizzle-orm';

/**
 * Get high-risk patients - returns patients with risk level >= 2 (HIGH or CRITICAL)
 */
export const getHighRiskPatients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const highRiskPatients = await db
        .select({
            id: patientMonitoring.id,
            patientId: patientMonitoring.patientId,
            riskLevel: patientMonitoring.riskLevel,
            lastCheckIn: patientMonitoring.lastCheckIn,
            notes: patientMonitoring.notes,
            email: users.email,
            fullName: profiles.fullName,
            avatarUrl: profiles.avatarUrl,
            createdAt: patientMonitoring.createdAt,
        })
        .from(patientMonitoring)
        .innerJoin(users, eq(patientMonitoring.patientId, users.id))
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .where(gte(patientMonitoring.riskLevel, 2))
        .orderBy(desc(patientMonitoring.riskLevel), desc(patientMonitoring.updatedAt));

    const formattedPatients = highRiskPatients.map(patient => ({
        ...patient,
        riskLabel: patient.riskLevel === 3 ? 'CRITICAL' : 'HIGH',
    }));

    successResponse(res, formattedPatients);
});

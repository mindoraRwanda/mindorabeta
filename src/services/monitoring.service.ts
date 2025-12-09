import { db } from '../config/database';
import { patientMonitoring } from '../database/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { generateMonitoringReport } from '../utils/generateMonitoringReport';

/**
 * Create monitoring entry
 */
export const createMonitoringEntry = async (patientId: string, therapistId: string, riskLevel: number, notes?: string) => {
    const [entry] = await db
        .insert(patientMonitoring)
        .values({
            patientId,
            therapistId,
            riskLevel: riskLevel as any,
            notes,
            lastCheckIn: new Date(),
        })
        .returning();

    return entry;
};

/**
 * Update monitoring entry
 */
export const updateMonitoringEntry = async (entryId: string, data: { riskLevel?: number; notes?: string }) => {
    const [entry] = await db
        .update(patientMonitoring)
        .set({
            ...data,
            riskLevel: data.riskLevel as any,
            lastCheckIn: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(patientMonitoring.id, entryId))
        .returning();

    return entry;
};

/**
 * Get patient monitoring data
 */
export const getPatientMonitoring = async (patientId: string) => {
    const monitoring = await db
        .select()
        .from(patientMonitoring)
        .where(eq(patientMonitoring.patientId, patientId))
        .limit(1);

    return monitoring[0];
};

/**
 * Get monitoring report
 */
export const getMonitoringReport = async (patientId: string, days = 30) => {
    return generateMonitoringReport(patientId, days);
};

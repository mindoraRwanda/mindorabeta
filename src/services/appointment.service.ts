import { db } from '../config/database';
import { appointments, sessionNotes, therapists } from '../database/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { sendAppointmentConfirmationEmail } from './email.service';
import { formatDateTime } from '../utils/dateHelper';

export interface CreateAppointmentData {
    patientId: string;
    therapistId: string;
    startTime: Date;
    endTime: Date;
    type?: string;
    notes?: string;
}

/**
 * Create appointment
 */
export const createAppointment = async (data: CreateAppointmentData) => {
    // Check therapist exists and is available
    const [therapist] = await db.select().from(therapists).where(eq(therapists.id, data.therapistId)).limit(1);

    if (!therapist) {
        throw ApiError.notFound('Therapist not found');
    }

    if (!therapist.isAvailable || therapist.status !== 'APPROVED') {
        throw ApiError.badRequest('Therapist is not available');
    }

    // Check for time conflicts
    const conflicts = await db
        .select()
        .from(appointments)
        .where(
            and(
                eq(appointments.therapistId, data.therapistId),
                gte(appointments.startTime, data.startTime),
                lte(appointments.startTime, data.endTime),
            ),
        );

    if (conflicts.length > 0) {
        throw ApiError.conflict('Time slot is not available');
    }

    const [appointment] = await db.insert(appointments).values(data as any).returning();

    return appointment;
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (appointmentId: string, userId: string) => {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);

    if (!appointment) {
        throw ApiError.notFound('Appointment not found');
    }

    // Check authorization
    const [therapist] = await db.select().from(therapists).where(eq(therapists.id, appointment.therapistId)).limit(1);

    if (appointment.patientId !== userId && therapist?.userId !== userId) {
        throw ApiError.forbidden('Access denied');
    }

    return appointment;
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const [appointment] = await db
        .update(appointments)
        .set({ status: status as any })
        .where(eq(appointments.id, appointmentId))
        .returning();

    return appointment;
};

/**
 * Create session notes
 */
export const createSessionNotes = async (appointmentId: string, therapistId: string, content: string, moodBefore?: string, moodAfter?: string) => {
    const [notes] = await db
        .insert(sessionNotes)
        .values({
            appointmentId,
            therapistId,
            content,
            moodBefore: moodBefore as any,
            moodAfter: moodAfter as any,
        })
        .returning();

    return notes;
};

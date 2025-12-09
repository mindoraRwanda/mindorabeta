import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../../services/appointment.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Confirm appointment
 */
export const confirmAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, 'CONFIRMED');
    successResponse(res, appointment, 'Appointment confirmed');
});

/**
 * Complete appointment
 */
export const completeAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, 'COMPLETED');
    successResponse(res, appointment, 'Appointment marked as completed');
});

/**
 * Add session notes
 */
export const addSessionNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const notes = await appointmentService.createSessionNotes(
        req.params.id,
        req.user!.userId,
        req.body.content,
        req.body.moodBefore,
        req.body.moodAfter,
    );
    successResponse(res, notes, 'Session notes added', 201);
});

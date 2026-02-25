import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../../services/appointment.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { appointments } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Create appointment (patient)
 */
export const createAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.createAppointment({
      ...req.body,
      patientId: req.user!.userId,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    });
    successResponse(res, appointment, 'Appointment created successfully', 201);
  },
);

/**
 * Get patient appointments
 */
export const getAppointments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, req.user!.userId))
      .orderBy(desc(appointments.startTime));

    successResponse(res, patientAppointments);
  },
);

/**
 * Get appointment details
 */
export const getAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id,
      req.user!.userId,
    );
    successResponse(res, appointment);
  },
);

/**
 * Cancel appointment
 */
export const cancelAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.updateAppointmentStatus(
      req.params.id,
      'CANCELLED',
    );
    successResponse(res, appointment, 'Appointment cancelled');
  },
);

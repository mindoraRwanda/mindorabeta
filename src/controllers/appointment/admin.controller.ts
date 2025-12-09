import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../../services/appointment.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Update appointment status (admin)
 */
export const updateStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body.status);
    successResponse(res, appointment, 'Appointment status updated');
});

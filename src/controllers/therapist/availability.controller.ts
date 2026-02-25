import { Request, Response, NextFunction } from 'express';
import * as therapistService from '../../services/therapist.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Set availability
 */
export const setAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const availability = await therapistService.setAvailability({
      ...req.body,
      therapistId: req.params.therapistId || req.user!.userId,
    });
    successResponse(res, availability, 'Availability set successfully', 201);
  },
);

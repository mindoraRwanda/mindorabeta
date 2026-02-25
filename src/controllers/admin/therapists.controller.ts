import { Request, Response, NextFunction } from 'express';
import * as therapistService from '../../services/therapist.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Approve therapist
 */
export const approveTherapist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const therapist = await therapistService.approveTherapist(req.params.id);
    successResponse(res, therapist, 'Therapist approved');
  },
);

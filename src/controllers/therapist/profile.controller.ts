import { Request, Response, NextFunction } from 'express';
import * as therapistService from '../../services/therapist.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get therapist by ID
 */
export const getTherapist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const therapist = await therapistService.getTherapistById(req.params.id);
    successResponse(res, therapist);
});

/**
 * Create therapist profile
 */
export const createTherapistProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const therapist = await therapistService.createTherapist({
        ...req.body,
        userId: req.user!.userId,
    });
    successResponse(res, therapist, 'Therapist profile created successfully', 201);
});

/**
 * Update therapist profile
 */
export const updateTherapist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const therapist = await therapistService.updateTherapist(req.params.id, req.body);
    successResponse(res, therapist, 'Profile updated successfully');
});

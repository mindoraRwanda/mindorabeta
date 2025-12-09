import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../../services/exercise.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Create exercise (admin/therapist)
 */
export const createExercise = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await exerciseService.createExercise({
        ...req.body,
        createdBy: req.user!.userId,
    });
    successResponse(res, exercise, 'Exercise created successfully', 201);
});

/**
 * Update exercise (admin/therapist)
 */
export const updateExercise = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await exerciseService.updateExercise(req.params.id, req.user!.userId, req.body);
    successResponse(res, exercise, 'Exercise updated successfully');
});

/**
 * Upload media for exercise (admin/therapist)
 */
export const uploadMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // This would typically handle file upload
    // For now, return success assuming file upload middleware handles it
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Upload to cloudinary and update exercise
    successResponse(res, { mediaUrl: 'mock-url' }, 'Media uploaded successfully');
});


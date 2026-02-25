import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../../services/exercise.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get user progress
 */
export const getProgress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const progress = await exerciseService.getUserExerciseProgress(req.user!.userId);
  successResponse(res, progress);
});

/**
 * Start exercise
 */
export const startExercise = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userExercise = await exerciseService.startExercise(req.user!.userId, req.params.id);
  successResponse(res, userExercise, 'Exercise started', 201);
});

/**
 * Update progress
 */
export const updateProgress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updated = await exerciseService.updateExerciseProgress(
      req.user!.userId,
      req.params.id,
      req.body,
    );
    successResponse(res, updated, 'Progress updated');
  },
);

/**
 * Complete exercise
 */
export const completeExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const completion = await exerciseService.completeExercise(
      req.user!.userId,
      req.params.id,
      req.body.rating,
      req.body.notes,
    );
    successResponse(res, completion, 'Exercise marked as completed', 201);
  },
);

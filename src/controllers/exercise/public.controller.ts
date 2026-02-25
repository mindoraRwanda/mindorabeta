import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../../services/exercise.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get all exercises
 */
export const getExercises = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const exercises = await exerciseService.getAllExercises(req.query);
  successResponse(res, exercises);
});

/**
 * Get exercise by ID
 */
export const getExercise = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const exercise = await exerciseService.getExerciseById(req.params.id);
  successResponse(res, exercise);
});

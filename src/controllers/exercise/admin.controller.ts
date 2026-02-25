import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../../services/exercise.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Admin create/update/delete exercise
 */
export const adminCreateExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await exerciseService.createExercise(req.body);
    successResponse(res, exercise, 'Exercise created', 201);
  },
);

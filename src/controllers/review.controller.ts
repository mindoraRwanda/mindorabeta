import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';

/**
 * Create review
 */
export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const review = await reviewService.createReview(
    req.params.therapistId,
    req.user!.userId,
    req.body.rating,
    req.body.comment,
  );
  successResponse(res, review, 'Review submitted', 201);
});

/**
 * Get therapist reviews
 */
export const getReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const reviews = await reviewService.getTherapistReviews(req.params.therapistId);
  successResponse(res, reviews);
});

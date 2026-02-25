import { Request, Response, NextFunction } from 'express';
import * as moodLogService from '../../services/moodLog.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get mood trends
 */
export const getTrends = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const days = parseInt(req.query.days as string) || 30;
  const trends = await moodLogService.getMoodTrends(req.user!.userId, days);
  successResponse(res, trends);
});

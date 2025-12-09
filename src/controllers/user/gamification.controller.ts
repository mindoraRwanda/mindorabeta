import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { getUserAchievements } from '../../services/achievement.service';
import { getUserStreak } from '../../services/streak.service';

/**
 * Get user achievements
 */
export const getAchievements = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const achievements = await getUserAchievements(req.user!.userId);
    successResponse(res, achievements);
});

/**
 * Get current streak
 */
export const getStreak = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const streak = await getUserStreak(req.user!.userId);
    successResponse(res, { streakCount: streak });
});

import { Request, Response, NextFunction } from 'express';
import * as moodLogService from '../../services/moodLog.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Create mood log
 */
export const createMoodLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const moodLog = await moodLogService.createMoodLog({
        ...req.body,
        userId: req.user!.userId,
    });
    successResponse(res, moodLog, 'Mood logged successfully', 201);
});

/**
 * Get mood logs
 */
export const getMoodLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const logs = await moodLogService.getUserMoodLogs(req.user!.userId, days);
    successResponse(res, logs);
});

/**
 * Get specific mood log
 */
export const getMoodLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const log = await moodLogService.getMoodLog(req.params.logId, req.user!.userId);
    successResponse(res, log);
});

/**
 * Update mood log
 */
export const updateMoodLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const log = await moodLogService.updateMoodLog(req.params.logId, req.user!.userId, req.body);
    successResponse(res, log, 'Mood log updated successfully');
});

/**
 * Delete mood log
 */
export const deleteMoodLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await moodLogService.deleteMoodLog(req.params.logId, req.user!.userId);
    successResponse(res, null, 'Mood log deleted successfully');
});

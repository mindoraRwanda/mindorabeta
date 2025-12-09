import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';

/**
 * Get notifications
 */
export const getNotifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await notificationService.getUserNotifications(req.user!.userId);
    successResponse(res, notifications);
});

/**
 * Mark as read
 */
export const markAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await notificationService.markNotificationAsRead(req.params.id);
    successResponse(res, null, 'Notification marked as read');
});

/**
 * Delete notification
 */
export const deleteNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await notificationService.deleteNotification(req.params.id);
    successResponse(res, null, 'Notification deleted');
});

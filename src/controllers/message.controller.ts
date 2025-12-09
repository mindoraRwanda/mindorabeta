import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';

/**
 * Send message
 */
export const sendMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const message = await messageService.sendMessage(
        req.user!.userId,
        req.body.receiverId,
        req.body.content,
        req.body.messageType,
    );
    successResponse(res, message, 'Message sent', 201);
});

/**
 * Get conversations
 */
export const getConversations = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const conversations = await messageService.getUserConversations(req.user!.userId);
    successResponse(res, conversations);
});

/**
 * Mark as read
 */
export const markAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await messageService.markAsRead(req.params.id);
    successResponse(res, null, 'Message marked as read');
});

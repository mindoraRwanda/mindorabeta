import { Request, Response, NextFunction } from 'express';
import * as postService from '../../services/post.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Create comment
 */
export const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const comment = await postService.createComment(
        req.params.postId,
        req.user!.userId,
        req.body.content,
        req.body.parentId,
    );
    successResponse(res, comment, 'Comment added', 201);
});

/**
 * Update comment
 */
export const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const comment = await postService.updateComment(req.params.commentId, req.user!.userId, req.body.content);
    successResponse(res, comment, 'Comment updated successfully');
});

/**
 * Delete comment
 */
export const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await postService.deleteComment(req.params.commentId, req.user!.userId);
    successResponse(res, null, 'Comment deleted successfully');
});

/**
 * Toggle like
 */
export const toggleLike = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.toggleCommentLike(req.params.commentId, req.user!.userId);
    successResponse(res, result);
});

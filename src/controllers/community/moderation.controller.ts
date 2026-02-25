import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { posts } from '../../database/schema';
import { eq } from 'drizzle-orm';

/**
 * Moderate post - approve, reject, or hide a post
 */
export const moderatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { action } = req.body; // 'APPROVE', 'REJECT', 'HIDE'

  const [post] = await db.select().from(posts).where(eq(posts.id, id));

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  let updateData: any = {};
  let message = '';

  switch (action) {
    case 'APPROVE':
      updateData = { isModerated: true };
      message = 'Post approved';
      break;
    case 'REJECT':
    case 'HIDE':
      // For reject/hide, we could delete or mark as hidden
      // Using isModerated = false to indicate rejected
      updateData = { isModerated: false, visibility: 'PRIVATE' };
      message = 'Post hidden from public view';
      break;
    default:
      return res
        .status(400)
        .json({ success: false, message: 'Invalid action. Use APPROVE, REJECT, or HIDE' });
  }

  const [updatedPost] = await db.update(posts).set(updateData).where(eq(posts.id, id)).returning();

  successResponse(res, updatedPost, message);
});

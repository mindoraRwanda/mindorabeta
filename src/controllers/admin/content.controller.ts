import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { posts, exercises, resources, moodLogs } from '../../database/schema';
import { count, gte, and, eq } from 'drizzle-orm';

/**
 * Get platform content stats - returns statistics about content on the platform
 */
export const getContentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total posts
    const [totalPosts] = await db.select({ total: count() }).from(posts);

    // Posts this month
    const [postsThisMonth] = await db
      .select({ total: count() })
      .from(posts)
      .where(gte(posts.createdAt, thirtyDaysAgo));

    // Moderated posts
    const [moderatedPosts] = await db
      .select({ total: count() })
      .from(posts)
      .where(eq(posts.isModerated, true));

    // Total exercises
    const [totalExercises] = await db.select({ total: count() }).from(exercises);

    // Premium exercises
    const [premiumExercises] = await db
      .select({ total: count() })
      .from(exercises)
      .where(eq(exercises.isPremium, true));

    // Total resources
    const [totalResources] = await db.select({ total: count() }).from(resources);

    // Total mood logs
    const [totalMoodLogs] = await db.select({ total: count() }).from(moodLogs);

    // Mood logs this month
    const [moodLogsThisMonth] = await db
      .select({ total: count() })
      .from(moodLogs)
      .where(gte(moodLogs.loggedAt, thirtyDaysAgo));

    const contentStats = {
      posts: {
        total: totalPosts?.total || 0,
        thisMonth: postsThisMonth?.total || 0,
        moderated: moderatedPosts?.total || 0,
      },
      exercises: {
        total: totalExercises?.total || 0,
        premium: premiumExercises?.total || 0,
      },
      resources: {
        total: totalResources?.total || 0,
      },
      moodLogs: {
        total: totalMoodLogs?.total || 0,
        thisMonth: moodLogsThisMonth?.total || 0,
      },
    };

    successResponse(res, contentStats);
  },
);

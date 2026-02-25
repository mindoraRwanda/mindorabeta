import { db } from '../config/database';
import { achievements, userAchievements, profiles } from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { ACHIEVEMENT_POINTS } from '../utils/constants';
import { createNotification } from './notification.service';

/**
 * Unlock achievement for user
 */
export const unlockAchievement = async (userId: string, achievementId: string) => {
  // Check if already unlocked
  const existing = await db
    .select()
    .from(userAchievements)
    .where(
      and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)),
    )
    .limit(1);

  if (existing.length > 0) {
    return null; // Already unlocked
  }

  // Unlock achievement
  const [unlocked] = await db
    .insert(userAchievements)
    .values({ userId, achievementId })
    .returning();

  // Get achievement details
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, achievementId))
    .limit(1);

  if (achievement) {
    // Add points to user
    await db
      .update(profiles)
      .set({ totalPoints: sql`${profiles.totalPoints} + ${achievement.points}` })
      .where(eq(profiles.userId, userId));

    // Send notification
    await createNotification(
      userId,
      'Achievement Unlocked!',
      `You unlocked "${achievement.title}" and earned ${achievement.points} points!`,
      'ACHIEVEMENT',
      { achievementId, points: achievement.points },
    );
  }

  return unlocked;
};

/**
 * Get user achievements
 */
export const getUserAchievements = async (userId: string) => {
  const userAchievementsList = await db
    .select({
      achievement: achievements,
      unlockedAt: userAchievements.unlockedAt,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));

  return userAchievementsList;
};

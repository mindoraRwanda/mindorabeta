import { db } from '../config/database';
import { profiles } from '../database/schema';
import { eq, sql } from 'drizzle-orm';
import { isToday } from '../utils/dateHelper';

/**
 * Update user streak
 */
export const updateStreak = async (userId: string) => {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  if (!profile) return;

  const lastUpdate = profile.updatedAt;
  const currentCount = profile.streakCount || 0;

  // Check if last update was today
  if (lastUpdate && isToday(lastUpdate)) {
    return { streakCount: currentCount, changed: false };
  }

  // Increment streak
  const newCount = currentCount + 1;

  await db
    .update(profiles)
    .set({
      streakCount: newCount,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId));

  return { streakCount: newCount, changed: true };
};

/**
 * Reset streak
 */
export const resetStreak = async (userId: string) => {
  await db.update(profiles).set({ streakCount: 0 }).where(eq(profiles.userId, userId));
};

/**
 * Get user streak
 */
export const getUserStreak = async (userId: string) => {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  return profile?.streakCount || 0;
};

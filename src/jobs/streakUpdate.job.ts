import cron from 'node-cron';
import { db } from '../config/database';
import { profiles, moodLogs, userAchievements, achievements } from '../database/schema';
import { eq, gte, desc, and } from 'drizzle-orm';

import { logger } from '../utils/logger';

/**
 * Streak Update Job
 * Updates user streaks based on daily activity (mood logging)
 * Runs daily at 1 AM
 */
export function startStreakUpdateJob() {
  // Run daily at 1 AM
  cron.schedule('0 1 * * *', async () => {
    logger.info('[Job] Running streak update...');

    try {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // Get all user profiles
      const allProfiles = await db.select().from(profiles);

      let streaksUpdated = 0;
      let streaksReset = 0;

      for (const profile of allProfiles) {
        // Check if user logged mood yesterday
        const yesterdayLogs = await db
          .select()
          .from(moodLogs)
          .where(and(eq(moodLogs.userId, profile.userId), gte(moodLogs.loggedAt, yesterday)))
          .limit(1);

        if (yesterdayLogs.length > 0) {
          // User was active yesterday, increment streak
          const newStreak = (profile.streakCount || 0) + 1;
          const pointsEarned = calculateStreakPoints(newStreak);

          await db
            .update(profiles)
            .set({
              streakCount: newStreak,
              totalPoints: (profile.totalPoints || 0) + pointsEarned,
              updatedAt: now,
            })
            .where(eq(profiles.id, profile.id));

          streaksUpdated++;

          // Check for streak achievements
          await checkStreakAchievements(profile.userId, newStreak);
        } else {
          // User was not active, reset streak if it was > 0
          if ((profile.streakCount || 0) > 0) {
            await db
              .update(profiles)
              .set({
                streakCount: 0,
                updatedAt: now,
              })
              .where(eq(profiles.id, profile.id));

            streaksReset++;
          }
        }
      }

      logger.info(
        `[Job] Streak update complete. Updated: ${streaksUpdated}, Reset: ${streaksReset}`,
      );
    } catch (error) {
      logger.error('[Job] Streak update job failed:', error);
    }
  });

  logger.info('[Job] Streak update job scheduled (daily at 1 AM)');
}

/**
 * Calculate points earned for maintaining a streak
 */
function calculateStreakPoints(streakDays: number): number {
  if (streakDays >= 30) return 50; // Monthly milestone
  if (streakDays >= 7) return 20; // Weekly milestone
  if (streakDays >= 3) return 10; // 3-day streak
  return 5; // Daily points
}

/**
 * Check and award streak-based achievements
 */
async function checkStreakAchievements(userId: string, streakDays: number) {
  const STREAK_ACHIEVEMENTS = [
    { days: 7, title: 'Consistent' },
    { days: 30, title: 'Month Strong' },
  ];

  for (const achievement of STREAK_ACHIEVEMENTS) {
    if (streakDays === achievement.days) {
      // Find the achievement
      const [achievementRecord] = await db
        .select()
        .from(achievements)
        .where(eq(achievements.title, achievement.title));

      if (achievementRecord) {
        // Check if already unlocked
        const [existing] = await db
          .select()
          .from(userAchievements)
          .where(
            and(
              eq(userAchievements.userId, userId),
              eq(userAchievements.achievementId, achievementRecord.id),
            ),
          );

        if (!existing) {
          // Award achievement
          await db.insert(userAchievements).values({
            userId,
            achievementId: achievementRecord.id,
          });

          logger.info(`[Job] Awarded "${achievement.title}" achievement to user ${userId}`);
        }
      }
    }
  }
}

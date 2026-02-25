// ──────────────────────────────────────────────────────────────
// Gamification Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { achievements, userAchievements } from '../schema';

// Type exports for gamification
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

// Re-export from main schema
export { achievements, userAchievements };

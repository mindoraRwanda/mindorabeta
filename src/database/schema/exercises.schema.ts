// ──────────────────────────────────────────────────────────────
// Exercises Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { exercises, userExercises, resources } from '../schema';

// Type exports for exercises and resources
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type UserExercise = typeof userExercises.$inferSelect;
export type NewUserExercise = typeof userExercises.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type ExerciseCategory = 'mindfulness' | 'CBT' | 'breathing' | 'relaxation';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

// Re-export from main schema
export { exercises, userExercises, resources };

// ──────────────────────────────────────────────────────────────
// Profiles Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { profiles, genderEnum } from '../schema';

// Type exports for profiles
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

// Re-export from main schema
export { profiles, genderEnum };

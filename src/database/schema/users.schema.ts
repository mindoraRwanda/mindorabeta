// ──────────────────────────────────────────────────────────────
// Users Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { users, roleEnum } from '../schema';

// Type exports for users
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';

// Re-export from main schema
export { users, roleEnum };

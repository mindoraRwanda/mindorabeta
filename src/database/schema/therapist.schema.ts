// ──────────────────────────────────────────────────────────────
// Therapist Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { therapists, therapistDocuments, therapistAvailability, therapistStatusEnum } from '../schema';

// Type exports for therapists
export type Therapist = typeof therapists.$inferSelect;
export type NewTherapist = typeof therapists.$inferInsert;
export type TherapistDocument = typeof therapistDocuments.$inferSelect;
export type NewTherapistDocument = typeof therapistDocuments.$inferInsert;
export type TherapistAvailability = typeof therapistAvailability.$inferSelect;
export type NewTherapistAvailability = typeof therapistAvailability.$inferInsert;
export type TherapistStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

// Re-export from main schema
export { therapists, therapistDocuments, therapistAvailability, therapistStatusEnum };

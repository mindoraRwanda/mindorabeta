// ──────────────────────────────────────────────────────────────
// Monitoring Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { moodLogs, patientMonitoring, emergencyContacts, moodEnum, anxietyLevelEnum } from '../schema';

// Type exports for monitoring
export type MoodLog = typeof moodLogs.$inferSelect;
export type NewMoodLog = typeof moodLogs.$inferInsert;
export type PatientMonitoring = typeof patientMonitoring.$inferSelect;
export type NewPatientMonitoring = typeof patientMonitoring.$inferInsert;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type NewEmergencyContact = typeof emergencyContacts.$inferInsert;

export type Mood = 'VERY_SAD' | 'SAD' | 'NEUTRAL' | 'HAPPY' | 'VERY_HAPPY';
export type AnxietyLevel = 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREME';
export type RiskLevel = 0 | 1 | 2 | 3;  // 0=none, 3=critical

// Re-export from main schema
export { moodLogs, patientMonitoring, emergencyContacts, moodEnum, anxietyLevelEnum };

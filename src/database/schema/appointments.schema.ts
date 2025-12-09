// ──────────────────────────────────────────────────────────────
// Appointments Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import { appointments, sessionNotes, appointmentStatusEnum, appointmentTypeEnum } from '../schema';

// Type exports for appointments
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type SessionNote = typeof sessionNotes.$inferSelect;
export type NewSessionNote = typeof sessionNotes.$inferInsert;
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type AppointmentType = 'VIDEO' | 'AUDIO' | 'CHAT' | 'IN_PERSON';

// Re-export from main schema
export { appointments, sessionNotes, appointmentStatusEnum, appointmentTypeEnum };

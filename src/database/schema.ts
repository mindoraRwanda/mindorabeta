import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, date, uuid, pgEnum, index, uniqueIndex, foreignKey, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ──────────────────────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────────────────────
export const roleEnum = pgEnum('role', ['PATIENT', 'THERAPIST', 'ADMIN']);
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);
export const appointmentTypeEnum = pgEnum('appointment_type', ['VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON']);
export const moodEnum = pgEnum('mood', ['VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY']);
export const anxietyLevelEnum = pgEnum('anxiety_level', ['NONE', 'MILD', 'MODERATE', 'SEVERE', 'EXTREME']);
export const postVisibilityEnum = pgEnum('post_visibility', ['PUBLIC', 'ANONYMOUS', 'PRIVATE']);
export const notificationTypeEnum = pgEnum('notification_type', ['APPOINTMENT', 'MESSAGE', 'POST', 'SYSTEM', 'ACHIEVEMENT']);
export const messageTypeEnum = pgEnum('message_type', ['TEXT', 'IMAGE', 'VOICE', 'VIDEO_CALL']);
export const therapistStatusEnum = pgEnum('therapist_status', ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']);

// ──────────────────────────────────────────────────────────────
// Tables
// ──────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').default('PATIENT').notNull(),
  isActive: boolean('is_active').default(true),
  isEmailVerified: boolean('is_email_verified').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: varchar('full_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  anonymousName: varchar('anonymous_name', { length: 50 }), // e.g., "Brave Lion"
  streakCount: integer('streak_count').default(0),
  totalPoints: integer('total_points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const therapists = pgTable('therapists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  licenseNumber: varchar('license_number', { length: 100 }).unique(),
  yearsOfExperience: integer('years_of_experience'),
  specialization: jsonb('specialization').$type<string[]>(),
  bio: text('bio'),
  hourlyRate: integer('hourly_rate'), // in cents
  status: therapistStatusEnum('status').default('PENDING'),
  isAvailable: boolean('is_available').default(true),
  rating: integer('rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const therapistDocuments = pgTable('therapist_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  therapistId: uuid('therapist_id').notNull().references(() => therapists.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(), // license, certificate, id_proof
  url: text('url').notNull(),
  verified: boolean('verified').default(false),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

export const therapistAvailability = pgTable('therapist_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  therapistId: uuid('therapist_id').notNull().references(() => therapists.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday
  startTime: varchar('start_time', { length: 5 }).notNull(), // "09:00"
  endTime: varchar('end_time', { length: 5 }).notNull(),   // "17:00"
});

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  therapistId: uuid('therapist_id').notNull().references(() => therapists.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  type: appointmentTypeEnum('type').default('VIDEO'),
  status: appointmentStatusEnum('status').default('PENDING'),
  notes: text('notes'),
  meetingLink: text('meeting_link'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessionNotes = pgTable('session_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  appointmentId: uuid('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
  therapistId: uuid('therapist_id').notNull().references(() => therapists.id),
  content: text('content').notNull(),
  moodBefore: moodEnum('mood_before'),
  moodAfter: moodEnum('mood_after'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // mindfulness, CBT, breathing
  durationMinutes: integer('duration_minutes'),
  difficulty: integer('difficulty').$type<1 | 2 | 3 | 4 | 5>(),
  imageUrl: text('image_url'),
  videoUrl: text('video_url'),
  isPremium: boolean('is_premium').default(false),
  createdBy: uuid('created_by').references(() => users.id), // null = official
  createdAt: timestamp('created_at').defaultNow(),
});

export const userExercises = pgTable('user_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id),
  completedAt: timestamp('completed_at'),
  rating: integer('rating').$type<1 | 2 | 3 | 4 | 5>(),
  notes: text('notes'),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.exerciseId, table.completedAt] }),
}));

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  visibility: postVisibilityEnum('visibility').default('ANONYMOUS'),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  isModerated: boolean('is_moderated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const postLikes = pgTable('post_likes', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.userId] }),
}));
//@ts-ignore
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  //@ts-ignore
  parentId: uuid('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const moodLogs = pgTable('mood_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mood: moodEnum('mood').notNull(),
  anxietyLevel: anxietyLevelEnum('anxiety_level'),
  note: text('note'),
  loggedAt: timestamp('logged_at').defaultNow(),
});

export const patientMonitoring = pgTable('patient_monitoring', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  therapistId: uuid('therapist_id').references(() => therapists.id),
  riskLevel: integer('risk_level').$type<0 | 1 | 2 | 3>(), // 0=none, 3=critical
  lastCheckIn: timestamp('last_check_in'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emergencyContacts = pgTable('emergency_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  relationship: varchar('relationship', { length: 50 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
});

export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }), // article, video, helpline
  url: text('url'),
  imageUrl: text('image_url'),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  therapistId: uuid('therapist_id').notNull().references(() => therapists.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').$type<1 | 2 | 3 | 4 | 5>().notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body'),
  type: notificationTypeEnum('type').default('SYSTEM'),
  isRead: boolean('is_read').default(false),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  receiverId: uuid('receiver_id').notNull().references(() => users.id),
  content: text('content'),
  messageType: messageTypeEnum('message_type').default('TEXT'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  points: integer('points').notNull(),
});

export const userAchievements = pgTable('user_achievements', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.achievementId] }),
}));

// ──────────────────────────────────────────────────────────────
// Relations (for Drizzle queries)
// ──────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  therapist: one(therapists, { fields: [users.id], references: [therapists.userId] }),
}));

// Add more relations if needed — most are self-explanatory

export const schema = {
  users, profiles, therapists, therapistDocuments, therapistAvailability,
  appointments, sessionNotes, exercises, userExercises,
  posts, postLikes, comments, moodLogs, patientMonitoring,
  emergencyContacts, resources, reviews, notifications,
  messages, achievements, userAchievements,
};
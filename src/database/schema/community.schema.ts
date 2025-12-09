// ──────────────────────────────────────────────────────────────
// Community Schema - Type definitions and exports
// ──────────────────────────────────────────────────────────────

import {
    posts,
    postLikes,
    comments,
    reviews,
    notifications,
    messages,
    postVisibilityEnum,
    notificationTypeEnum,
    messageTypeEnum
} from '../schema';

// Type exports for community features
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type PostVisibility = 'PUBLIC' | 'ANONYMOUS' | 'PRIVATE';
export type NotificationType = 'APPOINTMENT' | 'MESSAGE' | 'POST' | 'SYSTEM' | 'ACHIEVEMENT';
export type MessageType = 'TEXT' | 'IMAGE' | 'VOICE' | 'VIDEO_CALL';

// Re-export from main schema
export {
    posts,
    postLikes,
    comments,
    reviews,
    notifications,
    messages,
    postVisibilityEnum,
    notificationTypeEnum,
    messageTypeEnum
};

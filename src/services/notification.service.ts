import { db } from '../config/database';
import { notifications } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import { getIO } from '../config/socket';

/**
 * Create notification
 */
export const createNotification = async (
  userId: string,
  title: string,
  body: string,
  type = 'SYSTEM',
  data?: any,
) => {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId,
      title,
      body,
      type: type as any,
      data,
    })
    .returning();

  // Emit real-time event
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('new_notification', notification);
  } catch (error) {
    console.error('Socket.IO error:', error);
  }

  return notification;
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId: string) => {
  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return userNotifications;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string) => {
  await db.delete(notifications).where(eq(notifications.id, notificationId));
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId: string) => {
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
};

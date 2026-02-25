import { Socket, Server } from 'socket.io';
import * as notificationService from '../../services/notification.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

// Store for connected users
const connectedUsers = new Map<string, string>(); // userId -> socketId

/**
 * Notification handler - handles real-time notification events
 */
export function registerNotificationHandlers(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.userId;

  if (!userId) {
    return;
  }

  // Register user connection
  connectedUsers.set(userId, socket.id);
  socket.join(`notifications:${userId}`);

  /**
   * Get unread notifications
   */
  socket.on('notifications:get', async () => {
    try {
      const notifications = await notificationService.getUserNotifications(userId);

      socket.emit('notifications:list', {
        notifications,
        unreadCount: notifications.filter((n: any) => !n.isRead).length,
      });
    } catch (error: any) {
      socket.emit('notifications:error', {
        error: error.message || 'Failed to get notifications',
      });
    }
  });

  /**
   * Mark notification as read
   */
  socket.on('notification:read', async (data: { notificationId: string }) => {
    try {
      await notificationService.markNotificationAsRead(data.notificationId);

      socket.emit('notification:read:success', {
        notificationId: data.notificationId,
      });
    } catch (error: any) {
      socket.emit('notifications:error', {
        error: error.message || 'Failed to mark notification as read',
      });
    }
  });

  /**
   * Mark all notifications as read
   */
  socket.on('notifications:readAll', async () => {
    try {
      await notificationService.markAllAsRead(userId);

      socket.emit('notifications:readAll:success', {});
    } catch (error: any) {
      socket.emit('notifications:error', {
        error: error.message || 'Failed to mark all notifications as read',
      });
    }
  });

  /**
   * Delete notification
   */
  socket.on('notification:delete', async (data: { notificationId: string }) => {
    try {
      await notificationService.deleteNotification(data.notificationId);

      socket.emit('notification:delete:success', {
        notificationId: data.notificationId,
      });
    } catch (error: any) {
      socket.emit('notifications:error', {
        error: error.message || 'Failed to delete notification',
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
  });
}

/**
 * Send notification to a specific user
 */
export function sendNotificationToUser(io: Server, userId: string, notification: any) {
  io.to(`notifications:${userId}`).emit('notification:new', {
    notification,
  });
}

/**
 * Check if user is online
 */
export function isUserOnline(userId: string): boolean {
  return connectedUsers.has(userId);
}

/**
 * Get online users
 */
export function getOnlineUsers(): string[] {
  return Array.from(connectedUsers.keys());
}

export default registerNotificationHandlers;

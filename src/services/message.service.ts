import { db } from '../config/database';
import { messages } from '../database/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { getIO } from '../config/socket';

/**
 * Send message
 */
export const sendMessage = async (senderId: string, receiverId: string, content: string, messageType = 'TEXT') => {
    const [message] = await db
        .insert(messages)
        .values({
            senderId,
            receiverId,
            content,
            messageType: messageType as any,
        })
        .returning();

    // Emit real-time event via Socket.IO
    try {
        const io = getIO();
        io.to(`user:${receiverId}`).emit('new_message', message);
    } catch (error) {
        console.error('Socket.IO error:', error);
    }

    return message;
};

/**
 * Get conversations for a user
 */
export const getUserConversations = async (userId: string) => {
    const userMessages = await db
        .select()
        .from(messages)
        .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
        .orderBy(desc(messages.createdAt))
        .limit(100);

    return userMessages;
};

/**
 * Mark message as read
 */
export const markAsRead = async (messageId: string) => {
    await db
        .update(messages)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(messages.id, messageId));
};

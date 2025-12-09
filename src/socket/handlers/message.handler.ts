import { Socket, Server } from 'socket.io';
import * as messageService from '../../services/message.service';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

/**
 * Message handler - handles real-time messaging events
 */
export function registerMessageHandlers(io: Server, socket: AuthenticatedSocket) {
    const userId = socket.userId;

    if (!userId) {
        return;
    }

    // Join user's personal room for direct messages
    socket.join(`user:${userId}`);

    /**
     * Send a message to another user
     */
    socket.on('message:send', async (data: {
        receiverId: string;
        content: string;
        messageType?: string;
    }) => {
        try {
            const { receiverId, content, messageType = 'TEXT' } = data;

            // Save message to database
            const message = await messageService.sendMessage(
                userId,
                receiverId,
                content,
                messageType as 'TEXT' | 'IMAGE' | 'VOICE' | 'VIDEO_CALL'
            );

            // Emit to sender (confirmation)
            socket.emit('message:sent', {
                success: true,
                message,
            });

            // Emit to receiver
            io.to(`user:${receiverId}`).emit('message:received', {
                message,
                from: userId,
            });

        } catch (error: any) {
            socket.emit('message:error', {
                error: error.message || 'Failed to send message',
            });
        }
    });

    /**
     * Mark message as read
     */
    socket.on('message:read', async (data: { messageId: string }) => {
        try {
            await messageService.markAsRead(data.messageId);

            socket.emit('message:read:success', {
                messageId: data.messageId,
            });
        } catch (error: any) {
            socket.emit('message:error', {
                error: error.message || 'Failed to mark message as read',
            });
        }
    });

    /**
     * Get conversation history
     */
    socket.on('message:history', async (data: { otherUserId: string; page?: number }) => {
        try {
            const conversations = await messageService.getUserConversations(userId);

            socket.emit('message:history:result', {
                conversations,
            });
        } catch (error: any) {
            socket.emit('message:error', {
                error: error.message || 'Failed to get message history',
            });
        }
    });

    /**
     * Join a conversation room
     */
    socket.on('conversation:join', (data: { conversationId: string }) => {
        socket.join(`conversation:${data.conversationId}`);
        socket.emit('conversation:joined', {
            conversationId: data.conversationId,
        });
    });

    /**
     * Leave a conversation room
     */
    socket.on('conversation:leave', (data: { conversationId: string }) => {
        socket.leave(`conversation:${data.conversationId}`);
    });
}

export default registerMessageHandlers;

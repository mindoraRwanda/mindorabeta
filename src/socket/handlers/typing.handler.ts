import { Socket, Server } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

// Store for typing status
const typingUsers = new Map<string, Set<string>>(); // conversationId -> Set of userIds

/**
 * Typing handler - handles real-time typing indicators
 */
export function registerTypingHandlers(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.userId;

  if (!userId) {
    return;
  }

  /**
   * User started typing
   */
  socket.on('typing:start', (data: { conversationId: string; receiverId?: string }) => {
    const { conversationId, receiverId } = data;

    // Add user to typing set
    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }
    typingUsers.get(conversationId)!.add(userId);

    // Notify other users in the conversation
    socket.to(`conversation:${conversationId}`).emit('typing:started', {
      userId,
      conversationId,
    });

    // If receiverId is provided, also emit to that user directly
    if (receiverId) {
      io.to(`user:${receiverId}`).emit('typing:started', {
        userId,
        conversationId,
      });
    }
  });

  /**
   * User stopped typing
   */
  socket.on('typing:stop', (data: { conversationId: string; receiverId?: string }) => {
    const { conversationId, receiverId } = data;

    // Remove user from typing set
    typingUsers.get(conversationId)?.delete(userId);

    // Notify other users in the conversation
    socket.to(`conversation:${conversationId}`).emit('typing:stopped', {
      userId,
      conversationId,
    });

    // If receiverId is provided, also emit to that user directly
    if (receiverId) {
      io.to(`user:${receiverId}`).emit('typing:stopped', {
        userId,
        conversationId,
      });
    }
  });

  /**
   * Get users currently typing in a conversation
   */
  socket.on('typing:get', (data: { conversationId: string }) => {
    const typingInConversation = typingUsers.get(data.conversationId) || new Set();

    socket.emit('typing:list', {
      conversationId: data.conversationId,
      typingUsers: Array.from(typingInConversation).filter(id => id !== userId),
    });
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    // Remove user from all typing sets
    typingUsers.forEach((users, conversationId) => {
      if (users.has(userId)) {
        users.delete(userId);
        io.to(`conversation:${conversationId}`).emit('typing:stopped', {
          userId,
          conversationId,
        });
      }
    });
  });
}

export default registerTypingHandlers;

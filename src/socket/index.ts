import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { socketAuthMiddleware } from './middleware/socketAuth.middleware';
import { registerMessageHandlers } from './handlers/message.handler';
import { registerNotificationHandlers, sendNotificationToUser } from './handlers/notification.handler';
import { registerTypingHandlers } from './handlers/typing.handler';
import { registerVideoCallHandlers } from './handlers/videoCall.handler';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

// Global socket.io instance
let io: Server;

/**
 * Initialize Socket.IO with the HTTP server
 */
export function initializeSocket(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // Apply authentication middleware
    io.use(socketAuthMiddleware);

    // Handle connections
    io.on('connection', (socket: AuthenticatedSocket) => {
        logger.info(`Socket connected: ${socket.id}, User: ${socket.userId || 'anonymous'}`);

        // Register all handlers
        registerMessageHandlers(io, socket);
        registerNotificationHandlers(io, socket);
        registerTypingHandlers(io, socket);
        registerVideoCallHandlers(io, socket);

        // Join user to their personal room
        if (socket.userId) {
            socket.join(`user:${socket.userId}`);

            // Broadcast user online status
            socket.broadcast.emit('user:online', { userId: socket.userId });
        }

        // Handle disconnect
        socket.on('disconnect', (reason) => {
            logger.info(`Socket disconnected: ${socket.id}, Reason: ${reason}`);

            if (socket.userId) {
                // Broadcast user offline status
                socket.broadcast.emit('user:offline', { userId: socket.userId });
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            logger.error(`Socket error: ${socket.id}`, error);
        });

        // Ping-pong for connection health
        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

    logger.info('Socket.IO initialized');
    return io;
}

/**
 * Get the Socket.IO instance
 */
export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initializeSocket first.');
    }
    return io;
}

/**
 * Send notification to a user via socket
 */
export function emitNotification(userId: string, notification: any): void {
    if (io) {
        sendNotificationToUser(io, userId, notification);
    }
}

/**
 * Emit event to a specific user
 */
export function emitToUser(userId: string, event: string, data: any): void {
    if (io) {
        io.to(`user:${userId}`).emit(event, data);
    }
}

/**
 * Emit event to all connected users
 */
export function emitToAll(event: string, data: any): void {
    if (io) {
        io.emit(event, data);
    }
}

/**
 * Emit event to users with a specific role
 */
export function emitToRole(role: string, event: string, data: any): void {
    if (io) {
        io.to(`role:${role}`).emit(event, data);
    }
}

export default {
    initializeSocket,
    getIO,
    emitNotification,
    emitToUser,
    emitToAll,
    emitToRole,
};

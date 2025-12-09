import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { verifyAccessToken } from './jwt';
import { logger } from '../utils/logger';

export let io: SocketServer;

export const initializeSocket = (httpServer: HttpServer) => {
    io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const payload = verifyAccessToken(token);
            socket.data.userId = payload.userId;
            socket.data.role = payload.role;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        logger.info(`User connected: ${userId}`);

        // Join user's personal room
        socket.join(`user:${userId}`);

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${userId}`);
        });
    });

    logger.info('Socket.IO initialized');
    return io;
};

export const getIO = (): SocketServer => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

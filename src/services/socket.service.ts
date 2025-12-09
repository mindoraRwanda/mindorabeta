import { Server as SocketServer } from 'socket.io';
import { logger } from '../utils/logger';

/**
 * Handle socket events
 */
export const initializeSocketEvents = (io: SocketServer) => {
    io.on('connection', (socket) => {
        const userId = socket.data.userId;

        // Join user to their room
        socket.join(`user:${userId}`);

        // Handle typing indicator
        socket.on('typing', (data: { receiverId: string }) => {
            io.to(`user:${data.receiverId}`).emit('user_typing', { userId });
        });

        // Handle stop typing
        socket.on('stop_typing', (data: { receiverId: string }) => {
            io.to(`user:${data.receiverId}`).emit('user_stop_typing', { userId });
        });

        // Handle join appointment room (for video calls)
        socket.on('join_appointment', (data: { appointmentId: string }) => {
            socket.join(`appointment:${data.appointmentId}`);
            logger.info(`User ${userId} joined appointment ${data.appointmentId}`);
        });

        // Handle leave appointment room
        socket.on('leave_appointment', (data: { appointmentId: string }) => {
            socket.leave(`appointment:${data.appointmentId}`);
            logger.info(`User ${userId} left appointment ${data.appointmentId}`);
        });

        socket.on('disconnect', () => {
            logger.info(`User ${userId} disconnected`);
        });
    });
};

/**
 * Emit event to specific user
 */
export const emitToUser = (io: SocketServer, userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit event to appointment room
 */
export const emitToAppointment = (io: SocketServer, appointmentId: string, event: string, data: any) => {
    io.to(`appointment:${appointmentId}`).emit(event, data);
};

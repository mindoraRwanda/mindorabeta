import { Socket } from 'socket.io';
import { verifyAccessToken } from '../../config/jwt';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}

/**
 * Socket authentication middleware
 * Verifies JWT token and attaches user info to socket
 */
export const socketAuthMiddleware = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return next(new Error('Authentication token required'));
        }

        const payload = verifyAccessToken(token);

        // Attach user info to socket
        socket.userId = payload.userId;
        socket.userRole = payload.role;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(new Error('Token expired'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('Invalid token'));
        }
        next(new Error('Authentication failed'));
    }
};

/**
 * Optional authentication middleware
 * Allows connection but doesn't require auth
 */
export const optionalSocketAuth = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const payload = verifyAccessToken(token);
            socket.userId = payload.userId;
            socket.userRole = payload.role;
        }

        next();
    } catch (error) {
        // Ignore auth errors, proceed without user info
        next();
    }
};

export default socketAuthMiddleware;

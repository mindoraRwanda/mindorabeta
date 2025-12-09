import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../config/jwt';
import { ApiError } from '../utils/apiError';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Auth middleware - Verify JWT token and attach user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const payload = verifyAccessToken(token);
        req.user = payload;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Token expired'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(ApiError.unauthorized('Invalid token'));
        }
        next(error);
    }
};

/**
 * Optional auth - Try to authenticate but don't fail if no token
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyAccessToken(token);
            req.user = payload;
        }

        next();
    } catch (error) {
        // Ignore errors, just proceed without user
        next();
    }
};

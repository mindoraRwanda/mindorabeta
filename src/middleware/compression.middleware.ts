import compression from 'compression';
import { Request, Response } from 'express';

/**
 * Compression middleware configuration
 * Compresses response bodies for all requests that traverse through the middleware
 */

// Filter function to decide if compression should be applied
const shouldCompress = (req: Request, res: Response): boolean => {
    // Don't compress if the client doesn't accept it
    if (req.headers['x-no-compression']) {
        return false;
    }

    // Use compression's default filter
    return compression.filter(req, res);
};

/**
 * Compression middleware with custom settings
 */
export const compressionMiddleware = compression({
    filter: shouldCompress,
    level: 6, // Compression level (0-9), 6 is a good balance
    threshold: 1024, // Only compress responses larger than 1KB
    memLevel: 8, // Memory level (1-9)
    chunkSize: 16 * 1024, // 16KB chunks
});

/**
 * No compression middleware (for testing or specific routes)
 */
export const noCompression = compression({
    filter: () => false,
});

export default compressionMiddleware;

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.userId || 'anonymous',
    };

    if (res.statusCode >= 500) {
      logger.error('Request Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request Warning', logData);
    } else {
      logger.info('Request Complete', logData);
    }
  });

  next();
};

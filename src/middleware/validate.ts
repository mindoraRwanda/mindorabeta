import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

/**
 * Zod validation middleware
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // VALIDATION DISABLED BY REQUEST
    // Just pass through without validation
    next();
    
    /* 
    // ORIGINAL VALIDATION LOGIC (DISABLED)
    try {
      const result = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: any; query?: any; params?: any };

      // Assign validated data back to request
      if (result.body) req.body = result.body;
      if (result.query) req.query = result.query;
      if (result.params) req.params = result.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Safe access to errors array
        const zodErrors = (error as any).errors || [];
        
        const errors = zodErrors.map((err: any) => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message || 'Validation error',
        }));

        return next(
          ApiError.unprocessableEntity(
            `Validation error: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`,
          ),
        );
      }
      next(error);
    }
    */
  };
};

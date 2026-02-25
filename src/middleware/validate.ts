import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

/**
 * Zod validation middleware
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
        const errors = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(
          ApiError.unprocessableEntity(
            `Validation error: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`,
          ),
        );
      }
      next(error);
    }
  };
};

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
      })) as any;

      // Assign validated data back to request
      if (result.body) req.body = result.body;
      if (result.query) req.query = result.query;
      if (result.params) req.params = result.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || [];
        const errors = issues.map((issue: any) => ({
          field: issue.path ? issue.path.join('.') : 'unknown',
          message: issue.message || 'Validation error',
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

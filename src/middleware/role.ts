import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

/**
 * Role-based access control middleware
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (req: Request, ...roles: string[]): boolean => {
  return req.user ? roles.includes(req.user.role) : false;
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (req: Request, ...roles: string[]): boolean => {
  return req.user ? roles.every(role => req.user!.role === role) : false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (req: Request): boolean => {
  return req.user?.role === 'ADMIN';
};

/**
 * Check if user is therapist
 */
export const isTherapist = (req: Request): boolean => {
  return req.user?.role === 'THERAPIST';
};

/**
 * Check if user is patient
 */
export const isPatient = (req: Request): boolean => {
  return req.user?.role === 'PATIENT';
};

import { Request, Response, NextFunction } from 'express';
import * as authService from '../../services/auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PATIENT, THERAPIST]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.register(req.body);
  successResponse(res, result, 'User registered successfully', 201);
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.login(req.body);
  successResponse(res, result, 'Login successful');
});

/**
 * Forgot password
 */
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.initiatePasswordReset(req.body.email);
    successResponse(res, null, 'Password reset email sent');
  },
);

/**
 * Reset password
 */
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.resetPassword(req.body.token, req.body.password);
  successResponse(res, null, 'Password reset successful');
});

/**
 * Change password (authenticated)
 */
export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.changePassword(
      req.user!.userId,
      req.body.currentPassword,
      req.body.newPassword,
    );
    successResponse(res, null, 'Password changed successfully');
  },
);

/**
 * Verify email
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.verifyEmail(req.body.token);
  successResponse(res, null, 'Email verified successfully');
});

/**
 * Logout
 */
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.logout(req.body.refreshToken);
  successResponse(res, null, 'Logged out successfully');
});

/**
 * Refresh token
 */
export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.refreshToken(req.body.refreshToken);
  successResponse(res, result, 'Token refreshed successfully');
});

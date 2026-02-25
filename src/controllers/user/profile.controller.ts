import { Request, Response, NextFunction } from 'express';
import * as userService from '../../services/user.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get current user profile
 */
export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const profile = await userService.getUserProfile(req.user!.userId);
  successResponse(res, profile);
});

/**
 * Get user by ID
 */
export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const profile = await userService.getUserProfile(req.params.userId);
  successResponse(res, profile);
});

/**
 * Update profile
 */
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const profile = await userService.updateUserProfile(req.user!.userId, req.body);
  successResponse(res, profile, 'Profile updated successfully');
});

/**
 * Upload avatar
 */
export const uploadAvatar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const profile = await userService.updateUserAvatar(req.user!.userId, req.file.buffer);
  successResponse(res, profile, 'Avatar uploaded successfully');
});

/**
 * Delete account
 */
export const deleteAccount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await userService.deleteUserAccount(req.user!.userId);
  successResponse(res, null, 'Account deleted successfully');
});

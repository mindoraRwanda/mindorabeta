import { db } from '../config/database';
import { users, profiles } from '../database/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { uploadAvatar } from './cloudinary.service';

export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
}

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    profile,
  };
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: UpdateProfileData) => {
  const [profile] = await db
    .update(profiles)
    .set({
      ...(data as any),
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  if (!profile) {
    throw ApiError.notFound('Profile not found');
  }

  return profile;
};

/**
 * Upload user avatar
 */
export const updateUserAvatar = async (userId: string, imageBuffer: Buffer) => {
  const result = await uploadAvatar(imageBuffer);

  const [profile] = await db
    .update(profiles)
    .set({
      avatarUrl: result.url,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  return profile;
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: string): Promise<void> => {
  await db.delete(users).where(eq(users.id, userId));
};

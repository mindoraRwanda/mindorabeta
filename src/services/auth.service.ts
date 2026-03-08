import bcrypt from 'bcrypt';
import { db } from '../config/database';
import { users, profiles, tokens } from '../database/schema';
import { eq, and, gt } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '../config/jwt';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from './email.service';
import { generateAnonymousName } from '../utils/generateAnonymousName';
import crypto from 'crypto';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: 'PATIENT' | 'THERAPIST';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    profile: any;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const { email, password, fullName, role = 'PATIENT' } = data;

  // Check if user already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      role,
    })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
    });

  // Generate anonymous name
  const anonymousName = generateAnonymousName();

  // Create profile
  const [profile] = await db
    .insert(profiles)
    .values({
      userId: newUser.id,
      fullName,
      anonymousName,
    })
    .returning({
      id: profiles.id,
      userId: profiles.userId,
      fullName: profiles.fullName,
      anonymousName: profiles.anonymousName,
    });

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await db.insert(tokens).values({
    userId: newUser.id,
    token: verificationToken,
    type: 'EMAIL_VERIFICATION',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send emails (welcome + verification)
  sendWelcomeEmail(email, fullName).catch(console.error);
  sendVerificationEmail(email, fullName, verificationToken).catch(console.error);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profile,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user by email
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      role: users.role,
      isActive: users.isActive,
      isEmailVerified: users.isEmailVerified,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.forbidden('Account has been deactivated');
  }

  // Get profile
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);

  // Update last login
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Initiate password reset
 */
export const initiatePasswordReset = async (email: string): Promise<void> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // Don't reveal that user doesn't exist
    return;
  }

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store token in database
  await db.insert(tokens).values({
    userId: user.id,
    token: resetToken,
    type: 'RESET_PASSWORD',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
  });

  // Send email
  sendPasswordResetEmail(email, profile?.fullName || 'User', resetToken).catch(console.error);
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // Find valid token
  const [validToken] = await db
    .select()
    .from(tokens)
    .where(
      and(
        eq(tokens.token, token),
        eq(tokens.type, 'RESET_PASSWORD'),
        gt(tokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!validToken) {
    throw ApiError.notFound('Reset token not found or expired');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, validToken.userId));

  // Delete used token
  await db.delete(tokens).where(eq(tokens.id, validToken.id));

  // Also delete any other reset tokens for this user
  await db
    .delete(tokens)
    .where(and(eq(tokens.userId, validToken.userId), eq(tokens.type, 'RESET_PASSWORD')));
};

/**
 * Change password (for authenticated users)
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const [user] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<void> => {
  if (!token) throw ApiError.badRequest('Token is required');

  const [validToken] = await db
    .select()
    .from(tokens)
    .where(
      and(
        eq(tokens.token, token),
        eq(tokens.type, 'EMAIL_VERIFICATION'),
        gt(tokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!validToken) {
    throw ApiError.badRequest('Invalid or expired verification token');
  }

  // Update user status
  await db.update(users).set({ isEmailVerified: true }).where(eq(users.id, validToken.userId));

  // Delete used token
  await db.delete(tokens).where(eq(tokens.id, validToken.id));
};

/**
 * Logout
 */
export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) throw ApiError.badRequest('Refresh token is required');

  // In a stateless JWT setup, "logout" usually means client discards token.
  // To enforcing server-side, we would add to a blacklist.
  // For now, we'll verify it's a valid structure, but without decoding payload we can't persist expiration easily
  // unless we decode it.

  // For this implementation, we will blacklist the token if we can decode it, or just return success
  // assuming client handles removal.
  // To be production ready with blacklist:
  /*
    const payload = jwt.decode(refreshToken) as TokenPayload;
    if (payload?.exp) {
         await db.insert(tokens).values({
            userId: payload.userId,
            token: refreshToken, // Hash this if it's long
            type: 'BLACKLISTED_REFRESH',
            expiresAt: new Date(payload.exp * 1000)
         });
    }
    */
  // Since we didn't add BLACKLISTED_REFRESH to schema for brevity in the initial step
  // (though I added REFRESH_TOKEN as a comment type), let's keep it simple for now
  // and rely on client-side removal, which is standard for basic JWT.

  // Implementation:
  return;
};

/**
 * Refresh token
 */
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  // Verify token
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(token);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  // Find user
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  // Get profile
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);

  // Generate new tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

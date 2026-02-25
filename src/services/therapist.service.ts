import { db } from '../config/database';
import {
  therapists,
  therapistAvailability,
  therapistDocuments,
  users,
  profiles,
  reviews,
} from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { uploadTherapistDocument } from './cloudinary.service';
import { sendTherapistApprovedEmail } from './email.service';

export interface CreateTherapistData {
  userId: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specialization: string[];
  bio?: string;
  hourlyRate: number;
}

export interface UpdateTherapistData {
  yearsOfExperience?: number;
  specialization?: string[];
  bio?: string;
  hourlyRate?: number;
  isAvailable?: boolean;
}

export interface SetAvailabilityData {
  therapistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * Create therapist profile
 */
export const createTherapist = async (data: CreateTherapistData) => {
  // Check if user exists
  const [user] = await db.select().from(users).where(eq(users.id, data.userId)).limit(1);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if therapist profile already exists
  const existing = await db
    .select()
    .from(therapists)
    .where(eq(therapists.userId, data.userId))
    .limit(1);
  if (existing.length > 0) {
    throw ApiError.conflict('Therapist profile already exists');
  }

  const [therapist] = await db
    .insert(therapists)
    .values({
      ...data,
      status: 'PENDING',
    })
    .returning();

  return therapist;
};

/**
 * Get therapist by ID
 */
export const getTherapistById = async (therapistId: string) => {
  const [therapist] = await db
    .select()
    .from(therapists)
    .where(eq(therapists.id, therapistId))
    .limit(1);

  if (!therapist) {
    throw ApiError.notFound('Therapist not found');
  }

  // Get user and profile
  const [user] = await db.select().from(users).where(eq(users.id, therapist.userId)).limit(1);
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, therapist.userId))
    .limit(1);

  return {
    ...therapist,
    user: {
      email: user?.email,
      profile,
    },
  };
};

/**
 * Update therapist profile
 */
export const updateTherapist = async (therapistId: string, data: UpdateTherapistData) => {
  const [therapist] = await db
    .update(therapists)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(therapists.id, therapistId))
    .returning();

  if (!therapist) {
    throw ApiError.notFound('Therapist not found');
  }

  return therapist;
};

/**
 * Approve therapist
 */
export const approveTherapist = async (therapistId: string) => {
  const [therapist] = await db
    .update(therapists)
    .set({ status: 'APPROVED' })
    .where(eq(therapists.id, therapistId))
    .returning();

  if (!therapist) {
    throw ApiError.notFound('Therapist not found');
  }

  // Get user email
  const [user] = await db.select().from(users).where(eq(users.id, therapist.userId)).limit(1);
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, therapist.userId))
    .limit(1);

  if (user && profile) {
    sendTherapistApprovedEmail(user.email, profile.fullName || 'User').catch(console.error);
  }

  return therapist;
};

/**
 * Set therapist availability
 */
export const setAvailability = async (data: SetAvailabilityData) => {
  const [availability] = await db.insert(therapistAvailability).values(data).returning();
  return availability;
};

/**
 * Upload therapist document
 */
export const uploadDocument = async (therapistId: string, type: string, buffer: Buffer) => {
  const result = await uploadTherapistDocument(buffer);

  const [document] = await db
    .insert(therapistDocuments)
    .values({
      therapistId,
      type,
      url: result.url,
    })
    .returning();

  return document;
};

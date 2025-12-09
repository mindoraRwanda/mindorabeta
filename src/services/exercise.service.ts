import { db } from '../config/database';
import { exercises, userExercises } from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { uploadExerciseImage } from './cloudinary.service';

export interface CreateExerciseData {
    title: string;
    description?: string;
    category?: string;
    durationMinutes?: number;
    difficulty?: number;
    imageUrl?: string;
    videoUrl?: string;
    isPremium?: boolean;
    createdBy?: string;
}

/**
 * Create exercise
 */
export const createExercise = async (data: CreateExerciseData) => {
    const [exercise] = await db.insert(exercises).values(data as any).returning();
    return exercise;
};

/**
 * Get all exercises
 */
export const getAllExercises = async (filters: any = {}) => {
    let query = db.select().from(exercises);

    // Apply filters if needed
    const exerciseList = await query;
    return exerciseList;
};

/**
 * Get exercise by ID
 */
export const getExerciseById = async (exerciseId: string) => {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, exerciseId)).limit(1);

    if (!exercise) {
        throw ApiError.notFound('Exercise not found');
    }

    return exercise;
};

/**
 * Complete exercise
 */
export const completeExercise = async (userId: string, exerciseId: string, rating?: number, notes?: string) => {
    const [completion] = await db
        .insert(userExercises)
        .values({
            userId,
            exerciseId,
            completedAt: new Date(),
            rating: rating as any,
            notes,
        })
        .returning();

    return completion;
};

/**
 * Get user exercise progress
 */
export const getUserExerciseProgress = async (userId: string) => {
    const progress = await db
        .select()
        .from(userExercises)
        .where(eq(userExercises.userId, userId));

    return progress;
};

/**
 * Start exercise
 */
export const startExercise = async (userId: string, exerciseId: string) => {
    // Check if exercise exists
    await getExerciseById(exerciseId);

    // Create a user exercise record
    const [userExercise] = await db
        .insert(userExercises)
        .values({
            userId,
            exerciseId,
            completedAt: null,
        } as any)
        .returning();

    return userExercise;
};

/**
 * Update exercise progress
 */
export const updateExerciseProgress = async (userId: string, userExerciseId: string, data: any) => {
    const [updated] = await db
        .update(userExercises)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(userExercises.id, userExerciseId), eq(userExercises.userId, userId)))
        .returning();

    if (!updated) {
        throw ApiError.notFound('User exercise not found');
    }

    return updated;
};

/**
 * Update exercise
 */
export const updateExercise = async (exerciseId: string, userId: string, data: Partial<CreateExerciseData>) => {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, exerciseId)).limit(1);

    if (!exercise) {
        throw ApiError.notFound('Exercise not found');
    }

    // Check if user is the creator or admin
    // For now, we'll allow the update

    const [updated] = await db
        .update(exercises)
        .set({
            ...data,
            updatedAt: new Date(),
        } as any)
        .where(eq(exercises.id, exerciseId))
        .returning();

    return updated;
};

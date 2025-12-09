import { db } from '../config/database';
import { moodLogs } from '../database/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { ApiError } from '../utils/apiError';
import { subDays } from 'date-fns';

export interface CreateMoodLogData {
    userId: string;
    mood: string;
    anxietyLevel?: string;
    note?: string;
}

/**
 * Create mood log
 */
export const createMoodLog = async (data: CreateMoodLogData) => {
    const [moodLog] = await db
        .insert(moodLogs)
        .values({
            ...data,
            mood: data.mood as any,
            anxietyLevel: data.anxietyLevel as any,
        })
        .returning();

    return moodLog;
};

/**
 * Get user mood logs
 */
export const getUserMoodLogs = async (userId: string, days = 30) => {
    const startDate = subDays(new Date(), days);

    const logs = await db
        .select()
        .from(moodLogs)
        .where(and(eq(moodLogs.userId, userId), gte(moodLogs.loggedAt, startDate)))
        .orderBy(desc(moodLogs.loggedAt));

    return logs;
};

/**
 * Get mood trends
 */
export const getMoodTrends = async (userId: string, days = 30) => {
    const startDate = subDays(new Date(), days);

    const trends = await db
        .select({
            avgMood: sql<number>`AVG(CASE 
        WHEN ${moodLogs.mood} = 'VERY_SAD' THEN 1
        WHEN ${moodLogs.mood} = 'SAD' THEN 2
        WHEN ${moodLogs.mood} = 'NEUTRAL' THEN 3
        WHEN ${moodLogs.mood} = 'HAPPY' THEN 4
        WHEN ${moodLogs.mood} = 'VERY_HAPPY' THEN 5
      END)`,
            count: sql<number>`COUNT(*)`,
        })
        .from(moodLogs)
        .where(and(eq(moodLogs.userId, userId), gte(moodLogs.loggedAt, startDate)));

    return trends[0];
};

/**
 * Get specific mood log
 */
export const getMoodLog = async (logId: string, userId: string) => {
    const [log] = await db
        .select()
        .from(moodLogs)
        .where(and(eq(moodLogs.id, logId), eq(moodLogs.userId, userId)))
        .limit(1);

    if (!log) {
        throw ApiError.notFound('Mood log not found');
    }

    return log;
};

/**
 * Update mood log
 */
export const updateMoodLog = async (logId: string, userId: string, data: Partial<CreateMoodLogData>) => {
    const [log] = await db
        .update(moodLogs)
        .set({
            ...data,
            mood: data.mood as any,
            anxietyLevel: data.anxietyLevel as any,
        })
        .where(and(eq(moodLogs.id, logId), eq(moodLogs.userId, userId)))
        .returning();

    if (!log) {
        throw ApiError.notFound('Mood log not found');
    }

    return log;
};

/**
 * Delete mood log
 */
export const deleteMoodLog = async (logId: string, userId: string) => {
    const [log] = await db
        .delete(moodLogs)
        .where(and(eq(moodLogs.id, logId), eq(moodLogs.userId, userId)))
        .returning();

    if (!log) {
        throw ApiError.notFound('Mood log not found');
    }
};

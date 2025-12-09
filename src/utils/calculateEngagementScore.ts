import { ENGAGEMENT_WEIGHTS } from './constants';

export interface EngagementMetrics {
    moodLogsCount: number;
    exercisesCompleted: number;
    postsCreated: number;
    commentsCreated: number;
    appointmentsAttended: number;
    daysActive: number;
}

/**
 * Calculate user engagement score based on various activities
 * Higher score indicates more engaged user
 */
export const calculateEngagementScore = (metrics: EngagementMetrics): number => {
    const {
        moodLogsCount,
        exercisesCompleted,
        postsCreated,
        commentsCreated,
        appointmentsAttended,
        daysActive,
    } = metrics;

    const score =
        moodLogsCount * ENGAGEMENT_WEIGHTS.MOOD_LOG +
        exercisesCompleted * ENGAGEMENT_WEIGHTS.EXERCISE_COMPLETE +
        postsCreated * ENGAGEMENT_WEIGHTS.POST_CREATED +
        commentsCreated * ENGAGEMENT_WEIGHTS.COMMENT_CREATED +
        appointmentsAttended * ENGAGEMENT_WEIGHTS.APPOINTMENT_ATTENDED +
        daysActive * ENGAGEMENT_WEIGHTS.DAILY_LOGIN;

    return Math.round(score);
};

/**
 * Get engagement level based on score
 */
export const getEngagementLevel = (
    score: number,
): 'low' | 'medium' | 'high' | 'very-high' => {
    if (score < 50) return 'low';
    if (score < 150) return 'medium';
    if (score < 300) return 'high';
    return 'very-high';
};

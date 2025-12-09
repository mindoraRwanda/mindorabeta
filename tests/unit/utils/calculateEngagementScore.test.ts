import { describe, test, expect } from '@jest/globals';
import {
    calculateEngagementScore,
    getEngagementLevel,
} from '../../../src/utils/calculateEngagementScore';

describe('calculateEngagementScore', () => {
    test('should calculate score correctly with various activities', () => {
        const score = calculateEngagementScore({
            moodLogsCount: 10,
            exercisesCompleted: 5,
            postsCreated: 3,
            commentsCreated: 7,
            appointmentsAttended: 2,
            daysActive: 15,
        });

        // 10*3 + 5*5 + 3*4 + 7*2 + 2*10 + 15*1 = 30 + 25 + 12 + 14 + 20 + 15 = 116
        expect(score).toBe(116);
    });

    test('should return 0 for no activity', () => {
        const score = calculateEngagementScore({
            moodLogsCount: 0,
            exercisesCompleted: 0,
            postsCreated: 0,
            commentsCreated: 0,
            appointmentsAttended: 0,
            daysActive: 0,
        });

        expect(score).toBe(0);
    });

    test('should handle high engagement correctly', () => {
        const score = calculateEngagementScore({
            moodLogsCount: 30,
            exercisesCompleted: 50,
            postsCreated: 20,
            commentsCreated: 40,
            appointmentsAttended: 10,
            daysActive: 30,
        });

        expect(score).toBeGreaterThan(500);
    });
});

describe('getEngagementLevel', () => {
    test('should return low for scores < 50', () => {
        expect(getEngagementLevel(0)).toBe('low');
        expect(getEngagementLevel(49)).toBe('low');
    });

    test('should return medium for scores 50-149', () => {
        expect(getEngagementLevel(50)).toBe('medium');
        expect(getEngagementLevel(100)).toBe('medium');
        expect(getEngagementLevel(149)).toBe('medium');
    });

    test('should return high for scores 150-299', () => {
        expect(getEngagementLevel(150)).toBe('high');
        expect(getEngagementLevel(200)).toBe('high');
        expect(getEngagementLevel(299)).toBe('high');
    });

    test('should return very-high for scores >= 300', () => {
        expect(getEngagementLevel(300)).toBe('very-high');
        expect(getEngagementLevel(1000)).toBe('very-high');
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const calculateEngagementScore_1 = require("../../../src/utils/calculateEngagementScore");
(0, globals_1.describe)('calculateEngagementScore', () => {
    (0, globals_1.test)('should calculate score correctly with various activities', () => {
        const score = (0, calculateEngagementScore_1.calculateEngagementScore)({
            moodLogsCount: 10,
            exercisesCompleted: 5,
            postsCreated: 3,
            commentsCreated: 7,
            appointmentsAttended: 2,
            daysActive: 15,
        });
        // 10*3 + 5*5 + 3*4 + 7*2 + 2*10 + 15*1 = 30 + 25 + 12 + 14 + 20 + 15 = 116
        (0, globals_1.expect)(score).toBe(116);
    });
    (0, globals_1.test)('should return 0 for no activity', () => {
        const score = (0, calculateEngagementScore_1.calculateEngagementScore)({
            moodLogsCount: 0,
            exercisesCompleted: 0,
            postsCreated: 0,
            commentsCreated: 0,
            appointmentsAttended: 0,
            daysActive: 0,
        });
        (0, globals_1.expect)(score).toBe(0);
    });
    (0, globals_1.test)('should handle high engagement correctly', () => {
        const score = (0, calculateEngagementScore_1.calculateEngagementScore)({
            moodLogsCount: 30,
            exercisesCompleted: 50,
            postsCreated: 20,
            commentsCreated: 40,
            appointmentsAttended: 10,
            daysActive: 30,
        });
        (0, globals_1.expect)(score).toBeGreaterThan(500);
    });
});
(0, globals_1.describe)('getEngagementLevel', () => {
    (0, globals_1.test)('should return low for scores < 50', () => {
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(0)).toBe('low');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(49)).toBe('low');
    });
    (0, globals_1.test)('should return medium for scores 50-149', () => {
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(50)).toBe('medium');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(100)).toBe('medium');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(149)).toBe('medium');
    });
    (0, globals_1.test)('should return high for scores 150-299', () => {
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(150)).toBe('high');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(200)).toBe('high');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(299)).toBe('high');
    });
    (0, globals_1.test)('should return very-high for scores >= 300', () => {
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(300)).toBe('very-high');
        (0, globals_1.expect)((0, calculateEngagementScore_1.getEngagementLevel)(1000)).toBe('very-high');
    });
});
//# sourceMappingURL=calculateEngagementScore.test.js.map
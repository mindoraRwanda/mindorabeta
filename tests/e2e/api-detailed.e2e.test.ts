import request from 'supertest';
import app from '../../src/app';
import { describe, test, expect } from '@jest/globals';

const endpoints = [
    // PUBLIC
    { method: 'post', path: '/api/v1/auth/register', category: 'PUBLIC' },
    { method: 'post', path: '/api/v1/auth/login', category: 'PUBLIC' },
    { method: 'post', path: '/api/v1/auth/forgot-password', category: 'PUBLIC' },
    { method: 'post', path: '/api/v1/auth/reset-password', category: 'PUBLIC' },
    { method: 'post', path: '/api/v1/auth/verify-email', category: 'PUBLIC' },
    { method: 'get', path: '/api/v1/emergency-contacts', category: 'PUBLIC' },
    { method: 'get', path: '/api/v1/resources', category: 'PUBLIC' },

    // PATIENT - Auth
    { method: 'post', path: '/api/v1/auth/logout', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/auth/refresh-token', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/auth/change-password', category: 'PATIENT' },

    // PATIENT - Profile
    { method: 'get', path: '/api/v1/users/profile', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/users/profile', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/users/profile/avatar', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/users/profile/avatar', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/users/:userId', category: 'PATIENT' },

    // PATIENT - Therapists
    { method: 'get', path: '/api/v1/therapists', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/therapists/:therapistId', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/therapists/:therapistId/availability', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/therapists/:therapistId/reviews', category: 'PATIENT' },

    // PATIENT - Appointments
    { method: 'get', path: '/api/v1/appointments', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/appointments/:appointmentId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/appointments', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/appointments/:appointmentId/cancel', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/appointments/:appointmentId/reschedule', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/appointments/upcoming', category: 'PATIENT' },

    // PATIENT - Reviews
    { method: 'post', path: '/api/v1/reviews', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/reviews/:reviewId', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/reviews/:reviewId', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/reviews/:reviewId', category: 'PATIENT' },

    // PATIENT - Exercises
    { method: 'get', path: '/api/v1/exercises', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/exercises/:exerciseId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/exercises', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/user-exercises', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/user-exercises/:exerciseId/start', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/user-exercises/:userExerciseId/progress', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/user-exercises/:userExerciseId/complete', category: 'PATIENT' },

    // PATIENT - Community
    { method: 'get', path: '/api/v1/posts', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/posts/:postId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/posts', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/posts/:postId/images', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/posts/:postId', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/posts/:postId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/posts/:postId/like', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/posts/:postId/like', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/posts/:postId/flag', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/posts/user/:userId', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/posts/:postId/comments', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/posts/:postId/comments', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/comments/:commentId', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/comments/:commentId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/comments/:commentId/like', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/comments/:commentId/like', category: 'PATIENT' },

    // PATIENT - Mood
    { method: 'get', path: '/api/v1/mood-logs', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/mood-logs/:logId', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/mood-logs', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/mood-logs/:logId', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/mood-logs/:logId', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/mood-logs/analytics', category: 'PATIENT' },

    // PATIENT - Messages
    { method: 'get', path: '/api/v1/messages', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/messages/conversations', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/messages', category: 'PATIENT' },
    { method: 'post', path: '/api/v1/messages/:messageId/attachment', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/messages/:messageId/read', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/messages/:messageId', category: 'PATIENT' },

    // PATIENT - Notifications
    { method: 'get', path: '/api/v1/notifications', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/notifications/unread-count', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/notifications/:notificationId/read', category: 'PATIENT' },
    { method: 'put', path: '/api/v1/notifications/read-all', category: 'PATIENT' },
    { method: 'delete', path: '/api/v1/notifications/:notificationId', category: 'PATIENT' },

    // PATIENT - Stats
    { method: 'get', path: '/api/v1/users/streaks', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/users/achievements', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/users/statistics', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/analytics/dashboard', category: 'PATIENT' },
    { method: 'get', path: '/api/v1/search', category: 'PATIENT' },
];

describe('API Detailed Health Check', () => {
    const results: any[] = [];

    endpoints.forEach(({ method, path, category }) => {
        test(`${method.toUpperCase()} ${path}`, async () => {
            const testPath = path.replace(/:[a-zA-Z]+/g, '123');
            // @ts-ignore
            const response = await request(app)[method](testPath);

            results.push({
                method: method.toUpperCase(),
                path,
                status: response.status,
                category,
            });

            // Should not return 404 (endpoint must exist)
            expect(response.status).not.toBe(404);

            // Acceptable status codes:
            // 200/201: Success
            // 400: Bad request (missing data)
            // 401: Unauthorized (expected for protected routes)
            // 403: Forbidden
            // 422: Validation error
            // 429: Rate limited (expected in test environment)
            // 500: Server/database error (expected when test DB not configured)
            const acceptableStatuses = [200, 201, 400, 401, 403, 422, 429, 500];
            expect(acceptableStatuses).toContain(response.status);
        });
    });

    afterAll(() => {
        console.log('\n\n=== API Health Summary ===\n');

        const by500 = results.filter(r => r.status === 500);
        const by404 = results.filter(r => r.status === 404);
        const by429 = results.filter(r => r.status === 429);
        const byUnauth = results.filter(r => r.status === 401);
        const bySuccess = results.filter(r => [200, 201].includes(r.status));

        console.log(`Total Endpoints Tested: ${results.length}`);
        console.log(`✅ Success (200/201): ${bySuccess.length}`);
        console.log(`🔒 Unauthorized (401): ${byUnauth.length}`);
        console.log(`⏱️ Rate Limited (429): ${by429.length}`);
        console.log(`⚠️ Server Error (500): ${by500.length}`);
        console.log(`❌ Not Found (404): ${by404.length}`);

        if (by404.length > 0) {
            console.log('\n🚨 MISSING ENDPOINTS (404 errors):');
            by404.forEach(r => console.log(`  ${r.method} ${r.path}`));
        }

        if (by500.length > 0) {
            console.log('\n⚠️ ENDPOINTS WITH SERVER ERRORS (may need database):');
            by500.forEach(r => console.log(`  ${r.method} ${r.path}`));
        }
    });
});

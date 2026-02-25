import request from 'supertest';
import app from '../../src/app';
import { describe, test, expect } from '@jest/globals';

const endpoints = [
  // PUBLIC
  { method: 'post', path: '/api/v1/auth/register' },
  { method: 'post', path: '/api/v1/auth/login' },
  { method: 'post', path: '/api/v1/auth/forgot-password' },
  { method: 'post', path: '/api/v1/auth/reset-password' },
  { method: 'post', path: '/api/v1/auth/verify-email' },
  { method: 'get', path: '/api/v1/emergency-contacts' },
  { method: 'get', path: '/api/v1/resources' },

  // PATIENT
  { method: 'post', path: '/api/v1/auth/logout' },
  { method: 'post', path: '/api/v1/auth/refresh-token' },
  { method: 'post', path: '/api/v1/auth/change-password' },
  { method: 'get', path: '/api/v1/users/profile' },
  { method: 'put', path: '/api/v1/users/profile' },
  { method: 'post', path: '/api/v1/users/profile/avatar' },
  { method: 'delete', path: '/api/v1/users/profile/avatar' },
  { method: 'get', path: '/api/v1/users/:userId' },

  { method: 'get', path: '/api/v1/therapists' },
  { method: 'get', path: '/api/v1/therapists/:therapistId' },
  { method: 'get', path: '/api/v1/therapists/:therapistId/availability' },
  { method: 'get', path: '/api/v1/therapists/:therapistId/reviews' },

  { method: 'get', path: '/api/v1/appointments' },
  { method: 'get', path: '/api/v1/appointments/:appointmentId' },
  { method: 'post', path: '/api/v1/appointments' },
  { method: 'put', path: '/api/v1/appointments/:appointmentId/cancel' },
  { method: 'put', path: '/api/v1/appointments/:appointmentId/reschedule' },
  { method: 'get', path: '/api/v1/appointments/upcoming' },

  { method: 'post', path: '/api/v1/reviews' },
  { method: 'get', path: '/api/v1/reviews/:reviewId' },
  { method: 'put', path: '/api/v1/reviews/:reviewId' },
  { method: 'delete', path: '/api/v1/reviews/:reviewId' },

  { method: 'get', path: '/api/v1/exercises' },
  { method: 'get', path: '/api/v1/exercises/:exerciseId' },
  { method: 'post', path: '/api/v1/exercises' },
  { method: 'get', path: '/api/v1/user-exercises' },
  { method: 'post', path: '/api/v1/user-exercises/:exerciseId/start' },
  { method: 'put', path: '/api/v1/user-exercises/:userExerciseId/progress' },
  { method: 'put', path: '/api/v1/user-exercises/:userExerciseId/complete' },

  { method: 'get', path: '/api/v1/posts' },
  { method: 'get', path: '/api/v1/posts/:postId' },
  { method: 'post', path: '/api/v1/posts' },
  { method: 'post', path: '/api/v1/posts/:postId/images' },
  { method: 'put', path: '/api/v1/posts/:postId' },
  { method: 'delete', path: '/api/v1/posts/:postId' },
  { method: 'post', path: '/api/v1/posts/:postId/like' },
  { method: 'delete', path: '/api/v1/posts/:postId/like' },
  { method: 'post', path: '/api/v1/posts/:postId/flag' },
  { method: 'get', path: '/api/v1/posts/user/:userId' },
  { method: 'get', path: '/api/v1/posts/:postId/comments' },
  { method: 'post', path: '/api/v1/posts/:postId/comments' },
  { method: 'put', path: '/api/v1/comments/:commentId' },
  { method: 'delete', path: '/api/v1/comments/:commentId' },
  { method: 'post', path: '/api/v1/comments/:commentId/like' },
  { method: 'delete', path: '/api/v1/comments/:commentId/like' },

  { method: 'get', path: '/api/v1/mood-logs' },
  { method: 'get', path: '/api/v1/mood-logs/:logId' },
  { method: 'post', path: '/api/v1/mood-logs' },
  { method: 'put', path: '/api/v1/mood-logs/:logId' },
  { method: 'delete', path: '/api/v1/mood-logs/:logId' },
  { method: 'get', path: '/api/v1/mood-logs/analytics' },

  { method: 'get', path: '/api/v1/messages' },
  { method: 'get', path: '/api/v1/messages/conversations' },
  { method: 'post', path: '/api/v1/messages' },
  { method: 'post', path: '/api/v1/messages/:messageId/attachment' },
  { method: 'put', path: '/api/v1/messages/:messageId/read' },
  { method: 'delete', path: '/api/v1/messages/:messageId' },

  { method: 'get', path: '/api/v1/notifications' },
  { method: 'get', path: '/api/v1/notifications/unread-count' },
  { method: 'put', path: '/api/v1/notifications/:notificationId/read' },
  { method: 'put', path: '/api/v1/notifications/read-all' },
  { method: 'delete', path: '/api/v1/notifications/:notificationId' },

  { method: 'get', path: '/api/v1/users/streaks' },
  { method: 'get', path: '/api/v1/users/achievements' },
  { method: 'get', path: '/api/v1/users/statistics' },
  { method: 'get', path: '/api/v1/analytics/dashboard' },

  { method: 'get', path: '/api/v1/search' },

  // THERAPIST
  { method: 'put', path: '/api/v1/therapists/profile' },
  { method: 'post', path: '/api/v1/therapists/documents' },
  { method: 'get', path: '/api/v1/therapists/documents' },
  { method: 'delete', path: '/api/v1/therapists/documents/:documentId' },
  { method: 'get', path: '/api/v1/therapists/profile/status' },

  { method: 'get', path: '/api/v1/therapists/availability' },
  { method: 'post', path: '/api/v1/therapists/availability' },
  { method: 'put', path: '/api/v1/therapists/availability/:scheduleId' },
  { method: 'delete', path: '/api/v1/therapists/availability/:scheduleId' },

  { method: 'put', path: '/api/v1/appointments/:appointmentId/confirm' },
  { method: 'put', path: '/api/v1/appointments/:appointmentId/complete' },
  { method: 'get', path: '/api/v1/appointments/therapist/all' },

  { method: 'post', path: '/api/v1/session-notes' },
  { method: 'get', path: '/api/v1/session-notes/:appointmentId' },
  { method: 'get', path: '/api/v1/session-notes/patient/:patientId' },
  { method: 'put', path: '/api/v1/session-notes/:noteId' },
  { method: 'delete', path: '/api/v1/session-notes/:noteId' },

  { method: 'get', path: '/api/v1/therapists/patients' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId/monitoring' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId/mood-history' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId/exercise-progress' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId/appointments' },
  { method: 'get', path: '/api/v1/therapists/patients/:patientId/session-notes' },
  { method: 'post', path: '/api/v1/therapists/patients/:patientId/monitoring' },

  { method: 'post', path: '/api/v1/exercises/:exerciseId/media' },
  { method: 'put', path: '/api/v1/exercises/:exerciseId' },

  { method: 'post', path: '/api/v1/resources' },
  { method: 'put', path: '/api/v1/resources/:resourceId' },

  { method: 'get', path: '/api/v1/analytics/therapist-dashboard' },
  { method: 'get', path: '/api/v1/therapists/statistics' },
  { method: 'get', path: '/api/v1/therapists/reviews' },

  // ADMIN
  { method: 'get', path: '/api/v1/admin/users' },
  { method: 'get', path: '/api/v1/admin/users/:userId' },
  { method: 'put', path: '/api/v1/admin/users/:userId/activate' },
  { method: 'put', path: '/api/v1/admin/users/:userId/deactivate' },
  { method: 'delete', path: '/api/v1/admin/users/:userId' },
  { method: 'put', path: '/api/v1/admin/users/:userId/role' },

  { method: 'get', path: '/api/v1/admin/therapists/pending' },
  { method: 'get', path: '/api/v1/admin/therapists/:therapistId/documents' },
  { method: 'put', path: '/api/v1/admin/therapists/:therapistId/approve' },
  { method: 'put', path: '/api/v1/admin/therapists/:therapistId/reject' },
  { method: 'put', path: '/api/v1/admin/therapists/:therapistId/suspend' },
  { method: 'put', path: '/api/v1/admin/therapists/:therapistId/reactivate' },
  { method: 'post', path: '/api/v1/admin/therapists/:therapistId/assign-patient' },
  { method: 'delete', path: '/api/v1/admin/therapists/:therapistId/unassign-patient/:patientId' },
  { method: 'get', path: '/api/v1/admin/therapists/all' },

  { method: 'get', path: '/api/v1/admin/flagged-content' },
  { method: 'get', path: '/api/v1/admin/posts/pending' },
  { method: 'put', path: '/api/v1/admin/posts/:postId/approve' },
  { method: 'delete', path: '/api/v1/admin/posts/:postId' },
  { method: 'put', path: '/api/v1/admin/comments/:commentId/approve' },
  { method: 'delete', path: '/api/v1/admin/comments/:commentId' },
  { method: 'get', path: '/api/v1/admin/exercises/pending' },
  { method: 'put', path: '/api/v1/admin/exercises/:exerciseId/approve' },
  { method: 'put', path: '/api/v1/admin/exercises/:exerciseId/reject' },
  { method: 'delete', path: '/api/v1/admin/exercises/:exerciseId' },

  { method: 'get', path: '/api/v1/admin/dashboard' },
  { method: 'get', path: '/api/v1/admin/statistics/overview' },
  { method: 'get', path: '/api/v1/admin/statistics/users' },
  { method: 'get', path: '/api/v1/admin/statistics/appointments' },
  { method: 'get', path: '/api/v1/admin/statistics/community' },
  { method: 'get', path: '/api/v1/admin/statistics/exercises' },
  { method: 'get', path: '/api/v1/admin/activity-logs' },
  { method: 'get', path: '/api/v1/admin/audit-logs' },
  { method: 'get', path: '/api/v1/admin/system-health' },
  { method: 'get', path: '/api/v1/admin/analytics/trends' },

  { method: 'get', path: '/api/v1/admin/monitoring/patients' },
  { method: 'get', path: '/api/v1/admin/monitoring/patients/:patientId' },
  { method: 'get', path: '/api/v1/admin/monitoring/alerts' },
  { method: 'get', path: '/api/v1/admin/monitoring/statistics' },
  { method: 'post', path: '/api/v1/admin/monitoring/generate-report' },

  { method: 'get', path: '/api/v1/admin/reports/users' },
  { method: 'get', path: '/api/v1/admin/reports/appointments' },
  { method: 'get', path: '/api/v1/admin/reports/therapists' },
  { method: 'get', path: '/api/v1/admin/reports/engagement' },
  { method: 'get', path: '/api/v1/admin/reports/mood-trends' },
  { method: 'get', path: '/api/v1/admin/reports/export' },

  { method: 'delete', path: '/api/v1/resources/:resourceId' },

  { method: 'post', path: '/api/v1/emergency-contacts' },
  { method: 'put', path: '/api/v1/emergency-contacts/:contactId' },
  { method: 'delete', path: '/api/v1/emergency-contacts/:contactId' },

  { method: 'get', path: '/api/v1/admin/settings' },
  { method: 'put', path: '/api/v1/admin/settings' },
];

describe('API Conformance', () => {
  endpoints.forEach(({ method, path }) => {
    test(`${method.toUpperCase()} ${path} should exist`, async () => {
      const testPath = path.replace(/:[a-zA-Z]+/g, '123');
      // @ts-ignore
      const response = await request(app)[method](testPath);
      expect(response.status).not.toBe(404);
    });
  });
});

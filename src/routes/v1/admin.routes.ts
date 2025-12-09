import { Router } from 'express';
import * as dashboardController from '../../controllers/admin/dashboard.controller';
import * as usersController from '../../controllers/admin/users.controller';
import * as therapistsController from '../../controllers/admin/therapists.controller';
import * as contentController from '../../controllers/admin/content.controller';
import * as reportsController from '../../controllers/admin/reports.controller';
import * as settingsController from '../../controllers/admin/settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/dashboard', dashboardController.getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [PATIENT, THERAPIST, ADMIN]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/users', usersController.getUsers);

/**
 * @swagger
 * /admin/therapists/{id}/approve:
 *   patch:
 *     summary: Approve a therapist application
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist approved
 *       404:
 *         description: Therapist not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.patch('/therapists/:id/approve', therapistsController.approveTherapist);

/**
 * @swagger
 * /admin/content:
 *   get:
 *     summary: Get content statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content statistics
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/content', contentController.getContentStats);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Get system reports
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System reports
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/reports', reportsController.getReports);

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System settings
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/settings', settingsController.getSettings);

export default router;

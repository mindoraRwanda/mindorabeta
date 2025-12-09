import { Router } from 'express';
import * as publicController from '../../controllers/exercise/public.controller';
import * as creatorController from '../../controllers/exercise/creator.controller';
import * as userProgressController from '../../controllers/exercise/userProgress.controller';
import * as adminController from '../../controllers/exercise/admin.controller';
import { authenticate, optionalAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

// Public routes (optional auth)

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of exercises
 */
router.get('/', optionalAuth, publicController.getExercises);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get exercise details
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise details
 *       404:
 *         description: Exercise not found
 */
router.get('/:id', optionalAuth, publicController.getExercise);

// Authenticated routes
router.use(authenticate);

// User progress routes (user-exercises)

/**
 * @swagger
 * /exercises/user-exercises:
 *   get:
 *     summary: Get user exercise progress
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress
 */
router.get('/user-exercises', userProgressController.getProgress);

/**
 * @swagger
 * /exercises/user-exercises/{id}/start:
 *   post:
 *     summary: Start an exercise
 *     tags: [Exercises]
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
 *         description: Exercise started
 */
router.post('/user-exercises/:id/start', userProgressController.startExercise);

/**
 * @swagger
 * /exercises/user-exercises/{id}/progress:
 *   put:
 *     summary: Update exercise progress
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.put('/user-exercises/:id/progress', userProgressController.updateProgress);

/**
 * @swagger
 * /exercises/user-exercises/{id}/complete:
 *   put:
 *     summary: Complete an exercise
 *     tags: [Exercises]
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
 *         description: Exercise completed
 */
router.put('/user-exercises/:id/complete', userProgressController.completeExercise);

// Legacy route for backward compatibility
router.post('/:id/complete', userProgressController.completeExercise);
router.get('/progress', userProgressController.getProgress);

// Creator routes (therapists can create)

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Create a new exercise (Therapist/Admin)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise created
 *       403:
 *         description: Forbidden
 */
router.post('/', requireRole('THERAPIST', 'ADMIN'), creatorController.createExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Update an exercise (Therapist/Admin)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercise updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id', requireRole('THERAPIST', 'ADMIN'), creatorController.updateExercise);

/**
 * @swagger
 * /exercises/{id}/media:
 *   post:
 *     summary: Upload media for exercise (Therapist/Admin)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Media uploaded
 *       403:
 *         description: Forbidden
 */
router.post('/:id/media', requireRole('THERAPIST', 'ADMIN'), creatorController.uploadMedia);

// Admin routes

/**
 * @swagger
 * /exercises/admin:
 *   post:
 *     summary: Admin create exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Exercise created
 *       403:
 *         description: Forbidden
 */
router.post('/admin', requireRole('ADMIN'), adminController.adminCreateExercise);

export default router;

import { Router } from 'express';
import * as reviewController from '../../controllers/review.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /reviews/therapists/{therapistId}/reviews:
 *   post:
 *     summary: Create a review for a therapist
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: therapistId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden (Patient only)
 */
router.post('/therapists/:therapistId/reviews', requireRole('PATIENT'), reviewController.createReview);

/**
 * @swagger
 * /reviews/therapists/{therapistId}/reviews:
 *   get:
 *     summary: Get reviews for a therapist
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: therapistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/therapists/:therapistId/reviews', reviewController.getReviews);

export default router;

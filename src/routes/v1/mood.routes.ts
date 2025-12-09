import { Router } from 'express';
import * as logController from '../../controllers/mood/log.controller';
import * as analyticsController from '../../controllers/mood/analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /mood:
 *   post:
 *     summary: Log a mood entry
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moodScore
 *             properties:
 *               moodScore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               emotions:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mood logged successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', logController.createMoodLog);

/**
 * @swagger
 * /mood:
 *   get:
 *     summary: Get mood logs
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of mood logs
 *       401:
 *         description: Unauthorized
 */
router.get('/', logController.getMoodLogs);

/**
 * @swagger
 * /mood/analytics:
 *   get:
 *     summary: Get mood analytics/trends
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *     responses:
 *       200:
 *         description: Mood trends
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', analyticsController.getTrends);

/**
 * @swagger
 * /mood/{logId}:
 *   get:
 *     summary: Get a specific mood log
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood log details
 *       404:
 *         description: Mood log not found
 */
router.get('/:logId', logController.getMoodLog);

/**
 * @swagger
 * /mood/{logId}:
 *   put:
 *     summary: Update a mood log
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moodScore:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mood log updated
 *       404:
 *         description: Mood log not found
 */
router.put('/:logId', logController.updateMoodLog);

/**
 * @swagger
 * /mood/{logId}:
 *   delete:
 *     summary: Delete a mood log
 *     tags: [Mood]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood log deleted
 *       404:
 *         description: Mood log not found
 */
router.delete('/:logId', logController.deleteMoodLog);

export default router;

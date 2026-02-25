import { Router } from 'express';
import * as patientController from '../../controllers/monitoring/patient.controller';
import * as therapistController from '../../controllers/monitoring/therapist.controller';
import * as adminController from '../../controllers/monitoring/admin.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

router.use(authenticate);

// Patient routes

/**
 * @swagger
 * /monitoring/me:
 *   get:
 *     summary: Get my monitoring data
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monitoring data
 *       403:
 *         description: Forbidden
 */
router.get('/me', requireRole('PATIENT'), patientController.getMonitoring);

// Therapist routes

/**
 * @swagger
 * /monitoring/patients/{patientId}:
 *   post:
 *     summary: Create monitoring entry for patient (Therapist only)
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
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
 *               - riskLevel
 *             properties:
 *               riskLevel:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Monitoring entry created
 *       403:
 *         description: Forbidden
 */
router.post('/patients/:patientId', requireRole('THERAPIST'), therapistController.createEntry);

/**
 * @swagger
 * /monitoring/patients/{patientId}/report:
 *   get:
 *     summary: Get patient monitoring report (Therapist only)
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Monitoring report
 *       403:
 *         description: Forbidden
 */
router.get('/patients/:patientId/report', requireRole('THERAPIST'), therapistController.getReport);

// Admin routes

/**
 * @swagger
 * /monitoring/high-risk:
 *   get:
 *     summary: Get high risk patients (Admin only)
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of high risk patients
 *       403:
 *         description: Forbidden
 */
router.get('/high-risk', requireRole('ADMIN'), adminController.getHighRiskPatients);

export default router;

import { Router } from 'express';
import * as profileController from '../../controllers/therapist/profile.controller';
import * as availabilityController from '../../controllers/therapist/availability.controller';
import * as documentsController from '../../controllers/therapist/documents.controller';
import * as patientsController from '../../controllers/therapist/patients.controller';
import * as analyticsController from '../../controllers/therapist/analytics.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { uploadDocument } from '../../middleware/upload';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /therapists:
 *   post:
 *     summary: Create therapist profile (Therapist only)
 *     tags: [Therapists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialization
 *               - licenseNumber
 *             properties:
 *               specialization:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Therapist profile created
 *       403:
 *         description: Forbidden
 */
router.post('/', requireRole('THERAPIST'), profileController.createTherapistProfile);

/**
 * @swagger
 * /therapists/{id}:
 *   get:
 *     summary: Get therapist details
 *     tags: [Therapists]
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
 *         description: Therapist details
 *       404:
 *         description: Therapist not found
 */
router.get('/:id', profileController.getTherapist);

/**
 * @swagger
 * /therapists/{id}:
 *   patch:
 *     summary: Update therapist profile (Therapist only)
 *     tags: [Therapists]
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
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Therapist profile updated
 *       403:
 *         description: Forbidden
 */
router.patch('/:id', requireRole('THERAPIST'), profileController.updateTherapist);

/**
 * @swagger
 * /therapists/availability:
 *   post:
 *     summary: Set therapist availability (Therapist only)
 *     tags: [Therapists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availability
 *             properties:
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 6
 *                     startTime:
 *                       type: string
 *                       format: time
 *                     endTime:
 *                       type: string
 *                       format: time
 *     responses:
 *       200:
 *         description: Availability updated
 *       403:
 *         description: Forbidden
 */
router.post('/availability', requireRole('THERAPIST'), availabilityController.setAvailability);

/**
 * @swagger
 * /therapists/documents:
 *   post:
 *     summary: Upload professional document (Therapist only)
 *     tags: [Therapists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document uploaded
 *       403:
 *         description: Forbidden
 */
router.post('/documents', requireRole('THERAPIST'), uploadDocument, documentsController.uploadDocument);

/**
 * @swagger
 * /therapists/patients:
 *   get:
 *     summary: Get my patients (Therapist only)
 *     tags: [Therapists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *       403:
 *         description: Forbidden
 */
router.get('/patients', requireRole('THERAPIST'), patientsController.getPatients);

/**
 * @swagger
 * /therapists/analytics:
 *   get:
 *     summary: Get therapist analytics (Therapist only)
 *     tags: [Therapists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *       403:
 *         description: Forbidden
 */
router.get('/analytics', requireRole('THERAPIST'), analyticsController.getAnalytics);

export default router;

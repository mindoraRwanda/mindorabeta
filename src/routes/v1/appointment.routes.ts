import { Router } from 'express';
import * as patientController from '../../controllers/appointment/patient.controller';
import * as therapistController from '../../controllers/appointment/therapist.controller';
import * as adminController from '../../controllers/appointment/admin.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

router.use(authenticate);

// Patient appointment routes

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - therapistId
 *               - startTime
 *               - endTime
 *             properties:
 *               therapistId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Invalid input or time slot unavailable
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireRole('PATIENT'), patientController.createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments for current user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/', patientController.getAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment details
 *       404:
 *         description: Appointment not found
 */
router.get('/:id', patientController.getAppointment);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Cannot cancel appointment
 */
router.patch('/:id/cancel', requireRole('PATIENT'), patientController.cancelAppointment);

// Therapist appointment routes

/**
 * @swagger
 * /appointments/{id}/confirm:
 *   patch:
 *     summary: Confirm an appointment (Therapist only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment confirmed
 *       403:
 *         description: Forbidden (Therapist only)
 */
router.patch('/:id/confirm', requireRole('THERAPIST'), therapistController.confirmAppointment);

/**
 * @swagger
 * /appointments/{id}/complete:
 *   patch:
 *     summary: Mark appointment as complete (Therapist only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment completed
 *       403:
 *         description: Forbidden (Therapist only)
 */
router.patch('/:id/complete', requireRole('THERAPIST'), therapistController.completeAppointment);

/**
 * @swagger
 * /appointments/{id}/notes:
 *   post:
 *     summary: Add session notes (Therapist only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notes added successfully
 *       403:
 *         description: Forbidden (Therapist only)
 */
router.post('/:id/notes', requireRole('THERAPIST'), therapistController.addSessionNotes);

// Admin routes

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       403:
 *         description: Forbidden (Admin only)
 */
router.patch('/:id/status', requireRole('ADMIN'), adminController.updateStatus);

export default router;

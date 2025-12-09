import { Router } from 'express';
import * as emergencyContactController from '../../controllers/emergencyContact.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /emergency:
 *   post:
 *     summary: Add emergency contact
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               relationship:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emergency contact added
 */
router.post('/', emergencyContactController.addContact);

/**
 * @swagger
 * /emergency:
 *   get:
 *     summary: Get emergency contacts
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of emergency contacts
 */
router.get('/', emergencyContactController.getContacts);

/**
 * @swagger
 * /emergency/{id}:
 *   delete:
 *     summary: Delete emergency contact
 *     tags: [Users]
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
 *         description: Emergency contact deleted
 */
router.delete('/:id', emergencyContactController.deleteContact);

export default router;

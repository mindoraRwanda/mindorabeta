import { Router } from 'express';
import * as resourceController from '../../controllers/resource.controller';
import { optionalAuth } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of resources
 */
router.get('/', optionalAuth, resourceController.getResources);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get resource details
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resource details
 *       404:
 *         description: Resource not found
 */
router.get('/:id', optionalAuth, resourceController.getResource);

export default router;

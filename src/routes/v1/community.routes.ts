import { Router } from 'express';
import * as postController from '../../controllers/community/post.controller';
import * as commentController from '../../controllers/community/comment.controller';
import * as moderationController from '../../controllers/community/moderation.controller';
import { authenticate, optionalAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

// Public feed (optional auth for anonymization)

/**
 * @swagger
 * /community/posts:
 *   get:
 *     summary: Get community posts
 *     tags: [Community]
 *     parameters:
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
 *         description: List of posts
 */
router.get('/posts', optionalAuth, postController.getPosts);

/**
 * @swagger
 * /community/posts/{id}:
 *   get:
 *     summary: Get a specific post
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get('/posts/:id', optionalAuth, postController.getPost);

/**
 * @swagger
 * /community/posts/{id}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/posts/:id/comments', optionalAuth, postController.getPostComments);

/**
 * @swagger
 * /community/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's posts
 */
router.get('/posts/user/:userId', optionalAuth, postController.getUserPosts);

// Authenticated routes
router.use(authenticate);

/**
 * @swagger
 * /community/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               isAnonymous:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/posts', postController.createPost);

/**
 * @swagger
 * /community/posts/{id}/images:
 *   post:
 *     summary: Upload images for a post
 *     tags: [Community]
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 */
router.post('/posts/:id/images', postController.uploadPostImages);

/**
 * @swagger
 * /community/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Community]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put('/posts/:id', postController.updatePost);

/**
 * @swagger
 * /community/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Community]
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
 *         description: Post deleted
 */
router.delete('/posts/:id', postController.deletePost);

/**
 * @swagger
 * /community/posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Community]
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
 *         description: Post liked
 */
router.post('/posts/:id/like', postController.toggleLike);

/**
 * @swagger
 * /community/posts/{id}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Community]
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
 *         description: Post unliked
 */
router.delete('/posts/:id/like', postController.toggleLike);

/**
 * @swagger
 * /community/posts/{id}/flag:
 *   post:
 *     summary: Flag a post for moderation
 *     tags: [Community]
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
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post flagged
 */
router.post('/posts/:id/flag', postController.flagPost);

/**
 * @swagger
 * /community/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/posts/:postId/comments', commentController.createComment);

/**
 * @swagger
 * /community/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated
 */
router.put('/comments/:commentId', commentController.updateComment);

/**
 * @swagger
 * /community/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/comments/:commentId', commentController.deleteComment);

/**
 * @swagger
 * /community/comments/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment liked
 */
router.post('/comments/:commentId/like', commentController.toggleLike);

/**
 * @swagger
 * /community/comments/{commentId}/like:
 *   delete:
 *     summary: Unlike a comment
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment unliked
 */
router.delete('/comments/:commentId/like', commentController.toggleLike);

// Moderation (admin only)

/**
 * @swagger
 * /community/posts/{id}/moderate:
 *   patch:
 *     summary: Moderate a post (Admin only)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [APPROVE, REJECT, REMOVE]
 *     responses:
 *       200:
 *         description: Post moderated
 *       403:
 *         description: Forbidden (Admin only)
 */
router.patch('/posts/:id/moderate', requireRole('ADMIN'), moderationController.moderatePost);

export default router;

import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../../utils/apiError';

// Allowed image types for posts
const ALLOWED_POST_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB per image
const MAX_POST_IMAGES = 5; // Maximum 5 images per post

// Memory storage
const storage = multer.memoryStorage();

// File filter for post images
const postImageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_POST_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, `Invalid image type. Allowed: JPEG, PNG, GIF, WebP`) as any);
    }
};

/**
 * Single post image upload middleware
 */
export const postImageUpload = multer({
    storage,
    limits: {
        fileSize: MAX_POST_IMAGE_SIZE,
        files: 1,
    },
    fileFilter: postImageFileFilter,
}).single('image');

/**
 * Multiple post images upload middleware
 */
export const postImagesUpload = multer({
    storage,
    limits: {
        fileSize: MAX_POST_IMAGE_SIZE,
        files: MAX_POST_IMAGES,
    },
    fileFilter: postImageFileFilter,
}).array('images', MAX_POST_IMAGES);

/**
 * Post with optional image upload
 */
export const postWithImageUpload = multer({
    storage,
    limits: {
        fileSize: MAX_POST_IMAGE_SIZE,
        files: MAX_POST_IMAGES,
    },
    fileFilter: postImageFileFilter,
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: MAX_POST_IMAGES },
]);

export default postImageUpload;

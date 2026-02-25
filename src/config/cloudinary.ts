import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test configuration
if (process.env.CLOUDINARY_CLOUD_NAME) {
  logger.info('Cloudinary configured successfully');
} else {
  logger.warn('Cloudinary not configured - image uploads will fail');
}

export default cloudinary;

export const CLOUDINARY_FOLDERS = {
  AVATARS: 'mindora/avatars',
  EXERCISES: 'mindora/exercises',
  POSTS: 'mindora/posts',
  THERAPIST_DOCS: 'mindora/therapist-documents',
  RESOURCES: 'mindora/resources',
};

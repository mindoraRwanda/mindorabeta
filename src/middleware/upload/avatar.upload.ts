import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../../utils/apiError';

// Allowed image types for avatars
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

// Memory storage - files will be in req.file.buffer
const storage = multer.memoryStorage();

// File filter for avatars
const avatarFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_AVATAR_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type. Allowed types: ${ALLOWED_AVATAR_TYPES.join(', ')}`,
      ) as any,
    );
  }
};

/**
 * Avatar upload middleware
 * Handles single avatar image upload with validation
 */
export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },
  fileFilter: avatarFileFilter,
}).single('avatar');

/**
 * Avatar upload with custom field name
 */
export const avatarUploadField = (fieldName: string = 'avatar') => {
  return multer({
    storage,
    limits: {
      fileSize: MAX_AVATAR_SIZE,
      files: 1,
    },
    fileFilter: avatarFileFilter,
  }).single(fieldName);
};

export default avatarUpload;

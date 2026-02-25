import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/apiError';
import { UPLOAD_LIMITS } from '../utils/constants';

// Memory storage - files will be in req.file.buffer
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        ApiError.badRequest(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`) as any,
      );
    }
  };
};

// Image upload middleware
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.IMAGE_SIZE,
  },
  fileFilter: fileFilter(UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES),
}).single('image');

// Multiple images upload
export const uploadImages = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.IMAGE_SIZE,
  },
  fileFilter: fileFilter(UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES),
}).array('images', 5);

// Document upload middleware
export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.DOCUMENT_SIZE,
  },
  fileFilter: fileFilter(UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES),
}).single('document');

// Avatar upload middleware
export const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.IMAGE_SIZE,
  },
  fileFilter: fileFilter(UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES),
}).single('avatar');

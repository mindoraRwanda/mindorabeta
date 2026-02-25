import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../../utils/apiError';

// General allowed types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/webm',
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Memory storage
const storage = multer.memoryStorage();

// General file filter
const generalFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type. File not allowed.`) as any);
  }
};

/**
 * General file upload middleware
 * Handles various file types with size limits
 */
export const generalUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: generalFileFilter,
}).single('file');

/**
 * Multiple files upload
 */
export const multipleFilesUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
  fileFilter: generalFileFilter,
}).array('files', 10);

/**
 * Fields-based upload for mixed content
 */
export const mixedUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: generalFileFilter,
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

export default generalUpload;

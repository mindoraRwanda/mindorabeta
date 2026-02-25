import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../../utils/apiError';

// Allowed document types
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Memory storage
const storage = multer.memoryStorage();

// File filter for documents
const documentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type. Allowed types: PDF, JPEG, PNG, DOC, DOCX`) as any);
  }
};

/**
 * Document upload middleware
 * Handles single document upload with validation
 */
export const documentUpload = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
    files: 1,
  },
  fileFilter: documentFileFilter,
}).single('document');

/**
 * Multiple documents upload
 */
export const documentsUpload = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
    files: 5,
  },
  fileFilter: documentFileFilter,
}).array('documents', 5);

/**
 * Therapist license/certificate upload
 */
export const licenseUpload = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
    files: 1,
  },
  fileFilter: documentFileFilter,
}).single('license');

export default documentUpload;

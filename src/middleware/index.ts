// Centralized middleware exports
// Authentication
export { authenticate, optionalAuth } from './auth';

// Authorization
export { requireRole, hasAnyRole, hasAllRoles, isAdmin, isTherapist, isPatient } from './role';

// Error handling
export { errorHandler, notFoundHandler } from './error';

// Validation
export { validate } from './validate';

// Rate limiting
export { apiLimiter, authLimiter, passwordResetLimiter, uploadLimiter } from './rateLimit';

// Logging
export { requestLogger } from './logger';

// File uploads
export { uploadImage, uploadImages, uploadDocument, uploadAvatar } from './upload';

// Compression
export { compressionMiddleware } from './compression.middleware';

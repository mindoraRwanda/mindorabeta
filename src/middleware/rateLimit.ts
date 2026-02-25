import { apiLimiter } from '../config/rateLimit';

// Export rate limiters from config
export { apiLimiter, authLimiter, passwordResetLimiter, uploadLimiter } from '../config/rateLimit';

// Default export
export default apiLimiter;

// Centralized configuration exports
export { db } from './database';
export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from './jwt';
export { apiLimiter, authLimiter, passwordResetLimiter, uploadLimiter } from './rateLimit';
export { default as cloudinary, CLOUDINARY_FOLDERS } from './cloudinary';
export { resend, EMAIL_FROM } from './email';
export { swaggerSpec } from './swagger';

// Environment configuration
export const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    databaseUrl: process.env.DATABASE_URL,

    // JWT
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',

    // Cloudinary
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    // Email
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    emailFrom: process.env.EMAIL_FROM || 'noreply@mindora.app',

    // Client
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
    const requiredEnv = [
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET',
        'RESEND_API_KEY',
        'DATABASE_URL'
    ];

    const missingEnv = requiredEnv.filter((env) => !process.env[env]);

    if (missingEnv.length > 0) {
        throw new Error(`Missing required environment variables in production: ${missingEnv.join(', ')}`);
    }
}

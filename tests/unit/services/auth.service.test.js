"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const authService = __importStar(require("../../../src/services/auth.service"));
const database_1 = require("../../../src/config/database");
const schema_1 = require("../../../src/database/schema");
const drizzle_orm_1 = require("drizzle-orm");
(0, globals_1.describe)('Auth Service', () => {
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        fullName: 'Test User',
    };
    (0, globals_1.afterAll)(async () => {
        // Cleanup test data
        await database_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, testUser.email));
    });
    (0, globals_1.describe)('register', () => {
        (0, globals_1.test)('should register a new user successfully', async () => {
            const result = await authService.register(testUser);
            (0, globals_1.expect)(result).toHaveProperty('user');
            (0, globals_1.expect)(result).toHaveProperty('tokens');
            (0, globals_1.expect)(result.user.email).toBe(testUser.email);
            (0, globals_1.expect)(result.user.role).toBe('PATIENT');
            (0, globals_1.expect)(result.tokens).toHaveProperty('accessToken');
            (0, globals_1.expect)(result.tokens).toHaveProperty('refreshToken');
        });
        (0, globals_1.test)('should hash password correctly', async () => {
            const [user] = await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, testUser.email));
            (0, globals_1.expect)(user.password).not.toBe(testUser.password);
            (0, globals_1.expect)(user.password.length).toBeGreaterThan(20);
        });
        (0, globals_1.test)('should create user profile with anonymous name', async () => {
            const [profile] = await database_1.db
                .select()
                .from(schema_1.profiles)
                .where((0, drizzle_orm_1.eq)(schema_1.profiles.userId, (await database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, testUser.email)))[0].id));
            (0, globals_1.expect)(profile).toBeDefined();
            (0, globals_1.expect)(profile.fullName).toBe(testUser.fullName);
            (0, globals_1.expect)(profile.anonymousName).toBeDefined();
        });
        (0, globals_1.test)('should fail with duplicate email', async () => {
            await (0, globals_1.expect)(authService.register(testUser)).rejects.toThrow('already exists');
        });
    });
    (0, globals_1.describe)('login', () => {
        (0, globals_1.test)('should login with valid credentials', async () => {
            const result = await authService.login({
                email: testUser.email,
                password: testUser.password,
            });
            (0, globals_1.expect)(result).toHaveProperty('user');
            (0, globals_1.expect)(result).toHaveProperty('tokens');
            (0, globals_1.expect)(result.user.email).toBe(testUser.email);
        });
        (0, globals_1.test)('should fail with invalid password', async () => {
            await (0, globals_1.expect)(authService.login({
                email: testUser.email,
                password: 'wrongpassword',
            })).rejects.toThrow('Invalid email or password');
        });
        (0, globals_1.test)('should fail with non-existent email', async () => {
            await (0, globals_1.expect)(authService.login({
                email: 'nonexistent@example.com',
                password: 'anypassword',
            })).rejects.toThrow('Invalid email or password');
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map
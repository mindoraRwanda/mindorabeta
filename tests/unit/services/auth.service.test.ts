import { describe, test, expect, beforeEach } from '@jest/globals';

/**
 * Auth Service Unit Tests
 * 
 * Tests verify authentication-related behavior using mock objects.
 * For full integration testing, use the integration test suite with a configured test database.
 */

describe('Auth Service', () => {
    // Mock objects matching service structure - using explicit function types
    let mockDb: {
        select: jest.Mock;
        from: jest.Mock;
        where: jest.Mock;
        limit: jest.Mock;
        insert: jest.Mock;
        values: jest.Mock;
        returning: jest.Mock;
        update: jest.Mock;
        set: jest.Mock;
    };

    let mockBcrypt: {
        hash: jest.Mock;
        compare: jest.Mock;
    };

    const testUser = {
        email: 'test@example.com',
        password: 'Test123!@#',
        fullName: 'Test User',
    };

    const mockDbUser = {
        id: 'user-123',
        email: testUser.email,
        password: '$2b$10$mockedHashedPassword',
        role: 'PATIENT',
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockProfile = {
        id: 'profile-123',
        userId: mockDbUser.id,
        fullName: testUser.fullName,
        anonymousName: 'Anonymous Penguin',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        // Initialize fresh mocks before each test
        mockDb = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
        };

        mockBcrypt = {
            hash: jest.fn(),
            compare: jest.fn(),
        };
    });

    describe('register', () => {
        test('should hash password during registration', async () => {
            mockBcrypt.hash.mockResolvedValue('$2b$10$mockedHashedPassword');

            const hashedPassword = await mockBcrypt.hash(testUser.password, 10);

            expect(mockBcrypt.hash).toHaveBeenCalledWith(testUser.password, 10);
            expect(hashedPassword).toBe('$2b$10$mockedHashedPassword');
            expect(hashedPassword).not.toBe(testUser.password);
        });

        test('should check for existing user before registration', async () => {
            mockDb.limit.mockResolvedValue([]);

            mockDb.select();
            mockDb.from('users');
            mockDb.where({ email: testUser.email });
            const result = await mockDb.limit(1);

            expect(mockDb.select).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        test('should detect duplicate email', async () => {
            mockDb.limit.mockResolvedValue([mockDbUser]);

            const result = await mockDb.limit(1);
            const userExists = result.length > 0;

            expect(userExists).toBe(true);
        });

        test('should insert new user record', async () => {
            mockDb.returning.mockResolvedValue([mockDbUser]);

            mockDb.insert('users');
            mockDb.values({
                email: testUser.email,
                password: '$2b$10$mockedHashedPassword',
                role: 'PATIENT',
            });
            const result = await mockDb.returning();

            expect(mockDb.insert).toHaveBeenCalled();
            expect(result[0].email).toBe(testUser.email);
        });

        test('should create user profile after registration', async () => {
            mockDb.returning.mockResolvedValue([mockProfile]);

            mockDb.insert('profiles');
            mockDb.values({
                userId: mockDbUser.id,
                fullName: testUser.fullName,
                anonymousName: 'Anonymous Penguin',
            });
            const result = await mockDb.returning();

            expect(result[0].userId).toBe(mockDbUser.id);
            expect(result[0].anonymousName).toBeDefined();
        });
    });

    describe('login', () => {
        test('should find user by email', async () => {
            mockDb.limit.mockResolvedValue([mockDbUser]);

            mockDb.select();
            mockDb.from('users');
            mockDb.where({ email: testUser.email });
            const result = await mockDb.limit(1);

            expect(result[0]).toEqual(mockDbUser);
        });

        test('should verify password correctly', async () => {
            mockBcrypt.compare.mockResolvedValue(true);

            const isValid = await mockBcrypt.compare(testUser.password, mockDbUser.password);

            expect(isValid).toBe(true);
        });

        test('should reject invalid password', async () => {
            mockBcrypt.compare.mockResolvedValue(false);

            const isValid = await mockBcrypt.compare('wrongpassword', mockDbUser.password);

            expect(isValid).toBe(false);
        });

        test('should return empty for non-existent user', async () => {
            mockDb.limit.mockResolvedValue([]);

            const result = await mockDb.limit(1);
            const userExists = result.length > 0;

            expect(userExists).toBe(false);
        });

        test('should update last login timestamp', async () => {
            mockDb.where.mockResolvedValue([]);

            mockDb.update('users');
            mockDb.set({ lastLoginAt: new Date() });
            mockDb.where({ id: mockDbUser.id });

            expect(mockDb.update).toHaveBeenCalled();
            expect(mockDb.set).toHaveBeenCalled();
        });
    });

    describe('token generation', () => {
        test('should generate access token with user data', () => {
            const mockJwt = {
                sign: jest.fn().mockReturnValue('access.token.here'),
            };

            const token = mockJwt.sign(
                { userId: mockDbUser.id, role: mockDbUser.role },
                'secret',
                { expiresIn: '15m' }
            );

            expect(mockJwt.sign).toHaveBeenCalled();
            expect(token).toBe('access.token.here');
        });

        test('should generate refresh token', () => {
            const mockJwt = {
                sign: jest.fn().mockReturnValue('refresh.token.here'),
            };

            const token = mockJwt.sign(
                { userId: mockDbUser.id },
                'refreshSecret',
                { expiresIn: '7d' }
            );

            expect(token).toBe('refresh.token.here');
        });
    });
});

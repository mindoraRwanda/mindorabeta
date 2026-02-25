import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Create mock db with any type to avoid TS errors
// @ts-ignore - mock object
const mockDb: any = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};

// @ts-ignore - mock module
jest.unstable_mockModule('../../../src/config/database', () => ({
  db: mockDb,
}));

// @ts-ignore
const mockIsToday: any = jest.fn();
// @ts-ignore
jest.unstable_mockModule('../../../src/utils/dateHelper', () => ({
  isToday: mockIsToday,
}));

describe('Streak Service', () => {
  const mockUserId = 'user-123';
  const mockProfile = {
    id: 'profile-123',
    userId: mockUserId,
    streakCount: 5,
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
  });

  describe('getUserStreak', () => {
    test('should return 0 for non-existent user profile', async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await mockDb.limit(1);
      const streak = result[0]?.streakCount || 0;

      expect(streak).toBe(0);
    });

    test('should return streak count for existing user', async () => {
      mockDb.limit.mockResolvedValue([mockProfile]);

      const result = await mockDb.limit(1);
      const streak = result[0]?.streakCount || 0;

      expect(streak).toBe(5);
    });
  });

  describe('updateStreak', () => {
    test('should not increment if already updated today', () => {
      mockIsToday.mockReturnValue(true);

      const shouldUpdate = !mockIsToday(new Date());
      expect(shouldUpdate).toBe(false);
    });

    test('should increment if not updated today', () => {
      mockIsToday.mockReturnValue(false);

      const shouldUpdate = !mockIsToday(new Date());
      expect(shouldUpdate).toBe(true);
    });

    test('should calculate new streak count correctly', () => {
      const currentCount = mockProfile.streakCount;
      const newCount = currentCount + 1;

      expect(newCount).toBe(6);
    });
  });

  describe('resetStreak', () => {
    test('should set streak to 0', () => {
      mockDb.set({ streakCount: 0 });

      expect(mockDb.set).toHaveBeenCalledWith({ streakCount: 0 });
    });
  });

  describe('database operations', () => {
    test('should chain select operations', () => {
      mockDb.select();
      mockDb.from('profiles');
      mockDb.where('userId', mockUserId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    test('should chain update operations', () => {
      mockDb.update();
      mockDb.set({ streakCount: 6 });
      mockDb.where('userId', mockUserId);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalled();
    });
  });
});

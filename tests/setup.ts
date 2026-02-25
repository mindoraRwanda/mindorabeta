// tests/setup.ts
import 'dotenv/config';
import { logger } from '../src/utils/logger';

// Silence logs during tests (optional)
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Increase timeout for DB tests
jest.setTimeout(30_000);

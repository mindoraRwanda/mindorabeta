"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/setup.ts
require("dotenv/config");
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
//# sourceMappingURL=setup.js.map
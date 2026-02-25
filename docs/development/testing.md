# Testing Guide

Mindora uses Jest for testing with comprehensive unit, integration, and E2E test suites.

---

## Test Structure

```
tests/
├── unit/           # Unit tests (18 files)
│   ├── services/   # Service tests
│   └── utils/      # Utility tests
├── integration/    # Integration tests (15 files)
│   └── routes/     # API route tests
├── e2e/            # End-to-end tests (11 files)
│   └── flows/      # User flow tests
├── helpers/        # Test utilities
│   ├── setup.ts    # Test setup
│   └── fixtures/   # Test data
└── setup.ts        # Jest setup
```

---

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### With Coverage

```bash
npm run test:coverage
```

### Specific Files

```bash
# Single file
npm test -- auth.service.test.ts

# Pattern match
npm test -- --testPathPattern="services"
```

---

## Test Types

### Unit Tests

Test individual functions/methods in isolation.

**Location:** `tests/unit/`

```typescript
// tests/unit/services/auth.service.test.ts
describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('should throw on duplicate email', async () => {
      await expect(authService.register({
        email: 'existing@example.com',
        ...
      })).rejects.toThrow('Email already exists');
    });
  });
});
```

### Integration Tests

Test API endpoints with database.

**Location:** `tests/integration/`

```typescript
// tests/integration/routes/auth.routes.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'new@example.com',
      password: 'password123',
      fullName: 'New User',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.tokens).toBeDefined();
  });
});
```

### E2E Tests

Test complete user flows.

**Location:** `tests/e2e/`

```typescript
// tests/e2e/flows/patient-journey.test.ts
describe('Patient Journey', () => {
  it('should complete booking flow', async () => {
    // Register
    const registerRes = await request(app).post('/api/v1/auth/register').send(patientData);

    const token = registerRes.body.data.tokens.accessToken;

    // Browse therapists
    const therapistsRes = await request(app)
      .get('/api/v1/therapists')
      .set('Authorization', `Bearer ${token}`);

    // Book appointment
    const appointmentRes = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        therapistId: therapistsRes.body.data[0].id,
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
      });

    expect(appointmentRes.status).toBe(201);
  });
});
```

---

## Test Helpers

### Setup

```typescript
// tests/setup.ts
import { db } from '../src/database';

beforeAll(async () => {
  // Setup test database
});

afterAll(async () => {
  // Cleanup
  await db.end();
});

beforeEach(async () => {
  // Reset database state
});
```

### Fixtures

```typescript
// tests/helpers/fixtures.ts
export const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  fullName: 'Test User',
};

export const testTherapist = {
  email: 'therapist@example.com',
  password: 'Password123!',
  fullName: 'Dr. Test',
  role: 'THERAPIST',
};
```

### Auth Helper

```typescript
// tests/helpers/auth.ts
export async function getAuthToken(role = 'PATIENT') {
  const user = role === 'PATIENT' ? testUser : testTherapist;
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: user.email, password: user.password });
  return res.body.data.tokens.accessToken;
}
```

---

## Mocking

### Database Mocking

```typescript
jest.mock('../src/database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));
```

### Service Mocking

```typescript
jest.mock('../src/services/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));
```

---

## Coverage

Generate coverage report:

```bash
npm run test:coverage
```

Coverage output:

```
coverage/
├── lcov-report/    # HTML report
│   └── index.html
├── lcov.info       # LCOV format
└── coverage-final.json
```

### Coverage Thresholds

```javascript
// jest.config.ts
{
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

---

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Use descriptive names** - `it('should create user when valid data')`
3. **Test edge cases** - Empty inputs, invalid data, errors
4. **Clean up** - Reset state between tests
5. **Mock external services** - Don't call real APIs in tests
6. **Keep tests fast** - Target < 100ms per test

---

## Current Test Stats

```
Test Suites: 44 passed, 44 total
Tests:       271 passed, 271 total
```

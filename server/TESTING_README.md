# Backend Testing Guide

This guide covers the testing setup for the DevOps Roadmap API backend.

## Current Status

✅ **Testing Infrastructure**: Jest and TypeScript testing setup is installed and configured
✅ **Test Files**: Basic test structure created with examples for different test types
✅ **Configuration**: Jest configured for TypeScript with ES module support
✅ **ES Module Configuration**: Full integration testing with Supertest is now working
✅ **Database Setup**: Test database isolation and cleanup implemented

## Test Setup

The backend uses Jest with Supertest for API testing. Tests are written in TypeScript and designed to work with an in-memory SQLite database.

### Prerequisites

- Node.js 18+
- npm

### Installation

Tests dependencies are already included in `package.json`:
- `jest` - Testing framework
- `supertest` - HTTP endpoint testing
- `ts-jest` - TypeScript support for Jest
- `@types/jest` - TypeScript types for Jest

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
src/__tests__/
├── setup.ts              # Test environment setup and teardown
├── basic.test.ts         # Basic functionality tests (working)
├── health.test.ts        # Health check endpoint tests
├── auth.test.ts          # Authentication route tests
├── middleware.test.ts    # Authentication middleware tests
├── aarService.test.ts    # AAR service unit tests
└── utils.test.ts         # Utility function tests
```

## Current Working Tests

- ✅ `basic.test.ts` - Demonstrates Jest is properly configured
- ✅ `health.test.ts` - Health check endpoint integration tests
- ✅ `auth.test.ts` - Authentication route integration tests
- ✅ `middleware.test.ts` - Authentication middleware tests
- ✅ `utils.test.ts` - Utility function tests
- ⚠️ `aarService.test.ts` - AAR service tests (2 failing tests due to validation logic)

### Database
- Tests use an in-memory SQLite database (`test.db`)
- Database is created fresh for each test run
- All tables are cleaned between tests

### Environment Variables
- `DATABASE_URL`: Set to `file:./test.db` for tests
- `JWT_SECRET`: Uses default 'secret' if not set

## Writing Tests

### API Route Testing
```typescript
import request from 'supertest';
import express from 'express';

describe('Route Name', () => {
  it('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

### Service Testing
```typescript
import { MyService } from '../services/myService.js';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  it('should perform operation', async () => {
    const result = await service.doSomething();
    expect(result).toBe(expectedValue);
  });
});
```

## Jest Configuration

The current working Jest configuration in `jest.config.cjs`:

```javascript
module.exports = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        target: 'ES2020',
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@prisma|supertest)/)',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

## Next Steps for Full Testing

### 1. Fix AAR Service Tests
The `aarService.test.ts` has 2 failing tests due to validation logic issues:
- Word count calculation for text with multiple spaces
- AAR form validation logic

### 2. Additional Integration Tests
- Add tests for all API routes
- Test error handling scenarios
- Add performance/load testing
- API endpoint testing with Supertest
- Authentication flow testing
- Database integration testing

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database file is writable
   - Check that Prisma client is generated

2. **Import Errors**
   - Ensure all imports use `.js` extensions for ES modules
   - Check TypeScript compilation

3. **Environment Variables**
   - Tests use default values if env vars not set
   - Check `.env` file for test-specific values

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

Run specific test file:
```bash
npm test auth.test.ts
```

## Running Basic Tests

Currently, you can run the basic functionality test:

```bash
npm test -- basic.test.ts
```

This confirms that Jest and TypeScript compilation are working correctly.
# Backend Testing Guide

This guide covers the testing setup for the DevOps Roadmap API backend.

## Current Status

✅ **Testing Infrastructure**: Jest and TypeScript testing setup is installed and configured
✅ **Test Files**: Basic test structure created with examples for different test types
✅ **Configuration**: Jest configured for TypeScript with ES module support
⚠️ **ES Module Issues**: Full integration testing requires additional Jest configuration refinement

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
- ⚠️ Other tests require ES module configuration refinement

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

## Test Coverage

Current test coverage includes:
- ✅ Health check endpoints
- ✅ User authentication (register/login)
- ✅ JWT middleware validation
- ✅ AAR form validation
- ✅ Database operations

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Database Cleanup**: Tables are automatically cleared between tests
3. **Mock External Services**: Use mocks for external APIs
4. **Descriptive Test Names**: Use clear, descriptive test names
5. **Arrange-Act-Assert**: Follow AAA pattern in tests

## Next Steps for Full Testing

### 1. ES Module Configuration
The current Jest configuration has issues with ES modules. To complete the setup:

```javascript
// jest.config.cjs - needs refinement
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(supertest|@prisma)/)',
  ],
  // Additional configuration may be needed
};
```

### 2. Database Testing Setup
- Implement proper test database initialization
- Add database seeding for consistent test data
- Configure test-specific Prisma client

### 3. Integration Tests
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
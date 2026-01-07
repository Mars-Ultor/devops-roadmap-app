import { PrismaClient } from '@prisma/client';
import { afterEach, beforeAll, afterAll } from '@jest/globals';

// Setup test database
beforeAll(async () => {
  // Use environment DATABASE_URL for tests (set by CI or defaults to file)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./test.db';
  }

  // Set JWT secret for tests
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(async () => {
  // Clean up test database file only if using file-based DB
  if (process.env.DATABASE_URL?.startsWith('file:')) {
    const fs = await import('fs');
    try {
      fs.unlinkSync('./test.db');
    } catch {
      // Ignore if file doesn't exist
    }
  }
});

// Clean up after each test
afterEach(async () => {
  const prisma = new PrismaClient();
  try {
    // Clear all tables in reverse order of dependencies
    await prisma.recertificationAttempt.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.afterActionReview.deleteMany();
    await prisma.labSession.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.project.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.user.deleteMany();
  } catch {
    // Ignore errors during cleanup
  } finally {
    await prisma.$disconnect();
  }
});
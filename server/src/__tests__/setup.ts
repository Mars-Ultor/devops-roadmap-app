import { PrismaClient } from '@prisma/client';

// Setup test database
beforeAll(async () => {
  // Set test database URL
  process.env.DATABASE_URL = 'file:./test.db';
});

afterAll(async () => {
  // Clean up test database file
  const fs = await import('fs');
  try {
    fs.unlinkSync('./test.db');
  } catch (error) {
    // Ignore if file doesn't exist
  }
});

// Clean up after each test
afterEach(async () => {
  const prisma = new PrismaClient({
    datasourceUrl: 'file:./test.db',
  });
  try {
    // Clear all tables in reverse order of dependencies
    await prisma.afterActionReview.deleteMany();
    await prisma.labSession.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.project.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    // Ignore errors during cleanup
  } finally {
    await prisma.$disconnect();
  }
});
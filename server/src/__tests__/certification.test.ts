import './setup.js';
import request from 'supertest';
import express from 'express';
import certificationRoutes from '../routes/certification.js';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Create test app with certification routes
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/certifications', certificationRoutes);
  return app;
};

// Helper to create auth token
const createAuthToken = (userId: string = 'test-user-id') => {
  return jwt.sign(
    { userId, email: 'test@example.com' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

describe('Certification System Integration', () => {
  let app: express.Application;
  let authToken: string;
  let testUserId: string;

  beforeEach(async () => {
    app = createTestApp();
    testUserId = 'test-user-' + Date.now();
    authToken = createAuthToken(testUserId);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/certifications', () => {
    it('should return empty array for user with no certifications', async () => {
      const response = await request(app)
        .get('/api/certifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return user certifications ordered by earned date', async () => {
      // Create test certifications
      await prisma.certification.createMany({
        data: [
          {
            userId: testUserId,
            skillId: 'docker-basics',
            certificationLevel: 'crawl',
            earnedAt: new Date('2024-01-01'),
            expiresAt: new Date('2025-01-01'),
            status: 'active'
          },
          {
            userId: testUserId,
            skillId: 'kubernetes-fundamentals',
            certificationLevel: 'walk',
            earnedAt: new Date('2024-01-02'),
            expiresAt: new Date('2025-01-02'),
            status: 'active'
          }
        ]
      });

      const response = await request(app)
        .get('/api/certifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].skillId).toBe('kubernetes-fundamentals'); // Most recent first
      expect(response.body[1].skillId).toBe('docker-basics');
      expect(response.body[0]).toHaveProperty('earnedAt');
      expect(response.body[0]).toHaveProperty('expiresAt');
      expect(response.body[0]).toHaveProperty('certificationLevel');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/certifications')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('GET /api/certifications/attempts', () => {
    it('should return recertification attempts for user', async () => {
      // Create test certification and attempt
      const cert = await prisma.certification.create({
        data: {
          userId: testUserId,
          skillId: 'docker-basics',
          certificationLevel: 'crawl',
          earnedAt: new Date('2024-01-01'),
          expiresAt: new Date('2025-01-01'),
          status: 'active'
        }
      });

      await prisma.recertificationAttempt.create({
        data: {
          userId: testUserId,
          certificationId: cert.id,
          score: 85,
          passed: true,
          completedAt: new Date('2024-06-01'),
          assessmentData: { questions: [], answers: [] }
        }
      });

      const response = await request(app)
        .get('/api/certifications/attempts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('score', 85);
      expect(response.body[0]).toHaveProperty('passed', true);
      expect(response.body[0]).toHaveProperty('certification');
      expect(response.body[0].certification.skillId).toBe('docker-basics');
    });

    it('should limit results to last 10 attempts', async () => {
      // Create test certification
      const cert = await prisma.certification.create({
        data: {
          userId: testUserId,
          skillId: 'docker-basics',
          certificationLevel: 'crawl',
          earnedAt: new Date('2024-01-01'),
          expiresAt: new Date('2025-01-01'),
          status: 'active'
        }
      });

      // Create 12 attempts
      const attempts = [];
      for (let i = 1; i <= 12; i++) {
        attempts.push({
          userId: testUserId,
          certificationId: cert.id,
          score: 80 + i,
          passed: true,
          completedAt: new Date(`2024-01-${i.toString().padStart(2, '0')}`),
          assessmentData: { questions: [], answers: [] }
        });
      }

      await prisma.recertificationAttempt.createMany({ data: attempts });

      const response = await request(app)
        .get('/api/certifications/attempts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(10);
      // Should be ordered by completedAt desc, so most recent first
      expect(response.body[0].score).toBe(92); // Highest score (12th attempt)
    });
  });

  describe('POST /api/certifications', () => {
    it('should create new certification for user', async () => {
      const certData = {
        skillId: 'docker-basics',
        certificationLevel: 'crawl',
        assessmentData: {
          score: 90,
          questions: ['What is Docker?', 'How to build images?'],
          answers: ['Container platform', 'Using Dockerfile']
        }
      };

      const response = await request(app)
        .post('/api/certifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(certData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.skillId).toBe('docker-basics');
      expect(response.body.certificationLevel).toBe('crawl');
      expect(response.body.status).toBe('active');
      expect(response.body).toHaveProperty('earnedAt');
      expect(response.body).toHaveProperty('expiresAt');

      // Verify in database
      const cert = await prisma.certification.findUnique({
        where: { id: response.body.id }
      });
      expect(cert).toBeTruthy();
      expect(cert?.userId).toBe(testUserId);
    });

    it('should update existing certification if same skill and level', async () => {
      // Create existing certification
      await prisma.certification.create({
        data: {
          userId: testUserId,
          skillId: 'docker-basics',
          certificationLevel: 'crawl',
          earnedAt: new Date('2024-01-01'),
          expiresAt: new Date('2025-01-01'),
          status: 'active'
        }
      });

      const updateData = {
        skillId: 'docker-basics',
        certificationLevel: 'crawl',
        assessmentData: {
          score: 95,
          questions: ['Advanced Docker question'],
          answers: ['Advanced answer']
        }
      };

      const response = await request(app)
        .post('/api/certifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.skillId).toBe('docker-basics');
      expect(response.body.certificationLevel).toBe('crawl');

      // Verify only one certification exists
      const certs = await prisma.certification.findMany({
        where: { userId: testUserId, skillId: 'docker-basics' }
      });
      expect(certs).toHaveLength(1);
    });

    it('should return 400 for invalid certification data', async () => {
      const invalidData = {
        // Missing required fields
        assessmentData: { score: 90 }
      };

      const response = await request(app)
        .post('/api/certifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('skillId and certificationLevel are required');
    });
  });
});</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\server\src\__tests__\certification.test.ts
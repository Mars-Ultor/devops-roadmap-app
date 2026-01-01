import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

// Create test app with protected route
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Protected route
  app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted', user: (req as any).user });
  });

  return app;
};

describe('Authentication Middleware', () => {
  let app: express.Application;
  let validToken: string;
  let invalidToken: string;

  beforeEach(() => {
    app = createTestApp();

    // Create valid token
    validToken = jwt.sign(
      { userId: '123', email: 'test@example.com' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Create invalid token
    invalidToken = 'invalid.jwt.token';
  });

  it('should allow access with valid token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.message).toBe('Access granted');
    expect(response.body.user).toHaveProperty('userId', '123');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should deny access without token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .expect(401);

    expect(response.body.error).toBe('Access token required');
  });

  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(403);

    expect(response.body.error).toBe('Invalid token');
  });

  it('should deny access with malformed authorization header', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'InvalidFormat')
      .expect(401);

    expect(response.body.error).toBe('Access token required');
  });

  it('should deny access with expired token', async () => {
    const expiredToken = jwt.sign(
      { userId: '123', email: 'test@example.com' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '-1h' } // Already expired
    );

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(403);

    expect(response.body.error).toBe('Invalid token');
  });
});
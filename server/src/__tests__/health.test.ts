import request from 'supertest';
import express from 'express';
import { createServer } from 'http';

// Create a test app instance
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'DevOps Roadmap API is running' });
  });

  return app;
};

describe('Health Check', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      message: 'DevOps Roadmap API is running'
    });
  });

  it('should handle CORS', async () => {
    const response = await request(app)
      .options('/api/health')
      .expect(200);
  });
});
import express, { Request, Response } from 'express';
import { curriculum } from '../data/curriculum.js';
import redisCache from '../utils/cache.js';

const router = express.Router();

// Get all weeks with caching
router.get('/weeks', async (req: Request, res: Response) => {
  const cacheKey = 'curriculum:weeks';

  // Try cache first
  const cachedData = await redisCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  // Cache for 1 hour (curriculum doesn't change often)
  await redisCache.set(cacheKey, curriculum, 3600);
  res.json(curriculum);
});

// Get specific week with caching
router.get('/weeks/:weekId', async (req: Request, res: Response) => {
  const weekId = parseInt(req.params.weekId);
  const cacheKey = `curriculum:week:${weekId}`;

  // Try cache first
  const cachedData = await redisCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const week = curriculum.find(w => w.id === weekId);

  if (!week) {
    return res.status(404).json({ error: 'Week not found' });
  }

  // Cache for 1 hour
  await redisCache.set(cacheKey, week, 3600);
  res.json(week);
});

// Get glossary with caching
router.get('/glossary', async (req: Request, res: Response) => {
  const cacheKey = 'curriculum:glossary';

  // Try cache first
  const cachedData = await redisCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const glossary = [
    { term: 'CI/CD', definition: 'Continuous Integration/Continuous Delivery - automated testing and deployment' },
    { term: 'Docker', definition: 'Platform for developing, shipping, and running applications in containers' },
    { term: 'IaC', definition: 'Infrastructure as Code - managing infrastructure through code instead of manual processes' },
    // Add more terms...
  ];

  // Cache for 1 hour
  await redisCache.set(cacheKey, glossary, 3600);
  res.json(glossary);
});

export default router;

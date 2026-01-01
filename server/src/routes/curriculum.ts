import express, { Request, Response } from 'express';
import { curriculum } from '../data/curriculum.js';

const router = express.Router();

// Get all weeks
router.get('/weeks', (req: Request, res: Response) => {
  res.json(curriculum);
});

// Get specific week
router.get('/weeks/:weekId', (req: Request, res: Response) => {
  const weekId = parseInt(req.params.weekId);
  const week = curriculum.find(w => w.id === weekId);
  
  if (!week) {
    return res.status(404).json({ error: 'Week not found' });
  }
  
  res.json(week);
});

// Get glossary
router.get('/glossary', (req: Request, res: Response) => {
  res.json([
    { term: 'CI/CD', definition: 'Continuous Integration/Continuous Delivery - automated testing and deployment' },
    { term: 'Docker', definition: 'Platform for developing, shipping, and running applications in containers' },
    { term: 'IaC', definition: 'Infrastructure as Code - managing infrastructure through code instead of manual processes' },
    // Add more terms...
  ]);
});

export default router;

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user progress
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { weekId: 'asc' },
    });
    
    const badges = await prisma.badge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentWeek: true, totalXP: true },
    });
    
    res.json({
      progress,
      badges,
      currentWeek: user?.currentWeek || 1,
      totalXP: user?.totalXP || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update lesson progress
router.post('/lesson', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { weekId, lessonId, completed, score } = req.body;
    
    const progress = await prisma.progress.upsert({
      where: {
        userId_weekId_lessonId: {
          userId,
          weekId,
          lessonId,
        },
      },
      update: {
        completed,
        score,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        weekId,
        lessonId,
        completed,
        score,
        completedAt: completed ? new Date() : null,
      },
    });
    
    // Award XP
    if (completed && score) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXP: {
            increment: score,
          },
        },
      });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;

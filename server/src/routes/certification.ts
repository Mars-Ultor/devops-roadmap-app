import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/express.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user certifications
router.get('/', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;

    const certifications = await prisma.certification.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });

    res.json(certifications);
  } catch {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// Get user recertification attempts
router.get('/attempts', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;

    const attempts = await prisma.recertificationAttempt.findMany({
      where: { userId },
      include: {
        certification: true,
      },
      orderBy: { completedAt: 'desc' },
      take: 10, // Last 10 attempts
    });

    res.json(attempts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch recertification attempts' });
  }
});

// Create or update certification
router.post('/', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;
    const {
      skillId,
      certificationLevel,
      expiresAt,
      gracePeriodDays = 30
    } = req.body;

    const certification = await prisma.certification.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        certificationLevel,
        expiresAt: new Date(expiresAt),
        lastRecertifiedAt: new Date(),
        recertificationRequired: false,
        gracePeriodDays,
        consecutivePasses: {
          increment: 1,
        },
        totalAttempts: {
          increment: 1,
        },
      },
      create: {
        userId,
        skillId,
        certificationLevel,
        expiresAt: new Date(expiresAt),
        gracePeriodDays,
      },
    });

    res.json(certification);
  } catch {
    res.status(500).json({ error: 'Failed to create/update certification' });
  }
});

// Submit recertification attempt
router.post('/attempt', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;
    const {
      certificationId,
      drillId,
      score,
      passed,
      timeSpentMinutes,
    } = req.body;

    const attempt = await prisma.recertificationAttempt.create({
      data: {
        userId,
        certificationId,
        drillId,
        score,
        passed,
        timeSpentMinutes,
      },
    });

    // Update certification if passed
    if (passed) {
      await prisma.certification.update({
        where: { id: certificationId },
        data: {
          lastRecertifiedAt: new Date(),
          recertificationRequired: false,
          consecutivePasses: {
            increment: 1,
          },
          totalAttempts: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.certification.update({
        where: { id: certificationId },
        data: {
          totalAttempts: {
            increment: 1,
          },
        },
      });
    }

    res.json(attempt);
  } catch {
    res.status(500).json({ error: 'Failed to submit recertification attempt' });
  }
});

// Mark certification as requiring recertification
router.post('/:id/require-recertification', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;
    const { id } = req.params;

    const certification = await prisma.certification.updateMany({
      where: {
        id,
        userId, // Ensure user owns the certification
      },
      data: {
        recertificationRequired: true,
      },
    });

    if (certification.count === 0) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update certification' });
  }
});

export default router;
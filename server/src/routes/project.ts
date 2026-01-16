import express, { Response } from 'express';
import { PrismaClient, Project } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/express.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user projects
router.get('/', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { projectId: 'asc' },
    });

    res.json(projects);
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Update project
router.put('/:projectId', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;
    const { projectId } = req.params;
    const { title, description, githubUrl, deployUrl, completed } = req.body;

    const project = await prisma.project.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      update: {
        title,
        description,
        githubUrl,
        deployUrl,
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        projectId,
        title,
        description,
        githubUrl,
        deployUrl,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    res.json(project);
  } catch {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Generate resume export
router.get('/export/resume', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;

    const projects = await prisma.project.findMany({
      where: { userId, completed: true },
    });

    const resumeBullets = projects.map((p: Project) =>
      `• ${p.title}: ${p.description || 'DevOps project'} | Tech: Docker, AWS, CI/CD | [Live Demo](${p.deployUrl}) | [Code](${p.githubUrl})`
    );

    res.json({
      resumeSection: resumeBullets.join('\n'),
      linkedInSummary: `DevOps Engineer with hands-on experience in ${projects.length} production projects involving containerization, CI/CD pipelines, and cloud infrastructure.`,
    });
  } catch {
    res.status(500).json({ error: 'Export failed' });
  }
});

export default router;

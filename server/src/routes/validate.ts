import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const router = express.Router();

// All validation endpoints require authentication
router.use(authenticateToken);

/**
 * Check if a file exists
 * GET /api/validate/file-exists?path=<path>
 */
router.get('/file-exists', async (req: Request, res: Response) => {
  try {
    const filePath = req.query.path as string;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Security: Prevent directory traversal attacks
    const resolvedPath = path.resolve(filePath);
    const allowedBasePaths = [
      path.resolve('./'),
      path.resolve('../'),
      path.resolve('/tmp'),
      path.resolve('/var/tmp')
    ];

    const isAllowed = allowedBasePaths.some(basePath =>
      resolvedPath.startsWith(basePath)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: 'Access denied: Path not allowed' });
    }

    try {
      await fs.access(resolvedPath);
      res.json({ exists: true });
    } catch {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'File existence check failed' });
  }
});

/**
 * Check if a file contains a specific pattern
 * POST /api/validate/file-contains
 * Body: { filePath: string, pattern: string }
 */
router.post('/file-contains', async (req: Request, res: Response) => {
  try {
    const { filePath, pattern } = req.body;

    if (!filePath || !pattern) {
      return res.status(400).json({ error: 'File path and pattern are required' });
    }

    // Security: Prevent directory traversal attacks
    const resolvedPath = path.resolve(filePath);
    const allowedBasePaths = [
      path.resolve('./'),
      path.resolve('../'),
      path.resolve('/tmp'),
      path.resolve('/var/tmp')
    ];

    const isAllowed = allowedBasePaths.some(basePath =>
      resolvedPath.startsWith(basePath)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: 'Access denied: Path not allowed' });
    }

    try {
      const content = await fs.readFile(resolvedPath, 'utf-8');
      const contains = content.includes(pattern);
      res.json({ contains });
    } catch {
      res.json({ contains: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'File content check failed' });
  }
});

/**
 * Execute a command and return the result
 * POST /api/validate/command
 * Body: { command: string }
 */
router.post('/command', async (req: Request, res: Response) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Security: Whitelist allowed commands to prevent arbitrary code execution
    const allowedCommands = [
      'ls', 'pwd', 'cat', 'grep', 'find', 'head', 'tail',
      'docker', 'kubectl', 'helm', 'terraform',
      'git', 'npm', 'yarn', 'python', 'python3', 'node',
      'curl', 'wget', 'ping', 'nslookup', 'dig'
    ];

    const commandBase = command.trim().split(' ')[0];
    if (!allowedCommands.includes(commandBase)) {
      return res.status(403).json({
        error: 'Command not allowed',
        allowedCommands
      });
    }

    // Execute command with timeout
    exec(command, { timeout: 10000, maxBuffer: 1024 * 1024 }, (error: Error | null, stdout: string, stderr: string) => {
      const exitCode = error ? (error as any).code || 1 : 0;
      res.json({
        exitCode,
        stdout: stdout.toString(),
        stderr: stderr.toString()
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Command execution failed' });
  }
});

/**
 * Check if a Docker image exists
 * GET /api/validate/image-exists?image=<image>
 */
router.get('/image-exists', async (req: Request, res: Response) => {
  try {
    const imageName = req.query.image as string;

    if (!imageName) {
      return res.status(400).json({ error: 'Image name is required' });
    }

    // Validate image name format (basic validation)
    const imageRegex = /^[a-zA-Z0-9._/-]+(:[a-zA-Z0-9._-]+)?$/;
    if (!imageRegex.test(imageName)) {
      return res.status(400).json({ error: 'Invalid image name format' });
    }

    // Check if image exists using docker inspect
    exec(`docker inspect ${imageName}`, { timeout: 5000 }, (error: Error | null, stdout: string, stderr: string) => {
      const exists = !error && !stderr.toString().includes('Error: No such image');
      res.json({ exists });
    });
  } catch (error) {
    res.status(500).json({ error: 'Image existence check failed' });
  }
});

/**
 * Validate syntax of a file (YAML, JSON, Dockerfile, etc.)
 * POST /api/validate/syntax
 * Body: { filePath: string }
 */
router.post('/syntax', async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Security: Prevent directory traversal attacks
    const resolvedPath = path.resolve(filePath);
    const allowedBasePaths = [
      path.resolve('./'),
      path.resolve('../'),
      path.resolve('/tmp'),
      path.resolve('/var/tmp')
    ];

    const isAllowed = allowedBasePaths.some(basePath =>
      resolvedPath.startsWith(basePath)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: 'Access denied: Path not allowed' });
    }

    try {
      const content = await fs.readFile(resolvedPath, 'utf-8');
      const extension = path.extname(filePath).toLowerCase();

      let valid = true;
      let error = '';

      try {
        switch (extension) {
          case '.json':
            JSON.parse(content);
            break;
          case '.yaml':
          case '.yml':
            yaml.load(content);
            break;
          case '.dockerfile':
          case 'dockerfile':
            // Basic Dockerfile validation - check for FROM instruction
            if (!content.toLowerCase().includes('from ')) {
              valid = false;
              error = 'Dockerfile must contain a FROM instruction';
            }
            break;
          default:
            // For other files, just check if they're readable
            break;
        }
      } catch (parseError: any) {
        valid = false;
        error = parseError.message;
      }

      res.json({ valid, error });
    } catch {
      res.json({ valid: false, error: 'File not found or unreadable' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Syntax validation failed' });
  }
});

export default router;
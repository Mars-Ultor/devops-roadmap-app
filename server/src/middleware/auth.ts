import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/express.js';

// Get JWT secret - fail fast if not configured
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable must be set');
  }
  return secret;
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const secret = getJwtSecret();
    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, user: jwt.JwtPayload | string | undefined) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      (req as AuthenticatedRequest).user = user as AuthenticatedUser;
      next();
    });
  } catch {
    return res.status(500).json({ error: 'Server configuration error' });
  }
};

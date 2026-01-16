import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser extends JwtPayload {
  userId: string;
  id?: string; // Some routes use id instead of userId
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface ExecError extends Error {
  code?: number;
}


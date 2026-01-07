import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import curriculumRoutes from './routes/curriculum.js';
import progressRoutes from './routes/progress.js';
import labRoutes from './routes/lab.js';
import projectRoutes from './routes/project.js';
import validateRoutes from './routes/validate.js';
import aarRoutes from './routes/aar.js';
import certificationRoutes from './routes/certification.js';
import redisCache from './utils/cache.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable must be set');
  process.exit(1);
}

// Initialize Redis connection
redisCache.connect().catch(console.error);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Needed for some APIs
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting - general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting - auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Apply rate limiters
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'DevOps Roadmap API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/validate', validateRoutes);
app.use('/api/aar', aarRoutes);
app.use('/api/certifications', certificationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler - sanitize errors in production
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(500).json({
    error: 'Internal server error',
    ...(isProduction ? {} : { message: err.message, stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

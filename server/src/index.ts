import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import curriculumRoutes from './routes/curriculum.js';
import progressRoutes from './routes/progress.js';
import labRoutes from './routes/lab.js';
import projectRoutes from './routes/project.js';
import validateRoutes from './routes/validate.js';
import aarRoutes from './routes/aar.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

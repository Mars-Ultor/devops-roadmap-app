import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validate lab exercise
router.post('/validate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { exerciseId, output } = req.body;
    
    // Simple validation logic (enhance with actual test cases)
    let passed = false;
    let feedback = '';
    
    // Example validation for lab-1 (Linux basics)
    if (exerciseId === 'lab-1') {
      passed = output.includes('current directory') || output.includes('/home');
      feedback = passed ? 'Great job! You successfully navigated the file system.' : 'Try using pwd and ls commands.';
    }
    
    res.json({
      passed,
      feedback,
      xpEarned: passed ? 50 : 0,
    });
  } catch {
    res.status(500).json({ error: 'Validation failed' });
  }
});

export default router;

import express, { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { AARService } from '../services/aarService.js';
import { AuthenticatedRequest } from '../types/express.js';
import { handleError } from '../utils/errorHandler.js';

const router: Router = express.Router();
const aarService = new AARService();

// Validation middleware
const validateAARForm = [
  body('lessonId').isString().notEmpty(),
  body('level').isIn(['crawl', 'walk', 'run-guided', 'run-independent']),
  body('labId').isString().notEmpty(),
  body('whatWasAccomplished').isString().isLength({ min: 20 }),
  body('whatWorkedWell').isArray({ min: 3 }),
  body('whatDidNotWork').isArray({ min: 2 }),
  body('whyDidNotWork').isString().isLength({ min: 15 }),
  body('whatWouldIDoDifferently').isString().isLength({ min: 15 }),
  body('whatDidILearn').isString().isLength({ min: 15 })
];

/**
 * POST /api/aar
 * Create a new AAR
 */
router.post('/', authenticateToken, validateAARForm, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id || authReq.user.userId;
    const aarData = {
      userId,
      lessonId: req.body.lessonId,
      level: req.body.level,
      labId: req.body.labId,
      whatWasAccomplished: req.body.whatWasAccomplished,
      whatWorkedWell: req.body.whatWorkedWell,
      whatDidNotWork: req.body.whatDidNotWork,
      whyDidNotWork: req.body.whyDidNotWork,
      whatWouldIDoDifferently: req.body.whatWouldIDoDifferently,
      whatDidILearn: req.body.whatDidILearn
    };

    const aar = await aarService.createAAR(aarData);

    res.status(201).json({
      success: true,
      message: 'AAR created successfully',
      data: aar
    });
  } catch (error) {
    res.status(500).json(handleError('Error creating AAR', error, 'Failed to create AAR'));
  }
});

/**
 * GET /api/aar
 * Get user's AARs with optional filtering
 */
router.get('/', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;
    const { lessonId, limit } = req.query;

    let aars;
    if (lessonId) {
      aars = await aarService.getLessonAARs(userId, lessonId as string);
    } else {
      aars = await aarService.getUserAARs(userId, limit ? Number.parseInt(limit as string, 10) : undefined);
    }

    res.json({
      success: true,
      data: aars
    });
  } catch (error) {
    res.status(500).json(handleError('Error fetching AARs', error, 'Failed to fetch AARs'));
  }
});

/**
 * GET /api/aar/:id
 * Get a specific AAR by ID
 */
router.get('/:id', authenticateToken, param('id').isString().notEmpty(), async (req, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;
    const aarId = req.params.id;

    const aar = await aarService.getAARById(aarId, userId);
    if (!aar) {
      return res.status(404).json({
        success: false,
        message: 'AAR not found'
      });
    }

    res.json({
      success: true,
      data: aar
    });
  } catch (error) {
    res.status(500).json(handleError('Error fetching AAR', error, 'Failed to fetch AAR'));
  }
});

/**
 * PUT /api/aar/:id
 * Update an existing AAR
 */
router.put('/:id', authenticateToken, param('id').isString().notEmpty(), async (req, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;
    const aarId = req.params.id;
    const updateData = req.body;

    const aar = await aarService.updateAAR(aarId, userId, updateData);
    if (!aar) {
      return res.status(404).json({
        success: false,
        message: 'AAR not found'
      });
    }

    res.json({
      success: true,
      message: 'AAR updated successfully',
      data: aar
    });
  } catch (error) {
    res.status(500).json(handleError('Error updating AAR', error, 'Failed to update AAR'));
  }
});

/**
 * DELETE /api/aar/:id
 * Delete an AAR
 */
router.delete('/:id', authenticateToken, param('id').isString().notEmpty(), async (req, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;
    const aarId = req.params.id;

    const deleted = await aarService.deleteAAR(aarId, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'AAR not found'
      });
    }

    res.json({
      success: true,
      message: 'AAR deleted successfully'
    });
  } catch (error) {
    res.status(500).json(handleError('Error deleting AAR', error, 'Failed to delete AAR'));
  }
});

/**
 * GET /api/aar/stats/overview
 * Get AAR statistics for the user
 */
router.get('/stats/overview', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;

    const stats = await aarService.getUserAARStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json(handleError('Error fetching AAR stats', error, 'Failed to fetch AAR statistics'));
  }
});

/**
 * POST /api/aar/validate
 * Validate AAR form data without saving
 */
router.post('/validate', authenticateToken, validateAARForm, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const formData = {
      whatWasAccomplished: req.body.whatWasAccomplished,
      whatWorkedWell: req.body.whatWorkedWell,
      whatDidNotWork: req.body.whatDidNotWork,
      whyDidNotWork: req.body.whyDidNotWork,
      whatWouldIDoDifferently: req.body.whatWouldIDoDifferently,
      whatDidILearn: req.body.whatDidILearn
    };

    const validation = await aarService.validateAARForm(formData);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    res.status(500).json(handleError('Error validating AAR form', error, 'Failed to validate AAR form'));
  }
});

/**
 * GET /api/aar/patterns/common
 * Get common patterns across user's AARs
 */
router.get('/patterns/common', authenticateToken, async (req, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id || (req as AuthenticatedRequest).user.userId;
    const { minFrequency = 2 } = req.query;

    const patterns = await aarService.getCommonPatterns(userId, Number.parseInt(minFrequency as string, 10));

    res.json({
      success: true,
      data: patterns
    });
  } catch (error) {
    res.status(500).json(handleError('Error fetching common patterns', error, 'Failed to fetch common patterns'));
  }
});

export default router;
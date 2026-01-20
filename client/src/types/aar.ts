/**
 * After Action Review (AAR) System Types
 * Military-style structured reflection after every lab/exercise
 */

/** Metrics about user's performance/struggle during the exercise */
export interface StruggleMetrics {
  hintsUsed: number;
  validationErrors: number;
  timeSpentSeconds: number;
  retryCount: number;
  isPerfectCompletion: boolean;
}

/** Type of AAR based on struggle metrics */
export type AARFormType = "skip" | "quick" | "full";

/** Determines AAR type based on struggle metrics */
export function determineAARType(metrics: StruggleMetrics): AARFormType {
  // Perfect completion with no struggles - allow skip
  if (
    metrics.isPerfectCompletion &&
    metrics.hintsUsed === 0 &&
    metrics.validationErrors === 0 &&
    metrics.retryCount === 0
  ) {
    return "skip";
  }

  // Minor struggles - quick form
  if (
    metrics.hintsUsed <= 1 &&
    metrics.validationErrors <= 2 &&
    metrics.retryCount <= 1
  ) {
    return "quick";
  }

  // Significant struggles - full detailed AAR
  return "full";
}

export interface AfterActionReview {
  id: string;
  userId: string;
  lessonId: string;
  level: "crawl" | "walk" | "run-guided" | "run-independent";
  labId: string; // specific lab/exercise identifier
  completedAt: Date;

  // Required AAR fields (minimum word counts)
  whatWasAccomplished: string; // "What was I trying to accomplish?" (2-3 sentences, min 20 words)
  whatWorkedWell: string[]; // "What worked well?" (minimum 3 specific things)
  whatDidNotWork: string[]; // "What didn't work?" (minimum 2 failures/struggles)
  whyDidNotWork: string; // "Why didn't it work?" (root cause analysis, not symptoms)
  whatWouldIDoDifferently: string; // "What would I do differently next time?" (specific changes)
  whatDidILearn: string; // "What did I learn that I can use in future tasks?" (transferable knowledge)

  // Metadata
  wordCounts: {
    whatWasAccomplished: number;
    whyDidNotWork: number;
    whatWouldIDoDifferently: number;
    whatDidILearn: number;
  };

  // AI analysis
  aiReview?: AARReview;
  patterns?: AARPattern[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface AARReview {
  reviewedAt: Date;
  reviewer: "ai" | "human";
  score: number; // 1-10 quality score
  feedback: string;
  suggestions: string[];
  followUpQuestions: string[];
}

export interface AARPattern {
  patternId: string;
  type:
    | "strength"
    | "weakness"
    | "recurring_issue"
    | "improvement_trend"
    | "skill_gap"
    | "process_issue";
  description: string;
  frequency: number; // how many times this pattern appears
  relatedLessons: string[];
  recommendation: string;
  confidence: number; // 0-1 AI confidence score
}

// Minimum requirements for AAR completion
export const AAR_REQUIREMENTS = {
  MIN_WORDS_WHAT_ACCOMPLISHED: 20,
  MIN_ITEMS_WORKED_WELL: 3,
  MIN_ITEMS_DID_NOT_WORK: 2,
  MIN_WORDS_WHY_NOT_WORK: 15,
  MIN_WORDS_DO_DIFFERENTLY: 15,
  MIN_WORDS_LEARNED: 15,
} as const;

// AAR form state during creation
export interface AARFormData {
  whatWasAccomplished: string;
  whatWorkedWell: string[];
  whatDidNotWork: string[];
  whyDidNotWork: string;
  whatWouldIDoDifferently: string;
  whatDidILearn: string;
}

// Validation result for AAR form
export interface AARValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  wordCounts: Record<string, number>;
}

// AAR statistics for user dashboard
export interface AARStats {
  totalAARs: number;
  averageQualityScore: number;
  commonPatterns: AARPattern[];
  improvementTrends: {
    category: string;
    trend: "improving" | "declining" | "stable";
    dataPoints: number[];
  }[];
  strengths: string[];
  areasForImprovement: string[];
}

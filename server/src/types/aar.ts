export interface AARFormData {
  whatWasAccomplished: string;
  whatWorkedWell: string[];
  whatDidNotWork: string[];
  whyDidNotWork: string;
  whatWouldIDoDifferently: string;
  whatDidILearn: string;
}

export interface AARValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  wordCounts: {
    whatWasAccomplished: number;
    whyDidNotWork: number;
    whatWouldIDoDifferently: number;
    whatDidILearn: number;
  };
}

export interface AfterActionReview {
  id: string;
  userId: string;
  lessonId: string;
  level: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
  labId: string;
  completedAt: Date;
  whatWasAccomplished: string;
  whatWorkedWell: string[];
  whatDidNotWork: string[];
  whyDidNotWork: string;
  whatWouldIDoDifferently: string;
  whatDidILearn: string;
  wordCounts: {
    whatWasAccomplished: number;
    whyDidNotWork: number;
    whatWouldIDoDifferently: number;
    whatDidILearn: number;
  };
  aiReview?: AIReview;
  patterns?: AARPattern[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIReview {
  qualityScore: number;
  score?: number; // Alias for qualityScore used in some contexts
  feedback: string;
  suggestions: string[];
  followUpQuestions: string[];
  patterns?: AARPattern[];
  reviewedAt?: Date;
  reviewer?: 'ai' | 'human';
}

export interface ImprovementTrend {
  period: string;
  averageScore: number;
  count: number;
}

export interface StrengthOrImprovement {
  area: string;
  description: string;
  frequency?: number;
}

export interface AARStats {
  totalAARs: number;
  averageQualityScore?: number;
  commonPatterns: AARPattern[];
  completionRate: number;
  improvementTrends: ImprovementTrend[];
  strengths: StrengthOrImprovement[];
  areasForImprovement: StrengthOrImprovement[];
}

export interface AARPattern {
  patternId: string;
  name?: string;
  description: string;
  frequency: number;
  type?: string;
  relatedLessons?: string[];
  recommendation?: string;
  confidence?: number;
}

export interface AARUpdateData {
  whatWasAccomplished?: string;
  whatWorkedWell?: string[];
  whatDidNotWork?: string[];
  whyDidNotWork?: string;
  whatWouldIDoDifferently?: string;
  whatDidILearn?: string;
}

export interface WordCounts {
  whatWasAccomplished: number;
  whyDidNotWork: number;
  whatWouldIDoDifferently: number;
  whatDidILearn: number;
}

/**
 * Represents AAR data as stored in Prisma database
 */
export interface PrismaAARData {
  id: string;
  userId: string;
  lessonId: string;
  level: string;
  labId: string;
  completedAt: Date;
  whatWasAccomplished: string;
  whatWorkedWell: unknown;
  whatDidNotWork: unknown;
  whyDidNotWork: string;
  whatWouldIDoDifferently: string;
  whatDidILearn: string;
  wordCounts: unknown;
  aiReview?: unknown;
  patterns?: unknown;
  qualityScore?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const AAR_REQUIREMENTS = {
  MIN_WORDS_WHAT_ACCOMPLISHED: 50,
  MIN_WORDS_WHY_NOT_WORK: 30,
  MIN_WORDS_DO_DIFFERENTLY: 30,
  MIN_WORDS_LEARNED: 30,
  MIN_ITEMS_WORKED_WELL: 3,
  MIN_ITEMS_DID_NOT_WORK: 2
} as const;
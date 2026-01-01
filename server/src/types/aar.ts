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
  aiReview?: any; // JSON object
  patterns?: AARPattern[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AARStats {
  totalAARs: number;
  averageQualityScore?: number;
  commonPatterns: AARPattern[];
  completionRate: number;
  improvementTrends: any[];
  strengths: any[];
  areasForImprovement: any[];
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

export const AAR_REQUIREMENTS = {
  MIN_WORDS_WHAT_ACCOMPLISHED: 50,
  MIN_WORDS_WHY_NOT_WORK: 30,
  MIN_WORDS_DO_DIFFERENTLY: 30,
  MIN_WORDS_LEARNED: 30,
  MIN_ITEMS_WORKED_WELL: 3,
  MIN_ITEMS_DID_NOT_WORK: 2
} as const;
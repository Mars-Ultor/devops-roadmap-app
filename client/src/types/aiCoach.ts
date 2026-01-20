/**
 * Enhanced AI Coach Types - Military Training Methodology
 * Advanced coaching system with real-time analysis and discipline enforcement
 */

export interface CoachFeedback {
  type:
    | "encouragement"
    | "hint"
    | "warning"
    | "insight"
    | "question"
    | "discipline"
    | "tactical_advice";
  message: string;
  confidence: number; // 0-1
  context?: string;
  mode?: CoachMode;
  priority?: "low" | "medium" | "high" | "critical";
  actionRequired?: boolean;
  followUpQuestions?: string[];
}

export interface CoachContext {
  contentType: "lesson" | "lab" | "drill" | "struggle_session";
  contentId: string;
  userProgress: {
    attempts: number;
    timeSpent: number;
    hintsUsed: number;
    struggledFor?: number;
    successRate?: number;
    streakCount?: number;
  };
  currentIssue?: string;
  recentErrors?: string[];
  masteryLevel?: "novice" | "intermediate" | "advanced" | "expert";
  currentWeek?: number;
  commandExecuted?: string;
  errorEncountered?: string;
  codeSnippet?: string; // For real-time code analysis
  struggleSession?: {
    timeRemaining: number;
    logsSubmitted: number;
    hintsAvailable: number;
  };
  performanceMetrics?: {
    accuracy: number;
    speed: number;
    persistence: number;
    learningVelocity: number;
  };
}

export type CoachMode =
  | "instructor"
  | "peer"
  | "independent"
  | "drill_sergeant";

export interface CodeAnalysis {
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  complexity: number; // 0-10 scale
  bestPractices: string[];
  securityConcerns: string[];
}

export interface CodeIssue {
  type: "syntax" | "logic" | "performance" | "security" | "style";
  severity: "low" | "medium" | "high" | "critical";
  line?: number;
  message: string;
  suggestion: string;
}

export interface CodeSuggestion {
  type: "improvement" | "optimization" | "best_practice" | "security";
  description: string;
  code?: string;
  impact: "low" | "medium" | "high";
}

export interface LearningPath {
  currentLevel: string;
  recommendedNext: string[];
  blockedBy: string[];
  acceleratedPath?: string[];
  remedialPath?: string[];
  estimatedCompletion: number; // weeks
}

export interface PerformanceAnalytics {
  userId: string;
  period: "week" | "month" | "quarter";
  metrics: {
    averageAttempts: number;
    averageTime: number;
    hintDependency: number; // 0-1 scale
    errorRate: number;
    learningVelocity: number;
    persistenceScore: number;
  };
  trends: {
    improving: string[];
    declining: string[];
    plateaued: string[];
  };
  recommendations: string[];
}

export interface MotivationalProfile {
  primaryDriver: "achievement" | "mastery" | "autonomy" | "purpose";
  motivationalTriggers: string[];
  demotivators: string[];
  communicationStyle: "direct" | "encouraging" | "analytical" | "tactical";
  responsePatterns: {
    toSuccess: string[];
    toFailure: string[];
    toStruggle: string[];
  };
}

// Military-style coaching configurations
export const COACH_CONFIG = {
  MODES: {
    INSTRUCTOR: {
      weeks: [1, 2, 3, 4],
      style: "directive",
      feedbackFrequency: "high",
      hintThreshold: 0.3, // Allow hints after 30% of attempts
    },
    PEER: {
      weeks: [5, 6, 7, 8],
      style: "socratic",
      feedbackFrequency: "medium",
      hintThreshold: 0.6, // Allow hints after 60% of attempts
    },
    INDEPENDENT: {
      weeks: [9, 10, 11, 12],
      style: "minimal",
      feedbackFrequency: "low",
      hintThreshold: 0.9, // Allow hints after 90% of attempts
    },
    DRILL_SERGEANT: {
      weeks: [13, 14, 15, 16],
      style: "intense",
      feedbackFrequency: "high",
      hintThreshold: 1.0, // No hints - pure discipline
    },
  },

  DISCIPLINE_THRESHOLDS: {
    HINT_ABUSE: 3, // hints per session
    TIME_WASTING: 3600, // 1 hour without progress
    ERROR_REPETITION: 5, // same error multiple times
    STRUGGLE_AVOIDANCE: 300, // 5 minutes without genuine attempt
  },

  MOTIVATIONAL_PATTERNS: {
    ACHIEVEMENT: {
      triggers: ["badges", "leaderboards", "completion_rates"],
      messages: [
        "Excellence recognized",
        "Standard met",
        "Mission accomplished",
      ],
    },
    MASTERY: {
      triggers: ["skill_progression", "concept_mastery", "deep_understanding"],
      messages: [
        "Knowledge internalized",
        "Skill mastered",
        "Expertise growing",
      ],
    },
    AUTONOMY: {
      triggers: [
        "independent_solutions",
        "creative_approaches",
        "self_direction",
      ],
      messages: [
        "Self-reliance demonstrated",
        "Initiative shown",
        "Leadership emerging",
      ],
    },
    PURPOSE: {
      triggers: [
        "impact_recognition",
        "team_contribution",
        "mission_alignment",
      ],
      messages: ["Purpose fulfilled", "Impact made", "Mission advanced"],
    },
  },
} as const;

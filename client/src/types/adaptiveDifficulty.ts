/**
 * Adaptive Difficulty System Types
 * Dynamic difficulty adjustment based on performance
 */

export type DifficultyLevel = "recruit" | "soldier" | "specialist" | "elite";

export interface PerformanceMetrics {
  // Quiz performance
  quizSuccessRate: number; // 0-1
  avgQuizScore: number; // 0-100
  quizStreak: number; // Consecutive passes

  // Lab performance
  labCompletionRate: number; // 0-1
  avgLabScore: number; // 0-100
  avgLabTime: number; // seconds

  // Battle drill performance
  drillSuccessRate: number; // 0-1
  avgDrillTime: number; // seconds

  // Spaced repetition
  avgEasinessFactor: number; // SM-2 EF average
  weakTopicCount: number; // Topics with EF < 2.0

  // Failure metrics
  failureRate: number; // 0-1
  aarCompletionRate: number; // 0-1
  resetTokenUsage: number; // Per week

  // Study consistency
  studyStreak: number; // Days
  avgSessionsPerWeek: number;
}

export interface DifficultySettings {
  currentLevel: DifficultyLevel;

  // Quiz adjustments
  quizTimeMultiplier: number; // 0.7-1.5 (elite gets less time)
  quizHintAvailability: boolean;
  quizPassingScore: number; // 70-85%

  // Lab adjustments
  labGuidanceLevel: "full" | "partial" | "minimal" | "none";
  labTimeLimit: number | null; // null = unlimited
  labValidationStrictness: "lenient" | "normal" | "strict";

  // Battle drill adjustments
  drillTimeTarget: number; // seconds (tighter for elite)
  drillComplexity: "basic" | "intermediate" | "advanced" | "expert";
  simultaneousFailures: number; // 1-3 issues at once

  // Spaced repetition adjustments
  reviewIntervalMultiplier: number; // 0.7-1.3
  newItemsPerDay: number; // 5-15

  // Stress training
  stressIntensity: number; // 1-5
  multiTaskingRequired: boolean;
}

export interface DifficultyAdjustment {
  id: string;
  userId: string;
  timestamp: Date;
  previousLevel: DifficultyLevel;
  newLevel: DifficultyLevel;
  reason: string;
  metrics: PerformanceMetrics;
  autoAdjusted: boolean; // vs manual override
}

export interface AdaptiveRecommendation {
  type: "increase" | "decrease" | "maintain";
  confidence: number; // 0-1
  reasoning: string[];
  suggestedLevel: DifficultyLevel;
  metricsSnapshot: PerformanceMetrics;
}

export const DIFFICULTY_THRESHOLDS = {
  recruit: {
    name: "Recruit",
    description: "Learning the basics with full support",
    quizPassingScore: 70,
    quizTimeMultiplier: 1.5,
    labGuidanceLevel: "full" as const,
    drillTimeTarget: 600, // 10 min
    stressIntensity: 1,
  },
  soldier: {
    name: "Soldier",
    description: "Building competence with moderate support",
    quizPassingScore: 75,
    quizTimeMultiplier: 1.2,
    labGuidanceLevel: "partial" as const,
    drillTimeTarget: 480, // 8 min
    stressIntensity: 2,
  },
  specialist: {
    name: "Specialist",
    description: "Demonstrating mastery with minimal support",
    quizPassingScore: 80,
    quizTimeMultiplier: 1.0,
    labGuidanceLevel: "minimal" as const,
    drillTimeTarget: 360, // 6 min
    stressIntensity: 3,
  },
  elite: {
    name: "Elite",
    description: "Operating at professional level under pressure",
    quizPassingScore: 85,
    quizTimeMultiplier: 0.8,
    labGuidanceLevel: "none" as const,
    drillTimeTarget: 300, // 5 min
    stressIntensity: 4,
  },
};

export const PROMOTION_CRITERIA = {
  toSoldier: {
    quizSuccessRate: 0.8,
    labCompletionRate: 0.75,
    drillSuccessRate: 0.7,
    studyStreak: 5,
  },
  toSpecialist: {
    quizSuccessRate: 0.85,
    labCompletionRate: 0.85,
    drillSuccessRate: 0.8,
    avgEasinessFactor: 2.2,
    studyStreak: 10,
  },
  toElite: {
    quizSuccessRate: 0.9,
    labCompletionRate: 0.9,
    drillSuccessRate: 0.85,
    avgEasinessFactor: 2.5,
    studyStreak: 14,
    weakTopicCount: 0,
  },
};

export const DEMOTION_CRITERIA = {
  fromElite: {
    quizSuccessRate: 0.75,
    drillSuccessRate: 0.7,
    failureRate: 0.3,
    resetTokenUsage: 8,
  },
  fromSpecialist: {
    quizSuccessRate: 0.7,
    drillSuccessRate: 0.65,
    failureRate: 0.35,
    resetTokenUsage: 10,
  },
  fromSoldier: {
    quizSuccessRate: 0.65,
    drillSuccessRate: 0.6,
    failureRate: 0.4,
    resetTokenUsage: 12,
  },
};

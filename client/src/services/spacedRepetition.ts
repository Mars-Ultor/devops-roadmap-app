/**
 * Enhanced Spaced Repetition Service
 * Integrates SM-2 algorithm with mastery levels and automatic review scheduling
 */

import type { MasteryLevel, LessonMastery } from "../types/training";
import type { LessonProgress } from "../hooks/useProgress";

export interface ReviewSchedule {
  contentId: string;
  contentType: "lesson" | "lab" | "drill";
  contentTitle: string;
  masteryLevel?: MasteryLevel;
  nextReviewDate: Date;
  priority: "critical" | "high" | "medium" | "low";
  daysUntilReview: number;
  sm2Data: {
    easinessFactor: number;
    repetitions: number;
    interval: number;
  };
}

export interface ReviewSession {
  reviewId: string;
  contentId: string;
  contentType: "lesson" | "lab" | "drill";
  scheduledFor: Date;
  completedAt?: Date;
  quality?: number; // 0-5
  masteryLevel?: MasteryLevel;
  timeSpentSeconds?: number;
}

/**
 * Calculate review priority based on mastery level and time until review
 */
export function calculateReviewPriority(
  masteryLevel: MasteryLevel | undefined,
  daysUntilReview: number,
): "critical" | "high" | "medium" | "low" {
  // Overdue reviews are critical
  if (daysUntilReview < 0) return "critical";

  // Due today or tomorrow based on mastery level
  if (daysUntilReview <= 1) {
    if (!masteryLevel || masteryLevel === "crawl") return "critical";
    if (masteryLevel === "walk") return "high";
    return "medium";
  }

  // Due in 2-3 days
  if (daysUntilReview <= 3) {
    if (!masteryLevel || masteryLevel === "crawl") return "high";
    return "medium";
  }

  // Due in 4-7 days
  if (daysUntilReview <= 7) return "medium";

  // Due later
  return "low";
}

// Helper: Get mastery bonus for easiness factor
function getMasteryBonus(masteryLevel: MasteryLevel | undefined): number {
  if (!masteryLevel) return 0;
  const bonusMap: Record<MasteryLevel, number> = {
    crawl: 0,
    walk: 0.1,
    "run-guided": 0.2,
    "run-independent": 0.3,
  };
  return bonusMap[masteryLevel];
}

// Helper: Calculate failed recall interval
function getFailedRecallInterval(
  masteryLevel: MasteryLevel | undefined,
): number {
  if (masteryLevel === "run-independent") return 0.5;
  if (masteryLevel === "run-guided") return 0.75;
  return 1;
}

// Helper: Calculate second review interval
function getSecondReviewInterval(
  masteryLevel: MasteryLevel | undefined,
): number {
  if (masteryLevel === "run-independent") return 8;
  if (masteryLevel === "run-guided") return 7;
  if (masteryLevel === "walk") return 6;
  return 5;
}

// Helper: Clamp easiness factor
function clampEasinessFactor(ef: number): number {
  return Math.max(1.3, Math.min(3.0, ef));
}

/**
 * Enhanced SM-2 algorithm with mastery level integration
 * Adjusts intervals based on mastery progression
 */
export function calculateEnhancedSM2(
  quality: number,
  easinessFactor: number,
  repetitions: number,
  interval: number,
  masteryLevel?: MasteryLevel,
): {
  easinessFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: Date;
} {
  // Update easiness factor based on quality + mastery bonus
  const baseEF =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const newEasinessFactor = clampEasinessFactor(
    baseEF + getMasteryBonus(masteryLevel),
  );

  let newRepetitions = repetitions;
  let newInterval = interval;

  // Failed recall (quality < 3)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = getFailedRecallInterval(masteryLevel);
  } else {
    // Successful recall
    newRepetitions = repetitions + 1;
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = getSecondReviewInterval(masteryLevel);
    } else {
      newInterval = Math.round(interval * newEasinessFactor);
    }
  }

  return {
    easinessFactor: newEasinessFactor,
    repetitions: newRepetitions,
    interval: newInterval,
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
  };
}

/**
 * Generate review schedule from lesson progress and mastery data
 */
export function generateReviewSchedule(
  lessonProgress: LessonProgress[],
  masteryData: Map<string, LessonMastery>,
  lessonTitles: Map<string, string>,
): ReviewSchedule[] {
  const now = new Date();

  return lessonProgress
    .map((progress) => {
      const mastery = masteryData.get(progress.lessonId);
      const title = lessonTitles.get(progress.lessonId) || "Unknown Lesson";

      const daysUntilReview = Math.floor(
        (progress.nextReviewDate.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const priority = calculateReviewPriority(
        mastery?.currentLevel,
        daysUntilReview,
      );

      return {
        contentId: progress.lessonId,
        contentType: "lesson" as const,
        contentTitle: title,
        masteryLevel: mastery?.currentLevel,
        nextReviewDate: progress.nextReviewDate,
        priority,
        daysUntilReview,
        sm2Data: {
          easinessFactor: progress.easinessFactor,
          repetitions: progress.repetitions,
          interval: progress.interval,
        },
      };
    })
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
    });
}

/**
 * Get reviews due today
 */
export function getReviewsDueToday(
  schedule: ReviewSchedule[],
): ReviewSchedule[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return schedule.filter((review) => {
    const reviewDate = new Date(review.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  });
}

/**
 * Get reviews due this week
 */
export function getReviewsDueThisWeek(
  schedule: ReviewSchedule[],
): ReviewSchedule[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return schedule.filter((review) => {
    const reviewDate = new Date(review.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate >= today && reviewDate <= nextWeek;
  });
}

/**
 * Calculate optimal daily review load
 * Balances between reviewing old material and learning new material
 */
export function calculateDailyReviewLoad(
  dueToday: number,
  masteryDistribution: Record<MasteryLevel, number>,
): {
  recommended: number;
  minimum: number;
  maximum: number;
  reasoning: string;
} {
  // Base recommendation: 5-10 reviews per day for optimal retention
  let recommended = 7;

  // Adjust based on overdue reviews
  if (dueToday > 10) {
    recommended = Math.min(15, Math.ceil(dueToday * 0.75));
  } else if (dueToday < 3) {
    recommended = Math.max(3, dueToday);
  } else {
    recommended = dueToday;
  }

  // Adjust based on mastery distribution
  const totalMastered = masteryDistribution["run-independent"] || 0;
  const totalInProgress = Object.values(masteryDistribution).reduce(
    (a, b) => a + b,
    0,
  );

  if (totalMastered / totalInProgress > 0.7) {
    // Mostly mastered content - can handle more reviews
    recommended = Math.min(recommended + 3, 15);
  }

  const minimum = Math.max(3, Math.ceil(recommended * 0.6));
  const maximum = Math.min(20, Math.ceil(recommended * 1.5));

  let reasoning = "";
  if (dueToday === 0) {
    reasoning = "No reviews due today. Great job staying current!";
  } else if (dueToday > 15) {
    reasoning =
      "You have many overdue reviews. Focus on catching up gradually.";
  } else if (dueToday > 10) {
    reasoning = "Several reviews due. Tackle them in priority order.";
  } else {
    reasoning = "Optimal review load. Complete these to maintain retention.";
  }

  return {
    recommended,
    minimum,
    maximum,
    reasoning,
  };
}

/**
 * Predict retention probability based on SM-2 data
 * Higher easiness factor + more repetitions = higher retention
 */
export function predictRetention(
  easinessFactor: number,
  repetitions: number,
  daysSinceLastReview: number,
): number {
  // Base retention from easiness factor (1.3 to 3.0 -> 0.4 to 1.0)
  const baseRetention = (easinessFactor - 1.3) / 1.7;

  // Repetition bonus (more repetitions = better retention)
  const repetitionBonus = Math.min(0.3, repetitions * 0.05);

  // Time decay (retention decreases over time)
  const timeDecay = Math.max(0, 1 - daysSinceLastReview / 30);

  const retention = (baseRetention + repetitionBonus) * timeDecay;

  return Math.max(0.1, Math.min(1.0, retention));
}

/**
 * Daily drill selection with weighted randomization
 * Military Training Prompt: 40% recent, 30% 1-week, 20% 1-month, 10% 3-month
 */
export interface DailyDrillCandidate {
  contentId: string;
  contentType: "lesson" | "lab" | "drill";
  contentTitle: string;
  completedAt: Date;
  daysSinceCompletion: number;
  weight: number;
  masteryLevel?: MasteryLevel;
}

export function selectDailyDrill(
  completedContent: Array<{
    id: string;
    type: "lesson" | "lab" | "drill";
    title: string;
    completedAt: Date;
    masteryLevel?: MasteryLevel;
  }>,
): DailyDrillCandidate | null {
  if (completedContent.length === 0) return null;

  const now = new Date();

  // Categorize content by time since completion
  const candidates: DailyDrillCandidate[] = completedContent.map((content) => {
    const daysSince = Math.floor(
      (now.getTime() - content.completedAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Weighted randomization based on time
    let weight = 0;
    if (daysSince <= 1) {
      weight = 0.4; // 40% chance for recent (1 day ago)
    } else if (daysSince <= 7) {
      weight = 0.3; // 30% chance for 1 week ago
    } else if (daysSince <= 30) {
      weight = 0.2; // 20% chance for 1 month ago
    } else {
      weight = 0.1; // 10% chance for 3+ months ago
    }

    // Adjust weight based on mastery level (lower mastery = higher priority)
    const masteryMultiplier = content.masteryLevel
      ? {
          crawl: 1.5,
          walk: 1.2,
          "run-guided": 1.0,
          "run-independent": 0.8,
        }[content.masteryLevel]
      : 1.0;

    return {
      contentId: content.id,
      contentType: content.type,
      contentTitle: content.title,
      completedAt: content.completedAt,
      daysSinceCompletion: daysSince,
      weight: weight * masteryMultiplier,
      masteryLevel: content.masteryLevel,
    };
  });

  // Normalize weights
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  const normalizedCandidates = candidates.map((c) => ({
    ...c,
    weight: c.weight / totalWeight,
  }));

  // Weighted random selection
  const random = Math.random();
  let cumulativeWeight = 0;

  for (const candidate of normalizedCandidates) {
    cumulativeWeight += candidate.weight;
    if (random <= cumulativeWeight) {
      return candidate;
    }
  }

  // Fallback: return most recent
  return normalizedCandidates[0] || null;
}

/**
 * Select multiple daily drills (for users who want more practice)
 */
export function selectMultipleDailyDrills(
  completedContent: Array<{
    id: string;
    type: "lesson" | "lab" | "drill";
    title: string;
    completedAt: Date;
    masteryLevel?: MasteryLevel;
  }>,
  count: number = 2,
): DailyDrillCandidate[] {
  const selected: DailyDrillCandidate[] = [];
  const remaining = [...completedContent];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const drill = selectDailyDrill(remaining);
    if (drill) {
      selected.push(drill);
      // Remove selected item to avoid duplicates
      const index = remaining.findIndex((c) => c.id === drill.contentId);
      if (index !== -1) {
        remaining.splice(index, 1);
      }
    }
  }

  return selected;
}

/**
 * Check if user has completed daily drill today
 */
export function hasDailyDrillToday(lastDrillDate: Date | null): boolean {
  if (!lastDrillDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const drillDate = new Date(lastDrillDate);
  drillDate.setHours(0, 0, 0, 0);

  return drillDate.getTime() === today.getTime();
}

/**
 * Calculate drill performance trend
 * Shows if user is improving, maintaining, or degrading
 */
export function calculateDrillPerformanceTrend(
  attempts: Array<{
    completedAt: Date;
    timeSeconds: number;
    targetTimeSeconds: number;
    hintsUsed: number;
  }>,
): {
  trend: "improving" | "stable" | "degrading";
  avgTimeChange: number; // percentage
  message: string;
} {
  if (attempts.length < 2) {
    return {
      trend: "stable",
      avgTimeChange: 0,
      message: "Need more attempts to determine trend",
    };
  }

  // Get recent 5 attempts vs previous 5
  const sortedAttempts = [...attempts].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
  );

  const recentAttempts = sortedAttempts.slice(
    0,
    Math.min(5, sortedAttempts.length),
  );
  const previousAttempts = sortedAttempts.slice(
    5,
    Math.min(10, sortedAttempts.length),
  );

  if (previousAttempts.length === 0) {
    return {
      trend: "stable",
      avgTimeChange: 0,
      message: "Building performance baseline",
    };
  }

  const recentAvg =
    recentAttempts.reduce((sum, a) => sum + a.timeSeconds, 0) /
    recentAttempts.length;
  const previousAvg =
    previousAttempts.reduce((sum, a) => sum + a.timeSeconds, 0) /
    previousAttempts.length;

  const percentChange = ((recentAvg - previousAvg) / previousAvg) * 100;

  let trend: "improving" | "stable" | "degrading";
  let message: string;

  if (percentChange < -10) {
    trend = "improving";
    message = `Performance improving: ${Math.abs(Math.round(percentChange))}% faster`;
  } else if (percentChange > 10) {
    trend = "degrading";
    message = `Performance degrading: ${Math.round(percentChange)}% slower. Consider review.`;
  } else {
    trend = "stable";
    message = "Performance stable";
  }

  return {
    trend,
    avgTimeChange: percentChange,
    message,
  };
}

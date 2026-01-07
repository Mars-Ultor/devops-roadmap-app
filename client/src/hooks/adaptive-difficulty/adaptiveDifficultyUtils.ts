/**
 * Adaptive Difficulty Utilities
 * Extracted metric calculation and helper functions
 */

import type { PerformanceMetrics, DifficultySettings, DifficultyLevel } from '../../types/adaptiveDifficulty';
import { DIFFICULTY_THRESHOLDS, PROMOTION_CRITERIA, DEMOTION_CRITERIA } from '../../types/adaptiveDifficulty';

// ============================================================================
// Default Metrics
// ============================================================================

export function getDefaultMetrics(): PerformanceMetrics {
  return {
    quizSuccessRate: 0,
    avgQuizScore: 0,
    quizStreak: 0,
    labCompletionRate: 0,
    avgLabScore: 0,
    avgLabTime: 0,
    drillSuccessRate: 0,
    avgDrillTime: 0,
    avgEasinessFactor: 2.5,
    weakTopicCount: 0,
    failureRate: 0,
    aarCompletionRate: 1,
    resetTokenUsage: 0,
    studyStreak: 0,
    avgSessionsPerWeek: 0
  };
}

// ============================================================================
// Settings Creation
// ============================================================================

export function createSettingsForLevel(level: DifficultyLevel): DifficultySettings {
  const threshold = DIFFICULTY_THRESHOLDS[level];
  
  return {
    currentLevel: level,
    quizTimeMultiplier: threshold.quizTimeMultiplier,
    quizHintAvailability: level === 'recruit' || level === 'soldier',
    quizPassingScore: threshold.quizPassingScore,
    labGuidanceLevel: threshold.labGuidanceLevel,
    labTimeLimit: level === 'elite' ? 3600 : null,
    labValidationStrictness: level === 'recruit' ? 'lenient' : level === 'elite' ? 'strict' : 'normal',
    drillTimeTarget: threshold.drillTimeTarget,
    drillComplexity: level === 'recruit' ? 'basic' : level === 'soldier' ? 'intermediate' : level === 'specialist' ? 'advanced' : 'expert',
    simultaneousFailures: level === 'recruit' ? 1 : level === 'soldier' ? 1 : level === 'specialist' ? 2 : 3,
    reviewIntervalMultiplier: level === 'recruit' ? 0.8 : level === 'elite' ? 1.2 : 1.0,
    newItemsPerDay: level === 'recruit' ? 5 : level === 'soldier' ? 8 : level === 'specialist' ? 12 : 15,
    stressIntensity: threshold.stressIntensity,
    multiTaskingRequired: level === 'specialist' || level === 'elite'
  };
}

// ============================================================================
// Criteria Checking
// ============================================================================

export function checkPromotionCriteria(metrics: PerformanceMetrics, level: keyof typeof PROMOTION_CRITERIA): boolean {
  const criteria = PROMOTION_CRITERIA[level];
  
  return (
    metrics.quizSuccessRate >= criteria.quizSuccessRate &&
    metrics.labCompletionRate >= criteria.labCompletionRate &&
    metrics.drillSuccessRate >= criteria.drillSuccessRate &&
    metrics.studyStreak >= criteria.studyStreak &&
    (!('avgEasinessFactor' in criteria) || metrics.avgEasinessFactor >= (criteria as { avgEasinessFactor?: number }).avgEasinessFactor!) &&
    (!('weakTopicCount' in criteria) || metrics.weakTopicCount <= (criteria as { weakTopicCount?: number }).weakTopicCount!)
  );
}

export function checkDemotionCriteria(metrics: PerformanceMetrics, level: keyof typeof DEMOTION_CRITERIA): boolean {
  const criteria = DEMOTION_CRITERIA[level];
  
  return (
    metrics.quizSuccessRate < criteria.quizSuccessRate ||
    metrics.drillSuccessRate < criteria.drillSuccessRate ||
    metrics.failureRate > criteria.failureRate ||
    metrics.resetTokenUsage > criteria.resetTokenUsage
  );
}

// ============================================================================
// Metrics Processing
// ============================================================================

export interface QuizMetrics {
  passes: number;
  total: number;
  scoreSum: number;
  maxStreak: number;
}

export function processQuizDocs(docs: Array<{ data: () => Record<string, unknown> }>): QuizMetrics {
  let passes = 0;
  let total = 0;
  let scoreSum = 0;
  let maxStreak = 0;
  let currentStreak = 0;

  docs.forEach(doc => {
    const data = doc.data();
    total++;
    scoreSum += (data.score as number) || 0;
    if (data.passed) {
      passes++;
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return { passes, total, scoreSum, maxStreak };
}

export interface LabMetrics {
  completed: number;
  total: number;
  scoreSum: number;
  timeSum: number;
}

export function processLabDocs(docs: Array<{ data: () => Record<string, unknown> }>): LabMetrics {
  let completed = 0;
  let total = 0;
  let scoreSum = 0;
  let timeSum = 0;

  docs.forEach(doc => {
    const data = doc.data();
    total++;
    if (data.completed) completed++;
    scoreSum += (data.score as number) || 0;
    timeSum += (data.timeSpent as number) || 0;
  });

  return { completed, total, scoreSum, timeSum };
}

export interface DrillMetrics {
  success: number;
  total: number;
  timeSum: number;
}

export function processDrillDocs(docs: Array<{ data: () => Record<string, unknown> }>): DrillMetrics {
  let success = 0;
  let total = 0;
  let timeSum = 0;

  docs.forEach(doc => {
    const data = doc.data();
    total++;
    if (data.success) success++;
    timeSum += (data.completionTime as number) || 0;
  });

  return { success, total, timeSum };
}

export interface EFMetrics {
  sum: number;
  count: number;
  weakTopics: number;
}

export function processProgressDocs(docs: Array<{ data: () => Record<string, unknown> }>): EFMetrics {
  let sum = 0;
  let count = 0;
  let weakTopics = 0;

  docs.forEach(doc => {
    const data = doc.data();
    if (data.easinessFactor !== undefined) {
      sum += data.easinessFactor as number;
      count++;
      if ((data.easinessFactor as number) < 2.0) weakTopics++;
    }
  });

  return { sum, count, weakTopics };
}

export function calculateStudyStreak(sessionDates: Set<string>): number {
  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (sessionDates.has(currentDate.toISOString().split('T')[0])) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

interface BuildMetricsParams {
  quiz: QuizMetrics;
  lab: LabMetrics;
  drill: DrillMetrics;
  ef: EFMetrics;
  aarCompleted: number;
  failureCount: number;
  tokenCount: number;
  studyStreak: number;
  sessionCount: number;
}

export function buildMetricsFromData(params: BuildMetricsParams): PerformanceMetrics {
  const { quiz, lab, drill, ef, aarCompleted, failureCount, tokenCount, studyStreak, sessionCount } = params;
  const totalAttempts = quiz.total + lab.total + drill.total;
  const totalFailures = (quiz.total - quiz.passes) + (lab.total - lab.completed) + (drill.total - drill.success);

  return {
    quizSuccessRate: quiz.total > 0 ? quiz.passes / quiz.total : 0,
    avgQuizScore: quiz.total > 0 ? quiz.scoreSum / quiz.total : 0,
    quizStreak: quiz.maxStreak,
    labCompletionRate: lab.total > 0 ? lab.completed / lab.total : 0,
    avgLabScore: lab.total > 0 ? lab.scoreSum / lab.total : 0,
    avgLabTime: lab.total > 0 ? lab.timeSum / lab.total : 0,
    drillSuccessRate: drill.total > 0 ? drill.success / drill.total : 0,
    avgDrillTime: drill.total > 0 ? drill.timeSum / drill.total : 0,
    avgEasinessFactor: ef.count > 0 ? ef.sum / ef.count : 2.5,
    weakTopicCount: ef.weakTopics,
    failureRate: totalAttempts > 0 ? totalFailures / totalAttempts : 0,
    aarCompletionRate: failureCount > 0 ? aarCompleted / failureCount : 1,
    resetTokenUsage: tokenCount,
    studyStreak,
    avgSessionsPerWeek: sessionCount / 4
  };
}

// ============================================================================
// Recommendation Logic
// ============================================================================

export interface RecommendationResult {
  type: 'increase' | 'decrease' | 'maintain';
  confidence: number;
  reasoning: string[];
  suggestedLevel: DifficultyLevel;
}

export function evaluateRecommendationLogic(
  currentLevel: DifficultyLevel,
  metrics: PerformanceMetrics
): RecommendationResult {
  const reasoning: string[] = [];
  let suggestedLevel: DifficultyLevel = currentLevel;
  let type: 'increase' | 'decrease' | 'maintain' = 'maintain';
  let confidence = 0.5;

  // Check promotions
  if (currentLevel === 'recruit' && checkPromotionCriteria(metrics, 'toSoldier')) {
    suggestedLevel = 'soldier'; type = 'increase'; confidence = 0.8;
    reasoning.push(`Quiz: ${(metrics.quizSuccessRate * 100).toFixed(1)}%`, `Labs: ${(metrics.labCompletionRate * 100).toFixed(1)}%`);
  } else if (currentLevel === 'soldier' && checkPromotionCriteria(metrics, 'toSpecialist')) {
    suggestedLevel = 'specialist'; type = 'increase'; confidence = 0.85;
    reasoning.push(`High performance`, `EF: ${metrics.avgEasinessFactor.toFixed(2)}`);
  } else if (currentLevel === 'specialist' && checkPromotionCriteria(metrics, 'toElite')) {
    suggestedLevel = 'elite'; type = 'increase'; confidence = 0.9;
    reasoning.push(`Elite performance: ${(metrics.quizSuccessRate * 100).toFixed(1)}%`);
  }
  // Check demotions
  else if (currentLevel === 'elite' && checkDemotionCriteria(metrics, 'fromElite')) {
    suggestedLevel = 'specialist'; type = 'decrease'; confidence = 0.75;
    reasoning.push(`Below elite standards`);
  } else if (currentLevel === 'specialist' && checkDemotionCriteria(metrics, 'fromSpecialist')) {
    suggestedLevel = 'soldier'; type = 'decrease'; confidence = 0.7;
    reasoning.push(`Struggling: ${(metrics.failureRate * 100).toFixed(1)}% failures`);
  } else if (currentLevel === 'soldier' && checkDemotionCriteria(metrics, 'fromSoldier')) {
    suggestedLevel = 'recruit'; type = 'decrease'; confidence = 0.65;
    reasoning.push(`Need more practice`);
  }

  if (reasoning.length === 0) reasoning.push(`Performing well at ${currentLevel}`);
  return { type, confidence, reasoning, suggestedLevel };
}

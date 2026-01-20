/**
 * PerformanceDashboardUtils - Utilities for PerformanceDashboard
 */

import type {
  PerformanceAnalytics,
  LearningPath,
  CoachContext,
} from "../../types/aiCoach";

export function getMetricColor(
  value: number,
  thresholds: { good: number; warning: number },
): string {
  if (value >= thresholds.good) return "text-green-400";
  if (value >= thresholds.warning) return "text-amber-400";
  return "text-red-400";
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

export function getTrendStatus(analytics: PerformanceAnalytics): {
  improving: boolean;
  text: string;
} {
  const improving =
    analytics.trends.improving.length > analytics.trends.declining.length;
  return { improving, text: improving ? "Improving" : "Needs Focus" };
}

export async function generateLearningPath(
  context: CoachContext,
  analytics: PerformanceAnalytics,
): Promise<LearningPath> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentLevel = context.masteryLevel || "novice";
  const recommendations: LearningPath = {
    currentLevel,
    recommendedNext: [],
    blockedBy: [],
    estimatedCompletion: 12,
  };

  if (analytics.metrics.hintDependency > 0.5) {
    recommendations.blockedBy.push("hint dependency reduction");
  }
  if (analytics.metrics.persistenceScore < 0.4) {
    recommendations.blockedBy.push("persistence training");
  }
  if (analytics.trends.improving.includes("learning velocity")) {
    recommendations.recommendedNext.push("advanced scenarios");
  }
  if (analytics.trends.declining.includes("error rate")) {
    recommendations.recommendedNext.push("error handling drills");
  }

  return recommendations;
}

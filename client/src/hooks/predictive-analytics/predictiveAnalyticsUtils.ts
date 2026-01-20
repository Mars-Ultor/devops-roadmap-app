/**
 * Predictive Analytics Utilities
 * Extracted helper functions for ESLint compliance
 */

// ============================================================================
// Math Utilities
// ============================================================================

export function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

// ============================================================================
// Prediction Generators
// ============================================================================

export function generateStrugglePrediction(
  avgScore: number,
  failureRate: number,
  struggleRate: number,
): string {
  if (failureRate > 0.3)
    return "High likelihood of continued struggles due to frequent failures.";
  if (avgScore < 50)
    return "Significant challenges expected. Topic fundamentals may need review.";
  if (struggleRate > 0.3)
    return "Recent performance indicates ongoing difficulties.";
  return "Moderate challenges expected. Additional practice recommended.";
}

export function generatePreventiveActions(
  riskLevel: string,
  attempts: number,
  avgScore: number,
): string[] {
  const actions: string[] = [];
  if (riskLevel === "high") {
    actions.push("Schedule dedicated review sessions");
    actions.push("Seek additional learning resources");
    actions.push("Break topic into smaller parts");
  }
  if (attempts < 3) actions.push("Complete more practice attempts");
  if (avgScore < 70) {
    actions.push("Focus on core concepts first");
    actions.push("Use spaced repetition");
  }
  actions.push("Review after-action reports");
  return actions.slice(0, 3);
}

export function identifySkillImprovements(
  recentProgress: {
    data: () => {
      masteryLevel?: string;
      score?: number;
      timeSpentMinutes?: number;
    };
  }[],
): string[] {
  const improvements: string[] = [];
  const masteryLevels = recentProgress.map((doc) => doc.data().masteryLevel);
  const runIndependentCount = masteryLevels.filter(
    (l) => l === "run-independent",
  ).length;
  const runGuidedCount = masteryLevels.filter((l) => l === "run-guided").length;

  if (runIndependentCount > runGuidedCount)
    improvements.push("Independent problem-solving");

  const avgScore =
    recentProgress.reduce((sum, doc) => sum + (doc.data().score || 0), 0) /
    recentProgress.length;
  if (avgScore > 75) improvements.push("Quiz performance");

  const avgTime =
    recentProgress.reduce(
      (sum, doc) => sum + (doc.data().timeSpentMinutes || 0),
      0,
    ) / recentProgress.length;
  if (avgTime < 15) improvements.push("Learning efficiency");

  return improvements.length > 0
    ? improvements
    : ["Continued skill development"];
}

export function generateTrajectoryAdjustments(
  current: string,
  optimal: string,
): string[] {
  const adjustments: string[] = [];

  if (current === "declining") {
    adjustments.push("Increase study frequency and duration");
    adjustments.push("Review study techniques");
    adjustments.push("Consider a short break to prevent burnout");
  } else if (current === "plateauing") {
    adjustments.push("Try new learning approaches");
    adjustments.push("Increase practice difficulty");
    adjustments.push("Focus on weak areas");
  } else if (current === "steady" && optimal === "accelerating") {
    adjustments.push("Add more study sessions per week");
    adjustments.push("Incorporate advanced topics earlier");
    adjustments.push("Set more ambitious goals");
  }

  return adjustments.length > 0
    ? adjustments
    : ["Continue current approach while monitoring progress"];
}

// ============================================================================
// Risk Level Calculation
// ============================================================================

export function calculateRiskLevel(
  avgScore: number,
  failureRate: number,
  struggleRate: number,
  attempts: number,
): "low" | "medium" | "high" {
  let riskScore = 0;
  if (avgScore < 50) riskScore += 3;
  else if (avgScore < 70) riskScore += 2;
  else if (avgScore < 80) riskScore += 1;

  if (failureRate > 0.3) riskScore += 3;
  else if (failureRate > 0.2) riskScore += 2;
  else if (failureRate > 0.1) riskScore += 1;

  if (struggleRate > 0.3) riskScore += 2;
  else if (struggleRate > 0.2) riskScore += 1;

  if (attempts < 3) riskScore += 1;

  if (riskScore >= 5) return "high";
  if (riskScore >= 3) return "medium";
  return "low";
}

// ============================================================================
// Trajectory Analysis
// ============================================================================

export function determineTrajectory(
  recentAvg: number,
  earlierAvg: number,
): "accelerating" | "steady" | "plateauing" | "declining" {
  const improvement = recentAvg - earlierAvg;
  if (improvement > 10) return "accelerating";
  if (improvement > 2) return "steady";
  if (improvement > -5) return "plateauing";
  return "declining";
}

// ============================================================================
// Types
// ============================================================================

export interface PredictiveData {
  completionPrediction: CompletionPrediction;
  weakAreaPredictions: WeakAreaPrediction[];
  performanceForecast: PerformanceForecast;
  learningTrajectory: LearningTrajectory;
}

export interface CompletionPrediction {
  estimatedCompletionDate: Date;
  confidence: number;
  remainingWeeks: number;
  remainingItems: number;
  currentPace: number;
  requiredPace: number;
  riskFactors: string[];
}
export interface WeakAreaPrediction {
  topic: string;
  riskLevel: "low" | "medium" | "high";
  predictedStruggles: string;
  preventiveActions: string[];
  estimatedDifficulty: number;
}
export interface PerformanceForecast {
  nextWeekPrediction: {
    expectedItems: number;
    expectedMastery: number;
    confidence: number;
  };
  monthProjection: {
    totalItems: number;
    masteryRate: number;
    skillImprovements: string[];
  };
}
export interface LearningTrajectory {
  currentTrajectory: "accelerating" | "steady" | "plateauing" | "declining";
  optimalTrajectory: "accelerating" | "steady";
  adjustments: string[];
}

// ============================================================================
// Prediction Calculators
// ============================================================================

type ProgressDoc = {
  data: () => {
    completedAt?: { toDate: () => Date };
    score?: number;
    contentId?: string;
    lessonId?: string;
    timeSpentMinutes?: number;
    masteryLevel?: string;
  };
};
type FailureDoc = { data: () => { topic?: string; contentId?: string } };

export function calculateCompletionPrediction(
  progressDocs: ProgressDoc[],
): CompletionPrediction {
  const totalProgramItems = 200;
  const completedItems = progressDocs.length;
  const remainingItems = Math.max(totalProgramItems - completedItems, 0);
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const recentProgress = progressDocs.filter((doc) => {
    const d = doc.data().completedAt?.toDate();
    return d && d >= fourWeeksAgo;
  });
  const currentPace = recentProgress.length / 4;
  const totalWeeks = 12;
  const completedWeeks = Math.max(
    1,
    Math.ceil(completedItems / (totalProgramItems / totalWeeks)),
  );
  const remainingWeeks = Math.max(totalWeeks - completedWeeks, 1);
  const requiredPace = remainingItems / remainingWeeks;
  const estimatedCompletionDate =
    currentPace > 0
      ? new Date(
          Date.now() + (remainingItems / currentPace) * 7 * 24 * 60 * 60 * 1000,
        )
      : new Date(Date.now() + remainingWeeks * 7 * 24 * 60 * 60 * 1000);
  const progressVariance = calculateVariance(
    recentProgress.map((doc) => doc.data().score || 0),
  );
  const confidence = Math.max(
    10,
    Math.min(
      95,
      100 - progressVariance - (recentProgress.length < 10 ? 20 : 0),
    ),
  );
  const riskFactors: string[] = [];
  if (currentPace < requiredPace * 0.5)
    riskFactors.push("Pace significantly below required");
  if (progressVariance > 30) riskFactors.push("Inconsistent performance");
  if (recentProgress.length < 5) riskFactors.push("Limited recent data");
  if (remainingItems > totalProgramItems * 0.7)
    riskFactors.push("Large portion remaining");
  return {
    estimatedCompletionDate,
    confidence: Math.round(confidence),
    remainingWeeks,
    remainingItems,
    currentPace: Math.round(currentPace * 10) / 10,
    requiredPace: Math.round(requiredPace * 10) / 10,
    riskFactors,
  };
}

export function predictWeakAreas(
  progressDocs: ProgressDoc[],
  failureDocs: FailureDoc[],
): WeakAreaPrediction[] {
  const topicPerformance: Record<
    string,
    {
      scores: number[];
      attempts: number;
      failures: number;
      recentStruggles: number;
    }
  > = {};
  progressDocs.forEach((doc) => {
    const data = doc.data();
    const topic = data.contentId || data.lessonId || "Unknown";
    if (!topicPerformance[topic])
      topicPerformance[topic] = {
        scores: [],
        attempts: 0,
        failures: 0,
        recentStruggles: 0,
      };
    topicPerformance[topic].scores.push(data.score || 0);
    topicPerformance[topic].attempts++;
    if ((data.score || 0) < 60) topicPerformance[topic].recentStruggles++;
  });
  failureDocs.forEach((doc) => {
    const topic = doc.data().topic || doc.data().contentId || "Unknown";
    if (topicPerformance[topic]) topicPerformance[topic].failures++;
  });
  return Object.entries(topicPerformance)
    .map(([topic, data]) => {
      const avgScore =
        data.scores.reduce((s, x) => s + x, 0) / data.scores.length;
      const failureRate = data.failures / Math.max(data.attempts, 1);
      const struggleRate = data.recentStruggles / Math.max(data.attempts, 1);
      const riskLevel = calculateRiskLevel(
        avgScore,
        failureRate,
        struggleRate,
        data.attempts,
      );
      return {
        topic,
        riskLevel,
        predictedStruggles: generateStrugglePrediction(
          avgScore,
          failureRate,
          struggleRate,
        ),
        preventiveActions: generatePreventiveActions(
          riskLevel,
          data.attempts,
          avgScore,
        ),
        estimatedDifficulty: Math.round((11 - avgScore / 10) * 10) / 10,
      };
    })
    .filter((p) => p.riskLevel !== "low")
    .sort(
      (a, b) =>
        ({ high: 3, medium: 2, low: 1 })[b.riskLevel] -
        { high: 3, medium: 2, low: 1 }[a.riskLevel],
    )
    .slice(0, 5);
}

export function forecastPerformance(
  progressDocs: ProgressDoc[],
): PerformanceForecast {
  const recentProgress = progressDocs.slice(-10);
  const avgItemsPerWeek = recentProgress.length / 2;
  const avgMasteryRate =
    (recentProgress.reduce(
      (s, d) => s + (d.data().masteryLevel === "run-independent" ? 1 : 0),
      0,
    ) /
      recentProgress.length) *
    100;
  return {
    nextWeekPrediction: {
      expectedItems: Math.round(avgItemsPerWeek),
      expectedMastery: Math.round(avgMasteryRate),
      confidence: Math.min(90, recentProgress.length * 9),
    },
    monthProjection: {
      totalItems: Math.round(avgItemsPerWeek * 4),
      masteryRate: Math.round(Math.min(100, avgMasteryRate + 10)),
      skillImprovements: identifySkillImprovements(progressDocs.slice(-20)),
    },
  };
}

export function analyzeLearningTrajectory(
  progressDocs: ProgressDoc[],
): LearningTrajectory {
  if (progressDocs.length < 5)
    return {
      currentTrajectory: "steady",
      optimalTrajectory: "steady",
      adjustments: ["Continue building study habits."],
    };
  const recentScores = progressDocs.slice(-10).map((d) => d.data().score || 0);
  const earlierScores = progressDocs
    .slice(-20, -10)
    .map((d) => d.data().score || 0);
  const recentAvg =
    recentScores.reduce((s, x) => s + x, 0) / recentScores.length;
  const earlierAvg =
    earlierScores.length > 0
      ? earlierScores.reduce((s, x) => s + x, 0) / earlierScores.length
      : recentAvg;
  const currentTrajectory = determineTrajectory(recentAvg, earlierAvg);
  const optimalTrajectory: "accelerating" | "steady" =
    progressDocs.length < 50 ? "accelerating" : "steady";
  return {
    currentTrajectory,
    optimalTrajectory,
    adjustments: generateTrajectoryAdjustments(
      currentTrajectory,
      optimalTrajectory,
    ),
  };
}

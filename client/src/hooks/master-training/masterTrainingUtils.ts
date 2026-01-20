/**
 * Master Training Utilities
 * Extracted helper functions for ESLint compliance
 */

import type {
  LearningPath,
  MasterTrainingSession,
  AdaptiveScenario,
} from "../../pages/MasterTraining";

// ============================================================================
// Types
// ============================================================================

export interface MasterTrainingState {
  learningPaths: LearningPath[];
  selectedPath: LearningPath | null;
  currentSession: MasterTrainingSession | null;
  phase: "selection" | "path-overview" | "training" | "progress" | "insights";
  trainingActive: boolean;
  sessionStartTime: Date | null;
  currentChallengeIndex: number;
  selectedAnswer: string | null;
  challengeResults: {
    challengeId: string;
    correct: boolean;
    selectedOptionId: string;
  }[];
  adaptiveMetrics: {
    performanceScore: number;
    difficultyAdjustment: number;
    timeEfficiency: number;
    learningVelocity: number;
  };
  loading: boolean;
}

export interface MasterTrainingActions {
  loadProgress: () => Promise<void>;
  saveProgress: (updatedPaths: LearningPath[]) => Promise<void>;
  startLearningPath: (path: LearningPath) => void;
  beginTrainingSession: () => void;
  selectAnswer: (answerId: string) => void;
  submitAnswer: () => void;
  nextChallenge: () => void;
  completeSession: () => void;
  resetSession: () => void;
  goToPhase: (newPhase: MasterTrainingState["phase"]) => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  backToPathOverview: () => void;
}

export interface ChallengeResult {
  challengeId: string;
  correct: boolean;
  selectedOptionId: string;
}

// ============================================================================
// Default State
// ============================================================================

export function getDefaultAdaptiveMetrics() {
  return {
    performanceScore: 0,
    difficultyAdjustment: 0,
    timeEfficiency: 100,
    learningVelocity: 1.0,
  };
}

// ============================================================================
// Session Creation
// ============================================================================

export function findNextScenarioId(
  path: LearningPath,
  pathScenarioMap: Record<string, string[]>,
): string | null {
  const pathScenarioIds = pathScenarioMap[path.id] || [
    "adaptive-incident-response",
  ];
  return (
    pathScenarioIds.find((id) => !path.completedScenarios.includes(id)) || null
  );
}

export function createTrainingSession(
  selectedPath: LearningPath,
  scenario: AdaptiveScenario,
): MasterTrainingSession {
  return {
    sessionId: `session-${Date.now()}`,
    startTime: new Date(),
    learningPath: selectedPath,
    currentScenario: scenario,
    performanceData: {
      decisions: [],
      communications: [],
      timeSpent: 0,
      score: 0,
      difficultyAdjustment: 0,
    },
    aiRecommendations: {
      nextDifficulty: scenario.currentDifficulty,
      focusAreas: [],
      suggestedScenarios: [],
      learningInsights: [],
    },
  };
}

// ============================================================================
// Progress Update
// ============================================================================

export function updatePathProgress(
  learningPaths: LearningPath[],
  selectedPath: LearningPath,
  scenarioId: string,
  pathScenarioMap: Record<string, string[]>,
): LearningPath[] {
  return learningPaths.map((path) => {
    if (path.id !== selectedPath.id) return path;

    const newCompletedScenarios = [...path.completedScenarios];
    if (!newCompletedScenarios.includes(scenarioId)) {
      newCompletedScenarios.push(scenarioId);
    }

    return {
      ...path,
      completedScenarios: newCompletedScenarios,
      progress: Math.round(
        (newCompletedScenarios.length /
          (pathScenarioMap[path.id]?.length || 1)) *
          100,
      ),
      currentLevel: Math.min(path.currentLevel + 1, path.totalLevels),
    };
  });
}

export function calculateSessionScore(
  challengeResults: ChallengeResult[],
  totalChallenges: number,
): number {
  const correctAnswers = challengeResults.filter((r) => r.correct).length;
  return Math.round((correctAnswers / totalChallenges) * 100);
}

export function finalizeSession(
  currentSession: MasterTrainingSession,
  challengeResults: ChallengeResult[],
  timeSpent: number,
  score: number,
): MasterTrainingSession {
  return {
    ...currentSession,
    endTime: new Date(),
    performanceData: {
      ...currentSession.performanceData,
      timeSpent,
      score,
      decisions: challengeResults,
    },
  };
}

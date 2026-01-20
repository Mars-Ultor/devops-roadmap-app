import type {
  MasterTrainingSession,
  AdaptiveScenario,
  LearningPath,
} from "../pages/MasterTraining";
import type { SessionState } from "./useMasterTrainingSession";

export const initialMetrics = {
  performanceScore: 0,
  difficultyAdjustment: 0,
  timeEfficiency: 100,
  learningVelocity: 1.0,
};

/**
 * Create a new training session
 */
export const createSession = (
  selectedPath: LearningPath,
  adaptiveScenarios: AdaptiveScenario[],
  pathScenarioMap: Record<string, string[]>,
): MasterTrainingSession | null => {
  const pathScenarioIds = pathScenarioMap[selectedPath.id] || [
    "adaptive-incident-response",
  ];
  const nextScenarioId = pathScenarioIds.find(
    (id) => !selectedPath.completedScenarios.includes(id),
  );

  if (!nextScenarioId) {
    return null;
  }

  const startingScenario =
    adaptiveScenarios.find((s) => s.id === nextScenarioId) ||
    adaptiveScenarios[0];

  return {
    sessionId: `session-${Date.now()}`,
    startTime: new Date(),
    learningPath: selectedPath,
    currentScenario: startingScenario,
    performanceData: {
      decisions: [],
      communications: [],
      timeSpent: 0,
      score: 0,
      difficultyAdjustment: 0,
    },
    aiRecommendations: {
      nextDifficulty: startingScenario.currentDifficulty,
      focusAreas: [],
      suggestedScenarios: [],
      learningInsights: [],
    },
  };
};

/**
 * Calculate final session results
 */
export const calculateSessionResults = (
  currentSession: MasterTrainingSession,
  sessionStartTime: Date | null,
  challengeResults: SessionState["challengeResults"],
) => {
  const endTime = new Date();
  const timeSpent = sessionStartTime
    ? endTime.getTime() - sessionStartTime.getTime()
    : 0;
  const correctAnswers = challengeResults.filter((r) => r.correct).length;
  const totalChallenges = currentSession.currentScenario.challenges.length;
  const score = Math.round((correctAnswers / totalChallenges) * 100);

  return { endTime, timeSpent, score };
};

/**
 * Update learning paths after session completion
 */
export const updatePathsAfterCompletion = (
  learningPaths: LearningPath[],
  selectedPath: LearningPath,
  completedScenarioId: string,
  pathScenarioMap: Record<string, string[]>,
): LearningPath[] => {
  return learningPaths.map((path) => {
    if (path.id !== selectedPath.id) return path;

    const newCompletedScenarios = [...path.completedScenarios];
    if (!newCompletedScenarios.includes(completedScenarioId)) {
      newCompletedScenarios.push(completedScenarioId);
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
};

/**
 * Create final session object
 */
export const createFinalSession = (
  currentSession: MasterTrainingSession,
  endTime: Date,
  timeSpent: number,
  score: number,
  challengeResults: SessionState["challengeResults"],
): MasterTrainingSession => ({
  ...currentSession,
  endTime,
  performanceData: {
    ...currentSession.performanceData,
    timeSpent,
    score,
    decisions: challengeResults,
  },
});

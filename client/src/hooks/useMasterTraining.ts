/**
 * Master Training Hook - Refactored
 * Manages AI-driven learning paths and training sessions
 */
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  AdaptiveScenario,
} from "../pages/MasterTraining";
import { useMasterTrainingStorage } from "./useMasterTrainingStorage";
import { useMasterTrainingCallbacks } from "./master-training/useMasterTrainingCallbacks";
import { useMasterTrainingState } from "./master-training/useMasterTrainingState";
import type {
  MasterTrainingActions,
} from "./master-training/masterTrainingUtils";

export type { MasterTrainingState, MasterTrainingActions };

export function useMasterTraining(
  adaptiveScenarios: AdaptiveScenario[],
  pathScenarioMap: Record<string, string[]>,
) {
  const { user } = useAuthStore();
  const {
    loadProgress: loadStorageProgress,
    saveProgress: saveStorageProgress,
  } = useMasterTrainingStorage(user?.uid);

  const [state, setters] = useMasterTrainingState();

  const {
    loadProgress,
    saveProgress,
    startLearningPath,
    beginTrainingSession,
    selectAnswer,
    submitAnswer,
    nextChallenge,
    completeSession,
    resetSession,
    pauseTraining,
    resumeTraining,
    backToPathOverview,
    goToPhase,
  } = useMasterTrainingCallbacks(
    {
      adaptiveScenarios,
      pathScenarioMap,
      learningPaths: state.learningPaths,
      selectedPath: state.selectedPath,
      currentSession: state.currentSession,
      sessionStartTime: state.sessionStartTime,
      currentChallengeIndex: state.currentChallengeIndex,
      selectedAnswer: state.selectedAnswer,
      challengeResults: state.challengeResults,
    },
    { loadProgress: loadStorageProgress, saveProgress: saveStorageProgress },
    setters,
  );

  useEffect(() => {
    if (user) loadProgress();
    else setters.setLoading(false);
  }, [user, loadProgress, setters]);

  const actions: MasterTrainingActions = {
    loadProgress,
    saveProgress,
    startLearningPath,
    beginTrainingSession,
    selectAnswer,
    submitAnswer,
    nextChallenge,
    completeSession,
    resetSession,
    goToPhase,
    pauseTraining,
    resumeTraining,
    backToPathOverview,
  };
  return { state, actions };
}

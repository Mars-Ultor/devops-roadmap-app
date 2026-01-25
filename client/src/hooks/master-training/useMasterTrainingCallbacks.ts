/**
 * Master Training Callbacks Hook
 * Combines session, challenge, and completion callbacks
 * For ESLint compliance (max-lines-per-function)
 */

import type {
  LearningPath,
  MasterTrainingSession,
  AdaptiveScenario,
} from "../../pages/MasterTraining";
import { useMasterTrainingSessionCallbacks } from "./useMasterTrainingSessionCallbacks";
import { useMasterTrainingChallengeCallbacks } from "./useMasterTrainingChallengeCallbacks";
import { useMasterTrainingCompletionCallbacks } from "./useMasterTrainingCompletionCallbacks";
import { loadMasterTrainingProgress } from "./masterTrainingOperations";
import type { MasterTrainingStorage } from "./masterTrainingOperations";
import type { ChallengeResult } from "./masterTrainingUtils";
import type { MasterTrainingPhase, AdaptiveMetrics } from "./masterTrainingUtils";

interface MasterTrainingCallbacks {
  setLearningPaths: React.Dispatch<React.SetStateAction<LearningPath[]>>;
  setSelectedPath: (path: LearningPath | null) => void;
  setCurrentSession: (session: MasterTrainingSession | null) => void;
  setPhase: (phase: MasterTrainingPhase) => void;
  setTrainingActive: (active: boolean) => void;
  setSessionStartTime: (time: Date | null) => void;
  setCurrentChallengeIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setChallengeResults: React.Dispatch<React.SetStateAction<ChallengeResult[]>>;
  setAdaptiveMetrics: React.Dispatch<React.SetStateAction<AdaptiveMetrics>>;
  setLoading: (loading: boolean) => void;
}

interface MasterTrainingState {
  adaptiveScenarios: AdaptiveScenario[];
  pathScenarioMap: Record<string, string[]>;
  learningPaths: LearningPath[];
  selectedPath: LearningPath | null;
  currentSession: MasterTrainingSession | null;
  sessionStartTime: Date | null;
  currentChallengeIndex: number;
  selectedAnswer: string | null;
  challengeResults: ChallengeResult[];
}

export function useMasterTrainingCallbacks(
  state: MasterTrainingState,
  storage: MasterTrainingStorage,
  callbacks: MasterTrainingCallbacks,
) {
  const loadProgress = async () => {
    const paths = await loadMasterTrainingProgress(storage);
    callbacks.setLearningPaths(paths);
    callbacks.setLoading(false);
  };

  const sessionCallbacks = useMasterTrainingSessionCallbacks(
    state.adaptiveScenarios,
    state.pathScenarioMap,
    state.selectedPath,
    {
      setSelectedPath: callbacks.setSelectedPath,
      setCurrentSession: callbacks.setCurrentSession,
      setPhase: callbacks.setPhase,
      setTrainingActive: callbacks.setTrainingActive,
      setSessionStartTime: callbacks.setSessionStartTime,
      setCurrentChallengeIndex: callbacks.setCurrentChallengeIndex,
      setSelectedAnswer: callbacks.setSelectedAnswer,
      setChallengeResults: callbacks.setChallengeResults,
    },
  );

  const challengeCallbacks = useMasterTrainingChallengeCallbacks(
    state.currentSession,
    state.selectedAnswer,
    state.currentChallengeIndex,
    {
      setSelectedAnswer: callbacks.setSelectedAnswer,
      setChallengeResults: callbacks.setChallengeResults,
      setAdaptiveMetrics: callbacks.setAdaptiveMetrics,
      setCurrentChallengeIndex: callbacks.setCurrentChallengeIndex,
    },
  );

  const completionCallbacks = useMasterTrainingCompletionCallbacks(
    {
      learningPaths: state.learningPaths,
      selectedPath: state.selectedPath,
      currentSession: state.currentSession,
      sessionStartTime: state.sessionStartTime,
      challengeResults: state.challengeResults,
      pathScenarioMap: state.pathScenarioMap,
    },
    storage,
    callbacks,
  );

  return {
    loadProgress,
    saveProgress: storage.saveProgress,
    ...sessionCallbacks,
    ...challengeCallbacks,
    ...completionCallbacks,
  };
}
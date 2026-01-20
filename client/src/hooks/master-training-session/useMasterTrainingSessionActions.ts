/**
 * Master Training Session Actions Hook
 * Handles action callbacks for master training sessions
 */

import type {
  MasterTrainingSession,
  AdaptiveScenario,
  LearningPath,
} from "../../pages/MasterTraining";
import type { SessionState } from "./useMasterTrainingSessionState";
import { useMasterTrainingSessionChallengeActions } from "./useMasterTrainingSessionChallengeActions";
import { useMasterTrainingSessionManagementActions } from "./useMasterTrainingSessionManagementActions";

interface UseMasterTrainingSessionActionsProps {
  state: SessionState;
  setters: {
    setCurrentSession: (session: MasterTrainingSession | null) => void;
    setTrainingActive: (active: boolean) => void;
    setSessionStartTime: (time: Date | null) => void;
    setCurrentChallengeIndex: (index: number) => void;
    setSelectedAnswer: (answer: string | null) => void;
    setChallengeResults: (results: SessionState["challengeResults"]) => void;
    setAdaptiveMetrics: (metrics: SessionState["adaptiveMetrics"]) => void;
  };
}

export interface SessionActions {
  beginSession: (
    selectedPath: LearningPath,
    adaptiveScenarios: AdaptiveScenario[],
    pathScenarioMap: Record<string, string[]>,
  ) => void;
  selectAnswer: (answerId: string) => void;
  submitAnswer: () => void;
  nextChallenge: () => void;
  completeSession: (
    selectedPath: LearningPath,
    learningPaths: LearningPath[],
    pathScenarioMap: Record<string, string[]>,
    onComplete: (updatedPaths: LearningPath[]) => void,
  ) => void;
  resetSession: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
}

export function useMasterTrainingSessionActions({
  state,
  setters,
}: UseMasterTrainingSessionActionsProps): SessionActions {
  const challengeActions = useMasterTrainingSessionChallengeActions({
    state,
    setters,
  });

  const managementActions = useMasterTrainingSessionManagementActions({
    state,
    setters,
  });

  return {
    ...challengeActions,
    ...managementActions,
  };
}
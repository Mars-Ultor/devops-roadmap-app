/**
 * Master Training Session Management Actions Hook
 * Handles session management action callbacks
 */

import { useCallback } from "react";
import type {
  MasterTrainingSession,
  AdaptiveScenario,
  LearningPath,
} from "../../pages/MasterTraining";
import type { SessionState } from "./useMasterTrainingSessionState";
import {
  createSession,
  calculateSessionResults,
  updatePathsAfterCompletion,
  createFinalSession,
} from "../masterTrainingSessionUtils";

interface UseMasterTrainingSessionManagementActionsProps {
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

export interface SessionManagementActions {
  beginSession: (
    selectedPath: LearningPath,
    adaptiveScenarios: AdaptiveScenario[],
    pathScenarioMap: Record<string, string[]>,
  ) => void;
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

export function useMasterTrainingSessionManagementActions({
  state,
  setters,
}: UseMasterTrainingSessionManagementActionsProps): SessionManagementActions {
  const beginSession = useCallback(
    (
      selectedPath: LearningPath,
      adaptiveScenarios: AdaptiveScenario[],
      pathScenarioMap: Record<string, string[]>,
    ) => {
      const session = createSession(
        selectedPath,
        adaptiveScenarios,
        pathScenarioMap,
      );
      if (!session) {
        alert(
          "Congratulations! You've completed all scenarios in this learning path!",
        );
        return;
      }
      setters.setCurrentSession(session);
      setters.setSessionStartTime(new Date());
      setters.setCurrentChallengeIndex(0);
      setters.setSelectedAnswer(null);
      setters.setChallengeResults([]);
      setters.setTrainingActive(true);
    },
    [setters],
  );

  const completeSession = useCallback(
    (
      selectedPath: LearningPath,
      learningPaths: LearningPath[],
      pathScenarioMap: Record<string, string[]>,
      onComplete: (updatedPaths: LearningPath[]) => void,
    ) => {
      if (!state.currentSession) return;
      const { endTime, timeSpent, score } = calculateSessionResults(
        state.currentSession,
        state.sessionStartTime,
        state.challengeResults,
      );
      const updatedPaths = updatePathsAfterCompletion(
        learningPaths,
        selectedPath,
        state.currentSession.currentScenario.id,
        pathScenarioMap,
      );
      onComplete(updatedPaths);
      setters.setCurrentSession(
        createFinalSession(
          state.currentSession,
          endTime,
          timeSpent,
          score,
          state.challengeResults,
        ),
      );
      setters.setTrainingActive(false);
    },
    [state.currentSession, state.sessionStartTime, state.challengeResults, setters],
  );

  const resetSession = useCallback(() => {
    setters.setCurrentSession(null);
    setters.setSessionStartTime(null);
    setters.setCurrentChallengeIndex(0);
    setters.setSelectedAnswer(null);
    setters.setChallengeResults([]);
    setters.setTrainingActive(false);
    setters.setAdaptiveMetrics({
      performanceScore: 0,
      difficultyAdjustment: 0,
      timeEfficiency: 0,
      learningVelocity: 0,
    });
  }, [setters]);

  const pauseTraining = useCallback(() => setters.setTrainingActive(false), [setters]);
  const resumeTraining = useCallback(() => setters.setTrainingActive(true), [setters]);

  return {
    beginSession,
    completeSession,
    resetSession,
    pauseTraining,
    resumeTraining,
  };
}
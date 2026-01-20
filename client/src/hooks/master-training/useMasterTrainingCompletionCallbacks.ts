/**
 * Master Training Completion Callbacks
 * Extracted completion and control callbacks
 */

import { useCallback } from "react";
import type {
  LearningPath,
  MasterTrainingSession,
} from "../../pages/MasterTraining";
import {
  updatePathProgress,
  calculateSessionScore,
  finalizeSession,
  getDefaultAdaptiveMetrics,
} from "./masterTrainingUtils";
import {
  saveMasterTrainingProgress,
} from "./masterTrainingOperations";
import type { MasterTrainingStorage } from "./masterTrainingOperations";
import type { ChallengeResult, MasterTrainingPhase, AdaptiveMetrics } from "./masterTrainingUtils";

interface CompletionCallbacks {
  setLearningPaths: React.Dispatch<React.SetStateAction<LearningPath[]>>;
  setCurrentSession: (session: MasterTrainingSession | null) => void;
  setPhase: (phase: MasterTrainingPhase) => void;
  setTrainingActive: (active: boolean) => void;
  setSessionStartTime: (time: Date | null) => void;
  setCurrentChallengeIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setChallengeResults: React.Dispatch<React.SetStateAction<ChallengeResult[]>>;
  setAdaptiveMetrics: React.Dispatch<React.SetStateAction<AdaptiveMetrics>>;
}

interface CompletionState {
  learningPaths: LearningPath[];
  selectedPath: LearningPath | null;
  currentSession: MasterTrainingSession | null;
  sessionStartTime: Date | null;
  challengeResults: ChallengeResult[];
  pathScenarioMap: Record<string, string[]>;
}

export function useMasterTrainingCompletionCallbacks(
  state: CompletionState,
  storage: MasterTrainingStorage,
  callbacks: CompletionCallbacks,
) {
  const saveProgress = useCallback(
    async (updatedPaths: LearningPath[]) => {
      await saveMasterTrainingProgress(storage, updatedPaths);
    },
    [storage],
  );

  const completeSession = useCallback(() => {
    if (!state.currentSession || !state.selectedPath) return;
    const timeSpent = state.sessionStartTime
      ? Date.now() - state.sessionStartTime.getTime()
      : 0;
    const score = calculateSessionScore(
      state.challengeResults,
      state.currentSession.currentScenario.challenges.length,
    );
    const updatedPaths = updatePathProgress(
      state.learningPaths,
      state.selectedPath,
      state.currentSession.currentScenario.id,
      state.pathScenarioMap,
    );
    callbacks.setLearningPaths(updatedPaths);
    saveProgress(updatedPaths);
    callbacks.setCurrentSession(
      finalizeSession(state.currentSession, state.challengeResults, timeSpent, score),
    );
    callbacks.setTrainingActive(false);
    callbacks.setPhase("progress");
  }, [
    state.currentSession,
    state.selectedPath,
    state.sessionStartTime,
    state.challengeResults,
    state.learningPaths,
    state.pathScenarioMap,
    saveProgress,
    callbacks,
  ]);

  const resetSession = useCallback(() => {
    callbacks.setCurrentSession(null);
    callbacks.setSessionStartTime(null);
    callbacks.setCurrentChallengeIndex(0);
    callbacks.setSelectedAnswer(null);
    callbacks.setChallengeResults([]);
    callbacks.setTrainingActive(false);
    callbacks.setAdaptiveMetrics(getDefaultAdaptiveMetrics());
  }, [callbacks]);

  const pauseTraining = useCallback(() => {
    callbacks.setTrainingActive(false);
  }, [callbacks]);

  const resumeTraining = useCallback(() => {
    callbacks.setTrainingActive(true);
  }, [callbacks]);

  const backToPathOverview = useCallback(() => {
    resetSession();
    callbacks.setPhase("path-overview");
  }, [resetSession, callbacks]);

  const goToPhase = useCallback((newPhase: MasterTrainingPhase) => {
    callbacks.setPhase(newPhase);
  }, [callbacks]);

  return {
    completeSession,
    resetSession,
    pauseTraining,
    resumeTraining,
    backToPathOverview,
    goToPhase,
  };
}
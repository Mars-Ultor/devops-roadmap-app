/**
 * Master Training Session Callbacks
 * Extracted session-related callbacks
 */

import { useCallback } from "react";
import type {
  LearningPath,
  MasterTrainingSession,
  AdaptiveScenario,
} from "../../pages/MasterTraining";
import {
  findNextScenarioId,
  createTrainingSession,
} from "./masterTrainingUtils";
import type { ChallengeResult, MasterTrainingPhase } from "./masterTrainingUtils";

interface SessionCallbacks {
  setSelectedPath: (path: LearningPath | null) => void;
  setCurrentSession: (session: MasterTrainingSession | null) => void;
  setPhase: (phase: MasterTrainingPhase) => void;
  setTrainingActive: (active: boolean) => void;
  setSessionStartTime: (time: Date | null) => void;
  setCurrentChallengeIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setChallengeResults: React.Dispatch<React.SetStateAction<ChallengeResult[]>>;
}

export function useMasterTrainingSessionCallbacks(
  adaptiveScenarios: AdaptiveScenario[],
  pathScenarioMap: Record<string, string[]>,
  selectedPath: LearningPath | null,
  callbacks: SessionCallbacks,
) {
  const startLearningPath = useCallback((path: LearningPath) => {
    callbacks.setSelectedPath(path);
    callbacks.setPhase("path-overview");
  }, [callbacks]);

  const beginTrainingSession = useCallback(() => {
    if (!selectedPath) return;
    const nextScenarioId = findNextScenarioId(selectedPath, pathScenarioMap);
    if (!nextScenarioId) {
      alert("Congratulations! You've completed all scenarios!");
      return;
    }
    const scenario =
      adaptiveScenarios.find((s) => s.id === nextScenarioId) ||
      adaptiveScenarios[0];
    callbacks.setCurrentSession(createTrainingSession(selectedPath, scenario));
    callbacks.setSessionStartTime(new Date());
    callbacks.setCurrentChallengeIndex(0);
    callbacks.setSelectedAnswer(null);
    callbacks.setChallengeResults([]);
    callbacks.setTrainingActive(true);
    callbacks.setPhase("training");
  }, [selectedPath, adaptiveScenarios, pathScenarioMap, callbacks]);

  return {
    startLearningPath,
    beginTrainingSession,
  };
}
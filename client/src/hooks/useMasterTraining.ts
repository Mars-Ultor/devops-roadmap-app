/**
 * Master Training Hook - Refactored
 * Manages AI-driven learning paths and training sessions
 */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  LearningPath,
  MasterTrainingSession,
  AdaptiveScenario,
} from "../pages/MasterTraining";
import { useMasterTrainingStorage } from "./useMasterTrainingStorage";
import {
  getDefaultAdaptiveMetrics,
  findNextScenarioId,
  createTrainingSession,
  updatePathProgress,
  calculateSessionScore,
  finalizeSession,
} from "./master-training/masterTrainingUtils";
import type {
  MasterTrainingState,
  MasterTrainingActions,
  ChallengeResult,
} from "./master-training/masterTrainingUtils";

export type { MasterTrainingState, MasterTrainingActions };

export const useMasterTraining = (
  adaptiveScenarios: AdaptiveScenario[],
  pathScenarioMap: Record<string, string[]>,
) => {
  const { user } = useAuthStore();
  const {
    loadProgress: loadStorageProgress,
    saveProgress: saveStorageProgress,
  } = useMasterTrainingStorage(user?.uid);

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentSession, setCurrentSession] =
    useState<MasterTrainingSession | null>(null);
  const [phase, setPhase] = useState<MasterTrainingState["phase"]>("selection");
  const [trainingActive, setTrainingActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeResults, setChallengeResults] = useState<ChallengeResult[]>(
    [],
  );
  const [adaptiveMetrics, setAdaptiveMetrics] = useState(
    getDefaultAdaptiveMetrics(),
  );
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    const result = await loadStorageProgress();
    setLearningPaths(result.paths);
    setLoading(false);
  }, [loadStorageProgress]);

  const saveProgress = useCallback(
    async (updatedPaths: LearningPath[]) => {
      await saveStorageProgress(updatedPaths);
    },
    [saveStorageProgress],
  );
  const startLearningPath = useCallback((path: LearningPath) => {
    setSelectedPath(path);
    setPhase("path-overview");
  }, []);

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
    setCurrentSession(createTrainingSession(selectedPath, scenario));
    setSessionStartTime(new Date());
    setCurrentChallengeIndex(0);
    setSelectedAnswer(null);
    setChallengeResults([]);
    setTrainingActive(true);
    setPhase("training");
  }, [selectedPath, adaptiveScenarios, pathScenarioMap]);

  const selectAnswer = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentSession || !selectedAnswer) return;
    const challenge =
      currentSession.currentScenario.challenges[currentChallengeIndex];
    const isCorrect = selectedAnswer === challenge.correctOptionId;
    setChallengeResults((prev) => [
      ...prev,
      {
        challengeId: challenge.id,
        correct: isCorrect,
        selectedOptionId: selectedAnswer,
      },
    ]);
    setAdaptiveMetrics((prev) => ({
      ...prev,
      performanceScore: prev.performanceScore + (isCorrect ? 10 : 0),
    }));
    setSelectedAnswer(null);
  }, [currentSession, selectedAnswer, currentChallengeIndex]);

  const nextChallenge = useCallback(() => {
    if (!currentSession) return;
    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex < currentSession.currentScenario.challenges.length)
      setCurrentChallengeIndex(nextIndex);
  }, [currentSession, currentChallengeIndex]);

  const completeSession = useCallback(() => {
    if (!currentSession || !selectedPath) return;
    const timeSpent = sessionStartTime
      ? Date.now() - sessionStartTime.getTime()
      : 0;
    const score = calculateSessionScore(
      challengeResults,
      currentSession.currentScenario.challenges.length,
    );
    const updatedPaths = updatePathProgress(
      learningPaths,
      selectedPath,
      currentSession.currentScenario.id,
      pathScenarioMap,
    );
    setLearningPaths(updatedPaths);
    saveProgress(updatedPaths);
    setCurrentSession(
      finalizeSession(currentSession, challengeResults, timeSpent, score),
    );
    setTrainingActive(false);
    setPhase("progress");
  }, [
    currentSession,
    selectedPath,
    sessionStartTime,
    challengeResults,
    learningPaths,
    pathScenarioMap,
    saveProgress,
  ]);

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setSessionStartTime(null);
    setCurrentChallengeIndex(0);
    setSelectedAnswer(null);
    setChallengeResults([]);
    setTrainingActive(false);
    setAdaptiveMetrics(getDefaultAdaptiveMetrics());
  }, []);

  const pauseTraining = useCallback(() => {
    setTrainingActive(false);
  }, []);
  const resumeTraining = useCallback(() => {
    setTrainingActive(true);
  }, []);
  const backToPathOverview = useCallback(() => {
    resetSession();
    setPhase("path-overview");
  }, [resetSession]);
  const goToPhase = useCallback((newPhase: MasterTrainingState["phase"]) => {
    setPhase(newPhase);
  }, []);

  useEffect(() => {
    if (user) loadProgress();
    else setLoading(false);
  }, [user, loadProgress]);

  const state: MasterTrainingState = {
    learningPaths,
    selectedPath,
    currentSession,
    phase,
    trainingActive,
    sessionStartTime,
    currentChallengeIndex,
    selectedAnswer,
    challengeResults,
    adaptiveMetrics,
    loading,
  };
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
};

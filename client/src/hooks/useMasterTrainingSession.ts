import { useState, useCallback } from "react";
import type {
  MasterTrainingSession,
  AdaptiveScenario,
  LearningPath,
} from "../pages/MasterTraining";
import {
  initialMetrics,
  createSession,
  calculateSessionResults,
  updatePathsAfterCompletion,
  createFinalSession,
} from "./masterTrainingSessionUtils";

export interface SessionState {
  currentSession: MasterTrainingSession | null;
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

export const useMasterTrainingSession = () => {
  const [currentSession, setCurrentSession] =
    useState<MasterTrainingSession | null>(null);
  const [trainingActive, setTrainingActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeResults, setChallengeResults] = useState<
    SessionState["challengeResults"]
  >([]);
  const [adaptiveMetrics, setAdaptiveMetrics] = useState(initialMetrics);

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
      setCurrentSession(session);
      setSessionStartTime(new Date());
      setCurrentChallengeIndex(0);
      setSelectedAnswer(null);
      setChallengeResults([]);
      setTrainingActive(true);
    },
    [],
  );

  const selectAnswer = useCallback(
    (answerId: string) => setSelectedAnswer(answerId),
    [],
  );

  const submitAnswer = useCallback(() => {
    if (!currentSession || !selectedAnswer) return;
    const currentChallenge =
      currentSession.currentScenario.challenges[currentChallengeIndex];
    const isCorrect = selectedAnswer === currentChallenge.correctOptionId;
    setChallengeResults((prev) => [
      ...prev,
      {
        challengeId: currentChallenge.id,
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
    if (nextIndex < currentSession.currentScenario.challenges.length) {
      setCurrentChallengeIndex(nextIndex);
    }
  }, [currentSession, currentChallengeIndex]);

  const completeSession = useCallback(
    (
      selectedPath: LearningPath,
      learningPaths: LearningPath[],
      pathScenarioMap: Record<string, string[]>,
      onComplete: (updatedPaths: LearningPath[]) => void,
    ) => {
      if (!currentSession) return;
      const { endTime, timeSpent, score } = calculateSessionResults(
        currentSession,
        sessionStartTime,
        challengeResults,
      );
      const updatedPaths = updatePathsAfterCompletion(
        learningPaths,
        selectedPath,
        currentSession.currentScenario.id,
        pathScenarioMap,
      );
      onComplete(updatedPaths);
      setCurrentSession(
        createFinalSession(
          currentSession,
          endTime,
          timeSpent,
          score,
          challengeResults,
        ),
      );
      setTrainingActive(false);
    },
    [currentSession, sessionStartTime, challengeResults],
  );

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setSessionStartTime(null);
    setCurrentChallengeIndex(0);
    setSelectedAnswer(null);
    setChallengeResults([]);
    setTrainingActive(false);
    setAdaptiveMetrics(initialMetrics);
  }, []);

  const pauseTraining = useCallback(() => setTrainingActive(false), []);
  const resumeTraining = useCallback(() => setTrainingActive(true), []);

  return {
    state: {
      currentSession,
      trainingActive,
      sessionStartTime,
      currentChallengeIndex,
      selectedAnswer,
      challengeResults,
      adaptiveMetrics,
    } as SessionState,
    actions: {
      beginSession,
      selectAnswer,
      submitAnswer,
      nextChallenge,
      completeSession,
      resetSession,
      pauseTraining,
      resumeTraining,
    } as SessionActions,
  };
};

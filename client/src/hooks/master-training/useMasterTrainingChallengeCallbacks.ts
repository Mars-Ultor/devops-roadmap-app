/**
 * Master Training Challenge Callbacks
 * Extracted challenge-related callbacks
 */

import { useCallback } from "react";
import type { MasterTrainingSession } from "../../pages/MasterTraining";
import type { ChallengeResult, AdaptiveMetrics } from "./masterTrainingUtils";

interface ChallengeCallbacks {
  setSelectedAnswer: (answer: string | null) => void;
  setChallengeResults: React.Dispatch<React.SetStateAction<ChallengeResult[]>>;
  setAdaptiveMetrics: React.Dispatch<React.SetStateAction<AdaptiveMetrics>>;
  setCurrentChallengeIndex: (index: number) => void;
}

export function useMasterTrainingChallengeCallbacks(
  currentSession: MasterTrainingSession | null,
  selectedAnswer: string | null,
  currentChallengeIndex: number,
  callbacks: ChallengeCallbacks,
) {
  const selectAnswer = useCallback((answerId: string) => {
    callbacks.setSelectedAnswer(answerId);
  }, [callbacks]);

  const submitAnswer = useCallback(() => {
    if (!currentSession || !selectedAnswer) return;
    const challenge =
      currentSession.currentScenario.challenges[currentChallengeIndex];
    const isCorrect = selectedAnswer === challenge.correctOptionId;
    callbacks.setChallengeResults((prev) => [
      ...prev,
      {
        challengeId: challenge.id,
        correct: isCorrect,
        selectedOptionId: selectedAnswer,
      },
    ]);
    callbacks.setAdaptiveMetrics((prev) => ({
      ...prev,
      performanceScore: prev.performanceScore + (isCorrect ? 10 : 0),
    }));
    callbacks.setSelectedAnswer(null);
  }, [currentSession, selectedAnswer, currentChallengeIndex, callbacks]);

  const nextChallenge = useCallback(() => {
    if (!currentSession) return;
    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex < currentSession.currentScenario.challenges.length)
      callbacks.setCurrentChallengeIndex(nextIndex);
  }, [currentSession, currentChallengeIndex, callbacks]);

  return {
    selectAnswer,
    submitAnswer,
    nextChallenge,
  };
}
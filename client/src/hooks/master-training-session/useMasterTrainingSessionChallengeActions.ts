/**
 * Master Training Session Challenge Actions Hook
 * Handles challenge-related action callbacks
 */

import { useCallback } from "react";
import type { SessionState } from "./useMasterTrainingSessionState";

interface UseMasterTrainingSessionChallengeActionsProps {
  state: SessionState;
  setters: {
    setCurrentChallengeIndex: (index: number) => void;
    setSelectedAnswer: (answer: string | null) => void;
    setChallengeResults: (results: SessionState["challengeResults"]) => void;
    setAdaptiveMetrics: (metrics: SessionState["adaptiveMetrics"]) => void;
  };
}

export interface SessionChallengeActions {
  selectAnswer: (answerId: string) => void;
  submitAnswer: () => void;
  nextChallenge: () => void;
}

export function useMasterTrainingSessionChallengeActions({
  state,
  setters,
}: UseMasterTrainingSessionChallengeActionsProps): SessionChallengeActions {
  const selectAnswer = useCallback(
    (answerId: string) => setters.setSelectedAnswer(answerId),
    [setters],
  );

  const submitAnswer = useCallback(() => {
    if (!state.currentSession || !state.selectedAnswer) return;
    const currentChallenge =
      state.currentSession.currentScenario.challenges[state.currentChallengeIndex];
    const isCorrect = state.selectedAnswer === currentChallenge.correctOptionId;
    setters.setChallengeResults((prev) => [
      ...prev,
      {
        challengeId: currentChallenge.id,
        correct: isCorrect,
        selectedOptionId: state.selectedAnswer!,
      },
    ]);
    setters.setAdaptiveMetrics((prev) => ({
      ...prev,
      performanceScore: prev.performanceScore + (isCorrect ? 10 : 0),
    }));
    setters.setSelectedAnswer(null);
  }, [state.currentSession, state.selectedAnswer, state.currentChallengeIndex, setters]);

  const nextChallenge = useCallback(() => {
    if (!state.currentSession) return;
    const nextIndex = state.currentChallengeIndex + 1;
    if (nextIndex < state.currentSession.currentScenario.challenges.length) {
      setters.setCurrentChallengeIndex(nextIndex);
    }
  }, [state.currentSession, state.currentChallengeIndex, setters]);

  return {
    selectAnswer,
    submitAnswer,
    nextChallenge,
  };
}
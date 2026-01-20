/**
 * Master Training Session State Hook
 * Manages state for master training sessions
 */

import { useState } from "react";
import type {
  MasterTrainingSession,
} from "../pages/MasterTraining";
import { initialMetrics } from "./masterTrainingSessionUtils";

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

export function useMasterTrainingSessionState(): [
  SessionState,
  {
    setCurrentSession: (session: MasterTrainingSession | null) => void;
    setTrainingActive: (active: boolean) => void;
    setSessionStartTime: (time: Date | null) => void;
    setCurrentChallengeIndex: (index: number) => void;
    setSelectedAnswer: (answer: string | null) => void;
    setChallengeResults: (results: SessionState["challengeResults"]) => void;
    setAdaptiveMetrics: (metrics: SessionState["adaptiveMetrics"]) => void;
  }
] {
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

  const state: SessionState = {
    currentSession,
    trainingActive,
    sessionStartTime,
    currentChallengeIndex,
    selectedAnswer,
    challengeResults,
    adaptiveMetrics,
  };

  const setters = {
    setCurrentSession,
    setTrainingActive,
    setSessionStartTime,
    setCurrentChallengeIndex,
    setSelectedAnswer,
    setChallengeResults,
    setAdaptiveMetrics,
  };

  return [state, setters];
}
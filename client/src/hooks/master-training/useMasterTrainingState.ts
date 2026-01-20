/**
 * Master Training State Hook
 * Manages state for master training functionality
 */

import { useState } from "react";
import type {
  LearningPath,
  MasterTrainingSession,
} from "../pages/MasterTraining";
import {
  getDefaultAdaptiveMetrics,
} from "./masterTrainingUtils";
import type {
  MasterTrainingState,
  ChallengeResult,
  AdaptiveMetrics,
} from "./masterTrainingUtils";

export function useMasterTrainingState(): [
  MasterTrainingState,
  {
    setLearningPaths: (paths: LearningPath[]) => void;
    setSelectedPath: (path: LearningPath | null) => void;
    setCurrentSession: (session: MasterTrainingSession | null) => void;
    setPhase: (phase: MasterTrainingState["phase"]) => void;
    setTrainingActive: (active: boolean) => void;
    setSessionStartTime: (time: Date | null) => void;
    setCurrentChallengeIndex: (index: number) => void;
    setSelectedAnswer: (answer: string | null) => void;
    setChallengeResults: (results: ChallengeResult[]) => void;
    setAdaptiveMetrics: (metrics: AdaptiveMetrics) => void;
    setLoading: (loading: boolean) => void;
  }
] {
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

  const setters = {
    setLearningPaths,
    setSelectedPath,
    setCurrentSession,
    setPhase,
    setTrainingActive,
    setSessionStartTime,
    setCurrentChallengeIndex,
    setSelectedAnswer,
    setChallengeResults,
    setAdaptiveMetrics,
    setLoading,
  };

  return [state, setters];
}
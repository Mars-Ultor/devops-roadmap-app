/**
 * Battle Drill State Hook
 * Manages state for battle drill attempts and performance
 */

import { useState } from "react";
import type { BattleDrillPerformance } from "../../types/training";

export interface BattleDrillState {
  performance: BattleDrillPerformance | null;
  loading: boolean;
  currentAttempt: {
    id: string;
    startTime: number;
    hintsUsed: number;
    currentStep: number;
  } | null;
}

export interface BattleDrillStateSetters {
  setPerformance: React.Dispatch<React.SetStateAction<BattleDrillPerformance | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<BattleDrillState['currentAttempt']>>;
}

export function useBattleDrillState(): BattleDrillState & BattleDrillStateSetters {
  const [performance, setPerformance] = useState<BattleDrillPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAttempt, setCurrentAttempt] = useState<BattleDrillState['currentAttempt']>(null);

  return {
    performance,
    loading,
    currentAttempt,
    setPerformance,
    setLoading,
    setCurrentAttempt,
  };
}
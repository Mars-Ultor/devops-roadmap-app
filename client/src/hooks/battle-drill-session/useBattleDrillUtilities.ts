/**
 * Battle Drill Utilities Hook
 * Extracted utility functions
 */

import { useCallback } from "react";
import {
  formatTime as formatTimeFn,
  getTimeColor as getTimeColorFn,
} from "../battle-drill/battleDrillUtils";
import type { BattleDrill } from "../../types";

interface UtilityState {
  elapsedSeconds: number;
  drill: BattleDrill | null;
}

export function useBattleDrillUtilities(state: UtilityState) {
  const formatTime = useCallback(
    (seconds: number) => formatTimeFn(seconds),
    [],
  );

  const getTimeColor = useCallback(
    () => getTimeColorFn(state.elapsedSeconds, state.drill?.targetTimeSeconds),
    [state.elapsedSeconds, state.drill],
  );

  return {
    formatTime,
    getTimeColor,
  };
}
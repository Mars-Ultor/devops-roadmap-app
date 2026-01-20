/**
 * Struggle Session Utilities Hook
 * Provides utility functions for struggle sessions
 */

import {
  calculateTimeUntilHints,
  areHintsUnlocked,
} from "./struggleSessionUtils";

interface UseStruggleSessionUtilitiesProps {
  elapsedSeconds: number;
}

export function useStruggleSessionUtilities({
  elapsedSeconds,
}: UseStruggleSessionUtilitiesProps) {
  const timeUntilHints = calculateTimeUntilHints(elapsedSeconds);
  const hintsUnlocked = areHintsUnlocked(elapsedSeconds);

  return {
    timeUntilHints,
    hintsUnlocked,
  };
}
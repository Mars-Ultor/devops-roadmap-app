/**
 * Struggle Session Hook - Refactored
 * Enforces 30-minute lockout with progressive hints
 */

import type {
  StruggleSession,
  StruggleLog,
} from "../types/training";
import { startStruggleSession } from "./struggle-session/struggleSessionUtils";
import { useStruggleSessionState } from "./struggle-session/useStruggleSessionState";
import { useStruggleSessionEffects } from "./struggle-session/useStruggleSessionEffects";
import { useStruggleSessionCallbacks } from "./struggle-session/useStruggleSessionCallbacks";
import { useStruggleSessionUtilities } from "./struggle-session/useStruggleSessionUtilities";

export { startStruggleSession };

interface UseStruggleSessionReturn {
  session: StruggleSession | null;
  loading: boolean;
  timeUntilHints: number;
  hintsUnlocked: boolean;
  requestHint: (level: number, hint: string) => Promise<void>;
  submitStruggleLog: (log: StruggleLog) => Promise<void>;
  endSession: () => Promise<void>;
  elapsedSeconds: number;
}

export function useStruggleSession(lessonId: string): UseStruggleSessionReturn {
  // Use extracted state hook
  const state = useStruggleSessionState();

  // Use extracted effects hook
  useStruggleSessionEffects({
    lessonId,
    session: state.session,
    setters: {
      setSession: state.setSession,
      setLoading: state.setLoading,
      setElapsedSeconds: state.setElapsedSeconds,
    },
  });

  // Use extracted utilities hook
  const { timeUntilHints, hintsUnlocked } = useStruggleSessionUtilities({
    elapsedSeconds: state.elapsedSeconds,
  });

  // Use extracted callbacks hook
  const { requestHint, submitStruggleLog, endSession } = useStruggleSessionCallbacks({
    session: state.session,
    hintsUnlocked,
    setSession: state.setSession,
  });

  return {
    session: state.session,
    loading: state.loading,
    timeUntilHints,
    hintsUnlocked,
    requestHint,
    submitStruggleLog,
    endSession,
    elapsedSeconds: state.elapsedSeconds,
  };
}

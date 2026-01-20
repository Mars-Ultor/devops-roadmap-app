/**
 * Struggle Session State Hook
 * Manages state for struggle session tracking
 */

import { useState } from "react";
import type { StruggleSession } from "../../types/training";

export interface StruggleSessionState {
  session: StruggleSession | null;
  loading: boolean;
  elapsedSeconds: number;
}

export interface StruggleSessionStateSetters {
  setSession: React.Dispatch<React.SetStateAction<StruggleSession | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setElapsedSeconds: React.Dispatch<React.SetStateAction<number>>;
}

export function useStruggleSessionState(): StruggleSessionState & StruggleSessionStateSetters {
  const [session, setSession] = useState<StruggleSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  return {
    session,
    loading,
    elapsedSeconds,
    setSession,
    setLoading,
    setElapsedSeconds,
  };
}
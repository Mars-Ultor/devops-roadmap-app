/**
 * Study Session State Hook
 * Manages state for study session tracking
 */

import { useState, useRef } from "react";

export interface StudySessionState {
  elapsedTime: number;
  sessionId: string | null;
  sessionStartTime: Date | null;
}

export interface StudySessionRefs {
  intervalRef: React.MutableRefObject<number | null>;
  sessionIdRef: React.MutableRefObject<string | null>;
  sessionStartTimeRef: React.MutableRefObject<Date | null>;
}

export function useStudySessionState(): StudySessionState & StudySessionRefs & { setElapsedTime: React.Dispatch<React.SetStateAction<number>> } {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

  return {
    elapsedTime,
    sessionId: sessionIdRef.current,
    sessionStartTime: sessionStartTimeRef.current,
    intervalRef,
    sessionIdRef,
    sessionStartTimeRef,
    setElapsedTime,
  };
}
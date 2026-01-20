/**
 * Study Session Effects Hook
 * Handles side effects for study session lifecycle
 */

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

interface UseStudySessionEffectsProps {
  contentId: string;
  intervalRef: React.MutableRefObject<number | null>;
  sessionIdRef: React.MutableRefObject<string | null>;
  sessionStartTimeRef: React.MutableRefObject<Date | null>;
  setElapsedTime: (time: number) => void;
  logSessionStart: () => Promise<void>;
  logSessionEnd: (endTime: Date) => Promise<void>;
}

export function useStudySessionEffects({
  contentId,
  intervalRef,
  sessionIdRef,
  sessionStartTimeRef,
  setElapsedTime,
  logSessionStart,
  logSessionEnd,
}: UseStudySessionEffectsProps) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const startTime = new Date();
    sessionStartTimeRef.current = startTime;
    sessionIdRef.current = `${user.uid}_${contentId}_${startTime.getTime()}`;

    // Update elapsed time every second
    intervalRef.current = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    // Log session start
    logSessionStart();

    return () => {
      // Clean up and log session end
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sessionStartTimeRef.current) {
        logSessionEnd(new Date());
      }
    };
  }, [user, contentId, logSessionStart, logSessionEnd, setElapsedTime, intervalRef, sessionIdRef, sessionStartTimeRef]);
}
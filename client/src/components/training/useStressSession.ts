/**
 * useStressSession - Custom hook for stress session timer
 */

import { useEffect, useState } from "react";
import type { StressTrainingSession } from "../../types/training";

interface StressSessionState {
  elapsedSeconds: number;
  remainingSeconds: number;
  timeProgress: number;
  isTimeWarning: boolean;
  isTimeCritical: boolean;
}

export function useStressSession(
  session: StressTrainingSession,
): StressSessionState {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor(
        (now.getTime() - session.startedAt.getTime()) / 1000,
      );
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

  const remainingSeconds = session.scenario.duration - elapsedSeconds;
  const timeProgress = (elapsedSeconds / session.scenario.duration) * 100;
  const isTimeWarning = timeProgress >= 75;
  const isTimeCritical = timeProgress >= 90;

  return {
    elapsedSeconds,
    remainingSeconds,
    timeProgress,
    isTimeWarning,
    isTimeCritical,
  };
}

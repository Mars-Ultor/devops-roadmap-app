import { useStudySessionState } from "./study-session/useStudySessionState";
import { useStudySessionCallbacks } from "./study-session/useStudySessionCallbacks";
import { useStudySessionEffects } from "./study-session/useStudySessionEffects";
import { useStudySessionUtilities } from "./study-session/useStudySessionUtilities";

interface UseStudySessionProps {
  contentId: string;
  contentType: "lesson" | "lab" | "quiz";
}

export function useStudySession({
  contentId,
  contentType,
}: UseStudySessionProps) {
  // Use extracted state hook
  const state = useStudySessionState();

  // Use extracted callbacks hook
  const { logSessionStart, logSessionEnd } = useStudySessionCallbacks({
    contentId,
    contentType,
    sessionIdRef: state.sessionIdRef,
    sessionStartTimeRef: state.sessionStartTimeRef,
  });

  // Use extracted effects hook
  useStudySessionEffects({
    contentId,
    intervalRef: state.intervalRef,
    sessionIdRef: state.sessionIdRef,
    sessionStartTimeRef: state.sessionStartTimeRef,
    setElapsedTime: state.setElapsedTime,
    logSessionStart,
    logSessionEnd,
  });

  // Use extracted utilities hook
  const { formatTime } = useStudySessionUtilities();

  return {
    elapsedTime: state.elapsedTime,
    formattedTime: formatTime(state.elapsedTime),
    sessionStartTime: state.sessionStartTime,
  };
}

/**
 * Study Session Callbacks Hook
 * Handles logging callbacks for study sessions
 */

import { useCallback } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";

interface UseStudySessionCallbacksProps {
  contentId: string;
  contentType: "lesson" | "lab" | "quiz";
  sessionIdRef: React.MutableRefObject<string | null>;
  sessionStartTimeRef: React.MutableRefObject<Date | null>;
}

export function useStudySessionCallbacks({
  contentId,
  contentType,
  sessionIdRef,
  sessionStartTimeRef,
}: UseStudySessionCallbacksProps) {
  const { user } = useAuthStore();

  const logSessionStart = useCallback(async () => {
    if (!user || !sessionIdRef.current) return;

    try {
      await setDoc(doc(db, "studySessions", sessionIdRef.current), {
        userId: user.uid,
        contentId,
        contentType,
        startTime: serverTimestamp(),
        endTime: null,
        duration: 0,
        completed: false,
      });
      console.log("✅ Study session started:", sessionIdRef.current);
    } catch (error) {
      console.error("Error logging session start:", error);
    }
  }, [user, contentId, contentType, sessionIdRef]);

  const logSessionEnd = useCallback(
    async (endTime: Date) => {
      if (!user || !sessionIdRef.current || !sessionStartTimeRef.current)
        return;

      const duration = Math.floor(
        (endTime.getTime() - sessionStartTimeRef.current.getTime()) / 1000,
      );

      try {
        await setDoc(doc(db, "studySessions", sessionIdRef.current), {
          userId: user.uid,
          contentId,
          contentType,
          startTime: sessionStartTimeRef.current,
          endTime: serverTimestamp(),
          duration,
          completed: true,
        });
        console.log(
          "✅ Study session ended:",
          sessionIdRef.current,
          "Duration:",
          duration,
          "seconds",
        );
      } catch (error) {
        console.error("Error logging session end:", error);
      }
    },
    [user, contentId, contentType, sessionIdRef, sessionStartTimeRef],
  );

  return {
    logSessionStart,
    logSessionEnd,
  };
}
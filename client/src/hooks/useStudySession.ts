import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";

interface UseStudySessionProps {
  contentId: string;
  contentType: "lesson" | "lab" | "quiz";
}

export function useStudySession({
  contentId,
  contentType,
}: UseStudySessionProps) {
  const { user } = useAuthStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

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
  }, [user, contentId, contentType]);

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
    [user, contentId, contentType],
  );

  // Start session on mount
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
  }, [user, contentId, logSessionStart, logSessionEnd]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    sessionStartTime: sessionStartTimeRef.current,
  };
}

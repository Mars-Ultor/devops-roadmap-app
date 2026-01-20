/**
 * Struggle Session Effects Hook
 * Handles side effects for struggle session loading and timing
 */

import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";
import { parseStruggleSession } from "./struggleSessionUtils";
import type { StruggleSessionStateSetters } from "./useStruggleSessionState";

interface UseStruggleSessionEffectsProps {
  lessonId: string;
  setters: StruggleSessionStateSetters;
}

export function useStruggleSessionEffects({
  lessonId,
  setters,
}: UseStruggleSessionEffectsProps) {
  const { user } = useAuthStore();
  const { setSession, setLoading, setElapsedSeconds } = setters;

  useEffect(() => {
    async function loadSession() {
      if (!user?.uid || !lessonId) {
        setLoading(false);
        return;
      }
      try {
        const sessionDoc = await getDoc(
          doc(db, "struggleSessions", `${user.uid}_${lessonId}`),
        );
        if (sessionDoc.exists())
          setSession(parseStruggleSession(sessionDoc.data()));
      } catch (error) {
        console.error("Error loading struggle session:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [user?.uid, lessonId, setSession, setLoading]);

  useEffect(() => {
    if (!setters.session || setters.session.endedAt) return;
    const interval = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - setters.session!.startedAt.getTime()) / 1000),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [setters.session, setElapsedSeconds]);
}
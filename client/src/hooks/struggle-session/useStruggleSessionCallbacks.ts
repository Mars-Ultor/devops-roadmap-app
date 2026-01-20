/**
 * Struggle Session Callbacks Hook
 * Handles callback functions for struggle session operations
 */

import { useCallback } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";
import type { StruggleSession, HintRequest, StruggleLog } from "../../types/training";
import {
  prepareHintForFirestore,
  prepareStruggleLogForFirestore,
} from "./struggleSessionUtils";

interface UseStruggleSessionCallbacksProps {
  session: StruggleSession | null;
  hintsUnlocked: boolean;
  setSession: React.Dispatch<React.SetStateAction<StruggleSession | null>>;
}

export function useStruggleSessionCallbacks({
  session,
  hintsUnlocked,
  setSession,
}: UseStruggleSessionCallbacksProps) {
  const { user } = useAuthStore();

  const requestHint = useCallback(
    async (level: number, hint: string) => {
      if (!user?.uid || !session || !hintsUnlocked) return;
      const hintRequest: HintRequest = {
        hintLevel: level,
        requestedAt: new Date(),
        hint,
      };
      const updatedHints = [...(session.hintsRequested || []), hintRequest];
      try {
        await updateDoc(doc(db, "struggleSessions", session.id), {
          hintsRequested: prepareHintForFirestore(updatedHints),
        });
        setSession((prev) =>
          prev ? { ...prev, hintsRequested: updatedHints } : null,
        );
      } catch (error) {
        console.error("Error requesting hint:", error);
      }
    },
    [user?.uid, session, hintsUnlocked, setSession],
  );

  const submitStruggleLog = useCallback(
    async (log: StruggleLog) => {
      if (!user?.uid || !session) return;
      try {
        await updateDoc(doc(db, "struggleSessions", session.id), {
          struggleLog: prepareStruggleLogForFirestore(log),
        });
        setSession((prev) => (prev ? { ...prev, struggleLog: log } : null));
      } catch (error) {
        console.error("Error submitting struggle log:", error);
      }
    },
    [user?.uid, session, setSession],
  );

  const endSession = useCallback(async () => {
    if (!user?.uid || !session) return;
    try {
      const now = new Date();
      const struggleEnduranceSeconds = Math.floor(
        (now.getTime() - session.startedAt.getTime()) / 1000,
      );
      await updateDoc(doc(db, "struggleSessions", session.id), {
        endedAt: serverTimestamp(),
        struggleEnduranceSeconds,
      });
      setSession((prev) =>
        prev ? { ...prev, endedAt: now, struggleEnduranceSeconds } : null,
      );
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }, [user?.uid, session, setSession]);

  return {
    requestHint,
    submitStruggleLog,
    endSession,
  };
}
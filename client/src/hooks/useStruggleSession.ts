/**
 * Hook for managing time-boxed struggle sessions
 * Enforces 30-minute lockout with progressive hints
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { StruggleSession, HintRequest, StruggleLog } from '../types/training';

interface UseStruggleSessionReturn {
  session: StruggleSession | null;
  loading: boolean;
  timeUntilHints: number; // seconds remaining until hints unlock
  hintsUnlocked: boolean;
  requestHint: (level: number, hint: string) => Promise<void>;
  submitStruggleLog: (log: StruggleLog) => Promise<void>;
  endSession: () => Promise<void>;
  elapsedSeconds: number;
}

const STRUGGLE_LOCKOUT_SECONDS = 30 * 60; // 30 minutes

export function useStruggleSession(lessonId: string): UseStruggleSessionReturn {
  const { user } = useAuthStore();
  const [session, setSession] = useState<StruggleSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load existing session
  useEffect(() => {
    async function loadSession() {
      if (!user?.uid || !lessonId) {
        setLoading(false);
        return;
      }

      try {
        const sessionDoc = await getDoc(
          doc(db, 'struggleSessions', `${user.uid}_${lessonId}`)
        );

        if (sessionDoc.exists()) {
          const data = sessionDoc.data();
          const sessionData: StruggleSession = {
            ...data,
            startedAt: data.startedAt?.toDate(),
            hintsUnlockAt: data.hintsUnlockAt?.toDate(),
            endedAt: data.endedAt?.toDate(),
            solutionUnlockedAt: data.solutionUnlockedAt?.toDate(),
            hintsRequested: data.hintsRequested?.map((hr: { requestedAt?: { toDate: () => Date } }) => ({
              ...hr,
              requestedAt: hr.requestedAt?.toDate()
            })) || [],
            struggleLog: data.struggleLog ? {
              ...data.struggleLog,
              createdAt: data.struggleLog.createdAt?.toDate()
            } : undefined
          } as StruggleSession;

          setSession(sessionData);
        }
      } catch (error) {
        console.error('Error loading struggle session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [user?.uid, lessonId]);

  // Timer effect
  useEffect(() => {
    if (!session || session.endedAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const timeUntilHints = Math.max(0, STRUGGLE_LOCKOUT_SECONDS - elapsedSeconds);
  const hintsUnlocked = elapsedSeconds >= STRUGGLE_LOCKOUT_SECONDS;

  const requestHint = useCallback(async (level: number, hint: string) => {
    if (!user?.uid || !session || !hintsUnlocked) return;

    const hintRequest: HintRequest = {
      hintLevel: level,
      requestedAt: new Date(),
      hint
    };

    const updatedHints = [...(session.hintsRequested || []), hintRequest];

    try {
      await updateDoc(doc(db, 'struggleSessions', session.id), {
        hintsRequested: updatedHints.map(hr => ({
          hintLevel: hr.hintLevel,
          requestedAt: hr.requestedAt,
          hint: hr.hint
        }))
      });

      setSession(prev => prev ? {
        ...prev,
        hintsRequested: updatedHints
      } : null);
    } catch (error) {
      console.error('Error requesting hint:', error);
    }
  }, [user?.uid, session, hintsUnlocked]);

  const submitStruggleLog = useCallback(async (log: StruggleLog) => {
    if (!user?.uid || !session) return;

    try {
      await updateDoc(doc(db, 'struggleSessions', session.id), {
        struggleLog: {
          attemptedSolutions: log.attemptedSolutions,
          stuckLocation: log.stuckLocation,
          hypothesis: log.hypothesis,
          createdAt: log.createdAt
        }
      });

      setSession(prev => prev ? {
        ...prev,
        struggleLog: log
      } : null);
    } catch (error) {
      console.error('Error submitting struggle log:', error);
    }
  }, [user?.uid, session]);

  const endSession = useCallback(async () => {
    if (!user?.uid || !session) return;

    try {
      const now = new Date();
      const struggleEnduranceSeconds = Math.floor(
        (now.getTime() - session.startedAt.getTime()) / 1000
      );

      await updateDoc(doc(db, 'struggleSessions', session.id), {
        endedAt: serverTimestamp(),
        struggleEnduranceSeconds
      });

      setSession(prev => prev ? {
        ...prev,
        endedAt: now,
        struggleEnduranceSeconds
      } : null);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [user?.uid, session]);

  return {
    session,
    loading,
    timeUntilHints,
    hintsUnlocked,
    requestHint,
    submitStruggleLog,
    endSession,
    elapsedSeconds
  };
}

/**
 * Start a new struggle session
 */
export async function startStruggleSession(
  userId: string,
  lessonId: string
): Promise<string> {
  const sessionId = `${userId}_${lessonId}`;
  const now = new Date();
  const hintsUnlockAt = new Date(now.getTime() + STRUGGLE_LOCKOUT_SECONDS * 1000);

  const session: Partial<StruggleSession> = {
    id: sessionId,
    userId,
    lessonId,
    startedAt: now,
    hintsUnlockAt,
    hintsRequested: [],
    struggleEnduranceSeconds: 0
  };

  await setDoc(doc(db, 'struggleSessions', sessionId), {
    ...session,
    startedAt: serverTimestamp(),
    hintsUnlockAt
  });

  return sessionId;
}

/**
 * Struggle Session Hook - Refactored
 * Enforces 30-minute lockout with progressive hints
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { StruggleSession, HintRequest, StruggleLog } from '../types/training';
import { parseStruggleSession, calculateTimeUntilHints, areHintsUnlocked, prepareHintForFirestore, prepareStruggleLogForFirestore, startStruggleSession } from './struggle-session/struggleSessionUtils';

export { startStruggleSession };

interface UseStruggleSessionReturn {
  session: StruggleSession | null;
  loading: boolean;
  timeUntilHints: number;
  hintsUnlocked: boolean;
  requestHint: (level: number, hint: string) => Promise<void>;
  submitStruggleLog: (log: StruggleLog) => Promise<void>;
  endSession: () => Promise<void>;
  elapsedSeconds: number;
}

export function useStruggleSession(lessonId: string): UseStruggleSessionReturn {
  const { user } = useAuthStore();
  const [session, setSession] = useState<StruggleSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    async function loadSession() {
      if (!user?.uid || !lessonId) { setLoading(false); return; }
      try {
        const sessionDoc = await getDoc(doc(db, 'struggleSessions', `${user.uid}_${lessonId}`));
        if (sessionDoc.exists()) setSession(parseStruggleSession(sessionDoc.data()));
      } catch (error) { console.error('Error loading struggle session:', error); }
      finally { setLoading(false); }
    }
    loadSession();
  }, [user?.uid, lessonId]);

  useEffect(() => {
    if (!session || session.endedAt) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - session.startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const timeUntilHints = calculateTimeUntilHints(elapsedSeconds);
  const hintsUnlocked = areHintsUnlocked(elapsedSeconds);

  const requestHint = useCallback(async (level: number, hint: string) => {
    if (!user?.uid || !session || !hintsUnlocked) return;
    const hintRequest: HintRequest = { hintLevel: level, requestedAt: new Date(), hint };
    const updatedHints = [...(session.hintsRequested || []), hintRequest];
    try {
      await updateDoc(doc(db, 'struggleSessions', session.id), { hintsRequested: prepareHintForFirestore(updatedHints) });
      setSession(prev => prev ? { ...prev, hintsRequested: updatedHints } : null);
    } catch (error) { console.error('Error requesting hint:', error); }
  }, [user?.uid, session, hintsUnlocked]);

  const submitStruggleLog = useCallback(async (log: StruggleLog) => {
    if (!user?.uid || !session) return;
    try {
      await updateDoc(doc(db, 'struggleSessions', session.id), { struggleLog: prepareStruggleLogForFirestore(log) });
      setSession(prev => prev ? { ...prev, struggleLog: log } : null);
    } catch (error) { console.error('Error submitting struggle log:', error); }
  }, [user?.uid, session]);

  const endSession = useCallback(async () => {
    if (!user?.uid || !session) return;
    try {
      const now = new Date();
      const struggleEnduranceSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
      await updateDoc(doc(db, 'struggleSessions', session.id), { endedAt: serverTimestamp(), struggleEnduranceSeconds });
      setSession(prev => prev ? { ...prev, endedAt: now, struggleEnduranceSeconds } : null);
    } catch (error) { console.error('Error ending session:', error); }
  }, [user?.uid, session]);

  return { session, loading, timeUntilHints, hintsUnlocked, requestHint, submitStruggleLog, endSession, elapsedSeconds };
}

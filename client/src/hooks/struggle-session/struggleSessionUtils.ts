/**
 * Struggle Session Utilities
 * Helper functions for managing timed struggle sessions
 */

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { StruggleSession, HintRequest, StruggleLog } from '../../types/training';

export const STRUGGLE_LOCKOUT_SECONDS = 30 * 60; // 30 minutes

/** Parse hint requests from Firestore data */
export function parseHintRequests(hints: Array<{ hintLevel: number; requestedAt?: { toDate: () => Date }; hint: string }> | undefined): HintRequest[] {
  if (!hints) return [];
  return hints.map(hr => ({ hintLevel: hr.hintLevel, requestedAt: hr.requestedAt?.toDate() || new Date(), hint: hr.hint }));
}

/** Parse struggle session from Firestore data */
export function parseStruggleSession(data: Record<string, unknown>): StruggleSession {
  const hintsRequested = data.hintsRequested as Array<{ hintLevel: number; requestedAt?: { toDate: () => Date }; hint: string }> | undefined;
  const struggleLog = data.struggleLog as { attemptedSolutions: string[]; stuckLocation: string; hypothesis: string; createdAt?: { toDate: () => Date } } | undefined;
  
  return {
    ...data,
    startedAt: (data.startedAt as { toDate: () => Date })?.toDate(),
    hintsUnlockAt: (data.hintsUnlockAt as { toDate: () => Date })?.toDate(),
    endedAt: (data.endedAt as { toDate: () => Date })?.toDate(),
    solutionUnlockedAt: (data.solutionUnlockedAt as { toDate: () => Date })?.toDate(),
    hintsRequested: parseHintRequests(hintsRequested),
    struggleLog: struggleLog ? { ...struggleLog, createdAt: struggleLog.createdAt?.toDate() || new Date() } : undefined
  } as StruggleSession;
}

/** Calculate time remaining until hints unlock */
export function calculateTimeUntilHints(elapsedSeconds: number): number {
  return Math.max(0, STRUGGLE_LOCKOUT_SECONDS - elapsedSeconds);
}

/** Check if hints are unlocked */
export function areHintsUnlocked(elapsedSeconds: number): boolean {
  return elapsedSeconds >= STRUGGLE_LOCKOUT_SECONDS;
}

/** Prepare hint request for Firestore */
export function prepareHintForFirestore(hints: HintRequest[]): Array<{ hintLevel: number; requestedAt: Date; hint: string }> {
  return hints.map(hr => ({ hintLevel: hr.hintLevel, requestedAt: hr.requestedAt, hint: hr.hint }));
}

/** Prepare struggle log for Firestore */
export function prepareStruggleLogForFirestore(log: StruggleLog): { attemptedSolutions: string[]; stuckLocation: string; hypothesis: string; createdAt: Date } {
  return { attemptedSolutions: log.attemptedSolutions, stuckLocation: log.stuckLocation, hypothesis: log.hypothesis, createdAt: log.createdAt };
}

/** Start a new struggle session */
export async function startStruggleSession(userId: string, lessonId: string): Promise<string> {
  const sessionId = `${userId}_${lessonId}`;
  const now = new Date();
  const hintsUnlockAt = new Date(now.getTime() + STRUGGLE_LOCKOUT_SECONDS * 1000);
  const session: Partial<StruggleSession> = { id: sessionId, userId, lessonId, startedAt: now, hintsUnlockAt, hintsRequested: [], struggleEnduranceSeconds: 0 };
  await setDoc(doc(db, 'struggleSessions', sessionId), { ...session, startedAt: serverTimestamp(), hintsUnlockAt });
  return sessionId;
}

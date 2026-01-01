/**
 * HintService
 * Manages progressive hint unlocking and struggle logging for military training methodology
 */

import type {
  StruggleSession,
  StruggleLog,
  StruggleTimerState,
} from '../types/struggle';
import { STRUGGLE_SESSION_CONFIG } from '../types/struggle';

export class HintService {
  private static instance: HintService;

  public static getInstance(): HintService {
    if (!HintService.instance) {
      HintService.instance = new HintService();
    }
    return HintService.instance;
  }

  /**
   * Initialize a new struggle session for a lab
   */
  initializeStruggleSession(labId: string, userId: string): StruggleSession {
    const now = new Date();
    const sessionId = `struggle_${labId}_${userId}_${now.getTime()}`;

    return {
      id: sessionId,
      labId,
      userId,
      startTime: now,
      isActive: true,
      timerState: {
        isLocked: true,
        timeRemaining: STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES * 60,
        hintsUsed: 0,
        canRequestHints: false,
        lastHintTime: undefined,
        nextHintTime: new Date(now.getTime() + STRUGGLE_SESSION_CONFIG.HINT_UNLOCK_INTERVAL_MINUTES * 60 * 1000)
      },
      struggleLogs: [],
      hintSystem: {
        availableHints: [],
        unlockedHints: [],
        maxHints: STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION,
        hintUnlockSchedule: this.generateHintSchedule(now)
      },
      metadata: {
        totalStruggleTime: 0,
        attemptsCount: 0,
        hintsRequested: 0,
        solutionViewed: false
      }
    };
  }

  /**
   * Generate progressive hint unlock schedule
   */
  private generateHintSchedule(startTime: Date): Date[] {
    const schedule: Date[] = [];
    const baseTime = startTime.getTime();

    for (let i = 1; i <= STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION; i++) {
      const unlockTime = new Date(
        baseTime +
        STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES * 60 * 1000 +
        (i - 1) * STRUGGLE_SESSION_CONFIG.HINT_UNLOCK_INTERVAL_MINUTES * 60 * 1000
      );
      schedule.push(unlockTime);
    }

    return schedule;
  }

  /**
   * Check if user can request a hint
   */
  canRequestHint(session: StruggleSession): boolean {
    if (!session.isActive) return false;
    if (session.timerState.hintsUsed >= STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION) return false;

    const now = new Date();
    const timeSinceStart = now.getTime() - session.startTime.getTime();
    const minutesSinceStart = timeSinceStart / (1000 * 60);

    // Must have struggled for initial lockout period
    if (minutesSinceStart < STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES) return false;

    // Must have submitted at least one struggle log
    if (session.struggleLogs.length === 0) return false;

    // Check if next hint is available
    const nextHintIndex = session.timerState.hintsUsed;
    if (nextHintIndex >= session.hintSystem.hintUnlockSchedule.length) return false;

    const nextHintTime = session.hintSystem.hintUnlockSchedule[nextHintIndex];
    return now >= nextHintTime;
  }

  /**
   * Submit a struggle log entry
   */
  submitStruggleLog(session: StruggleSession, log: Omit<StruggleLog, 'id' | 'timestamp'>): StruggleSession {
    const newLog: StruggleLog = {
      ...log,
      id: `log_${session.id}_${Date.now()}`,
      timestamp: new Date()
    };

    return {
      ...session,
      struggleLogs: [...session.struggleLogs, newLog],
      timerState: {
        ...session.timerState,
        canRequestHints: this.canRequestHint({
          ...session,
          struggleLogs: [...session.struggleLogs, newLog]
        })
      }
    };
  }

  /**
   * Request next available hint
   */
  requestHint(session: StruggleSession): { session: StruggleSession; hint: string | null } {
    if (!this.canRequestHint(session)) {
      return { session, hint: null };
    }

    const hintIndex = session.timerState.hintsUsed;
    const availableHints = session.hintSystem.availableHints;

    if (hintIndex >= availableHints.length) {
      return { session, hint: null };
    }

    const hint = availableHints[hintIndex];
    const now = new Date();

    const updatedSession: StruggleSession = {
      ...session,
      timerState: {
        ...session.timerState,
        hintsUsed: session.timerState.hintsUsed + 1,
        lastHintTime: now,
        canRequestHints: this.canRequestHint({
          ...session,
          timerState: {
            ...session.timerState,
            hintsUsed: session.timerState.hintsUsed + 1
          }
        })
      },
      hintSystem: {
        ...session.hintSystem,
        unlockedHints: [...session.hintSystem.unlockedHints, hint]
      },
      metadata: {
        ...session.metadata,
        hintsRequested: session.metadata.hintsRequested + 1
      }
    };

    return { session: updatedSession, hint };
  }

  /**
   * Update timer state (called every second)
   */
  updateTimer(session: StruggleSession): StruggleTimerState {
    const now = new Date();
    const timeSinceStart = now.getTime() - session.startTime.getTime();
    const secondsSinceStart = Math.floor(timeSinceStart / 1000);

    const totalLockoutSeconds = STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES * 60;
    const isLocked = secondsSinceStart < totalLockoutSeconds;
    const timeRemaining = Math.max(0, totalLockoutSeconds - secondsSinceStart);

    return {
      ...session.timerState,
      isLocked,
      timeRemaining,
      canRequestHints: this.canRequestHint(session)
    };
  }

  /**
   * Check if session should end (solution viewed or max attempts reached)
   */
  shouldEndSession(session: StruggleSession): boolean {
    return session.metadata.solutionViewed ||
           session.metadata.attemptsCount >= STRUGGLE_SESSION_CONFIG.MAX_FAILED_ATTEMPTS_BEFORE_SOLUTION;
  }

  /**
   * End struggle session
   */
  endSession(session: StruggleSession): StruggleSession {
    const endTime = new Date();
    const totalTime = endTime.getTime() - session.startTime.getTime();

    return {
      ...session,
      isActive: false,
      metadata: {
        ...session.metadata,
        totalStruggleTime: Math.floor(totalTime / (1000 * 60)) // minutes
      }
    };
  }

  /**
   * Validate struggle log meets minimum requirements
   */
  validateStruggleLog(log: Omit<StruggleLog, 'id' | 'timestamp'>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!log.problemDescription?.trim()) {
      errors.push('Problem description is required');
    }

    if (!log.approachesTried || log.approachesTried.length < STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED) {
      errors.push(`At least ${STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED} different approaches must be documented`);
    }

    if (!log.currentStuckPoint?.trim()) {
      errors.push('Current stuck point must be described');
    }

    if (!log.timeSpentMinutes || log.timeSpentMinutes < STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES) {
      errors.push(`Minimum ${STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES} minutes of struggle required`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
/**
 * StruggleTimerUtils - Utility functions for StruggleTimer
 */

import type { TimerDisplay } from '../../../types/struggle';
import { STRUGGLE_SESSION_CONFIG } from '../../../types/struggle';

/**
 * Formats seconds into a timer display object with status information
 */
export function formatTime(seconds: number): TimerDisplay {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLocked = seconds > 0;

  let statusText = '';
  let progressPercent = 0;

  if (isLocked) {
    const totalSeconds = STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES * 60;
    progressPercent = ((totalSeconds - seconds) / totalSeconds) * 100;
    statusText = `Hints unlock in ${minutes}:${secs.toString().padStart(2, '0')}`;
  } else {
    statusText = 'Hints available - struggle first!';
    progressPercent = 100;
  }

  return { minutes, seconds: secs, isLocked, statusText, progressPercent };
}

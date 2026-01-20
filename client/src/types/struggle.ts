/**
 * Time-Boxed Struggle Sessions Types
 * Forces independent problem-solving before revealing hints
 */

export interface StruggleSession {
  id: string;
  labId: string;
  userId: string;
  startTime: Date;
  isActive: boolean;
  timerState: StruggleTimerState;
  hintSystem: HintSystem;
  struggleLogs: StruggleLog[];
  metadata: StruggleMetadata;
}

export interface StruggleLog {
  id: string;
  timestamp: Date;
  problemDescription: string;
  approachesTried: string[];
  currentStuckPoint: string;
  timeSpentMinutes: number;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  learningPoints?: string;
}

export interface HintSystem {
  availableHints: string[];
  unlockedHints: string[];
  maxHints: number;
  hintUnlockSchedule: Date[];
}

export interface StruggleTimerState {
  isLocked: boolean;
  timeRemaining: number;
  hintsUsed: number;
  canRequestHints: boolean;
  lastHintTime?: Date;
  nextHintTime?: Date;
}

export interface StruggleMetadata {
  totalStruggleTime: number;
  attemptsCount: number;
  hintsRequested: number;
  solutionViewed: boolean;
}

// Configuration constants
export const STRUGGLE_SESSION_CONFIG = {
  HINT_LOCK_DURATION_MINUTES: 30,
  HINT_UNLOCK_INTERVAL_MINUTES: 5,
  MIN_APPROACHES_REQUIRED: 3,
  MIN_STRUGGLE_TIME_MINUTES: 10,
  MAX_HINTS_PER_SESSION: 3,
  MAX_FAILED_ATTEMPTS_BEFORE_SOLUTION: 3,
} as const;

// Hint progression levels - using const assertion instead of enum for erasableSyntaxOnly
export const HintLevel = {
  GENTLE_NUDGE: 1, // "Check your configuration file"
  MORE_SPECIFIC: 2, // "Look at the ports section"
  VERY_SPECIFIC: 3, // "Port 8080 should be 80"
} as const;

// Struggle session status
export type StruggleStatus =
  | "active" // Currently struggling, hints locked
  | "hints_available" // Can request hints
  | "completed" // Session finished
  | "abandoned"; // User gave up

// Timer display states
export interface TimerDisplay {
  minutes: number;
  seconds: number;
  isLocked: boolean;
  statusText: string;
  progressPercent: number;
}

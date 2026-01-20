/**
 * Reset Token System Types
 * Limits quiz/lab resets to encourage learning from failures
 */

export type TokenType = "quiz-reset" | "lab-reset" | "battle-drill-reset";

export interface ResetToken {
  id: string;
  userId: string;
  type: TokenType;
  usedAt: Date;
  itemId: string; // quiz/lab/drill ID
  itemTitle: string;
  weekNumber?: number;
  reason?: string; // Optional: why they needed the reset
}

export interface TokenAllocation {
  userId: string;
  weekStart: Date; // Monday of the week
  weekEnd: Date; // Sunday of the week
  quizResets: number;
  labResets: number;
  battleDrillResets: number;
  quizResetsUsed: number;
  labResetsUsed: number;
  battleDrillResetsUsed: number;
}

export interface TokenConfig {
  quizResetsPerWeek: number;
  labResetsPerWeek: number;
  battleDrillResetsPerWeek: number;
  resetCooldownMinutes: number; // Prevent rapid consecutive resets
}

// Default token allocations (military-style - limited resources)
export const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  quizResetsPerWeek: 2, // Only 2 quiz resets per week
  labResetsPerWeek: 1, // Only 1 lab reset per week (labs are harder)
  battleDrillResetsPerWeek: 3, // 3 drill resets (drills are for practice)
  resetCooldownMinutes: 30, // Must wait 30 min between resets
};

export interface TokenUsageStats {
  totalResetsUsed: number;
  quizResetsUsed: number;
  labResetsUsed: number;
  battleDrillResetsUsed: number;
  averageResetsPerWeek: number;
  weeksMostResets: number;
  itemsMostReset: Array<{
    itemId: string;
    itemTitle: string;
    type: TokenType;
    resetCount: number;
  }>;
}

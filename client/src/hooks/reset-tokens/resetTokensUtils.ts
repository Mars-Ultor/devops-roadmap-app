/**
 * Reset Token Hook Utilities
 * Extracted helper functions for ESLint compliance
 */

import type {
  TokenType,
  TokenAllocation,
  TokenUsageStats,
  ResetToken,
  TokenConfig,
} from "../types/tokens";

// ============================================================================
// Week Date Range
// ============================================================================

export function getCurrentWeek(): { weekStart: Date; weekEnd: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + daysToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

// ============================================================================
// Token Checks
// ============================================================================

export function getRemainingForType(
  allocation: TokenAllocation,
  type: TokenType,
): number {
  switch (type) {
    case "quiz-reset":
      return allocation.quizResets - allocation.quizResetsUsed;
    case "lab-reset":
      return allocation.labResets - allocation.labResetsUsed;
    case "battle-drill-reset":
      return allocation.battleDrillResets - allocation.battleDrillResetsUsed;
  }
}

export function checkCanReset(
  allocation: TokenAllocation | null,
  recentResets: ResetToken[],
  type: TokenType,
  cooldownMinutes: number,
): { allowed: boolean; reason?: string } {
  if (!allocation)
    return { allowed: false, reason: "Loading token allocation..." };

  const remaining = getRemainingForType(allocation, type);
  if (remaining <= 0) {
    const typeLabel = type.replace("-reset", "").replace("-", " ");
    return {
      allowed: false,
      reason: `No ${typeLabel} resets remaining this week`,
    };
  }

  // Check cooldown
  if (recentResets.length > 0) {
    const lastReset = recentResets[0];
    const minutesSinceLastReset =
      (Date.now() - lastReset.usedAt.getTime()) / (1000 * 60);
    if (minutesSinceLastReset < cooldownMinutes) {
      const remainingMinutes = Math.ceil(
        cooldownMinutes - minutesSinceLastReset,
      );
      return {
        allowed: false,
        reason: `Cooldown active. Wait ${remainingMinutes} more minute(s)`,
      };
    }
  }

  return { allowed: true };
}

// ============================================================================
// Allocation Updates
// ============================================================================

export function updateAllocationForType(
  allocation: TokenAllocation,
  type: TokenType,
): TokenAllocation {
  const updated = { ...allocation };
  switch (type) {
    case "quiz-reset":
      updated.quizResetsUsed++;
      break;
    case "lab-reset":
      updated.labResetsUsed++;
      break;
    case "battle-drill-reset":
      updated.battleDrillResetsUsed++;
      break;
  }
  return updated;
}

// ============================================================================
// Usage Stats
// ============================================================================

export function getDefaultUsageStats(): TokenUsageStats {
  return {
    totalResetsUsed: 0,
    quizResetsUsed: 0,
    labResetsUsed: 0,
    battleDrillResetsUsed: 0,
    averageResetsPerWeek: 0,
    weeksMostResets: 0,
    itemsMostReset: [],
  };
}

export function calculateUsageStats(allResets: ResetToken[]): TokenUsageStats {
  const quizResets = allResets.filter((r) => r.type === "quiz-reset").length;
  const labResets = allResets.filter((r) => r.type === "lab-reset").length;
  const battleDrillResets = allResets.filter(
    (r) => r.type === "battle-drill-reset",
  ).length;

  const firstReset =
    allResets.length > 0
      ? new Date(
          Math.min(
            ...allResets.map((r) =>
              new Date(r.usedAt as string | number | Date).getTime(),
            ),
          ),
        )
      : new Date();
  const weeksSinceFirst = Math.max(
    1,
    Math.ceil((Date.now() - firstReset.getTime()) / (7 * 24 * 60 * 60 * 1000)),
  );

  const itemCounts = new Map<
    string,
    { title: string; type: TokenType; count: number }
  >();
  allResets.forEach((reset) => {
    const existing = itemCounts.get(reset.itemId);
    if (existing) existing.count++;
    else
      itemCounts.set(reset.itemId, {
        title: reset.itemTitle,
        type: reset.type,
        count: 1,
      });
  });

  const itemsMostReset = Array.from(itemCounts.entries())
    .map(([itemId, data]) => ({
      itemId,
      itemTitle: data.title,
      type: data.type,
      resetCount: data.count,
    }))
    .sort((a, b) => b.resetCount - a.resetCount)
    .slice(0, 5);

  return {
    totalResetsUsed: allResets.length,
    quizResetsUsed: quizResets,
    labResetsUsed: labResets,
    battleDrillResetsUsed: battleDrillResets,
    averageResetsPerWeek: allResets.length / weeksSinceFirst,
    weeksMostResets: 0,
    itemsMostReset,
  };
}

// ============================================================================
// New Allocation Creation
// ============================================================================

export function createNewAllocation(
  userId: string,
  config: TokenConfig,
): Omit<TokenAllocation, "id"> {
  const { weekStart, weekEnd } = getCurrentWeek();
  return {
    userId,
    weekStart,
    weekEnd,
    quizResets: config.quizResetsPerWeek,
    labResets: config.labResetsPerWeek,
    battleDrillResets: config.battleDrillResetsPerWeek,
    quizResetsUsed: 0,
    labResetsUsed: 0,
    battleDrillResetsUsed: 0,
  };
}

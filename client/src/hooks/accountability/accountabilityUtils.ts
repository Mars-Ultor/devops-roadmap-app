/**
 * Accountability System Utilities
 * Helper functions extracted for Fast Refresh compliance
 */

import type {
  Commitment,
  CommitmentStatus,
  AccountabilityStats,
} from "../../types/accountability";

/** Get current week information */
export function getCurrentWeekInfo(): {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
} {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.ceil(diff / oneWeek);

  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + daysToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekNumber, weekStart, weekEnd };
}

/** Generate unique ID for commitments */
export function generateCommitmentId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/** Create commitment with defaults */
export function createCommitment(
  c: Omit<Commitment, "id" | "current" | "status">,
): Commitment {
  return {
    ...c,
    id: generateCommitmentId(),
    current: 0,
    status: "pending" as CommitmentStatus,
  };
}

/** Update commitment progress and status */
export function updateCommitmentWithProgress(
  commitment: Commitment,
  progress: number,
): Commitment {
  const newCurrent = Math.min(progress, commitment.target);
  const newStatus: CommitmentStatus =
    newCurrent >= commitment.target ? "completed" : "in-progress";
  return { ...commitment, current: newCurrent, status: newStatus };
}

/** Calculate overall status from commitments */
export function calculateOverallStatus(
  commitments: Commitment[],
): "completed" | "failed" | "in-progress" {
  const allCompleted = commitments.every((c) => c.status === "completed");
  const anyFailed = commitments.some((c) => c.status === "failed");
  if (allCompleted) return "completed";
  if (anyFailed) return "failed";
  return "in-progress";
}

/** Default empty stats */
export function getDefaultAccountabilityStats(): AccountabilityStats {
  return {
    weeklyCompletionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCommitments: 0,
    completedCommitments: 0,
    failedCommitments: 0,
    avgCommitmentsPerWeek: 0,
    partnerCheckIns: 0,
    publicCommitmentsMade: 0,
    publicCommitmentsKept: 0,
  };
}

/** Calculate streaks from commitment docs data */
export function calculateStreaks(docs: Array<{ overallStatus?: string }>): {
  currentStreak: number;
  longestStreak: number;
} {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Process in reverse order
  docs.forEach((data) => {
    if (data.overallStatus === "completed") {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (tempStreak > 0) currentStreak = tempStreak;
      tempStreak = 0;
    }
  });

  // Handle case where current streak continues to present
  if (tempStreak > 0) currentStreak = tempStreak;

  return { currentStreak, longestStreak };
}

/** Count commitments by status */
export function countCommitmentsByStatus(
  allCommitments: Array<Array<{ status: string }>>,
): {
  totalCommitments: number;
  completedCommitments: number;
  failedCommitments: number;
} {
  let totalCommitments = 0;
  let completedCommitments = 0;
  let failedCommitments = 0;

  allCommitments.forEach((commitments) => {
    commitments.forEach((c) => {
      totalCommitments++;
      if (c.status === "completed") completedCommitments++;
      if (c.status === "failed") failedCommitments++;
    });
  });

  return { totalCommitments, completedCommitments, failedCommitments };
}

/** Calculate full accountability stats from data */
export function calculateAccountabilityStats(
  commitmentDocs: Array<{
    overallStatus?: string;
    commitments: Array<{ status: string }>;
  }>,
  checkInsCount: number,
  publicDocs: Array<{ status?: string }>,
): AccountabilityStats {
  const allCommitments = commitmentDocs.map((d) => d.commitments);
  const { totalCommitments, completedCommitments, failedCommitments } =
    countCommitmentsByStatus(allCommitments);

  const { currentStreak, longestStreak } = calculateStreaks(
    [...commitmentDocs].reverse(),
  );

  const publicKept = publicDocs.filter((d) => d.status === "completed").length;
  const numWeeks = commitmentDocs.length;

  return {
    weeklyCompletionRate:
      numWeeks > 0 ? completedCommitments / totalCommitments : 0,
    currentStreak,
    longestStreak,
    totalCommitments,
    completedCommitments,
    failedCommitments,
    avgCommitmentsPerWeek: numWeeks > 0 ? totalCommitments / numWeeks : 0,
    partnerCheckIns: checkInsCount,
    publicCommitmentsMade: publicDocs.length,
    publicCommitmentsKept: publicKept,
  };
}

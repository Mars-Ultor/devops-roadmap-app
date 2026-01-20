/**
 * Recertification System Utilities
 * Helper functions for skill decay analysis
 */

export interface SkillDecayAlert {
  skill: string;
  category: string;
  recentPerformance: number;
  historicalPerformance: number;
  decayPercentage: number;
  lastPracticed: Date;
  requiresRecertification: boolean;
}

/** Calculate decay percentage between historical and recent performance */
export function calculateDecay(historicalPerformance: number, recentPerformance: number): number {
  if (historicalPerformance <= 0) return 0;
  return ((historicalPerformance - recentPerformance) / historicalPerformance) * 100;
}

/** Calculate average score from array of scores */
export function calculateAverageScore(scores: number[], defaultValue: number = 0): number {
  if (scores.length === 0) return defaultValue;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

/** Check if skill requires recertification */
export function requiresRecertification(decayPercentage: number, recentScoresCount: number): boolean {
  return decayPercentage > 40 || recentScoresCount === 0;
}

/** Sort skill alerts by decay percentage descending */
export function sortAlertsByDecay(alerts: SkillDecayAlert[]): SkillDecayAlert[] {
  return alerts.sort((a, b) => b.decayPercentage - a.decayPercentage);
}

/** Calculate next recertification due date (30 days from last) */
export function calculateNextRecertDue(lastRecertDate: Date | null): Date | null {
  if (!lastRecertDate) return null;
  return new Date(lastRecertDate.getTime() + 30 * 24 * 60 * 60 * 1000);
}

/** Calculate days until recertification is due */
export function calculateDaysUntilDue(nextRecertDue: Date | null): number {
  if (!nextRecertDue) return 30;
  return Math.ceil((nextRecertDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** Get date N days ago */
export function getDaysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Capitalize first letter of string */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Default skill categories */
export const SKILL_CATEGORIES = ['docker', 'kubernetes', 'cicd', 'networking', 'scripting'];

/** Decay threshold for alerting */
export const DECAY_ALERT_THRESHOLD = 25;

/** Decay threshold for recertification */
export const RECERT_DECAY_THRESHOLD = 40;

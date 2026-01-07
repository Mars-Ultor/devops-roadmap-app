/**
 * Learning Velocity Utilities
 * Helper functions for velocity analysis
 */

export interface WeeklyProgress {
  week: number;
  itemsCompleted: number;
  avgTimePerItem: number;
  masteryRate: number;
  date: Date;
}

interface WeeklyDataItem {
  items: Array<Record<string, unknown>>;
  totalTime: number;
  masteredItems: number;
  weekStart: Date;
}

/** Calculate velocity trend using linear regression */
export function calculateVelocityTrend(weeklyData: WeeklyProgress[]): 'accelerating' | 'steady' | 'decelerating' {
  if (weeklyData.length < 3) return 'steady';
  const n = weeklyData.length;
  const sumX = weeklyData.reduce((sum, _, idx) => sum + idx, 0);
  const sumY = weeklyData.reduce((sum, w) => sum + w.itemsCompleted, 0);
  const sumXY = weeklyData.reduce((sum, w, idx) => sum + idx * w.itemsCompleted, 0);
  const sumXX = weeklyData.reduce((sum, _, idx) => sum + idx * idx, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  if (slope > 0.5) return 'accelerating';
  if (slope < -0.5) return 'decelerating';
  return 'steady';
}

/** Get week key from date */
export function getWeekKey(date: Date): string {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
}

/** Convert weekly data map to sorted progress array */
export function convertToWeeklyProgress(weeklyData: Record<string, WeeklyDataItem>): WeeklyProgress[] {
  return Object.entries(weeklyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([weekKey, data]) => {
      const weekNumber = Math.floor((new Date(weekKey).getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
      return {
        week: weekNumber,
        itemsCompleted: data.items.length,
        avgTimePerItem: data.items.length > 0 ? data.totalTime / data.items.length : 0,
        masteryRate: data.items.length > 0 ? (data.masteredItems / data.items.length) * 100 : 0,
        date: data.weekStart
      };
    });
}

/** Calculate current pace from recent weeks */
export function calculateCurrentPace(weeklyProgress: WeeklyProgress[]): number {
  const recentWeeks = weeklyProgress.slice(-4);
  if (recentWeeks.length === 0) return 0;
  return recentWeeks.reduce((sum, w) => sum + w.itemsCompleted, 0) / recentWeeks.length;
}

/** Calculate optimal pace based on remaining work */
export function calculateOptimalPace(weeklyProgress: WeeklyProgress[], totalWeeks: number = 12, remainingItems: number = 100): number {
  const completedWeeks = Math.max(...weeklyProgress.map(w => w.week), 0);
  const remainingWeeks = Math.max(totalWeeks - completedWeeks, 1);
  return remainingItems / remainingWeeks;
}

/** Project completion date based on pace */
export function projectCompletionDate(currentPace: number, remainingItems: number): Date | null {
  if (currentPace <= 0) return null;
  return new Date(Date.now() + (remainingItems / currentPace) * 7 * 24 * 60 * 60 * 1000);
}

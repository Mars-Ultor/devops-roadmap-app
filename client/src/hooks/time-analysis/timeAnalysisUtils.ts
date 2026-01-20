/**
 * Time Analysis Utilities
 * Helper functions for study time analysis
 */

export interface HourlyPerformance {
  hour: number;
  totalSessions: number;
  averageScore: number;
  totalTimeMinutes: number;
  completionRate: number;
}

export interface TimeRecommendation {
  bestHours: number[];
  worstHours: number[];
  peakPerformanceWindow: string;
  recommendation: string;
  confidenceLevel: "low" | "medium" | "high";
}

/** Format hour in 12-hour format */
export function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}${period}`;
}

/** Find longest consecutive sequence of hours */
export function findPeakWindow(hours: number[]): number[] {
  if (hours.length === 0) return [];
  if (hours.length === 1) return hours;
  let longestSequence: number[] = [hours[0]];
  let currentSequence: number[] = [hours[0]];
  for (let i = 1; i < hours.length; i++) {
    if (hours[i] === hours[i - 1] + 1) {
      currentSequence.push(hours[i]);
      if (currentSequence.length > longestSequence.length)
        longestSequence = [...currentSequence];
    } else currentSequence = [hours[i]];
  }
  return longestSequence;
}

/** Format time window as string */
export function formatTimeWindow(hours: number[]): string {
  if (hours.length === 0) return "Not enough data";
  if (hours.length === 1) return formatHour(hours[0]);
  return `${formatHour(hours[0])} - ${formatHour(hours[hours.length - 1] + 1)}`;
}

/** Default recommendation for insufficient data */
export function getDefaultRecommendation(): TimeRecommendation {
  return {
    bestHours: [],
    worstHours: [],
    peakPerformanceWindow: "Insufficient data",
    recommendation:
      "Complete more sessions to generate time recommendations. Try studying at different times of day.",
    confidenceLevel: "low",
  };
}

/** Calculate hourly performance from aggregated data */
export function calculateHourlyPerformance(
  hourlyData: Record<
    number,
    {
      scores: number[];
      completions: number;
      attempts: number;
      totalMinutes: number;
    }
  >,
): HourlyPerformance[] {
  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    totalSessions: data.attempts,
    averageScore:
      data.scores.length > 0
        ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
        : 0,
    totalTimeMinutes: data.totalMinutes,
    completionRate:
      data.attempts > 0 ? (data.completions / data.attempts) * 100 : 0,
  }));
}

/** Generate recommendation from hourly performance */
export function generateRecommendation(
  hourlyData: HourlyPerformance[],
): TimeRecommendation {
  const significantHours = hourlyData.filter((h) => h.totalSessions >= 3);
  if (significantHours.length < 3) return getDefaultRecommendation();

  const sortedByPerformance = [...significantHours].sort(
    (a, b) =>
      b.averageScore * 0.6 +
      b.completionRate * 0.4 -
      (a.averageScore * 0.6 + a.completionRate * 0.4),
  );
  const bestHours = sortedByPerformance
    .slice(0, 3)
    .map((h) => h.hour)
    .sort((a, b) => a - b);
  const worstHours = sortedByPerformance
    .slice(-3)
    .map((h) => h.hour)
    .sort((a, b) => a - b);
  const peakWindow = findPeakWindow(bestHours);
  const peakPerformanceWindow = formatTimeWindow(peakWindow);

  const bestTime = formatHour(bestHours[0]);
  const worstTime = formatHour(worstHours[0]);
  const bestScore = Math.round(sortedByPerformance[0].averageScore);
  const worstScore = Math.round(
    sortedByPerformance[sortedByPerformance.length - 1].averageScore,
  );

  return {
    bestHours,
    worstHours,
    peakPerformanceWindow,
    recommendation: `Your best performance is around ${bestTime} (avg ${bestScore}%), while ${worstTime} shows lower scores (avg ${worstScore}%). Schedule critical learning during ${peakPerformanceWindow} for optimal results.`,
    confidenceLevel:
      significantHours.length >= 10
        ? "high"
        : significantHours.length >= 5
          ? "medium"
          : "low",
  };
}

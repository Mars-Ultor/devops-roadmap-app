/**
 * StressMetricsDashboard - Utility functions and constants
 */

export const STRESS_LEVEL_LABELS: Record<string, string> = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  extreme: 'Extreme'
};

export const STRESS_LEVEL_COLORS: Record<string, string> = {
  none: 'bg-gray-600',
  low: 'bg-green-600',
  medium: 'bg-yellow-600',
  high: 'bg-orange-600',
  extreme: 'bg-red-600'
};

export const STRESS_LEVELS = ['none', 'low', 'medium', 'high', 'extreme'] as const;
export type StressLevel = typeof STRESS_LEVELS[number];

export const getDegradationStatus = (rate: number): string => {
  if (rate < 10) return 'excellent';
  if (rate < 20) return 'good';
  if (rate < 30) return 'fair';
  return 'needs-improvement';
};

export const getAdaptabilityColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-orange-400';
};

export const getStressScoreColor = (score: number): string => {
  if (score < 40) return 'text-green-400';
  if (score < 60) return 'text-yellow-400';
  return 'text-orange-400';
};

export const getDegradationColor = (status: string): string => {
  switch (status) {
    case 'excellent': return 'text-green-400';
    case 'good': return 'text-yellow-400';
    case 'fair': return 'text-orange-400';
    default: return 'text-red-400';
  }
};

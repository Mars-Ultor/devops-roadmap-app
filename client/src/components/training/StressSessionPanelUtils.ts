/**
 * StressSessionPanel - Utility functions and constants
 */

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getStressColor = (score: number): string => {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-green-400';
};

export const getStressBarColor = (score: number): string => {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getFocusColor = (level: number): string => {
  if (level >= 70) return 'text-green-400';
  if (level >= 50) return 'text-yellow-400';
  if (level >= 30) return 'text-orange-400';
  return 'text-red-400';
};

export const getFocusBarColor = (level: number): string => {
  if (level >= 70) return 'bg-green-500';
  if (level >= 50) return 'bg-yellow-500';
  if (level >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getTimeColor = (isTimeCritical: boolean, isTimeWarning: boolean): string => {
  if (isTimeCritical) return 'text-red-400';
  if (isTimeWarning) return 'text-yellow-400';
  return 'text-gray-300';
};

export const getTimeBarColor = (isTimeCritical: boolean, isTimeWarning: boolean): string => {
  if (isTimeCritical) return 'bg-red-500';
  if (isTimeWarning) return 'bg-yellow-500';
  return 'bg-blue-500';
};

export const formatConditionType = (type: string): string => {
  return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

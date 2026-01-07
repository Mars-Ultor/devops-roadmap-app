/**
 * Recertification Drill Utilities
 * Helper functions for recertification drills
 */

import type { CertificationLevel } from '../types/training';

// Format time as MM:SS
export const formatDrillTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get certification level badge color
export const getCertificationColor = (level: CertificationLevel) => {
  switch (level) {
    case 'bronze': return 'text-amber-600 bg-amber-100';
    case 'silver': return 'text-gray-600 bg-gray-100';
    case 'gold': return 'text-yellow-600 bg-yellow-100';
    case 'platinum': return 'text-purple-600 bg-purple-100';
    case 'master': return 'text-red-600 bg-red-100';
  }
};

// Calculate score from answers
export const calculateDrillScore = (
  answers: Array<{ correct: boolean }>,
  totalQuestions: number
): number => {
  const correctAnswers = answers.filter(a => a.correct).length;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

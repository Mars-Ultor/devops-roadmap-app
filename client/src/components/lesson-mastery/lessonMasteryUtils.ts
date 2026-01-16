/**
 * Lesson Mastery Display Utilities
 * Helper functions extracted for ESLint compliance
 */

import type { LessonMastery, LessonMasteryLevel } from './LessonMasteryDisplay';

// Default mastery structure if not provided
export const DEFAULT_MASTERY: LessonMastery = {
  levels: {
    crawl: { name: "Crawl - Guided", requiredPerfect: 3, perfectCount: 0, status: "in_progress" },
    walk: { name: "Walk - Fill-in-Blanks", requiredPerfect: 3, perfectCount: 0, status: "locked" },
    runGuided: { name: "Run - Conceptual", requiredPerfect: 2, perfectCount: 0, status: "locked" },
    runIndependent: { name: "Run - Independent", requiredPerfect: 1, perfectCount: 0, status: "locked" }
  }
};

export const LEVEL_ORDER: (keyof LessonMastery['levels'])[] = ['crawl', 'walk', 'runGuided', 'runIndependent'];

// Check if level can be clicked
export const canClickLevel = (
  levelKey: keyof LessonMastery['levels'], 
  level: LessonMasteryLevel, 
  mastery: LessonMastery, 
  isLocked: boolean
): boolean => {
  if (isLocked) return false;
  if (level.status === 'completed') return true;
  if (level.status === 'in_progress') return true;
  
  const currentIndex = LEVEL_ORDER.indexOf(levelKey);
  if (currentIndex === 0) return true;
  
  const previousLevel = mastery.levels[LEVEL_ORDER[currentIndex - 1]];
  return previousLevel.status === 'completed';
};

// Get container class based on level status
export const getLevelContainerClass = (level: LessonMasteryLevel, isClickable: boolean): string => {
  const isCurrent = level.status === 'in_progress';
  const baseClass = 'flex items-center justify-between p-3 rounded-lg border transition-all duration-200';
  
  let stateClass = '';
  if (isCurrent) {
    stateClass = 'bg-yellow-900/20 border-yellow-500/50';
  } else if (level.status === 'completed') {
    stateClass = 'bg-green-900/20 border-green-500/50';
  } else {
    stateClass = 'bg-slate-800/50 border-slate-700';
  }
  
  const clickClass = isClickable ? 'cursor-pointer hover:bg-slate-700/50' : 'cursor-not-allowed opacity-60';
  
  return `${baseClass} ${stateClass} ${clickClass}`;
};

// Get name text color class
export const getNameTextClass = (level: LessonMasteryLevel): string => {
  if (level.status === 'in_progress') return 'text-yellow-400';
  if (level.status === 'completed') return 'text-green-400';
  return 'text-gray-400';
};

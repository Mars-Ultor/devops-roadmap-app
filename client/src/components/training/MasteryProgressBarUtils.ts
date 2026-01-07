/**
 * MasteryProgressBar - Utility functions and constants
 */

import type { LessonMastery } from '../../types/training';

export const MASTERY_LEVELS = [
  { key: 'crawl', label: 'Crawl', icon: '🐾' },
  { key: 'walk', label: 'Walk', icon: '🚶' },
  { key: 'run-guided', label: 'Run (G)', icon: '🏃' },
  { key: 'run-independent', label: 'Run (I)', icon: '🎯' }
] as const;

export type MasteryLevelKey = typeof MASTERY_LEVELS[number]['key'];

interface LevelStatus {
  isMastered: boolean;
  isUnlocked: boolean;
  data: {
    perfectCompletions: number;
    requiredPerfectCompletions: number;
    unlocked: boolean;
  };
}

export const getLevelStatus = (levelKey: MasteryLevelKey, mastery: LessonMastery): LevelStatus => {
  const mappedKey = levelKey === 'run-guided' ? 'runGuided' : levelKey === 'run-independent' ? 'runIndependent' : levelKey;
  const levelData = mastery[mappedKey as 'crawl' | 'walk' | 'runGuided' | 'runIndependent'];
  const isMastered = levelData.perfectCompletions >= levelData.requiredPerfectCompletions;
  const isUnlocked = levelData.unlocked;
  
  return { isMastered, isUnlocked, data: levelData };
};

export const calculateOverallProgress = (mastery: LessonMastery): number => {
  const masteredCount = 
    (mastery.crawl.perfectCompletions >= mastery.crawl.requiredPerfectCompletions ? 1 : 0) +
    (mastery.walk.perfectCompletions >= mastery.walk.requiredPerfectCompletions ? 1 : 0) +
    (mastery.runGuided.perfectCompletions >= mastery.runGuided.requiredPerfectCompletions ? 1 : 0) +
    (mastery.runIndependent.perfectCompletions >= mastery.runIndependent.requiredPerfectCompletions ? 1 : 0);
  
  return masteredCount * 25;
};

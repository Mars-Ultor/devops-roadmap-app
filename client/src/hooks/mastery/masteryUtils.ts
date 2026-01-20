/**
 * Mastery Utilities
 * Helper functions for mastery level management
 */

import type {
  LessonMastery,
  MasteryLevel,
  MasteryProgress,
} from "../../types/training";

// Constants for mastery level keys
const RUN_GUIDED_KEY = "runGuided" as const;
const RUN_INDEPENDENT_KEY = "runIndependent" as const;

// Constants for mastery level values
const RUN_GUIDED_LEVEL: MasteryLevel = "run-guided";
const RUN_INDEPENDENT_LEVEL: MasteryLevel = "run-independent";

/** Map mastery level to property key */
export function getLevelKey(
  level: MasteryLevel,
): keyof Pick<
  LessonMastery,
  "crawl" | "walk" | "runGuided" | "runIndependent"
> {
  if (level === RUN_GUIDED_LEVEL) return RUN_GUIDED_KEY;
  if (level === RUN_INDEPENDENT_LEVEL) return RUN_INDEPENDENT_KEY;
  return level as "crawl" | "walk";
}

/** Get level progress from mastery data */
export function getLevelProgressFromMastery(
  mastery: LessonMastery | null,
  level: MasteryLevel,
): MasteryProgress | null {
  if (!mastery) return null;
  return mastery[getLevelKey(level)];
}

/** Check if user can access a level */
export function checkCanAccessLevel(
  mastery: LessonMastery | null,
  level: MasteryLevel,
): boolean {
  if (!mastery) return false;
  return mastery[getLevelKey(level)].unlocked;
}

/** Check if a level is mastered */
export function checkIsLevelMastered(
  mastery: LessonMastery | null,
  level: MasteryLevel,
): boolean {
  if (!mastery) return false;
  const levelData = mastery[getLevelKey(level)];
  return levelData.perfectCompletions >= levelData.requiredPerfectCompletions;
}

/** Level progression order */
export const LEVEL_ORDER: MasteryLevel[] = [
  "crawl",
  "walk",
  RUN_GUIDED_LEVEL,
  RUN_INDEPENDENT_LEVEL,
];

/** Calculate new average time */
export function calculateNewAverageTime(
  currentAverage: number,
  attempts: number,
  newTime: number,
): number {
  const totalTime = (currentAverage || 0) * attempts + newTime;
  const newAttempts = attempts + 1;
  return newAttempts > 0 ? totalTime / newAttempts : newTime;
}

/** Determine the highest unlocked level */
export function getHighestUnlockedLevel(mastery: LessonMastery): MasteryLevel {
  for (const level of [...LEVEL_ORDER].reverse()) {
    if (mastery[getLevelKey(level)].unlocked) return level;
  }
  return "crawl";
}

/** Update mastery after attempt */
export function updateMasteryAfterAttempt(
  mastery: LessonMastery,
  level: MasteryLevel,
  perfect: boolean,
  timeSpent: number,
): { updatedMastery: LessonMastery; levelMastered: boolean } {
  const levelKey = getLevelKey(level);
  const levelData = mastery[levelKey];

  const newAttempts = levelData.attempts + 1;
  const newPerfectCompletions = perfect
    ? levelData.perfectCompletions + 1
    : levelData.perfectCompletions;
  const newAverageTime = calculateNewAverageTime(
    levelData.averageTime || 0,
    levelData.attempts,
    timeSpent,
  );
  const isLevelMastered =
    newPerfectCompletions >= levelData.requiredPerfectCompletions;

  const updatedMastery: LessonMastery = { ...mastery };
  updatedMastery[levelKey] = {
    ...levelData,
    attempts: newAttempts,
    perfectCompletions: newPerfectCompletions,
    lastAttemptDate: new Date(),
    averageTime: newAverageTime,
  };

  // Unlock next level if current is mastered
  if (isLevelMastered) {
    if (level === "crawl" && !mastery.walk.unlocked) {
      updatedMastery.walk = { ...mastery.walk, unlocked: true };
      updatedMastery.currentLevel = "walk";
    } else if (level === "walk" && !mastery.runGuided.unlocked) {
      updatedMastery.runGuided = { ...mastery.runGuided, unlocked: true };
      updatedMastery.currentLevel = RUN_GUIDED_LEVEL;
    } else if (level === RUN_GUIDED_LEVEL && !mastery.runIndependent.unlocked) {
      updatedMastery.runIndependent = {
        ...mastery.runIndependent,
        unlocked: true,
      };
      updatedMastery.currentLevel = RUN_INDEPENDENT_LEVEL;
    } else if (level === RUN_INDEPENDENT_LEVEL) {
      updatedMastery.fullyMastered = true;
      updatedMastery.currentLevel = RUN_INDEPENDENT_LEVEL;
    }
  }

  // Ensure currentLevel is set to highest unlocked
  updatedMastery.currentLevel = getHighestUnlockedLevel(updatedMastery);

  return { updatedMastery, levelMastered: isLevelMastered };
}

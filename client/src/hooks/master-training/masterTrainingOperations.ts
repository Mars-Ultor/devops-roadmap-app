/**
 * Master Training Storage Operations
 * Extracted from useMasterTraining hook for ESLint compliance
 */

import type { LearningPath } from "../../pages/MasterTraining";

export interface MasterTrainingStorage {
  loadProgress: () => Promise<{ paths: LearningPath[] }>;
  saveProgress: (paths: LearningPath[]) => Promise<void>;
}

export async function loadMasterTrainingProgress(
  storage: MasterTrainingStorage,
): Promise<LearningPath[]> {
  const result = await storage.loadProgress();
  return result.paths;
}

export async function saveMasterTrainingProgress(
  storage: MasterTrainingStorage,
  paths: LearningPath[],
): Promise<void> {
  await storage.saveProgress(paths);
}
import { useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { LearningPath } from "../pages/MasterTraining";
import { LEARNING_PATHS } from "../data/masterTrainingPaths";

interface StorageResult {
  paths: LearningPath[];
  success: boolean;
}

export const useMasterTrainingStorage = (userId: string | undefined) => {
  // Load progress from storage
  const loadProgress = useCallback(async (): Promise<StorageResult> => {
    if (!userId) return { paths: LEARNING_PATHS, success: false };

    try {
      console.log("[MasterTraining] Loading progress for user:", userId);

      // Try localStorage first
      const localData = localStorage.getItem(`masterTraining_${userId}`);
      if (localData) {
        const savedPaths = JSON.parse(localData);
        if (savedPaths && Array.isArray(savedPaths)) {
          console.log("Loaded master training progress from localStorage");
          return { paths: savedPaths, success: true };
        }
      }

      // Fallback to Firestore
      const progressRef = doc(
        db,
        "users",
        userId,
        "masterTraining",
        "progress",
      );
      console.log("[MasterTraining] Progress ref path:", progressRef.path);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        const savedPaths = progressSnap.data().learningPaths;
        if (savedPaths && Array.isArray(savedPaths)) {
          console.log("Loaded master training progress from Firestore");
          return { paths: savedPaths, success: true };
        }
      }

      console.log("No saved progress found, starting fresh with default paths");
      return { paths: LEARNING_PATHS, success: true };
    } catch (error) {
      console.error("Error loading master training progress:", error);
      return { paths: LEARNING_PATHS, success: false };
    }
  }, [userId]);

  // Save progress to storage
  const saveProgress = useCallback(
    async (updatedPaths: LearningPath[]): Promise<boolean> => {
      if (!userId) return false;

      try {
        console.log("[MasterTraining] Saving progress for user:", userId);

        // Save to localStorage (immediate, reliable)
        localStorage.setItem(
          `masterTraining_${userId}`,
          JSON.stringify(updatedPaths),
        );
        console.log("Saved master training progress to localStorage");

        // Try Firestore as backup (non-blocking)
        const progressRef = doc(
          db,
          "users",
          userId,
          "masterTraining",
          "progress",
        );
        console.log("[MasterTraining] Progress ref path:", progressRef.path);
        await setDoc(progressRef, {
          learningPaths: updatedPaths,
          updatedAt: new Date(),
        });
        console.log("Saved master training progress to Firestore");
        return true;
      } catch {
        // Silent fail - localStorage is primary storage
        return false;
      }
    },
    [userId],
  );

  return { loadProgress, saveProgress };
};

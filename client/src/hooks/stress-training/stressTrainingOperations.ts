/**
 * Stress Training Database Operations
 * Extracted from useStressTraining hook for ESLint compliance
 */

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { StressTrainingSession, StressMetrics } from "../../types/training";
import { getInitialStressMetrics } from "./stressTrainingUtils";

export async function loadStressMetricsFromDB(
  userId: string,
): Promise<StressMetrics> {
  const snapshot = await getDocs(
    query(
      collection(db, "stressMetrics"),
      where("userId", "==", userId),
      limit(1),
    ),
  );
  return snapshot.empty
    ? getInitialStressMetrics(userId)
    : (snapshot.docs[0].data() as StressMetrics);
}

export async function saveStressTrainingSessionToDB(
  session: StressTrainingSession,
): Promise<void> {
  await addDoc(collection(db, "stressTrainingSessions"), session);
}

export async function updateStressMetricsInDB(
  metrics: StressMetrics,
): Promise<void> {
  await addDoc(collection(db, "stressMetrics"), metrics);
}

export async function loadNormalSessionAccuracy(
  userId: string,
): Promise<number> {
  const normalSnapshot = await getDocs(
    query(
      collection(db, "battleDrillAttempts"),
      where("userId", "==", userId),
      orderBy("attemptedAt", "desc"),
      limit(10),
    ),
  );
  if (normalSnapshot.empty) return 0;
  const accuracies = normalSnapshot.docs.map((d) => d.data().accuracy || 0);
  return accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
}
/**
 * Production Scenario Database Operations
 * Extracted from useProductionScenario hook for ESLint compliance
 */

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { ScenarioAttempt, ScenarioPerformance } from "../../types/scenarios";
import { calculateUpdatedPerformance } from "./productionScenarioUtils";

export async function loadPerformanceFromDB(
  userId: string,
): Promise<Map<string, ScenarioPerformance>> {
  const snapshot = await getDocs(
    query(
      collection(db, "scenarioPerformance"),
      where("userId", "==", userId),
    ),
  );
  const perfMap = new Map<string, ScenarioPerformance>();
  snapshot.forEach((doc) => {
    const data = doc.data() as ScenarioPerformance;
    perfMap.set(data.scenarioId, data);
  });
  return perfMap;
}

export async function updatePerformanceInDB(
  userId: string,
  attempt: ScenarioAttempt,
): Promise<void> {
  const snapshot = await getDocs(
    query(
      collection(db, "scenarioPerformance"),
      where("userId", "==", userId),
      where("scenarioId", "==", attempt.scenarioId),
    ),
  );
  const existingPerf = snapshot.empty
    ? null
    : (snapshot.docs[0].data() as ScenarioPerformance);
  const updatedPerf = calculateUpdatedPerformance(
    userId,
    attempt.scenarioId,
    attempt,
    existingPerf,
  );
  await addDoc(collection(db, "scenarioPerformance"), updatedPerf);
}

export async function saveScenarioAttemptToDB(
  attempt: ScenarioAttempt,
): Promise<void> {
  await addDoc(collection(db, "scenarioAttempts"), attempt);
}
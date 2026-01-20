/**
 * Recertification Analysis Callbacks Hook
 * Handles skill decay analysis operations
 */

import { useCallback } from "react";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { SkillDecayAlert } from "./recertificationUtils";
import {
  calculateAverageScore,
  calculateDecay,
  getDaysAgo,
  capitalizeFirst,
  SKILL_CATEGORIES,
  DECAY_ALERT_THRESHOLD,
  RECERT_DECAY_THRESHOLD,
} from "./recertificationUtils";

interface RecertificationAnalysisCallbacksParams {
  userId: string | undefined;
}

export function useRecertificationAnalysisCallbacks({ userId }: RecertificationAnalysisCallbacksParams) {
  const analyzeSkillDecay = useCallback(async (): Promise<SkillDecayAlert[]> => {
    if (!userId) return [];
    const alerts: SkillDecayAlert[] = [];

    for (const category of SKILL_CATEGORIES) {
      // Get recent performance (last 7 days)
      const recentSnap = await getDocs(
        query(
          collection(db, "progress"),
          where("userId", "==", userId),
          where("category", "==", category),
          where("completedAt", ">=", getDaysAgo(7)),
        ),
      );
      const recentScores = (recentSnap.docs || []).map(
        (d) => d.data().score || 0,
      );
      const recentPerformance = calculateAverageScore(recentScores, 0);

      // Get historical performance (30-60 days ago)
      const historicalSnap = await getDocs(
        query(
          collection(db, "progress"),
          where("userId", "==", userId),
          where("category", "==", category),
          where("completedAt", ">=", getDaysAgo(60)),
          where("completedAt", "<=", getDaysAgo(30)),
        ),
      );
      const historicalScores = (historicalSnap.docs || []).map(
        (d) => d.data().score || 0,
      );
      const historicalPerformance = calculateAverageScore(
        historicalScores,
        100,
      );

      if (historicalPerformance > 0) {
        const decayPercentage = calculateDecay(
          historicalPerformance,
          recentPerformance,
        );
        if (
          decayPercentage > DECAY_ALERT_THRESHOLD ||
          recentScores.length === 0
        ) {
          const lastPracticedDocs = await getDocs(
            query(
              collection(db, "progress"),
              where("userId", "==", userId),
              where("category", "==", category),
            ),
          );
          const lastPracticed =
            (lastPracticedDocs.docs || []).length > 0
              ? (lastPracticedDocs.docs || [])
                  .map((d) => d.data().completedAt?.toDate())
                  .filter(Boolean)
                  .sort((a, b) => b!.getTime() - a!.getTime())[0]!
              : new Date(0);
          alerts.push({
            skill: capitalizeFirst(category),
            category,
            recentPerformance: Math.round(recentPerformance),
            historicalPerformance: Math.round(historicalPerformance),
            decayPercentage: Math.round(decayPercentage),
            lastPracticed,
            requiresRecertification:
              decayPercentage > RECERT_DECAY_THRESHOLD ||
              recentScores.length === 0,
          });
        }
      }
    }
    return alerts.sort((a, b) => b.decayPercentage - a.decayPercentage);
  }, [userId]);

  return { analyzeSkillDecay };
}
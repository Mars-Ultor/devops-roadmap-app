/**
 * Recertification System Hook - Refactored
 * Tracks skill decay and requires monthly re-testing
 */

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  calculateAverageScore,
  calculateDecay,
  calculateNextRecertDue,
  calculateDaysUntilDue,
  getDaysAgo,
  capitalizeFirst,
  SKILL_CATEGORIES,
  DECAY_ALERT_THRESHOLD,
  RECERT_DECAY_THRESHOLD,
} from "./recertification/recertificationUtils";
import type { SkillDecayAlert } from "./recertification/recertificationUtils";

interface RecertificationStatus {
  lastRecertDate: Date | null;
  nextRecertDue: Date | null;
  daysUntilDue: number;
  isOverdue: boolean;
  skillsNeedingRecert: SkillDecayAlert[];
}

export type { RecertificationStatus };

export function useRecertification() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<RecertificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeSkillDecay = useCallback(async (): Promise<
    SkillDecayAlert[]
  > => {
    if (!user) return [];
    const alerts: SkillDecayAlert[] = [];

    for (const category of SKILL_CATEGORIES) {
      // Get recent performance (last 7 days)
      const recentSnap = await getDocs(
        query(
          collection(db, "progress"),
          where("userId", "==", user.uid),
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
          where("userId", "==", user.uid),
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
              where("userId", "==", user.uid),
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
  }, [user]);

  const checkRecertificationStatus = useCallback(async () => {
    if (!user) return;
    try {
      const recertDoc = await getDoc(doc(db, "recertifications", user.uid));
      const recertData = recertDoc.data();
      const lastRecertDate = recertData?.lastRecertDate?.toDate() || null;
      const nextRecertDue = calculateNextRecertDue(lastRecertDate);
      const daysUntilDue = calculateDaysUntilDue(nextRecertDue);
      const skillsNeedingRecert = await analyzeSkillDecay();
      setStatus({
        lastRecertDate,
        nextRecertDue,
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
        skillsNeedingRecert,
      });
    } catch (error) {
      console.error("Error checking recertification status:", error);
    } finally {
      setLoading(false);
    }
  }, [user, analyzeSkillDecay]);

  useEffect(() => {
    if (user) checkRecertificationStatus();
  }, [user, checkRecertificationStatus]);

  const completeRecertification = async (
    drillResults: Record<string, boolean>,
  ) => {
    if (!user) return;
    const allPassed = Object.values(drillResults).every(Boolean);
    await setDoc(
      doc(db, "recertifications", user.uid),
      {
        lastRecertDate: new Date(),
        drillResults,
        passed: allPassed,
        skillsRecertified: Object.keys(drillResults),
      },
      { merge: true },
    );
    await checkRecertificationStatus();
  };

  return {
    status,
    loading,
    checkRecertificationStatus,
    completeRecertification,
  };
}

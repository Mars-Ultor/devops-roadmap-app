/**
 * Recertification Status Callbacks Hook
 * Handles status checking and completion operations
 */

import { useCallback } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { RecertificationStatus } from "../useRecertification";
import {
  calculateNextRecertDue,
  calculateDaysUntilDue,
} from "./recertificationUtils";

interface RecertificationStatusCallbacksParams {
  userId: string | undefined;
  setStatus: (status: RecertificationStatus | null) => void;
  setLoading: (loading: boolean) => void;
  analyzeSkillDecay: () => Promise<import("./recertificationUtils").SkillDecayAlert[]>;
}

export function useRecertificationStatusCallbacks({
  userId,
  setStatus,
  setLoading,
  analyzeSkillDecay,
}: RecertificationStatusCallbacksParams) {
  const checkRecertificationStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const recertDoc = await getDoc(doc(db, "recertifications", userId));
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
  }, [userId, setStatus, setLoading, analyzeSkillDecay]);

  const completeRecertification = useCallback(
    async (drillResults: Record<string, boolean>) => {
      if (!userId) return;
      const allPassed = Object.values(drillResults).every(Boolean);
      await setDoc(
        doc(db, "recertifications", userId),
        {
          lastRecertDate: new Date(),
          drillResults,
          passed: allPassed,
          skillsRecertified: Object.keys(drillResults),
        },
        { merge: true },
      );
      await checkRecertificationStatus();
    },
    [userId, checkRecertificationStatus],
  );

  return {
    checkRecertificationStatus,
    completeRecertification,
  };
}
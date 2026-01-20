/**
 * Failure Log Update Callbacks Hook
 * Handles failure update operations
 */

import { useCallback } from "react";
import {
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { FailureLog } from "../../types/training";

interface FailureLogUpdateCallbacksParams {
  userId: string | undefined;
  setLoading: (loading: boolean) => void;
}

export function useFailureLogUpdateCallbacks({ userId, setLoading }: FailureLogUpdateCallbacksParams) {
  const updateFailure = useCallback(
    async (
      failureId: string,
      updates: Partial<
        Pick<
          FailureLog,
          | "rootCause"
          | "resolution"
          | "preventionStrategy"
          | "lessonsLearned"
          | "resolvedAt"
        >
      >,
    ): Promise<void> => {
      if (!userId) throw new Error("User not authenticated");
      setLoading(true);
      try {
        const failureRef = doc(db, "failureLogs", failureId);
        const updateData: Record<string, unknown> = { ...updates };
        if (updates.resolvedAt) {
          const failureDoc = await getDocs(
            query(
              collection(db, "failureLogs"),
              where("__name__", "==", failureId),
            ),
          );
          if (!failureDoc.empty) {
            const failureData = failureDoc.docs[0].data();
            const timestamp = failureData.timestamp?.toDate() || new Date();
            updateData.timeToResolveMinutes = Math.floor(
              (updates.resolvedAt.getTime() - timestamp.getTime()) / 60000,
            );
          }
          updateData.resolvedAt = serverTimestamp();
        }
        await updateDoc(failureRef, updateData);
      } catch (error) {
        console.error("Error updating failure:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [userId, setLoading],
  );

  return { updateFailure };
}
/**
 * Failure Log Create Callbacks Hook
 * Handles failure creation and logging operations
 */

import { useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { FailureLog } from "../../types/training";
import {
  findSimilarFailures,
  updateFailurePattern,
} from "./failureLogUtils";

interface FailureLogCreateCallbacksParams {
  userId: string | undefined;
  setLoading: (loading: boolean) => void;
}

export function useFailureLogCreateCallbacks({ userId, setLoading }: FailureLogCreateCallbacksParams) {
  const logFailure = useCallback(
    async (
      failureData: Omit<
        FailureLog,
        "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
      >,
    ): Promise<string> => {
      if (!userId) throw new Error("User not authenticated");
      setLoading(true);
      try {
        const previousFailures = await findSimilarFailures(
          userId,
          failureData.category,
          failureData.title,
        );
        const isRecurring = previousFailures.length > 0;
        const previousOccurrences = previousFailures.map((f) => f.id);
        const failure: Omit<FailureLog, "id"> = {
          ...failureData,
          userId,
          timestamp: new Date(),
          isRecurring,
          previousOccurrences,
        };
        const docRef = await addDoc(collection(db, "failureLogs"), {
          ...failure,
          timestamp: serverTimestamp(),
        });
        if (isRecurring)
          await updateFailurePattern(
            userId,
            failureData.category,
            failureData.title,
            docRef.id,
          );
        return docRef.id;
      } catch (error) {
        console.error("Error logging failure:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [userId, setLoading],
  );

  return { logFailure };
}
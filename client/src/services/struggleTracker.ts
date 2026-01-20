/**
 * Struggle Tracking Service
 * Persists struggle documentation and hint usage to Firestore
 */

import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { StruggleLog } from "../components/StruggleTimer";

export class StruggleTracker {
  /**
   * Save struggle documentation to Firestore
   */
  static async saveStruggleLog(
    userId: string,
    labId: string,
    labTitle: string,
    struggles: StruggleLog,
  ): Promise<void> {
    try {
      const sessionRef = doc(db, "users", userId, "struggleSessions", labId);
      await setDoc(
        sessionRef,
        {
          labId,
          labTitle,
          struggles: {
            attemptedSolutions: struggles.attemptedSolutions,
            stuckPoint: struggles.stuckPoint,
            hypothesis: struggles.hypothesis,
            submittedAt: serverTimestamp(),
          },
          lastUpdated: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error saving struggle log:", error);
    }
  }

  /**
   * Track hint viewing
   */
  static async trackHintView(
    userId: string,
    labId: string,
    hintId: number,
    timestamp: Date,
  ): Promise<void> {
    try {
      const hintRef = collection(
        db,
        "users",
        userId,
        "struggleSessions",
        labId,
        "hints",
      );
      await addDoc(hintRef, {
        hintId,
        viewedAt: serverTimestamp(),
        timestamp: timestamp.toISOString(),
      });

      // Update main session
      const sessionRef = doc(db, "users", userId, "struggleSessions", labId);
      await setDoc(
        sessionRef,
        {
          lastHintViewedAt: serverTimestamp(),
          totalHintsViewed: hintId, // This is a simplification - in production, increment properly
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error tracking hint view:", error);
    }
  }

  /**
   * Track solution viewing (after 90 minutes)
   */
  static async trackSolutionView(
    userId: string,
    labId: string,
    timestamp: Date,
  ): Promise<void> {
    try {
      const sessionRef = doc(db, "users", userId, "struggleSessions", labId);
      await setDoc(
        sessionRef,
        {
          solutionViewedAt: serverTimestamp(),
          solutionTimestamp: timestamp.toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error tracking solution view:", error);
    }
  }

  /**
   * Mark struggle session as complete
   */
  static async completeSession(
    userId: string,
    labId: string,
    totalTimeSpent: number,
  ): Promise<void> {
    try {
      const sessionRef = doc(db, "users", userId, "struggleSessions", labId);
      await setDoc(
        sessionRef,
        {
          completedAt: serverTimestamp(),
          totalTimeSpent,
          status: "completed",
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error completing struggle session:", error);
    }
  }
}

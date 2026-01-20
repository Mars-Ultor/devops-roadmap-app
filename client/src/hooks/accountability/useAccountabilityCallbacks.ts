/**
 * Accountability Callbacks Hook
 * Extracted callback functions from useAccountability
 * For ESLint compliance (max-lines-per-function)
 */

import { useCallback } from "react";
import type {
  WeeklyCommitment,
  Commitment,
  AccountabilityPartner,
  PublicCommitment,
} from "../../types/accountability";
import {
  createWeeklyCommitmentInDB,
  updateCommitmentProgressInDB,
  deleteIndividualCommitmentFromDB,
  deleteWeeklyCommitmentFromDB,
  completeWeeklyCheckInInDB,
  makePublicCommitmentInDB,
} from "./accountabilityOperations";

export function useAccountabilityCallbacks(
  userId: string | undefined,
  currentWeekCommitment: WeeklyCommitment | null,
  callbacks: {
    setCurrentWeekCommitment: (commitment: WeeklyCommitment | null) => void;
    setPartners: (partners: AccountabilityPartner[]) => void;
    setPublicCommitments: (commitments: PublicCommitment[]) => void;
    loadCurrentWeekCommitment: () => Promise<void>;
    loadPublicCommitments: () => Promise<void>;
  }
) {
  const createWeeklyCommitment = useCallback(async (
    commitments: Omit<Commitment, "id" | "current" | "status">[],
  ): Promise<void> => {
    if (!userId) throw new Error("Not authenticated");
    await createWeeklyCommitmentInDB(userId, commitments);
    await callbacks.loadCurrentWeekCommitment();
  }, [userId, callbacks]);

  const updateCommitmentProgress = useCallback(async (
    commitmentId: string,
    progress: number,
  ): Promise<void> => {
    if (!currentWeekCommitment) return;
    await updateCommitmentProgressInDB(commitmentId, currentWeekCommitment, progress);
    await callbacks.loadCurrentWeekCommitment();
  }, [currentWeekCommitment, callbacks]);

  const deleteIndividualCommitment = useCallback(async (
    commitmentId: string,
  ): Promise<void> => {
    if (!currentWeekCommitment) return;
    await deleteIndividualCommitmentFromDB(commitmentId, currentWeekCommitment);
    if (currentWeekCommitment.commitments.filter(c => c.id !== commitmentId).length === 0) {
      callbacks.setCurrentWeekCommitment(null);
    } else {
      await callbacks.loadCurrentWeekCommitment();
    }
  }, [currentWeekCommitment, callbacks]);

  const deleteWeeklyCommitment = useCallback(async (): Promise<void> => {
    if (!currentWeekCommitment?.id) return;
    await deleteWeeklyCommitmentFromDB(currentWeekCommitment.id);
    callbacks.setCurrentWeekCommitment(null);
  }, [currentWeekCommitment, callbacks]);

  const completeWeeklyCheckIn = useCallback(async (
    reflection: string,
    nextWeekFocus: string,
  ): Promise<void> => {
    if (!userId || !currentWeekCommitment) return;
    await completeWeeklyCheckInInDB(userId, currentWeekCommitment, reflection, nextWeekFocus);
  }, [userId, currentWeekCommitment]);

  const makePublicCommitment = useCallback(async (
    commitment: string,
    targetDate: Date,
    witnesses: string[],
  ): Promise<void> => {
    if (!userId) throw new Error("Not authenticated");
    const userName = "User"; // Simplified for now
    await makePublicCommitmentInDB(userId, userName, commitment, targetDate, witnesses);
    await callbacks.loadPublicCommitments();
  }, [userId, callbacks]);

  const loadPartners = useCallback(async (): Promise<void> => {
    const partners = await loadPartnersFromDB();
    callbacks.setPartners(partners);
  }, [callbacks]);

  const loadPublicCommitments = useCallback(async (): Promise<void> => {
    const publicCommitments = await loadPublicCommitmentsFromDB();
    callbacks.setPublicCommitments(publicCommitments);
  }, [callbacks]);

  return {
    createWeeklyCommitment,
    updateCommitmentProgress,
    deleteIndividualCommitment,
    deleteWeeklyCommitment,
    completeWeeklyCheckIn,
    makePublicCommitment,
    loadPartners,
    loadPublicCommitments,
    getAccountabilityStats,
  };
}
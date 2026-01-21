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
  loadPartnersFromDB,
  loadPublicCommitmentsFromDB,
} from "./accountabilityOperations";
import {
  getDefaultAccountabilityStats,
} from "./accountabilityUtils";

export function useAccountabilityCallbacks(
  userId: string | undefined,
  currentWeekCommitment: WeeklyCommitment | null,
  callbacks: {
    setCurrentWeekCommitment: (commitment: WeeklyCommitment | null) => void;
    setPartners: (partners: AccountabilityPartner[]) => void;
    setPublicCommitments: (commitments: PublicCommitment[]) => void;
    loadCurrentWeekCommitment: () => Promise<void>;
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

  const loadPublicCommitments = useCallback(async (): Promise<void> => {
    if (!userId) return;
    const publicCommitments = await loadPublicCommitmentsFromDB(userId);
    callbacks.setPublicCommitments(publicCommitments);
  }, [userId, callbacks]);

  const loadPartners = useCallback(async (): Promise<void> => {
    if (!userId) return;
    const partners = await loadPartnersFromDB(userId);
    callbacks.setPartners(partners);
  }, [userId, callbacks]);

  const getAccountabilityStats = useCallback(async () => {
    if (!userId) return getDefaultAccountabilityStats();
    // For now, return default stats - full implementation would require more data
    return getDefaultAccountabilityStats();
  }, [userId]);

  const makePublicCommitment = useCallback(async (
    commitment: string,
    targetDate: Date,
    witnesses: string[],
  ): Promise<void> => {
    if (!userId) throw new Error("Not authenticated");
    const userName = "User"; // Simplified for now
    await makePublicCommitmentInDB(userId, userName, commitment, targetDate, witnesses);
    await loadPublicCommitments();
  }, [userId, loadPublicCommitments]);

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
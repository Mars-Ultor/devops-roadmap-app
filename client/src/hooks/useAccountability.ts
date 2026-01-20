/**
 * Accountability System Hook - Refactored
 * Manage weekly commitments and accountability partners
 */

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  WeeklyCommitment,
  AccountabilityPartner,
  PublicCommitment,
} from "../types/accountability";
import {
  loadCurrentWeekCommitmentFromDB,
} from "./accountability/accountabilityOperations";
import { useAccountabilityCallbacks } from "./accountability/useAccountabilityCallbacks";

export function useAccountability() {
  const { user } = useAuthStore();
  const [currentWeekCommitment, setCurrentWeekCommitment] =
    useState<WeeklyCommitment | null>(null);
  const [partners, setPartners] = useState<AccountabilityPartner[]>([]);
  const [publicCommitments, setPublicCommitments] = useState<
    PublicCommitment[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentWeekCommitment = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const commitment = await loadCurrentWeekCommitmentFromDB(user.uid);
      setCurrentWeekCommitment(commitment);
    } catch (e) {
      console.error("Error loading week commitment:", e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadCurrentWeekCommitment();
      loadPartners();
      loadPublicCommitments();
    }
  }, [
    user?.uid,
    loadCurrentWeekCommitment,
    loadPartners,
    loadPublicCommitments,
  ]);

  const {
    createWeeklyCommitment,
    updateCommitmentProgress,
    deleteIndividualCommitment,
    deleteWeeklyCommitment,
    completeWeeklyCheckIn,
    makePublicCommitment,
    loadPartners,
    loadPublicCommitments,
    getAccountabilityStats,
  } = useAccountabilityCallbacks(user?.uid, currentWeekCommitment, {
    setCurrentWeekCommitment,
    setPartners,
    setPublicCommitments,
    loadCurrentWeekCommitment,
    loadPublicCommitments,
  });

  return {
    currentWeekCommitment,
    partners,
    publicCommitments,
    loading,
    createWeeklyCommitment,
    updateCommitmentProgress,
    deleteIndividualCommitment,
    deleteWeeklyCommitment,
    completeWeeklyCheckIn,
    makePublicCommitment,
    getAccountabilityStats,
    refreshCommitment: loadCurrentWeekCommitment,
  };
}

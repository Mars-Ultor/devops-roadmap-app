/**
 * Battle Drill Effects Hook
 * Handles side effects for battle drill loading
 */

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { initializeBattleDrillPerformance } from "../../lib/firestoreSchema";
import type { BattleDrillStateSetters } from "./useBattleDrillState";

interface UseBattleDrillEffectsProps {
  drillId?: string;
  setters: BattleDrillStateSetters;
}

export function useBattleDrillEffects({ drillId, setters }: UseBattleDrillEffectsProps) {
  const { user } = useAuthStore();
  const { setPerformance, setLoading } = setters;

  useEffect(() => {
    if (!user?.uid || !drillId) {
      setLoading(false);
      return;
    }
    loadPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, drillId]);

  const loadPerformance = async () => {
    if (!user?.uid || !drillId) return;
    try {
      setLoading(true);
      setPerformance(await initializeBattleDrillPerformance(user.uid, drillId));
    } catch (e) {
      console.error("Error loading drill performance:", e);
    } finally {
      setLoading(false);
    }
  };

  return {
    loadPerformance,
  };
}
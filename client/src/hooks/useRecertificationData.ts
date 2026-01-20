import { useState, useEffect, useCallback } from "react";
import { CertificationService } from "../services/certificationService";
import type {
  CertificationStatus,
  RecertificationAttempt,
} from "../types/training";

interface UseRecertificationDataReturn {
  certificationStatus: CertificationStatus[];
  recentAttempts: RecertificationAttempt[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useRecertificationData = (
  userId: string | undefined,
): UseRecertificationDataReturn => {
  const [certificationStatus, setCertificationStatus] = useState<
    CertificationStatus[]
  >([]);
  const [recentAttempts, setRecentAttempts] = useState<
    RecertificationAttempt[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [certifications, attempts] = await Promise.all([
        CertificationService.getUserCertifications(),
        CertificationService.getRecertificationAttempts(),
      ]);

      setCertificationStatus(certifications);
      setRecentAttempts(attempts);
    } catch (err) {
      console.error("Error loading certification data:", err);
      setError("Failed to load certification data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    certificationStatus,
    recentAttempts,
    loading,
    error,
    refreshData: loadData,
  };
};

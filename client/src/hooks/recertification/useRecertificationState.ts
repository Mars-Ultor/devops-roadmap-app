/**
 * Recertification State Hook
 * Manages state for recertification operations
 */

import { useState } from "react";
import type { RecertificationStatus } from "./recertificationUtils";

export function useRecertificationState() {
  const [status, setStatus] = useState<RecertificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  return {
    status,
    setStatus,
    loading,
    setLoading,
  };
}
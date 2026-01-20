/**
 * Failure Log State Hook
 * Manages state for failure logging operations
 */

import { useState } from "react";

export function useFailureLogState() {
  const [loading, setLoading] = useState(false);

  return {
    loading,
    setLoading,
  };
}
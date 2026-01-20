/**
 * Task Validation State Hook
 * Manages state for task validation
 */

import { useRef } from "react";

export function useTaskValidationState() {
  const completedTasksRef = useRef<Set<string>>(new Set());

  return {
    completedTasksRef,
  };
}
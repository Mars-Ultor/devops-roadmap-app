/**
 * Lab Commands State Hook
 * Manages state for lab command execution
 */

import { useRef } from "react";

export function useLabCommandsState() {
  const completedTasksRef = useRef<Set<number>>(new Set());

  return {
    completedTasksRef,
  };
}
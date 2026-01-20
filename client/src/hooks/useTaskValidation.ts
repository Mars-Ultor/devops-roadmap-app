/**
 * Task Validation Hook
 * Handles task completion validation for the enhanced terminal
 */

import type {
  TCSTask,
  CommandContext,
} from "../types/tcs";
import { useTaskValidationState } from "./task-validation/useTaskValidationState";
import { useTaskValidationCallbacks } from "./task-validation/useTaskValidationCallbacks";

interface UseTaskValidationProps {
  tasks: TCSTask[];
  context: CommandContext;
  onTaskComplete?: (taskId: string) => void;
  onScenarioComplete?: () => void;
}

export function useTaskValidation({
  tasks,
  context,
  onTaskComplete,
  onScenarioComplete,
}: UseTaskValidationProps) {
  // Use extracted state hook
  const { completedTasksRef } = useTaskValidationState();

  // Use extracted callbacks hook
  const {
    validateTaskCompletion,
    displayHint,
    displayTasks,
    getCompletedTasksCount,
  } = useTaskValidationCallbacks({
    tasks,
    context,
    onTaskComplete,
    onScenarioComplete,
    completedTasksRef,
  });

  return {
    validateTaskCompletion,
    displayHint,
    displayTasks,
    getCompletedTasksCount,
  };
}

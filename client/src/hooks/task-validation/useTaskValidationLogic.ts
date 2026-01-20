/**
 * Task Validation Logic Hook
 * Handles validation logic for task completion
 */

import type { TCSTask } from "../../types/tcs";

interface UseTaskValidationLogicProps {
  tasks: TCSTask[];
  completedTasksRef: React.MutableRefObject<Set<string>>;
  onTaskComplete?: (taskId: string) => void;
}

export function useTaskValidationLogic({
  tasks,
  completedTasksRef,
  onTaskComplete,
}: UseTaskValidationLogicProps) {
  const validateTask = (taskId: string, output: string): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (task.validationType === "command") {
      return task.expectedOutput
        ? output.includes(task.expectedOutput)
        : true;
    }

    if (task.validationType === "output") {
      return task.expectedOutput
        ? output.includes(task.expectedOutput)
        : false;
    }

    return false;
  };

  const validateAllTasks = (output: string): string[] => {
    const newlyCompleted: string[] = [];

    tasks.forEach((task) => {
      if (!completedTasksRef.current.has(task.id) && validateTask(task.id, output)) {
        completedTasksRef.current.add(task.id);
        newlyCompleted.push(task.id);
        onTaskComplete?.(task.id);
      }
    });

    return newlyCompleted;
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return completedTasksRef.current.has(taskId);
  };

  const getIncompleteTasks = (): TCSTask[] => {
    return tasks.filter((t) => !completedTasksRef.current.has(t.id));
  };

  const resetValidation = () => {
    completedTasksRef.current.clear();
  };

  return {
    validateTask,
    validateAllTasks,
    isTaskCompleted,
    getIncompleteTasks,
    resetValidation,
  };
}
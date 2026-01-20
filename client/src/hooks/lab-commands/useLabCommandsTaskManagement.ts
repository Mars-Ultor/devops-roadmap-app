/**
 * Lab Commands Task Management Hook
 * Handles task completion logic
 */

import { checkLabTaskCompletion } from "./labCommandsUtils";

interface UseLabCommandsTaskProps {
  labId: string;
  tasks: string[];
  terminalInstance: React.MutableRefObject<import("@xterm/xterm").Terminal | null>;
  onTaskComplete?: (taskIndex: number) => void;
  onLabComplete?: () => void;
  completedTasksRef: React.MutableRefObject<Set<number>>;
}

export function useLabCommandsTaskManagement({
  labId,
  tasks,
  terminalInstance,
  onTaskComplete,
  onLabComplete,
  completedTasksRef,
}: UseLabCommandsTaskProps) {
  const markTaskComplete = (taskIndex: number) => {
    completedTasksRef.current.add(taskIndex);
    if (terminalInstance.current) {
      terminalInstance.current.writeln("");
      terminalInstance.current.writeln(
        `\x1b[32m✓ Task ${taskIndex + 1} completed!\x1b[0m`,
      );
      terminalInstance.current.writeln("");
    }
    onTaskComplete?.(taskIndex);
    if (completedTasksRef.current.size === tasks.length) {
      setTimeout(() => {
        if (terminalInstance.current) {
          terminalInstance.current.writeln("");
          terminalInstance.current.writeln(
            "\x1b[32m🎉 Congratulations! Lab completed!\x1b[0m",
          );
          terminalInstance.current.writeln("");
        }
        onLabComplete?.();
      }, 500);
    }
  };

  const checkTaskCompletion = (command: string) => {
    const completedTask = checkLabTaskCompletion(
      labId,
      command,
      completedTasksRef.current,
    );
    if (completedTask !== null) markTaskComplete(completedTask);
  };

  return {
    checkTaskCompletion,
  };
}
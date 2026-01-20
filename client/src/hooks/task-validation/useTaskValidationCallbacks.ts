/**
 * Task Validation Callbacks Hook
 * Handles validation and display callbacks for tasks
 */

import { Terminal } from "@xterm/xterm";
import type {
  TCSTask,
  CommandHistoryEntry,
  CommandContext,
} from "../../types/tcs";
import { useTaskValidationDisplay } from "./useTaskValidationDisplay";

interface UseTaskValidationCallbacksProps {
  tasks: TCSTask[];
  context: CommandContext;
  onTaskComplete?: (taskId: string) => void;
  onScenarioComplete?: () => void;
  completedTasksRef: React.MutableRefObject<Set<string>>;
}

export function useTaskValidationCallbacks({
  tasks,
  context,
  onTaskComplete,
  onScenarioComplete,
  completedTasksRef,
}: UseTaskValidationCallbacksProps) {
  const { displayHint, displayTasks, getCompletedTasksCount } =
    useTaskValidationDisplay({
      tasks,
      completedTasksRef,
    });

  const validateTaskCompletion = (
    command: string,
    _entry: CommandHistoryEntry,
    term: Terminal,
  ) => {
    tasks.forEach((task) => {
      if (completedTasksRef.current.has(task.id)) return;

      let taskCompleted = false;

      // Check each validator
      for (const validator of task.validators) {
        if (validator.pattern.test(command)) {
          const parts = command.split(" ");
          const result = validator.validate(command, parts.slice(1), context);

          if (result.success) {
            taskCompleted = true;
            break;
          }
        }
      }

      if (taskCompleted) {
        completedTasksRef.current.add(task.id);
        term.writeln("");
        term.writeln(
          `\x1b[32m✓ Task completed: ${task.description} (+${task.points} pts)\x1b[0m`,
        );
        term.writeln("");
        onTaskComplete?.(task.id);

        if (completedTasksRef.current.size === tasks.length) {
          setTimeout(() => {
            term.writeln("");
            term.writeln(
              "\x1b[32m═══════════════════════════════════════\x1b[0m",
            );
            term.writeln("\x1b[32m   🎉 MISSION ACCOMPLISHED! 🎉\x1b[0m");
            term.writeln(
              "\x1b[32m═══════════════════════════════════════\x1b[0m",
            );
            term.writeln("");
            onScenarioComplete?.();
          }, 500);
        }
      }
    });
  };

  return {
    validateTaskCompletion,
    displayHint,
    displayTasks,
    getCompletedTasksCount,
  };
}
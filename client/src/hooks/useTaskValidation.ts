/**
 * Task Validation Hook
 * Handles task completion validation for the enhanced terminal
 */

import { useRef } from "react";
import { Terminal } from "@xterm/xterm";
import type {
  TCSTask,
  CommandHistoryEntry,
  CommandContext,
} from "../types/tcs";

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
  const completedTasksRef = useRef<Set<string>>(new Set());

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

  const displayHint = (term: Terminal) => {
    const incompleteTasks = tasks.filter(
      (t) => !completedTasksRef.current.has(t.id),
    );

    if (incompleteTasks.length === 0) {
      term.writeln("\x1b[33mAll tasks completed!\x1b[0m");
      return;
    }

    const nextTask = incompleteTasks[0];
    if (nextTask.hint) {
      term.writeln(`\x1b[33m💡 Hint: ${nextTask.hint}\x1b[0m`);
    } else {
      term.writeln(`\x1b[33mNext task: ${nextTask.description}\x1b[0m`);
    }
  };

  const displayTasks = (term: Terminal) => {
    term.writeln("\x1b[33mTask Progress:\x1b[0m");
    term.writeln("");
    tasks.forEach((task, idx) => {
      const completed = completedTasksRef.current.has(task.id);
      const icon = completed ? "\x1b[32m✓\x1b[0m" : "\x1b[90m○\x1b[0m";
      const status = completed
        ? "\x1b[32m[COMPLETE]\x1b[0m"
        : "\x1b[90m[PENDING]\x1b[0m";
      term.writeln(`  ${icon} ${idx + 1}. ${task.description} ${status}`);
    });
    term.writeln("");
    term.writeln(
      `Progress: ${completedTasksRef.current.size}/${tasks.length} tasks`,
    );
  };

  const getCompletedTasksCount = () => completedTasksRef.current.size;

  return {
    validateTaskCompletion,
    displayHint,
    displayTasks,
    getCompletedTasksCount,
  };
}

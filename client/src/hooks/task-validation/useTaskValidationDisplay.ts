/**
 * Task Validation Display Hook
 * Handles display functions for task validation
 */

import { Terminal } from "@xterm/xterm";
import type { TCSTask } from "../../types/tcs";

interface UseTaskValidationDisplayProps {
  tasks: TCSTask[];
  completedTasksRef: React.MutableRefObject<Set<string>>;
}

export function useTaskValidationDisplay({
  tasks,
  completedTasksRef,
}: UseTaskValidationDisplayProps) {
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
    displayHint,
    displayTasks,
    getCompletedTasksCount,
  };
}
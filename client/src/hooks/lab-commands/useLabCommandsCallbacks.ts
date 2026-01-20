/**
 * Lab Commands Callbacks Hook
 * Orchestrates task management and command execution
 */

import { useLabCommandsTaskManagement } from "./useLabCommandsTaskManagement";
import { useLabCommandsExecution } from "./useLabCommandsExecution";

interface FileSystemNode {
  type: "dir" | "file";
  children?: Record<string, FileSystemNode>;
  content?: string;
}

interface UseLabCommandsCallbacksProps {
  labId: string;
  tasks: string[];
  currentDirRef: React.MutableRefObject<string>;
  fileSystemRef: React.MutableRefObject<Record<string, FileSystemNode>>;
  terminalInstance: React.MutableRefObject<import("@xterm/xterm").Terminal | null>;
  onTaskComplete?: (taskIndex: number) => void;
  onLabComplete?: () => void;
  completedTasksRef: React.MutableRefObject<Set<number>>;
}

export function useLabCommandsCallbacks({
  labId,
  tasks,
  currentDirRef,
  fileSystemRef,
  terminalInstance: _terminalInstance,
  onTaskComplete,
  onLabComplete,
  completedTasksRef,
}: UseLabCommandsCallbacksProps) {
  // Use task management hook
  const { checkTaskCompletion } = useLabCommandsTaskManagement({
    labId,
    tasks,
    terminalInstance: _terminalInstance,
    onTaskComplete,
    onLabComplete,
    completedTasksRef,
  });

  // Use command execution hook
  const { executeCommand: executeCommandOnly } = useLabCommandsExecution({
    currentDirRef,
    fileSystemRef,
  });

  const executeCommand = (command: string, term: import("@xterm/xterm").Terminal) => {
    checkTaskCompletion(command);
    executeCommandOnly(command, term);
  };

  return {
    executeCommand,
  };
}
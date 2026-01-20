/**
 * Lab Commands Hook - Refactored
 * Handles command execution logic for lab terminals
 */

import { Terminal } from "@xterm/xterm";
import { useLabCommandsState } from "./lab-commands/useLabCommandsState";
import { useLabCommandsCallbacks } from "./lab-commands/useLabCommandsCallbacks";

interface FileSystemNode {
  type: "dir" | "file";
  children?: Record<string, FileSystemNode>;
  content?: string;
}

interface UseLabCommandsProps {
  labId: string;
  tasks: string[];
  currentDirRef: React.MutableRefObject<string>;
  fileSystemRef: React.MutableRefObject<Record<string, FileSystemNode>>;
  terminalInstance: React.MutableRefObject<Terminal | null>;
  onTaskComplete?: (taskIndex: number) => void;
  onLabComplete?: () => void;
}

export function useLabCommands({
  labId,
  tasks,
  currentDirRef,
  fileSystemRef,
  terminalInstance,
  onTaskComplete,
  onLabComplete,
}: UseLabCommandsProps) {
  // Use extracted state hook
  const { completedTasksRef } = useLabCommandsState();

  // Use extracted callbacks hook
  const { executeCommand } = useLabCommandsCallbacks({
    labId,
    tasks,
    currentDirRef,
    fileSystemRef,
    terminalInstance,
    onTaskComplete,
    onLabComplete,
    completedTasksRef,
  });

  return { executeCommand, completedTasksRef };
}

/**
 * Lab Commands Hook - Refactored
 * Handles command execution logic for lab terminals
 */
import { useRef } from "react";
import { Terminal } from "@xterm/xterm";
import {
  HELP_TEXT,
  checkLabTaskCompletion,
  executeLs,
  executeCd,
  executeMkdir,
  executeTouch,
  executeCat,
} from "./lab-commands/labCommandsUtils";

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
  const completedTasksRef = useRef<Set<number>>(new Set());

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

  const handleSimpleCommand = (
    cmd: string,
    args: string[],
    term: Terminal,
  ): boolean => {
    if (cmd === "pwd") {
      term.writeln(currentDirRef.current);
      return true;
    }
    if (cmd === "echo") {
      term.writeln(args.join(" "));
      return true;
    }
    if (cmd === "clear") {
      term.clear();
      return true;
    }
    if (cmd === "help") {
      HELP_TEXT.forEach((line) => term.writeln(line));
      return true;
    }
    if (cmd === "") return true;
    return false;
  };

  const handleFileSystemCommand = (
    cmd: string,
    args: string[],
    term: Terminal,
  ): boolean => {
    const fs = fileSystemRef.current,
      dir = currentDirRef.current;
    if (cmd === "ls") {
      const r = executeLs(fs, args[0], dir);
      if (r.output) term.writeln(r.output);
      return true;
    }
    if (cmd === "cd") {
      const r = executeCd(fs, args[0], dir);
      if (r.error) term.writeln(r.error);
      else currentDirRef.current = r.newDir;
      return true;
    }
    if (cmd === "mkdir") {
      const r = executeMkdir(fs, args[0], dir);
      if (r.output) term.writeln(r.output);
      return true;
    }
    if (cmd === "touch") {
      const r = executeTouch(fs, args[0], dir);
      if (r.output) term.writeln(r.output);
      return true;
    }
    if (cmd === "cat") {
      const r = executeCat(fs, args[0], dir);
      if (r.output !== undefined) term.writeln(r.output);
      return true;
    }
    return false;
  };

  const executeCommand = (command: string, term: Terminal) => {
    const parts = command.split(" ");
    const cmd = parts[0],
      args = parts.slice(1);
    checkTaskCompletion(command);
    if (handleSimpleCommand(cmd, args, term)) return;
    if (handleFileSystemCommand(cmd, args, term)) return;
    term.writeln(`${cmd}: command not found`);
  };

  return { executeCommand, completedTasksRef };
}

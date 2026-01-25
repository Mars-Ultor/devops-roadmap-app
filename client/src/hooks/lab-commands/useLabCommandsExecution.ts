/**
 * Lab Commands Execution Hook
 * Handles command execution logic
 */

import { Terminal } from "@xterm/xterm";
import {
  HELP_TEXT,
  executeLs,
  executeCd,
  executeMkdir,
  executeTouch,
  executeCat,
} from "./labCommandsUtils";

interface FileSystemNode {
  type: "dir" | "file";
  children?: Record<string, FileSystemNode>;
  content?: string;
}

interface UseLabCommandsExecutionProps {
  currentDirRef: React.MutableRefObject<string>;
  fileSystemRef: React.MutableRefObject<Record<string, FileSystemNode>>;
}

export function useLabCommandsExecution({
  currentDirRef,
  fileSystemRef,
}: UseLabCommandsExecutionProps) {
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
      console.log("Handling mkdir command with args:", args);
      const r = executeMkdir(fs, args.join(" "), dir);
      console.log("mkdir result:", r);
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
    console.log("Executing command:", command);
    const parts = command.split(" ");
    const cmd = parts[0],
      args = parts.slice(1);
    console.log("Command parts:", { cmd, args });
    if (handleSimpleCommand(cmd, args, term)) return;
    if (handleFileSystemCommand(cmd, args, term)) return;
    term.writeln(`${cmd}: command not found`);
  };

  return {
    executeCommand,
  };
}
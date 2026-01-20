/**
 * Enhanced Terminal Utilities
 * Extracted utility functions from EnhancedTerminal component
 * For ESLint compliance (max-lines-per-function)
 */

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import type {
  CommandContext,
  CommandHistoryEntry,
  TCSTask,
} from "../../types/tcs";
import {
  getAutocompleteSuggestions,
  writePrompt,
} from "../terminalHelpers";
import {
  writeWelcomeBanner,
} from "../../components/enhanced-terminal/EnhancedTerminalConfig";

export interface TerminalRefs {
  terminalRef: React.RefObject<HTMLDivElement>;
  terminalInstance: React.MutableRefObject<Terminal | null>;
  fitAddon: React.MutableRefObject<FitAddon | null>;
  commandHistoryRef: React.MutableRefObject<string[]>;
  historyIndexRef: React.MutableRefObject<number>;
}

export interface TerminalCallbacks {
  executeCommand: (cmd: string, term: Terminal) => CommandHistoryEntry;
  validateTaskCompletion: (
    cmd: string,
    entry: CommandHistoryEntry,
    term: Terminal
  ) => void;
  displayHint: (term: Terminal) => void;
  displayTasks: (term: Terminal) => void;
  onCommandExecuted?: (entry: CommandHistoryEntry) => void;
}

export const initializeTerminal = (
  refs: TerminalRefs,
  context: CommandContext,
  tasks: TCSTask[],
  timeLimit?: number,
  isMobile: boolean = false
) => {
  if (!refs.terminalRef.current) return;

  const term = new Terminal({
    cursorBlink: true,
    fontSize: isMobile ? 12 : 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    allowTransparency: true,
    scrollback: 1000,
  });

  const fit = new FitAddon();
  term.loadAddon(fit);
  term.open(refs.terminalRef.current);
  fit.fit();

  refs.terminalInstance.current = term;
  refs.fitAddon.current = fit;

  writeWelcomeBanner(term, tasks, timeLimit);
  writePrompt(term, context);
  term.focus();

  return { term, fit };
};

export const setupTerminalEventHandlers = (
  term: Terminal,
  fit: FitAddon,
  refs: TerminalRefs,
  context: CommandContext,
  callbacks: TerminalCallbacks
) => {
  let currentCommand = "";

  term.onData((data) => {
    const code = data.charCodeAt(0);
    if (code === 13) {
      // Enter key
      term.writeln("");
      if (currentCommand.trim()) {
        processCommand(currentCommand.trim(), term, refs, callbacks);
      }
      currentCommand = "";
      writePrompt(term, context);
    } else if (code === 127) {
      // Backspace
      if (currentCommand.length > 0) {
        currentCommand = currentCommand.slice(0, -1);
        term.write("\b \b");
      }
    } else if (data === "\x1b[A") {
      // Up arrow
      handleHistoryNavigation(term, refs, context, "up");
      currentCommand = refs.commandHistoryRef.current[refs.historyIndexRef.current] || "";
    } else if (data === "\x1b[B") {
      // Down arrow
      handleHistoryNavigation(term, refs, context, "down");
      currentCommand = refs.commandHistoryRef.current[refs.historyIndexRef.current] || "";
    } else if (code === 9) {
      // Tab key - autocomplete
      handleAutocomplete(term, context, currentCommand);
    } else if (code >= 32 && code <= 126) {
      // Printable characters
      currentCommand += data;
      term.write(data);
    }
  });

  const handleResize = () => fit.fit();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    term.dispose();
  };
};

const processCommand = (
  cmd: string,
  term: Terminal,
  refs: TerminalRefs,
  callbacks: TerminalCallbacks
) => {
  const entry = callbacks.executeCommand(cmd, term);

  if (cmd === "hint") {
    callbacks.displayHint(term);
    entry.success = true;
  } else if (cmd === "tasks") {
    callbacks.displayTasks(term);
    entry.success = true;
  }

  refs.commandHistoryRef.current.push(cmd);
  refs.historyIndexRef.current = refs.commandHistoryRef.current.length;

  callbacks.validateTaskCompletion(cmd, entry, term);
  callbacks.onCommandExecuted?.(entry);
};

const handleHistoryNavigation = (
  term: Terminal,
  refs: TerminalRefs,
  context: CommandContext,
  direction: "up" | "down"
) => {
  const history = refs.commandHistoryRef.current;
  const currentIndex = refs.historyIndexRef.current;

  if (direction === "up") {
    if (currentIndex > 0) {
      term.write("\r\x1b[K");
      writePrompt(term, context);
      refs.historyIndexRef.current--;
      const command = history[refs.historyIndexRef.current];
      term.write(command);
    }
  } else {
    if (currentIndex < history.length - 1) {
      term.write("\r\x1b[K");
      writePrompt(term, context);
      refs.historyIndexRef.current++;
      const command = history[refs.historyIndexRef.current];
      term.write(command);
    } else if (currentIndex === history.length - 1) {
      term.write("\r\x1b[K");
      writePrompt(term, context);
      refs.historyIndexRef.current = history.length;
    }
  }
};

const handleAutocomplete = (
  term: Terminal,
  context: CommandContext,
  currentCommand: string
) => {
  const suggestions = getAutocompleteSuggestions(currentCommand);
  if (suggestions.length === 1) {
    const completion = suggestions[0].slice(currentCommand.length);
    term.write(completion);
  } else if (suggestions.length > 1) {
    term.writeln("");
    term.writeln(suggestions.join("  "));
    writePrompt(term, context);
  }
};
/**
 * Terminal Commands Hook - Refactored
 * Handles command execution logic for the enhanced terminal
 */
import { useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import type { CommandHistoryEntry, CommandContext } from '../types/tcs';
import { displayHelp, executeLs, executeCd, executeCat, executeGrep, executePs, executeNetstat, executeDocker, executeKubectl, executeGit, executeSystemctl } from './terminal-commands/terminalCommandsUtils';

interface UseTerminalCommandsProps {
  context: CommandContext;
  setContext: React.Dispatch<React.SetStateAction<CommandContext>>;
}

type CommandHandler = (args: string[], term: Terminal, entry: CommandHistoryEntry, ctx: CommandContext, setCtx: React.Dispatch<React.SetStateAction<CommandContext>>) => void;

const simpleCommands: Record<string, (term: Terminal, entry: CommandHistoryEntry, ctx: CommandContext) => void> = {
  help: (term, entry) => { displayHelp(term); entry.success = true; },
  hint: (_, entry) => { entry.success = true; },
  tasks: (_, entry) => { entry.success = true; },
  clear: (term, entry) => { term.clear(); entry.success = true; },
  pwd: (term, entry, ctx) => { term.writeln(ctx.currentDir); entry.success = true; entry.output = [ctx.currentDir]; },
  whoami: (term, entry, ctx) => { term.writeln(ctx.environment.USER); entry.success = true; entry.output = [ctx.environment.USER]; },
  env: (term, entry, ctx) => { Object.entries(ctx.environment).forEach(([k, v]) => term.writeln(`${k}=${v}`)); entry.success = true; },
};

const argCommands: Record<string, CommandHandler> = {
  ls: (args, term, entry) => executeLs(args, term, entry),
  cd: (args, term, entry, _, setCtx) => executeCd(args, term, entry, setCtx),
  cat: (args, term, entry) => executeCat(args, term, entry),
  echo: (args, term, entry) => { term.writeln(args.join(' ')); entry.success = true; entry.output = [args.join(' ')]; },
  grep: (args, term, entry) => executeGrep(args, term, entry),
  ps: (args, term, entry) => executePs(args, term, entry),
  netstat: (_, term, entry) => executeNetstat(term, entry),
  ss: (_, term, entry) => executeNetstat(term, entry),
  docker: (args, term, entry) => executeDocker(args, term, entry),
  kubectl: (args, term, entry) => executeKubectl(args, term, entry),
  git: (args, term, entry) => executeGit(args, term, entry),
  systemctl: (args, term, entry) => executeSystemctl(args, term, entry),
};

export function useTerminalCommands({ context, setContext }: UseTerminalCommandsProps) {
  const executeCommand = useCallback((command: string, term: Terminal): CommandHistoryEntry => {
    const parts = command.split(' ').filter(p => p.trim());
    const cmd = parts[0] || '';
    const args = parts.slice(1);
    const entry: CommandHistoryEntry = { command, timestamp: new Date(), success: false, output: [], exitCode: 0 };

    if (cmd === '') { entry.success = true; return entry; }
    
    const simpleHandler = simpleCommands[cmd];
    if (simpleHandler) { simpleHandler(term, entry, context); return entry; }
    
    const argHandler = argCommands[cmd];
    if (argHandler) { argHandler(args, term, entry, context, setContext); return entry; }

    term.writeln(`\x1b[31m${cmd}: command not found\x1b[0m`);
    term.writeln(`Type 'help' for available commands`);
    entry.exitCode = 127;
    entry.output = [`${cmd}: command not found`];
    return entry;
  }, [context, setContext]);

  return { executeCommand };
}

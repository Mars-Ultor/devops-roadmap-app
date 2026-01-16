/**
 * Terminal Helper Utilities
 * Shared utilities for terminal functionality
 */

import type { Terminal } from '@xterm/xterm';
import type { FileSystemNode } from '../types/tcs';

interface TerminalContext {
  currentDir: string;
  environment: { USER: string };
}

export function createInitialFileSystem(): FileSystemNode {
  return {
    type: 'dir',
    name: '/',
    path: '/',
    children: {}
  };
}

export function getAutocompleteSuggestions(partial: string): string[] {
  const commands = [
    'help', 'hint', 'tasks', 'clear', 'pwd', 'ls', 'cd', 'cat', 'echo', 'grep',
    'whoami', 'env', 'ps', 'netstat', 'ss',
    'docker', 'kubectl', 'git', 'systemctl'
  ];

  return commands.filter(cmd => cmd.startsWith(partial));
}

export function writePrompt(term: Terminal, context: TerminalContext) {
  const dir = context.currentDir === '/home/devops' ? '~' : context.currentDir;
  term.write(`\x1b[32m${context.environment.USER}@tcs\x1b[0m:\x1b[34m${dir}\x1b[0m$ `);
}
/**
 * Lab Commands Utilities
 * Helper functions for filesystem simulation and command execution
 */

interface FileSystemNode {
  type: 'dir' | 'file';
  children?: Record<string, FileSystemNode>;
  content?: string;
}

/** Resolve path relative to current directory */
export function resolvePath(path: string, currentDir: string): string {
  if (path.startsWith('/')) return path;
  const parts = currentDir.split('/').filter(Boolean);
  const pathParts = path.split('/');
  for (const part of pathParts) {
    if (part === '..') parts.pop();
    else if (part !== '.' && part !== '') parts.push(part);
  }
  return '/' + parts.join('/');
}

/** Get directory node from filesystem */
export function getDirectory(fileSystem: Record<string, FileSystemNode>, path: string): FileSystemNode | null {
  const parts = path.split('/').filter(Boolean);
  let current = fileSystem['/'];
  for (const part of parts) {
    if (current.children && current.children[part]) current = current.children[part];
    else return null;
  }
  return current;
}

/** Create directory in filesystem */
export function createDirectory(fileSystem: Record<string, FileSystemNode>, path: string): void {
  const parts = path.split('/').filter(Boolean);
  const dirName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = getDirectory(fileSystem, parentPath);
  if (parent && parent.type === 'dir' && dirName) {
    if (!parent.children) parent.children = {};
    parent.children[dirName] = { type: 'dir', children: {} };
  }
}

/** Create file in filesystem */
export function createFile(fileSystem: Record<string, FileSystemNode>, path: string): void {
  const parts = path.split('/').filter(Boolean);
  const fileName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = getDirectory(fileSystem, parentPath);
  if (parent && parent.type === 'dir' && fileName) {
    if (!parent.children) parent.children = {};
    parent.children[fileName] = { type: 'file', content: '' };
  }
}

/** Help command output */
export const HELP_TEXT = [
  'Available commands:',
  '  pwd          - print working directory',
  '  ls [dir]     - list directory contents',
  '  cd <dir>     - change directory',
  '  mkdir <dir>  - create directory',
  '  touch <file> - create empty file',
  '  cat <file>   - display file contents',
  '  echo <text>  - display text',
  '  clear        - clear screen',
  '  help         - show this help'
];

/** Check task completion for specific labs */
export function checkLabTaskCompletion(
  labId: string,
  command: string,
  completedTasks: Set<number>
): number | null {
  if (labId === 'w1-lab1') {
    if (command.includes('cd /home') && !completedTasks.has(0)) return 0;
    if (command.includes('mkdir') && command.includes('devops-practice') && !completedTasks.has(1)) return 1;
    if (command.includes('touch') && command.includes('.txt') && !completedTasks.has(2)) return 2;
  }
  return null;
}

// ============================================================================
// Command Execution Helpers
// ============================================================================

import { Terminal } from '@xterm/xterm';

export interface CommandResult { output?: string; success: boolean }

export function executePwd(currentDir: string): CommandResult {
  return { output: currentDir, success: true };
}

export function executeLs(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string
): CommandResult {
  const targetDir = targetPath ? resolvePath(targetPath, currentDir) : currentDir;
  const dir = getDirectory(fileSystem, targetDir);
  if (dir && dir.type === 'dir') {
    const items = Object.keys(dir.children || {});
    return { output: items.length > 0 ? items.join('  ') : '', success: true };
  }
  return { output: `ls: cannot access '${targetDir}': No such file or directory`, success: false };
}

export function executeCd(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string
): { newDir: string; error?: string } {
  const newDir = targetPath || '/home/user';
  const resolved = resolvePath(newDir, currentDir);
  const target = getDirectory(fileSystem, resolved);
  if (target && target.type === 'dir') return { newDir: resolved };
  return { newDir: currentDir, error: `cd: ${newDir}: No such file or directory` };
}

export function executeMkdir(fileSystem: Record<string, FileSystemNode>, targetPath: string | undefined, currentDir: string): CommandResult {
  if (!targetPath) return { output: 'mkdir: missing operand', success: false };
  createDirectory(fileSystem, resolvePath(targetPath, currentDir));
  return { success: true };
}

export function executeTouch(fileSystem: Record<string, FileSystemNode>, targetPath: string | undefined, currentDir: string): CommandResult {
  if (!targetPath) return { output: 'touch: missing file operand', success: false };
  createFile(fileSystem, resolvePath(targetPath, currentDir));
  return { success: true };
}

export function executeCat(fileSystem: Record<string, FileSystemNode>, targetPath: string | undefined, currentDir: string): CommandResult {
  if (!targetPath) return { output: 'cat: missing file operand', success: false };
  const file = getDirectory(fileSystem, resolvePath(targetPath, currentDir));
  if (file && file.type === 'file') return { output: file.content || '', success: true };
  return { output: `cat: ${targetPath}: No such file or directory`, success: false };
}

export type CommandHandler = (args: string[], term: Terminal, currentDir: string, fileSystem: Record<string, FileSystemNode>, setCurrentDir: (dir: string) => void) => void;

export const commandHandlers: Record<string, (args: string[], currentDir: string, fileSystem: Record<string, FileSystemNode>) => CommandResult | { newDir: string; error?: string }> = {
  pwd: (_, currentDir) => executePwd(currentDir),
  ls: (args, currentDir, fs) => executeLs(fs, args[0], currentDir),
  mkdir: (args, currentDir, fs) => executeMkdir(fs, args[0], currentDir),
  touch: (args, currentDir, fs) => executeTouch(fs, args[0], currentDir),
  cat: (args, currentDir, fs) => executeCat(fs, args[0], currentDir),
  echo: (args) => ({ output: args.join(' '), success: true }),
};

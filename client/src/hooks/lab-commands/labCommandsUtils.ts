/**
 * Lab Commands Utilities
 * Helper functions for filesystem simulation and command execution
 */

interface FileSystemNode {
  type: "dir" | "file";
  children?: Record<string, FileSystemNode>;
  content?: string;
  permissions?: string; // e.g., "755" or "644"
}

/** Resolve path relative to current directory */
export function resolvePath(path: string, currentDir: string): string {
  if (path.startsWith("/")) return path;
  const parts = currentDir.split("/").filter(Boolean);
  const pathParts = path.split("/");
  for (const part of pathParts) {
    if (part === "..") parts.pop();
    else if (part !== "." && part !== "") parts.push(part);
  }
  return "/" + parts.join("/");
}

/** Get directory node from filesystem */
export function getDirectory(
  fileSystem: Record<string, FileSystemNode>,
  path: string,
): FileSystemNode | null {
  const parts = path.split("/").filter(Boolean);
  let current = fileSystem["/"];
  for (const part of parts) {
    if (current.children && current.children[part])
      current = current.children[part];
    else return null;
  }
  return current;
}

/** Create directory recursively (with parents) */
export function createDirectoryRecursive(
  fileSystem: Record<string, FileSystemNode>,
  path: string,
): void {
  const parts = path.split("/").filter(Boolean);
  let currentNode = fileSystem["/"];

  for (const part of parts) {
    if (!currentNode.children) currentNode.children = {};
    if (!currentNode.children[part]) {
      currentNode.children[part] = { type: "dir", children: {}, permissions: "755" };
    }
    currentNode = currentNode.children[part];
  }
}

/** Create directory (non-recursive) */
export function createDirectory(
  fileSystem: Record<string, FileSystemNode>,
  path: string,
): void {
  const parts = path.split("/").filter(Boolean);
  const dirName = parts.pop();
  const parentPath = "/" + parts.join("/");
  const parent = getDirectory(fileSystem, parentPath);
  if (parent && parent.type === "dir" && dirName) {
    if (!parent.children) parent.children = {};
    parent.children[dirName] = { type: "dir", children: {}, permissions: "755" };
  }
}

/** Create file in filesystem */
export function createFile(
  fileSystem: Record<string, FileSystemNode>,
  path: string,
): void {
  const parts = path.split("/").filter(Boolean);
  const fileName = parts.pop();
  const parentPath = "/" + parts.join("/");
  const parent = getDirectory(fileSystem, parentPath);
  if (parent && parent.type === "dir" && fileName) {
    if (!parent.children) parent.children = {};
    parent.children[fileName] = { type: "file", content: "", permissions: "644" };
  }
}

/** Help command output */
export const HELP_TEXT = [
  "Available commands:",
  "  pwd          - print working directory",
  "  ls [-la|-ld] [dir] - list directory contents",
  "    -la        list all files with details",
  "    -ld        list directory itself with details",
  "  cd <dir>     - change directory",
  "  mkdir [-p] <dir> [dir2 ...] - create directory/directories",
  "    -p         create parent directories as needed",
  "  touch <file> - create empty file",
  "  cat <file>   - display file contents",
  "  chmod <mode> <file> - change file permissions",
  "  echo <text>  - display text",
  "  clear        - clear screen",
  "  help         - show this help",
];

/** Check task completion for specific labs */
export function checkLabTaskCompletion(
  labId: string,
  command: string,
  completedTasks: Set<number>,
): number | null {
  if (labId === "w1-lab1") {
    if (command.includes("cd /home") && !completedTasks.has(0)) return 0;
    if (
      command.includes("mkdir") &&
      command.includes("devops-practice") &&
      !completedTasks.has(1)
    )
      return 1;
    if (
      command.includes("touch") &&
      command.includes(".txt") &&
      !completedTasks.has(2)
    )
      return 2;
  }
  return null;
}

// ============================================================================
// Command Execution Helpers
// ============================================================================

import { Terminal } from "@xterm/xterm";

export interface CommandResult {
  output?: string;
  success: boolean;
}

export function executePwd(currentDir: string): CommandResult {
  return { output: currentDir, success: true };
}

export function executeChmod(
  fileSystem: Record<string, FileSystemNode>,
  args: string,
  currentDir: string,
): CommandResult {
  if (!args) return { output: "chmod: missing operand", success: false };
  
  const parts = args.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return { output: "chmod: missing operand\nTry 'chmod MODE FILE'", success: false };
  }
  
  const [mode, ...filePaths] = parts;
  
  // Validate mode (accept numeric like 755 or symbolic like u+x)
  const numericMode = /^[0-7]{3,4}$/;
  const symbolicMode = /^[ugoa]*[+-=][rwx]+$/;
  
  if (!numericMode.test(mode) && !symbolicMode.test(mode)) {
    return { output: `chmod: invalid mode: '${mode}'`, success: false };
  }
  
  // Apply chmod to each file
  for (const filePath of filePaths) {
    const fullPath = resolvePath(filePath, currentDir);
    const node = getDirectory(fileSystem, fullPath);
    
    if (!node) {
      return {
        output: `chmod: cannot access '${filePath}': No such file or directory`,
        success: false,
      };
    }
    
    // For simplicity, just store numeric mode (convert symbolic to numeric if needed)
    if (numericMode.test(mode)) {
      node.permissions = mode.slice(-3); // Take last 3 digits
    } else {
      // Simple symbolic mode handling (u+x -> add execute for user)
      const currentPerms = node.permissions || (node.type === "dir" ? "755" : "644");
      let perms = parseInt(currentPerms, 8);
      
      if (mode.includes("+x")) {
        perms |= 0o111; // Add execute for all
      } else if (mode.includes("-x")) {
        perms &= ~0o111; // Remove execute for all
      } else if (mode.includes("+w")) {
        perms |= 0o222; // Add write for all
      } else if (mode.includes("-w")) {
        perms &= ~0o222; // Remove write for all
      } else if (mode.includes("+r")) {
        perms |= 0o444; // Add read for all
      } else if (mode.includes("-r")) {
        perms &= ~0o444; // Remove read for all
      }
      
      node.permissions = perms.toString(8).slice(-3);
    }
  }
  
  return { success: true };
}

/** Convert numeric permissions to symbolic format */
function permissionsToSymbolic(perms: string, type: "dir" | "file"): string {
  const typeChar = type === "dir" ? "d" : "-";
  const octal = perms.padStart(3, "0");
  let result = typeChar;
  
  for (const digit of octal) {
    const n = parseInt(digit);
    result += (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-");
  }
  return result;
}

export function executeLs(
  fileSystem: Record<string, FileSystemNode>,
  args: string,
  currentDir: string,
): CommandResult {
  console.log("executeLs called with:", { args, currentDir });
  console.log("Current filesystem:", JSON.stringify(fileSystem, null, 2));
  
  // Parse arguments for flags
  const argParts = args ? args.split(/\s+/).filter(Boolean) : [];
  let showDetails = false;
  let showAll = false;
  let dirOnly = false;
  let targetPath = currentDir;
  
  for (const arg of argParts) {
    if (arg === "-la" || arg === "-al") {
      showDetails = true;
      showAll = true;
    } else if (arg === "-ld" || arg === "-dl") {
      showDetails = true;
      dirOnly = true;
    } else if (arg === "-l") {
      showDetails = true;
    } else if (arg === "-a") {
      showAll = true;
    } else if (!arg.startsWith("-")) {
      targetPath = resolvePath(arg, currentDir);
    }
  }
  
  const dir = getDirectory(fileSystem, targetPath);
  if (!dir) {
    return {
      output: `ls: cannot access '${targetPath}': No such file or directory`,
      success: false,
    };
  }
  
  // If -ld flag, show directory itself
  if (dirOnly) {
    const perms = permissionsToSymbolic(dir.permissions || "755", dir.type);
    const output = `${perms}  1 user user  4096 Jan 25 12:00 ${targetPath.split("/").filter(Boolean).pop() || "/"}`;
    return { output, success: true };
  }
  
  if (dir.type !== "dir") {
    return { output: `ls: ${targetPath}: Not a directory`, success: false };
  }
  
  const items = Object.entries(dir.children || {});
  
  // Filter out hidden files unless -a flag is used
  const filteredItems = showAll ? items : items.filter(([name]) => !name.startsWith('.'));
  
  if (showDetails) {
    const lines = filteredItems.map(([name, node]) => {
      const perms = permissionsToSymbolic(node.permissions || (node.type === "dir" ? "755" : "644"), node.type);
      const size = node.type === "file" ? (node.content?.length || 0) : 4096;
      return `${perms}  1 user user  ${size.toString().padStart(4)} Jan 25 12:00 ${name}`;
    });
    console.log("ls found items:", filteredItems.map(([name]) => name));
    return { output: lines.join("\n"), success: true };
  }
  
  const names = filteredItems.map(([name]) => name);
  console.log("ls found items:", names);
  return { output: names.length > 0 ? names.join("  ") : "", success: true };
}

export function executeCd(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string,
): { newDir: string; error?: string } {
  const newDir = targetPath || "/home/user";
  const resolved = resolvePath(newDir, currentDir);
  const target = getDirectory(fileSystem, resolved);
  if (target && target.type === "dir") return { newDir: resolved };
  return {
    newDir: currentDir,
    error: `cd: ${newDir}: No such file or directory`,
  };
}

export function executeMkdir(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string,
): CommandResult {
  console.log("executeMkdir called with:", { targetPath, currentDir });
  console.log("Filesystem before mkdir:", JSON.stringify(fileSystem, null, 2));
  if (!targetPath) return { output: "mkdir: missing operand", success: false };

  // Parse arguments for flags and directories
  const args = targetPath.split(/\s+/);
  let createParents = false;
  const directories: string[] = [];

  for (const arg of args) {
    if (arg === "-p") {
      createParents = true;
    } else if (!arg.startsWith("-")) {
      directories.push(arg);
    } else {
      return { output: `mkdir: invalid option -- '${arg}'`, success: false };
    }
  }

  if (directories.length === 0) {
    return { output: "mkdir: missing operand", success: false };
  }

  // Create each directory
  for (const dirPath of directories) {
    const fullPath = resolvePath(dirPath, currentDir);

    if (createParents) {
      // Create parent directories as needed
      createDirectoryRecursive(fileSystem, fullPath);
    } else {
      // Check if parent exists
      const parts = fullPath.split("/").filter(Boolean);
      parts.pop(); // Remove the directory name to get parent path
      const parentPath = "/" + parts.join("/");
      const parent = getDirectory(fileSystem, parentPath);

      if (!parent) {
        return {
          output: `mkdir: cannot create directory '${dirPath}': No such file or directory`,
          success: false,
        };
      }

      createDirectory(fileSystem, fullPath);
    }
  }

  console.log("executeMkdir returning success");
  console.log("Filesystem after mkdir:", JSON.stringify(fileSystem, null, 2));
  return { success: true };
}

export function executeTouch(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string,
): CommandResult {
  if (!targetPath)
    return { output: "touch: missing file operand", success: false };
  createFile(fileSystem, resolvePath(targetPath, currentDir));
  return { output: "", success: true };
}

export function executeCat(
  fileSystem: Record<string, FileSystemNode>,
  targetPath: string | undefined,
  currentDir: string,
): CommandResult {
  if (!targetPath)
    return { output: "cat: missing file operand", success: false };
  const file = getDirectory(fileSystem, resolvePath(targetPath, currentDir));
  if (file && file.type === "file")
    return { output: file.content || "", success: true };
  return {
    output: `cat: ${targetPath}: No such file or directory`,
    success: false,
  };
}

export type CommandHandler = (
  args: string[],
  term: Terminal,
  currentDir: string,
  fileSystem: Record<string, FileSystemNode>,
  setCurrentDir: (dir: string) => void,
) => void;

export const commandHandlers: Record<
  string,
  (
    args: string[],
    currentDir: string,
    fileSystem: Record<string, FileSystemNode>,
  ) => CommandResult | { newDir: string; error?: string }
> = {
  pwd: (_, currentDir) => executePwd(currentDir),
  ls: (args, currentDir, fs) => executeLs(fs, args.join(" "), currentDir),
  mkdir: (args, currentDir, fs) => executeMkdir(fs, args.join(" "), currentDir),
  touch: (args, currentDir, fs) => executeTouch(fs, args[0], currentDir),
  cat: (args, currentDir, fs) => executeCat(fs, args[0], currentDir),
  chmod: (args, currentDir, fs) => executeChmod(fs, args.join(" "), currentDir),
  echo: (args) => ({ output: args.join(" "), success: true }),
};

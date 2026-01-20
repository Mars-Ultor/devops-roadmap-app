/**
 * Lab Terminal Sub-Components
 * Extracted from LabTerminal.tsx for ESLint compliance
 */

export interface FileSystemNode {
  type: "dir" | "file";
  children?: Record<string, FileSystemNode>;
  content?: string;
}

export const LAB_TERMINAL_THEME = {
  background: "#1e293b",
  foreground: "#e2e8f0",
  cursor: "#60a5fa",
  black: "#1e293b",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: "#e2e8f0",
};

export function createInitialLabFileSystem(): Record<string, FileSystemNode> {
  return {
    "/": {
      type: "dir",
      children: {
        home: {
          type: "dir",
          children: { user: { type: "dir", children: {} } },
        },
        etc: { type: "dir", children: {} },
        var: { type: "dir", children: {} },
      },
    },
  };
}

export function writeLabWelcome(
  term: { writeln: (s: string) => void },
  tasks: string[],
) {
  term.writeln("Welcome to DevOps Learning Lab!");
  term.writeln("Complete the tasks below to earn XP.\n");
  term.writeln("Tasks:");
  tasks.forEach((task, idx) => {
    term.writeln(`  ${idx + 1}. ${task}`);
  });
  term.writeln("");
}

export function writeLabPrompt(
  term: { write: (s: string) => void },
  currentDir: string,
) {
  term.write(`\x1b[32muser@devops\x1b[0m:\x1b[34m${currentDir}\x1b[0m$ `);
}

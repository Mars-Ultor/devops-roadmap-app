/**
 * Terminal Command Simulation (TCS) Types
 * Enhanced terminal with realistic DevOps command validation
 */

export interface CommandValidator {
  pattern: RegExp;
  validate: (
    command: string,
    args: string[],
    context: CommandContext,
  ) => ValidationResult;
  description: string;
  category: "linux" | "docker" | "kubernetes" | "git" | "networking" | "system";
}

export interface CommandContext {
  currentDir: string;
  fileSystem: FileSystemNode;
  environment: Record<string, string>;
  history: string[];
  runningProcesses: Process[];
  network: NetworkState;
}

export interface ValidationResult {
  success: boolean;
  output: string[];
  exitCode: number;
  sideEffects?: SideEffect[];
  metadata?: Record<string, unknown>;
}

export interface SideEffect {
  type: "filesystem" | "process" | "network" | "environment";
  action: "create" | "modify" | "delete" | "start" | "stop";
  target: string;
  value?: unknown;
}

export interface FileSystemNode {
  type: "file" | "dir" | "symlink";
  name: string;
  path: string;
  content?: string;
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: Date;
  children?: Record<string, FileSystemNode>;
}

export interface Process {
  pid: number;
  name: string;
  status: "running" | "stopped" | "zombie";
  cpu: number;
  memory: number;
  command: string;
}

export interface NetworkState {
  interfaces: NetworkInterface[];
  connections: Connection[];
  routes: Route[];
}

export interface NetworkInterface {
  name: string;
  ip: string;
  mac: string;
  status: "up" | "down";
}

export interface Connection {
  protocol: "tcp" | "udp";
  localAddr: string;
  localPort: number;
  remoteAddr: string;
  remotePort: number;
  state: string;
}

export interface Route {
  destination: string;
  gateway: string;
  interface: string;
}

export interface TCSTask {
  id: string;
  description: string;
  hint?: string;
  validators: CommandValidator[];
  requiredCommands?: string[];
  timeLimit?: number;
  points: number;
}

export interface TCSScenario {
  id: string;
  title: string;
  description: string;
  difficulty: "recruit" | "soldier" | "specialist" | "elite";
  category: "linux" | "docker" | "kubernetes" | "git" | "cicd" | "security";
  tasks: TCSTask[];
  initialState: Partial<CommandContext>;
  successCriteria: string[];
  timeLimit: number; // seconds
}

export interface TCSSession {
  id: string;
  userId: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  tasksCompleted: number;
  totalTasks: number;
  commandHistory: CommandHistoryEntry[];
  mistakes: CommandMistake[];
  timeSpent: number;
}

export interface CommandHistoryEntry {
  command: string;
  timestamp: Date;
  success: boolean;
  output: string[];
  exitCode: number;
}

export interface CommandMistake {
  command: string;
  error: string;
  correctCommand?: string;
  hint?: string;
  timestamp: Date;
}

// Pre-defined validators for common commands
export const LINUX_VALIDATORS: Record<string, CommandValidator> = {
  ls: {
    pattern: /^ls\b/,
    category: "linux",
    description: "List directory contents",
    validate: (_cmd, _args, _ctx) => {
      // Parameters are intentionally unused in simulation
      void _cmd;
      void _args;
      void _ctx;
      // Simulate ls output
      return {
        success: true,
        output: ["file1.txt", "file2.txt", "directory1/"],
        exitCode: 0,
      };
    },
  },
  grep: {
    pattern: /^grep\b/,
    category: "linux",
    description: "Search text using patterns",
    validate: (_cmd, args, _ctx) => {
      // Parameters are intentionally unused in simulation (except args)
      void _cmd;
      void _ctx;
      if (args.length < 2) {
        return {
          success: false,
          output: ["grep: missing pattern or file"],
          exitCode: 1,
        };
      }
      return {
        success: true,
        output: ["matching line 1", "matching line 2"],
        exitCode: 0,
      };
    },
  },
  docker: {
    pattern: /^docker\b/,
    category: "docker",
    description: "Docker container management",
    validate: (_cmd, args, _ctx) => {
      // Parameters are intentionally unused in simulation (except args)
      void _cmd;
      void _ctx;
      const subcommand = args[0];

      if (!subcommand) {
        return {
          success: false,
          output: ["Usage: docker [OPTIONS] COMMAND"],
          exitCode: 1,
        };
      }

      return {
        success: true,
        output: [`Docker ${subcommand} executed`],
        exitCode: 0,
      };
    },
  },
  kubectl: {
    pattern: /^kubectl\b/,
    category: "kubernetes",
    description: "Kubernetes cluster management",
    validate: (_cmd, args, _ctx) => {
      // Parameters are intentionally unused in simulation (except args)
      void _cmd;
      void _ctx;
      const subcommand = args[0];

      if (!subcommand) {
        return {
          success: false,
          output: ["kubectl controls the Kubernetes cluster manager"],
          exitCode: 1,
        };
      }

      return {
        success: true,
        output: [`kubectl ${subcommand} executed`],
        exitCode: 0,
      };
    },
  },
  git: {
    pattern: /^git\b/,
    category: "git",
    description: "Version control with Git",
    validate: (_cmd, args, _ctx) => {
      // Parameters are intentionally unused in simulation (except args)
      void _cmd;
      void _ctx;
      const subcommand = args[0];

      if (!subcommand) {
        return {
          success: false,
          output: ["usage: git [--version] [--help] <command> [<args>]"],
          exitCode: 1,
        };
      }

      return {
        success: true,
        output: [`git ${subcommand} executed`],
        exitCode: 0,
      };
    },
  },
};

/**
 * Terminal Commands Utilities
 * Command execution helper functions for the enhanced terminal
 */

import { Terminal } from "@xterm/xterm";
import type { CommandHistoryEntry, CommandContext } from "../../types/tcs";

/** Display help text */
export function displayHelp(term: Terminal): void {
  term.writeln("\x1b[33mAvailable Commands:\x1b[0m");
  term.writeln("");
  term.writeln("\x1b[36mBasic:\x1b[0m");
  term.writeln("  pwd, ls, cd, cat, echo, grep");
  term.writeln("  whoami, env, ps, clear");
  term.writeln("");
  term.writeln("\x1b[36mDocker:\x1b[0m");
  term.writeln("  docker ps, docker images, docker run, docker exec");
  term.writeln("");
  term.writeln("\x1b[36mKubernetes:\x1b[0m");
  term.writeln("  kubectl get pods, kubectl describe, kubectl logs");
  term.writeln("");
  term.writeln("\x1b[36mGit:\x1b[0m");
  term.writeln("  git status, git log, git clone, git commit");
  term.writeln("");
  term.writeln("\x1b[36mSystem:\x1b[0m");
  term.writeln("  systemctl status, netstat, ss");
  term.writeln("");
  term.writeln("\x1b[36mTCS Commands:\x1b[0m");
  term.writeln("  help, hint, tasks");
}

/** Execute ls command */
export function executeLs(
  _args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  const files = ["app.js", "package.json", "README.md", "src/"];
  files.forEach((file) =>
    term.writeln(file.endsWith("/") ? `\x1b[34m${file}\x1b[0m` : file),
  );
  entry.success = true;
  entry.output = files;
}

/** Execute cd command */
export function executeCd(
  args: string[],
  _term: Terminal,
  entry: CommandHistoryEntry,
  setContext: React.Dispatch<React.SetStateAction<CommandContext>>,
): void {
  setContext((prev) => ({ ...prev, currentDir: args[0] || "/home/devops" }));
  entry.success = true;
}

/** Execute cat command */
export function executeCat(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  if (!args[0]) {
    term.writeln("\x1b[31mcat: missing file operand\x1b[0m");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  term.writeln("File content here...");
  entry.success = true;
  entry.output = ["File content here..."];
}

/** Execute grep command */
export function executeGrep(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  if (args.length < 2) {
    term.writeln("\x1b[31mUsage: grep [OPTION]... PATTERN [FILE]...\x1b[0m");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  term.writeln("matching line 1");
  term.writeln("matching line 2");
  entry.success = true;
  entry.output = ["matching line 1", "matching line 2"];
}

/** Execute ps command */
export function executePs(
  _args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  term.writeln("PID   USER     TIME  COMMAND");
  term.writeln("  1   root     0:01  /sbin/init");
  term.writeln(" 123  devops   0:00  bash");
  term.writeln(" 456  devops   0:05  node app.js");
  entry.success = true;
}

/** Execute netstat/ss command */
export function executeNetstat(
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  term.writeln("Active Internet connections");
  term.writeln(
    "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
  );
  term.writeln(
    "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN",
  );
  term.writeln(
    "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN",
  );
  entry.success = true;
}

/** Execute docker command */
export function executeDocker(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  const sub = args[0];
  if (!sub) {
    term.writeln("Usage: docker [OPTIONS] COMMAND");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  if (sub === "ps") {
    term.writeln(
      "CONTAINER ID   IMAGE          COMMAND       STATUS         PORTS",
    );
    term.writeln(
      'a1b2c3d4e5f6   nginx:latest   "nginx"       Up 2 hours     0.0.0.0:80->80/tcp',
    );
  } else if (sub === "images") {
    term.writeln("REPOSITORY   TAG       IMAGE ID       CREATED        SIZE");
    term.writeln("nginx        latest    abc123def456   2 weeks ago    142MB");
  } else term.writeln(`Docker ${sub} executed`);
  entry.success = true;
}

/** Execute kubectl command */
export function executeKubectl(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  const sub = args[0];
  if (!sub) {
    term.writeln("kubectl controls the Kubernetes cluster manager");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  if (sub === "get" && args[1] === "pods") {
    term.writeln("NAME                     READY   STATUS    RESTARTS   AGE");
    term.writeln("nginx-6799fc88d8-abc12   1/1     Running   0          2h");
  } else if (sub === "get") {
    term.writeln(`Error: the server doesn't have a resource type "${args[1]}"`);
    entry.success = false;
    entry.exitCode = 1;
    return;
  } else term.writeln(`kubectl ${sub} executed`);
  entry.success = true;
}

/** Execute git command */
export function executeGit(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  const sub = args[0];
  if (!sub) {
    term.writeln("usage: git [--version] [--help] <command> [<args>]");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  if (sub === "status") {
    term.writeln("On branch main");
    term.writeln("Your branch is up to date with 'origin/main'.");
    term.writeln("");
    term.writeln("nothing to commit, working tree clean");
  } else if (sub === "log") {
    term.writeln("commit abc123def456 (HEAD -> main)");
    term.writeln("Author: DevOps User <devops@example.com>");
    term.writeln("Date:   Fri Dec 6 2025");
    term.writeln("");
    term.writeln("    Initial commit");
  } else term.writeln(`git ${sub} executed`);
  entry.success = true;
}

/** Execute systemctl command */
export function executeSystemctl(
  args: string[],
  term: Terminal,
  entry: CommandHistoryEntry,
): void {
  const [action, service] = args;
  if (!action || !service) {
    term.writeln("Usage: systemctl [COMMAND] [SERVICE]");
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  if (action === "status") {
    term.writeln(`● ${service}.service - ${service} Service`);
    term.writeln(
      "   Loaded: loaded (/lib/systemd/system/${service}.service; enabled)",
    );
    term.writeln(
      "   Active: \x1b[32mactive (running)\x1b[0m since Fri 2025-12-06 10:00:00 UTC",
    );
  } else if (["start", "stop", "restart"].includes(action))
    term.writeln(`Service ${service} ${action}ed`);
  else {
    term.writeln(`Unknown action: ${action}`);
    entry.success = false;
    entry.exitCode = 1;
    return;
  }
  entry.success = true;
}

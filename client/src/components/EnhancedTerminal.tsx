/**
 * Enhanced Terminal Command Simulation Component
 * Realistic DevOps command validation and execution
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import type { TCSTask, CommandContext, CommandHistoryEntry, FileSystemNode } from '../types/tcs';

interface EnhancedTerminalProps {
  tasks: TCSTask[];
  onTaskComplete?: (taskId: string) => void;
  onScenarioComplete?: () => void;
  onCommandExecuted?: (entry: CommandHistoryEntry) => void;
  timeLimit?: number;
}

export default function EnhancedTerminal({
  tasks,
  onTaskComplete,
  onScenarioComplete,
  onCommandExecuted,
  timeLimit
}: EnhancedTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [context, setContext] = useState<CommandContext>({
    currentDir: '/home/devops',
    fileSystem: createInitialFileSystem(),
    environment: {
      USER: 'devops',
      HOME: '/home/devops',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      SHELL: '/bin/bash'
    },
    history: [],
    runningProcesses: [],
    network: {
      interfaces: [
        { name: 'eth0', ip: '192.168.1.100', mac: '00:0a:95:9d:68:16', status: 'up' }
      ],
      connections: [],
      routes: []
    }
  });

  const completedTasksRef = useRef<Set<string>>(new Set());
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: isMobile ? 12 : 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#60a5fa',
        black: '#1e293b',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#e2e8f0',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f1f5f9'
      },
      allowTransparency: true,
      scrollback: 1000,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();

    terminalInstance.current = term;
    fitAddon.current = fit;

    // Welcome banner
    term.writeln('\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[36m║        DevOps Terminal Command Simulation (TCS)            ║\x1b[0m');
    term.writeln('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[33m📋 Mission Objectives:\x1b[0m');
    tasks.forEach((task, idx) => {
      term.writeln(`  ${idx + 1}. ${task.description}`);
    });
    term.writeln('');
    if (timeLimit) {
      term.writeln(`\x1b[31m⏱️  Time Limit: ${Math.floor(timeLimit / 60)} minutes\x1b[0m`);
      term.writeln('');
    }
    term.writeln('\x1b[90mType "help" for available commands, "hint" for task hints\x1b[0m');
    term.writeln('');
    writePrompt(term);

    term.focus();

    let currentCommand = '';

    term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        term.writeln('');
        if (currentCommand.trim()) {
          executeCommand(currentCommand.trim(), term);
          commandHistoryRef.current.push(currentCommand.trim());
          historyIndexRef.current = commandHistoryRef.current.length;
        }
        currentCommand = '';
        writePrompt(term);
      } else if (code === 127) { // Backspace
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\x1b[A') { // Up arrow - history
        if (historyIndexRef.current > 0) {
          // Clear current line
          term.write('\r\x1b[K');
          writePrompt(term);
          
          historyIndexRef.current--;
          currentCommand = commandHistoryRef.current[historyIndexRef.current];
          term.write(currentCommand);
        }
      } else if (data === '\x1b[B') { // Down arrow - history
        if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
          term.write('\r\x1b[K');
          writePrompt(term);
          
          historyIndexRef.current++;
          currentCommand = commandHistoryRef.current[historyIndexRef.current];
          term.write(currentCommand);
        } else if (historyIndexRef.current === commandHistoryRef.current.length - 1) {
          term.write('\r\x1b[K');
          writePrompt(term);
          historyIndexRef.current = commandHistoryRef.current.length;
          currentCommand = '';
        }
      } else if (code === 9) { // Tab - autocomplete
        const suggestions = getAutocompleteSuggestions(currentCommand);
        if (suggestions.length === 1) {
          const completion = suggestions[0].slice(currentCommand.length);
          currentCommand += completion;
          term.write(completion);
        } else if (suggestions.length > 1) {
          term.writeln('');
          term.writeln(suggestions.join('  '));
          writePrompt(term);
          term.write(currentCommand);
        }
      } else if (code >= 32 && code <= 126) { // Printable characters
        currentCommand += data;
        term.write(data);
      }
    });

    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [tasks, timeLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  const writePrompt = useCallback((term: Terminal) => {
    const dir = context.currentDir === '/home/devops' ? '~' : context.currentDir;
    term.write(`\x1b[32m${context.environment.USER}@tcs\x1b[0m:\x1b[34m${dir}\x1b[0m$ `);
  }, [context]);

  const executeCommand = (command: string, term: Terminal) => {
    const parts = command.split(' ').filter(p => p.trim());
    const cmd = parts[0];
    const args = parts.slice(1);

    const entry: CommandHistoryEntry = {
      command,
      timestamp: new Date(),
      success: false,
      output: [],
      exitCode: 0
    };

    // Built-in commands
    switch (cmd) {
      case 'help':
        displayHelp(term);
        entry.success = true;
        break;

      case 'hint':
        displayHint(term);
        entry.success = true;
        break;

      case 'tasks':
        displayTasks(term);
        entry.success = true;
        break;

      case 'clear':
        term.clear();
        entry.success = true;
        break;

      case 'pwd':
        term.writeln(context.currentDir);
        entry.success = true;
        entry.output = [context.currentDir];
        break;

      case 'whoami':
        term.writeln(context.environment.USER);
        entry.success = true;
        entry.output = [context.environment.USER];
        break;

      case 'env':
        Object.entries(context.environment).forEach(([key, value]) => {
          term.writeln(`${key}=${value}`);
        });
        entry.success = true;
        break;

      case 'ls':
        executeLs(args, term, entry);
        break;

      case 'cd':
        executeCd(args, term, entry);
        break;

      case 'cat':
        executeCat(args, term, entry);
        break;

      case 'echo':
        term.writeln(args.join(' '));
        entry.success = true;
        entry.output = [args.join(' ')];
        break;

      case 'grep':
        executeGrep(args, term, entry);
        break;

      case 'ps':
        executePs(args, term, entry);
        break;

      case 'netstat':
      case 'ss':
        executeNetstat(term, entry);
        break;

      case 'docker':
        executeDocker(args, term, entry);
        break;

      case 'kubectl':
        executeKubectl(args, term, entry);
        break;

      case 'git':
        executeGit(args, term, entry);
        break;

      case 'systemctl':
        executeSystemctl(args, term, entry);
        break;

      case '':
        entry.success = true;
        break;

      default:
        term.writeln(`\x1b[31m${cmd}: command not found\x1b[0m`);
        term.writeln(`Type 'help' for available commands`);
        entry.success = false;
        entry.exitCode = 127;
        entry.output = [`${cmd}: command not found`];
        break;
    }

    // Validate against task requirements
    validateTaskCompletion(command, entry, term);

    // Notify parent
    onCommandExecuted?.(entry);
  };

  const executeLs = (_args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    // Simulate ls output with colors
    const files = ['app.js', 'package.json', 'README.md', 'src/'];
    files.forEach(file => {
      if (file.endsWith('/')) {
        term.writeln(`\x1b[34m${file}\x1b[0m`); // Blue for directories
      } else {
        term.writeln(file);
      }
    });
    entry.success = true;
    entry.output = files;
  };

  const executeCd = (args: string[], _term: Terminal, entry: CommandHistoryEntry) => {
    const target = args[0] || '/home/devops';
    // Simplified cd logic
    setContext(prev => ({ ...prev, currentDir: target }));
    entry.success = true;
  };

  const executeCat = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    if (!args[0]) {
      term.writeln('\x1b[31mcat: missing file operand\x1b[0m');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }
    
    // Simulate file content
    term.writeln('File content here...');
    entry.success = true;
    entry.output = ['File content here...'];
  };

  const executeGrep = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    if (args.length < 2) {
      term.writeln('\x1b[31mUsage: grep [OPTION]... PATTERN [FILE]...\x1b[0m');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }
    
    term.writeln('matching line 1');
    term.writeln('matching line 2');
    entry.success = true;
    entry.output = ['matching line 1', 'matching line 2'];
  };

  const executePs = (_args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    term.writeln('PID   USER     TIME  COMMAND');
    term.writeln('  1   root     0:01  /sbin/init');
    term.writeln(' 123  devops   0:00  bash');
    term.writeln(' 456  devops   0:05  node app.js');
    entry.success = true;
  };

  const executeNetstat = (term: Terminal, entry: CommandHistoryEntry) => {
    term.writeln('Active Internet connections');
    term.writeln('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
    term.writeln('tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN');
    term.writeln('tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN');
    entry.success = true;
  };

  const executeDocker = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    const subcommand = args[0];
    
    if (!subcommand) {
      term.writeln('Usage: docker [OPTIONS] COMMAND');
      term.writeln('');
      term.writeln('Commands:');
      term.writeln('  ps        List containers');
      term.writeln('  images    List images');
      term.writeln('  run       Run a command in a new container');
      term.writeln('  exec      Run a command in a running container');
      term.writeln('  logs      Fetch the logs of a container');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }

    switch (subcommand) {
      case 'ps':
        term.writeln('CONTAINER ID   IMAGE          COMMAND       STATUS         PORTS');
        term.writeln('a1b2c3d4e5f6   nginx:latest   "nginx"       Up 2 hours     0.0.0.0:80->80/tcp');
        break;
      case 'images':
        term.writeln('REPOSITORY   TAG       IMAGE ID       CREATED        SIZE');
        term.writeln('nginx        latest    abc123def456   2 weeks ago    142MB');
        break;
      default:
        term.writeln(`Docker ${subcommand} executed`);
    }
    
    entry.success = true;
  };

  const executeKubectl = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    const subcommand = args[0];
    
    if (!subcommand) {
      term.writeln('kubectl controls the Kubernetes cluster manager');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }

    switch (subcommand) {
      case 'get':
        if (args[1] === 'pods') {
          term.writeln('NAME                     READY   STATUS    RESTARTS   AGE');
          term.writeln('nginx-6799fc88d8-abc12   1/1     Running   0          2h');
        } else {
          term.writeln(`Error: the server doesn't have a resource type "${args[1]}"`);
          entry.success = false;
          entry.exitCode = 1;
          return;
        }
        break;
      default:
        term.writeln(`kubectl ${subcommand} executed`);
    }
    
    entry.success = true;
  };

  const executeGit = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    const subcommand = args[0];
    
    if (!subcommand) {
      term.writeln('usage: git [--version] [--help] <command> [<args>]');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }

    switch (subcommand) {
      case 'status':
        term.writeln('On branch main');
        term.writeln('Your branch is up to date with \'origin/main\'.');
        term.writeln('');
        term.writeln('nothing to commit, working tree clean');
        break;
      case 'log':
        term.writeln('commit abc123def456 (HEAD -> main)');
        term.writeln('Author: DevOps User <devops@example.com>');
        term.writeln('Date:   Fri Dec 6 2025');
        term.writeln('');
        term.writeln('    Initial commit');
        break;
      default:
        term.writeln(`git ${subcommand} executed`);
    }
    
    entry.success = true;
  };

  const executeSystemctl = (args: string[], term: Terminal, entry: CommandHistoryEntry) => {
    const action = args[0];
    const service = args[1];
    
    if (!action || !service) {
      term.writeln('Usage: systemctl [COMMAND] [SERVICE]');
      entry.success = false;
      entry.exitCode = 1;
      return;
    }

    switch (action) {
      case 'status':
        term.writeln(`● ${service}.service - ${service} Service`);
        term.writeln('   Loaded: loaded (/lib/systemd/system/${service}.service; enabled)');
        term.writeln('   Active: \x1b[32mactive (running)\x1b[0m since Fri 2025-12-06 10:00:00 UTC');
        break;
      case 'start':
      case 'stop':
      case 'restart':
        term.writeln(`Service ${service} ${action}ed`);
        break;
      default:
        term.writeln(`Unknown action: ${action}`);
        entry.success = false;
        entry.exitCode = 1;
        return;
    }
    
    entry.success = true;
  };

  const validateTaskCompletion = (command: string, _entry: CommandHistoryEntry, term: Terminal) => {
    tasks.forEach((task) => {
      if (completedTasksRef.current.has(task.id)) return;

      let taskCompleted = false;

      // Check each validator
      for (const validator of task.validators) {
        if (validator.pattern.test(command)) {
          const parts = command.split(' ');
          const result = validator.validate(command, parts.slice(1), context);
          
          if (result.success) {
            taskCompleted = true;
            break;
          }
        }
      }

      if (taskCompleted) {
        completedTasksRef.current.add(task.id);
        term.writeln('');
        term.writeln(`\x1b[32m✓ Task completed: ${task.description} (+${task.points} pts)\x1b[0m`);
        term.writeln('');
        onTaskComplete?.(task.id);

        if (completedTasksRef.current.size === tasks.length) {
          setTimeout(() => {
            term.writeln('');
            term.writeln('\x1b[32m═══════════════════════════════════════\x1b[0m');
            term.writeln('\x1b[32m   🎉 MISSION ACCOMPLISHED! 🎉\x1b[0m');
            term.writeln('\x1b[32m═══════════════════════════════════════\x1b[0m');
            term.writeln('');
            onScenarioComplete?.();
          }, 500);
        }
      }
    });
  };

  const displayHelp = (term: Terminal) => {
    term.writeln('\x1b[33mAvailable Commands:\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[36mBasic:\x1b[0m');
    term.writeln('  pwd, ls, cd, cat, echo, grep');
    term.writeln('  whoami, env, ps, clear');
    term.writeln('');
    term.writeln('\x1b[36mDocker:\x1b[0m');
    term.writeln('  docker ps, docker images, docker run, docker exec');
    term.writeln('');
    term.writeln('\x1b[36mKubernetes:\x1b[0m');
    term.writeln('  kubectl get pods, kubectl describe, kubectl logs');
    term.writeln('');
    term.writeln('\x1b[36mGit:\x1b[0m');
    term.writeln('  git status, git log, git clone, git commit');
    term.writeln('');
    term.writeln('\x1b[36mSystem:\x1b[0m');
    term.writeln('  systemctl status, netstat, ss');
    term.writeln('');
    term.writeln('\x1b[36mTCS Commands:\x1b[0m');
    term.writeln('  help, hint, tasks');
  };

  const displayHint = (term: Terminal) => {
    const incompleteTasks = tasks.filter(t => !completedTasksRef.current.has(t.id));
    
    if (incompleteTasks.length === 0) {
      term.writeln('\x1b[33mAll tasks completed!\x1b[0m');
      return;
    }

    const nextTask = incompleteTasks[0];
    if (nextTask.hint) {
      term.writeln(`\x1b[33m💡 Hint: ${nextTask.hint}\x1b[0m`);
    } else {
      term.writeln(`\x1b[33mNext task: ${nextTask.description}\x1b[0m`);
    }
  };

  const displayTasks = (term: Terminal) => {
    term.writeln('\x1b[33mTask Progress:\x1b[0m');
    term.writeln('');
    tasks.forEach((task, idx) => {
      const completed = completedTasksRef.current.has(task.id);
      const icon = completed ? '\x1b[32m✓\x1b[0m' : '\x1b[90m○\x1b[0m';
      const status = completed ? '\x1b[32m[COMPLETE]\x1b[0m' : '\x1b[90m[PENDING]\x1b[0m';
      term.writeln(`  ${icon} ${idx + 1}. ${task.description} ${status}`);
    });
    term.writeln('');
    term.writeln(`Progress: ${completedTasksRef.current.size}/${tasks.length} tasks`);
  };

  const getAutocompleteSuggestions = (partial: string): string[] => {
    const commands = [
      'help', 'hint', 'tasks', 'clear', 'pwd', 'ls', 'cd', 'cat', 'echo', 'grep',
      'whoami', 'env', 'ps', 'netstat', 'ss',
      'docker', 'kubectl', 'git', 'systemctl'
    ];

    return commands.filter(cmd => cmd.startsWith(partial));
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col">
      <div 
        ref={terminalRef} 
        className="w-full flex-1 p-2 sm:p-4"
        style={{ 
          minHeight: '300px',
          maxHeight: '80vh',
          '@media (min-width: 640px)': { minHeight: '500px' }
        }}
      />
      {isMobile && (
        <div className="bg-slate-900 border-t border-slate-800 p-2">
          <div className="grid grid-cols-4 gap-1 text-xs">
            <button 
              onClick={() => terminalInstance.current?.paste('ls\n')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center"
            >
              ls
            </button>
            <button 
              onClick={() => terminalInstance.current?.paste('cd\n')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center"
            >
              cd
            </button>
            <button 
              onClick={() => terminalInstance.current?.paste('pwd\n')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center"
            >
              pwd
            </button>
            <button 
              onClick={() => terminalInstance.current?.paste('help\n')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center"
            >
              help
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function createInitialFileSystem(): FileSystemNode {
  return {
    type: 'dir',
    name: '/',
    path: '/',
    children: {}
  };
}

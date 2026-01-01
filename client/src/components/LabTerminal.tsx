import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface LabTerminalProps {
  labId: string;
  tasks: string[];
  onTaskComplete?: (taskIndex: number) => void;
  onLabComplete?: () => void;
}

interface FileSystemNode {
  type: 'dir' | 'file';
  children?: Record<string, FileSystemNode>;
  content?: string;
}

export default function LabTerminal({ labId, tasks, onTaskComplete, onLabComplete }: LabTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  
  const currentDirRef = useRef('/home/user');
  const completedTasksRef = useRef<Set<number>>(new Set());
  
  // Mock file system for labs
  const fileSystemRef = useRef<Record<string, FileSystemNode>>({
    '/': {
      type: 'dir',
      children: {
        'home': {
          type: 'dir',
          children: {
            'user': {
              type: 'dir',
              children: {}
            }
          }
        },
        'etc': { type: 'dir', children: {} },
        'var': { type: 'dir', children: {} }
      }
    }
  });

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e293b',
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
      },
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();

    terminalInstance.current = term;
    fitAddon.current = fit;

    // Welcome message
    term.writeln('Welcome to DevOps Learning Lab!');
    term.writeln('Complete the tasks below to earn XP.\n');
    term.writeln('Tasks:');
    tasks.forEach((task, idx) => {
      term.writeln(`  ${idx + 1}. ${task}`);
    });
    term.writeln('');
    writePrompt(term);

    // Focus terminal to enable input
    term.focus();

    // Handle input
    let currentCommand = '';
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Enter key
      if (code === 13) {
        term.writeln('');
        if (currentCommand.trim()) {
          executeCommand(currentCommand.trim(), term);
        }
        currentCommand = '';
        writePrompt(term);
      }
      // Backspace
      else if (code === 127) {
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1);
          term.write('\b \b');
        }
      }
      // Up arrow (command history)
      else if (data === '\x1b[A') {
        // Handle arrow up
      }
      // Regular character
      else if (code >= 32) {
        currentCommand += data;
        term.write(data);
      }
    });

    // Resize handler
    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId]); // Only re-initialize if labId changes

  const writePrompt = (term: Terminal) => {
    term.write(`\x1b[32muser@devops\x1b[0m:\x1b[34m${currentDirRef.current}\x1b[0m$ `);
  };

  const executeCommand = (command: string, term: Terminal) => {
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    // Check if command completes any tasks
    checkTaskCompletion(command);

    switch (cmd) {
      case 'pwd':
        term.writeln(currentDirRef.current);
        break;

      case 'ls': {
        const targetDir = args[0] ? resolvePath(args[0]) : currentDirRef.current;
        const dir = getDirectory(targetDir);
        if (dir && dir.type === 'dir') {
          const items = Object.keys(dir.children || {});
          if (items.length === 0) {
            // Empty directory
          } else {
            term.writeln(items.join('  '));
          }
        } else {
          term.writeln(`ls: cannot access '${targetDir}': No such file or directory`);
        }
        break;
      }

      case 'cd': {
        const newDir = args[0] || '/home/user';
        const resolved = resolvePath(newDir);
        const target = getDirectory(resolved);
        if (target && target.type === 'dir') {
          currentDirRef.current = resolved;
        } else {
          term.writeln(`cd: ${newDir}: No such file or directory`);
        }
        break;
      }

      case 'mkdir':
        if (!args[0]) {
          term.writeln('mkdir: missing operand');
        } else {
          const dirPath = resolvePath(args[0]);
          createDirectory(dirPath);
          term.writeln('');
        }
        break;

      case 'touch':
        if (!args[0]) {
          term.writeln('touch: missing file operand');
        } else {
          const filePath = resolvePath(args[0]);
          createFile(filePath);
          term.writeln('');
        }
        break;

      case 'cat':
        if (!args[0]) {
          term.writeln('cat: missing file operand');
        } else {
          const filePath = resolvePath(args[0]);
          const file = getFile(filePath);
          if (file && file.type === 'file') {
            term.writeln(file.content || '');
          } else {
            term.writeln(`cat: ${args[0]}: No such file or directory`);
          }
        }
        break;

      case 'echo':
        term.writeln(args.join(' '));
        break;

      case 'clear':
        term.clear();
        break;

      case 'help':
        term.writeln('Available commands:');
        term.writeln('  pwd          - print working directory');
        term.writeln('  ls [dir]     - list directory contents');
        term.writeln('  cd <dir>     - change directory');
        term.writeln('  mkdir <dir>  - create directory');
        term.writeln('  touch <file> - create empty file');
        term.writeln('  cat <file>   - display file contents');
        term.writeln('  echo <text>  - display text');
        term.writeln('  clear        - clear screen');
        term.writeln('  help         - show this help');
        break;

      case '':
        break;

      default:
        term.writeln(`${cmd}: command not found`);
        break;
    }
  };

  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) {
      return path;
    }
    const parts = currentDirRef.current.split('/').filter(Boolean);
    const pathParts = path.split('/');
    
    for (const part of pathParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.' && part !== '') {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  };

  const getDirectory = (path: string): FileSystemNode | null => {
    const parts = path.split('/').filter(Boolean);
    let current = fileSystemRef.current['/'];
    
    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  const getFile = (path: string): FileSystemNode | null => {
    return getDirectory(path);
  };

  const createDirectory = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    const dirName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parent = getDirectory(parentPath);
    
    if (parent && parent.type === 'dir' && dirName) {
      if (!parent.children) parent.children = {};
      parent.children[dirName] = { type: 'dir', children: {} };
      // No need to update state since we're using a ref
    }
  };

  const createFile = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parent = getDirectory(parentPath);
    
    if (parent && parent.type === 'dir' && fileName) {
      if (!parent.children) parent.children = {};
      parent.children[fileName] = { type: 'file', content: '' };
      // No need to update state since we're using a ref
    }
  };

  const checkTaskCompletion = (command: string) => {
    // Lab-specific task validation
    if (labId === 'w1-lab1') {
      // Week 1 Lab 1: Linux Command Line Basics
      if (command.includes('cd /home') && !completedTasksRef.current.has(0)) {
        markTaskComplete(0);
      } else if (command.includes('mkdir') && command.includes('devops-practice') && !completedTasksRef.current.has(1)) {
        markTaskComplete(1);
      } else if (command.includes('touch') && command.includes('.txt') && !completedTasksRef.current.has(2)) {
        markTaskComplete(2);
      }
    }
  };

  const markTaskComplete = (taskIndex: number) => {
    completedTasksRef.current.add(taskIndex);
    
    if (terminalInstance.current) {
      terminalInstance.current.writeln('');
      terminalInstance.current.writeln(`\x1b[32m✓ Task ${taskIndex + 1} completed!\x1b[0m`);
      terminalInstance.current.writeln('');
    }
    
    onTaskComplete?.(taskIndex);
    
    // Check if all tasks are complete
    if (completedTasksRef.current.size === tasks.length) {
      setTimeout(() => {
        if (terminalInstance.current) {
          terminalInstance.current.writeln('');
          terminalInstance.current.writeln('\x1b[32m🎉 Congratulations! Lab completed!\x1b[0m');
          terminalInstance.current.writeln('');
        }
        onLabComplete?.();
      }, 500);
    }
  };

  return (
    <div className="w-full h-full">
      <div 
        ref={terminalRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
        onClick={() => terminalInstance.current?.focus()}
        tabIndex={0}
      />
    </div>
  );
}

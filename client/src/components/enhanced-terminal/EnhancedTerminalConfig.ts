/**
 * Enhanced Terminal Configuration Constants and Utilities
 */

// Terminal Theme Config
export const TERMINAL_THEME = {
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
};

// Terminal Welcome Banner Writer
export function writeWelcomeBanner(term: { writeln: (s: string) => void }, tasks: { description: string }[], timeLimit?: number) {
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
}

// Create initial command context
export function createInitialContext() {
  return {
    currentDir: '/home/devops',
    fileSystem: {},
    environment: {
      USER: 'devops',
      HOME: '/home/devops',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      SHELL: '/bin/bash'
    },
    history: [],
    runningProcesses: [],
    network: {
      interfaces: [{ name: 'eth0', ip: '192.168.1.100', mac: '00:0a:95:9d:68:16', status: 'up' }],
      connections: [],
      routes: []
    }
  };
}

/**
 * Enhanced Terminal Command Simulation Component
 * Realistic DevOps command validation and execution
 */

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { useTaskValidation } from '../hooks/useTaskValidation';
import { createInitialFileSystem, getAutocompleteSuggestions, writePrompt } from '../utils/terminalHelpers';
import type { TCSTask, CommandContext, CommandHistoryEntry } from '../types/tcs';
import { MobileCommandsPanel } from './enhanced-terminal/EnhancedTerminalComponents';
import { TERMINAL_THEME, writeWelcomeBanner } from './enhanced-terminal/EnhancedTerminalConfig';

interface EnhancedTerminalProps {
  tasks: TCSTask[];
  onTaskComplete?: (taskId: string) => void;
  onScenarioComplete?: () => void;
  onCommandExecuted?: (entry: CommandHistoryEntry) => void;
  timeLimit?: number;
}

export default function EnhancedTerminal({ tasks, onTaskComplete, onScenarioComplete, onCommandExecuted, timeLimit }: EnhancedTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [context, setContext] = useState<CommandContext>({
    currentDir: '/home/devops',
    fileSystem: createInitialFileSystem(),
    environment: { USER: 'devops', HOME: '/home/devops', PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', SHELL: '/bin/bash' },
    history: [],
    runningProcesses: [],
    network: { interfaces: [{ name: 'eth0', ip: '192.168.1.100', mac: '00:0a:95:9d:68:16', status: 'up' }], connections: [], routes: [] }
  });

  const { executeCommand } = useTerminalCommands({ context, setContext });
  const { validateTaskCompletion, displayHint, displayTasks } = useTaskValidation({ tasks, context, onTaskComplete, onScenarioComplete });

  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({ cursorBlink: true, fontSize: isMobile ? 12 : 14, fontFamily: 'Menlo, Monaco, "Courier New", monospace', theme: TERMINAL_THEME, allowTransparency: true, scrollback: 1000 });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();
    terminalInstance.current = term;
    fitAddon.current = fit;
    writeWelcomeBanner(term, tasks, timeLimit);
    writePrompt(term, context);
    term.focus();
    let currentCommand = '';
    term.onData((data) => {
      const code = data.charCodeAt(0);
      if (code === 13) { term.writeln(''); if (currentCommand.trim()) { processCommand(currentCommand.trim(), term); } currentCommand = ''; writePrompt(term, context); }
      else if (code === 127) { if (currentCommand.length > 0) { currentCommand = currentCommand.slice(0, -1); term.write('\b \b'); } }
      else if (data === '\x1b[A') { if (historyIndexRef.current > 0) { term.write('\r\x1b[K'); writePrompt(term, context); historyIndexRef.current--; currentCommand = commandHistoryRef.current[historyIndexRef.current]; term.write(currentCommand); } }
      else if (data === '\x1b[B') { if (historyIndexRef.current < commandHistoryRef.current.length - 1) { term.write('\r\x1b[K'); writePrompt(term, context); historyIndexRef.current++; currentCommand = commandHistoryRef.current[historyIndexRef.current]; term.write(currentCommand); } else if (historyIndexRef.current === commandHistoryRef.current.length - 1) { term.write('\r\x1b[K'); writePrompt(term, context); historyIndexRef.current = commandHistoryRef.current.length; currentCommand = ''; } }
      else if (code === 9) { const suggestions = getAutocompleteSuggestions(currentCommand); if (suggestions.length === 1) { const completion = suggestions[0].slice(currentCommand.length); currentCommand += completion; term.write(completion); } else if (suggestions.length > 1) { term.writeln(''); term.writeln(suggestions.join('  ')); writePrompt(term, context); term.write(currentCommand); } }
      else if (code >= 32 && code <= 126) { currentCommand += data; term.write(data); }
    });
    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); term.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, timeLimit, isMobile]);

  const processCommand = (cmd: string, term: Terminal) => {
    const entry = executeCommand(cmd, term);
    if (cmd === 'hint') { displayHint(term); entry.success = true; }
    else if (cmd === 'tasks') { displayTasks(term); entry.success = true; }
    commandHistoryRef.current.push(cmd);
    historyIndexRef.current = commandHistoryRef.current.length;
    validateTaskCompletion(cmd, entry, term);
    onCommandExecuted?.(entry);
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col">
      <div ref={terminalRef} className="w-full flex-1 p-2 sm:p-4" style={{ minHeight: '300px', maxHeight: '80vh' }} />
      {isMobile && <MobileCommandsPanel terminalPaste={(cmd) => terminalInstance.current?.paste(cmd)} />}
    </div>
  );
}

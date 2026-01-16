import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useLabCommands } from '../hooks/useLabCommands';
import { LAB_TERMINAL_THEME, createInitialLabFileSystem, writeLabWelcome, writeLabPrompt, type FileSystemNode } from './lab-terminal/LabTerminalComponents';

interface LabTerminalProps {
  labId: string;
  tasks: string[];
  onTaskComplete?: (taskIndex: number) => void;
  onLabComplete?: () => void;
}

export default function LabTerminal({ labId, tasks, onTaskComplete, onLabComplete }: LabTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const currentDirRef = useRef('/home/user');
  const fileSystemRef = useRef<Record<string, FileSystemNode>>(createInitialLabFileSystem());

  const { executeCommand } = useLabCommands({ labId, tasks, currentDirRef, fileSystemRef, terminalInstance, onTaskComplete, onLabComplete });

  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({ cursorBlink: true, fontSize: 14, fontFamily: 'Menlo, Monaco, "Courier New", monospace', theme: LAB_TERMINAL_THEME });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();
    terminalInstance.current = term;
    fitAddon.current = fit;

    writeLabWelcome(term, tasks);
    writeLabPrompt(term, currentDirRef.current);
    term.focus();

    let currentCommand = '';
    term.onData((data) => {
      const code = data.charCodeAt(0);
      if (code === 13) { term.writeln(''); if (currentCommand.trim()) executeCommand(currentCommand.trim(), term); currentCommand = ''; writeLabPrompt(term, currentDirRef.current); }
      else if (code === 127) { if (currentCommand.length > 0) { currentCommand = currentCommand.slice(0, -1); term.write('\b \b'); } }
      else if (data === '\x1b[A') { /* handle history up */ }
      else if (code >= 32) { currentCommand += data; term.write(data); }
    });

    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); term.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId]);

  return (
    <div className="w-full h-full">
      <div ref={terminalRef} className="w-full h-full rounded-lg overflow-hidden" style={{ minHeight: '400px' }}
        onClick={() => terminalInstance.current?.focus()} tabIndex={0} />
    </div>
  );
}

/**
 * Enhanced Terminal Command Simulation Component
 * Realistic DevOps command validation and execution
 */

import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { useTerminalCommands } from "../hooks/useTerminalCommands";
import { useTaskValidation } from "../hooks/useTaskValidation";
import { createInitialFileSystem } from "../utils/terminalHelpers";
import type {
  TCSTask,
  CommandContext,
  CommandHistoryEntry,
} from "../types/tcs";
import { MobileCommandsPanel } from "./enhanced-terminal/EnhancedTerminalComponents";
import {
  initializeTerminal,
  setupTerminalEventHandlers,
} from "../utils/enhanced-terminal/enhancedTerminalUtils";

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
  timeLimit,
}: EnhancedTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [context, setContext] = useState<CommandContext>({
    currentDir: "/home/devops",
    fileSystem: createInitialFileSystem(),
    environment: {
      USER: "devops",
      HOME: "/home/devops",
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      SHELL: "/bin/bash",
    },
    history: [],
    runningProcesses: [],
    network: {
      interfaces: [
        {
          name: "eth0",
          ip: "192.168.1.100",
          mac: "00:0a:95:9d:68:16",
          status: "up",
        },
      ],
      connections: [],
      routes: [],
    },
  });

  const { executeCommand } = useTerminalCommands({ context, setContext });
  const { validateTaskCompletion, displayHint, displayTasks } =
    useTaskValidation({ tasks, context, onTaskComplete, onScenarioComplete });

  useEffect(() => {
    const { term, fit } = initializeTerminal(
      { terminalRef, terminalInstance, fitAddon, commandHistoryRef, historyIndexRef },
      context,
      tasks,
      timeLimit,
      isMobile
    ) || {};

    if (!term || !fit) return;

    return setupTerminalEventHandlers(
      term,
      fit,
      { terminalRef, terminalInstance, fitAddon, commandHistoryRef, historyIndexRef },
      context,
      { executeCommand, validateTaskCompletion, displayHint, displayTasks, onCommandExecuted }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, timeLimit, isMobile]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col">
      <div
        ref={terminalRef}
        className="w-full flex-1 p-2 sm:p-4"
        style={{ minHeight: "300px", maxHeight: "80vh" }}
      />
      {isMobile && (
        <MobileCommandsPanel
          terminalPaste={(cmd) => terminalInstance.current?.paste(cmd)}
        />
      )}
    </div>
  );
}

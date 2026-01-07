/**
 * Enhanced Terminal Sub-Components
 * Extracted from EnhancedTerminal.tsx for ESLint compliance
 * NOTE: Constants and non-component functions moved to EnhancedTerminalConfig.ts
 */

// Mobile Quick Commands Panel
interface MobileCommandsPanelProps {
  terminalPaste: (cmd: string) => void;
}

export function MobileCommandsPanel({ terminalPaste }: MobileCommandsPanelProps) {
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-2">
      <div className="grid grid-cols-4 gap-1 text-xs">
        <button onClick={() => terminalPaste('ls\n')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center">ls</button>
        <button onClick={() => terminalPaste('cd\n')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center">cd</button>
        <button onClick={() => terminalPaste('pwd\n')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center">pwd</button>
        <button onClick={() => terminalPaste('help\n')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-center">help</button>
      </div>
    </div>
  );
}

// NOTE: TERMINAL_THEME, writeWelcomeBanner, and createInitialContext 
// moved to EnhancedTerminalConfig.ts for fast-refresh compliance

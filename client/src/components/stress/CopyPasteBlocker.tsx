/* eslint-disable max-lines-per-function */
/**
 * CopyPasteBlocker Component - Progressive Stress System
 * Blocks copy and paste operations during high-stress sessions
 */

import React, { useState, useEffect } from 'react';
import { Scissors, Clipboard, AlertTriangle } from 'lucide-react';
import { ProgressiveStressService } from '../../services/progressiveStress';

interface CopyPasteBlockerProps {
  sessionId: string;
  onActionBlocked?: (action: 'copy' | 'paste') => void;
  className?: string;
}

export const CopyPasteBlocker: React.FC<CopyPasteBlockerProps> = ({
  sessionId,
  onActionBlocked,
  className = ''
}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedActions, setBlockedActions] = useState<Array<{action: 'copy' | 'paste', timestamp: Date}>>([]);
  const [showBlocked, setShowBlocked] = useState(false);

  const stressService = ProgressiveStressService.getInstance();

  useEffect(() => {
    const session = stressService.getSessionStatus(sessionId);
    setIsBlocked(session ? !session.copyPasteAllowed : false);
  }, [sessionId, stressService]);

  useEffect(() => {
    if (!isBlocked) return;

    const handleCopy = (event: ClipboardEvent) => {
      event.preventDefault();
      setBlockedActions(prev => [...prev, { action: 'copy', timestamp: new Date() }]);
      onActionBlocked?.('copy');

      stressService.recordStressEvent(sessionId, {
        type: 'copy_paste_blocked',
        message: 'Copy operation blocked under stress conditions',
        severity: 'medium',
        resolved: false
      });
    };

    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
      setBlockedActions(prev => [...prev, { action: 'paste', timestamp: new Date() }]);
      onActionBlocked?.('paste');

      stressService.recordStressEvent(sessionId, {
        type: 'copy_paste_blocked',
        message: 'Paste operation blocked under stress conditions',
        severity: 'medium',
        resolved: false
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Cmd+C, Cmd+V
      if ((event.ctrlKey || event.metaKey) &&
          (event.key === 'c' || event.key === 'v')) {
        event.preventDefault();

        const action = event.key === 'c' ? 'copy' : 'paste';
        setBlockedActions(prev => [...prev, { action, timestamp: new Date() }]);
        onActionBlocked?.(action);

        stressService.recordStressEvent(sessionId, {
          type: 'copy_paste_blocked',
          message: `${action.toUpperCase()} operation blocked under stress conditions`,
          severity: 'medium',
          resolved: false
        });
      }
    };

    // Block context menu copy/paste
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true')) {
        // Allow context menu but block the actual copy/paste actions
        return;
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isBlocked, sessionId, onActionBlocked, stressService]);

  if (!isBlocked) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/20 border border-green-500 text-green-400 ${className}`}>
        <Clipboard className="w-4 h-4" />
        <span className="text-sm">Copy/Paste: Allowed</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border-2 border-red-500 bg-red-900/20 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Scissors className="w-5 h-5 text-red-400" />
        <span className="font-semibold text-red-400">Copy/Paste: BLOCKED</span>
      </div>

      <p className="text-sm text-red-300 mb-3">
        Copy and paste operations are disabled under current stress conditions.
        You must type all commands and code manually.
      </p>

      {blockedActions.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
          >
            <AlertTriangle className="w-4 h-4" />
            {blockedActions.length} blocked attempt{blockedActions.length !== 1 ? 's' : ''}
          </button>

          {showBlocked && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {blockedActions.slice(-10).map((attempt, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-red-300 py-1">
                  <span className="capitalize">{attempt.action}</span>
                  <span>at {attempt.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400">
        This builds muscle memory and problem-solving skills under pressure.
      </div>
    </div>
  );
};

export default CopyPasteBlocker;
import { useState } from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';

interface DestructiveCommandChecklistProps {
  command: string;
  onProceed: () => void;
  onCancel: () => void;
}

export default function DestructiveCommandChecklist({ command, onProceed, onCancel }: DestructiveCommandChecklistProps) {
  const [checklist, setChecklist] = useState({
    backup: false,
    rollback: false,
    tested: false,
    understands: false
  });

  const allChecked = Object.values(checklist).every(v => v);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-red-600/50 max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold text-white">Destructive Command Detected</h2>
                <p className="text-red-100 text-sm">Pre-Execution Safety Checklist Required</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-white hover:text-red-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Command Display */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-2">You are about to execute:</p>
            <code className="text-red-400 font-mono text-lg font-bold">{command}</code>
          </div>

          {/* Warning */}
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-semibold mb-1">⚠️ High-Risk Operation</h4>
                <p className="text-gray-300 text-sm">
                  This command can cause data loss, service disruption, or security issues.
                  You must complete all safety checks before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Checklist */}
          <div className="space-y-4 mb-6">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Pre-Execution Safety Checklist</span>
            </h3>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checklist.backup}
                onChange={(e) => setChecklist({ ...checklist, backup: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="text-gray-300 group-hover:text-white transition">
                  I have backed up the current state or can restore from a snapshot
                </span>
                <p className="text-gray-500 text-xs mt-1">
                  Document your backup method and verify restoration works
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checklist.rollback}
                onChange={(e) => setChecklist({ ...checklist, rollback: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="text-gray-300 group-hover:text-white transition">
                  I have documented rollback steps and tested them
                </span>
                <p className="text-gray-500 text-xs mt-1">
                  Write down exact commands to undo this operation
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checklist.tested}
                onChange={(e) => setChecklist({ ...checklist, tested: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="text-gray-300 group-hover:text-white transition">
                  I have tested this in isolation or a non-production environment
                </span>
                <p className="text-gray-500 text-xs mt-1">
                  Verify the command works as expected in a safe context first
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checklist.understands}
                onChange={(e) => setChecklist({ ...checklist, understands: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="text-gray-300 group-hover:text-white transition">
                  I fully understand what this command will do and its consequences
                </span>
                <p className="text-gray-500 text-xs mt-1">
                  Can you explain each flag and parameter without looking it up?
                </p>
              </div>
            </label>
          </div>

          {/* Notice */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-6">
            <p className="text-gray-400 text-sm text-center">
              <strong className="text-yellow-400">Production Mindset:</strong> In real DevOps work, these checks prevent costly outages. 
              Get used to thinking through consequences before executing.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              Cancel Command
            </button>
            <button
              onClick={onProceed}
              disabled={!allChecked}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                allChecked
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {allChecked ? '✓ Execute Command' : '🔒 Complete Checklist to Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

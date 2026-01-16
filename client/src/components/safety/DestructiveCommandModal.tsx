/* eslint-disable max-lines-per-function */
/**
 * Destructive Command Checklist Modal
 * Forces user to acknowledge risks before executing dangerous commands
 */

import { type FC, useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import type { DestructiveCommand } from '../../hooks/useDestructiveCommands';

interface DestructiveCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  command: DestructiveCommand;
  onProceed: () => void;
}

export const DestructiveCommandModal: FC<DestructiveCommandModalProps> = ({
  isOpen,
  onClose,
  command,
  onProceed
}) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(command.checklistItems.length).fill(false)
  );
  const [understand, setUnderstand] = useState(false);

  if (!isOpen) return null;

  const allChecked = checkedItems.every(Boolean) && understand;

  const toggleItem = (index: number) => {
    setCheckedItems(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleProceed = () => {
    if (allChecked) {
      onProceed();
      onClose();
      // Reset for next time
      setCheckedItems(new Array(command.checklistItems.length).fill(false));
      setUnderstand(false);
    }
  };

  const getSeverityColor = () => {
    switch (command.severity) {
      case 'high': return 'from-red-900 to-orange-900 border-red-500';
      case 'medium': return 'from-amber-900 to-yellow-900 border-amber-500';
      case 'low': return 'from-yellow-900 to-amber-900 border-yellow-500';
    }
  };

  const getSeverityBadge = () => {
    switch (command.severity) {
      case 'high': return 'bg-red-900/50 text-red-300';
      case 'medium': return 'bg-amber-900/50 text-amber-300';
      case 'low': return 'bg-yellow-900/50 text-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${getSeverityColor()} p-6 flex items-start justify-between`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-8 h-8 text-red-300" />
              <div>
                <h2 className="text-3xl font-bold text-white">⚠️ Dangerous Command Detected</h2>
                <p className="text-red-100 text-sm mt-1">Safety checklist required before execution</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <code className="bg-black/30 px-4 py-2 rounded-lg text-white font-mono text-lg">
                {command.command}
              </code>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getSeverityBadge()}`}>
                {command.severity} Risk
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Risks */}
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-red-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Why This Command Is Dangerous
            </h3>
            <ul className="space-y-2">
              {command.risks.map((risk) => (
                <li key={risk} className="flex items-start gap-2 text-red-200">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternatives */}
          {command.alternatives && command.alternatives.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Safer Alternatives
              </h3>
              <ul className="space-y-2">
                {command.alternatives.map((alt) => (
                  <li key={alt} className="flex items-start gap-2 text-blue-200">
                    <span className="text-blue-400 mt-1">→</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Checklist */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Safety Checklist - You MUST confirm all items:
            </h3>
            <div className="space-y-3">
              {command.checklistItems.map((item, index) => (
                <label
                  key={item}
                  className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                    checkedItems[index]
                      ? 'bg-emerald-900/30 border border-emerald-500/50'
                      : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[index]}
                    onChange={() => toggleItem(index)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className={`flex-1 ${checkedItems[index] ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {item}
                  </span>
                  {checkedItems[index] && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Final Confirmation */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={understand}
                onChange={(e) => setUnderstand(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-600 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900"
              />
              <span className="flex-1 text-white font-semibold">
                I understand the risks and have completed all safety checks. I accept full responsibility for executing this command.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Cancel (Safe Choice)
          </button>
          <button
            onClick={handleProceed}
            disabled={!allChecked}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              allChecked
                ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allChecked ? 'Proceed with Command ⚠️' : 'Complete Checklist First'}
          </button>
        </div>
      </div>
    </div>
  );
};

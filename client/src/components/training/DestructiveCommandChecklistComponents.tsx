/**
 * Sub-components for DestructiveCommandChecklist
 */

import { AlertTriangle, Shield, X } from 'lucide-react';
import { ChecklistState, ChecklistItem } from './DestructiveCommandChecklistUtils';

interface ModalHeaderProps {
  onCancel: () => void;
}

export function ModalHeader({ onCancel }: ModalHeaderProps) {
  return (
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
  );
}

interface CommandDisplayProps {
  command: string;
}

export function CommandDisplay({ command }: CommandDisplayProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
      <p className="text-gray-400 text-sm mb-2">You are about to execute:</p>
      <code className="text-red-400 font-mono text-lg font-bold">{command}</code>
    </div>
  );
}

export function WarningBanner() {
  return (
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
  );
}

interface ChecklistItemRowProps {
  item: ChecklistItem;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ChecklistItemRow({ item, checked, onChange }: ChecklistItemRowProps) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
      />
      <div className="flex-1">
        <span className="text-gray-300 group-hover:text-white transition">
          {item.label}
        </span>
        <p className="text-gray-500 text-xs mt-1">
          {item.helpText}
        </p>
      </div>
    </label>
  );
}

interface SafetyChecklistProps {
  items: ChecklistItem[];
  checklist: ChecklistState;
  onUpdate: (key: keyof ChecklistState, value: boolean) => void;
}

export function SafetyChecklist({ items, checklist, onUpdate }: SafetyChecklistProps) {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-white font-semibold flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <span>Pre-Execution Safety Checklist</span>
      </h3>
      {items.map((item) => (
        <ChecklistItemRow
          key={item.key}
          item={item}
          checked={checklist[item.key]}
          onChange={(value) => onUpdate(item.key, value)}
        />
      ))}
    </div>
  );
}

export function ProductionMindsetNotice() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-6">
      <p className="text-gray-400 text-sm text-center">
        <strong className="text-yellow-400">Production Mindset:</strong> In real DevOps work, these checks prevent costly outages. 
        Get used to thinking through consequences before executing.
      </p>
    </div>
  );
}

interface ActionButtonsProps {
  allChecked: boolean;
  onCancel: () => void;
  onProceed: () => void;
}

export function ActionButtons({ allChecked, onCancel, onProceed }: ActionButtonsProps) {
  return (
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
  );
}

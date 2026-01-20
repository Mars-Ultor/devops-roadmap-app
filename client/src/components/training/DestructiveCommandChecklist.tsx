/**
 * Destructive Command Checklist - Refactored
 * Safety verification for dangerous commands
 */

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface DestructiveCommandChecklistProps {
  command: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CHECKLIST_ITEMS: Omit<ChecklistItem, "checked">[] = [
  {
    id: "understand",
    label: "I understand what this command does",
    description: "You have read and comprehend the full impact of this command",
  },
  {
    id: "backup",
    label: "I have verified backups exist",
    description: "Critical data is backed up and can be restored if needed",
  },
  {
    id: "environment",
    label: "I have verified the target environment",
    description: "This is the correct environment (not production by mistake)",
  },
  {
    id: "reversible",
    label: "I know how to reverse this action",
    description: "You have a plan to undo changes if something goes wrong",
  },
  {
    id: "approved",
    label: "This action is approved/authorized",
    description: "You have necessary permissions and approvals",
  },
];

export default function DestructiveCommandChecklist({
  command,
  onConfirm,
  onCancel,
}: DestructiveCommandChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS.map((item) => ({ ...item, checked: false })),
  );

  const allChecked = items.every((item) => item.checked);
  const toggleItem = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );

  return (
    <div className="bg-red-900/20 border-2 border-red-600 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <div>
          <h3 className="text-xl font-bold text-red-400">
            Destructive Command Warning
          </h3>
          <p className="text-sm text-red-300">
            Complete all safety checks before proceeding
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded p-3 mb-4 font-mono text-sm text-red-300">
        {command}
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${item.checked ? "bg-green-900/20 border border-green-700" : "bg-slate-800 border border-slate-700"}`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {item.checked ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-500" />
                )}
                <span
                  className={`font-medium ${item.checked ? "text-green-400" : "text-white"}`}
                >
                  {item.label}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{item.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!allChecked}
          className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${allChecked ? "bg-red-600 hover:bg-red-700 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}
        >
          <Shield className="w-4 h-4" />
          {allChecked ? "Execute Command" : "Complete All Checks"}
        </button>
      </div>
    </div>
  );
}

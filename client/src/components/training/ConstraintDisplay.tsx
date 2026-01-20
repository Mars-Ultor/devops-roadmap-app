/**
 * Constraint Display - Refactored
 * Shows time and resource constraints for training
 */

import React from "react";
import { Clock, AlertTriangle, CheckCircle, Timer } from "lucide-react";

interface Constraint {
  type: "time" | "resource" | "dependency";
  name: string;
  value: string | number;
  status: "met" | "warning" | "critical";
  description?: string;
}

interface ConstraintDisplayProps {
  readonly constraints: Constraint[];
  readonly timeRemaining?: number;
  readonly onConstraintClick?: (constraint: Constraint) => void;
}

function getStatusColor(status: Constraint["status"]): string {
  switch (status) {
    case "met":
      return "bg-green-900/20 border-green-700 text-green-400";
    case "warning":
      return "bg-yellow-900/20 border-yellow-700 text-yellow-400";
    case "critical":
      return "bg-red-900/20 border-red-700 text-red-400";
  }
}

function getStatusIcon(status: Constraint["status"]) {
  switch (status) {
    case "met":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ConstraintDisplay({
  constraints,
  timeRemaining,
  onConstraintClick,
}: ConstraintDisplayProps) {
  const criticalCount = constraints.filter(
    (c) => c.status === "critical",
  ).length;
  const warningCount = constraints.filter((c) => c.status === "warning").length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Constraints
        </h3>
        {timeRemaining !== undefined &&
          (() => {
            let timeColor;
            if (timeRemaining < 60) {
              timeColor = "bg-red-900/30 text-red-400";
            } else if (timeRemaining < 300) {
              timeColor = "bg-yellow-900/30 text-yellow-400";
            } else {
              timeColor = "bg-slate-700 text-slate-300";
            }
            return (
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeColor}`}
              >
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            );
          })()}
      </div>

      {(criticalCount > 0 || warningCount > 0) && (
        <div className="flex gap-2 mb-4">
          {criticalCount > 0 && (
            <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded">
              {warningCount} warning
            </span>
          )}
        </div>
      )}

      <div className="space-y-2">
        {constraints.map((constraint) =>
          onConstraintClick ? (
            <button
              key={constraint.name}
              onClick={() => onConstraintClick(constraint)}
              className={`w-full text-left p-3 rounded-lg border ${getStatusColor(constraint.status)} cursor-pointer hover:opacity-80`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(constraint.status)}
                  <span className="font-medium">{constraint.name}</span>
                </div>
                <span className="text-sm font-mono">{constraint.value}</span>
              </div>
              {constraint.description && (
                <p className="text-sm text-slate-400 mt-1">
                  {constraint.description}
                </p>
              )}
            </button>
          ) : (
            <div
              key={constraint.name}
              className={`p-3 rounded-lg border ${getStatusColor(constraint.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(constraint.status)}
                  <span className="font-medium">{constraint.name}</span>
                </div>
                <span className="text-sm font-mono">{constraint.value}</span>
              </div>
              {constraint.description && (
                <p className="text-sm text-slate-400 mt-1">
                  {constraint.description}
                </p>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

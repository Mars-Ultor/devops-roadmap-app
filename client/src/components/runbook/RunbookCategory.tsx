/**
 * Runbook Category Section
 * Displays entries for a specific technology category
 */

import { type FC, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import type {
  RunbookCategory as RunbookCategoryType,
  RunbookEntry,
} from "../../services/runbookGenerator";

interface RunbookEntryCardProps {
  entry: RunbookEntry;
  index: number;
}

/** Single runbook entry card */
const RunbookEntryCard: FC<RunbookEntryCardProps> = ({ entry, index }) => (
  <div className="p-5 bg-slate-900/30">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-white">#{index + 1}</span>
          <h4 className="text-lg font-semibold text-white">{entry.problem}</h4>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>
              {entry.occurrences} occurrence{entry.occurrences === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Last seen: {entry.lastSeen.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      {entry.occurrences > 3 && (
        <span className="px-3 py-1 bg-red-900/30 text-red-400 text-xs font-semibold rounded-full">
          Frequent Issue
        </span>
      )}
    </div>
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Root Cause
      </h5>
      <p className="text-slate-300 text-sm bg-red-900/10 border border-red-800/30 rounded-lg p-3">
        {entry.rootCause}
      </p>
    </div>
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        Solution
      </h5>
      <p className="text-slate-300 text-sm bg-green-900/10 border border-green-800/30 rounded-lg p-3">
        {entry.solution}
      </p>
    </div>
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-blue-400 mb-2">
        Prevention Strategy
      </h5>
      <p className="text-slate-300 text-sm bg-blue-900/10 border border-blue-800/30 rounded-lg p-3">
        {entry.prevention}
      </p>
    </div>
    <div>
      <h5 className="text-sm font-semibold text-purple-400 mb-2">
        Quick Check Command
      </h5>
      <div className="bg-slate-950 border border-purple-800/30 rounded-lg p-3">
        <code className="text-purple-300 text-sm font-mono">
          {entry.quickCheck}
        </code>
      </div>
    </div>
    {entry.relatedFailures.length > 1 && (
      <div className="mt-4 text-xs text-slate-500">
        Related to {entry.relatedFailures.length - 1} other logged failure
        {entry.relatedFailures.length - 1 === 1 ? "" : "s"}
      </div>
    )}
  </div>
);

interface RunbookCategoryProps {
  category: RunbookCategoryType;
  defaultExpanded?: boolean;
}

export const RunbookCategory: FC<RunbookCategoryProps> = ({
  category,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">
              {category.category}
            </h3>
            <p className="text-sm text-slate-400">
              {category.entries.length} unique issue
              {category.entries.length === 1 ? "" : "s"} ·{" "}
              {category.totalOccurrences} total occurrence
              {category.totalOccurrences === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-6 h-6 text-slate-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <div className="border-t border-slate-700 divide-y divide-slate-700">
          {category.entries.map((entry, index) => (
            <RunbookEntryCard key={entry.problem} entry={entry} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

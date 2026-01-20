/**
 * TCSDisplay - UI Components
 */

import { Target, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
  type TCSTask,
  type TCSStandard,
  getStandardStatus,
  getStatusStyles,
  getStatusTextColor,
} from "./TCSDisplayUtils";

// Header
export function TCSHeader() {
  return (
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 border-b border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
          <Target className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Task, Conditions, Standards (TCS)
          </h3>
          <p className="text-indigo-300 text-sm">
            Military-style task definition
          </p>
        </div>
      </div>
    </div>
  );
}

// Task Section
interface TaskSectionProps {
  readonly task: string;
}

export function TaskSection({ task }: TaskSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded bg-blue-900/50 flex items-center justify-center">
          <span className="text-blue-300 font-bold text-sm">T</span>
        </div>
        <h4 className="text-lg font-semibold text-blue-300">TASK</h4>
      </div>
      <div className="bg-slate-900/50 border-l-4 border-blue-500 rounded-r-lg p-4">
        <p className="text-white text-base leading-relaxed">{task}</p>
      </div>
    </div>
  );
}

// Conditions Section
interface ConditionsSectionProps {
  readonly conditions: TCSTask["conditions"];
}

export function ConditionsSection({ conditions }: ConditionsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded bg-yellow-900/50 flex items-center justify-center">
          <span className="text-yellow-300 font-bold text-sm">C</span>
        </div>
        <h4 className="text-lg font-semibold text-yellow-300">CONDITIONS</h4>
      </div>
      <div className="bg-slate-900/50 border-l-4 border-yellow-500 rounded-r-lg p-4 space-y-4">
        {conditions.timeLimit && (
          <TimeLimitItem timeLimit={conditions.timeLimit} />
        )}
        <EnvironmentItem environment={conditions.environment} />
        <ResourcesItem resources={conditions.resources} />
        {conditions.restrictions.length > 0 && (
          <RestrictionsItem restrictions={conditions.restrictions} />
        )}
      </div>
    </div>
  );
}

function TimeLimitItem({ timeLimit }: { readonly timeLimit: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-semibold text-yellow-300">
          Time Limit
        </span>
      </div>
      <p className="text-white ml-6">{timeLimit} minutes</p>
    </div>
  );
}

function EnvironmentItem({ environment }: { readonly environment: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-yellow-300 mb-2">Environment</p>
      <p className="text-white">{environment}</p>
    </div>
  );
}

function ResourcesItem({ resources }: { readonly resources: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-yellow-300 mb-2">
        Available Resources
      </p>
      <ul className="space-y-1">
        {resources.map((resource) => (
          <li key={resource} className="flex items-start gap-2 text-white">
            <span className="text-green-400 mt-1">✓</span>
            <span>{resource}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RestrictionsItem({
  restrictions,
}: {
  readonly restrictions: string[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-yellow-300 mb-2">Restrictions</p>
      <ul className="space-y-1">
        {restrictions.map((restriction) => (
          <li key={restriction} className="flex items-start gap-2 text-white">
            <span className="text-red-400 mt-1">✗</span>
            <span>{restriction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Standards Section
interface StandardsSectionProps {
  readonly standards: TCSStandard[];
  readonly allRequiredMet: boolean;
  readonly readOnly: boolean;
  readonly onStandardCheck?: (standardId: string, met: boolean) => void;
}

export function StandardsSection({
  standards,
  allRequiredMet,
  readOnly,
  onStandardCheck,
}: StandardsSectionProps) {
  return (
    <div>
      <StandardsHeader allRequiredMet={allRequiredMet} standards={standards} />

      <div className="bg-slate-900/50 border-l-4 border-green-500 rounded-r-lg p-4">
        <p className="text-sm text-green-300 mb-4 italic">
          All required standards must be met. This is pass/fail - no partial
          credit.
        </p>

        <div className="space-y-3">
          {standards.map((standard) => (
            <StandardItem
              key={standard.id}
              standard={standard}
              readOnly={readOnly}
              onCheck={onStandardCheck}
            />
          ))}
        </div>

        <PassFailSummary allRequiredMet={allRequiredMet} />
      </div>
    </div>
  );
}

interface StandardsHeaderProps {
  readonly allRequiredMet: boolean;
  readonly standards: TCSStandard[];
}

function StandardsHeader({ allRequiredMet, standards }: StandardsHeaderProps) {
  const requiredCount = standards.filter((s) => s.required).length;
  const metCount = standards.filter((s) => s.met).length;

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-green-900/50 flex items-center justify-center">
          <span className="text-green-300 font-bold text-sm">S</span>
        </div>
        <h4 className="text-lg font-semibold text-green-300">STANDARDS</h4>
      </div>
      {allRequiredMet ? (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-600 rounded-full">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">
            All Standards Met
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-700 border border-slate-600 rounded-full">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-400">
            {metCount}/{requiredCount} Required
          </span>
        </div>
      )}
    </div>
  );
}

interface StandardItemProps {
  readonly standard: TCSStandard;
  readonly readOnly: boolean;
  readonly onCheck?: (standardId: string, met: boolean) => void;
}

function StandardItem({ standard, readOnly, onCheck }: StandardItemProps) {
  const status = getStandardStatus(standard);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${getStatusStyles(status)}`}
    >
      {!readOnly && onCheck ? (
        <button
          onClick={() => onCheck(standard.id, !standard.met)}
          className="mt-0.5 focus:outline-none"
        >
          <StatusIcon status={status} />
        </button>
      ) : (
        <div className="mt-0.5">
          <StatusIcon status={status} />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`font-medium ${getStatusTextColor(status)}`}>
            {standard.description}
          </p>
          {standard.required && (
            <span className="px-2 py-0.5 bg-red-900/30 border border-red-600 rounded text-xs text-red-300 whitespace-nowrap">
              REQUIRED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({
  status,
}: {
  readonly status: "met" | "failed" | "pending";
}) {
  if (status === "met")
    return <CheckCircle className="w-6 h-6 text-green-400" />;
  if (status === "failed") return <XCircle className="w-6 h-6 text-red-400" />;
  return (
    <div className="w-6 h-6 rounded-full border-2 border-slate-500 hover:border-indigo-400 transition-colors" />
  );
}

function PassFailSummary({
  allRequiredMet,
}: {
  readonly allRequiredMet: boolean;
}) {
  return (
    <div
      className={`mt-4 p-4 rounded-lg border-2 ${
        allRequiredMet
          ? "bg-green-900/30 border-green-600"
          : "bg-slate-800 border-slate-600"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          allRequiredMet ? "text-green-300" : "text-slate-300"
        }`}
      >
        {allRequiredMet
          ? "✅ PASS: All required standards met. Task complete."
          : "⏳ IN PROGRESS: Complete all required standards to pass."}
      </p>
    </div>
  );
}

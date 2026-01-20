/**
 * MasteryProgressBar - UI Components
 */

import { CheckCircle, Lock } from "lucide-react";

// Level Badge
interface LevelBadgeProps {
  isMastered: boolean;
  isUnlocked: boolean;
  icon: string;
  size?: "sm" | "lg";
}

export function LevelBadge({
  isMastered,
  isUnlocked,
  icon,
  size = "sm",
}: LevelBadgeProps) {
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  const lockSize = size === "sm" ? "w-3 h-3" : "w-5 h-5";
  const textSize = size === "sm" ? "text-xs" : "text-xl";

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 transition-all ${sizeClasses} ${
        isMastered
          ? "bg-emerald-500 border-emerald-400"
          : isUnlocked
            ? "bg-slate-700 border-slate-500"
            : "bg-slate-800 border-slate-700 opacity-40"
      }`}
    >
      {isMastered ? (
        <CheckCircle className={`${iconSize} text-white`} />
      ) : isUnlocked ? (
        <span className={textSize}>{icon}</span>
      ) : (
        <Lock className={`${lockSize} text-slate-600`} />
      )}
    </div>
  );
}

// Compact Level Item
interface CompactLevelItemProps {
  levelKey: string;
  icon: string;
  isMastered: boolean;
  isUnlocked: boolean;
}

export function CompactLevelItem({
  levelKey,
  icon,
  isMastered,
  isUnlocked,
}: CompactLevelItemProps) {
  return (
    <div
      title={`${levelKey}: ${isMastered ? "Mastered" : isUnlocked ? "In Progress" : "Locked"}`}
    >
      <LevelBadge
        isMastered={isMastered}
        isUnlocked={isUnlocked}
        icon={icon}
        size="sm"
      />
    </div>
  );
}

// Full Level Card
interface FullLevelCardProps {
  label: string;
  icon: string;
  isMastered: boolean;
  isUnlocked: boolean;
  perfectCompletions: number;
  requiredCompletions: number;
}

export function FullLevelCard({
  label,
  icon,
  isMastered,
  isUnlocked,
  perfectCompletions,
  requiredCompletions,
}: FullLevelCardProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-2">
        <LevelBadge
          isMastered={isMastered}
          isUnlocked={isUnlocked}
          icon={icon}
          size="lg"
        />
      </div>

      <div
        className={`text-xs font-medium ${isUnlocked ? "text-white" : "text-slate-600"}`}
      >
        {label}
      </div>

      {isUnlocked && (
        <div className="text-xs text-slate-400 mt-1">
          {perfectCompletions}/{requiredCompletions}
        </div>
      )}
    </div>
  );
}

// Overall Progress Bar
interface OverallProgressProps {
  progress: number;
}

export function OverallProgress({ progress }: OverallProgressProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">Overall Mastery</span>
        <span className="text-xs text-white font-semibold">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Mastered Badge
export function MasteredBadge() {
  return (
    <span className="ml-2 text-xs font-semibold text-emerald-400">
      ✓ Mastered
    </span>
  );
}

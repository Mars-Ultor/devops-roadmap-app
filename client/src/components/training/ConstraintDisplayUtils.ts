/**
 * Utility functions and types for ConstraintDisplay
 */

export interface ResourceCounterStyle {
  container: string;
  icon: string;
  value: string;
}

export function getHintsStyle(hintsRemaining: number): ResourceCounterStyle {
  if (hintsRemaining === 0) {
    return {
      container: "bg-red-900/20 border-red-600",
      icon: "text-red-400",
      value: "text-red-400",
    };
  }
  if (hintsRemaining === 1) {
    return {
      container: "bg-yellow-900/20 border-yellow-600",
      icon: "text-yellow-400",
      value: "text-yellow-400",
    };
  }
  return {
    container: "bg-slate-900/50 border-slate-600",
    icon: "text-blue-400",
    value: "text-white",
  };
}

export function getResetsStyle(resetsRemaining: number): ResourceCounterStyle {
  if (resetsRemaining === 0) {
    return {
      container: "bg-red-900/20 border-red-600",
      icon: "text-red-400",
      value: "text-red-400",
    };
  }
  if (resetsRemaining <= 2) {
    return {
      container: "bg-yellow-900/20 border-yellow-600",
      icon: "text-yellow-400",
      value: "text-yellow-400",
    };
  }
  return {
    container: "bg-slate-900/50 border-slate-600",
    icon: "text-green-400",
    value: "text-white",
  };
}

export function formatResourceValue(value: number): string {
  return value === Infinity ? "∞" : String(value);
}

export interface PhaseInfo {
  color: string;
  label: string;
}

export const PHASE_PROGRESSION: PhaseInfo[] = [
  { color: "bg-green-500", label: "Weeks 1-4: Unlimited support" },
  { color: "bg-yellow-500", label: "Weeks 5-8: 3 hints, 5 resets" },
  { color: "bg-red-500", label: "Weeks 9-12: 1 hint, 2 resets, no copy-paste" },
];

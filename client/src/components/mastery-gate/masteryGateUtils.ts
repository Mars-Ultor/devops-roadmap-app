import type { MasteryLevel } from "../../types/training";

// Helper function for level colors
export const getLevelColor = (level: MasteryLevel): string => {
  switch (level) {
    case "crawl":
      return "blue";
    case "walk":
      return "green";
    case "run-guided":
      return "yellow";
    case "run-independent":
      return "purple";
  }
};

// Helper to get background/border classes
export const getContainerClasses = (
  isMastered: boolean,
  unlocked: boolean,
): string => {
  if (isMastered) return "bg-green-900/20 border-green-700";
  if (unlocked) return "bg-slate-800 border-slate-600";
  return "bg-slate-900/50 border-slate-700";
};

// Helper to get color classes for various elements
export const getColorClass = (
  isMastered: boolean,
  color: string,
  type: "text" | "bg" | "border",
): string => {
  if (isMastered) {
    if (type === "text") return "text-green-400";
    if (type === "bg") return "bg-green-500";
    return "border-green-600";
  }

  return `${type}-${color}-${type === "bg" ? "500" : type === "text" ? "400" : "600"}`;
};

// Helper to get indicator dot class
export const getDotClass = (
  index: number,
  perfectCompletions: number,
  color: string,
): string => {
  return index < perfectCompletions ? `bg-${color}-400` : "bg-slate-700";
};

// Helper to get attempt indicator classes
export const getAttemptClass = (
  index: number,
  perfectCompletions: number,
  isMastered: boolean,
  color: string,
): string => {
  if (index < perfectCompletions) {
    return isMastered
      ? "bg-green-900/40 border-green-600"
      : `bg-${color}-900/40 border-${color}-600`;
  }
  return "bg-slate-800 border-slate-700";
};

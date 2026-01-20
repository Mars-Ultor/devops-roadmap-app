/**
 * ReviewSchedulePanel - Utility functions and constants
 */

// Color utilities
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "critical":
      return "border-red-500 bg-red-900/20";
    case "high":
      return "border-orange-500 bg-orange-900/20";
    case "medium":
      return "border-yellow-500 bg-yellow-900/20";
    case "low":
      return "border-green-500 bg-green-900/20";
    default:
      return "border-slate-700";
  }
};

export const getPriorityBadge = (priority: string): string => {
  const colors: Record<string, string> = {
    critical: "bg-red-900/30 text-red-400",
    high: "bg-orange-900/30 text-orange-400",
    medium: "bg-yellow-900/30 text-yellow-400",
    low: "bg-green-900/30 text-green-400",
  };
  return colors[priority] || "";
};

export const getMasteryColor = (level?: string): string => {
  switch (level) {
    case "run-independent":
      return "text-purple-400";
    case "run-guided":
      return "text-indigo-400";
    case "walk":
      return "text-blue-400";
    case "crawl":
      return "text-green-400";
    default:
      return "text-slate-400";
  }
};

export const getMasteryLabel = (level?: string): string => {
  switch (level) {
    case "run-independent":
      return "🎯 Run-Independent";
    case "run-guided":
      return "🏃 Run-Guided";
    case "walk":
      return "🚶 Walk";
    case "crawl":
      return "🐾 Crawl";
    default:
      return "";
  }
};

export const getRetentionColor = (retention: number): string => {
  if (retention >= 0.8) return "text-green-400";
  if (retention >= 0.6) return "text-yellow-400";
  if (retention >= 0.4) return "text-orange-400";
  return "text-red-400";
};

export const getDayCountColor = (count: number): string => {
  if (count === 0) return "text-slate-600";
  if (count <= 3) return "text-green-400";
  if (count <= 7) return "text-yellow-400";
  return "text-red-400";
};

// Types
export interface DailyLoadData {
  recommended: number;
  minimum: number;
  maximum: number;
  reasoning: string;
}

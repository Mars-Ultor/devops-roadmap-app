/**
 * AAR History Utilities
 * Helper functions for AAR history display
 */

// Get badge color class for level
export const getLevelColor = (level: string) => {
  switch (level) {
    case "crawl":
      return "bg-blue-900/50 text-blue-300 border-blue-700";
    case "walk":
      return "bg-green-900/50 text-green-300 border-green-700";
    case "run-guided":
      return "bg-yellow-900/50 text-yellow-300 border-yellow-700";
    case "run-independent":
      return "bg-purple-900/50 text-purple-300 border-purple-700";
    default:
      return "bg-slate-700 text-slate-300 border-slate-600";
  }
};

// Format date for display
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Get pattern type badge class
export const getPatternTypeClass = (type: string) => {
  switch (type) {
    case "strength":
      return "bg-green-900/50 text-green-300";
    case "weakness":
      return "bg-red-900/50 text-red-300";
    default:
      return "bg-blue-900/50 text-blue-300";
  }
};

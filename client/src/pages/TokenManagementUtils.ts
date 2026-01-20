/**
 * TokenManagementUtils - Utilities for TokenManagement page
 */

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "quiz-reset": "text-blue-400",
    "lab-reset": "text-purple-400",
    "battle-drill-reset": "text-green-400",
  };
  return colors[type] || "text-gray-400";
}

export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "quiz-reset": "Quiz",
    "lab-reset": "Lab",
    "battle-drill-reset": "Battle Drill",
  };
  return labels[type] || type;
}

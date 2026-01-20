/**
 * TCSDisplay - Utility functions and types
 */

export interface TCSTask {
  task: string;
  conditions: {
    timeLimit?: number; // minutes
    resources: string[];
    restrictions: string[];
    environment: string;
  };
  standards: TCSStandard[];
}

export interface TCSStandard {
  id: string;
  description: string;
  required: boolean;
  met?: boolean;
}

export type StandardStatus = "met" | "failed" | "pending";

export const getStandardStatus = (standard: TCSStandard): StandardStatus => {
  if (standard.met === true) return "met";
  if (standard.met === false) return "failed";
  return "pending";
};

export const getStatusStyles = (status: StandardStatus): string => {
  switch (status) {
    case "met":
      return "bg-green-900/20 border-green-600";
    case "failed":
      return "bg-red-900/20 border-red-600";
    default:
      return "bg-slate-800 border-slate-600";
  }
};

export const getStatusTextColor = (status: StandardStatus): string => {
  switch (status) {
    case "met":
      return "text-green-300";
    case "failed":
      return "text-red-300";
    default:
      return "text-white";
  }
};

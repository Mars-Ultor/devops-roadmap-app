/**
 * Progressive Stress System - Military Training Methodology
 * Graduated difficulty escalation through time limits, documentation restrictions,
 * copy-paste blocking, distractions, and multi-tasking requirements
 */

export interface StressLevel {
  weekRange: [number, number];
  timeLimit?: number; // seconds, undefined = no limit
  documentation: "full" | "core" | "minimal" | "none";
  externalResources: boolean;
  externalTimeLimit?: number; // seconds allowed for external resources
  copyPaste: boolean;
  distractions: boolean;
  simultaneousTasks: number;
  hintPenalty: number; // multiplier for hint usage
  resetTokens: number; // tokens per week
}

export interface StressSession {
  sessionId: string;
  userId: string;
  week: number;
  lessonId: string;
  level: "crawl" | "walk" | "runGuided" | "runIndependent";
  startedAt: Date;
  timeLimit?: number;
  timeRemaining?: number;
  documentationLevel: string;
  externalResourcesAllowed: boolean;
  copyPasteAllowed: boolean;
  distractionsEnabled: boolean;
  simultaneousTasks: number;
  hintsUsed: number;
  resetsUsed: number;
  completed: boolean;
  passed: boolean;
  stressEvents: StressEvent[];
}

export interface StressEvent {
  eventId: string;
  type:
    | "distraction"
    | "time_warning"
    | "documentation_blocked"
    | "copy_paste_blocked"
    | "external_resource_blocked";
  timestamp: Date;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
}

export interface StressMetrics {
  userId: string;
  week: number;
  averageCompletionTime: number;
  stressEventCount: number;
  hintUsageUnderStress: number;
  resetTokenUsage: number;
  performanceDegradation: number; // percentage drop in performance under stress
  adaptationRate: number; // how quickly user adapts to stress
}

export const STRESS_LEVELS: StressLevel[] = [
  // Weeks 1-4: Gentle introduction
  {
    weekRange: [1, 4],
    documentation: "full",
    externalResources: true,
    copyPaste: true,
    distractions: false,
    simultaneousTasks: 1,
    hintPenalty: 1.0,
    resetTokens: 5,
  },

  // Weeks 5-8: Building pressure
  {
    weekRange: [5, 8],
    timeLimit: 5400, // 90 minutes
    documentation: "core",
    externalResources: true,
    externalTimeLimit: 600, // 10 minutes
    copyPaste: true,
    distractions: false,
    simultaneousTasks: 1,
    hintPenalty: 1.2,
    resetTokens: 4,
  },

  // Weeks 9-12: High stress
  {
    weekRange: [9, 12],
    timeLimit: 3600, // 60 minutes
    documentation: "minimal",
    externalResources: false,
    copyPaste: false,
    distractions: true,
    simultaneousTasks: 2,
    hintPenalty: 1.5,
    resetTokens: 3,
  },

  // Weeks 13-16: Extreme conditions
  {
    weekRange: [13, 16],
    timeLimit: 2700, // 45 minutes
    documentation: "none",
    externalResources: false,
    copyPaste: false,
    distractions: true,
    simultaneousTasks: 3,
    hintPenalty: 2.0,
    resetTokens: 2,
  },
];

export const STRESS_CONFIG = {
  distractionInterval: 300000, // 5 minutes
  timeWarningThresholds: [0.75, 0.5, 0.25], // 75%, 50%, 25% time remaining
  documentationUrls: {
    full: [
      "kubernetes.io",
      "docs.docker.com",
      "aws.amazon.com",
      "terraform.io",
    ],
    core: [
      "kubernetes.io/docs",
      "docs.docker.com/reference",
      "aws.amazon.com/console",
    ],
    minimal: ["kubernetes.io/docs/concepts", "docs.docker.com/engine"],
    none: [],
  },
  distractionTypes: [
    "Email notification: Urgent client request",
    "Slack message: Team needs immediate help",
    "Phone call: Manager requesting status update",
    "System alert: Production issue detected",
    "Calendar reminder: Meeting in 5 minutes",
    "Colleague question: Quick clarification needed",
  ],
  multiTaskScenarios: [
    "Monitor application logs while fixing deployment",
    "Handle user support ticket while debugging service",
    "Review pull request while troubleshooting CI/CD",
    "Update documentation while resolving incident",
  ],
};

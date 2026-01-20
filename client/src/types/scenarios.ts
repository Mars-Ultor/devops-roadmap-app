/**
 * Real Production Scenario Types
 * Multi-step troubleshooting simulations
 */

export type ScenarioCategory =
  | "deployment-failure"
  | "performance-degradation"
  | "security-incident"
  | "data-corruption"
  | "service-outage"
  | "configuration-drift"
  | "resource-exhaustion"
  | "network-issues";

export type ScenarioDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface ScenarioSymptom {
  type: "log" | "metric" | "alert" | "user-report";
  severity: "info" | "warning" | "error" | "critical";
  description: string;
  timestamp?: string;
  source?: string; // Service/component where symptom appears
}

export interface InvestigationStep {
  id: string;
  description: string;
  command?: string; // Suggested command to run
  expectedFindings?: string[];
  hints?: string[]; // Progressive hints
  timeEstimate: number; // seconds
}

export interface RootCause {
  id: string;
  description: string;
  category: string;
  impact: "low" | "medium" | "high" | "critical";
}

export interface ResolutionStep {
  id: string;
  description: string;
  command?: string;
  validation?: string; // How to verify this step worked
  canRollback: boolean;
  estimatedTime: number; // seconds
}

export interface ProductionScenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;

  // Incident details
  description: string;
  businessImpact: string; // What's at stake
  affectedUsers?: number;
  revenueImpact?: number; // $ per minute

  // Investigation
  symptoms: ScenarioSymptom[];
  investigationSteps: InvestigationStep[];
  rootCause: RootCause;

  // Resolution
  resolutionSteps: ResolutionStep[];
  preventionMeasures: string[];

  // Metadata
  estimatedTimeToResolve: number; // minutes
  prerequisiteKnowledge: string[];
  learningObjectives: string[];
  realWorldExample?: string; // Based on famous incident

  // Scoring
  maxScore: number;
  timeBonus: boolean; // Award bonus for quick resolution
  completionCriteria: string[];
}

export interface ScenarioAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;

  // Investigation tracking
  stepsCompleted: string[];
  hintsUsed: number;
  investigationTime: number; // seconds

  // Root cause identification
  rootCauseIdentified: boolean;
  rootCauseAttempts: number;
  timeToIdentify?: number; // seconds

  // Resolution tracking
  resolutionStepsCompleted: string[];
  resolutionTime: number; // seconds
  rollbacksRequired: number;

  // Results
  success: boolean;
  score: number;
  efficiency: number; // 0-100, how efficient was the resolution
  accuracyScore: number; // 0-100, accuracy in diagnosis

  // Learning
  lessonsLearned: string[];
  mistakesMade: string[];
}

export interface ScenarioPerformance {
  userId: string;
  scenarioId: string;

  attempts: number;
  successfulAttempts: number;
  averageTimeToResolve: number;
  bestScore: number;

  // Skill development
  investigationSkillGrowth: number; // 0-100
  resolutionSkillGrowth: number; // 0-100
  troubleshootingSpeed: number; // percentile

  lastAttemptedAt: Date;
  masteryLevel: "novice" | "competent" | "proficient" | "expert";
}

// Enhanced Scenario Types for Military Training Methodology
export interface ChallengeScenario {
  id: string;
  title: string;
  description: string;
  difficulty: "week1-4" | "week5-8" | "week9-12" | "week13-16";
  type: "daily" | "weekly" | "capstone";
  timeLimitSeconds: number;
  scenario: string;
  objectives: string[];
  successCriteria: string[];
  hints: ChallengeHint[];
  resources: ChallengeResource[];
  tags: string[];
  estimatedDifficulty: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=expert
  prerequisites?: string[]; // Required concepts/skills
  followUpScenarios?: string[]; // IDs of related scenarios
}

export interface ChallengeHint {
  id: string;
  trigger: "time" | "stuck" | "request"; // When hint becomes available
  triggerValue?: number; // Time in seconds or stuck duration
  content: string;
  penalty: number; // Hint cost multiplier
  category: "diagnostic" | "solution" | "best_practice";
}

export interface ChallengeResource {
  type: "documentation" | "tool" | "command" | "diagram";
  title: string;
  url?: string;
  content?: string;
  available: boolean; // Whether resource is accessible during scenario
}

export interface ChallengeAttempt {
  attemptId: string;
  userId: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;
  timeSpentSeconds: number;
  completed: boolean;
  passed: boolean;
  objectivesCompleted: string[]; // IDs of completed objectives
  hintsUsed: string[]; // IDs of hints used
  commandsExecuted: ChallengeCommand[];
  errors: ChallengeError[];
  score: number; // 0-100 based on completion and efficiency
  feedback: string;
}

export interface ChallengeCommand {
  id: string;
  command: string;
  executedAt: Date;
  success: boolean;
  output?: string;
  error?: string;
  context: "terminal" | "editor" | "browser";
}

export interface ChallengeError {
  id: string;
  error: string;
  occurredAt: Date;
  context: string;
  resolved: boolean;
  resolution?: string;
}

export interface ChallengeProgress {
  userId: string;
  week: number;
  dailyChallengesCompleted: number;
  weeklyBossBattlesCompleted: number;
  capstoneSimulationsCompleted: number;
  totalScore: number;
  averageTime: number;
  strengths: string[]; // Tags of well-performed scenarios
  weaknesses: string[]; // Tags needing improvement
  recommendedScenarios: string[]; // Next scenarios to attempt
}

export const CHALLENGE_DIFFICULTY_CONFIG = {
  "week1-4": {
    timeMultiplier: 1.5, // More time for beginners
    hintPenalty: 1.0,
    resourceAccess: "full",
    maxConcurrentTasks: 1,
  },
  "week5-8": {
    timeMultiplier: 1.2,
    hintPenalty: 1.2,
    resourceAccess: "limited",
    maxConcurrentTasks: 2,
  },
  "week9-12": {
    timeMultiplier: 1.0,
    hintPenalty: 1.5,
    resourceAccess: "minimal",
    maxConcurrentTasks: 3,
  },
  "week13-16": {
    timeMultiplier: 0.8, // Less time for experts
    hintPenalty: 2.0,
    resourceAccess: "none",
    maxConcurrentTasks: 4,
  },
};

export const CHALLENGE_TYPES = {
  daily: {
    name: "Daily Challenge",
    duration: "5-10 minutes",
    frequency: "daily",
    purpose: "Quick skill application practice",
  },
  weekly: {
    name: "Weekly Boss Battle",
    duration: "2 hours",
    frequency: "weekly",
    purpose: "Comprehensive scenario mastery",
  },
  capstone: {
    name: "Capstone Simulation",
    duration: "4 hours",
    frequency: "monthly",
    purpose: "Production incident simulation",
  },
};

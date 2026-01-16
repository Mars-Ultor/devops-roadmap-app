/**
 * Utility functions and types for TCSHeader
 */

export interface TCSTask {
  action: string;
  objective: string;
}

export interface TCSConditions {
  resources: string[];
  timeLimit?: number; // in minutes
  teamSize: string;
  documentation: string[];
}

export interface TCSStandards {
  criteria: string[];
  completionRequirements: string;
  timeRequirement?: string;
}

export interface TCSData {
  task: TCSTask;
  conditions: TCSConditions;
  standards: TCSStandards;
}

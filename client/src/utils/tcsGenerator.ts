/**
 * TCS Lab Template Generator
 * Converts traditional lab format to military-style Task-Conditions-Standards
 */

import type { TCSTask } from "../components/training/TCSDisplay";

export interface LegacyLab {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  xp: number;
  tasks: string[];
  hints?: string[];
}

export interface TCSLab extends LegacyLab {
  tcs: TCSTask;
  steps: Array<{
    number: number;
    title: string;
    description: string;
    status: "locked" | "in_progress" | "completed";
    completedValidations: number;
    validations: Array<{
      type: "command_success" | "file_exists" | "output_contains";
      cmd?: string;
      path?: string;
      content?: string;
    }>;
  }>;
}

/**
 * Generate TCS format from legacy lab data
 *
 * Converts traditional lab instructions into military-style Task-Conditions-Standards
 * format with structured objectives, constraints, and evaluation criteria.
 *
 * @param lab - Legacy lab data with basic task information
 * @returns Structured TCS task with conditions and standards
 */
export function generateTCS(lab: LegacyLab): TCSTask {
  const baseTask = `Complete all objectives related to ${lab.title.toLowerCase()} to demonstrate competency in ${extractSkillArea(lab.title)}.`;

  return {
    task: baseTask,
    conditions: {
      timeLimit: lab.estimatedTime,
      environment: determineEnvironment(lab.title, lab.description),
      resources: generateResources(lab),
      restrictions: generateRestrictions(lab.difficulty),
    },
    standards: generateStandards(lab.tasks),
  };
}

/**
 * Extract skill area from lab title
 */
function extractSkillArea(title: string): string {
  const skillMap: Record<string, string> = {
    docker: "container management and deployment",
    kubernetes: "container orchestration",
    git: "version control and collaboration",
    "ci/cd": "continuous integration and deployment",
    terraform: "infrastructure as code",
    ansible: "configuration management",
    jenkins: "build automation",
    monitoring: "system observability and alerting",
    security: "system hardening and access control",
    linux: "system administration and command-line operations",
    networking: "network configuration and troubleshooting",
    cloud: "cloud infrastructure management",
  };

  const titleLower = title.toLowerCase();
  for (const [key, value] of Object.entries(skillMap)) {
    if (titleLower.includes(key)) return value;
  }

  return "the specified technical area";
}

/**
 * Determine execution environment
 */
function determineEnvironment(title: string, description: string): string {
  const content = (title + " " + description).toLowerCase();

  if (content.includes("docker"))
    return "Linux system with Docker Engine installed";
  if (content.includes("kubernetes"))
    return "Kubernetes cluster with kubectl access";
  if (content.includes("terraform"))
    return "System with Terraform CLI and cloud provider access";
  if (content.includes("ansible"))
    return "Control node with Ansible installed and SSH access to targets";
  if (content.includes("jenkins")) return "Jenkins server with admin access";
  if (content.includes("git")) return "System with Git CLI installed";
  if (content.includes("aws") || content.includes("cloud"))
    return "AWS account with appropriate IAM permissions";

  return "Linux terminal with standard utilities";
}

/**
 * Generate resource list
 */
function generateResources(lab: LegacyLab): string[] {
  const baseResources = [
    "Lab instruction document with task descriptions",
    "Access to required command-line tools",
    "Internet access for documentation lookup (official docs only)",
  ];

  const difficultyResources: Record<string, string[]> = {
    beginner: [
      "Step-by-step hints available after 30-minute struggle period",
      "Sample commands and templates",
      "Error message explanations",
    ],
    intermediate: [
      "Conceptual hints available after struggle documentation",
      "Official documentation links",
      "Command syntax references",
    ],
    advanced: [
      "Objective-only guidance",
      "No hints - real-world simulation",
      "Documentation access only",
    ],
  };

  return [...baseResources, ...difficultyResources[lab.difficulty]];
}

/**
 * Generate restriction list based on difficulty
 */
function generateRestrictions(difficulty: string): string[] {
  const baseRestrictions = [
    "No AI assistants or code generation tools during execution",
    "No copying/pasting from Stack Overflow or similar sites",
    "Must demonstrate understanding, not just completion",
  ];

  const difficultyRestrictions: Record<string, string[]> = {
    beginner: [
      "No looking at solutions before attempting",
      "Must complete struggle documentation before accessing hints",
    ],
    intermediate: [
      "Limited hint access - must document attempts first",
      "No GUI tools - command line only where applicable",
    ],
    advanced: [
      "No hints available",
      "No external help - simulate production environment",
      "Time pressure enforced - must complete within time limit",
    ],
  };

  return [...baseRestrictions, ...difficultyRestrictions[difficulty]];
}

/**
 * Generate standards from task list
 */
function generateStandards(tasks: string[]): TCSTask["standards"] {
  return tasks
    .map((task, index) => ({
      id: `std-${index + 1}`,
      description: task,
      required: true,
      met: false,
    }))
    .concat([
      {
        id: `std-validation`,
        description: "All commands executed without errors",
        required: true,
        met: false,
      },
      {
        id: `std-aar`,
        description: "After Action Review completed with quality responses",
        required: true,
        met: false,
      },
    ]);
}

/**
 * Generate step validations from tasks
 */
export function generateSteps(lab: LegacyLab): TCSLab["steps"] {
  return lab.tasks.map((task, index) => ({
    number: index + 1,
    title: extractStepTitle(task),
    description: task,
    status: index === 0 ? ("in_progress" as const) : ("locked" as const),
    completedValidations: 0,
    validations: generateValidations(task),
  }));
}

function extractStepTitle(task: string): string {
  // Extract first few words as title
  const words = task.split(" ").slice(0, 5).join(" ");
  return words.length < task.length ? `${words}...` : words;
}

function generateValidations(task: string): Array<{
  type: "command_success" | "file_exists" | "output_contains";
  cmd?: string;
  path?: string;
  content?: string;
}> {
  // Generate basic validation based on task content
  const taskLower = task.toLowerCase();

  if (taskLower.includes("create") && taskLower.includes("directory")) {
    const dirMatch = task.match(/['"]([\w-]+)['"]/);
    if (dirMatch) {
      return [
        {
          type: "file_exists",
          path: `./${dirMatch[1]}`,
        },
      ];
    }
  }

  if (taskLower.includes("create") && taskLower.includes("file")) {
    const fileMatch = task.match(/['"]([\w.-]+)['"]/);
    if (fileMatch) {
      return [
        {
          type: "file_exists",
          path: `./${fileMatch[1]}`,
        },
      ];
    }
  }

  // Default: command success validation
  return [
    {
      type: "command_success",
      cmd: 'echo "Validation placeholder - manual check required"',
    },
  ];
}

/**
 * Convert legacy lab to TCS format
 */
export function convertToTCS(lab: LegacyLab): TCSLab {
  return {
    ...lab,
    tcs: generateTCS(lab),
    steps: generateSteps(lab),
  };
}

/**
 * Batch convert multiple labs
 */
export function batchConvertLabs(labs: LegacyLab[]): TCSLab[] {
  return labs.map(convertToTCS);
}

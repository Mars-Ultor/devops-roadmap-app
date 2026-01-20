/**
 * BossBattleUtils - Utility functions and types for Boss Battle Modal
 */

export interface BossBattle {
  id: string;
  week: number;
  title: string;
  scenario: string;
  objective: string;
  phases: BattlePhase[];
  timeLimit: number;
  minimumPassScore: number;
}

export interface BattlePhase {
  name: string;
  description: string;
  tasks: string[];
  points: number;
}

export function initializePhaseCompletion(battle: BossBattle): boolean[][] {
  return battle.phases.map((phase) =>
    new Array(phase.tasks.length).fill(false),
  );
}

export function calculateScore(
  battle: BossBattle | null,
  phaseCompletion: boolean[][],
): number {
  if (!battle) return 0;

  let earnedPoints = 0;
  let totalPoints = 0;

  battle.phases.forEach((phase, phaseIndex) => {
    totalPoints += phase.points;
    const completedTasks =
      phaseCompletion[phaseIndex]?.filter((t) => t).length || 0;
    const phasePercentage = completedTasks / phase.tasks.length;
    earnedPoints += phase.points * phasePercentage;
  });

  return Math.round((earnedPoints / totalPoints) * 100);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getTimerColor(
  timeRemaining: number,
  timeLimit: number,
): string {
  const percentRemaining = timeRemaining / timeLimit;
  if (percentRemaining > 0.5) return "text-emerald-400";
  if (percentRemaining > 0.2) return "text-amber-400";
  return "text-red-400";
}

export function isPhaseComplete(
  phaseCompletion: boolean[][],
  phaseIndex: number,
): boolean {
  return phaseCompletion[phaseIndex]?.every((t) => t) || false;
}

/** Week 1: Linux Foundation Boss Battle */
function getWeek1Battle(): BossBattle {
  return {
    id: "week1-boss",
    week: 1,
    title: "The Linux Foundation",
    scenario: `You're the new DevOps engineer at a startup. The entire production system runs on Linux, 
      but documentation is scattered and incomplete. Your mission: establish a solid foundation 
      by organizing the system, understanding all running processes, and documenting critical paths.`,
    objective:
      "Complete a comprehensive Linux system audit and establish operational baselines",
    phases: [
      {
        name: "System Discovery",
        description: "Explore and document the current system state",
        tasks: [
          "List all running processes and identify critical services",
          "Map out the filesystem hierarchy and key directories",
          "Document all network connections and open ports",
          "Identify all scheduled tasks (cron jobs)",
          "Check system resource usage (CPU, memory, disk)",
        ],
        points: 30,
      },
      {
        name: "Process Management",
        description: "Demonstrate mastery of process control",
        tasks: [
          "Start, stop, and restart a service using systemctl",
          "Monitor a process and capture its resource usage over time",
          "Use signals to gracefully manage processes",
          "Set up a background job and manage it",
        ],
        points: 25,
      },
      {
        name: "File Operations",
        description: "Execute critical file management tasks",
        tasks: [
          "Create a structured directory hierarchy for documentation",
          "Set up proper permissions for sensitive files",
          "Compress and archive old logs",
          "Search for specific patterns in system logs",
        ],
        points: 25,
      },
      {
        name: "Documentation",
        description: "Create operational documentation",
        tasks: [
          "Write a runbook for common system tasks",
          "Document all discovered services and their purposes",
          "Create a recovery checklist for system failures",
        ],
        points: 20,
      },
    ],
    timeLimit: 7200,
    minimumPassScore: 75,
  };
}

/** Week 2: Shell Scripting Boss Battle */
function getWeek2Battle(): BossBattle {
  return {
    id: "week2-boss",
    week: 2,
    title: "Shell Scripting Gauntlet",
    scenario: `The manual processes are killing productivity. Every deployment requires 15 manual steps,
      and there's no automation. Your task: create a suite of shell scripts to automate critical operations.`,
    objective:
      "Develop automation scripts for deployment and maintenance tasks",
    phases: [
      {
        name: "Basic Automation",
        description: "Create foundational automation scripts",
        tasks: [
          "Write a script to check system health",
          "Create a log rotation script",
          "Build a backup script with date stamps",
          "Develop a user management script",
        ],
        points: 25,
      },
      {
        name: "Advanced Scripts",
        description: "Implement complex automation",
        tasks: [
          "Create an interactive deployment menu",
          "Build error handling and logging",
          "Implement configuration file parsing",
          "Write a script that accepts arguments",
        ],
        points: 30,
      },
      {
        name: "Integration",
        description: "Integrate scripts into workflows",
        tasks: [
          "Schedule scripts with cron",
          "Chain scripts together for a deployment pipeline",
          "Add email notifications on failure",
        ],
        points: 25,
      },
      {
        name: "Testing & Docs",
        description: "Test and document your scripts",
        tasks: [
          "Test scripts in a safe environment",
          "Document all scripts with usage examples",
          "Create a troubleshooting guide",
        ],
        points: 20,
      },
    ],
    timeLimit: 7200,
    minimumPassScore: 75,
  };
}

/** Generate boss battle for given week */
export function generateBossBattle(week: number): BossBattle {
  const battles: Record<number, () => BossBattle> = {
    1: getWeek1Battle,
    2: getWeek2Battle,
  };
  return (battles[week] || battles[1])();
}

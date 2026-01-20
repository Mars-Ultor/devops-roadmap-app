/**
 * DailyChallengeUtils - Types, utilities, and challenge data for DailyChallengeModal
 */

export interface Challenge {
  id: string;
  title: string;
  scenario: string;
  task: string;
  hints: string[];
  successCriteria: string[];
  timeLimit: number;
  difficulty: "easy" | "medium" | "hard";
}

/** Format seconds to MM:SS display */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Get timer color based on time remaining */
export function getTimerColor(
  timeRemaining: number,
  timeLimit: number,
): string {
  const percentRemaining = timeRemaining / timeLimit;
  if (percentRemaining > 0.5) return "text-emerald-400";
  if (percentRemaining > 0.2) return "text-amber-400";
  return "text-red-400";
}

/** Get difficulty badge style */
export function getDifficultyStyle(
  difficulty: Challenge["difficulty"],
): string {
  const styles = {
    easy: "bg-green-900/30 text-green-400",
    medium: "bg-amber-900/30 text-amber-400",
    hard: "bg-red-900/30 text-red-400",
  };
  return styles[difficulty];
}

/** Challenge templates */
const CHALLENGE_TEMPLATES: Challenge[] = [
  {
    id: "docker-debug-1",
    title: "Container Crash Investigation",
    scenario:
      'Production alert: Your nginx container keeps restarting every 30 seconds. Logs show "permission denied" errors. The application team is waiting for resolution.',
    task: "Debug and fix the container crash. Container must run successfully for 2+ minutes.",
    hints: [
      "Check container logs with docker logs",
      "Inspect file permissions inside the container",
      "Review the Dockerfile or docker run command",
    ],
    successCriteria: [
      "Identified the root cause of the crash",
      "Container runs without restarting for 2+ minutes",
      "Documented the fix in a comment or file",
    ],
    timeLimit: 300,
    difficulty: "easy",
  },
  {
    id: "docker-network-1",
    title: "Multi-Container Communication",
    scenario:
      'Your frontend container cannot connect to the backend API. Both are running but not communicating. The error is "Connection refused".',
    task: "Fix container networking so frontend can reach backend API.",
    hints: [
      "Check if containers are on the same network",
      "Verify exposed ports match connection attempts",
      "Test connectivity with docker exec and curl",
    ],
    successCriteria: [
      "Created or used a Docker network",
      "Both containers connected to the network",
      "Frontend successfully calls backend API",
    ],
    timeLimit: 300,
    difficulty: "medium",
  },
  {
    id: "k8s-pod-failure-1",
    title: "Pod CrashLoopBackOff",
    scenario:
      "Your deployment shows pods in CrashLoopBackOff state. The application worked fine yesterday. Team reports no code changes.",
    task: "Identify why pods are crashing and restore service.",
    hints: [
      "Check pod logs and events",
      "Review ConfigMaps and Secrets",
      "Check resource limits and requests",
    ],
    successCriteria: [
      "Found the root cause of crashes",
      "All pods running successfully",
      "Service is accessible",
    ],
    timeLimit: 300,
    difficulty: "hard",
  },
  {
    id: "git-merge-conflict-1",
    title: "Urgent Merge Conflict",
    scenario:
      "You need to merge feature branch into main, but there are conflicts. The release is scheduled in 10 minutes.",
    task: "Resolve merge conflicts and complete the merge without breaking the build.",
    hints: [
      "Use git status to see conflicting files",
      "Look for conflict markers <<< === >>>",
      "Test the application after resolving",
    ],
    successCriteria: [
      "All merge conflicts resolved",
      "Code compiles/runs successfully",
      "Merge completed to main branch",
    ],
    timeLimit: 300,
    difficulty: "easy",
  },
  {
    id: "cicd-pipeline-failure-1",
    title: "Pipeline Blocking Deploy",
    scenario:
      'The CI/CD pipeline failed at the test stage. The team is waiting to deploy. Build logs show "module not found" errors.',
    task: "Fix the pipeline so tests pass and deployment can proceed.",
    hints: [
      "Check for missing dependencies",
      "Review pipeline configuration file",
      "Verify test environment setup",
    ],
    successCriteria: [
      "Identified the failing test",
      "Fixed the dependency issue",
      "Pipeline runs green end-to-end",
    ],
    timeLimit: 300,
    difficulty: "medium",
  },
];

/** Adjust difficulty based on week */
function adjustDifficulty(
  week: number,
  baseDifficulty: Challenge["difficulty"],
): Challenge["difficulty"] {
  if (week <= 4) return baseDifficulty;
  if (week <= 8) return baseDifficulty === "easy" ? "medium" : baseDifficulty;
  return baseDifficulty === "easy" ? "medium" : "hard";
}

/** Generate random challenge based on week */
export function generateRandomChallenge(week: number): Challenge {
  const template =
    CHALLENGE_TEMPLATES[Math.floor(Math.random() * CHALLENGE_TEMPLATES.length)];
  return {
    ...template,
    difficulty: adjustDifficulty(week, template.difficulty),
  };
}

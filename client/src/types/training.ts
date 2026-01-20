// Military Training System Type Definitions

// Mastery Progression Levels
export type MasteryLevel = "crawl" | "walk" | "run-guided" | "run-independent";

// Validation Result for step validation
export interface ValidationResult {
  passed: boolean;
  specificErrors: string[];
  suggestions: string[];
  passedCriteria: string[];
  failedCriteria: string[];
}

// Mastery Progression Levels

export interface MasteryProgress {
  attempts: number;
  perfectCompletions: number;
  requiredPerfectCompletions: number; // 3, 3, 2, 1 respectively
  unlocked: boolean;
  lastAttemptDate?: Date;
  averageTime?: number;
}

export interface LessonMastery {
  lessonId: string;
  userId: string;
  crawl: MasteryProgress;
  walk: MasteryProgress;
  runGuided: MasteryProgress;
  runIndependent: MasteryProgress;
  currentLevel: MasteryLevel;
  fullyMastered: boolean;
}

// Recertification System
export type CertificationLevel =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "master";

export interface RecertificationDrill {
  id: string;
  title: string;
  description: string;
  category:
    | "deployment"
    | "troubleshooting"
    | "security"
    | "scaling"
    | "cicd"
    | "recovery"
    | "infrastructure"
    | "monitoring";
  certificationLevel: CertificationLevel;
  recertificationIntervalDays: number; // How often recertification is required
  timeLimitMinutes: number;
  passingScore: number; // Percentage required to pass
  questions: RecertificationQuestion[];
  practicalTasks?: RecertificationTask[];
  prerequisites: string[]; // Skill IDs required before taking this drill
}

export interface RecertificationQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "scenario";
  options?: string[]; // For multiple choice
  correctAnswer: string | number | boolean;
  explanation: string;
  difficulty: "basic" | "intermediate" | "advanced";
  timeLimitSeconds?: number;
}

export interface RecertificationTask {
  id: string;
  description: string;
  commands: string[]; // Expected commands or steps
  validationCriteria: string[];
  hints: string[];
  timeLimitMinutes: number;
}

export interface RecertificationAttempt {
  id: string;
  drillId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  passed: boolean;
  timeSpentMinutes: number;
  answers: RecertificationAnswer[];
  taskCompletions?: TaskCompletion[];
  feedback?: string;
}

export interface RecertificationAnswer {
  questionId: string;
  answer: string | number | boolean;
  correct: boolean;
  timeSpentSeconds: number;
}

export interface TaskCompletion {
  taskId: string;
  completed: boolean;
  commandsUsed: string[];
  timeSpentMinutes: number;
  score: number;
}

export interface CertificationStatus {
  userId: string;
  skillId: string;
  certificationLevel: CertificationLevel;
  earnedAt: Date;
  expiresAt: Date;
  lastRecertifiedAt: Date;
  recertificationRequired: boolean;
  gracePeriodDays: number; // Days until certification expires
  consecutivePasses: number;
  totalAttempts: number;
}

export interface SkillDecayModel {
  skillId: string;
  baseRetentionRate: number; // How much knowledge is retained over time (0-1)
  decayRatePerDay: number; // How fast knowledge decays
  recertificationBoost: number; // Knowledge boost from recertification (0-1)
  minimumCompetence: number; // Minimum knowledge level before recertification required
}

// Battle Drill System
export interface BattleDrill {
  id: string;
  title: string;
  description: string;
  targetTimeSeconds: number;
  difficulty: "basic" | "intermediate" | "advanced";
  category:
    | "deployment"
    | "troubleshooting"
    | "security"
    | "scaling"
    | "cicd"
    | "recovery";
  steps: BattleDrillStep[];
}

export interface BattleDrillStep {
  id: string;
  description: string;
  validationCriteria: string[];
  hints: string[];
}

export interface BattleDrillAttempt {
  id: string;
  drillId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  passed: boolean;
  hintsUsed: number;
  resetsUsed: number;
  stepsCompleted: number;
  totalSteps: number;
}

export interface BattleDrillPerformance {
  drillId: string;
  userId: string;
  attempts: number;
  bestTime: number;
  averageTime: number;
  successRate: number;
  masteryLevel: "novice" | "competent" | "proficient" | "expert";
  lastAttemptDate: Date;
  needsRecertification: boolean;
  certificationExpiresAt?: Date;
}

// After Action Review (AAR) System
export interface AAR {
  id: string;
  userId: string;
  lessonId?: string;
  labId?: string;
  drillId?: string;
  createdAt: Date;
  objective: string; // min 20 words
  whatWorked: string[]; // min 3 items
  whatDidntWork: string[]; // min 2 items
  rootCauses: string[]; // why it didn't work
  improvements: string[]; // what would I do differently
  transferableKnowledge: string; // what can be used in future
  aiReviewed: boolean;
  aiFollowUpQuestions?: string[];
  userResponses?: Record<string, string>;
}

// Struggle Session System
export interface StruggleSession {
  id: string;
  userId: string;
  lessonId: string;
  startedAt: Date;
  hintsUnlockAt: Date; // startedAt + 30 minutes
  hintsRequested: HintRequest[];
  struggleLog?: StruggleLog;
  endedAt?: Date;
  solutionUnlockedAt?: Date;
  struggleEnduranceSeconds: number;
}

export interface HintRequest {
  hintLevel: number; // 1, 2, 3
  requestedAt: Date;
  hint: string;
}

export interface StruggleLog {
  attemptedSolutions: string[]; // min 3
  stuckLocation: string;
  hypothesis: string;
  createdAt: Date;
}

// Validation System
export interface ValidationStep {
  id: string;
  stepNumber: number;
  description: string;
  validationFunction: string; // reference to validation function
  passed: boolean;
  attempts: number;
  errorMessage?: string;
  completedAt?: Date;
}

export interface LabValidation {
  labId: string;
  userId: string;
  steps: ValidationStep[];
  currentStep: number;
  totalSteps: number;
  allStepsPassed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

// Failure Log System
export interface FailureLogEntry {
  id: string;
  entryNumber: number;
  userId: string;
  createdAt: Date;
  task: string; // which lab/exercise
  whatBroke: string;
  attemptedSolutions: string[]; // min 3
  rootCause: string;
  solution: string;
  timeWastedMinutes: number;
  keyLesson: string;
  prevention: string;
  quickCheckCommand?: string;
  category:
    | "docker"
    | "kubernetes"
    | "cicd"
    | "networking"
    | "security"
    | "other";
  tags: string[];
}

export interface PersonalRunbook {
  userId: string;
  categories: Record<string, FailureLogEntry[]>;
  mostCommonIssues: FailureLogEntry[];
  lastUpdated: Date;
}

// Spaced Repetition System
export interface SpacedRepetitionItem {
  id: string;
  userId: string;
  contentId: string; // lesson or drill ID
  contentType: "lesson" | "drill";
  lastReviewed: Date;
  nextReviewDate: Date;
  reviewCount: number;
  successRate: number; // 0-1
  averageTimeSeconds: number;
  performanceTrend: "improving" | "stable" | "degrading";
}

export interface DailyDrill {
  id: string;
  userId: string;
  date: Date;
  drillId: string;
  required: boolean; // must complete before new content
  completed: boolean;
  completionTime?: number;
  passed?: boolean;
}

// Progressive Stress System (old definition removed - see Task 10 types below)
// Reset Token System
export interface ResetToken {
  userId?: string;
  week: number;
  tokensRemaining: number;
  maxTokensPerWeek: number;
  lastResetAt?: Date;
}

// Scenario Challenge System
export interface ScenarioChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "week1-4" | "week5-8" | "week9-12";
  type: "daily" | "weekly-boss" | "capstone";
  timeLimitSeconds: number;
  scenario: string;
  objectives: string[];
  successCriteria: string[];
  failureConditions: string[];
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  objectivesCompleted: string[];
  passed: boolean;
  score: number; // 0-100
  resetsUsed: number;
}

// Performance Analytics
export interface PerformanceMetrics {
  userId: string;
  week: number;

  // Battle Drill Performance
  battleDrillStats: {
    averageTime: number;
    bestTime?: number;
    improvementRate: number;
    drillsCompleted: number;
  };

  // Struggle Endurance
  averageStruggleEndurance: number; // seconds before hint request

  // Success Rates
  firstTrySuccessRate: number; // percentage

  // Hints
  hintsRequestedPerLab: number;

  // Resets
  resetsUsedThisWeek: number;

  // Error Patterns
  errorPatterns: string[];

  // Skill Decay Alerts
  degradingSkills: string[];

  // Time Investment
  topicMastery: Record<string, string>;

  // Optimal Study Time
  productivityByHour: Record<number, number>; // hour -> performance score

  // Total time
  totalTimeSpent: number;
}

export interface WeeklyReport {
  userId: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;

  improvements: string[];
  degradations: string[];
  recommendedFocus: string[];
  jobReadinessScore: number; // 0-100
  estimatedWeeksToReady: number;

  generatedAt: Date;
}

// Accountability Features
export interface ProgressStreak {
  userId?: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  forgivenessTokensRemaining: number; // 1 per month
  milestones: number[]; // 7, 30, 100 days
}

export interface ShareableProgress {
  type: "daily" | "weekly" | "achievement" | "certification";
  text: string;
  imageUrl?: string;
  stats: Record<string, unknown>;
}

// Adaptive Difficulty
export interface AdaptiveDifficultyProfile {
  userId?: string;
  performanceMetrics: {
    averageCompletionTime: number;
    hintsNeeded: number;
    errorFrequency: number;
    firstAttemptSuccess: number;
  };
  currentDifficulty: "reduced" | "standard" | "increased";
  adjustments: {
    timeMultiplier: number; // 0.5-2.0
    hintAvailability: "generous" | "standard" | "limited";
    scenarioComplexity: "simplified" | "standard" | "advanced";
  };
  learningPath: {
    strongTopics: string[];
    weakTopics: string[];
    skipRecommendations: string[];
    extraPractice: string[];
  };
  lastAdjusted?: Date;
}

// Task-Condition-Standard (TCS) Format
export interface TCSLesson {
  id: string;

  // TASK
  task: {
    action: string; // action verb
    outcome: string; // measurable outcome
    fullDescription: string;
  };

  // CONDITIONS
  conditions: {
    resources: string[]; // what's available
    constraints: string[]; // limitations
    timeLimit?: number; // seconds
    teamSize: "individual" | "pair" | "team";
    documentation: "full" | "core" | "minimal" | "none";
  };

  // STANDARDS
  standards: {
    criteria: string[]; // specific, measurable success criteria
    goNoGo: boolean; // all must pass, no partial credit
  };

  // Content
  levels: {
    crawl: TCSLessonLevel;
    walk: TCSLessonLevel;
    runGuided: TCSLessonLevel;
    runIndependent: TCSLessonLevel;
  };
}

export interface TCSLessonLevel {
  level: MasteryLevel;
  guidance: string; // level-specific guidance
  steps?: string[]; // only for crawl
  fillInBlanks?: { template: string; blanks: string[] }[]; // only for walk
  conceptualGuidance?: string; // only for run-guided
  objectiveOnly?: string; // only for run-independent
  validation: ValidationStep[];
}

// User Training State
// Failure Log System
export type FailureCategory =
  | "docker"
  | "deployment"
  | "security"
  | "networking"
  | "database"
  | "cicd"
  | "infrastructure"
  | "testing"
  | "monitoring"
  | "configuration"
  | "other";

export type FailureSeverity = "low" | "medium" | "high" | "critical";

export interface FailureLog {
  id: string;
  userId: string;

  // Context
  contentType: "lesson" | "lab" | "drill" | "project";
  contentId: string;
  contentTitle: string;

  // Failure Details
  category: FailureCategory;
  severity: FailureSeverity;
  title: string; // Brief failure description
  description: string; // Detailed what happened
  errorMessage?: string; // Exact error if available

  // Analysis
  rootCause?: string; // What caused it
  resolution?: string; // How it was fixed
  preventionStrategy?: string; // How to avoid in future

  // Metadata
  timestamp: Date;
  resolvedAt?: Date;
  timeToResolveMinutes?: number;

  // Learning
  lessonsLearned: string[];
  relatedConcepts: string[];

  // Pattern Detection
  isRecurring: boolean;
  previousOccurrences: string[]; // IDs of similar failures
  pattern?: string; // Auto-detected pattern type
}

export interface FailurePattern {
  id: string;
  userId: string;
  pattern: string; // e.g., "Docker port mapping errors"
  category: FailureCategory;
  occurrences: number;
  failureIds: string[];
  firstSeen: Date;
  lastSeen: Date;
  resolved: boolean;
  recommendedActions: string[];
}

export interface FailureAnalytics {
  userId: string;
  totalFailures: number;
  resolvedFailures: number;
  unresolvedFailures: number;
  averageResolutionTimeMinutes: number;

  // By Category
  failuresByCategory: Record<FailureCategory, number>;

  // By Severity
  failuresBySeverity: Record<FailureSeverity, number>;

  // Patterns
  activePatterns: FailurePattern[];
  resolvedPatterns: FailurePattern[];

  // Trends
  failuresLast7Days: number;
  failuresLast30Days: number;
  improvementRate: number; // % reduction in failures over time
}

export interface UserTrainingState {
  userId: string;
  currentWeek: number;
  currentLesson?: string;

  // Gates
  lessonsCompleted: string[];
  lessonsMastered: string[]; // all 4 levels complete
  weeksMastered: number[];

  // Daily Requirements
  dailyDrillCompleted: boolean;

  // Tokens
  resetTokensRemaining: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;

  // Performance
  metrics: PerformanceMetrics;
}

// Stress Training System
export type StressLevel = "none" | "low" | "medium" | "high" | "extreme";

export interface StressCondition {
  id: string;
  type:
    | "time-pressure"
    | "multi-tasking"
    | "interruption"
    | "production-incident"
    | "resource-constraint";
  description: string;
  enabled: boolean;
  severity: StressLevel;
}

export interface TimePressureCondition extends StressCondition {
  type: "time-pressure";
  targetTimeSeconds: number;
  penaltyPerSecondOver: number; // XP penalty
  warningThresholdPercent: number; // When to show warnings (e.g., 75%)
}

export interface MultiTaskingCondition extends StressCondition {
  type: "multi-tasking";
  simultaneousTasks: number; // 2-4 tasks at once
  taskSwitchPenalty: number; // Time penalty for context switching
  requiresParallelExecution: boolean;
}

export interface InterruptionCondition extends StressCondition {
  type: "interruption";
  interruptionFrequency: number; // interruptions per hour
  interruptionTypes: ("alert" | "question" | "incident" | "meeting")[];
  mustRespond: boolean;
  responseTimeSeconds: number;
}

export interface ProductionIncidentCondition extends Omit<
  StressCondition,
  "severity"
> {
  type: "production-incident";
  severity: "warning" | "error" | "critical" | "outage";
  affectedUsers: number;
  revenueImpact: number; // $ per minute
  stakeholderPressure: boolean;
  timeToResolve: number; // target in minutes
}

export interface ResourceConstraintCondition extends StressCondition {
  type: "resource-constraint";
  limitedHints: number; // Max hints available
  limitedAttempts: number; // Max attempts before failure
  noDocumentation: boolean;
  limitedTools: string[]; // List of available tools
}

export type AnyStressCondition =
  | TimePressureCondition
  | MultiTaskingCondition
  | InterruptionCondition
  | ProductionIncidentCondition
  | ResourceConstraintCondition;

export interface StressScenario {
  id: string;
  title: string;
  description: string;
  stressLevel: StressLevel;
  conditions: AnyStressCondition[];
  duration: number; // seconds
  successCriteria: string[];
  failurePenalty: number; // XP penalty
  bonusReward: number; // Extra XP for success
}

export interface StressTrainingSession {
  id: string;
  userId: string;
  scenario: StressScenario;
  startedAt: Date;
  completedAt?: Date;

  // Performance under stress
  tasksCompleted: number;
  totalTasks: number;
  errorsCount: number;
  timeToCompletion: number;
  succeeded: boolean;

  // Physiological simulation (game mechanics)
  stressScore: number; // 0-100, increases with pressure
  fatigueLevel: number; // 0-100, increases with time/stress
  focusLevel: number; // 100-0, decreases with stress

  // Results
  performanceRating?: "excellent" | "good" | "adequate" | "poor" | "failed";
  adaptabilityScore: number; // How well they handled stress
}

export interface StressMetrics {
  userId: string;
  totalSessions: number;
  sessionsByStressLevel: Record<string, number>;
  averageStressScore: number;
  averageAdaptabilityScore: number;
  stressToleranceLevel: string; // 'low' | 'medium' | 'high' | 'extreme'

  performanceDegradation: {
    normalAccuracy: number; // % when not stressed
    stressedAccuracy: number; // % under stress
    degradationRate: number; // % performance drop under stress
  };

  lastUpdated: Date;
}

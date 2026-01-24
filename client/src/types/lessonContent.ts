/**
 * Level-Specific Lesson Content Types
 * Supports 4-level mastery progression (Crawl → Walk → Run-Guided → Run-Independent)
 */

// Crawl Level: Step-by-step guided execution
export interface CrawlContent {
  introduction: string;
  steps: CrawlStep[];
  expectedOutcome?: string; // Optional expected outcome
  exercises?: unknown[]; // Optional exercises for practice
}

export interface CrawlStep {
  stepNumber: number;
  instruction: string;
  command?: string; // exact command to execute
  explanation: string; // why this step is needed
  expectedOutput?: string;
  validationCriteria: string[]; // what to check
  commonMistakes?: string[];
}

// Walk Level: Fill-in-the-blank templates
export interface WalkContent {
  introduction: string;
  exercises: WalkExercise[];
  hints?: string[]; // Optional hints
}

export interface WalkExercise {
  id?: string; // Optional ID for exercises
  title?: string; // Optional title for exercises
  description?: string; // Optional description
  exerciseNumber: number;
  scenario: string;
  template: string; // command template with blanks: "docker run -p __PORT__:80 __IMAGE__"
  blanks: WalkBlank[];
  solution: string; // completed command
  explanation: string;
  difficulty?: string; // Optional difficulty
  estimatedTime?: number; // Optional estimated time
  objectives?: string[]; // Optional objectives
  startingCondition?: string; // Optional starting condition
  successCriteria?: string[]; // Optional success criteria
  hints?: string[]; // Optional hints
}

export interface WalkBlank {
  id: string;
  label: string; // "PORT", "IMAGE", etc.
  hint: string;
  correctValue: string;
  validationPattern?: string; // regex for validation
}

// Run-Guided Level: Conceptual guidance only
export interface RunGuidedContent {
  introduction?: string; // Optional introduction
  objective?: string; // Optional objective
  terminalEnabled?: boolean; // Optional terminal access for hands-on practice
  conceptualGuidance?: string[]; // Optional conceptual guidance
  keyConceptsToApply?: string[]; // Optional key concepts
  checkpoints?: RunGuidedCheckpoint[]; // Optional checkpoints
  resourcesAllowed?: string[]; // Optional resources
  exercises?: unknown[]; // Optional exercises
}

export interface RunGuidedCheckpoint {
  checkpoint: string;
  description: string;
  validationCriteria: string[];
  hintIfStuck?: string;
}

// Run-Independent Level: Just the objective
export interface RunIndependentContent {
  introduction?: string; // Optional introduction
  objective?: string; // Optional objective
  companyProfile?: {
    name: string;
    description: string;
    currentMetrics: {
      deploymentFrequency: string;
      leadTimeForChanges: string;
      changeFailureRate: string;
      timeToRestoreService: string;
    };
    teamStructure: {
      development: string;
      operations: string;
      qa: string;
      management: string;
    };
    technologyStack: {
      frontend: string;
      backend: string;
      infrastructure: string;
      ciCd: string;
      monitoring: string;
    };
    currentChallenges: string[];
    businessContext: string;
  }; // Optional company profile for transformation exercises
  successCriteria?: string[]; // Optional success criteria
  timeTarget?: number; // Optional time target
  minimumRequirements?: string[]; // Optional minimum requirements
  evaluationRubric?: RunIndependentRubric[]; // Optional evaluation rubric
  exercises?: unknown[]; // Optional exercises
}

export interface RunIndependentRubric {
  criterion: string;
  weight: number; // 0-1, must sum to 1
  passingThreshold: string;
}

// Complete lesson with all 4 levels
export interface LeveledLessonContent {
  id?: string; // Alias for lessonId (for backward compatibility)
  lessonId: string;
  baseLesson: {
    title: string;
    description: string;
    learningObjectives: string[];
    prerequisites: string[];
    estimatedTimePerLevel: {
      crawl: number;
      walk: number;
      runGuided: number;
      runIndependent: number;
    };
  };

  // Level-specific content
  crawl: CrawlContent;
  walk: WalkContent;
  runGuided: RunGuidedContent;
  runIndependent: RunIndependentContent;

  // Common across all levels
  videoUrl?: string;
  documentation: string[];
  relatedConcepts: string[];
  troubleshootingGuide?: TroubleshootingGuide;
}

export interface TroubleshootingGuide {
  commonErrors: CommonError[];
  debuggingSteps: string[];
  whereToGetHelp: string[];
}

export interface CommonError {
  error: string;
  cause: string;
  solution: string;
  preventionTip: string;
}

// Helper type for accessing level-specific content
export type LevelContent =
  | CrawlContent
  | WalkContent
  | RunGuidedContent
  | RunIndependentContent;

// Type guard functions
export function isCrawlContent(content: LevelContent): content is CrawlContent {
  return "steps" in content && Array.isArray(content.steps);
}

export function isWalkContent(content: LevelContent): content is WalkContent {
  return "exercises" in content && Array.isArray(content.exercises);
}

export function isRunGuidedContent(
  content: LevelContent,
): content is RunGuidedContent {
  return (
    "conceptualGuidance" in content && Array.isArray(content.conceptualGuidance)
  );
}

export function isRunIndependentContent(
  content: LevelContent,
): content is RunIndependentContent {
  return (
    "successCriteria" in content &&
    !("steps" in content) &&
    !("exercises" in content)
  );
}

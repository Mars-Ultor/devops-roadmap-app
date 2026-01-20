/**
 * TCS Validator - Ensures proper TCS format compliance
 */

import type { TCSTask } from "../components/training/TCSDisplay";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Validator helper for TASK section
function validateTask(
  task: string,
  errors: string[],
  warnings: string[],
): void {
  if (!task || task.trim().length === 0) {
    errors.push("TASK is required and cannot be empty");
    return;
  }
  if (task.length < 20) {
    warnings.push("TASK should be more descriptive (minimum 20 characters)");
  }
  if (task.length > 200) {
    warnings.push(
      "TASK should be concise (maximum 200 characters recommended)",
    );
  }
  if (
    !task.includes("demonstrate") &&
    !task.includes("deploy") &&
    !task.includes("configure")
  ) {
    warnings.push(
      "TASK should use action verbs (demonstrate, deploy, configure, etc.)",
    );
  }
}

// Validator helper for CONDITIONS section
function validateConditions(
  conditions: TCSTask["conditions"],
  errors: string[],
  warnings: string[],
): void {
  if (!conditions) {
    errors.push("CONDITIONS section is required");
    return;
  }
  // Time Limit
  if (conditions.timeLimit && conditions.timeLimit < 5) {
    warnings.push("Time limit seems very short (< 5 minutes)");
  }
  if (conditions.timeLimit && conditions.timeLimit > 180) {
    warnings.push("Time limit seems very long (> 3 hours)");
  }
  // Environment
  if (!conditions.environment || conditions.environment.trim().length === 0) {
    errors.push("Environment description is required in CONDITIONS");
  }
  // Resources
  if (!conditions.resources || conditions.resources.length === 0) {
    errors.push("At least one resource must be specified in CONDITIONS");
  } else if (conditions.resources.length > 15) {
    warnings.push("Too many resources listed - keep it focused");
  }
  // Restrictions
  if (!conditions.restrictions || conditions.restrictions.length === 0) {
    warnings.push("Consider adding restrictions to increase training value");
  }
}

// Validator helper for individual standard
function validateSingleStandard(
  standard: TCSTask["standards"][0],
  index: number,
  errors: string[],
  warnings: string[],
): void {
  if (!standard.id || standard.id.trim().length === 0) {
    errors.push(`Standard ${index + 1} must have an ID`);
  }
  if (!standard.description || standard.description.trim().length === 0) {
    errors.push(`Standard ${index + 1} must have a description`);
    return;
  }
  if (standard.description.length < 10) {
    warnings.push(`Standard ${index + 1} description is too short`);
  }
  if (standard.description.length > 150) {
    warnings.push(`Standard ${index + 1} description is too long - be concise`);
  }
  // Check for measurability
  const measurableWords = [
    "successfully",
    "correctly",
    "without errors",
    "passes",
    "returns",
    "contains",
    "matches",
  ];
  const hasMeasurable = measurableWords.some((word) =>
    standard.description.toLowerCase().includes(word),
  );
  if (!hasMeasurable) {
    warnings.push(
      `Standard ${index + 1} may not be measurable - add success criteria`,
    );
  }
}

// Validator helper for STANDARDS section
function validateStandards(
  standards: TCSTask["standards"],
  errors: string[],
  warnings: string[],
): void {
  if (!standards || standards.length === 0) {
    errors.push("At least one standard is required in STANDARDS");
    return;
  }
  const requiredStandards = standards.filter((s) => s.required);
  if (requiredStandards.length === 0) {
    errors.push("At least one required standard must be specified");
  }
  if (standards.length > 20) {
    warnings.push("Too many standards (> 20) - consider consolidating");
  }
  standards.forEach((standard, index) => {
    validateSingleStandard(standard, index, errors, warnings);
  });
}

/**
 * Validate TCS structure and content
 */
export function validateTCS(tcs: TCSTask): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  validateTask(tcs.task, errors, warnings);
  validateConditions(tcs.conditions, errors, warnings);
  validateStandards(tcs.standards, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if TCS follows military training best practices
 */
export function checkBestPractices(tcs: TCSTask): string[] {
  const issues: string[] = [];

  // Task should be singular objective
  if (tcs.task.includes(" and ") && tcs.task.split(" and ").length > 2) {
    issues.push("TASK contains multiple objectives - split into separate labs");
  }

  // Standards should be pass/fail
  const vagueWords = ["understand", "learn", "know", "appreciate", "explore"];
  tcs.standards.forEach((standard, index) => {
    vagueWords.forEach((word) => {
      if (standard.description.toLowerCase().includes(word)) {
        issues.push(
          `Standard ${index + 1} uses vague term "${word}" - use measurable actions`,
        );
      }
    });
  });

  // Resources should not include implementation steps
  tcs.conditions.resources.forEach((resource, index) => {
    if (
      resource.toLowerCase().includes("step ") ||
      resource.toLowerCase().includes("first ")
    ) {
      issues.push(
        `Resource ${index + 1} contains implementation guidance - move to content`,
      );
    }
  });

  // Check for proper difficulty scaling
  const requiredCount = tcs.standards.filter((s) => s.required).length;
  if (tcs.conditions.timeLimit) {
    const standardsPerMinute = requiredCount / tcs.conditions.timeLimit;
    if (standardsPerMinute > 0.5) {
      issues.push("Too many standards for time limit - may be unrealistic");
    }
    if (standardsPerMinute < 0.05) {
      issues.push("Too few standards for time limit - may lack rigor");
    }
  }

  return issues;
}

/**
 * Calculate TCS difficulty score
 */
export function calculateDifficulty(tcs: TCSTask): {
  score: number;
  level: "beginner" | "intermediate" | "advanced";
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Factor 1: Number of required standards
  const requiredStandards = tcs.standards.filter((s) => s.required).length;
  if (requiredStandards <= 3) {
    score += 10;
    factors.push("Few standards (beginner)");
  } else if (requiredStandards <= 7) {
    score += 50;
    factors.push("Moderate standards (intermediate)");
  } else {
    score += 90;
    factors.push("Many standards (advanced)");
  }

  // Factor 2: Time pressure
  if (tcs.conditions.timeLimit) {
    const standardsPerMinute = requiredStandards / tcs.conditions.timeLimit;
    if (standardsPerMinute > 0.3) {
      score += 30;
      factors.push("High time pressure");
    } else if (standardsPerMinute > 0.15) {
      score += 20;
      factors.push("Moderate time pressure");
    } else {
      score += 5;
      factors.push("Low time pressure");
    }
  }

  // Factor 3: Resource availability
  const hasHints = tcs.conditions.resources.some((r) =>
    r.toLowerCase().includes("hint"),
  );
  const hasTemplates = tcs.conditions.resources.some((r) =>
    r.toLowerCase().includes("template"),
  );
  if (!hasHints && !hasTemplates) {
    score += 30;
    factors.push("No hints or templates (advanced)");
  } else if (hasHints && hasTemplates) {
    score += 5;
    factors.push("Full support available (beginner)");
  } else {
    score += 15;
    factors.push("Partial support (intermediate)");
  }

  // Factor 4: Restrictions
  const restrictionCount = tcs.conditions.restrictions.length;
  if (restrictionCount >= 4) {
    score += 25;
    factors.push("Many restrictions (advanced)");
  } else if (restrictionCount >= 2) {
    score += 15;
    factors.push("Some restrictions (intermediate)");
  } else {
    score += 5;
    factors.push("Few restrictions (beginner)");
  }

  // Determine level
  let level: "beginner" | "intermediate" | "advanced";
  if (score < 40) {
    level = "beginner";
  } else if (score < 80) {
    level = "intermediate";
  } else {
    level = "advanced";
  }

  return { score, level, factors };
}

/**
 * Generate TCS report
 */
export function generateTCSReport(tcs: TCSTask): string {
  const validation = validateTCS(tcs);
  const bestPractices = checkBestPractices(tcs);
  const difficulty = calculateDifficulty(tcs);

  let report = "=== TCS VALIDATION REPORT ===\n\n";

  // Validation Results
  report += `Validation: ${validation.valid ? "✅ PASS" : "❌ FAIL"}\n\n`;

  if (validation.errors.length > 0) {
    report += "ERRORS:\n";
    validation.errors.forEach((err) => (report += `  ❌ ${err}\n`));
    report += "\n";
  }

  if (validation.warnings.length > 0) {
    report += "WARNINGS:\n";
    validation.warnings.forEach((warn) => (report += `  ⚠️  ${warn}\n`));
    report += "\n";
  }

  // Best Practices
  if (bestPractices.length > 0) {
    report += "BEST PRACTICE ISSUES:\n";
    bestPractices.forEach((issue) => (report += `  ℹ️  ${issue}\n`));
    report += "\n";
  }

  // Difficulty Analysis
  report += `DIFFICULTY ANALYSIS:\n`;
  report += `  Score: ${difficulty.score}/100\n`;
  report += `  Level: ${difficulty.level.toUpperCase()}\n`;
  report += `  Factors:\n`;
  difficulty.factors.forEach((factor) => (report += `    - ${factor}\n`));
  report += "\n";

  // Summary Stats
  report += `SUMMARY STATISTICS:\n`;
  report += `  Total Standards: ${tcs.standards.length}\n`;
  report += `  Required Standards: ${tcs.standards.filter((s) => s.required).length}\n`;
  report += `  Optional Standards: ${tcs.standards.filter((s) => !s.required).length}\n`;
  report += `  Time Limit: ${tcs.conditions.timeLimit || "None"} minutes\n`;
  report += `  Resources: ${tcs.conditions.resources.length}\n`;
  report += `  Restrictions: ${tcs.conditions.restrictions.length}\n`;

  return report;
}

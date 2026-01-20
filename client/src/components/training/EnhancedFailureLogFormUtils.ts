/**
 * EnhancedFailureLogForm - Constants and utility functions
 */

import type { FailureCategory, FailureSeverity } from "../../types/training";

// ============================================================================
// Constants
// ============================================================================

export const CATEGORIES: { value: FailureCategory; label: string }[] = [
  { value: "docker", label: "Docker" },
  { value: "deployment", label: "Deployment" },
  { value: "security", label: "Security" },
  { value: "networking", label: "Networking" },
  { value: "database", label: "Database" },
  { value: "cicd", label: "CI/CD" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "testing", label: "Testing" },
  { value: "monitoring", label: "Monitoring" },
  { value: "configuration", label: "Configuration" },
  { value: "other", label: "Other" },
];

export const SEVERITIES: {
  value: FailureSeverity;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Low", color: "text-green-400 bg-green-900/30" },
  {
    value: "medium",
    label: "Medium",
    color: "text-yellow-400 bg-yellow-900/30",
  },
  { value: "high", label: "High", color: "text-orange-400 bg-orange-900/30" },
  { value: "critical", label: "Critical", color: "text-red-400 bg-red-900/30" },
];

// ============================================================================
// Pattern Detection Types and Mock Data
// ============================================================================

export interface PatternDetection {
  detected: boolean;
  category: string;
  occurrences: number;
  lastSeen: string;
  suggestedRunbook: string;
}

export interface ValidationState {
  whatTried: boolean;
  rootCause: boolean;
  isValid: boolean;
}

export const MOCK_PATTERNS: Record<string, PatternDetection> = {
  docker: {
    detected: true,
    category: "Docker port conflicts",
    occurrences: 3,
    lastSeen: "2 days ago",
    suggestedRunbook:
      "Check if port is already in use with `netstat -ano | findstr :<port>`. Kill process or change port mapping.",
  },
  networking: {
    detected: true,
    category: "DNS resolution failures",
    occurrences: 5,
    lastSeen: "1 week ago",
    suggestedRunbook:
      "Verify DNS configuration. Check /etc/resolv.conf. Test with `nslookup <domain>`. Consider using 8.8.8.8 as fallback.",
  },
  deployment: {
    detected: true,
    category: "Environment variable issues",
    occurrences: 4,
    lastSeen: "3 days ago",
    suggestedRunbook:
      "Verify all required env vars are set. Use `env | grep <VAR_NAME>`. Check .env file is loaded. Validate variable names match.",
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

export function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

interface RunbookParams {
  title: string;
  description: string;
  errorMessage: string;
  rootCause: string;
  whatTried: string[];
  category: FailureCategory;
  severity: FailureSeverity;
}

export function generateRunbook(params: RunbookParams): string {
  const {
    title,
    description,
    errorMessage,
    rootCause,
    whatTried,
    category,
    severity,
  } = params;
  const validSteps = whatTried.filter((step) => step.trim().length > 0);

  return `# Runbook: ${title}

## Problem
${description}

${errorMessage ? `## Error Message\n\`\`\`\n${errorMessage}\n\`\`\`\n` : ""}

## Root Cause
${rootCause}

## Troubleshooting Steps
${validSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

## Category
${category.toUpperCase()}

## Severity
${severity.toUpperCase()}

## Prevention
- Document this pattern for future reference
- Add validation checks if applicable
- Update deployment checklist
- Share knowledge with team

---
*Auto-generated from Failure Log - ${new Date().toLocaleDateString()}*
`;
}

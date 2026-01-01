/**
 * Automated Step Validation Utilities
 * Real-time validation for battle drill steps
 */

import type { BattleDrillStep } from '../types/training';

export interface ValidationResult {
  passed: boolean;
  passedCriteria: string[];
  failedCriteria: string[];
  specificErrors: string[];
  suggestions: string[];
}

/**
 * Validate a step based on user input and criteria
 */
export async function validateStep(
  step: BattleDrillStep,
  userInput: string,
  context?: Record<string, unknown>
): Promise<ValidationResult> {
  const result: ValidationResult = {
    passed: false,
    passedCriteria: [],
    failedCriteria: [],
    specificErrors: [],
    suggestions: []
  };

  // Run validators for each criterion
  for (const criterion of step.validationCriteria) {
    const validation = await validateCriterion(criterion, userInput, context);
    
    if (validation.passed) {
      result.passedCriteria.push(criterion);
    } else {
      result.failedCriteria.push(criterion);
      if (validation.error) {
        result.specificErrors.push(validation.error);
      }
      if (validation.suggestion) {
        result.suggestions.push(validation.suggestion);
      }
    }
  }

  // Step passes only if ALL criteria pass
  result.passed = result.failedCriteria.length === 0;

  return result;
}

interface CriterionValidation {
  passed: boolean;
  error?: string;
  suggestion?: string;
}

/**
 * Validate individual criterion
 */
async function validateCriterion(
  criterion: string,
  userInput: string,
  context?: Record<string, unknown>
): Promise<CriterionValidation> {
  // Parameter is intentionally unused in current implementation
  void context;
  const input = userInput.toLowerCase().trim();
  const criterionLower = criterion.toLowerCase();

  // Dockerfile validation
  if (criterionLower.includes('dockerfile')) {
    if (criterionLower.includes('exists')) {
      return {
        passed: input.includes('dockerfile') || input.includes('created'),
        error: input.includes('dockerfile') ? undefined : 'Dockerfile not found or not created',
        suggestion: 'Create a file named "Dockerfile" (no extension) in your project root'
      };
    }
    if (criterionLower.includes('base image')) {
      const hasBaseImage = /from\s+[\w/:.-]+/.test(input);
      return {
        passed: hasBaseImage,
        error: hasBaseImage ? undefined : 'FROM instruction not found in Dockerfile',
        suggestion: 'Add a FROM instruction (e.g., FROM node:18-alpine)'
      };
    }
    if (criterionLower.includes('copy') && criterionLower.includes('run')) {
      const hasCopy = input.includes('copy') || input.includes('add');
      const hasRun = input.includes('run');
      return {
        passed: hasCopy && hasRun,
        error: !hasCopy ? 'Missing COPY/ADD instruction' : !hasRun ? 'Missing RUN instruction' : undefined,
        suggestion: 'Include both COPY (to add files) and RUN (to execute commands)'
      };
    }
    if (criterionLower.includes('expose')) {
      const hasExpose = input.includes('expose') || input.includes('port');
      return {
        passed: hasExpose,
        error: hasExpose ? undefined : 'Missing EXPOSE instruction',
        suggestion: 'Add EXPOSE <port> to specify which port your app listens on'
      };
    }
    if (criterionLower.includes('cmd') || criterionLower.includes('entrypoint')) {
      const hasCmd = input.includes('cmd') || input.includes('entrypoint');
      return {
        passed: hasCmd,
        error: hasCmd ? undefined : 'Missing CMD or ENTRYPOINT instruction',
        suggestion: 'Add CMD or ENTRYPOINT to specify how to run your app'
      };
    }
  }

  // Docker build validation
  if (criterionLower.includes('build') && criterionLower.includes('successfully')) {
    const buildSuccess = input.includes('successfully built') || 
                        input.includes('build complete') ||
                        (input.includes('docker build') && !input.includes('error'));
    return {
      passed: buildSuccess,
      error: buildSuccess ? undefined : 'Build failed or did not complete successfully',
      suggestion: 'Check build output for errors. Common issues: missing files, syntax errors in Dockerfile'
    };
  }

  if (criterionLower.includes('tagged')) {
    const hasTag = /:\w+/.test(input) || input.includes('tag');
    return {
      passed: hasTag,
      error: hasTag ? undefined : 'Image not properly tagged',
      suggestion: 'Tag your image with: docker build -t myapp:v1 .'
    };
  }

  // Container run validation
  if (criterionLower.includes('container') && criterionLower.includes('starts')) {
    const containerRunning = input.includes('running') || 
                            input.includes('started') ||
                            input.includes('up');
    return {
      passed: containerRunning,
      error: containerRunning ? undefined : 'Container not running',
      suggestion: 'Start with: docker run -d -p 8080:8080 myapp:v1'
    };
  }

  if (criterionLower.includes('accessible') && criterionLower.includes('port')) {
    const isAccessible = input.includes('200') || 
                        input.includes('ok') ||
                        input.includes('accessible') ||
                        input.includes('responding');
    return {
      passed: isAccessible,
      error: isAccessible ? undefined : 'Application not accessible on specified port',
      suggestion: 'Test with: curl localhost:8080 or visit http://localhost:8080 in browser'
    };
  }

  if (criterionLower.includes('health check') && criterionLower.includes('200')) {
    const healthOk = input.includes('200') || 
                    input.includes('healthy') ||
                    input.includes('ok');
    return {
      passed: healthOk,
      error: healthOk ? undefined : 'Health check endpoint not returning 200 OK',
      suggestion: 'Verify health endpoint exists and returns proper status code'
    };
  }

  // Log validation
  if (criterionLower.includes('logs') && criterionLower.includes('no') && criterionLower.includes('error')) {
    const hasErrors = input.includes('error') || 
                     input.includes('fatal') ||
                     input.includes('critical');
    return {
      passed: !hasErrors,
      error: hasErrors ? 'Critical errors found in logs' : undefined,
      suggestion: hasErrors ? 'Review logs and fix errors before proceeding' : undefined
    };
  }

  // Environment variables
  if (criterionLower.includes('environment') && criterionLower.includes('set')) {
    const hasEnvVars = input.includes('env') || 
                      input.includes('export') ||
                      input.includes('variable');
    return {
      passed: hasEnvVars,
      error: hasEnvVars ? undefined : 'Environment variables not configured',
      suggestion: 'Set with: docker run -e KEY=value or use .env file'
    };
  }

  // Git validation
  if (criterionLower.includes('git') && criterionLower.includes('commit')) {
    const hasCommit = input.includes('commit') || 
                     input.includes('committed');
    return {
      passed: hasCommit,
      error: hasCommit ? undefined : 'Changes not committed',
      suggestion: 'Commit with: git add . && git commit -m "message"'
    };
  }

  // Rollback validation
  if (criterionLower.includes('rollback') || criterionLower.includes('previous version')) {
    const rolledBack = input.includes('rollback') || 
                      input.includes('reverted') ||
                      input.includes('previous');
    return {
      passed: rolledBack,
      error: rolledBack ? undefined : 'Not rolled back to previous version',
      suggestion: 'Use kubectl rollout undo or docker tag/redeploy previous image'
    };
  }

  // Security validation
  if (criterionLower.includes('firewall') && criterionLower.includes('configured')) {
    const firewallSet = input.includes('firewall') || 
                       input.includes('ufw') ||
                       input.includes('iptables');
    return {
      passed: firewallSet,
      error: firewallSet ? undefined : 'Firewall not configured',
      suggestion: 'Configure with: ufw allow 80/tcp or iptables -A INPUT -p tcp --dport 80 -j ACCEPT'
    };
  }

  if (criterionLower.includes('ssl') || criterionLower.includes('https')) {
    const hasSSL = input.includes('ssl') || 
                  input.includes('https') ||
                  input.includes('tls') ||
                  input.includes('certificate');
    return {
      passed: hasSSL,
      error: hasSSL ? undefined : 'SSL/HTTPS not configured',
      suggestion: 'Use certbot or configure reverse proxy with SSL certificate'
    };
  }

  // Scaling validation
  if (criterionLower.includes('replica') || criterionLower.includes('scale')) {
    const hasReplicas = input.includes('replica') || 
                       input.includes('scale') ||
                       input.includes('instance');
    return {
      passed: hasReplicas,
      error: hasReplicas ? undefined : 'Not scaled to multiple replicas',
      suggestion: 'Scale with: kubectl scale deployment myapp --replicas=3'
    };
  }

  // CI/CD validation
  if (criterionLower.includes('pipeline') && criterionLower.includes('created')) {
    const hasPipeline = input.includes('pipeline') || 
                       input.includes('.yml') ||
                       input.includes('workflow');
    return {
      passed: hasPipeline,
      error: hasPipeline ? undefined : 'CI/CD pipeline not created',
      suggestion: 'Create .github/workflows/ci.yml or .gitlab-ci.yml'
    };
  }

  // Backup validation
  if (criterionLower.includes('backup') && criterionLower.includes('created')) {
    const hasBackup = input.includes('backup') || 
                     input.includes('dump') ||
                     input.includes('snapshot');
    return {
      passed: hasBackup,
      error: hasBackup ? undefined : 'Backup not created',
      suggestion: 'Create backup with: docker exec db mysqldump > backup.sql or pg_dump'
    };
  }

  // Default: keyword-based validation (fallback)
  const keywords = criterionLower.split(' ').filter(w => w.length > 3);
  const matchCount = keywords.filter(kw => input.includes(kw)).length;
  const passed = matchCount >= Math.ceil(keywords.length * 0.5); // 50% keyword match

  return {
    passed,
    error: passed ? undefined : `Criterion not met: ${criterion}`,
    suggestion: passed ? undefined : 'Review the requirement and verify your implementation matches'
  };
}

/**
 * Validate multiple steps in sequence
 */
export async function validateSteps(
  steps: BattleDrillStep[],
  userInputs: Record<string, string>,
  context?: Record<string, unknown>
): Promise<Record<string, ValidationResult>> {
  const results: Record<string, ValidationResult> = {};

  for (const step of steps) {
    const input = userInputs[step.id] || '';
    results[step.id] = await validateStep(step, input, context);
  }

  return results;
}

/**
 * Check if all steps have passed
 */
export function allStepsPassed(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(r => r.passed);
}

/**
 * Get overall completion percentage
 */
export function getCompletionPercentage(results: Record<string, ValidationResult>): number {
  const values = Object.values(results);
  if (values.length === 0) return 0;
  
  const passed = values.filter(r => r.passed).length;
  return Math.round((passed / values.length) * 100);
}

/**
 * Get next failed step (for progressive disclosure)
 */
export function getNextFailedStep(
  steps: BattleDrillStep[],
  results: Record<string, ValidationResult>
): BattleDrillStep | null {
  for (const step of steps) {
    const result = results[step.id];
    if (!result || !result.passed) {
      return step;
    }
  }
  return null;
}

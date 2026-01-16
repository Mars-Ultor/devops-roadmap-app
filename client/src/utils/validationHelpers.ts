/**
 * Individual criterion validators extracted for complexity reduction
 */

export interface CriterionValidation {
  passed: boolean;
  error?: string;
  suggestion?: string;
}

type ValidatorFn = (input: string, criterionLower: string) => CriterionValidation | null;

// Dockerfile validators
function validateDockerfileExists(input: string): CriterionValidation {
  const passed = input.includes('dockerfile') || input.includes('created');
  return {
    passed,
    error: passed ? undefined : 'Dockerfile not found or not created',
    suggestion: 'Create a file named "Dockerfile" (no extension) in your project root'
  };
}

function validateDockerfileBaseImage(input: string): CriterionValidation {
  const hasBaseImage = /from\s+[\w/:.-]+/.test(input);
  return {
    passed: hasBaseImage,
    error: hasBaseImage ? undefined : 'FROM instruction not found in Dockerfile',
    suggestion: 'Add a FROM instruction (e.g., FROM node:18-alpine)'
  };
}

function validateDockerfileCopyRun(input: string): CriterionValidation {
  const hasCopy = input.includes('copy') || input.includes('add');
  const hasRun = input.includes('run');
  return {
    passed: hasCopy && hasRun,
    error: !hasCopy ? 'Missing COPY/ADD instruction' : !hasRun ? 'Missing RUN instruction' : undefined,
    suggestion: 'Include both COPY (to add files) and RUN (to execute commands)'
  };
}

function validateDockerfileExpose(input: string): CriterionValidation {
  const hasExpose = input.includes('expose') || input.includes('port');
  return {
    passed: hasExpose,
    error: hasExpose ? undefined : 'Missing EXPOSE instruction',
    suggestion: 'Add EXPOSE <port> to specify which port your app listens on'
  };
}

function validateDockerfileCmd(input: string): CriterionValidation {
  const hasCmd = input.includes('cmd') || input.includes('entrypoint');
  return {
    passed: hasCmd,
    error: hasCmd ? undefined : 'Missing CMD or ENTRYPOINT instruction',
    suggestion: 'Add CMD or ENTRYPOINT to specify how to run your app'
  };
}

// Docker build/run validators
function validateBuildSuccess(input: string): CriterionValidation {
  const buildSuccess = input.includes('successfully built') || 
                      input.includes('build complete') ||
                      (input.includes('docker build') && !input.includes('error'));
  return {
    passed: buildSuccess,
    error: buildSuccess ? undefined : 'Build failed or did not complete successfully',
    suggestion: 'Check build output for errors. Common issues: missing files, syntax errors in Dockerfile'
  };
}

function validateTagged(input: string): CriterionValidation {
  const hasTag = /:\w+/.test(input) || input.includes('tag');
  return {
    passed: hasTag,
    error: hasTag ? undefined : 'Image not properly tagged',
    suggestion: 'Tag your image with: docker build -t myapp:v1 .'
  };
}

function validateContainerStarts(input: string): CriterionValidation {
  const containerRunning = input.includes('running') || 
                          input.includes('started') ||
                          input.includes('up');
  return {
    passed: containerRunning,
    error: containerRunning ? undefined : 'Container not running',
    suggestion: 'Start with: docker run -d -p 8080:8080 myapp:v1'
  };
}

function validatePortAccessible(input: string): CriterionValidation {
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

function validateHealthCheck(input: string): CriterionValidation {
  const healthOk = input.includes('200') || 
                  input.includes('healthy') ||
                  input.includes('ok');
  return {
    passed: healthOk,
    error: healthOk ? undefined : 'Health check endpoint not returning 200 OK',
    suggestion: 'Verify health endpoint exists and returns proper status code'
  };
}

function validateNoLogErrors(input: string): CriterionValidation {
  const hasErrors = input.includes('error') || 
                   input.includes('fatal') ||
                   input.includes('critical');
  return {
    passed: !hasErrors,
    error: hasErrors ? 'Critical errors found in logs' : undefined,
    suggestion: hasErrors ? 'Review logs and fix errors before proceeding' : undefined
  };
}

function validateEnvVars(input: string): CriterionValidation {
  const hasEnvVars = input.includes('env') || 
                    input.includes('export') ||
                    input.includes('variable');
  return {
    passed: hasEnvVars,
    error: hasEnvVars ? undefined : 'Environment variables not configured',
    suggestion: 'Set with: docker run -e KEY=value or use .env file'
  };
}

function validateGitCommit(input: string): CriterionValidation {
  const hasCommit = input.includes('commit') || input.includes('committed');
  return {
    passed: hasCommit,
    error: hasCommit ? undefined : 'Changes not committed',
    suggestion: 'Commit with: git add . && git commit -m "message"'
  };
}

function validateRollback(input: string): CriterionValidation {
  const rolledBack = input.includes('rollback') || 
                    input.includes('reverted') ||
                    input.includes('previous');
  return {
    passed: rolledBack,
    error: rolledBack ? undefined : 'Not rolled back to previous version',
    suggestion: 'Use kubectl rollout undo or docker tag/redeploy previous image'
  };
}

function validateFirewall(input: string): CriterionValidation {
  const firewallSet = input.includes('firewall') || 
                     input.includes('ufw') ||
                     input.includes('iptables');
  return {
    passed: firewallSet,
    error: firewallSet ? undefined : 'Firewall not configured',
    suggestion: 'Configure with: ufw allow 80/tcp or iptables -A INPUT -p tcp --dport 80 -j ACCEPT'
  };
}

function validateSSL(input: string): CriterionValidation {
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

function validateScaling(input: string): CriterionValidation {
  const hasReplicas = input.includes('replica') || 
                     input.includes('scale') ||
                     input.includes('instance');
  return {
    passed: hasReplicas,
    error: hasReplicas ? undefined : 'Not scaled to multiple replicas',
    suggestion: 'Scale with: kubectl scale deployment myapp --replicas=3'
  };
}

function validatePipeline(input: string): CriterionValidation {
  const hasPipeline = input.includes('pipeline') || 
                     input.includes('.yml') ||
                     input.includes('workflow');
  return {
    passed: hasPipeline,
    error: hasPipeline ? undefined : 'CI/CD pipeline not created',
    suggestion: 'Create .github/workflows/ci.yml or .gitlab-ci.yml'
  };
}

function validateBackup(input: string): CriterionValidation {
  const hasBackup = input.includes('backup') || 
                   input.includes('dump') ||
                   input.includes('snapshot');
  return {
    passed: hasBackup,
    error: hasBackup ? undefined : 'Backup not created',
    suggestion: 'Create backup with: docker exec db mysqldump > backup.sql or pg_dump'
  };
}

// Fallback validator
function validateKeywords(input: string, criterionLower: string): CriterionValidation {
  const keywords = criterionLower.split(' ').filter(w => w.length > 3);
  const matchCount = keywords.filter(kw => input.includes(kw)).length;
  const passed = matchCount >= Math.ceil(keywords.length * 0.5);
  return {
    passed,
    error: passed ? undefined : `Criterion not met: ${criterionLower}`,
    suggestion: passed ? undefined : 'Review the requirement and verify your implementation matches'
  };
}

// Validator registry with matchers
interface ValidatorEntry {
  match: (criterionLower: string) => boolean;
  validate: ValidatorFn;
}

const dockerfileValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('exists'), validate: (i) => validateDockerfileExists(i) },
  { match: (c) => c.includes('base image'), validate: (i) => validateDockerfileBaseImage(i) },
  { match: (c) => c.includes('copy') && c.includes('run'), validate: (i) => validateDockerfileCopyRun(i) },
  { match: (c) => c.includes('expose'), validate: (i) => validateDockerfileExpose(i) },
  { match: (c) => c.includes('cmd') || c.includes('entrypoint'), validate: (i) => validateDockerfileCmd(i) }
];

const buildValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('build') && c.includes('successfully'), validate: (i) => validateBuildSuccess(i) },
  { match: (c) => c.includes('tagged'), validate: (i) => validateTagged(i) }
];

const containerValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('container') && c.includes('starts'), validate: (i) => validateContainerStarts(i) },
  { match: (c) => c.includes('accessible') && c.includes('port'), validate: (i) => validatePortAccessible(i) },
  { match: (c) => c.includes('health check') && c.includes('200'), validate: (i) => validateHealthCheck(i) },
  { match: (c) => c.includes('logs') && c.includes('no') && c.includes('error'), validate: (i) => validateNoLogErrors(i) },
  { match: (c) => c.includes('environment') && c.includes('set'), validate: (i) => validateEnvVars(i) }
];

const gitValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('git') && c.includes('commit'), validate: (i) => validateGitCommit(i) },
  { match: (c) => c.includes('rollback') || c.includes('previous version'), validate: (i) => validateRollback(i) }
];

const securityValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('firewall') && c.includes('configured'), validate: (i) => validateFirewall(i) },
  { match: (c) => c.includes('ssl') || c.includes('https'), validate: (i) => validateSSL(i) }
];

const infraValidators: ValidatorEntry[] = [
  { match: (c) => c.includes('replica') || c.includes('scale'), validate: (i) => validateScaling(i) },
  { match: (c) => c.includes('pipeline') && c.includes('created'), validate: (i) => validatePipeline(i) },
  { match: (c) => c.includes('backup') && c.includes('created'), validate: (i) => validateBackup(i) }
];

/**
 * Main validation function using validator registry
 */
export function validateCriterionWithHelpers(
  criterion: string,
  input: string
): CriterionValidation {
  const criterionLower = criterion.toLowerCase();
  const inputLower = input.toLowerCase().trim();
  
  // Group validators by category for dockerfile-specific matching
  if (criterionLower.includes('dockerfile')) {
    for (const v of dockerfileValidators) {
      if (v.match(criterionLower)) {
        return v.validate(inputLower, criterionLower) ?? validateKeywords(inputLower, criterionLower);
      }
    }
  }
  
  // Check all validator groups
  const allValidators = [
    ...buildValidators,
    ...containerValidators,
    ...gitValidators,
    ...securityValidators,
    ...infraValidators
  ];
  
  for (const v of allValidators) {
    if (v.match(criterionLower)) {
      return v.validate(inputLower, criterionLower) ?? validateKeywords(inputLower, criterionLower);
    }
  }
  
  // Fallback to keyword matching
  return validateKeywords(inputLower, criterionLower);
}

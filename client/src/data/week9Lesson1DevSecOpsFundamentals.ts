/**
 * Week 9 Lesson 1 - DevSecOps Fundamentals
 * 4-Level Mastery Progression: Security principles, shift-left security, threat modeling
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week9Lesson1DevSecOpsFundamentals: LeveledLessonContent = {
  lessonId: "week9-lesson1-devsecops-fundamentals",

  baseLesson: {
    title: "DevSecOps Fundamentals: Security as Code",
    description:
      "Master security principles for DevOps. Learn shift-left security, threat modeling, and how to integrate security into every stage of the software development lifecycle.",
    learningObjectives: [
      "Understand DevSecOps principles and shift-left security",
      "Conduct threat modeling using STRIDE methodology",
      "Apply OWASP Top 10 security principles",
      "Implement security controls in CI/CD pipelines",
      "Design security testing strategies (SAST, DAST, SCA)",
    ],
    prerequisites: [
      "Understanding of CI/CD pipelines",
      "Basic knowledge of web application architecture",
      "Familiarity with Git and version control",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20,
    },
  },

  crawl: {
    introduction:
      "Learn DevSecOps principles step-by-step. You will understand shift-left security, conduct threat modeling, and integrate security into your development workflow.",
    expectedOutcome:
      "Complete understanding of DevSecOps, shift-left security, OWASP Top 10, STRIDE threat modeling, and automated security scanning with SAST/DAST/SCA tools",
    steps: [
      {
        stepNumber: 1,
        instruction: "Understand the three core DevSecOps principles",
        command:
          'echo "DevSecOps Principles:\n1. Shift Left: Find vulnerabilities early\n2. Automate Security: Security as code\n3. Continuous Monitoring: Always vigilant"',
        explanation:
          "DevSecOps integrates security into every phase of development, not just at the end. Shift-left means testing security early when fixes are cheaper.",
        expectedOutput:
          "DevSecOps Principles:\n1. Shift Left: Find vulnerabilities early\n2. Automate Security: Security as code\n3. Continuous Monitoring: Always vigilant",
        validationCriteria: [
          "Understand shift-left concept",
          "Know why early detection matters",
          "Recognize automation importance",
        ],
        commonMistakes: [
          "Thinking security is only for production",
          "Relying on manual security reviews only",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Identify the OWASP Top 10 security risks",
        command:
          'curl -s https://owasp.org/www-project-top-ten/ | grep -E "(Broken|Injection|Cryptographic|Security)"',
        explanation:
          "OWASP Top 10 lists the most critical web application security risks: Injection, Broken Auth, Sensitive Data Exposure, XXE, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Using Components with Known Vulnerabilities, Insufficient Logging.",
        expectedOutput: "List of OWASP Top 10 vulnerabilities",
        validationCriteria: [
          "Can name at least 5 OWASP Top 10 risks",
          "Understand injection attacks",
          "Know what broken authentication means",
        ],
        commonMistakes: [
          "Focusing only on injection attacks",
          "Ignoring configuration issues",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Perform threat modeling using STRIDE methodology",
        command:
          'echo "STRIDE Threat Model:\nS - Spoofing (fake identity)\nT - Tampering (modify data)\nR - Repudiation (deny actions)\nI - Information Disclosure (leak data)\nD - Denial of Service (crash system)\nE - Elevation of Privilege (gain admin)"',
        explanation:
          "STRIDE helps identify threats systematically. For each component, ask: Can someone spoof? Tamper? etc.",
        expectedOutput: "STRIDE acronym explained",
        validationCriteria: [
          "Understand each STRIDE category",
          "Can apply to a simple API",
          "Identify at least one threat per category",
        ],
        commonMistakes: [
          "Skipping threat modeling",
          "Not considering all STRIDE categories",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Set up pre-commit hooks for secret scanning",
        command:
          "pip install detect-secrets && detect-secrets scan --baseline .secrets.baseline",
        explanation:
          "detect-secrets prevents committing API keys, passwords, tokens. Pre-commit hooks block commits with secrets.",
        expectedOutput: "Secret scanning baseline created",
        validationCriteria: [
          "Tool installed successfully",
          "Baseline file created",
          "Can scan files for secrets",
        ],
        commonMistakes: [
          "Committing .env files",
          "Hardcoding credentials in code",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Configure dependency vulnerability scanning",
        command:
          'npm audit --json > audit-report.json && cat audit-report.json | jq ".vulnerabilities | length"',
        explanation:
          "npm audit checks for known vulnerabilities in dependencies. Fix high/critical issues immediately.",
        expectedOutput: "Number of vulnerabilities found",
        validationCriteria: [
          "Audit runs successfully",
          "Vulnerabilities counted",
          "Report saved as JSON",
        ],
        commonMistakes: [
          "Ignoring low-severity issues that add up",
          "Not updating dependencies regularly",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Add security linting with ESLint security plugin",
        command:
          'npm install eslint-plugin-security --save-dev && echo "{\\"plugins\\": [\\"security\\"]}" > .eslintrc.json',
        explanation:
          "ESLint security plugin detects unsafe code patterns like eval(), regex DoS, buffer overflows.",
        expectedOutput: "Security plugin installed and configured",
        validationCriteria: [
          "Plugin installed",
          "ESLint config updated",
          "Can run eslint on code",
        ],
        commonMistakes: ["Not configuring rules", "Ignoring warnings"],
      },
      {
        stepNumber: 7,
        instruction: "Implement SAST (Static Application Security Testing)",
        command:
          "docker run --rm -v $(pwd):/src returntocorp/semgrep:latest --config=auto /src",
        explanation:
          "Semgrep performs static code analysis to find security vulnerabilities without running the code.",
        expectedOutput: "SAST scan results showing found issues",
        validationCriteria: [
          "Semgrep runs successfully",
          "Security issues identified",
          "Results show file and line numbers",
        ],
        commonMistakes: [
          "Only running on production code",
          "Not fixing findings",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Configure container image scanning",
        command: "docker scan myapp:latest --severity high",
        explanation:
          "Docker scan (powered by Snyk) checks container images for vulnerabilities in OS packages and application dependencies.",
        expectedOutput: "List of high-severity vulnerabilities in image",
        validationCriteria: [
          "Image scanned successfully",
          "Vulnerabilities listed by severity",
          "CVE numbers shown",
        ],
        commonMistakes: [
          "Using latest base images without pinning",
          "Ignoring OS-level vulnerabilities",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Set up security headers in web application",
        command:
          'curl -I https://your-app.com | grep -E "(X-Frame-Options|Content-Security-Policy|Strict-Transport-Security)"',
        explanation:
          "Security headers protect against XSS, clickjacking, MITM attacks. Essential headers: X-Frame-Options, CSP, HSTS, X-Content-Type-Options.",
        expectedOutput: "Security headers present in HTTP response",
        validationCriteria: [
          "At least 3 security headers present",
          "HSTS configured for HTTPS",
          "CSP policy defined",
        ],
        commonMistakes: ["Missing HSTS", "Overly permissive CSP"],
      },
      {
        stepNumber: 10,
        instruction: "Implement least privilege with IAM roles",
        command:
          'aws iam get-role --role-name MyAppRole | jq ".Role.AssumeRolePolicyDocument"',
        explanation:
          "Least privilege: grant only permissions needed, nothing more. Use IAM roles, not root credentials.",
        expectedOutput: "IAM role trust policy shown",
        validationCriteria: [
          "Role has specific permissions",
          "No wildcard (*) permissions",
          "Trust policy restricts who can assume role",
        ],
        commonMistakes: [
          "Using root credentials",
          "Granting AdministratorAccess",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Enable audit logging for security events",
        command:
          "kubectl create -f - <<EOF\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: audit-policy\ndata:\n  policy.yaml: |\n    apiVersion: audit.k8s.io/v1\n    kind: Policy\n    rules:\n    - level: Metadata\nEOF",
        explanation:
          "Audit logs record who did what, when. Essential for security investigations and compliance.",
        expectedOutput: "Audit policy created",
        validationCriteria: [
          "Policy configured",
          "Logs capture authentication events",
          "Retention period set",
        ],
        commonMistakes: [
          "Not logging authentication failures",
          "Insufficient retention",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Create security incident response plan",
        command:
          'echo "Incident Response Plan:\n1. Detect (alerts, monitoring)\n2. Contain (isolate affected systems)\n3. Eradicate (remove threat)\n4. Recover (restore services)\n5. Post-mortem (learn and improve)"',
        explanation:
          "Having a plan before an incident saves time. Document: who to contact, how to isolate systems, communication plan.",
        expectedOutput: "Incident response phases listed",
        validationCriteria: [
          "All 5 phases understood",
          "Contact list exists",
          "Runbooks documented",
        ],
        commonMistakes: [
          "No plan until incident happens",
          "Not practicing incident drills",
        ],
      },
    ],
  },

  walk: {
    introduction:
      "Apply DevSecOps principles through hands-on security exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Implement pre-commit hook to prevent secrets from being committed.",
        template:
          'Install tool:\npip install __DETECT_SECRETS__\n\nInitialize baseline:\ndetect-secrets scan --baseline __SECRETS_BASELINE__\n\nCreate pre-commit hook (.git/hooks/pre-commit):\n#!/bin/bash\ndetect-secrets scan --baseline .secrets.baseline\nif [ $? -ne 0 ]; then\n  echo "__SECRET_DETECTED__"\n  exit __1__\nfi\n\nMake executable:\nchmod __+X__ .git/hooks/pre-commit\n\nTest:\necho "API_KEY=sk-abc123" > test.txt\ngit add test.txt\ngit commit -m "Test" # Should __FAIL__',
        blanks: [
          {
            id: "DETECT_SECRETS",
            label: "DETECT_SECRETS",
            hint: "Tool name for secret detection",
            correctValue: "detect-secrets",
            validationPattern: "detect.*secrets",
          },
          {
            id: "SECRETS_BASELINE",
            label: "SECRETS_BASELINE",
            hint: "Baseline filename",
            correctValue: ".secrets.baseline",
            validationPattern: "\\.secrets\\.baseline",
          },
          {
            id: "SECRET_DETECTED",
            label: "SECRET_DETECTED",
            hint: "Error message when secret found",
            correctValue: "Secret detected! Commit blocked.",
            validationPattern: "secret|blocked",
          },
          {
            id: "1",
            label: "1",
            hint: "Exit code for failure",
            correctValue: "1",
            validationPattern: "1",
          },
          {
            id: "+X",
            label: "+X",
            hint: "Make file executable",
            correctValue: "+x",
            validationPattern: "\\+x",
          },
          {
            id: "FAIL",
            label: "FAIL",
            hint: "Expected result",
            correctValue: "fail",
            validationPattern: "fail|block",
          },
        ],
        solution:
          'pip install detect-secrets\ndetect-secrets scan --baseline .secrets.baseline\n\nPre-commit hook:\n#!/bin/bash\ndetect-secrets scan --baseline .secrets.baseline\nif [ $? -ne 0 ]; then\n  echo "Secret detected! Commit blocked."\n  exit 1\nfi\n\nchmod +x .git/hooks/pre-commit',
        explanation:
          "Pre-commit hooks prevent secrets from entering version control",
      },
      {
        exerciseNumber: 2,
        scenario: "Perform STRIDE threat modeling for an API endpoint.",
        template:
          "API Endpoint: POST /api/users (create user account)\n\nSTRIDE Analysis:\n\nS - Spoofing:\nThreat: Attacker creates account __PRETENDING_TO_BE__ legitimate user\nMitigation: Require __EMAIL_VERIFICATION__ and CAPTCHA\n\nT - Tampering:\nThreat: Modify request to grant __ADMIN_PRIVILEGES__\nMitigation: Server-side validation, __NEVER_TRUST__ client input\n\nR - Repudiation:\nThreat: User denies creating account\nMitigation: __AUDIT_LOGS__ with IP, timestamp, user agent\n\nI - Information Disclosure:\nThreat: Error messages reveal __DATABASE_STRUCTURE__\nMitigation: Generic error messages, __LOG_DETAILS__ server-side only\n\nD - Denial of Service:\nThreat: Spam account creation\nMitigation: __RATE_LIMITING__, CAPTCHA, email verification\n\nE - Elevation of Privilege:\nThreat: New user gets admin role\nMitigation: __DEFAULT_TO_LEAST__ privilege, explicit role assignment",
        blanks: [
          {
            id: "PRETENDING_TO_BE",
            label: "PRETENDING_TO_BE",
            hint: "Spoofing means...",
            correctValue: "pretending to be",
            validationPattern: "pretend|impersonat",
          },
          {
            id: "EMAIL_VERIFICATION",
            label: "EMAIL_VERIFICATION",
            hint: "Verify ownership",
            correctValue: "email verification",
            validationPattern: "email|verification",
          },
          {
            id: "ADMIN_PRIVILEGES",
            label: "ADMIN_PRIVILEGES",
            hint: "Elevated permissions",
            correctValue: "admin privileges",
            validationPattern: "admin|privilege",
          },
          {
            id: "NEVER_TRUST",
            label: "NEVER_TRUST",
            hint: "Security principle",
            correctValue: "never trust",
            validationPattern: "never.*trust|validate",
          },
          {
            id: "AUDIT_LOGS",
            label: "AUDIT_LOGS",
            hint: "Track actions",
            correctValue: "audit logs",
            validationPattern: "audit|log",
          },
          {
            id: "DATABASE_STRUCTURE",
            label: "DATABASE_STRUCTURE",
            hint: "Internal details",
            correctValue: "database structure",
            validationPattern: "database|structure|schema",
          },
          {
            id: "LOG_DETAILS",
            label: "LOG_DETAILS",
            hint: "Keep sensitive info secure",
            correctValue: "log details",
            validationPattern: "log",
          },
          {
            id: "RATE_LIMITING",
            label: "RATE_LIMITING",
            hint: "Prevent abuse",
            correctValue: "rate limiting",
            validationPattern: "rate.*limit|throttl",
          },
          {
            id: "DEFAULT_TO_LEAST",
            label: "DEFAULT_TO_LEAST",
            hint: "Security principle",
            correctValue: "default to least",
            validationPattern: "least|minimal",
          },
        ],
        solution:
          "STRIDE analysis identifies threats systematically:\nS - Spoofing: Email verification prevents fake accounts\nT - Tampering: Server validation prevents privilege escalation\nR - Repudiation: Audit logs prove actions\nI - Information Disclosure: Generic errors hide internals\nD - DoS: Rate limiting prevents spam\nE - Elevation: Default to minimum permissions",
        explanation: "STRIDE methodology ensures comprehensive threat coverage",
      },
      {
        exerciseNumber: 3,
        scenario:
          "Configure security scanning in GitHub Actions CI/CD pipeline.",
        template:
          "name: Security Scan\n\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      \n      # Dependency scanning\n      - name: __NPM_AUDIT__\n        run: npm audit --audit-level=__HIGH__\n      \n      # Secret scanning\n      - name: Secret Scan\n        uses: __TRUFFLESECURITY/TRUFFLEHOG__@main\n      \n      # SAST scanning\n      - name: Semgrep\n        uses: returntocorp/semgrep-action@v1\n        with:\n          config: __AUTO__\n      \n      # Container scanning\n      - name: Build image\n        run: docker build -t myapp:${{ github.sha }} .\n      \n      - name: Scan image\n        uses: aquasecurity/__TRIVY__-action@master\n        with:\n          image-ref: myapp:${{ github.sha }}\n          severity: __CRITICAL,HIGH__\n          exit-code: __1__ # Fail on vulnerabilities",
        blanks: [
          {
            id: "NPM_AUDIT",
            label: "NPM_AUDIT",
            hint: "Dependency vulnerability check",
            correctValue: "npm audit",
            validationPattern: "npm.*audit",
          },
          {
            id: "HIGH",
            label: "HIGH",
            hint: "Severity threshold",
            correctValue: "high",
            validationPattern: "high|critical",
          },
          {
            id: "TRUFFLESECURITY/TRUFFLEHOG",
            label: "TRUFFLESECURITY/TRUFFLEHOG",
            hint: "Secret scanning action",
            correctValue: "trufflesecurity/trufflehog",
            validationPattern: "truffle.*hog",
          },
          {
            id: "AUTO",
            label: "AUTO",
            hint: "Automatic rule detection",
            correctValue: "auto",
            validationPattern: "auto",
          },
          {
            id: "TRIVY",
            label: "TRIVY",
            hint: "Container scanner",
            correctValue: "trivy",
            validationPattern: "trivy",
          },
          {
            id: "CRITICAL,HIGH",
            label: "CRITICAL,HIGH",
            hint: "Severity levels",
            correctValue: "CRITICAL,HIGH",
            validationPattern: "critical.*high|high.*critical",
          },
          {
            id: "1",
            label: "1",
            hint: "Exit code to fail pipeline",
            correctValue: "1",
            validationPattern: "1",
          },
        ],
        solution:
          "Complete security pipeline:\n1. npm audit checks dependencies\n2. TruffleHog scans for secrets\n3. Semgrep performs SAST\n4. Trivy scans container images\nAll integrated into CI/CD to catch issues before production",
        explanation:
          "Multi-layered security scanning in CI/CD catches vulnerabilities early",
      },
      {
        exerciseNumber: 4,
        scenario: "Implement security headers in web application.",
        template:
          "Express.js middleware:\n\nconst helmet = require('__HELMET__');\napp.use(helmet());\n\n// Custom headers\napp.use((req, res, next) => {\n  // Prevent clickjacking\n  res.setHeader('X-Frame-Options', '__DENY__');\n  \n  // Prevent MIME sniffing\n  res.setHeader('__X_CONTENT_TYPE_OPTIONS__', 'nosniff');\n  \n  // Enable HSTS (force HTTPS)\n  res.setHeader('Strict-Transport-Security', 'max-age=__31536000__; includeSubDomains');\n  \n  // Content Security Policy\n  res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self' '__UNSAFE_INLINE__'; style-src 'self' 'unsafe-inline'\");\n  \n  next();\n});\n\nVerify:\ncurl -I https://myapp.com | grep -E \"(__X_FRAME__|Content-Security|Strict-Transport)\"",
        blanks: [
          {
            id: "HELMET",
            label: "HELMET",
            hint: "Security headers middleware",
            correctValue: "helmet",
            validationPattern: "helmet",
          },
          {
            id: "DENY",
            label: "DENY",
            hint: "Block all framing",
            correctValue: "DENY",
            validationPattern: "deny|sameorigin",
          },
          {
            id: "X_CONTENT_TYPE_OPTIONS",
            label: "X_CONTENT_TYPE_OPTIONS",
            hint: "Header name",
            correctValue: "X-Content-Type-Options",
            validationPattern: "x.*content.*type",
          },
          {
            id: "31536000",
            label: "31536000",
            hint: "Seconds in one year",
            correctValue: "31536000",
            validationPattern: "31536000|year",
          },
          {
            id: "UNSAFE_INLINE",
            label: "UNSAFE_INLINE",
            hint: "Allow inline scripts (not recommended)",
            correctValue: "unsafe-inline",
            validationPattern: "unsafe.*inline",
          },
          {
            id: "X_FRAME",
            label: "X_FRAME",
            hint: "Clickjacking protection header",
            correctValue: "X-Frame",
            validationPattern: "x.*frame",
          },
        ],
        solution:
          "const helmet = require('helmet');\napp.use(helmet());\n\nres.setHeader('X-Frame-Options', 'DENY');\nres.setHeader('X-Content-Type-Options', 'nosniff');\nres.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');\nres.setHeader('Content-Security-Policy', \"default-src 'self'\");",
        explanation:
          "Security headers protect against XSS, clickjacking, MITM attacks",
      },
      {
        exerciseNumber: 5,
        scenario: "Create IAM policy following least privilege principle.",
        template:
          'IAM Policy for S3 access:\n\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "__ALLOW__",\n      "Action": [\n        "s3:__GET_OBJECT__",\n        "s3:PutObject"\n      ],\n      "Resource": "arn:aws:s3:::my-app-bucket/__UPLOADS/*__",\n      "Condition": {\n        "IpAddress": {\n          "aws:SourceIp": "__10.0.0.0/16__"\n        }\n      }\n    },\n    {\n      "Effect": "__DENY__",\n      "Action": "s3:*",\n      "Resource": "arn:aws:s3:::my-app-bucket/__ADMIN__/*"\n    }\n  ]\n}\n\nPrinciples applied:\n- __LEAST_PRIVILEGE__: Only required actions\n- __RESOURCE_SCOPING__: Specific bucket/prefix\n- Condition: __IP_RESTRICTION__\n- Explicit __DENY__ for sensitive paths',
        blanks: [
          {
            id: "ALLOW",
            label: "ALLOW",
            hint: "Grant permission",
            correctValue: "Allow",
            validationPattern: "allow",
          },
          {
            id: "GET_OBJECT",
            label: "GET_OBJECT",
            hint: "Read object action",
            correctValue: "GetObject",
            validationPattern: "get.*object",
          },
          {
            id: "UPLOADS/*",
            label: "UPLOADS/*",
            hint: "Path prefix for uploads",
            correctValue: "uploads/*",
            validationPattern: "uploads",
          },
          {
            id: "10.0.0.0/16",
            label: "10.0.0.0/16",
            hint: "VPC CIDR",
            correctValue: "10.0.0.0/16",
            validationPattern: "10\\.0\\.0\\.0",
          },
          {
            id: "DENY",
            label: "DENY",
            hint: "Block access",
            correctValue: "Deny",
            validationPattern: "deny",
          },
          {
            id: "ADMIN",
            label: "ADMIN",
            hint: "Restricted path",
            correctValue: "admin",
            validationPattern: "admin|config",
          },
          {
            id: "LEAST_PRIVILEGE",
            label: "LEAST_PRIVILEGE",
            hint: "Security principle",
            correctValue: "least privilege",
            validationPattern: "least.*privilege",
          },
          {
            id: "RESOURCE_SCOPING",
            label: "RESOURCE_SCOPING",
            hint: "Limit to specific resources",
            correctValue: "resource scoping",
            validationPattern: "resource|scop",
          },
          {
            id: "IP_RESTRICTION",
            label: "IP_RESTRICTION",
            hint: "Network-based control",
            correctValue: "IP restriction",
            validationPattern: "ip|network",
          },
          {
            id: "DENY",
            label: "DENY",
            hint: "Explicit block",
            correctValue: "deny",
            validationPattern: "deny",
          },
        ],
        solution:
          "Least privilege IAM policy:\n- Only GetObject and PutObject (not DeleteObject)\n- Scoped to specific bucket and prefix\n- IP-restricted to VPC\n- Explicit deny for admin paths\nNever grant s3:* or AdministratorAccess",
        explanation:
          "Least privilege minimizes blast radius if credentials are compromised",
      },
    ],
    hints: [
      "Shift-left: Catch security issues in development, not production",
      "Use multiple security scanning tools - they catch different issues",
      "Automate security checks in CI/CD to prevent vulnerabilities from deploying",
      "Security headers are free protection - always use them",
      "Default to deny, explicitly allow only what's needed",
    ],
  },

  runGuided: {
    objective:
      "Build comprehensive DevSecOps pipeline with security integrated at every stage",
    conceptualGuidance: [
      "Design security-first CI/CD pipeline architecture",
      "Choose security tools: SAST (Semgrep), DAST (OWASP ZAP), SCA (Snyk/Trivy), secret scanning",
      "Implement pre-commit hooks to prevent secrets and vulnerable code",
      "Configure automated security scanning in CI/CD with fail-fast on critical issues",
      "Set up container image scanning and signing",
      "Implement security policies as code (OPA, Kyverno)",
      "Configure runtime security monitoring",
      "Create incident response runbooks",
      "Document security controls and compliance mappings",
    ],
    keyConceptsToApply: [
      "Shift-left security philosophy",
      "Defense in depth (multiple security layers)",
      "Least privilege access control",
      "Immutable infrastructure",
      "Security as code",
    ],
    checkpoints: [
      {
        checkpoint: "Security tools integrated in development",
        description: "Developers have security feedback before commit",
        validationCriteria: [
          "Pre-commit hooks installed (secrets, linting)",
          "IDE security plugins configured",
          "Local SAST scanning available",
          "Dependency vulnerability alerts enabled",
          "Developers trained on security tools",
        ],
        hintIfStuck:
          "Install detect-secrets, ESLint security plugin, Snyk CLI. Create pre-commit hook that blocks secrets. Add VS Code extensions for security linting.",
      },
      {
        checkpoint: "Automated security scanning in CI/CD",
        description: "Every commit triggers comprehensive security checks",
        validationCriteria: [
          "SAST scanning (Semgrep or SonarQube) on every commit",
          "Dependency vulnerability scanning (npm audit, Snyk)",
          "Secret scanning (TruffleHog, GitLeaks)",
          "Container image scanning (Trivy, Grype)",
          "Pipeline fails on critical/high severity issues",
          "Security scan results published to dashboard",
        ],
        hintIfStuck:
          "GitHub Actions: Add jobs for npm audit, Semgrep, TruffleHog, Trivy. Use continue-on-error: false to fail pipeline. Store results as artifacts.",
      },
      {
        checkpoint: "Security policies enforced as code",
        description: "Automated policy enforcement in Kubernetes",
        validationCriteria: [
          "Pod Security Standards enforced (restricted profile)",
          "Network policies isolate workloads",
          "OPA or Kyverno policies deployed",
          "Admission controller blocks non-compliant resources",
          "Policy violations logged and alerted",
        ],
        hintIfStuck:
          "Install Kyverno. Create policies: require non-root containers, deny privileged pods, require resource limits, enforce image signatures. Test with kubectl apply.",
      },
    ],
    resourcesAllowed: [
      "OWASP Top 10 documentation",
      "STRIDE threat modeling guide",
      "Tool documentation (Semgrep, Trivy, Kyverno)",
      "CIS Benchmarks for security baselines",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready DevSecOps platform with comprehensive security controls, automated scanning, and incident response capabilities",
    successCriteria: [
      "Shift-left security: Pre-commit hooks, IDE plugins, local scanning tools for developers",
      "Automated CI/CD security: SAST, DAST, SCA, secret scanning, container scanning all integrated",
      "Policy as code: Kubernetes admission policies (OPA/Kyverno) enforcing security standards",
      "Least privilege IAM: All services use specific roles, no wildcards, condition-based access",
      "Security headers: All web applications protected with CSP, HSTS, X-Frame-Options",
      "Container security: Image scanning, signing, non-root users, read-only filesystems",
      "Secrets management: External secrets operator or Vault, no hardcoded credentials",
      "Audit logging: All security events logged with tamper-proof storage",
      "Incident response: Documented runbooks, tested procedures, automated containment",
      "Compliance documentation: Controls mapped to frameworks (SOC2, ISO27001, PCI-DSS)",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Security scanning in CI/CD (at least SAST and dependency scanning)",
      "Container image scanning blocking vulnerable images",
      "Secrets not in code or containers",
    ],
    evaluationRubric: [
      {
        criterion: "Shift-Left Implementation",
        weight: 25,
        passingThreshold:
          "Developers have security tools integrated in workflow. Pre-commit hooks block secrets and dangerous code. IDE shows security issues in real-time. Local scanning available. Security issues found before code review.",
      },
      {
        criterion: "Automated Security Pipeline",
        weight: 30,
        passingThreshold:
          "Comprehensive scanning: SAST, DAST, SCA, secrets, containers all integrated. Pipeline fails on high/critical issues. Results dashboarded. Scan time <5 minutes. False positive rate managed.",
      },
      {
        criterion: "Security Policy Enforcement",
        weight: 25,
        passingThreshold:
          "Policy as code deployed (OPA/Kyverno). Pod Security Standards enforced. Network segmentation via policies. Non-compliant resources automatically rejected. Policies version controlled and tested.",
      },
      {
        criterion: "Operational Security",
        weight: 20,
        passingThreshold:
          "Least privilege access enforced. Secrets managed externally. Audit logging comprehensive. Incident response tested. Security metrics tracked. Compliance documented.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=J73MELGF6u0",
  documentation: [
    "https://owasp.org/www-project-top-ten/",
    "https://owasp.org/www-community/Threat_Modeling",
    "https://microsoft.github.io/code-with-engineering-playbook/security/threat-modelling/",
    "https://semgrep.dev/docs/",
    "https://github.com/aquasecurity/trivy",
    "https://www.openpolicyagent.org/docs/latest/",
    "https://kyverno.io/docs/",
  ],
  relatedConcepts: [
    "OWASP Top 10 vulnerabilities",
    "STRIDE threat modeling",
    "Zero Trust architecture",
    "Supply chain security (SLSA)",
    "Security policy as code",
    "Runtime security monitoring",
  ],
};

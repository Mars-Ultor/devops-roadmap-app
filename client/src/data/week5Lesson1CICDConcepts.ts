/**
 * Week 5 Lesson 1 - CI/CD Concepts
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week5Lesson1CICDConcepts: LeveledLessonContent = {
  lessonId: "week5-lesson1-cicd-concepts",

  baseLesson: {
    title: "CI/CD Fundamentals: Continuous Integration & Continuous Delivery",
    description:
      "Understand CI/CD principles, benefits, and how they transform software delivery.",
    learningObjectives: [
      "Explain Continuous Integration and its benefits",
      "Understand Continuous Delivery vs Continuous Deployment",
      "Identify components of a CI/CD pipeline",
      "Recognize when CI/CD adds value to development workflow",
    ],
    prerequisites: [
      "Git version control basics",
      "Understanding of software development lifecycle",
      "Basic knowledge of testing concepts",
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20,
    },
  },

  crawl: {
    introduction:
      "Learn CI/CD step-by-step: problems it solves, core concepts, pipeline stages, and business value.",
    steps: [
      {
        stepNumber: 1,
        instruction: "The problem: Manual integration hell",
        command:
          'Traditional workflow:\n- Developers work in isolation for weeks\n- Integration happens right before release\n- Merge conflicts everywhere\n- "Works on my machine" but fails on server\n- Testing done manually, takes days\n- Release process takes hours, high failure rate',
        explanation:
          "Before CI/CD: Long development cycles, infrequent integration, manual testing, risky deployments. Integration happens late, conflicts are massive. Testing is slow and incomplete. Releases are stressful events.",
        expectedOutput:
          "Understanding: Manual processes lead to integration problems, slow feedback, and risky releases.",
        validationCriteria: [
          "See pain of infrequent integration",
          "Understand manual testing limitations",
          "Recognize deployment risk and stress",
          "Want faster, safer release process",
        ],
        commonMistakes: [
          "Thinking integration hell is normal (it's not with CI/CD)",
          "Believing manual testing is thorough enough (humans miss things)",
          "Accepting slow release cycles (CI/CD enables daily/hourly releases)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Continuous Integration (CI): Integrate code frequently",
        command:
          "CI workflow:\n1. Developer commits code to main branch (multiple times per day)\n2. Automated build triggers immediately\n3. Automated tests run (unit, integration)\n4. Team gets immediate feedback (pass/fail)\n5. If fails, fix immediately (within minutes, not days)",
        explanation:
          "CI = integrate code constantly (many times per day). Every commit triggers automated build and tests. Fast feedback loop. Problems caught early when easy to fix. No integration hell.",
        expectedOutput:
          "Understanding: CI provides rapid feedback on code quality through automated builds and tests.",
        validationCriteria: [
          "Commits trigger automatic builds",
          "Tests run on every commit",
          "Feedback within minutes",
          "Problems fixed immediately",
          "Integration happens continuously, not at end",
        ],
        commonMistakes: [
          "Only integrating before release (defeats CI purpose)",
          "Skipping tests to save time (removes safety net)",
          "Ignoring build failures (accumulates problems)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "CI Benefits: Fast feedback and reduced risk",
        command:
          "Benefits:\n- Early bug detection (catch issues within minutes, not weeks)\n- Smaller changesets (easier to review, debug, rollback)\n- Reduced integration complexity (no massive merge conflicts)\n- Increased confidence (tests validate every change)\n- Faster time to market (continuous validation enables rapid releases)",
        explanation:
          "CI finds bugs immediately while context is fresh. Small changes are easier to understand and fix. Continuous integration prevents conflict accumulation. Automated tests give confidence. Team can release anytime.",
        expectedOutput:
          "Understanding: CI reduces risk and accelerates development through automation and fast feedback.",
        validationCriteria: [
          "Bugs found early (cheap to fix)",
          "Small commits (manageable)",
          "No integration nightmares",
          "Confidence from automated tests",
          "Release-ready code always",
        ],
        commonMistakes: [
          'Skipping CI for "small" projects (even small projects benefit)',
          "Not maintaining test suite (CI useless without good tests)",
          "Treating CI as optional (defeats purpose)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Continuous Delivery (CD): Always ready to deploy",
        command:
          "CD workflow:\n1. Code passes CI (build + tests)\n2. Automated deployment to staging environment\n3. Additional testing (performance, security, smoke tests)\n4. Artifact ready for production\n5. Manual approval triggers production deployment",
        explanation:
          "Continuous Delivery = code is always in deployable state. Every change that passes tests can go to production. Deployment is automated but gated by manual approval. Reduces deployment risk.",
        expectedOutput:
          "Understanding: CD automates deployment pipeline but retains manual control over production releases.",
        validationCriteria: [
          "Automated deployment to staging",
          "Code always production-ready",
          "Manual gate before production",
          "Deployment is push-button simple",
          "Can release anytime business wants",
        ],
        commonMistakes: [
          "Confusing Delivery with Deployment (Delivery has manual gate)",
          "Only automating part of pipeline (leaves manual bottlenecks)",
          "Not testing in production-like environment",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Continuous Deployment: Fully automated to production",
        command:
          "CD workflow:\n1. Code passes CI (build + tests)\n2. Automated deployment to staging\n3. Automated testing in staging\n4. Automatic deployment to production (no manual approval)\n5. Monitoring detects issues, automatic rollback if needed",
        explanation:
          "Continuous Deployment = every commit that passes tests goes to production automatically. No manual gate. Ultimate speed. Requires excellent test coverage, monitoring, and rollback capability. Not for everyone.",
        expectedOutput:
          "Understanding: Continuous Deployment removes manual approval for maximum speed but requires maturity.",
        validationCriteria: [
          "Fully automated to production",
          "No manual approval needed",
          "Requires comprehensive test suite",
          "Needs robust monitoring and rollback",
          "Multiple deployments per day possible",
        ],
        commonMistakes: [
          "Trying Continuous Deployment too early (need mature practices first)",
          "Skipping monitoring (can't detect production issues)",
          "No rollback plan (stuck when deployment breaks)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "CI/CD Pipeline stages",
        command:
          "Typical pipeline:\n1. Source: Code commit triggers pipeline\n2. Build: Compile code, build Docker image\n3. Test: Unit tests, integration tests, linting\n4. Security: Vulnerability scanning, dependency checks\n5. Stage: Deploy to staging environment\n6. Test (stage): Smoke tests, performance tests\n7. Production: Deploy to production (manual or automatic)\n8. Monitor: Track metrics, logs, errors",
        explanation:
          "Pipeline = automated workflow from code to production. Each stage validates code. Failures stop pipeline. Artifacts move through stages. Each stage increases confidence. Monitoring provides feedback loop.",
        expectedOutput:
          "Understanding: CI/CD pipeline automates validation stages from commit to production.",
        validationCriteria: [
          "Each stage has purpose (build, test, deploy)",
          "Stages run automatically",
          "Failure stops pipeline (safety)",
          "Artifacts promoted through stages",
          "Monitoring closes feedback loop",
        ],
        commonMistakes: [
          "Skipping stages to save time (removes safety checks)",
          "Long-running pipelines (slow feedback)",
          "Not failing fast (waste time on broken builds)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Automated Testing: Foundation of CI/CD",
        command:
          "Test pyramid:\n- Unit tests (fast, many): Test individual functions\n- Integration tests (medium, some): Test components together\n- End-to-end tests (slow, few): Test full user workflows\n\nAll run automatically in pipeline. Fast feedback. High confidence.",
        explanation:
          "CI/CD depends on automated tests. Unit tests run in seconds. Integration tests validate interactions. E2E tests verify user experience. More unit tests than E2E (speed vs coverage). All must pass for deployment.",
        expectedOutput:
          "Understanding: Automated tests at multiple levels provide fast, comprehensive validation.",
        validationCriteria: [
          "Unit tests are fast and plentiful",
          "Integration tests validate connections",
          "E2E tests verify user workflows",
          "Test pyramid shape (many unit, few E2E)",
          "All tests automated in pipeline",
        ],
        commonMistakes: [
          "Only manual testing (too slow for CI/CD)",
          "Too many E2E tests (pipeline becomes slow)",
          "Flaky tests (erodes confidence, ignored failures)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Artifact management: Build once, deploy many times",
        command:
          "Build process:\n1. Build artifact (JAR, Docker image, zip file)\n2. Tag with version (1.2.3 or git commit SHA)\n3. Store in artifact repository (Docker Hub, Nexus, S3)\n4. Deploy same artifact to staging, then production\n\nNever rebuild for different environments (inconsistent)",
        explanation:
          "Build once principle: Same artifact through all environments. Guarantees staging and production run identical code. Version tagging enables rollback. Artifact repo provides audit trail.",
        expectedOutput:
          "Understanding: Build artifacts once, deploy everywhere for consistency.",
        validationCriteria: [
          "Artifact built in CI pipeline",
          "Tagged with immutable version",
          "Stored in registry/repository",
          "Same artifact deployed to all environments",
          "No rebuilding for different stages",
        ],
        commonMistakes: [
          "Rebuilding for each environment (can introduce differences)",
          "No version tagging (can't track what's deployed)",
          "Not storing artifacts (can't rollback)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Infrastructure as Code in CI/CD",
        command:
          "Infrastructure changes:\n1. Update Terraform/CloudFormation code\n2. CI pipeline validates syntax\n3. Plan shows changes\n4. Apply to staging environment\n5. Test infrastructure works\n6. Apply to production (manual or automatic)\n\nInfrastructure changes go through same pipeline as application code",
        explanation:
          "IaC enables version-controlled infrastructure. CI/CD pipeline validates infrastructure changes. Same rigor for servers as for code. Prevents configuration drift. Enables reproducible environments.",
        expectedOutput:
          "Understanding: Infrastructure changes flow through CI/CD pipeline like application code.",
        validationCriteria: [
          "Infrastructure defined as code",
          "Changes validated in pipeline",
          "Testing in non-prod environments",
          "Version control for infrastructure",
          "Automated, reproducible deployments",
        ],
        commonMistakes: [
          "Manual infrastructure changes (bypass CI/CD)",
          "Not testing infrastructure code (breaks production)",
          "No rollback plan for infrastructure",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Blue-Green Deployments: Zero-downtime releases",
        command:
          "Blue-Green strategy:\n1. Blue (current production) serving traffic\n2. Deploy new version to Green (idle environment)\n3. Test Green thoroughly\n4. Switch router to Green (instant cutover)\n5. Blue becomes idle (instant rollback available)\n\nNo downtime. Instant rollback.",
        explanation:
          "Two identical production environments. Deploy to idle one. Switch traffic instantly. Old version still running for instant rollback. Zero downtime. Low risk. Requires double infrastructure.",
        expectedOutput:
          "Understanding: Blue-Green deployments enable zero-downtime releases with instant rollback.",
        validationCriteria: [
          "Two production environments",
          "Deploy to idle environment",
          "Test before switching traffic",
          "Instant cutover (load balancer switch)",
          "Previous version ready for rollback",
        ],
        commonMistakes: [
          "Database schema changes (can break blue-green)",
          "Not testing green thoroughly (defeats purpose)",
          "Shared state between blue and green (creates issues)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Canary Deployments: Gradual rollout",
        command:
          "Canary strategy:\n1. Deploy new version to small subset (5% of servers)\n2. Monitor metrics (errors, latency, business KPIs)\n3. If healthy, gradually increase (10%, 25%, 50%, 100%)\n4. If issues detected, rollback immediately\n\nReduces blast radius of bad deployments.",
        explanation:
          "Canary = test new version on small percentage of users first. Monitor carefully. Gradual rollout limits impact of bugs. Can rollback affecting only small percentage. Requires robust monitoring.",
        expectedOutput:
          "Understanding: Canary deployments reduce risk by gradually rolling out changes.",
        validationCriteria: [
          "Gradual percentage rollout",
          "Monitoring at each stage",
          "Automatic or manual progression",
          "Quick rollback if issues",
          "Limited blast radius",
        ],
        commonMistakes: [
          "Insufficient monitoring (can't detect canary issues)",
          "Rolling out too fast (defeats purpose)",
          "Not having rollback automation (canary becomes risky)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "CI/CD Metrics: Measure DevOps performance",
        command:
          "Key metrics (DORA metrics):\n- Deployment Frequency: How often you deploy (elite: multiple per day)\n- Lead Time for Changes: Commit to production (elite: <1 hour)\n- Mean Time to Recovery (MTTR): How fast you fix issues (elite: <1 hour)\n- Change Failure Rate: % of deployments causing failures (elite: 0-15%)\n\nTrack to measure CI/CD effectiveness",
        explanation:
          "DORA metrics measure software delivery performance. Elite teams deploy frequently, with short lead times, quick recovery, and low failure rates. CI/CD enables these metrics. Track and improve continuously.",
        expectedOutput:
          "Understanding: DORA metrics quantify CI/CD effectiveness and delivery performance.",
        validationCriteria: [
          "Deployment frequency increases",
          "Lead time decreases",
          "MTTR decreases",
          "Change failure rate is low",
          "Metrics tracked over time",
        ],
        commonMistakes: [
          "Not measuring (can't improve what you don't measure)",
          "Optimizing only one metric (need balanced improvement)",
          "Gaming metrics (defeats learning purpose)",
        ],
      },
    ],
    expectedOutcome:
      "You understand CI/CD principles, benefits, pipeline stages, testing strategies, deployment approaches (blue-green, canary), and DORA metrics. You can explain when CI/CD adds value and what infrastructure it requires.",
  },

  walk: {
    introduction: "Apply CI/CD concepts through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Your team releases quarterly with manual testing. Design CI/CD transformation.",
        template:
          "Current state: __MANUAL_TESTING__, __QUARTERLY__ releases, __INTEGRATION_HELL__\nCI/CD solution:\n1. Implement __AUTOMATED_TESTS__ (unit, integration, E2E)\n2. Set up __CI_PIPELINE__ (build, test on every commit)\n3. __STAGING__ environment for pre-production testing\n4. Automated deployment with __MANUAL_APPROVAL__\n5. Target: __WEEKLY__ releases initially, then daily\n\nResult: Faster feedback, __REDUCED_RISK__, higher quality",
        blanks: [
          {
            id: "MANUAL_TESTING",
            label: "MANUAL_TESTING",
            hint: "Slow, error-prone",
            correctValue: "Manual testing",
            validationPattern: ".*(manual|hand).*",
          },
          {
            id: "QUARTERLY",
            label: "QUARTERLY",
            hint: "Every 3 months",
            correctValue: "Quarterly",
            validationPattern: ".*(quarter|3.*month).*",
          },
          {
            id: "INTEGRATION_HELL",
            label: "INTEGRATION_HELL",
            hint: "Merge conflicts, late integration",
            correctValue: "Integration hell",
            validationPattern: ".*(integration.*hell|conflict).*",
          },
          {
            id: "AUTOMATED_TESTS",
            label: "AUTOMATED_TESTS",
            hint: "Fast, reliable validation",
            correctValue: "automated tests",
            validationPattern: ".*(automat.*test).*",
          },
          {
            id: "CI_PIPELINE",
            label: "CI_PIPELINE",
            hint: "Continuous Integration",
            correctValue: "CI pipeline",
            validationPattern: ".*(CI|continuous.*integration|pipeline).*",
          },
          {
            id: "STAGING",
            label: "STAGING",
            hint: "Pre-production environment",
            correctValue: "staging",
            validationPattern: ".*(staging|pre.*prod).*",
          },
          {
            id: "MANUAL_APPROVAL",
            label: "MANUAL_APPROVAL",
            hint: "Human gate for production",
            correctValue: "manual approval",
            validationPattern: ".*(manual.*approv|gate).*",
          },
          {
            id: "WEEKLY",
            label: "WEEKLY",
            hint: "Much more frequent",
            correctValue: "weekly",
            validationPattern: ".*(week|7.*day).*",
          },
          {
            id: "REDUCED_RISK",
            label: "REDUCED_RISK",
            hint: "Smaller changes, automated validation",
            correctValue: "reduced risk",
            validationPattern: ".*(reduc.*risk|lower.*risk|safe).*",
          },
        ],
        solution:
          "Current state: Manual testing, Quarterly releases, Integration hell\nCI/CD solution:\n1. Implement automated tests (unit, integration, E2E)\n2. Set up CI pipeline (build, test on every commit)\n3. Staging environment for pre-production testing\n4. Automated deployment with manual approval\n5. Target: Weekly releases initially, then daily\n\nResult: Faster feedback, reduced risk, higher quality",
        explanation:
          "CI/CD transformation: Automate testing and deployment, increase release frequency, reduce risk through smaller changes.",
      },
      {
        exerciseNumber: 2,
        scenario: "Compare Continuous Delivery vs Continuous Deployment.",
        template:
          "Continuous __DELIVERY__:\n- Automated pipeline to __STAGING__\n- __MANUAL__ approval for production\n- Deploy when __BUSINESS__ decides\n- Lower risk (human review)\n\nContinuous __DEPLOYMENT__:\n- Fully __AUTOMATED__ to production\n- No manual approval (passes tests → deploys)\n- __MULTIPLE__ deployments per day\n- Requires excellent __TESTS__ and __MONITORING__",
        blanks: [
          {
            id: "DELIVERY",
            label: "DELIVERY",
            hint: "Manual gate exists",
            correctValue: "Delivery",
            validationPattern: "^[Dd]elivery$",
          },
          {
            id: "STAGING",
            label: "STAGING",
            hint: "Pre-production",
            correctValue: "staging",
            validationPattern: ".*(staging|pre.*prod).*",
          },
          {
            id: "MANUAL",
            label: "MANUAL",
            hint: "Human approval",
            correctValue: "manual",
            validationPattern: ".*(manual|human).*",
          },
          {
            id: "BUSINESS",
            label: "BUSINESS",
            hint: "Product managers decide",
            correctValue: "business",
            validationPattern: ".*(business|product|stakeholder).*",
          },
          {
            id: "DEPLOYMENT",
            label: "DEPLOYMENT",
            hint: "Fully automated",
            correctValue: "Deployment",
            validationPattern: "^[Dd]eployment$",
          },
          {
            id: "AUTOMATED",
            label: "AUTOMATED",
            hint: "No human intervention",
            correctValue: "automated",
            validationPattern: ".*(automat|automatic).*",
          },
          {
            id: "MULTIPLE",
            label: "MULTIPLE",
            hint: "Many times daily",
            correctValue: "multiple",
            validationPattern: ".*(multiple|many|several).*",
          },
          {
            id: "TESTS",
            label: "TESTS",
            hint: "Comprehensive test suite",
            correctValue: "tests",
            validationPattern: ".*(test|testing).*",
          },
          {
            id: "MONITORING",
            label: "MONITORING",
            hint: "Detect production issues",
            correctValue: "monitoring",
            validationPattern: ".*(monitor|observ).*",
          },
        ],
        solution:
          "Continuous Delivery:\n- Automated pipeline to staging\n- Manual approval for production\n- Deploy when business decides\n- Lower risk (human review)\n\nContinuous Deployment:\n- Fully automated to production\n- No manual approval (passes tests → deploys)\n- Multiple deployments per day\n- Requires excellent tests and monitoring",
        explanation:
          "Delivery has manual gate, Deployment is fully automated. Deployment requires higher maturity but enables maximum speed.",
      },
      {
        exerciseNumber: 3,
        scenario: "Design CI/CD pipeline stages for a web application.",
        template:
          "Pipeline stages:\n1. __SOURCE__: Git commit triggers pipeline\n2. __BUILD__: Compile code, create Docker image\n3. __TEST__: Unit tests, integration tests, __LINTING__\n4. __SECURITY__: Vulnerability scan, dependency check\n5. __STAGE_DEPLOY__: Deploy to staging environment\n6. __STAGE_TEST__: Smoke tests, __PERFORMANCE__ tests\n7. __PROD_DEPLOY__: Deploy to production (manual approval)\n8. __MONITOR__: Track errors, latency, metrics",
        blanks: [
          {
            id: "SOURCE",
            label: "SOURCE",
            hint: "Code checkout",
            correctValue: "Source",
            validationPattern: ".*(source|checkout|clone).*",
          },
          {
            id: "BUILD",
            label: "BUILD",
            hint: "Compile and package",
            correctValue: "Build",
            validationPattern: ".*(build|compile).*",
          },
          {
            id: "TEST",
            label: "TEST",
            hint: "Automated validation",
            correctValue: "Test",
            validationPattern: ".*(test).*",
          },
          {
            id: "LINTING",
            label: "LINTING",
            hint: "Code quality checks",
            correctValue: "linting",
            validationPattern: ".*(lint|style|quality).*",
          },
          {
            id: "SECURITY",
            label: "SECURITY",
            hint: "Security scanning",
            correctValue: "Security",
            validationPattern: ".*(security|vuln).*",
          },
          {
            id: "STAGE_DEPLOY",
            label: "STAGE_DEPLOY",
            hint: "Deploy to pre-prod",
            correctValue: "Stage Deploy",
            validationPattern: ".*(stage|staging).*",
          },
          {
            id: "STAGE_TEST",
            label: "STAGE_TEST",
            hint: "Test in staging",
            correctValue: "Stage Test",
            validationPattern: ".*(stage.*test|smoke).*",
          },
          {
            id: "PERFORMANCE",
            label: "PERFORMANCE",
            hint: "Load testing",
            correctValue: "performance",
            validationPattern: ".*(performance|load).*",
          },
          {
            id: "PROD_DEPLOY",
            label: "PROD_DEPLOY",
            hint: "Production deployment",
            correctValue: "Prod Deploy",
            validationPattern: ".*(prod|production).*",
          },
          {
            id: "MONITOR",
            label: "MONITOR",
            hint: "Observability",
            correctValue: "Monitor",
            validationPattern: ".*(monitor|observe).*",
          },
        ],
        solution:
          "Pipeline stages:\n1. Source: Git commit triggers pipeline\n2. Build: Compile code, create Docker image\n3. Test: Unit tests, integration tests, linting\n4. Security: Vulnerability scan, dependency check\n5. Stage Deploy: Deploy to staging environment\n6. Stage Test: Smoke tests, performance tests\n7. Prod Deploy: Deploy to production (manual approval)\n8. Monitor: Track errors, latency, metrics",
        explanation:
          "Complete pipeline validates code through multiple stages before production deployment.",
      },
      {
        exerciseNumber: 4,
        scenario: "Choose deployment strategy for different scenarios.",
        template:
          "E-commerce site (no downtime allowed): __BLUE_GREEN__ deployment\nSocial media app (gradual rollout): __CANARY__ deployment\nInternal tool (downtime acceptable): __ROLLING__ or simple deployment\nDatabase schema change: __BACKWARD_COMPATIBLE__ migrations first",
        blanks: [
          {
            id: "BLUE_GREEN",
            label: "BLUE_GREEN",
            hint: "Two environments, instant switch",
            correctValue: "Blue-Green",
            validationPattern: ".*(blue.*green|zero.*downtime).*",
          },
          {
            id: "CANARY",
            label: "CANARY",
            hint: "Gradual percentage rollout",
            correctValue: "Canary",
            validationPattern: ".*(canary|gradual).*",
          },
          {
            id: "ROLLING",
            label: "ROLLING",
            hint: "Update servers one by one",
            correctValue: "Rolling",
            validationPattern: ".*(rolling|sequential).*",
          },
          {
            id: "BACKWARD_COMPATIBLE",
            label: "BACKWARD_COMPATIBLE",
            hint: "Works with old and new code",
            correctValue: "backward-compatible",
            validationPattern: ".*(backward.*compat|compat).*",
          },
        ],
        solution:
          "E-commerce site (no downtime allowed): Blue-Green deployment\nSocial media app (gradual rollout): Canary deployment\nInternal tool (downtime acceptable): Rolling or simple deployment\nDatabase schema change: Backward-compatible migrations first",
        explanation:
          "Choose deployment strategy based on downtime tolerance, risk appetite, and infrastructure constraints.",
      },
      {
        exerciseNumber: 5,
        scenario: "Calculate DORA metrics for your team.",
        template:
          "Current metrics:\n- __DEPLOYMENT_FREQUENCY__: Once per month\n- __LEAD_TIME__: 2 weeks (commit to production)\n- __MTTR__: 4 hours (mean time to recovery)\n- __CHANGE_FAILURE_RATE__: 30% (deployments cause issues)\n\nTarget (after CI/CD):\n- Deployment Frequency: __DAILY__\n- Lead Time: __<1_HOUR__\n- MTTR: __<1_HOUR__\n- Change Failure Rate: __<15%__",
        blanks: [
          {
            id: "DEPLOYMENT_FREQUENCY",
            label: "DEPLOYMENT_FREQUENCY",
            hint: "How often you deploy",
            correctValue: "Deployment Frequency",
            validationPattern: ".*(deployment.*frequency|deploy.*freq).*",
          },
          {
            id: "LEAD_TIME",
            label: "LEAD_TIME",
            hint: "Time from commit to production",
            correctValue: "Lead Time",
            validationPattern: ".*(lead.*time).*",
          },
          {
            id: "MTTR",
            label: "MTTR",
            hint: "Recovery time",
            correctValue: "MTTR",
            validationPattern: ".*(MTTR|mean.*time.*recovery).*",
          },
          {
            id: "CHANGE_FAILURE_RATE",
            label: "CHANGE_FAILURE_RATE",
            hint: "Percentage of failed deployments",
            correctValue: "Change Failure Rate",
            validationPattern: ".*(change.*failure|failure.*rate).*",
          },
          {
            id: "DAILY",
            label: "DAILY",
            hint: "Every day",
            correctValue: "Daily",
            validationPattern: ".*(daily|day|multiple.*per.*day).*",
          },
          {
            id: "<1_HOUR",
            label: "<1_HOUR",
            hint: "Elite performance",
            correctValue: "<1 hour",
            validationPattern: ".*(<.*1.*hour|hour|minutes).*",
          },
        ],
        solution:
          "Current metrics:\n- Deployment Frequency: Once per month\n- Lead Time: 2 weeks (commit to production)\n- MTTR: 4 hours (mean time to recovery)\n- Change Failure Rate: 30% (deployments cause issues)\n\nTarget (after CI/CD):\n- Deployment Frequency: Daily\n- Lead Time: <1 hour\n- MTTR: <1 hour\n- Change Failure Rate: <15%",
        explanation:
          "DORA metrics measure software delivery performance. CI/CD dramatically improves all four metrics.",
      },
    ],
    hints: [
      "CI = integrate frequently, CD = deploy frequently",
      "Automate tests before automating deployment",
      "Blue-Green for zero downtime, Canary for gradual rollout",
      "DORA metrics measure CI/CD effectiveness",
    ],
  },

  runGuided: {
    objective:
      "Design complete CI/CD pipeline for a real application including all stages, testing, and deployment strategy",
    conceptualGuidance: [
      "Choose application (web app, API, microservice)",
      "Define pipeline stages: build, test, deploy, monitor",
      "Plan automated testing: unit, integration, E2E, security",
      "Select deployment strategy: blue-green, canary, or rolling",
      "Choose CI/CD tool: GitHub Actions, Jenkins, GitLab CI, CircleCI",
      "Design environment strategy: dev, staging, production",
      "Plan rollback procedures",
      "Define success criteria and metrics",
      "Consider security: secrets management, vulnerability scanning",
      "Document pipeline configuration and runbook",
    ],
    keyConceptsToApply: [
      "Pipeline stage design",
      "Automated testing strategy",
      "Deployment automation",
      "Environment management",
      "Monitoring and feedback loops",
    ],
    checkpoints: [
      {
        checkpoint: "Pipeline architecture designed",
        description: "Complete pipeline with all stages documented",
        validationCriteria: [
          "All stages defined (source, build, test, deploy, monitor)",
          "Testing strategy clear (unit, integration, E2E)",
          "Deployment strategy selected (blue-green, canary, etc.)",
          "Environment flow documented (dev → staging → prod)",
          "Rollback procedure defined",
        ],
        hintIfStuck:
          "Start simple: Source (git) → Build (Docker) → Test (pytest/jest) → Deploy to Staging → Manual approval → Deploy to Prod → Monitor (logs/metrics)",
      },
      {
        checkpoint: "Pipeline configuration created",
        description: "Actual CI/CD configuration file written",
        validationCriteria: [
          "Configuration file for chosen tool (e.g., .github/workflows/ci.yml)",
          "All stages implemented",
          "Tests execute automatically",
          "Deployment automated",
          "Secrets handled securely (not hardcoded)",
        ],
        hintIfStuck:
          "GitHub Actions example: on push → checkout code → build Docker image → run tests → push to registry → deploy to staging. Use GitHub secrets for credentials.",
      },
      {
        checkpoint: "Testing and documentation complete",
        description: "Pipeline tested and documented",
        validationCriteria: [
          "Pipeline runs successfully",
          "Tests pass",
          "Deployment works",
          "README documents pipeline stages",
          "Runbook for troubleshooting common issues",
        ],
        hintIfStuck:
          "Test by making commit. Watch pipeline execute. Document: what each stage does, how to view logs, how to manually trigger, how to rollback, troubleshooting common errors.",
      },
    ],
    resourcesAllowed: [
      "CI/CD tool documentation (GitHub Actions, Jenkins, etc.)",
      "Pipeline examples from similar projects",
      "DORA metrics resources",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready CI/CD pipeline with comprehensive testing, security scanning, multi-environment deployment, and monitoring",
    successCriteria: [
      "Complete pipeline configuration: Build, test, security scan, deploy stages",
      "Automated testing: Unit tests, integration tests, code coverage reporting",
      "Security integration: Dependency scanning, vulnerability checks, secret scanning",
      "Multi-environment: Separate dev, staging, production deployments with promotion strategy",
      "Deployment strategy: Blue-green or canary with health checks and rollback",
      "Secrets management: All sensitive data in environment variables or secret store",
      "Monitoring: Pipeline success/failure alerts, deployment notifications, application health checks",
      "Documentation: Pipeline architecture diagram, stage descriptions, troubleshooting guide",
      "DORA metrics: Track deployment frequency, lead time, MTTR, change failure rate",
      "Runbook: How to manually trigger, approve, rollback, debug failures",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Working CI/CD pipeline with build, test, deploy stages",
      "Automated tests running in pipeline",
      "Deployment to at least one environment",
    ],
    evaluationRubric: [
      {
        criterion: "Pipeline Completeness",
        weight: 30,
        passingThreshold:
          "All essential stages present: build, test, security, deploy, monitor. Stages execute automatically. Failures stop pipeline. Production-ready configuration.",
      },
      {
        criterion: "Quality Gates",
        weight: 25,
        passingThreshold:
          "Comprehensive automated testing. Security scanning integrated. Code quality checks (linting, coverage). Only quality code reaches production. Fast feedback (<10 minutes).",
      },
      {
        criterion: "Deployment Automation",
        weight: 25,
        passingThreshold:
          "Fully automated deployment. Health checks verify deployment success. Rollback procedure defined and tested. Zero-downtime strategy (blue-green or canary). Secrets managed securely.",
      },
      {
        criterion: "Operational Excellence",
        weight: 20,
        passingThreshold:
          "Monitoring and alerting configured. Documentation comprehensive. Runbook helps troubleshoot issues. DORA metrics tracked. Team can operate pipeline independently.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=scEDHsr3APg",
  documentation: [
    "https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment",
    "https://cloud.google.com/architecture/devops/devops-tech-continuous-integration",
    "https://dora.dev/",
    "https://martinfowler.com/articles/continuousIntegration.html",
  ],
  relatedConcepts: [
    "DevOps culture and practices",
    "Test-Driven Development (TDD)",
    "Infrastructure as Code",
    "GitOps deployment patterns",
    "Feature flags and dark launches",
    "Observability and monitoring",
  ],
};

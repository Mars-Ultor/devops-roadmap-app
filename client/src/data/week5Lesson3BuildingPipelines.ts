/**
 * Week 5 Lesson 3 - Building Complete CI/CD Pipelines
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week5Lesson3BuildingPipelines: LeveledLessonContent = {
  lessonId: "week5-lesson3-building-pipelines",

  baseLesson: {
    title: "Building Complete CI/CD Pipelines: From Commit to Production",
    description:
      "Design and implement end-to-end CI/CD pipelines with testing, deployment, and monitoring.",
    learningObjectives: [
      "Design multi-stage CI/CD pipelines",
      "Implement quality gates and testing stages",
      "Automate deployments with rollback capabilities",
      "Integrate monitoring and notifications",
      "Troubleshoot pipeline failures effectively",
    ],
    prerequisites: [
      "CI/CD concepts understanding",
      "GitHub Actions workflow creation",
      "Docker containerization",
      "Basic cloud deployment knowledge",
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 40,
      runGuided: 35,
      runIndependent: 30,
    },
  },

  crawl: {
    introduction:
      "Build complete CI/CD pipeline step-by-step: quality gates, testing stages, deployment automation, monitoring, and rollback procedures.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Design pipeline architecture: Stages and gates",
        command:
          "Pipeline architecture:\n\n1. SOURCE STAGE: Git push triggers pipeline\n2. BUILD STAGE: Compile code, create artifacts\n3. QUALITY GATES:\n   - Linting (code style)\n   - Unit tests (fast, comprehensive)\n   - Security scan (vulnerabilities)\n4. INTEGRATION STAGE:\n   - Build Docker image\n   - Integration tests\n   - Performance tests\n5. STAGING DEPLOYMENT: Auto-deploy to staging\n6. ACCEPTANCE TESTS: Smoke tests on staging\n7. PRODUCTION GATE: Manual approval\n8. PRODUCTION DEPLOYMENT: Blue-green or canary\n9. MONITORING: Health checks, metrics, alerts",
        explanation:
          "Pipeline has clear stages. Each stage validates code quality. Quality gates prevent bad code from advancing. Staging mirrors production. Manual approval for production. Monitoring provides feedback.",
        expectedOutput:
          "Understanding: Complete pipeline architecture from code commit to production monitoring.",
        validationCriteria: [
          "Each stage has clear purpose",
          "Quality gates catch issues early",
          "Staging tests before production",
          "Manual gate for production deployment",
          "Monitoring closes feedback loop",
        ],
        commonMistakes: [
          "Too many stages (slow feedback)",
          "Skipping quality gates (quality suffers)",
          "No staging environment (risky deployments)",
          "Missing monitoring (blind to production issues)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Implement linting stage: Code quality first",
        command:
          "cat > .github/workflows/pipeline.yml << 'EOF'\nname: CI/CD Pipeline\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  lint:\n    name: Code Quality\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      \n      - run: npm ci\n      \n      - name: ESLint\n        run: npm run lint\n      \n      - name: Prettier\n        run: npm run format:check\nEOF",
        explanation:
          "Linting runs first (fastest feedback). ESLint checks code quality. Prettier validates formatting. Fails fast if code doesn't meet standards. Forces developers to fix style issues before tests.",
        expectedOutput:
          "Linting stage catches code style issues immediately, before running slower tests.",
        validationCriteria: [
          "Linting runs on every push/PR",
          "ESLint configuration present",
          "Prettier configuration present",
          "Workflow fails on lint errors",
          "Fast feedback (< 1 minute)",
        ],
        commonMistakes: [
          "Running lint after tests (wastes time)",
          "Not caching dependencies (slow)",
          "Inconsistent lint rules (team confusion)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Add comprehensive testing stage",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  test:\n    name: Test Suite\n    needs: lint\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      \n      - run: npm ci\n      \n      - name: Unit Tests\n        run: npm run test:unit -- --coverage\n      \n      - name: Integration Tests\n        run: npm run test:integration\n      \n      - name: Upload coverage\n        uses: codecov/codecov-action@v3\n        with:\n          files: ./coverage/coverage-final.json\nEOF",
        explanation:
          "Test stage runs after lint passes (needs: lint). Unit tests run first (fast). Integration tests validate components work together. Coverage uploaded to Codecov for tracking. Gates prevent untested code from deploying.",
        expectedOutput:
          "Comprehensive testing with coverage reporting, preventing untested code from reaching production.",
        validationCriteria: [
          "Unit tests execute",
          "Integration tests execute",
          "Coverage report generated",
          "Coverage uploaded to service",
          "Failed tests fail pipeline",
        ],
        commonMistakes: [
          "Only unit tests (miss integration issues)",
          "Tests too slow (poor feedback time)",
          "Not tracking coverage (quality degrades over time)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Add security scanning stage",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  security:\n    name: Security Scan\n    needs: lint\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Run Snyk Security Scan\n        uses: snyk/actions/node@master\n        env:\n          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}\n      \n      - name: Dependency Review\n        uses: actions/dependency-review-action@v3\n        if: github.event_name == 'pull_request'\nEOF",
        explanation:
          "Security scans run in parallel with tests (both need: lint). Snyk checks for vulnerabilities in dependencies. Dependency Review checks new dependencies in PRs. Catches security issues before deployment.",
        expectedOutput:
          "Automated security scanning catches vulnerabilities before they reach production.",
        validationCriteria: [
          "Snyk scans dependencies",
          "Dependency review on PRs",
          "High-severity vulnerabilities fail pipeline",
          "Security reports accessible",
          "Runs in parallel with tests (fast)",
        ],
        commonMistakes: [
          "Not failing on high-severity issues (defeats purpose)",
          "Only scanning on main (should scan PRs too)",
          "Ignoring security scan results (accumulates risk)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Build and tag Docker image",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  build:\n    name: Build Docker Image\n    needs: [test, security]\n    runs-on: ubuntu-latest\n    outputs:\n      image-tag: ${{ steps.meta.outputs.tags }}\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Docker meta\n        id: meta\n        uses: docker/metadata-action@v5\n        with:\n          images: yourusername/app\n          tags: |\n            type=ref,event=branch\n            type=sha,prefix={{branch}}-\n      \n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_TOKEN }}\n      \n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: ${{ steps.meta.outputs.tags }}\n          cache-from: type=registry,ref=yourusername/app:latest\n          cache-to: type=inline\nEOF",
        explanation:
          "Build runs after tests and security pass. metadata-action generates semantic tags (branch name, git SHA). Docker layer caching speeds up builds. Image pushed to registry for deployment stages. Output makes tag available to deploy jobs.",
        expectedOutput:
          "Docker image built, tagged semantically, pushed to registry, ready for deployment.",
        validationCriteria: [
          "Image builds successfully",
          "Semantic tagging (branch, SHA)",
          "Pushed to registry",
          "Layer caching enabled",
          "Image tag passed to deploy jobs",
        ],
        commonMistakes: [
          "No semantic versioning (hard to track deployments)",
          "Not using cache (slow builds)",
          "Building separate images for staging/prod (inconsistency)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Deploy to staging automatically",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  deploy-staging:\n    name: Deploy to Staging\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    environment:\n      name: staging\n      url: https://staging.myapp.com\n    steps:\n      - name: Deploy to staging\n        run: |\n          echo \"Deploying ${{ needs.build.outputs.image-tag }}\"\n          # Update staging deployment (kubectl, helm, etc.)\n      \n      - name: Wait for deployment\n        run: sleep 30\n      \n      - name: Health check\n        run: |\n          curl -f https://staging.myapp.com/health || exit 1\nEOF",
        explanation:
          "Staging deployment runs after successful build. Only on main branch (if condition). Environment tracks deployment history. Health check validates deployment worked. Fails if staging is broken.",
        expectedOutput:
          "Automatic deployment to staging with health check validation.",
        validationCriteria: [
          "Deploys automatically after build",
          "Only deploys main branch",
          "Health check validates deployment",
          "Deployment history tracked",
          "URL accessible in GitHub UI",
        ],
        commonMistakes: [
          "No health check (broken deployments go unnoticed)",
          "Deploying every branch (staging chaos)",
          "Not waiting for deployment to complete (health check fails)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Run smoke tests on staging",
        command:
          'cat >> .github/workflows/pipeline.yml << \'EOF\'\n\n  smoke-tests:\n    name: Smoke Tests\n    needs: deploy-staging\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Install dependencies\n        run: npm ci\n      \n      - name: Run smoke tests\n        env:\n          TEST_URL: https://staging.myapp.com\n        run: npm run test:smoke\n      \n      - name: Performance check\n        run: |\n          response_time=$(curl -o /dev/null -s -w "%{time_total}" https://staging.myapp.com)\n          if (( $(echo "$response_time > 2.0" | bc -l) )); then\n            echo "Response time too slow: ${response_time}s"\n            exit 1\n          fi\nEOF',
        explanation:
          "Smoke tests validate critical user workflows work on staging. Performance check ensures app is responsive. Catches issues before production. Fails pipeline if staging broken.",
        expectedOutput:
          "Automated smoke tests validate staging deployment before production gate.",
        validationCriteria: [
          "Critical workflows tested",
          "Performance validated",
          "Tests run against staging URL",
          "Failures prevent production deployment",
          "Fast execution (< 5 minutes)",
        ],
        commonMistakes: [
          "Too many smoke tests (become slow integration tests)",
          "Not testing critical paths (miss important bugs)",
          "Hardcoding URLs (tests fail in different environments)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Production deployment with approval",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  deploy-production:\n    name: Deploy to Production\n    needs: [smoke-tests]\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    environment:\n      name: production\n      url: https://myapp.com\n    steps:\n      - name: Blue-Green Deployment\n        run: |\n          echo \"Deploying to green environment\"\n          # Deploy to idle environment\n          # Run health checks on green\n          # Switch traffic to green\n          # Keep blue as backup for rollback\n      \n      - name: Post-deployment verification\n        run: |\n          curl -f https://myapp.com/health\n          curl -f https://myapp.com/api/status\nEOF",
        explanation:
          "Production deployment requires manual approval (environment: production configured in GitHub settings). Blue-green strategy enables zero-downtime deployment. Health checks validate production. Old version kept for instant rollback.",
        expectedOutput:
          "Production deployment with manual approval gate and blue-green zero-downtime strategy.",
        validationCriteria: [
          "Manual approval required",
          "Zero-downtime deployment",
          "Health checks validate production",
          "Rollback capability preserved",
          "Deployment tracked in Environments",
        ],
        commonMistakes: [
          "No approval gate (accidental production deploys)",
          "Downtime during deployment (user impact)",
          "No rollback plan (stuck with broken deployment)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Add deployment notifications",
        command:
          "cat >> .github/workflows/pipeline.yml << 'EOF'\n\n  notify:\n    name: Notify Team\n    needs: deploy-production\n    runs-on: ubuntu-latest\n    if: always()  # Run even if previous jobs failed\n    steps:\n      - name: Slack notification\n        uses: 8398a7/action-slack@v3\n        with:\n          status: ${{ job.status }}\n          text: |\n            Production Deployment: ${{ job.status }}\n            Branch: ${{ github.ref }}\n            Commit: ${{ github.sha }}\n            Author: ${{ github.actor }}\n          webhook_url: ${{ secrets.SLACK_WEBHOOK }}\nEOF",
        explanation:
          "Notifications run always (even on failure). Slack message shows deployment status. Team knows immediately if deployment succeeded or failed. Can integrate with PagerDuty, email, etc.",
        expectedOutput:
          "Automatic notifications keep team informed of deployment status.",
        validationCriteria: [
          "Notifications sent on success and failure",
          "Contains deployment details",
          "Team receives message immediately",
          "Webhook URL stored securely in secrets",
          "if: always() ensures notification even on failure",
        ],
        commonMistakes: [
          "Only notifying on success (team unaware of failures)",
          "Not including relevant context (hard to diagnose)",
          "Hardcoding webhook URL (security risk)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Implement rollback procedure",
        command:
          "cat > .github/workflows/rollback.yml << 'EOF'\nname: Rollback Production\n\non:\n  workflow_dispatch:\n    inputs:\n      version:\n        description: 'Version to rollback to'\n        required: true\n\njobs:\n  rollback:\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n    steps:\n      - name: Confirm rollback\n        run: |\n          echo \"Rolling back to version: ${{ github.event.inputs.version }}\"\n      \n      - name: Deploy previous version\n        run: |\n          # Pull previous image from registry\n          # Deploy to production\n          # Verify health checks\n      \n      - name: Notify rollback\n        uses: 8398a7/action-slack@v3\n        with:\n          status: 'warning'\n          text: |\n            ROLLBACK executed to version ${{ github.event.inputs.version }}\n            By: ${{ github.actor }}\n          webhook_url: ${{ secrets.SLACK_WEBHOOK }}\nEOF",
        explanation:
          "Separate rollback workflow triggered manually. Input allows specifying version to rollback to. Requires production environment approval. Notifies team of rollback. Critical safety mechanism.",
        expectedOutput:
          "Manual rollback workflow enables quick recovery from bad deployments.",
        validationCriteria: [
          "Manual trigger with version input",
          "Requires approval (production environment)",
          "Deploys previous version",
          "Health checks validate rollback",
          "Team notified of rollback",
        ],
        commonMistakes: [
          "No rollback capability (stuck with broken version)",
          "Automatic rollback (can hide real issues)",
          "Not testing rollback procedure (fails when needed)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Monitor pipeline health and metrics",
        command:
          "Pipeline metrics to track:\n\n1. DEPLOYMENT FREQUENCY:\n   - Count: Number of deployments per week\n   - Target: Daily deployments\n   \n2. LEAD TIME:\n   - Measure: Commit to production time\n   - Target: < 1 hour\n   \n3. PIPELINE DURATION:\n   - Measure: Time from start to finish\n   - Target: < 10 minutes\n   \n4. FAILURE RATE:\n   - Calculate: Failed pipelines / Total pipelines\n   - Target: < 10%\n   \n5. MTTR (Mean Time To Recovery):\n   - Measure: Time to rollback/fix broken deployment\n   - Target: < 30 minutes\n\nView in GitHub Actions Insights",
        explanation:
          "Track pipeline performance with metrics. GitHub Actions Insights shows success rate, duration, trends. Use data to improve pipeline. Slow pipelines get optimized. High failure rates get investigated.",
        expectedOutput:
          "Understanding: Pipeline metrics measure effectiveness and guide improvements.",
        validationCriteria: [
          "Metrics tracked over time",
          "Trends visible in Insights",
          "Slow pipelines identified and improved",
          "Failure patterns analyzed",
          "Team reviews metrics regularly",
        ],
        commonMistakes: [
          "Not measuring (can't improve what you don't measure)",
          "Ignoring trends (miss degradation)",
          "No action on metrics (defeats purpose)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Troubleshoot pipeline failures effectively",
        command:
          "Debugging workflow:\n\n1. CHECK LOGS:\n   - Actions tab → Failed workflow → Failed job → Failed step\n   - Read error message carefully\n   \n2. REPRODUCE LOCALLY:\n   - Run same commands on your machine\n   - Isolates GitHub Actions vs code issue\n   \n3. ENABLE DEBUG LOGGING:\n   - Add secret: ACTIONS_STEP_DEBUG = true\n   - Re-run workflow for detailed logs\n   \n4. USE ACT (local Actions runner):\n   - Install: brew install act\n   - Run: act -l (list workflows)\n   - Run: act push (simulate push event)\n   \n5. COMMON ISSUES:\n   - Missing secrets → Add in Settings\n   - Cached dependencies → Clear cache\n   - Timing issues → Add wait/retry logic\n   - Permission errors → Update GITHUB_TOKEN permissions",
        explanation:
          "Systematic debugging approach. Logs show exact failure point. Local reproduction isolates issues. Debug logging reveals hidden problems. Act allows testing workflows locally before pushing.",
        expectedOutput:
          "Understanding: Systematic approach to troubleshooting pipeline failures.",
        validationCriteria: [
          "Can locate failure in logs",
          "Able to reproduce issues locally",
          "Debug logging enabled when needed",
          "Common issues recognized quickly",
          "Fix verified before merge",
        ],
        commonMistakes: [
          "Not reading error messages (assume problem)",
          "Debugging by trial-and-error commits (spam history)",
          "Not testing locally first (waste pipeline minutes)",
        ],
      },
    ],
    expectedOutcome:
      "You can design and implement complete CI/CD pipelines with quality gates, testing stages, security scanning, multi-environment deployment, health checks, notifications, rollback procedures, and troubleshooting capabilities.",
  },

  walk: {
    introduction:
      "Practice building complete CI/CD pipelines through exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Design quality gate sequence for maximum safety and speed.",
        template:
          "Quality gates (in order):\n1. __LINT__: Fastest, catches style issues (1 min)\n2. __UNIT_TESTS__: Fast, comprehensive coverage (3 min)\n3. __SECURITY__: Run in parallel with tests (4 min)\n4. __INTEGRATION__: Validate components together (5 min)\n5. __BUILD__: Create Docker image after all tests pass (2 min)\n6. __STAGING__: Deploy to staging environment\n7. __SMOKE__: Validate critical paths on staging (3 min)\n8. __APPROVAL__: Manual gate for production\n9. __PRODUCTION__: Deploy with zero downtime",
        blanks: [
          {
            id: "LINT",
            label: "LINT",
            hint: "Code style and formatting",
            correctValue: "Lint",
            validationPattern: ".*(lint|style|format).*",
          },
          {
            id: "UNIT_TESTS",
            label: "UNIT_TESTS",
            hint: "Fast, isolated tests",
            correctValue: "Unit Tests",
            validationPattern: ".*(unit.*test).*",
          },
          {
            id: "SECURITY",
            label: "SECURITY",
            hint: "Vulnerability scanning",
            correctValue: "Security Scan",
            validationPattern: ".*(security|vuln|scan).*",
          },
          {
            id: "INTEGRATION",
            label: "INTEGRATION",
            hint: "Test components together",
            correctValue: "Integration Tests",
            validationPattern: ".*(integration).*",
          },
          {
            id: "BUILD",
            label: "BUILD",
            hint: "Create deployable artifact",
            correctValue: "Build",
            validationPattern: ".*(build|docker|artifact).*",
          },
          {
            id: "STAGING",
            label: "STAGING",
            hint: "Pre-production environment",
            correctValue: "Deploy Staging",
            validationPattern: ".*(staging|stage).*",
          },
          {
            id: "SMOKE",
            label: "SMOKE",
            hint: "Quick validation tests",
            correctValue: "Smoke Tests",
            validationPattern: ".*(smoke).*",
          },
          {
            id: "APPROVAL",
            label: "APPROVAL",
            hint: "Human review",
            correctValue: "Manual Approval",
            validationPattern: ".*(approval|manual|gate).*",
          },
          {
            id: "PRODUCTION",
            label: "PRODUCTION",
            hint: "Live environment",
            correctValue: "Deploy Production",
            validationPattern: ".*(prod|production).*",
          },
        ],
        solution:
          "Quality gates (in order):\n1. Lint: Fastest, catches style issues (1 min)\n2. Unit Tests: Fast, comprehensive coverage (3 min)\n3. Security Scan: Run in parallel with tests (4 min)\n4. Integration Tests: Validate components together (5 min)\n5. Build: Create Docker image after all tests pass (2 min)\n6. Deploy Staging: Deploy to staging environment\n7. Smoke Tests: Validate critical paths on staging (3 min)\n8. Manual Approval: Manual gate for production\n9. Deploy Production: Deploy with zero downtime",
        explanation:
          "Optimal order: Fast feedback first (lint), then tests, then build, then deployment stages with validation.",
      },
      {
        exerciseNumber: 2,
        scenario: "Create deployment job with health checks and rollback.",
        template:
          'deploy-prod:\n  needs: [__DEPENDENCIES__]\n  runs-on: ubuntu-latest\n  environment:\n    name: __ENVIRONMENT__\n  steps:\n    - name: Deploy\n      run: |\n        # Deploy new version\n        __DEPLOY_COMMAND__\n    \n    - name: Health check\n      run: |\n        for i in {1..5}; do\n          if curl -f __HEALTH_URL__; then\n            exit 0\n          fi\n          sleep 10\n        done\n        echo "Health check failed"\n        # __ROLLBACK__\n        exit 1',
        blanks: [
          {
            id: "DEPENDENCIES",
            label: "DEPENDENCIES",
            hint: "Previous jobs that must complete",
            correctValue: "smoke-tests",
            validationPattern: ".*(smoke|test|build).*",
          },
          {
            id: "ENVIRONMENT",
            label: "ENVIRONMENT",
            hint: "Environment name for tracking",
            correctValue: "production",
            validationPattern: ".*(production|prod).*",
          },
          {
            id: "DEPLOY_COMMAND",
            label: "DEPLOY_COMMAND",
            hint: "Command to deploy application",
            correctValue:
              "kubectl set image deployment/app app=myimage:$VERSION",
            validationPattern: ".*(kubectl|docker|deploy).*",
          },
          {
            id: "HEALTH_URL",
            label: "HEALTH_URL",
            hint: "Endpoint to check",
            correctValue: "https://myapp.com/health",
            validationPattern: ".*(http|health|api).*",
          },
          {
            id: "ROLLBACK",
            label: "ROLLBACK",
            hint: "Revert to previous version",
            correctValue: "kubectl rollout undo deployment/app",
            validationPattern: ".*(rollback|undo|revert).*",
          },
        ],
        solution:
          'deploy-prod:\n  needs: [smoke-tests]\n  runs-on: ubuntu-latest\n  environment:\n    name: production\n  steps:\n    - name: Deploy\n      run: |\n        # Deploy new version\n        kubectl set image deployment/app app=myimage:$VERSION\n    \n    - name: Health check\n      run: |\n        for i in {1..5}; do\n          if curl -f https://myapp.com/health; then\n            exit 0\n          fi\n          sleep 10\n        done\n        echo "Health check failed"\n        # kubectl rollout undo deployment/app\n        exit 1',
        explanation:
          "Production deployment with retry logic on health checks and rollback capability on failure.",
      },
      {
        exerciseNumber: 3,
        scenario: "Implement parallel jobs for speed.",
        template:
          "jobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run lint\n  \n  unit-tests:\n    needs: __LINT_DEPENDENCY__\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n  \n  security:\n    needs: __LINT_DEPENDENCY__\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm audit\n  \n  build:\n    needs: [__WAIT_FOR_TESTS__, __WAIT_FOR_SECURITY__]\n    runs-on: ubuntu-latest\n    steps:\n      - run: docker build .",
        blanks: [
          {
            id: "LINT_DEPENDENCY",
            label: "LINT_DEPENDENCY",
            hint: "Wait for lint to pass",
            correctValue: "lint",
            validationPattern: ".*(lint).*",
          },
          {
            id: "WAIT_FOR_TESTS",
            label: "WAIT_FOR_TESTS",
            hint: "Tests must pass",
            correctValue: "unit-tests",
            validationPattern: ".*(test|unit).*",
          },
          {
            id: "WAIT_FOR_SECURITY",
            label: "WAIT_FOR_SECURITY",
            hint: "Security must pass",
            correctValue: "security",
            validationPattern: ".*(security|audit).*",
          },
        ],
        solution:
          "jobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run lint\n  \n  unit-tests:\n    needs: lint\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n  \n  security:\n    needs: lint\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm audit\n  \n  build:\n    needs: [unit-tests, security]\n    runs-on: ubuntu-latest\n    steps:\n      - run: docker build .",
        explanation:
          "Tests and security run in parallel after lint passes, build waits for both to complete.",
      },
      {
        exerciseNumber: 4,
        scenario: "Add Slack notifications with deployment context.",
        template:
          "notify:\n  needs: __DEPLOY_JOB__\n  if: __ALWAYS__\n  runs-on: ubuntu-latest\n  steps:\n    - uses: 8398a7/action-slack@v3\n      with:\n        status: ${{ job.__STATUS__ }}\n        text: |\n          Deployment: ${{ job.status }}\n          Environment: __ENVIRONMENT__\n          Branch: ${{ github.__BRANCH__ }}\n          Commit: ${{ github.__COMMIT__ }}\n          Author: ${{ github.__AUTHOR__ }}\n        webhook_url: ${{ secrets.__WEBHOOK_SECRET__ }}",
        blanks: [
          {
            id: "DEPLOY_JOB",
            label: "DEPLOY_JOB",
            hint: "Production deploy job",
            correctValue: "deploy-production",
            validationPattern: ".*(deploy|prod).*",
          },
          {
            id: "ALWAYS",
            label: "ALWAYS",
            hint: "Run on success and failure",
            correctValue: "always()",
            validationPattern: ".*(always).*",
          },
          {
            id: "STATUS",
            label: "STATUS",
            hint: "Job outcome",
            correctValue: "status",
            validationPattern: ".*(status).*",
          },
          {
            id: "ENVIRONMENT",
            label: "ENVIRONMENT",
            hint: "Where deployed",
            correctValue: "production",
            validationPattern: ".*(prod|production).*",
          },
          {
            id: "BRANCH",
            label: "BRANCH",
            hint: "Git branch reference",
            correctValue: "ref",
            validationPattern: ".*(ref|branch).*",
          },
          {
            id: "COMMIT",
            label: "COMMIT",
            hint: "Commit SHA",
            correctValue: "sha",
            validationPattern: ".*(sha|commit).*",
          },
          {
            id: "AUTHOR",
            label: "AUTHOR",
            hint: "Who triggered",
            correctValue: "actor",
            validationPattern: ".*(actor|author|user).*",
          },
          {
            id: "WEBHOOK_SECRET",
            label: "WEBHOOK_SECRET",
            hint: "Slack webhook secret name",
            correctValue: "SLACK_WEBHOOK",
            validationPattern: ".*(SLACK|WEBHOOK).*",
          },
        ],
        solution:
          "notify:\n  needs: deploy-production\n  if: always()\n  runs-on: ubuntu-latest\n  steps:\n    - uses: 8398a7/action-slack@v3\n      with:\n        status: ${{ job.status }}\n        text: |\n          Deployment: ${{ job.status }}\n          Environment: production\n          Branch: ${{ github.ref }}\n          Commit: ${{ github.sha }}\n          Author: ${{ github.actor }}\n        webhook_url: ${{ secrets.SLACK_WEBHOOK }}",
        explanation:
          "Notification job runs always (even on failure) with full deployment context for team visibility.",
      },
      {
        exerciseNumber: 5,
        scenario: "Calculate pipeline efficiency metrics.",
        template:
          "Pipeline metrics:\n\nCurrent state:\n- Total duration: __15_MINUTES__\n- Lint: 1 min\n- Tests (sequential): 8 min\n- Build: 3 min\n- Deploy: 3 min\n\nOptimized (parallel tests):\n- Total duration: __10_MINUTES__\n- Lint: 1 min\n- Tests (parallel): 5 min\n- Build: 2 min (with cache)\n- Deploy: 2 min\n\nImprovement: __33_PERCENT__% faster",
        blanks: [
          {
            id: "15_MINUTES",
            label: "15_MINUTES",
            hint: "Sum of all stages",
            correctValue: "15 minutes",
            validationPattern: ".*(15).*",
          },
          {
            id: "10_MINUTES",
            label: "10_MINUTES",
            hint: "With parallelization",
            correctValue: "10 minutes",
            validationPattern: ".*(10).*",
          },
          {
            id: "33_PERCENT",
            label: "33_PERCENT",
            hint: "(15-10)/15 * 100",
            correctValue: "33",
            validationPattern: ".*(33).*",
          },
        ],
        solution:
          "Pipeline metrics:\n\nCurrent state:\n- Total duration: 15 minutes\n- Lint: 1 min\n- Tests (sequential): 8 min\n- Build: 3 min\n- Deploy: 3 min\n\nOptimized (parallel tests):\n- Total duration: 10 minutes\n- Lint: 1 min\n- Tests (parallel): 5 min\n- Build: 2 min (with cache)\n- Deploy: 2 min\n\nImprovement: 33% faster",
        explanation:
          "Parallel execution and caching significantly reduce pipeline duration, enabling faster feedback.",
      },
    ],
    hints: [
      "Run fast stages first for quick feedback (lint before tests)",
      "Parallelize independent stages (tests and security)",
      "Use needs to control job dependencies",
      "Always include health checks after deployment",
      "Notifications should run always() to catch failures",
    ],
  },

  runGuided: {
    objective:
      "Build production-ready CI/CD pipeline with all stages, quality gates, deployment automation, and monitoring",
    conceptualGuidance: [
      "Choose application (or create sample Node.js/Python app)",
      "Design pipeline stages: lint → test → security → build → deploy",
      "Implement quality gates that fail fast",
      "Parallelize independent stages for speed",
      "Add multi-environment deployment (staging, production)",
      "Implement health checks and rollback capability",
      "Add deployment notifications (Slack, email, etc.)",
      "Track pipeline metrics (duration, success rate)",
      "Document troubleshooting procedures",
      "Test rollback procedure",
    ],
    keyConceptsToApply: [
      "Pipeline stage design",
      "Job dependencies and parallelization",
      "Quality gates and testing",
      "Blue-green or canary deployment",
      "Health checks and monitoring",
    ],
    checkpoints: [
      {
        checkpoint: "Quality gates implemented",
        description: "Complete quality validation before deployment",
        validationCriteria: [
          "Linting enforces code standards",
          "Unit and integration tests run automatically",
          "Security scanning integrated",
          "Code coverage tracked (>80% target)",
          "Quality gate failures block deployment",
          "Fast feedback (quality gates < 5 minutes)",
        ],
        hintIfStuck:
          "Create separate jobs: lint (ESLint/Prettier), test (jest/pytest with coverage), security (Snyk/npm audit). Use needs to enforce order: test needs lint, build needs [test, security].",
      },
      {
        checkpoint: "Multi-environment deployment working",
        description: "Automated deployment with proper gates",
        validationCriteria: [
          "Staging deploys automatically after quality gates pass",
          "Smoke tests validate staging deployment",
          "Production requires manual approval",
          "Health checks verify deployments",
          "Rollback procedure tested and documented",
          "Deployment history visible in GitHub Environments",
        ],
        hintIfStuck:
          "Create deploy jobs with environment: staging/production. Staging auto-deploys on main. Production needs environment protection rules (Settings → Environments → Add protection). Add health check steps after deployment. Test rollback workflow manually.",
      },
      {
        checkpoint: "Monitoring and operations complete",
        description: "Pipeline is observable and maintainable",
        validationCriteria: [
          "Notifications on deployment success/failure",
          "Pipeline duration tracked (<10 min target)",
          "Failure rate monitored (<10% target)",
          "Troubleshooting guide documents common issues",
          "Team can operate pipeline independently",
          "README has status badge and deployment instructions",
        ],
        hintIfStuck:
          "Add Slack notification job with if: always(). Check Actions Insights for metrics. Document in README: how to trigger manually, how to approve production, how to rollback, common errors and fixes. Add workflow status badge from Actions UI.",
      },
    ],
    resourcesAllowed: [
      "GitHub Actions documentation",
      "Sample application for testing pipeline",
      "Slack/Discord webhook for notifications",
      "Docker Hub or GitHub Container Registry",
    ],
  },

  runIndependent: {
    objective:
      "Build enterprise-grade CI/CD pipeline with comprehensive quality gates, security scanning, multi-region deployment, monitoring, and complete operational documentation",
    successCriteria: [
      "Complete pipeline: Lint, unit test, integration test, security scan, build, deploy staging, smoke test, deploy production stages",
      "Quality gates: ESLint/Prettier, 80%+ test coverage, zero high-severity vulnerabilities, all tests passing before deployment",
      "Parallel execution: Independent stages run in parallel, total pipeline duration <10 minutes",
      "Security: Snyk/Trivy scanning, secret scanning enabled, dependency review on PRs, container image signing",
      "Multi-environment: Auto-deploy to dev on any branch, staging on main, production with manual approval and blue-green deployment",
      "Health validation: Health checks after every deployment, smoke tests on staging, automatic rollback on failure",
      "Monitoring: Deployment notifications (Slack/Discord), pipeline metrics dashboard, error alerting, deployment history tracking",
      "Rollback capability: Manual rollback workflow, tested and documented, <5 minute rollback time",
      "Performance: Dependency caching, Docker layer caching, artifact reuse across jobs, pipeline completes in <10 minutes",
      "Documentation: Architecture diagram, stage descriptions, troubleshooting guide, rollback procedures, team runbook with common tasks",
    ],
    timeTarget: 30,
    minimumRequirements: [
      "Working CI/CD pipeline with build, test, deploy stages",
      "Automated deployment to at least one environment",
      "Health checks validate deployments",
    ],
    evaluationRubric: [
      {
        criterion: "Pipeline Architecture",
        weight: 25,
        passingThreshold:
          "All stages present and properly ordered. Quality gates fail fast. Independent stages parallelized. Pipeline completes in <10 minutes. Clear separation of concerns. Production-ready configuration.",
      },
      {
        criterion: "Quality and Security",
        weight: 25,
        passingThreshold:
          "Comprehensive testing (unit, integration, smoke) with >80% coverage. Security scanning integrated (dependencies, containers, secrets). Linting enforced. Only high-quality, secure code reaches production. Vulnerabilities block deployment.",
      },
      {
        criterion: "Deployment Excellence",
        weight: 30,
        passingThreshold:
          "Multi-environment deployment (dev, staging, prod) with proper gates. Zero-downtime deployment strategy. Health checks validate deployments. Automatic rollback on failure. Manual rollback tested and fast (<5 min). Deployment history tracked.",
      },
      {
        criterion: "Operations and Maintainability",
        weight: 20,
        passingThreshold:
          "Comprehensive monitoring and notifications. Pipeline metrics tracked. Troubleshooting guide helps diagnose issues. Team can operate independently. Documentation is excellent. Rollback procedures are clear and tested.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=mFFXuXjVgkU",
  documentation: [
    "https://docs.github.com/en/actions/deployment/about-deployments/deploying-with-github-actions",
    "https://www.atlassian.com/continuous-delivery/principles/pipeline",
    "https://dora.dev/guides/",
    "https://martinfowler.com/articles/continuousIntegration.html",
  ],
  relatedConcepts: [
    "CI/CD fundamentals",
    "GitHub Actions workflows",
    "Deployment strategies (blue-green, canary, rolling)",
    "Infrastructure as Code",
    "Monitoring and observability",
    "DevOps metrics and measurement",
  ],
};

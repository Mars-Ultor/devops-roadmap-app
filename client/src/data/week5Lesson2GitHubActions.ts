/**
 * Week 5 Lesson 2 - GitHub Actions
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week5Lesson2GitHubActions: LeveledLessonContent = {
  lessonId: "week5-lesson2-github-actions",

  baseLesson: {
    title: "GitHub Actions: Hands-On CI/CD Automation",
    description:
      "Master GitHub Actions to automate build, test, and deployment workflows directly from your repository.",
    learningObjectives: [
      "Create GitHub Actions workflows with YAML",
      "Understand triggers, jobs, steps, and actions",
      "Build Docker images and run tests automatically",
      "Deploy applications using GitHub Actions",
      "Use secrets and environment variables securely",
    ],
    prerequisites: [
      "Git and GitHub basics",
      "CI/CD concepts understanding",
      "Basic YAML syntax knowledge",
      "Docker fundamentals",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25,
    },
  },

  crawl: {
    introduction:
      "Learn GitHub Actions step-by-step: workflow syntax, triggers, jobs, running tests, building Docker images, and deployment.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Create your first GitHub Actions workflow",
        command:
          'mkdir -p .github/workflows\ncat > .github/workflows/hello.yml << \'EOF\'\nname: Hello World\n\non: [push]\n\njobs:\n  greet:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Say hello\n        run: echo "Hello, GitHub Actions!"\nEOF\n\ngit add .github/workflows/hello.yml\ngit commit -m "Add hello workflow"\ngit push',
        explanation:
          'GitHub Actions workflows live in .github/workflows/ directory. YAML file defines workflow. "on: [push]" triggers on every push. "jobs" contains work to do. "runs-on: ubuntu-latest" specifies runner OS. "run" executes shell command.',
        expectedOutput:
          'Workflow file created, committed, pushed. GitHub Actions tab shows workflow running. "Hello, GitHub Actions!" in logs.',
        validationCriteria: [
          ".github/workflows/hello.yml exists",
          "File committed to repository",
          "GitHub Actions tab shows workflow",
          "Workflow executes on push",
          "Logs contain hello message",
        ],
        commonMistakes: [
          "Wrong directory (must be .github/workflows)",
          "Invalid YAML syntax (check indentation)",
          "Not committing/pushing (workflow won't run)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Understand workflow triggers",
        command:
          "cat > .github/workflows/triggers.yml << 'EOF'\nname: Understanding Triggers\n\non:\n  push:\n    branches: [main, develop]  # Only these branches\n  pull_request:\n    branches: [main]  # PRs to main\n  schedule:\n    - cron: '0 0 * * *'  # Daily at midnight\n  workflow_dispatch:  # Manual trigger from UI\n\njobs:\n  show-trigger:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo \"Triggered by: ${{ github.event_name }}\"\nEOF",
        explanation:
          "Multiple triggers: push (on code push), pull_request (on PR), schedule (cron syntax), workflow_dispatch (manual button). Can filter by branches. ${{ github.event_name }} shows trigger type.",
        expectedOutput:
          "Workflow can be triggered multiple ways: push to main/develop, PR to main, daily schedule, manual trigger button.",
        validationCriteria: [
          "Push to main triggers workflow",
          "Creating PR triggers workflow",
          "Manual trigger button appears in Actions tab",
          "Event name logged correctly",
          "Branch filtering works",
        ],
        commonMistakes: [
          "Cron syntax errors (use crontab.guru to validate)",
          "Branch filters too restrictive (no triggers fire)",
          "Forgetting workflow_dispatch (can't test manually)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Checkout code in workflow",
        command:
          "cat > .github/workflows/checkout.yml << 'EOF'\nname: Checkout Code\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout repository\n        uses: actions/checkout@v4\n      \n      - name: List files\n        run: ls -la\n      \n      - name: Show current directory\n        run: pwd\nEOF",
        explanation:
          "actions/checkout@v4 clones your repository into runner. Without it, runner is empty. All subsequent steps have access to your code. Always first step in most workflows.",
        expectedOutput:
          "Workflow checks out code, lists files showing your repository contents.",
        validationCriteria: [
          "Checkout action runs successfully",
          "Repository files visible in logs",
          "Working directory is repository root",
          "Subsequent steps can access files",
        ],
        commonMistakes: [
          "Forgetting checkout (can't access code)",
          "Using wrong version (use @v4)",
          "Checkout not first step (later steps fail)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Run tests in GitHub Actions",
        command:
          "cat > .github/workflows/test.yml << 'EOF'\nname: Run Tests\n\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Set up Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      \n      - name: Install dependencies\n        run: npm ci\n      \n      - name: Run tests\n        run: npm test\nEOF",
        explanation:
          "actions/setup-node installs Node.js runtime. npm ci installs dependencies (faster than npm install). npm test runs test suite. If tests fail, workflow fails (red X).",
        expectedOutput:
          "Tests run automatically on every push and PR. Workflow shows test results. Failures block merging.",
        validationCriteria: [
          "Node.js installed successfully",
          "Dependencies installed",
          "Tests execute",
          "Test results visible in logs",
          "Failed tests fail workflow",
        ],
        commonMistakes: [
          "Wrong Node version (check package.json engines)",
          "Using npm install instead of npm ci (slower, less reliable)",
          "No test script in package.json (npm test fails)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Build and test Python application",
        command:
          "cat > .github/workflows/python.yml << 'EOF'\nname: Python CI\n\non: [push]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Set up Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: '3.11'\n      \n      - name: Install dependencies\n        run: |\n          pip install -r requirements.txt\n          pip install pytest pytest-cov\n      \n      - name: Run tests with coverage\n        run: pytest --cov=. --cov-report=term\nEOF",
        explanation:
          "actions/setup-python installs Python. Install dependencies from requirements.txt. pytest runs tests. --cov generates coverage report. Multi-line commands use | syntax.",
        expectedOutput:
          "Python tests run, coverage report shows percentage of code tested.",
        validationCriteria: [
          "Python 3.11 installed",
          "Dependencies installed from requirements.txt",
          "Tests executed with pytest",
          "Coverage report generated",
          "Coverage percentage visible in logs",
        ],
        commonMistakes: [
          "requirements.txt missing (install fails)",
          "Wrong Python version (tests break)",
          "Not installing test dependencies (pytest not found)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Build Docker image in workflow",
        command:
          "cat > .github/workflows/docker.yml << 'EOF'\nname: Build Docker Image\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Build Docker image\n        run: docker build -t myapp:${{ github.sha }} .\n      \n      - name: Test image\n        run: docker run myapp:${{ github.sha }} echo \"Image works!\"\nEOF",
        explanation:
          "docker build creates image. Tag with git commit SHA (${{ github.sha }}) for traceability. Test image by running simple command. Ensures image builds successfully.",
        expectedOutput:
          "Docker image builds successfully, tagged with commit SHA, runs basic test.",
        validationCriteria: [
          "Docker image builds without errors",
          "Image tagged with commit SHA",
          "Test command executes in container",
          "Logs show successful build and test",
        ],
        commonMistakes: [
          "No Dockerfile in repository",
          "Dockerfile errors (syntax, missing dependencies)",
          "Not testing image (broken image passes pipeline)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Push Docker image to registry",
        command:
          "cat > .github/workflows/docker-push.yml << 'EOF'\nname: Push to Docker Hub\n\non:\n  push:\n    branches: [main]\n\njobs:\n  build-and-push:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Log in to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n      \n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: yourusername/myapp:latest\nEOF",
        explanation:
          "docker/login-action authenticates to Docker Hub using secrets. docker/build-push-action builds and pushes in one step. Secrets protect credentials (never hardcode).",
        expectedOutput:
          "Image pushed to Docker Hub, tagged as latest. Visible on Docker Hub repository.",
        validationCriteria: [
          "Login successful using secrets",
          "Image builds",
          "Image pushed to Docker Hub",
          "Tag visible on Docker Hub",
          "No credentials in logs (secrets masked)",
        ],
        commonMistakes: [
          "Hardcoding credentials (security risk)",
          "Wrong secret names (login fails)",
          "Not creating secrets in GitHub settings",
          "Wrong Docker Hub username in tag",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Use secrets and environment variables",
        command:
          "# In GitHub repo: Settings → Secrets and variables → Actions → New repository secret\n# Add: DATABASE_URL, API_KEY, etc.\n\ncat > .github/workflows/secrets.yml << 'EOF'\nname: Use Secrets\n\non: [push]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    env:\n      NODE_ENV: production\n    steps:\n      - name: Use secret\n        env:\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n          API_KEY: ${{ secrets.API_KEY }}\n        run: |\n          echo \"Connecting to database...\"\n          # Secrets are masked in logs\nEOF",
        explanation:
          "GitHub Secrets store sensitive data. Access via ${{ secrets.NAME }}. Never echoed in logs (automatically masked). Env variables available to all steps.",
        expectedOutput:
          "Secrets used in workflow, values masked in logs, environment variables accessible.",
        validationCriteria: [
          "Secrets configured in GitHub settings",
          "Workflow accesses secrets",
          "Secret values masked in logs (show ***)",
          "Environment variables set correctly",
          "No credentials exposed",
        ],
        commonMistakes: [
          "Echoing secrets (defeats masking if logged differently)",
          "Using secrets in if conditions (can leak in URLs)",
          "Not setting secrets before running workflow",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Matrix builds: Test multiple versions",
        command:
          "cat > .github/workflows/matrix.yml << 'EOF'\nname: Matrix Build\n\non: [push]\n\njobs:\n  test:\n    runs-on: ${{ matrix.os }}\n    strategy:\n      matrix:\n        os: [ubuntu-latest, windows-latest, macos-latest]\n        node: [18, 20, 22]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node }}\n      - run: npm ci\n      - run: npm test\nEOF",
        explanation:
          "Matrix creates multiple jobs (3 OS × 3 Node versions = 9 jobs). Tests compatibility across platforms and versions. Runs in parallel for speed.",
        expectedOutput:
          "9 jobs run in parallel, testing all combinations. Ensures app works on all platforms.",
        validationCriteria: [
          "Matrix creates multiple jobs (visible in Actions UI)",
          "Each combination tested",
          "Jobs run in parallel",
          "All combinations must pass",
          "Failures show which combination broke",
        ],
        commonMistakes: [
          "Too many combinations (slow, expensive)",
          "Platform-specific tests without conditions",
          "Not testing versions users actually use",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Cache dependencies for faster builds",
        command:
          "cat > .github/workflows/cache.yml << 'EOF'\nname: Cache Dependencies\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'  # Automatic caching\n      \n      - run: npm ci\n      - run: npm test\nEOF",
        explanation:
          "cache: npm enables automatic dependency caching. Subsequent runs skip download if package-lock.json unchanged. Speeds up builds significantly (minutes to seconds).",
        expectedOutput:
          'First run: downloads dependencies (slow). Subsequent runs: uses cache (fast). Logs show "Cache restored".',
        validationCriteria: [
          "First run downloads dependencies",
          "Cache saved after first run",
          "Subsequent runs restore from cache",
          "Logs show cache hit/miss",
          "Build time reduced significantly",
        ],
        commonMistakes: [
          "Not using cache (unnecessarily slow)",
          "Cache key doesn't change when dependencies change",
          "Caching node_modules directly (use package manager cache instead)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Conditional execution with if",
        command:
          "cat > .github/workflows/conditional.yml << 'EOF'\nname: Conditional Steps\n\non: [push, pull_request]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Run on main only\n        if: github.ref == 'refs/heads/main'\n        run: echo \"This is main branch\"\n      \n      - name: Run on PRs only\n        if: github.event_name == 'pull_request'\n        run: echo \"This is a PR\"\n      \n      - name: Deploy to production\n        if: github.ref == 'refs/heads/main' && success()\n        run: echo \"Deploying...\"\nEOF",
        explanation:
          "if conditions control step execution. Check branch (github.ref), event (github.event_name), previous step status (success(), failure()). Combine with &&/||.",
        expectedOutput:
          "Steps execute conditionally based on branch, event, or previous step status.",
        validationCriteria: [
          "Conditions evaluated correctly",
          "Steps skip when condition false",
          "Branch-specific steps work",
          "Event-specific steps work",
          "Combined conditions work (&& and ||)",
        ],
        commonMistakes: [
          "Wrong branch ref (use refs/heads/main, not just main)",
          "Not handling step failures (deploy runs even if tests fail)",
          "Complex conditions hard to read (simplify or split)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Deploy to production with approval",
        command:
          "cat > .github/workflows/deploy.yml << 'EOF'\nname: Deploy to Production\n\non:\n  push:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n  \n  deploy:\n    needs: build  # Wait for build to complete\n    runs-on: ubuntu-latest\n    environment:\n      name: production  # Requires approval in settings\n      url: https://myapp.com\n    steps:\n      - name: Deploy\n        run: echo \"Deploying to production...\"\nEOF",
        explanation:
          "needs: build ensures deploy runs after build succeeds. environment: production creates deployment with approval gate (configure in GitHub settings). URL shown in deployment.",
        expectedOutput:
          "Build runs, then waits for manual approval before deploying. Deployment tracked in Environments tab.",
        validationCriteria: [
          "Build completes before deploy starts",
          "Approval required before deploy",
          "Deployment visible in Environments tab",
          "Deployment URL shown",
          "Failed build prevents deploy",
        ],
        commonMistakes: [
          "Not configuring environment protection rules (no approval required)",
          "Missing needs (deploy runs even if build fails)",
          "Not setting deployment URL (harder to verify)",
        ],
      },
    ],
    expectedOutcome:
      "You can create GitHub Actions workflows with triggers, jobs, and steps. You understand how to checkout code, run tests, build Docker images, use secrets, implement caching, and deploy with approval gates. You can read workflow logs and troubleshoot failures.",
  },

  walk: {
    introduction: "Practice GitHub Actions through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Create Node.js CI workflow: install dependencies, run tests, build project.",
        template:
          "name: Node.js CI\n\non: [__TRIGGER__, pull_request]\n\njobs:\n  build:\n    runs-on: __OS__\n    steps:\n      - uses: __CHECKOUT__\n      \n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with:\n          node-version: '__VERSION__'\n          cache: '__CACHE__'\n      \n      - run: __INSTALL__\n      - run: __TEST__\n      - run: __BUILD__",
        blanks: [
          {
            id: "TRIGGER",
            label: "TRIGGER",
            hint: "Event that starts workflow",
            correctValue: "push",
            validationPattern: ".*(push).*",
          },
          {
            id: "OS",
            label: "OS",
            hint: "Runner operating system",
            correctValue: "ubuntu-latest",
            validationPattern: ".*(ubuntu|linux).*",
          },
          {
            id: "CHECKOUT",
            label: "CHECKOUT",
            hint: "Action to clone repository",
            correctValue: "actions/checkout@v4",
            validationPattern: ".*(checkout).*",
          },
          {
            id: "VERSION",
            label: "VERSION",
            hint: "Node.js version number",
            correctValue: "20",
            validationPattern: ".*(20|18|22).*",
          },
          {
            id: "CACHE",
            label: "CACHE",
            hint: "Package manager to cache",
            correctValue: "npm",
            validationPattern: ".*(npm).*",
          },
          {
            id: "INSTALL",
            label: "INSTALL",
            hint: "Install dependencies command",
            correctValue: "npm ci",
            validationPattern: ".*(npm.*ci).*",
          },
          {
            id: "TEST",
            label: "TEST",
            hint: "Run test suite",
            correctValue: "npm test",
            validationPattern: ".*(npm.*test).*",
          },
          {
            id: "BUILD",
            label: "BUILD",
            hint: "Build project",
            correctValue: "npm run build",
            validationPattern: ".*(npm.*build).*",
          },
        ],
        solution:
          "name: Node.js CI\n\non: [push, pull_request]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      \n      - run: npm ci\n      - run: npm test\n      - run: npm run build",
        explanation:
          "Basic Node.js CI: checkout code, setup Node with caching, install dependencies, run tests, build project.",
      },
      {
        exerciseNumber: 2,
        scenario:
          "Build and push Docker image to Docker Hub on main branch pushes.",
        template:
          "name: Docker Build and Push\n\non:\n  push:\n    branches: [__BRANCH__]\n\njobs:\n  docker:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Login to Docker Hub\n        uses: __LOGIN_ACTION__\n        with:\n          username: ${{ secrets.__USERNAME_SECRET__ }}\n          password: ${{ secrets.__PASSWORD_SECRET__ }}\n      \n      - name: Build and push\n        uses: __BUILD_PUSH_ACTION__\n        with:\n          push: __PUSH__\n          tags: yourusername/app:__TAG__",
        blanks: [
          {
            id: "BRANCH",
            label: "BRANCH",
            hint: "Production branch",
            correctValue: "main",
            validationPattern: ".*(main|master).*",
          },
          {
            id: "LOGIN_ACTION",
            label: "LOGIN_ACTION",
            hint: "Docker login action",
            correctValue: "docker/login-action@v3",
            validationPattern: ".*(login.*action).*",
          },
          {
            id: "USERNAME_SECRET",
            label: "USERNAME_SECRET",
            hint: "Secret for Docker username",
            correctValue: "DOCKER_USERNAME",
            validationPattern: ".*(DOCKER.*USER|USERNAME).*",
          },
          {
            id: "PASSWORD_SECRET",
            label: "PASSWORD_SECRET",
            hint: "Secret for Docker password",
            correctValue: "DOCKER_PASSWORD",
            validationPattern: ".*(DOCKER.*PASS|PASSWORD|TOKEN).*",
          },
          {
            id: "BUILD_PUSH_ACTION",
            label: "BUILD_PUSH_ACTION",
            hint: "Action to build and push",
            correctValue: "docker/build-push-action@v5",
            validationPattern: ".*(build.*push).*",
          },
          {
            id: "PUSH",
            label: "PUSH",
            hint: "Boolean to enable push",
            correctValue: "true",
            validationPattern: ".*(true).*",
          },
          {
            id: "TAG",
            label: "TAG",
            hint: "Image tag",
            correctValue: "latest",
            validationPattern: ".*(latest|\\$\\{\\{.*sha.*\\}\\}).*",
          },
        ],
        solution:
          "name: Docker Build and Push\n\non:\n  push:\n    branches: [main]\n\njobs:\n  docker:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n      \n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: yourusername/app:latest",
        explanation:
          "Docker workflow: login using secrets, build and push image to Docker Hub.",
      },
      {
        exerciseNumber: 3,
        scenario: "Test Python app on multiple Python versions using matrix.",
        template:
          "name: Python Matrix Test\n\non: [push]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python-version: [__PY38__, __PY39__, __PY311__]\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Python\n        uses: __SETUP_PYTHON__\n        with:\n          python-version: ${{ matrix.__MATRIX_VAR__ }}\n      \n      - run: pip install -r __REQUIREMENTS__\n      - run: __TEST_COMMAND__",
        blanks: [
          {
            id: "PY38",
            label: "PY38",
            hint: "Python 3.8",
            correctValue: "3.8",
            validationPattern: ".*(3\\.8).*",
          },
          {
            id: "PY39",
            label: "PY39",
            hint: "Python 3.9",
            correctValue: "3.9",
            validationPattern: ".*(3\\.9).*",
          },
          {
            id: "PY311",
            label: "PY311",
            hint: "Python 3.11",
            correctValue: "3.11",
            validationPattern: ".*(3\\.11).*",
          },
          {
            id: "SETUP_PYTHON",
            label: "SETUP_PYTHON",
            hint: "Action to setup Python",
            correctValue: "actions/setup-python@v5",
            validationPattern: ".*(setup.*python).*",
          },
          {
            id: "MATRIX_VAR",
            label: "MATRIX_VAR",
            hint: "Matrix variable name",
            correctValue: "python-version",
            validationPattern: ".*(python.*version).*",
          },
          {
            id: "REQUIREMENTS",
            label: "REQUIREMENTS",
            hint: "Dependencies file",
            correctValue: "requirements.txt",
            validationPattern: ".*(requirements).*",
          },
          {
            id: "TEST_COMMAND",
            label: "TEST_COMMAND",
            hint: "Python test runner",
            correctValue: "pytest",
            validationPattern: ".*(pytest|python.*-m.*pytest).*",
          },
        ],
        solution:
          "name: Python Matrix Test\n\non: [push]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python-version: [3.8, 3.9, 3.11]\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n      \n      - run: pip install -r requirements.txt\n      - run: pytest",
        explanation:
          "Matrix strategy tests code on multiple Python versions in parallel.",
      },
      {
        exerciseNumber: 4,
        scenario:
          "Deploy to production with manual approval, only on main branch, only if tests pass.",
        template:
          'name: Deploy\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n  \n  deploy:\n    needs: __DEPENDS_ON__\n    runs-on: ubuntu-latest\n    environment:\n      name: __ENVIRONMENT__\n    if: __CONDITION__\n    steps:\n      - run: echo "Deploying..."',
        blanks: [
          {
            id: "DEPENDS_ON",
            label: "DEPENDS_ON",
            hint: "Job to wait for",
            correctValue: "test",
            validationPattern: ".*(test).*",
          },
          {
            id: "ENVIRONMENT",
            label: "ENVIRONMENT",
            hint: "Environment name for approval",
            correctValue: "production",
            validationPattern: ".*(production|prod).*",
          },
          {
            id: "CONDITION",
            label: "CONDITION",
            hint: "Condition to deploy",
            correctValue: "github.ref == 'refs/heads/main' && success()",
            validationPattern: ".*(main|success).*",
          },
        ],
        solution:
          "name: Deploy\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n  \n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n    if: github.ref == 'refs/heads/main' && success()\n    steps:\n      - run: echo \"Deploying...\"",
        explanation:
          "Deploy job waits for test to pass, requires manual approval (environment), only runs on main branch.",
      },
      {
        exerciseNumber: 5,
        scenario:
          "Create workflow with caching, linting, testing, and build artifact upload.",
        template:
          "name: Complete CI\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: __CACHE__\n      \n      - run: npm ci\n      \n      - name: Lint\n        run: npm run __LINT__\n      \n      - name: Test\n        run: npm __TEST__\n      \n      - name: Build\n        run: npm run build\n      \n      - name: Upload artifact\n        uses: __UPLOAD_ACTION__\n        with:\n          name: __ARTIFACT_NAME__\n          path: __BUILD_PATH__",
        blanks: [
          {
            id: "CACHE",
            label: "CACHE",
            hint: "Package manager",
            correctValue: "npm",
            validationPattern: ".*(npm).*",
          },
          {
            id: "LINT",
            label: "LINT",
            hint: "Linting script",
            correctValue: "lint",
            validationPattern: ".*(lint).*",
          },
          {
            id: "TEST",
            label: "TEST",
            hint: "Test command",
            correctValue: "test",
            validationPattern: ".*(test).*",
          },
          {
            id: "UPLOAD_ACTION",
            label: "UPLOAD_ACTION",
            hint: "Action to upload artifacts",
            correctValue: "actions/upload-artifact@v4",
            validationPattern: ".*(upload.*artifact).*",
          },
          {
            id: "ARTIFACT_NAME",
            label: "ARTIFACT_NAME",
            hint: "Name for artifact",
            correctValue: "build",
            validationPattern: ".*(build|dist|app).*",
          },
          {
            id: "BUILD_PATH",
            label: "BUILD_PATH",
            hint: "Directory containing build",
            correctValue: "dist/",
            validationPattern: ".*(dist|build).*",
          },
        ],
        solution:
          "name: Complete CI\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: npm\n      \n      - run: npm ci\n      \n      - name: Lint\n        run: npm run lint\n      \n      - name: Test\n        run: npm test\n      \n      - name: Build\n        run: npm run build\n      \n      - name: Upload artifact\n        uses: actions/upload-artifact@v4\n        with:\n          name: build\n          path: dist/",
        explanation:
          "Complete CI pipeline: cache dependencies, lint code, run tests, build project, upload build artifacts.",
      },
    ],
    hints: [
      "Always checkout code first with actions/checkout@v4",
      "Use cache: npm/pip/etc. in setup actions for speed",
      "Store credentials in GitHub Secrets, never hardcode",
      "Use needs to control job execution order",
      "Matrix builds test multiple versions in parallel",
    ],
  },

  runGuided: {
    objective:
      "Create complete CI/CD pipeline using GitHub Actions with testing, Docker build, and deployment",
    conceptualGuidance: [
      "Choose application to automate (web app, API, or existing project)",
      "Design pipeline stages: lint, test, build, deploy",
      "Set up proper triggers (push to main, PRs)",
      "Implement automated testing with coverage reporting",
      "Build and push Docker image to registry",
      "Deploy to staging environment automatically",
      "Add manual approval gate for production",
      "Use secrets for all credentials",
      "Implement caching for faster builds",
      "Add status badges to README",
    ],
    keyConceptsToApply: [
      "Workflow YAML syntax",
      "Job dependencies with needs",
      "Secrets management",
      "Docker build and push",
      "Environment protection rules",
    ],
    checkpoints: [
      {
        checkpoint: "Workflow created and triggers working",
        description: "Basic workflow file with proper triggers",
        validationCriteria: [
          ".github/workflows/ci-cd.yml exists",
          "Triggers on push to main and pull requests",
          "Workflow appears in Actions tab",
          "Manual trigger (workflow_dispatch) available",
          "Workflow runs successfully",
        ],
        hintIfStuck:
          "Start simple: on: [push, pull_request, workflow_dispatch]. Add checkout step and echo command to verify it works.",
      },
      {
        checkpoint: "Testing and building implemented",
        description: "Automated tests and Docker build working",
        validationCriteria: [
          "Tests run automatically on every commit",
          "Test failures fail the workflow",
          "Docker image builds successfully",
          "Image tagged with commit SHA or version",
          "Build artifacts available (uploaded or pushed to registry)",
        ],
        hintIfStuck:
          "Add test job: setup language runtime → install deps → run tests. Add build job: docker build → docker push (use docker/login-action and docker/build-push-action).",
      },
      {
        checkpoint: "Deployment with approval completed",
        description: "Full CI/CD with staging and production",
        validationCriteria: [
          "Deployment to staging automatic after tests pass",
          "Production deployment requires manual approval",
          "Environment protection rules configured",
          "Secrets used for deployment credentials",
          "Deployment history visible in Environments tab",
          "README has status badge showing workflow status",
        ],
        hintIfStuck:
          "Create deploy job with needs: [test, build]. Add environment: production to require approval. Configure environment in Settings → Environments → Add protection rules. Status badge: Actions tab → workflow → ... → Create status badge.",
      },
    ],
    resourcesAllowed: [
      "GitHub Actions documentation",
      "Marketplace actions (actions/checkout, docker/build-push-action, etc.)",
      "Workflow examples from similar projects",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready GitHub Actions CI/CD pipeline with comprehensive testing, security scanning, multi-stage deployment, monitoring, and complete documentation",
    successCriteria: [
      "Complete workflow file: Lint, test, security scan, build, deploy stages",
      "Automated testing: Unit tests, integration tests, code coverage (>80%), coverage badge in README",
      "Security: Dependency scanning (Dependabot or Snyk), secret scanning enabled, container vulnerability scanning",
      "Docker: Build multi-stage Dockerfile, push to registry with semantic versioning tags (1.0.0, latest)",
      "Multi-environment: Auto-deploy to dev on any push, staging on main, production requires approval",
      "Notifications: Slack/Discord notification on deployment success/failure",
      "Performance: Caching implemented, build completes in <5 minutes",
      "Status badges: Build status, test coverage, deployment status in README",
      "Documentation: Workflow architecture diagram, how to manually trigger, how to rollback, troubleshooting common errors",
      "Rollback procedure: How to revert to previous version using GitHub deployments",
    ],
    timeTarget: 25,
    minimumRequirements: [
      "Working GitHub Actions workflow",
      "Automated tests running in pipeline",
      "Docker image build and push",
      "Deployment to at least one environment",
    ],
    evaluationRubric: [
      {
        criterion: "Pipeline Completeness",
        weight: 30,
        passingThreshold:
          "All stages present (lint, test, security, build, deploy). Proper job dependencies. Fast feedback (<10 min). Workflow handles failures gracefully. Status clearly visible.",
      },
      {
        criterion: "Quality and Security",
        weight: 25,
        passingThreshold:
          "Comprehensive testing with coverage >80%. Security scanning integrated (dependencies, secrets, containers). Code quality gates (linting, formatting). Only secure, quality code reaches production.",
      },
      {
        criterion: "Deployment Automation",
        weight: 25,
        passingThreshold:
          "Multi-environment deployment (dev, staging, prod). Proper approval gates. Secrets managed securely. Semantic versioning. Deployment notifications. Rollback procedure documented and tested.",
      },
      {
        criterion: "Operational Excellence",
        weight: 20,
        passingThreshold:
          "Caching optimizes build time. Status badges visible. Comprehensive documentation. Workflow is maintainable and understandable. Team can operate independently. Monitoring shows deployment health.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=R8_veQiYBjI",
  documentation: [
    "https://docs.github.com/en/actions",
    "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions",
    "https://github.com/marketplace?type=actions",
    "https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment",
  ],
  relatedConcepts: [
    "CI/CD fundamentals",
    "Docker containerization",
    "Infrastructure as Code",
    "GitOps practices",
    "Deployment strategies (blue-green, canary)",
    "Secrets management and security",
  ],
};

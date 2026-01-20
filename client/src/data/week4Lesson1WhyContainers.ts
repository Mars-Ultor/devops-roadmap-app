/**
 * Week 4 Lesson 1 - Why Containers?
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week4Lesson1WhyContainers: LeveledLessonContent = {
  lessonId: "week4-lesson1-why-containers",

  baseLesson: {
    title: "Why Containers? Understanding the Problem They Solve",
    description:
      "Learn why containers revolutionized software deployment and how they solve critical infrastructure challenges.",
    learningObjectives: [
      "Understand problems with traditional deployment (dependency hell, works on my machine)",
      "Explain how containers provide isolation and consistency",
      "Compare containers to virtual machines",
      "Identify when to use containers vs other solutions",
    ],
    prerequisites: [
      "Basic understanding of servers and applications",
      "Linux command line familiarity",
      "Experience with deployment challenges (helpful but not required)",
    ],
    estimatedTimePerLevel: {
      crawl: 35,
      walk: 25,
      runGuided: 20,
      runIndependent: 15,
    },
  },

  crawl: {
    introduction:
      "Learn why containers exist by understanding the problems they solve: dependency conflicts, environment inconsistencies, and deployment complexity.",
    steps: [
      {
        stepNumber: 1,
        instruction: 'The problem: "Works on my machine" syndrome',
        command:
          'Developer: "The app works fine on my laptop!"\nProduction: App crashes with missing dependencies, wrong versions, configuration issues',
        explanation:
          "Classic problem: Code works in development but fails in production. Different OS versions, library versions, environment variables. Hard to debug. Frustrating for everyone.",
        expectedOutput:
          "Understanding: Environment differences cause production failures even when code is identical.",
        validationCriteria: [
          "Recognize dev/prod environment differences",
          "Understand dependency version conflicts",
          "See configuration mismatches as root cause",
          "Acknowledge debugging difficulty",
        ],
        commonMistakes: [
          "Blaming the code when it's the environment",
          "Not documenting dependencies (README with versions)",
          "Assuming production matches development",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Dependency hell: Multiple apps on one server",
        command:
          "Server has:\n- App A needs Python 2.7\n- App B needs Python 3.9\n- App C needs Node.js 14\n- App D needs Node.js 18\nConflict: Can't install multiple Python/Node versions easily",
        explanation:
          "Traditional servers run multiple apps. Apps need different language versions, libraries. Installing conflicting versions breaks things. Workarounds (virtualenv, nvm) are complex.",
        expectedOutput:
          "Understanding: Shared servers create dependency conflicts that are hard to manage.",
        validationCriteria: [
          "See version conflicts (Python 2 vs 3, Node 14 vs 18)",
          "Understand shared libraries cause problems",
          "Recognize workarounds are complex",
          "Want isolation between applications",
        ],
        commonMistakes: [
          "Thinking one server = one app solves it (wastes resources)",
          "Not using version managers (causes conflicts)",
          "Upgrading shared libraries breaks other apps",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Container solution: Isolated environments",
        command:
          "Container = Package containing:\n- Application code\n- Dependencies (exact versions)\n- Runtime (Python, Node, etc.)\n- OS libraries\n- Configuration\nAll bundled together, isolated from other containers",
        explanation:
          "Container packages everything app needs. Runs in isolation. No conflicts with other containers. Same container runs everywhere (dev, test, prod). Consistent environment.",
        expectedOutput:
          "Understanding: Containers solve dependency hell through isolation and bundling.",
        validationCriteria: [
          "Container includes app + all dependencies",
          "Isolated from other containers",
          "Same container runs on any Docker host",
          "No version conflicts between containers",
        ],
        commonMistakes: [
          "Confusing containers with VMs (containers share OS kernel)",
          "Putting configuration files outside container (loses portability)",
          "Not understanding isolation (thinking containers affect each other)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Containers vs Virtual Machines: Resource efficiency",
        command:
          "VM: Full OS + app (GBs, minutes to start)\n  - Hypervisor virtualizes hardware\n  - Each VM runs complete OS (kernel, drivers, services)\n  - Isolated at hardware level\n\nContainer: App + libraries only (MBs, seconds to start)\n  - Docker Engine shares host OS kernel\n  - Containers include only app dependencies\n  - Isolated at process level",
        explanation:
          "VMs virtualize hardware. Heavy (each has full OS). Containers virtualize OS. Lightweight (share kernel). VMs = minutes to boot, GBs. Containers = seconds to start, MBs.",
        expectedOutput:
          "Understanding: Containers are lighter and faster than VMs by sharing the OS kernel.",
        validationCriteria: [
          "VM includes full OS, container shares host kernel",
          "Containers start in seconds, VMs in minutes",
          "Containers use MBs, VMs use GBs",
          "Both provide isolation (different levels)",
        ],
        commonMistakes: [
          "Thinking containers are less secure (different isolation model)",
          "Using VMs when containers sufficient (waste resources)",
          "Not understanding kernel sharing (containers need same OS type)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Portability: Build once, run anywhere",
        command:
          "Traditional: Install dependencies on each server (manual, error-prone)\nContainers: Build image once, run on any Docker host (automated, consistent)\n\nDev laptop → Test server → AWS → Azure → On-premises\nSame container image runs everywhere",
        explanation:
          'Container images are portable. Build once, deploy everywhere. No "works on my machine" because it\'s the same image. Docker provides consistent runtime across cloud providers.',
        expectedOutput:
          "Understanding: Container images ensure consistency across all environments.",
        validationCriteria: [
          "Same image runs on dev, test, prod",
          "No environment-specific setup needed",
          "Cloud-agnostic (AWS, Azure, GCP all run Docker)",
          "Eliminates manual dependency installation",
        ],
        commonMistakes: [
          "Building different images for each environment (defeats purpose)",
          "Hardcoding environment-specific config in image (use env vars)",
          "Not testing with same image as production",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Scalability: Spin up instances in seconds",
        command:
          "Traditional: Provision new server (hours/days), install dependencies (hours), configure (hours)\nContainers: docker run (seconds), already configured\n\nTraffic spike → Launch 10 more containers in 30 seconds\nTraffic drops → Stop containers, save money",
        explanation:
          "Containers start instantly. No server provisioning, dependency installation. Scale horizontally by running more containers. Orchestrators (Kubernetes) automate scaling.",
        expectedOutput:
          "Understanding: Containers enable rapid scaling to handle variable load.",
        validationCriteria: [
          "Containers start in seconds",
          "Can run many containers on one host",
          "Horizontal scaling (add more containers)",
          "Auto-scaling possible with orchestration",
        ],
        commonMistakes: [
          "Scaling by making bigger servers (vertical, not horizontal)",
          "Not using orchestration (manual scaling doesn't scale)",
          "Running too many containers on one host (resource limits)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Microservices enablement: Independent deployment",
        command:
          "Monolith: One large app, all services bundled, deploy everything together\nMicroservices: Many small services, each in own container, deploy independently\n\nUpdate payment service → Deploy only payment container\nOther services (auth, catalog, shipping) unaffected",
        explanation:
          "Containers perfect for microservices. Each service in own container. Deploy independently. Different languages/versions okay. Failure isolation (one service crashes, others continue).",
        expectedOutput:
          "Understanding: Containers enable microservices architecture through isolation and independent deployment.",
        validationCriteria: [
          "Each microservice runs in own container",
          "Services use different tech stacks (polyglot)",
          "Deploy services independently",
          "Failure in one service isolated",
        ],
        commonMistakes: [
          "Making containers too large (defeats microservices purpose)",
          "Coupling services (lose independence)",
          "Not using service discovery (hard-coded IPs)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Version control for infrastructure: Images as artifacts",
        command:
          "Code versioning: Git commits, branches, tags\nInfrastructure versioning: Docker image tags\n\nmyapp:1.0.0 → myapp:1.1.0 → myapp:2.0.0\n\nRollback: Redeploy myapp:1.1.0 if myapp:2.0.0 has bugs",
        explanation:
          "Container images are versioned artifacts. Tag with version numbers. Store in registry (Docker Hub, AWS ECR). Easy rollback to previous version. Immutable (image doesn't change).",
        expectedOutput:
          "Understanding: Docker images enable infrastructure versioning and easy rollbacks.",
        validationCriteria: [
          "Images tagged with version numbers",
          "Stored in container registry",
          "Rollback by deploying previous tag",
          "Images immutable (rebuild for changes)",
        ],
        commonMistakes: [
          "Using :latest tag in production (not reproducible)",
          "Not versioning images (can't rollback)",
          "Modifying running containers (changes lost on restart)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "CI/CD integration: Automated testing and deployment",
        command:
          "Pipeline:\n1. Code commit\n2. Build Docker image\n3. Run tests inside container (same environment as prod)\n4. Push image to registry\n5. Deploy to production (pull image, run container)\n\nAutomated, consistent, reliable",
        explanation:
          "Containers integrate perfectly with CI/CD. Build image in pipeline. Test in container (production-like environment). Deploy by running container. Same image from dev to prod.",
        expectedOutput:
          "Understanding: Containers enable consistent CI/CD pipelines with production-like testing.",
        validationCriteria: [
          "Build image as part of CI pipeline",
          "Test in containers (production environment)",
          "Deploy by running containers",
          "Same image through entire pipeline",
        ],
        commonMistakes: [
          "Testing outside container (environment mismatch)",
          "Building image manually (not automated)",
          "Different images for test and prod (inconsistent)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "When NOT to use containers: Trade-offs",
        command:
          "Good fit:\n- Microservices\n- Cloud-native apps\n- Stateless applications\n- CI/CD pipelines\n\nPoor fit:\n- Monolithic legacy apps (hard to containerize)\n- Apps requiring kernel modules (need host access)\n- GUI applications (containers headless)\n- Extreme performance needs (VM isolation better)",
        explanation:
          "Containers aren't universal solution. Legacy monoliths hard to containerize. Apps needing specific kernel versions problematic. Security-critical apps might need VM isolation. Know trade-offs.",
        expectedOutput:
          "Understanding: Containers solve many problems but aren't always the best solution.",
        validationCriteria: [
          "Containers excel at stateless microservices",
          "Legacy monoliths challenging to containerize",
          "Security requirements might favor VMs",
          "Understand when containers add unnecessary complexity",
        ],
        commonMistakes: [
          "Containerizing everything (containers aren't magic)",
          "Forcing stateful apps into containers (need volume strategy)",
          "Ignoring learning curve (team needs training)",
        ],
      },
    ],
    expectedOutcome:
      "You understand problems containers solve: dependency conflicts, environment inconsistencies, deployment complexity. You can explain containers vs VMs, portability benefits, scalability advantages, microservices enablement, and when containers are appropriate.",
  },

  walk: {
    introduction:
      "Apply container concepts through scenario-based decision-making exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          'Your team struggles with "works on my machine" problems. Explain the root cause and container solution.',
        template:
          "Problem: __ENVIRONMENT_DIFFERENCES__ between dev and production\nDev has: Different __OS_VERSIONS__, __LIBRARY_VERSIONS__, __CONFIGURATIONS__\nContainer solution: Package app with __ALL_DEPENDENCIES__ in __IMAGE__\nResult: __SAME_ENVIRONMENT__ everywhere (dev, test, prod)",
        blanks: [
          {
            id: "ENVIRONMENT_DIFFERENCES",
            label: "ENVIRONMENT_DIFFERENCES",
            hint: "What causes the problem?",
            correctValue: "Environment differences",
            validationPattern: ".*(environment|config|setup).*",
          },
          {
            id: "OS_VERSIONS",
            label: "OS_VERSIONS",
            hint: "Ubuntu 20.04 vs 22.04",
            correctValue: "OS versions",
            validationPattern: ".*(OS|operating.*system|version).*",
          },
          {
            id: "LIBRARY_VERSIONS",
            label: "LIBRARY_VERSIONS",
            hint: "Python 3.8 vs 3.11",
            correctValue: "library versions",
            validationPattern: ".*(library|dependency|package).*",
          },
          {
            id: "CONFIGURATIONS",
            label: "CONFIGURATIONS",
            hint: "Environment variables, settings",
            correctValue: "configurations",
            validationPattern: ".*(config|setting|variable).*",
          },
          {
            id: "ALL_DEPENDENCIES",
            label: "ALL_DEPENDENCIES",
            hint: "Everything the app needs",
            correctValue: "all dependencies",
            validationPattern: ".*(all|dependencies|everything).*",
          },
          {
            id: "IMAGE",
            label: "IMAGE",
            hint: "Container artifact",
            correctValue: "image",
            validationPattern: ".*(image|container).*",
          },
          {
            id: "SAME_ENVIRONMENT",
            label: "SAME_ENVIRONMENT",
            hint: "Consistency",
            correctValue: "same environment",
            validationPattern: ".*(same|consistent|identical).*",
          },
        ],
        solution:
          "Problem: Environment differences between dev and production\nDev has: Different OS versions, library versions, configurations\nContainer solution: Package app with all dependencies in image\nResult: Same environment everywhere (dev, test, prod)",
        explanation:
          "Containers eliminate environment inconsistencies by bundling everything together.",
      },
      {
        exerciseNumber: 2,
        scenario: "Compare containers and VMs for running 20 microservices.",
        template:
          "VMs:\n- Each VM needs __FULL_OS__ (GBs per VM)\n- Boot time: __MINUTES__\n- 20 VMs = Massive __RESOURCE_OVERHEAD__\n\nContainers:\n- Share host __KERNEL__ (MBs per container)\n- Start time: __SECONDS__\n- 20 containers run on __FEW_HOSTS__\n\nBest choice: __CONTAINERS__ (lighter, faster, cheaper)",
        blanks: [
          {
            id: "FULL_OS",
            label: "FULL_OS",
            hint: "Complete operating system",
            correctValue: "full OS",
            validationPattern: ".*(full.*OS|operating.*system|complete).*",
          },
          {
            id: "MINUTES",
            label: "MINUTES",
            hint: "VM boot time",
            correctValue: "minutes",
            validationPattern: ".*(minute|slow).*",
          },
          {
            id: "RESOURCE_OVERHEAD",
            label: "RESOURCE_OVERHEAD",
            hint: "Wasted resources",
            correctValue: "resource overhead",
            validationPattern: ".*(overhead|waste|resource).*",
          },
          {
            id: "KERNEL",
            label: "KERNEL",
            hint: "OS core",
            correctValue: "kernel",
            validationPattern: ".*(kernel|OS).*",
          },
          {
            id: "SECONDS",
            label: "SECONDS",
            hint: "Container start time",
            correctValue: "seconds",
            validationPattern: ".*(second|fast|instant).*",
          },
          {
            id: "FEW_HOSTS",
            label: "FEW_HOSTS",
            hint: "Multiple containers per server",
            correctValue: "few hosts",
            validationPattern: ".*(few|several|host).*",
          },
          {
            id: "CONTAINERS",
            label: "CONTAINERS",
            hint: "Lightweight solution",
            correctValue: "containers",
            validationPattern: ".*(container|docker).*",
          },
        ],
        solution:
          "VMs:\n- Each VM needs full OS (GBs per VM)\n- Boot time: minutes\n- 20 VMs = Massive resource overhead\n\nContainers:\n- Share host kernel (MBs per container)\n- Start time: seconds\n- 20 containers run on few hosts\n\nBest choice: containers (lighter, faster, cheaper)",
        explanation:
          "Containers are ideal for microservices due to lightweight nature and fast startup.",
      },
      {
        exerciseNumber: 3,
        scenario:
          "Your app needs to scale during traffic spikes. How do containers help?",
        template:
          "Traffic spike detected:\n1. __ORCHESTRATOR__ (Kubernetes) notices load\n2. Launches __NEW_CONTAINERS__ in __SECONDS__\n3. __LOAD_BALANCER__ distributes traffic\n4. Traffic drops → __TERMINATE__ containers\n5. Only pay for __ACTUAL_USAGE__",
        blanks: [
          {
            id: "ORCHESTRATOR",
            label: "ORCHESTRATOR",
            hint: "Automated container management",
            correctValue: "Orchestrator",
            validationPattern: ".*(orchestrat|kubernetes|k8s).*",
          },
          {
            id: "NEW_CONTAINERS",
            label: "NEW_CONTAINERS",
            hint: "Horizontal scaling",
            correctValue: "new containers",
            validationPattern: ".*(new.*container|container|replica).*",
          },
          {
            id: "SECONDS",
            label: "SECONDS",
            hint: "Fast startup",
            correctValue: "seconds",
            validationPattern: ".*(second|instant|quick).*",
          },
          {
            id: "LOAD_BALANCER",
            label: "LOAD_BALANCER",
            hint: "Distributes requests",
            correctValue: "load balancer",
            validationPattern: ".*(load.*balance|LB|distribut).*",
          },
          {
            id: "TERMINATE",
            label: "TERMINATE",
            hint: "Stop unneeded containers",
            correctValue: "terminate",
            validationPattern: ".*(terminate|stop|kill|remove).*",
          },
          {
            id: "ACTUAL_USAGE",
            label: "ACTUAL_USAGE",
            hint: "Cost savings",
            correctValue: "actual usage",
            validationPattern: ".*(actual|used|need).*",
          },
        ],
        solution:
          "Traffic spike detected:\n1. Orchestrator (Kubernetes) notices load\n2. Launches new containers in seconds\n3. Load balancer distributes traffic\n4. Traffic drops → terminate containers\n5. Only pay for actual usage",
        explanation:
          "Containers enable elastic scaling: quickly add capacity during peaks, remove during lows.",
      },
      {
        exerciseNumber: 4,
        scenario: "Choose between containers and VMs for different scenarios.",
        template:
          "Microservices architecture: __CONTAINERS__ (lightweight, fast deployment)\nLegacy Windows app needing GUI: __VMS__ (full OS, desktop environment)\nCI/CD testing environment: __CONTAINERS__ (quick spin-up, consistent)\nHigh-security database: __VMS__ (stronger isolation) or containers with proper security",
        blanks: [
          {
            id: "CONTAINERS",
            label: "CONTAINERS",
            hint: "Lightweight solution",
            correctValue: "Containers",
            validationPattern: ".*(container|docker).*",
          },
          {
            id: "VMS",
            label: "VMS",
            hint: "Full virtualization",
            correctValue: "VMs",
            validationPattern: ".*(VM|virtual.*machine).*",
          },
        ],
        solution:
          "Microservices architecture: Containers (lightweight, fast deployment)\nLegacy Windows app needing GUI: VMs (full OS, desktop environment)\nCI/CD testing environment: Containers (quick spin-up, consistent)\nHigh-security database: VMs (stronger isolation) or containers with proper security",
        explanation:
          "Containers excel at cloud-native apps. VMs better for legacy, GUI, or extreme isolation needs.",
      },
      {
        exerciseNumber: 5,
        scenario: "Explain how containers enable consistent CI/CD pipelines.",
        template:
          "CI/CD Pipeline:\n1. Developer commits code to __GIT__\n2. CI builds __DOCKER_IMAGE__ with app + dependencies\n3. Run __TESTS__ inside container (production environment)\n4. Push image to __REGISTRY__ (Docker Hub, ECR)\n5. CD deploys by running __SAME_IMAGE__ in production\n\nBenefit: __CONSISTENCY__ from dev to prod",
        blanks: [
          {
            id: "GIT",
            label: "GIT",
            hint: "Version control",
            correctValue: "Git",
            validationPattern: ".*(git|repository|repo).*",
          },
          {
            id: "DOCKER_IMAGE",
            label: "DOCKER_IMAGE",
            hint: "Container artifact",
            correctValue: "Docker image",
            validationPattern: ".*(docker.*image|image|container).*",
          },
          {
            id: "TESTS",
            label: "TESTS",
            hint: "Automated testing",
            correctValue: "tests",
            validationPattern: ".*(test|check|validate).*",
          },
          {
            id: "REGISTRY",
            label: "REGISTRY",
            hint: "Image storage",
            correctValue: "registry",
            validationPattern: ".*(registry|hub|repository).*",
          },
          {
            id: "SAME_IMAGE",
            label: "SAME_IMAGE",
            hint: "Identical artifact",
            correctValue: "same image",
            validationPattern: ".*(same|identical|exact).*",
          },
          {
            id: "CONSISTENCY",
            label: "CONSISTENCY",
            hint: "Key benefit",
            correctValue: "consistency",
            validationPattern: ".*(consisten|same|identical).*",
          },
        ],
        solution:
          "CI/CD Pipeline:\n1. Developer commits code to Git\n2. CI builds Docker image with app + dependencies\n3. Run tests inside container (production environment)\n4. Push image to registry (Docker Hub, ECR)\n5. CD deploys by running same image in production\n\nBenefit: Consistency from dev to prod",
        explanation:
          "Containers ensure the tested artifact is exactly what runs in production.",
      },
    ],
    hints: [
      "Containers solve environment inconsistency",
      "VMs = full OS, Containers = shared kernel",
      "Containers enable rapid scaling",
      "Same image from dev through prod",
    ],
  },

  runGuided: {
    objective:
      "Analyze a real application and create migration plan from traditional deployment to containers",
    conceptualGuidance: [
      "Choose application (can be hypothetical): web app, API, database, background workers",
      "Document current deployment: manual steps, dependencies, configuration, challenges",
      "Identify pain points: dependency conflicts, slow deployments, environment drift, scaling difficulties",
      "Design container architecture: what goes in each container, how they communicate",
      "Plan migration: incremental (one service at a time) or big-bang (all at once)",
      "List dependencies to containerize: runtime, libraries, system packages",
      "Define configuration strategy: environment variables, config files, secrets",
      "Consider data persistence: volumes for databases, stateful services",
      "Plan testing: how to verify containerized app works correctly",
    ],
    keyConceptsToApply: [
      "Problem identification (current pain points)",
      "Container design (what to include in image)",
      "Dependency management",
      "Configuration externalization",
      "Migration strategy (incremental vs big-bang)",
    ],
    checkpoints: [
      {
        checkpoint: "Current state documented",
        description: "Clear picture of existing deployment and problems",
        validationCriteria: [
          "Application architecture documented",
          "Current deployment process detailed",
          "Pain points identified (dependency issues, slow deploys, etc.)",
          "Dependencies listed (Python version, npm packages, etc.)",
          "Configuration requirements noted",
        ],
        hintIfStuck:
          'Use real app from work or create scenario: "Node.js API + PostgreSQL + Redis, deployed manually to Ubuntu server, takes 2 hours to deploy, dev uses Mac, prod uses Linux, constant environment mismatches."',
      },
      {
        checkpoint: "Container architecture designed",
        description: "Plan for containerizing the application",
        validationCriteria: [
          "Containers identified (API container, database container, cache container)",
          "Base images selected (node:18, postgres:15, redis:7)",
          "Dependencies mapped to containers",
          "Communication plan (network, ports)",
          "Volume strategy for persistent data",
        ],
        hintIfStuck:
          "Separate concerns: API in one container, database in another. Use official images from Docker Hub (node, postgres, redis). Define network for inter-container communication.",
      },
      {
        checkpoint: "Migration plan created",
        description: "Step-by-step containerization roadmap",
        validationCriteria: [
          "Migration approach chosen (incremental recommended)",
          "Order of containerization (start with stateless services)",
          "Testing strategy defined",
          "Rollback plan if issues arise",
          "Timeline estimated",
        ],
        hintIfStuck:
          "Incremental: 1) Containerize API first (stateless), test thoroughly. 2) Move Redis (cache, can lose data). 3) Finally PostgreSQL (stateful, backup first). Run old and new in parallel during transition.",
      },
    ],
    resourcesAllowed: [
      "Docker documentation",
      "Application documentation",
      "Current deployment runbooks",
    ],
  },

  runIndependent: {
    objective:
      "Create comprehensive containerization proposal including problem analysis, architecture design, migration plan, cost-benefit analysis, and risk assessment",
    successCriteria: [
      "Problem statement: Current deployment challenges with specific examples and metrics",
      "Container solution: How containers address each identified problem",
      "Architecture diagram: Containers, networks, volumes, ports clearly illustrated",
      "Migration strategy: Phased approach with timeline, testing plan, rollback procedures",
      "Cost-benefit analysis: Development time saved, deployment speed improvement, infrastructure cost changes",
      "Risk assessment: Migration risks (downtime, data loss, complexity) with mitigation strategies",
      "Success metrics: KPIs to measure (deployment time, environment consistency, scaling speed)",
      "Team readiness: Training needs, documentation requirements, knowledge transfer",
      "Operational changes: New processes for building images, managing containers, monitoring",
      "Long-term vision: Path to orchestration (Kubernetes), additional containerization candidates",
    ],
    timeTarget: 15,
    minimumRequirements: [
      "Clear problem statement with current deployment challenges",
      "Container architecture addressing those problems",
      "Migration plan with at least 3 phases",
    ],
    evaluationRubric: [
      {
        criterion: "Problem Analysis",
        weight: 25,
        passingThreshold:
          "Clearly articulates current deployment problems with specific examples. Quantifies pain (hours spent, failure rate, manual steps). Connects problems to business impact.",
      },
      {
        criterion: "Solution Design",
        weight: 30,
        passingThreshold:
          "Container architecture solves identified problems. Appropriate separation of concerns. Realistic dependencies and configuration. Considers persistence, networking, and scaling.",
      },
      {
        criterion: "Migration Planning",
        weight: 25,
        passingThreshold:
          "Incremental migration approach. Clear testing strategy. Risk mitigation for each phase. Rollback procedures defined. Realistic timeline with milestones.",
      },
      {
        criterion: "Business Case",
        weight: 20,
        passingThreshold:
          "Cost-benefit analysis includes time savings, reliability improvements, and potential costs. Success metrics measurable. Executive summary understandable to non-technical stakeholders.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=0qotVMX-J5s",
  documentation: [
    "https://www.docker.com/resources/what-container/",
    "https://www.redhat.com/en/topics/containers/whats-a-linux-container",
    "https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/",
  ],
  relatedConcepts: [
    "Container orchestration (Kubernetes)",
    "Microservices architecture",
    "Twelve-Factor App methodology",
    "Infrastructure as Code",
    "Immutable infrastructure",
    "Container security best practices",
  ],
};

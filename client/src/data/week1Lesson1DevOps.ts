/**
 * Week 1 Lesson 1 - What is DevOps?
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week1Lesson1WhatIsDevOps: LeveledLessonContent = {
  id: "week1-lesson1-what-is-devops",
  lessonId: "week1-lesson1-what-is-devops",

  baseLesson: {
    title: "What is DevOps? Culture, Principles & CI/CD",
    description:
      "Understand DevOps philosophy, culture, and core practices that bridge development and operations.",
    learningObjectives: [
      "Explain the cultural shift from siloed teams to collaborative DevOps",
      "Identify key DevOps principles: automation, continuous improvement, feedback",
      "Understand CI/CD pipeline stages and their business value",
      "Recognize DevOps tools and their role in the workflow",
    ],
    prerequisites: [
      "Basic understanding of software development",
      'Familiarity with terms like "deployment" and "testing"',
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 35,
      runGuided: 30,
      runIndependent: 25,
    },
  },

  crawl: {
    introduction:
      "Learn DevOps concepts step-by-step through guided explanations and visual mental models. No coding yet - focus on understanding the WHY before the HOW.",
    steps: [
      {
        stepNumber: 1,
        instruction:
          "Understand the problem: Traditional Waterfall Development",
        command:
          'Imagine: Dev team writes code for 6 months → hands to Ops → "It works on my machine!" → Ops struggles to deploy → blame game begins',
        explanation:
          'Before DevOps, developers and operations were separate silos. Developers wrote code, threw it "over the wall" to operations, who struggled to deploy and maintain it. No collaboration = slow releases, frequent failures.',
        expectedOutput:
          "Mental model: Two teams with a wall between them, throwing code packages over, finger-pointing when things break.",
        validationCriteria: [
          "You can explain why silos cause deployment delays",
          'You understand "It works on my machine" problem',
          "You see how lack of collaboration creates friction",
        ],
        commonMistakes: [
          "Thinking DevOps is just about tools (it's culture first)",
          "Believing only one team needs to change (both Dev and Ops must collaborate)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "The DevOps solution: Breaking down silos",
        command:
          "New model: Dev + Ops = DevOps → shared responsibility → build it, ship it, run it",
        explanation:
          "DevOps merges development and operations into collaborative teams. Developers care about production stability. Ops cares about development velocity. Everyone owns the full lifecycle.",
        expectedOutput:
          "Mental model: One unified team collaborating throughout planning, coding, building, testing, deploying, and monitoring.",
        validationCriteria: [
          'You can describe "shared ownership"',
          "You understand why collaboration speeds up delivery",
          "You see how DevOps reduces blame culture",
        ],
        commonMistakes: [
          "Thinking DevOps = rename Ops team to DevOps (no cultural change)",
          "Expecting instant transformation (it's a gradual culture shift)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Core Principle 1: Automation",
        command:
          "Manual deployments = slow, error-prone, not repeatable. Automated deployments = fast, consistent, reliable.",
        explanation:
          "Automation is the foundation of DevOps. Automate testing, building, deploying, infrastructure provisioning. Humans make mistakes; scripts don't (if written correctly). Automation enables speed and consistency.",
        expectedOutput:
          "Mental model: Developer pushes code → automated tests run → automated build → automated deployment → automated monitoring alerts if broken.",
        validationCriteria: [
          "You can list 3 things to automate (tests, builds, deployments)",
          "You understand automation reduces human error",
          "You see how automation enables faster releases",
        ],
        commonMistakes: [
          "Trying to automate everything at once (start small, iterate)",
          "Automating broken processes (fix process first, then automate)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Core Principle 2: Continuous Integration (CI)",
        command:
          "Developers merge code to main branch multiple times per day → automated tests run → catch bugs early",
        explanation:
          "CI means integrating code frequently (hourly/daily) instead of waiting weeks. Every commit triggers automated tests. Find bugs when they're fresh, not 6 months later. Small, frequent changes = easier to debug.",
        expectedOutput:
          "Mental model: Developer commits → CI server pulls code → runs tests → notifies team if tests fail → fix immediately.",
        validationCriteria: [
          "You can explain why frequent integration is better than big-bang integration",
          "You understand automated testing is crucial for CI",
          "You see how CI provides fast feedback",
        ],
        commonMistakes: [
          "Committing without running tests locally first",
          'Ignoring failing tests ("I\'ll fix it later")',
          "Making huge commits (defeats purpose of small iterations)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Core Principle 3: Continuous Delivery/Deployment (CD)",
        command:
          "Continuous Delivery = code is always ready to deploy. Continuous Deployment = code auto-deploys to production.",
        explanation:
          "CD extends CI: after code passes tests, it's automatically built and packaged for deployment. Continuous Delivery = manual approval to deploy. Continuous Deployment = fully automated to production. Both enable rapid releases.",
        expectedOutput:
          "Mental model: CI passes → build artifact → staging deployment → (manual approval OR auto) → production deployment → monitoring.",
        validationCriteria: [
          "You can distinguish Continuous Delivery from Continuous Deployment",
          "You understand CD requires robust automated testing",
          "You see how CD enables multiple releases per day",
        ],
        commonMistakes: [
          "Thinking CD means deploy every commit to production (can do staged rollouts)",
          "Skipping staging environments (test in prod-like environment first)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Core Principle 4: Infrastructure as Code (IaC)",
        command:
          "Instead of manually configuring servers, write code that provisions infrastructure automatically.",
        explanation:
          'IaC treats infrastructure (servers, networks, databases) as code. Version controlled, reviewable, repeatable. Spin up identical environments with one command. No more "snowflake servers" configured manually.',
        expectedOutput:
          "Mental model: Infrastructure configuration in Git → code review → automated provisioning → identical dev/staging/prod environments.",
        validationCriteria: [
          "You can explain why manual server setup is problematic",
          "You understand IaC enables environment consistency",
          "You see how IaC makes disaster recovery faster",
        ],
        commonMistakes: [
          "Hardcoding credentials in IaC files (use secrets management)",
          "Not version controlling infrastructure code (defeats purpose)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Core Principle 5: Monitoring and Feedback Loops",
        command:
          "Monitor everything: app performance, errors, user behavior → fast feedback → continuous improvement",
        explanation:
          "DevOps requires observability. Monitoring alerts you to problems before users notice. Logs help debug issues. Metrics show trends. Feedback loops: monitor production → learn → improve → deploy changes → monitor again.",
        expectedOutput:
          "Mental model: Production app → metrics/logs/alerts → dashboards → team responds to issues → deploys fixes → monitors effectiveness.",
        validationCriteria: [
          "You can name 3 things to monitor (errors, performance, availability)",
          "You understand monitoring enables proactive problem solving",
          "You see how feedback drives continuous improvement",
        ],
        commonMistakes: [
          "Setting up monitoring but ignoring alerts (alert fatigue)",
          "Only monitoring after incidents (monitor proactively)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "The CI/CD Pipeline: Overview",
        command:
          "Stages: Code → Build → Test → Deploy → Monitor (repeat continuously)",
        explanation:
          "A CI/CD pipeline is an automated workflow. Developer commits code, pipeline builds it, runs tests (unit, integration, security), deploys to environments (dev → staging → prod), and monitors results. Fully automated end-to-end.",
        expectedOutput:
          "Mental model: Pipeline visualization with stages: Source Control → CI Server → Automated Tests → Build Artifacts → Deployment → Production Monitoring.",
        validationCriteria: [
          "You can name the 5 main pipeline stages",
          "You understand each stage is automated",
          "You see how pipeline enables rapid iteration",
        ],
        commonMistakes: [
          'Skipping stages to "move faster" (shortcuts create bugs)',
          "Not failing fast (catch errors early in pipeline, not late)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "DevOps Tools Ecosystem: Categories",
        command:
          "Version Control: Git. CI/CD: Jenkins, GitHub Actions. Containers: Docker. Orchestration: Kubernetes. IaC: Terraform. Monitoring: Prometheus, Grafana.",
        explanation:
          "DevOps has many tools, but they fall into categories: version control (Git), CI/CD platforms (Jenkins, CircleCI), containerization (Docker), orchestration (Kubernetes), infrastructure automation (Terraform, Ansible), monitoring (Datadog, New Relic). Tools change, principles stay.",
        expectedOutput:
          "Mental model: Tool categories mapped to pipeline stages. Different tools, same workflow.",
        validationCriteria: [
          "You can name one tool per category",
          "You understand tools enable principles, not replace them",
          "You see how tools integrate into pipeline",
        ],
        commonMistakes: [
          "Tool obsession without understanding principles",
          "Thinking one tool solves everything (need integrated toolchain)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "DevOps Culture: Collaboration over Blame",
        command:
          "Blameless postmortems: When failure happens, focus on fixing systems, not blaming people.",
        explanation:
          "DevOps culture emphasizes psychological safety. Failures are learning opportunities. Blameless postmortems analyze what went wrong without pointing fingers. Goal: improve processes and prevent recurrence. Blame culture kills innovation.",
        expectedOutput:
          "Mental model: Incident → blameless postmortem → root cause analysis → system improvements → better resilience.",
        validationCriteria: [
          "You can explain blameless postmortems",
          "You understand why blame culture is harmful",
          "You see how learning from failures improves systems",
        ],
        commonMistakes: [
          "Public shaming after incidents (destroys trust)",
          "Superficial fixes without addressing root causes",
        ],
      },
      {
        stepNumber: 11,
        instruction: "DevOps Metrics: Measuring Success",
        command:
          "Key metrics: Deployment Frequency, Lead Time, Mean Time to Recovery (MTTR), Change Failure Rate",
        explanation:
          "DevOps performance is measurable. Deploy Frequency = how often you release. Lead Time = time from code commit to production. MTTR = how fast you recover from failures. Change Failure Rate = % of deployments causing incidents. Elite teams deploy multiple times/day with <1hr recovery.",
        expectedOutput:
          "Mental model: Metrics dashboard showing trends over time, comparing team to industry benchmarks.",
        validationCriteria: [
          "You can define all 4 DORA metrics",
          "You understand faster/smaller releases are better than slow/big releases",
          "You see how metrics drive improvement",
        ],
        commonMistakes: [
          "Gaming metrics (e.g., meaningless commits to boost frequency)",
          "Focusing on one metric while ignoring others (need balanced view)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "DevOps Benefits: Business Value",
        command:
          "Faster time to market, higher quality, better reliability, happier teams, competitive advantage",
        explanation:
          "DevOps delivers measurable business value: ship features faster (competitive advantage), fewer bugs (automated testing), less downtime (monitoring + fast recovery), reduced costs (automation), happier engineers (less firefighting, more innovation). Not just tech improvement - business transformation.",
        expectedOutput:
          "Mental model: DevOps practices → faster delivery + higher quality + better stability → business growth + customer satisfaction.",
        validationCriteria: [
          "You can articulate 3 business benefits of DevOps",
          "You understand DevOps impacts bottom line, not just tech",
          "You see connection between DevOps maturity and business success",
        ],
        commonMistakes: [
          "Viewing DevOps as purely technical (it's business strategy)",
          "Expecting instant ROI (transformation takes time, compounds over months)",
        ],
      },
    ],
    expectedOutcome:
      "You understand DevOps as a cultural and technical transformation. You can explain core principles (automation, CI/CD, IaC, monitoring), describe pipeline stages, identify key tools, and articulate business value. You're ready to apply DevOps thinking.",
  },

  walk: {
    introduction:
      "Apply DevOps knowledge by analyzing scenarios and matching practices to problems. Fill in blanks to demonstrate understanding.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "A company deploys to production once per quarter. Deployments take 12 hours and frequently fail. Teams blame each other.",
        template:
          "Problem: __LONG_RELEASE_CYCLE__ and __MANUAL_PROCESS__\nDevOps Solution: Implement __CI_CD__ to enable __FREQUENT_RELEASES__\nCultural Fix: Establish __BLAMELESS_CULTURE__ and __SHARED_OWNERSHIP__",
        blanks: [
          {
            id: "LONG_RELEASE_CYCLE",
            label: "LONG_RELEASE_CYCLE",
            hint: "Quarterly releases are too...",
            correctValue: "infrequent deployments",
            validationPattern: ".*(infrequent|slow|rare).*",
          },
          {
            id: "MANUAL_PROCESS",
            label: "MANUAL_PROCESS",
            hint: "12-hour manual deployments are error-prone because they lack...",
            correctValue: "automation",
            validationPattern: ".*(automation|auto).*",
          },
          {
            id: "CI_CD",
            label: "CI_CD",
            hint: "Pipeline that automates build, test, deploy",
            correctValue: "CI/CD pipeline",
            validationPattern: ".*(CI.*CD|pipeline|continuous).*",
          },
          {
            id: "FREQUENT_RELEASES",
            label: "FREQUENT_RELEASES",
            hint: "Instead of quarterly, aim for...",
            correctValue: "daily or weekly releases",
            validationPattern: ".*(daily|weekly|frequent|multiple).*",
          },
          {
            id: "BLAMELESS_CULTURE",
            label: "BLAMELESS_CULTURE",
            hint: "When failures happen, focus on systems not...",
            correctValue: "blameless postmortems",
            validationPattern: ".*(blameless|learning|no.*blame).*",
          },
          {
            id: "SHARED_OWNERSHIP",
            label: "SHARED_OWNERSHIP",
            hint: "Dev and Ops together own the product from code to production",
            correctValue: "shared responsibility",
            validationPattern: ".*(shared|collaborative|unified).*",
          },
        ],
        solution:
          "Problem: infrequent deployments and lack of automation\nDevOps Solution: Implement CI/CD pipeline to enable daily/weekly releases\nCultural Fix: Establish blameless postmortems and shared responsibility",
        explanation:
          "Quarterly releases = large, risky changes. Automation + frequent small releases reduce risk. Blameless culture enables learning from failures.",
      },
      {
        exerciseNumber: 2,
        scenario:
          "Development works fine locally, but production environment is configured differently. Deployments break due to environment inconsistencies.",
        template:
          "Root Cause: __MANUAL_CONFIG__ leads to __ENVIRONMENT_DRIFT__\nDevOps Practice: Use __IAC__ to define infrastructure as __VERSION_CONTROLLED__ code\nBenefit: __REPRODUCIBLE__ environments across dev/staging/prod",
        blanks: [
          {
            id: "MANUAL_CONFIG",
            label: "MANUAL_CONFIG",
            hint: "Servers configured by hand, not code",
            correctValue: "manual server configuration",
            validationPattern: ".*(manual|hand|clickops).*",
          },
          {
            id: "ENVIRONMENT_DRIFT",
            label: "ENVIRONMENT_DRIFT",
            hint: "When environments become different over time",
            correctValue: "configuration drift",
            validationPattern: ".*(drift|inconsisten|differ).*",
          },
          {
            id: "IAC",
            label: "IAC",
            hint: "Infrastructure as...",
            correctValue: "Code",
            validationPattern: "^[Cc]ode$",
          },
          {
            id: "VERSION_CONTROLLED",
            label: "VERSION_CONTROLLED",
            hint: "Infrastructure code stored in Git, enabling...",
            correctValue: "version control",
            validationPattern: ".*(version|git|scm).*",
          },
          {
            id: "REPRODUCIBLE",
            label: "REPRODUCIBLE",
            hint: "IaC enables creating identical environments that are...",
            correctValue: "consistent and reproducible",
            validationPattern: ".*(reproducible|identical|consistent).*",
          },
        ],
        solution:
          "Root Cause: manual server configuration leads to configuration drift\nDevOps Practice: Use Infrastructure as Code to define infrastructure as version-controlled code\nBenefit: consistent and reproducible environments across dev/staging/prod",
        explanation:
          'Manual configuration creates "snowflake servers". IaC ensures all environments match, eliminating "works on my machine" problems.',
      },
      {
        exerciseNumber: 3,
        scenario:
          "A critical bug is discovered in production. It takes 4 hours to identify the root cause because there's no centralized logging.",
        template:
          "Missing DevOps Practice: __MONITORING_OBSERVABILITY__\nImplementation: Deploy __CENTRALIZED_LOGGING__ and __METRICS_DASHBOARD__\nResult: Reduce __MTTR__ from 4 hours to __MINUTES__\nEnables: __PROACTIVE__ issue detection before users report",
        blanks: [
          {
            id: "MONITORING_OBSERVABILITY",
            label: "MONITORING_OBSERVABILITY",
            hint: "Ability to understand system health via logs, metrics, traces",
            correctValue: "monitoring and observability",
            validationPattern: ".*(monitor|observ|visibility).*",
          },
          {
            id: "CENTRALIZED_LOGGING",
            label: "CENTRALIZED_LOGGING",
            hint: "All logs aggregated in one place (e.g., ELK stack, Splunk)",
            correctValue: "centralized logging",
            validationPattern: ".*(central|aggregat|unified).*log.*",
          },
          {
            id: "METRICS_DASHBOARD",
            label: "METRICS_DASHBOARD",
            hint: "Visual display of system health (Grafana, Datadog)",
            correctValue: "metrics dashboards",
            validationPattern: ".*(metric|dashboard|grafana).*",
          },
          {
            id: "MTTR",
            label: "MTTR",
            hint: "DevOps metric: Mean Time to...",
            correctValue: "Recovery",
            validationPattern: ".*(recover|restoration|repair).*",
          },
          {
            id: "MINUTES",
            label: "MINUTES",
            hint: "Elite DevOps teams recover from incidents in...",
            correctValue: "minutes",
            validationPattern: ".*(minute|min|<.*hour).*",
          },
          {
            id: "PROACTIVE",
            label: "PROACTIVE",
            hint: "Detecting issues before they impact users, not reactive",
            correctValue: "proactive",
            validationPattern: ".*(proactive|early|before).*",
          },
        ],
        solution:
          "Missing DevOps Practice: monitoring and observability\nImplementation: Deploy centralized logging and metrics dashboards\nResult: Reduce MTTR from 4 hours to minutes\nEnables: proactive issue detection before users report",
        explanation:
          "Without observability, debugging is guesswork. Centralized logging + metrics enable fast root cause analysis and proactive alerting.",
      },
      {
        exerciseNumber: 4,
        scenario:
          "Developers merge a week's worth of code at once. Integration takes 2 days and reveals hundreds of conflicts and test failures.",
        template:
          "Anti-pattern: __BIG_BANG_INTEGRATION__ (infrequent, large merges)\nDevOps Practice: __CONTINUOUS_INTEGRATION__ with __SMALL_COMMITS__\nRequires: __AUTOMATED_TESTS__ that run on every __COMMIT__\nBenefit: Catch bugs __IMMEDIATELY__ when code is fresh, not days later",
        blanks: [
          {
            id: "BIG_BANG_INTEGRATION",
            label: "BIG_BANG_INTEGRATION",
            hint: "Waiting to integrate large amounts of code at once",
            correctValue: "big bang integration",
            validationPattern: ".*(big.*bang|batch|infrequent.*integration).*",
          },
          {
            id: "CONTINUOUS_INTEGRATION",
            label: "CONTINUOUS_INTEGRATION",
            hint: "Merging code to main branch multiple times per day",
            correctValue: "Continuous Integration",
            validationPattern: ".*(CI|continuous.*integr).*",
          },
          {
            id: "SMALL_COMMITS",
            label: "SMALL_COMMITS",
            hint: "Frequent, incremental changes instead of massive commits",
            correctValue: "small, frequent commits",
            validationPattern: ".*(small|frequent|incremental).*",
          },
          {
            id: "AUTOMATED_TESTS",
            label: "AUTOMATED_TESTS",
            hint: "Tests that run without human intervention",
            correctValue: "automated tests",
            validationPattern: ".*(automat.*test|test.*automat).*",
          },
          {
            id: "COMMIT",
            label: "COMMIT",
            hint: "Trigger point for CI pipeline",
            correctValue: "commit",
            validationPattern: ".*(commit|push|merge).*",
          },
          {
            id: "IMMEDIATELY",
            label: "IMMEDIATELY",
            hint: "Fast feedback loop, not delayed",
            correctValue: "immediately",
            validationPattern: ".*(immediate|instant|fast|quick).*",
          },
        ],
        solution:
          "Anti-pattern: big bang integration (infrequent, large merges)\nDevOps Practice: Continuous Integration with small, frequent commits\nRequires: automated tests that run on every commit\nBenefit: Catch bugs immediately when code is fresh, not days later",
        explanation:
          "Large, infrequent integrations = merge hell. CI with small commits = easier debugging, faster feedback, less risk.",
      },
      {
        exerciseNumber: 5,
        scenario:
          "Company wants to measure DevOps improvement. They need metrics to track progress over time.",
        template:
          "The 4 DORA Metrics:\n1. __DEPLOY_FREQUENCY__: How often we release to production\n2. __LEAD_TIME__: Time from commit to production deployment\n3. __MTTR__: Mean time to recover from failures\n4. __CHANGE_FAIL_RATE__: Percentage of deployments causing incidents\n\nElite Performance: Deploy __MULTIPLE_TIMES_DAILY__ with <1 hour recovery",
        blanks: [
          {
            id: "DEPLOY_FREQUENCY",
            label: "DEPLOY_FREQUENCY",
            hint: "How often code is deployed to production",
            correctValue: "Deployment Frequency",
            validationPattern: ".*(deploy|frequency|how.*often).*",
          },
          {
            id: "LEAD_TIME",
            label: "LEAD_TIME",
            hint: "Time from code commit to running in production",
            correctValue: "Lead Time for Changes",
            validationPattern: ".*(lead.*time|time.*change|cycle.*time).*",
          },
          {
            id: "MTTR",
            label: "MTTR",
            hint: "Mean Time to...",
            correctValue: "Recovery",
            validationPattern: ".*(recover|restoration|repair).*",
          },
          {
            id: "CHANGE_FAIL_RATE",
            label: "CHANGE_FAIL_RATE",
            hint: "What percentage of changes cause production incidents",
            correctValue: "Change Failure Rate",
            validationPattern: ".*(change.*fail|fail.*rate|failure).*",
          },
          {
            id: "MULTIPLE_TIMES_DAILY",
            label: "MULTIPLE_TIMES_DAILY",
            hint: "Elite teams deploy on-demand, often multiple times per...",
            correctValue: "multiple times per day",
            validationPattern: ".*(multiple|daily|day|on.*demand|frequent).*",
          },
        ],
        solution:
          "The 4 DORA Metrics:\n1. Deployment Frequency: How often we release to production\n2. Lead Time for Changes: Time from commit to production deployment\n3. Mean Time to Recovery: Mean time to recover from failures\n4. Change Failure Rate: Percentage of deployments causing incidents\n\nElite Performance: Deploy multiple times per day with <1 hour recovery",
        explanation:
          "DORA metrics (from Accelerate book) measure DevOps performance. Elite teams optimize all four metrics simultaneously.",
      },
    ],
    hints: [
      "DevOps is culture + automation + measurement",
      "Small, frequent changes are less risky than large, infrequent ones",
      "Automation enables speed; monitoring enables reliability",
      "Blameless culture is prerequisite for continuous improvement",
    ],
  },

  runGuided: {
    objective:
      "Analyze your current organization's development workflow and identify DevOps improvement opportunities",
    conceptualGuidance: [
      "Document current state: How often do you deploy? How long does it take? How many manual steps?",
      "Identify pain points: Where are bottlenecks? What causes delays? What manual processes are error-prone?",
      "Map to DevOps principles: Which principles could address each pain point?",
      "Prioritize improvements: Start with highest-impact, lowest-effort changes",
      "Propose pilot project: Choose one workflow to transform as proof of concept",
      "Define success metrics: How will you measure improvement?",
    ],
    keyConceptsToApply: [
      "CI/CD pipeline stages",
      "Automation opportunities",
      "Infrastructure as Code",
      "Monitoring and observability",
      "DORA metrics for measurement",
    ],
    checkpoints: [
      {
        checkpoint: "Current state documented",
        description:
          "Written analysis of existing development and deployment workflow",
        validationCriteria: [
          'Documented deployment frequency (e.g., "quarterly releases")',
          'Identified manual steps (e.g., "manual server configuration, 12 steps")',
          'Listed common failure modes (e.g., "config mismatch, dependency conflicts")',
          'Estimated time metrics (e.g., "code to production: 6 weeks")',
        ],
        hintIfStuck:
          'Interview team members: developers, QA, operations. Ask: "Describe the process from code commit to production." Map every step.',
      },
      {
        checkpoint: "Pain points identified and categorized",
        description: "At least 5 specific problems mapped to DevOps solutions",
        validationCriteria: [
          "Each pain point has clear description",
          "Impact assessment (high/medium/low)",
          'Mapped to DevOps principle (e.g., "manual testing → CI automation")',
          "Estimated effort to fix (high/medium/low)",
        ],
        hintIfStuck:
          "Common pain points: manual testing, environment drift, slow deployments, lack of monitoring, siloed teams. Which apply to your org?",
      },
      {
        checkpoint: "DevOps transformation proposal",
        description:
          "Concrete plan with pilot project, timeline, and success criteria",
        validationCriteria: [
          'Chosen pilot project (e.g., "automate testing for service X")',
          'Defined phases (e.g., "Phase 1: CI setup, Phase 2: automated tests")',
          "Success metrics using DORA framework",
          "Timeline with milestones (realistic 3-6 month plan)",
          "Required resources (tools, training, time)",
        ],
        hintIfStuck:
          "Start small: pick one service, automate its testing and deployment first. Prove value before scaling.",
      },
    ],
    resourcesAllowed: [
      'Google for "DevOps transformation case studies"',
      "Read Accelerate (DORA metrics book)",
      "Interview team members about current workflow",
    ],
  },

  runIndependent: {
    objective:
      "Create a comprehensive DevOps transformation strategy for a fictional company, demonstrating deep understanding of principles, culture, and measurement. Your strategy should include: current state analysis with specific metrics (deployment frequency, lead time, failure rate), identified pain points across culture, automation, and monitoring, a phased transformation roadmap with clear goals and timelines, cultural transformation plan for shifting from blame to collaboration, technical transformation plan including CI/CD pipeline architecture and tool choices, measurement framework with baseline and target DORA metrics, risk mitigation strategies for common obstacles, and business case justification with estimated ROI and business value.",
    companyProfile: {
      name: "TechCorp Solutions",
      description:
        "TechCorp Solutions is a mid-sized software company (150 employees) that builds SaaS applications for small businesses. They have been in business for 8 years and serve 5,000+ customers with their project management and invoicing platform.",
      currentMetrics: {
        deploymentFrequency: "Monthly (1 deployment per month on average)",
        leadTimeForChanges: "2-3 weeks from code commit to production",
        changeFailureRate:
          "25% of deployments cause incidents requiring hotfixes",
        timeToRestoreService: "4-6 hours to recover from production incidents",
      },
      teamStructure: {
        development: "12 developers across 3 teams",
        operations: "4 system administrators",
        qa: "3 manual testers",
        management: "No dedicated DevOps or SRE roles",
      },
      technologyStack: {
        frontend: "React.js with manual deployment to shared hosting",
        backend: "Node.js API with manual database migrations",
        infrastructure: "AWS EC2 instances with manual scaling",
        ciCd: "GitHub for version control, no automated pipelines",
        monitoring:
          "Basic server monitoring, no application performance monitoring",
      },
      currentChallenges: [
        'Developers throw code "over the wall" to ops team',
        "Manual testing takes 3-4 days per release",
        "Production deployments happen at 2 AM on weekends",
        'Frequent "it works on my machine" issues',
        "No visibility into application performance or errors",
        "Security vulnerabilities discovered months after deployment",
        "Customer complaints about slow feature delivery",
      ],
      businessContext:
        "TechCorp is losing market share to more agile competitors. Leadership recognizes they need to deliver features faster and more reliably. They have budget for tools and training but need a clear transformation plan.",
    },
    successCriteria: [
      "Detailed current state analysis with specific metrics (deploy frequency, lead time, failure rate)",
      "Identified 8+ pain points across culture, automation, and monitoring",
      "Proposed DevOps transformation roadmap with 3 phases over 12 months",
      "Each phase has specific goals, tools, practices, and success metrics",
      "Cultural transformation plan: how to shift from blame to collaboration",
      "Technical transformation plan: CI/CD pipeline architecture with tool choices",
      "Measurement framework: baseline and target DORA metrics",
      "Risk mitigation: identified obstacles and mitigation strategies",
      "Business case: estimated ROI and business value (time saved, quality improved)",
    ],
    timeTarget: 25,
    minimumRequirements: [
      "Current state documented with at least 3 measurable pain points",
      "Transformation roadmap with at least 2 phases",
      "Success metrics defined using DORA framework",
    ],
    evaluationRubric: [
      {
        criterion: "Analysis Depth",
        weight: 25,
        passingThreshold:
          "Current state includes specific metrics, not vague statements. Pain points are concrete and well-understood.",
      },
      {
        criterion: "DevOps Understanding",
        weight: 30,
        passingThreshold:
          "Demonstrates understanding of culture, automation, CI/CD, IaC, and monitoring. Proposed solutions align with DevOps principles.",
      },
      {
        criterion: "Practical Roadmap",
        weight: 25,
        passingThreshold:
          "Transformation plan is realistic, phased, and prioritized. Starts small, scales incrementally. Includes timelines and milestones.",
      },
      {
        criterion: "Business Value",
        weight: 20,
        passingThreshold:
          "Articulates business impact: faster time to market, higher quality, reduced costs. Uses metrics to quantify improvement.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=_I94-tJlovg",
  documentation: [
    "https://www.atlassian.com/devops",
    "https://aws.amazon.com/devops/what-is-devops/",
    "https://cloud.google.com/devops",
    "Book: Accelerate (DORA metrics research)",
  ],
  relatedConcepts: [
    "Agile methodology",
    "Site Reliability Engineering (SRE)",
    "CI/CD pipelines",
    "Infrastructure as Code",
    "Blameless postmortems",
    "DORA metrics (Deployment Frequency, Lead Time, MTTR, Change Failure Rate)",
  ],
};

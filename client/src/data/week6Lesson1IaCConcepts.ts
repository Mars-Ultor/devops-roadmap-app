/**
 * Week 6 Lesson 1 - Infrastructure as Code Concepts
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week6Lesson1IaCConcepts: LeveledLessonContent = {
  lessonId: "week6-lesson1-iac-concepts",

  baseLesson: {
    title: "Infrastructure as Code: Treating Infrastructure Like Software",
    description:
      "Understand IaC principles, benefits, and how it revolutionizes infrastructure management.",
    learningObjectives: [
      "Explain Infrastructure as Code and its benefits",
      "Understand declarative vs imperative approaches",
      "Recognize when IaC adds value",
      "Identify IaC tools and their use cases",
      "Apply version control to infrastructure",
    ],
    prerequisites: [
      "Cloud computing basics",
      "Git version control",
      "Basic understanding of servers and networking",
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
      "Learn Infrastructure as Code step-by-step: problems it solves, declarative vs imperative, IaC tools, version control benefits, and best practices.",
    steps: [
      {
        stepNumber: 1,
        instruction: "The problem: Manual infrastructure management",
        command:
          "Traditional manual process:\n1. Log into AWS console\n2. Click buttons to create EC2 instance\n3. Configure security groups manually\n4. Set up load balancer through UI\n5. Document changes in wiki (maybe)\n6. Repeat for staging and production\n\nProblems:\n- Inconsistent environments (different settings)\n- No audit trail (who changed what?)\n- Slow to replicate (click everything again)\n- Human error (forget security group rule)\n- No versioning (can't rollback infrastructure)",
        explanation:
          "Manual infrastructure: Click-ops through console. Inconsistent configurations. No history of changes. Mistakes happen. Can't easily replicate or rollback. Knowledge in people's heads, not documented.",
        expectedOutput:
          "Understanding: Manual infrastructure management is error-prone, slow, and not reproducible.",
        validationCriteria: [
          "See inconsistency problems",
          "Understand lack of audit trail",
          "Recognize manual error risk",
          "Want automated, reproducible infrastructure",
          "Need version control for infrastructure",
        ],
        commonMistakes: [
          "Thinking manual is fine for small projects (technical debt accumulates)",
          "Relying on documentation (gets outdated)",
          "Believing clicking is faster (only initially, not long-term)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Infrastructure as Code: Infrastructure in text files",
        command:
          "IaC approach:\n1. Define infrastructure in code file (main.tf, cloudformation.yml)\n2. Commit to Git (version control)\n3. Review changes in pull request\n4. Run code to create infrastructure\n5. Same code creates identical staging and production\n\nBenefits:\n- Consistent environments (same code = same infrastructure)\n- Version controlled (Git history shows all changes)\n- Reviewable (PR process for infrastructure changes)\n- Documented (code IS the documentation)\n- Reproducible (run code again, get same result)",
        explanation:
          "IaC = infrastructure defined in text files. Version controlled like application code. Changes reviewed before applied. Automated creation ensures consistency. Code documents infrastructure.",
        expectedOutput:
          "Understanding: IaC treats infrastructure like software code - versioned, reviewed, and automated.",
        validationCriteria: [
          "Infrastructure defined as code",
          "Version control tracks changes",
          "PR review process for infrastructure",
          "Automated, reproducible deployments",
          "Code is single source of truth",
        ],
        commonMistakes: [
          "Mixing manual and IaC (causes drift)",
          "Not reviewing infrastructure changes (defeats safety purpose)",
          "Treating IaC as just automation (miss version control value)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Declarative vs Imperative IaC",
        command:
          'IMPERATIVE (How to do it):\n# Script with explicit steps\naws ec2 run-instances --image-id ami-123\naws ec2 create-security-group --group-name web\naws ec2 authorize-security-group-ingress --port 80\n\nDECLARATIVE (What you want):\n# Describe desired state\nresource "aws_instance" "web" {\n  ami = "ami-123"\n  instance_type = "t2.micro"\n}\n\nresource "aws_security_group" "web" {\n  ingress {\n    from_port = 80\n    to_port = 80\n  }\n}\n\nTool figures out how to create it',
        explanation:
          "Imperative: Explicit steps (create this, then that). Declarative: Describe desired end state, tool handles how. Declarative is easier to understand and maintain. Most modern IaC tools are declarative.",
        expectedOutput:
          "Understanding: Declarative IaC describes desired state, tool determines steps to achieve it.",
        validationCriteria: [
          "Imperative = step-by-step instructions",
          "Declarative = describe goal",
          "Declarative is idempotent (run multiple times safely)",
          "Declarative easier to understand",
          "Modern tools mostly declarative",
        ],
        commonMistakes: [
          "Writing imperative scripts thinking it's IaC (not fully leveraging IaC benefits)",
          "Not understanding idempotency (run twice, create duplicate resources)",
          "Mixing declarative and imperative (consistency issues)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "IaC Benefits: Version control for infrastructure",
        command:
          'Git for infrastructure:\n\n# History of all changes\ngit log infrastructure/main.tf\n\n# Who changed what when\ngit blame infrastructure/main.tf\n\n# Rollback to previous version\ngit revert abc123\nterraform apply\n\n# Branch for new feature\ngit checkout -b add-monitoring\n# Add monitoring infrastructure\ngit commit -m "Add CloudWatch alarms"\n# PR review before merging',
        explanation:
          "Infrastructure in Git = full audit trail. See who changed what, when, why (commit messages). Rollback to previous state. Branch for experimentation. PR review for infrastructure changes. Same workflow as application code.",
        expectedOutput:
          "Understanding: Version control provides infrastructure change history, rollback, and review processes.",
        validationCriteria: [
          "Infrastructure changes tracked in Git",
          "Full history and blame available",
          "Can rollback to previous versions",
          "Branching for safe experimentation",
          "PR review before production changes",
        ],
        commonMistakes: [
          "Not committing infrastructure code (defeats version control purpose)",
          "Poor commit messages (can't understand change history)",
          "No PR review (miss opportunity to catch errors)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Idempotency: Run multiple times safely",
        command:
          'Idempotent operation:\n\n# First run: Creates 5 EC2 instances\nterraform apply\n\n# Second run (no code changes): No changes made\nterraform apply\n# Output: "No changes. Infrastructure is up-to-date."\n\n# If instance manually deleted:\nterraform apply\n# Output: "Will create 1 EC2 instance to match desired state"\n\nResult: Same every time, regardless of starting state',
        explanation:
          "Idempotency = same result no matter how many times you run it. IaC tools detect current state, only make necessary changes. Run again with no code changes = no infrastructure changes. Corrects drift (manual changes).",
        expectedOutput:
          "Understanding: Idempotent IaC can be run repeatedly safely, ensuring desired state.",
        validationCriteria: [
          "Running IaC twice with no code changes makes no infrastructure changes",
          "IaC detects current state",
          "Only applies differences",
          "Corrects configuration drift",
          "Safe to run anytime",
        ],
        commonMistakes: [
          "Non-idempotent scripts that create duplicates (AWS CLI scripts can do this)",
          "Not checking current state (make unnecessary changes)",
          "Manual changes that IaC will revert (fight automation)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Configuration Drift: IaC detects manual changes",
        command:
          'Scenario:\n1. IaC creates infrastructure (5 servers)\n2. Someone manually adds 6th server via console\n3. Run IaC again:\n\nterraform plan\n# Output: "Will remove 1 EC2 instance (not in code)"\n\nterraform apply\n# Removes manual server, restores to code-defined state\n\nIaC is single source of truth',
        explanation:
          'Configuration drift = actual infrastructure differs from code. Manual changes cause drift. IaC detects drift on next run. Reverts to code-defined state. Enforces "code is truth" principle.',
        expectedOutput:
          "Understanding: IaC detects and corrects drift, maintaining infrastructure consistency with code.",
        validationCriteria: [
          "Drift detected by comparing code to actual state",
          "IaC shows what will change before applying",
          "Manual changes are reverted to match code",
          "Code is single source of truth",
          "Prevents environment inconsistency",
        ],
        commonMistakes: [
          "Making manual changes (will be reverted)",
          "Not importing manual resources into IaC (get deleted)",
          "Fighting IaC drift correction (update code instead)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "IaC Tools: Terraform, CloudFormation, Pulumi, Ansible",
        command:
          "Major IaC tools:\n\nTERRAFORM (HashiCorp):\n- Multi-cloud (AWS, Azure, GCP, etc.)\n- Declarative HCL language\n- Large provider ecosystem\n- State management\n\nCLOUDFORMATION (AWS):\n- AWS only\n- Declarative YAML/JSON\n- Native AWS integration\n- No external state\n\nPULUMI:\n- Multi-cloud\n- Use real programming languages (TypeScript, Python)\n- Modern, flexible\n\nANSIBLE:\n- Configuration management + provisioning\n- Agentless\n- YAML playbooks",
        explanation:
          "Terraform: Most popular, multi-cloud, large ecosystem. CloudFormation: AWS native, simpler for AWS-only. Pulumi: Code in real languages. Ansible: Broader config management. Choice depends on cloud, team skills, requirements.",
        expectedOutput:
          "Understanding: Multiple IaC tools available, each with strengths for different use cases.",
        validationCriteria: [
          "Terraform for multi-cloud",
          "CloudFormation for AWS-only",
          "Pulumi for programming language preference",
          "Ansible for config management too",
          "Choose based on requirements",
        ],
        commonMistakes: [
          "Using wrong tool for use case (CloudFormation for multi-cloud)",
          "Tool proliferation (stick to one or two)",
          "Not considering team skills",
        ],
      },
      {
        stepNumber: 8,
        instruction: "State Management: Tracking infrastructure reality",
        command:
          'State file (terraform.tfstate):\n{\n  "version": 4,\n  "resources": [\n    {\n      "type": "aws_instance",\n      "name": "web",\n      "instances": [{"id": "i-123456", "public_ip": "1.2.3.4"}]\n    }\n  ]\n}\n\nState tracks:\n- What resources exist\n- Their current configuration\n- Dependencies between resources\n- Metadata (created time, tags)\n\nCRITICAL: Store state remotely (S3, Terraform Cloud), not locally',
        explanation:
          "State file = IaC tool's memory of infrastructure. Maps code to actual resources. Used to detect drift and plan changes. Must be shared across team (remote storage). Losing state = losing track of infrastructure.",
        expectedOutput:
          "Understanding: State files track infrastructure reality, must be stored remotely for team collaboration.",
        validationCriteria: [
          "State maps code to real resources",
          "Used for drift detection",
          "Required for planning changes",
          "Must be shared (remote backend)",
          "Critical to protect (contains sensitive data)",
        ],
        commonMistakes: [
          "Storing state locally (team can't collaborate)",
          "Losing state file (catastrophic)",
          "Checking state into Git (contains secrets)",
          "Multiple people running IaC concurrently (state conflicts)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Modules and Reusability",
        command:
          'Module example:\n\n# modules/web-server/main.tf\nresource "aws_instance" "web" {\n  ami = var.ami\n  instance_type = var.instance_type\n}\n\nresource "aws_security_group" "web" {\n  # Security group config\n}\n\n# Use module multiple times:\nmodule "dev_server" {\n  source = "./modules/web-server"\n  ami = "ami-123"\n  instance_type = "t2.micro"\n}\n\nmodule "prod_server" {\n  source = "./modules/web-server"\n  ami = "ami-123"\n  instance_type = "t2.large"\n}',
        explanation:
          "Modules = reusable infrastructure components. Define once, use many times with different parameters. Promotes consistency. Reduces duplication. Teams share modules. Like functions in programming.",
        expectedOutput:
          "Understanding: Modules enable infrastructure code reuse and standardization.",
        validationCriteria: [
          "Modules encapsulate infrastructure patterns",
          "Reusable with parameters",
          "Promote consistency across environments",
          "Reduce code duplication",
          "Team can share best practices",
        ],
        commonMistakes: [
          "Duplicating infrastructure code (should use modules)",
          "Modules too complex (hard to understand)",
          "Not versioning modules (breaking changes)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Environments: Dev, Staging, Production",
        command:
          "Environment strategy:\n\nOPTION 1: Separate directories\ninfrastructure/\n  dev/\n    main.tf\n  staging/\n    main.tf\n  production/\n    main.tf\n\nOPTION 2: Workspaces\nterraform workspace new dev\nterraform workspace new staging\nterraform workspace new production\n\nOPTION 3: Separate repos\ninfra-dev/\ninfra-staging/\ninfra-production/\n\nBest practice: Same code, different variable files",
        explanation:
          "Multiple environment management strategies. Separate dirs/workspaces/repos. Key: use same IaC code with different variables (instance sizes, counts). Ensures consistency while allowing environment-specific config.",
        expectedOutput:
          "Understanding: Multiple strategies for managing dev, staging, production with IaC.",
        validationCriteria: [
          "Same code for all environments",
          "Different variables per environment",
          "Clear separation of state",
          "Can't accidentally affect wrong environment",
          "Easy to promote changes through environments",
        ],
        commonMistakes: [
          "Different code for each environment (drift)",
          "Shared state across environments (dangerous)",
          "No naming convention (confusion which is which)",
        ],
      },
    ],
    expectedOutcome:
      "You understand IaC principles, benefits over manual infrastructure, declarative vs imperative approaches, idempotency, state management, modules, and environment strategies. You can explain when and why to use IaC.",
  },

  walk: {
    introduction:
      "Apply Infrastructure as Code concepts through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Compare manual infrastructure vs IaC for multi-environment setup.",
        template:
          "MANUAL APPROACH:\n- Time: __HOURS__ to set up each environment\n- Consistency: __INCONSISTENT__ (human error)\n- Documentation: __OUTDATED__ wiki pages\n- Rollback: __DIFFICULT__ (manual steps)\n- Audit: __NO_TRAIL__ of who changed what\n\nIaC APPROACH:\n- Time: __MINUTES__ (terraform apply)\n- Consistency: __IDENTICAL__ environments (same code)\n- Documentation: __CODE_IS_DOCS__ (self-documenting)\n- Rollback: __GIT_REVERT__ (seconds)\n- Audit: __FULL_HISTORY__ in Git",
        blanks: [
          {
            id: "HOURS",
            label: "HOURS",
            hint: "Manual clicking takes time",
            correctValue: "Hours",
            validationPattern: ".*(hour|slow|long).*",
          },
          {
            id: "INCONSISTENT",
            label: "INCONSISTENT",
            hint: "Each manual setup differs slightly",
            correctValue: "Inconsistent",
            validationPattern: ".*(inconsistent|different|vary).*",
          },
          {
            id: "OUTDATED",
            label: "OUTDATED",
            hint: "Documentation not kept up-to-date",
            correctValue: "Outdated",
            validationPattern: ".*(outdated|stale|old).*",
          },
          {
            id: "DIFFICULT",
            label: "DIFFICULT",
            hint: "Must remember all manual steps backwards",
            correctValue: "Difficult",
            validationPattern: ".*(difficult|hard|impossible).*",
          },
          {
            id: "NO_TRAIL",
            label: "NO_TRAIL",
            hint: "No change tracking",
            correctValue: "No trail",
            validationPattern: ".*(no.*trail|unknown|lost).*",
          },
          {
            id: "MINUTES",
            label: "MINUTES",
            hint: "Automation is fast",
            correctValue: "Minutes",
            validationPattern: ".*(minute|fast|quick).*",
          },
          {
            id: "IDENTICAL",
            label: "IDENTICAL",
            hint: "Same code = same infrastructure",
            correctValue: "Identical",
            validationPattern: ".*(identical|same|consistent).*",
          },
          {
            id: "CODE_IS_DOCS",
            label: "CODE_IS_DOCS",
            hint: "Code documents itself",
            correctValue: "Code is documentation",
            validationPattern: ".*(code.*doc|self.*doc).*",
          },
          {
            id: "GIT_REVERT",
            label: "GIT_REVERT",
            hint: "Version control rollback",
            correctValue: "Git revert",
            validationPattern: ".*(git.*revert|version.*control).*",
          },
          {
            id: "FULL_HISTORY",
            label: "FULL_HISTORY",
            hint: "Complete change log",
            correctValue: "Full history",
            validationPattern: ".*(full.*history|complete.*audit|tracked).*",
          },
        ],
        solution:
          "MANUAL APPROACH:\n- Time: Hours to set up each environment\n- Consistency: Inconsistent (human error)\n- Documentation: Outdated wiki pages\n- Rollback: Difficult (manual steps)\n- Audit: No trail of who changed what\n\nIaC APPROACH:\n- Time: Minutes (terraform apply)\n- Consistency: Identical environments (same code)\n- Documentation: Code is documentation (self-documenting)\n- Rollback: Git revert (seconds)\n- Audit: Full history in Git",
        explanation:
          "IaC provides speed, consistency, documentation, easy rollback, and full audit trail compared to manual infrastructure.",
      },
      {
        exerciseNumber: 2,
        scenario: "Explain declarative vs imperative IaC.",
        template:
          "__IMPERATIVE__ IaC:\n- Defines: __HOW__ to achieve goal\n- Example: AWS CLI scripts with explicit commands\n- Risk: Running twice creates __DUPLICATES__\n- Maintenance: __COMPLEX__ (must handle all states)\n\n__DECLARATIVE__ IaC:\n- Defines: __WHAT__ you want (desired state)\n- Example: Terraform, CloudFormation\n- Idempotent: Running twice makes __NO_CHANGES__\n- Maintenance: __SIMPLE__ (tool handles logic)",
        blanks: [
          {
            id: "IMPERATIVE",
            label: "IMPERATIVE",
            hint: "Step-by-step instructions",
            correctValue: "Imperative",
            validationPattern: "^[Ii]mperative$",
          },
          {
            id: "HOW",
            label: "HOW",
            hint: "Process and steps",
            correctValue: "How",
            validationPattern: ".*(how).*",
          },
          {
            id: "DUPLICATES",
            label: "DUPLICATES",
            hint: "Creates resources again",
            correctValue: "duplicates",
            validationPattern: ".*(duplicate|double|twice).*",
          },
          {
            id: "COMPLEX",
            label: "COMPLEX",
            hint: "Hard to maintain",
            correctValue: "Complex",
            validationPattern: ".*(complex|difficult|hard).*",
          },
          {
            id: "DECLARATIVE",
            label: "DECLARATIVE",
            hint: "Describe desired outcome",
            correctValue: "Declarative",
            validationPattern: "^[Dd]eclarative$",
          },
          {
            id: "WHAT",
            label: "WHAT",
            hint: "End goal or state",
            correctValue: "What",
            validationPattern: ".*(what).*",
          },
          {
            id: "NO_CHANGES",
            label: "NO_CHANGES",
            hint: "Idempotent behavior",
            correctValue: "no changes",
            validationPattern: ".*(no.*change|nothing|same).*",
          },
          {
            id: "SIMPLE",
            label: "SIMPLE",
            hint: "Easy to maintain",
            correctValue: "Simple",
            validationPattern: ".*(simple|easy|clean).*",
          },
        ],
        solution:
          "Imperative IaC:\n- Defines: How to achieve goal\n- Example: AWS CLI scripts with explicit commands\n- Risk: Running twice creates duplicates\n- Maintenance: Complex (must handle all states)\n\nDeclarative IaC:\n- Defines: What you want (desired state)\n- Example: Terraform, CloudFormation\n- Idempotent: Running twice makes no changes\n- Maintenance: Simple (tool handles logic)",
        explanation:
          "Declarative IaC is preferred for its simplicity, idempotency, and ease of maintenance.",
      },
      {
        exerciseNumber: 3,
        scenario: "Detect and handle configuration drift.",
        template:
          'Scenario: Infrastructure defined in IaC (5 servers)\nSomeone manually adds 6th server via AWS console\n\nStep 1: Detect drift\n$ terraform __PLAN__\nOutput: "Will __REMOVE__ 1 aws_instance (not in configuration)"\n\nStep 2: Options\nA) Apply IaC (remove manual server): terraform __APPLY__\nB) Update code to keep it: Add to __CODE__, then apply\n\nBest practice: __OPTION_A__ (code is truth, remove drift)',
        blanks: [
          {
            id: "PLAN",
            label: "PLAN",
            hint: "Command to preview changes",
            correctValue: "plan",
            validationPattern: ".*(plan).*",
          },
          {
            id: "REMOVE",
            label: "REMOVE",
            hint: "Delete the extra server",
            correctValue: "remove",
            validationPattern: ".*(remove|delete|destroy).*",
          },
          {
            id: "APPLY",
            label: "APPLY",
            hint: "Execute the changes",
            correctValue: "apply",
            validationPattern: ".*(apply).*",
          },
          {
            id: "CODE",
            label: "CODE",
            hint: "Update IaC definition",
            correctValue: "code",
            validationPattern: ".*(code|config|terraform).*",
          },
          {
            id: "OPTION_A",
            label: "OPTION_A",
            hint: "Code as single source of truth",
            correctValue: "Option A",
            validationPattern: ".*(option.*a|A|code.*truth|remove).*",
          },
        ],
        solution:
          'Scenario: Infrastructure defined in IaC (5 servers)\nSomeone manually adds 6th server via AWS console\n\nStep 1: Detect drift\n$ terraform plan\nOutput: "Will remove 1 aws_instance (not in configuration)"\n\nStep 2: Options\nA) Apply IaC (remove manual server): terraform apply\nB) Update code to keep it: Add to code, then apply\n\nBest practice: Option A (code is truth, remove drift)',
        explanation:
          "IaC detects drift automatically. Best practice: code is single source of truth, revert manual changes.",
      },
      {
        exerciseNumber: 4,
        scenario: "Choose IaC tool for different scenarios.",
        template:
          "AWS-only company, existing CloudFormation expertise: __CLOUDFORMATION__\nMulti-cloud (AWS + Azure), need flexibility: __TERRAFORM__\nTeam prefers TypeScript over HCL: __PULUMI__\nNeed both infrastructure provisioning and config management: __ANSIBLE__",
        blanks: [
          {
            id: "CLOUDFORMATION",
            label: "CLOUDFORMATION",
            hint: "AWS native tool",
            correctValue: "CloudFormation",
            validationPattern: ".*(CloudFormation|CFN).*",
          },
          {
            id: "TERRAFORM",
            label: "TERRAFORM",
            hint: "Multi-cloud leader",
            correctValue: "Terraform",
            validationPattern: ".*(Terraform).*",
          },
          {
            id: "PULUMI",
            label: "PULUMI",
            hint: "Real programming languages",
            correctValue: "Pulumi",
            validationPattern: ".*(Pulumi).*",
          },
          {
            id: "ANSIBLE",
            label: "ANSIBLE",
            hint: "Provisioning + configuration",
            correctValue: "Ansible",
            validationPattern: ".*(Ansible).*",
          },
        ],
        solution:
          "AWS-only company, existing CloudFormation expertise: CloudFormation\nMulti-cloud (AWS + Azure), need flexibility: Terraform\nTeam prefers TypeScript over HCL: Pulumi\nNeed both infrastructure provisioning and config management: Ansible",
        explanation:
          "Choose IaC tool based on cloud strategy, team skills, and requirements.",
      },
      {
        exerciseNumber: 5,
        scenario: "Design environment strategy with IaC.",
        template:
          'Strategy: __SAME_CODE__, different __VARIABLES__\n\nStructure:\ninfrastructure/\n  modules/\n    web-app/  # Reusable module\n  environments/\n    dev/\n      __MAIN_TF__\n      terraform.tfvars  # instance_type = "__T2_MICRO__"\n    production/\n      main.tf\n      terraform.tfvars  # instance_type = "__T2_LARGE__"\n\nResult: __CONSISTENT__ infrastructure, appropriate sizing per environment',
        blanks: [
          {
            id: "SAME_CODE",
            label: "SAME_CODE",
            hint: "Identical IaC code",
            correctValue: "Same code",
            validationPattern: ".*(same.*code|identical|shared).*",
          },
          {
            id: "VARIABLES",
            label: "VARIABLES",
            hint: "Environment-specific values",
            correctValue: "variables",
            validationPattern: ".*(variable|parameter|value).*",
          },
          {
            id: "MAIN_TF",
            label: "MAIN_TF",
            hint: "Terraform configuration file",
            correctValue: "main.tf",
            validationPattern: ".*(main\\.tf).*",
          },
          {
            id: "T2_MICRO",
            label: "T2_MICRO",
            hint: "Small instance for dev",
            correctValue: "t2.micro",
            validationPattern: ".*(t2\\.micro|micro|small).*",
          },
          {
            id: "T2_LARGE",
            label: "T2_LARGE",
            hint: "Larger instance for prod",
            correctValue: "t2.large",
            validationPattern: ".*(t2\\.large|large|bigger).*",
          },
          {
            id: "CONSISTENT",
            label: "CONSISTENT",
            hint: "No environment drift",
            correctValue: "Consistent",
            validationPattern: ".*(consistent|same|identical).*",
          },
        ],
        solution:
          'Strategy: Same code, different variables\n\nStructure:\ninfrastructure/\n  modules/\n    web-app/  # Reusable module\n  environments/\n    dev/\n      main.tf\n      terraform.tfvars  # instance_type = "t2.micro"\n    production/\n      main.tf\n      terraform.tfvars  # instance_type = "t2.large"\n\nResult: Consistent infrastructure, appropriate sizing per environment',
        explanation:
          "Use same IaC code with different variables for each environment to ensure consistency.",
      },
    ],
    hints: [
      "IaC makes infrastructure reproducible and version-controlled",
      "Declarative is simpler than imperative (describe what, not how)",
      "State file is IaC's memory of infrastructure",
      "Modules promote code reuse and consistency",
      "Code is single source of truth, manual changes cause drift",
    ],
  },

  runGuided: {
    objective:
      "Analyze existing manual infrastructure and create IaC migration plan with benefits justification",
    conceptualGuidance: [
      "Document current manual infrastructure setup process",
      "Identify pain points: time, errors, inconsistency, lack of audit",
      "Choose appropriate IaC tool (Terraform, CloudFormation, etc.)",
      "Design IaC structure: modules, environments, state storage",
      "Plan migration approach: import existing resources or recreate",
      "Define success metrics: deployment time, consistency, rollback capability",
      "Create risk assessment and mitigation plan",
      "Document IaC best practices for team",
      "Build business case showing time/cost savings",
      "Plan training and rollout strategy",
    ],
    keyConceptsToApply: [
      "IaC benefits analysis",
      "Tool selection criteria",
      "State management strategy",
      "Module design",
      "Environment separation",
    ],
    checkpoints: [
      {
        checkpoint: "Current state documented",
        description: "Manual infrastructure process analyzed",
        validationCriteria: [
          "Manual setup steps documented",
          "Pain points identified (time, errors, drift)",
          "Current deployment time measured",
          "Consistency issues documented",
          "Audit trail gaps identified",
        ],
        hintIfStuck:
          "Interview team members who create infrastructure manually. Time how long it takes to set up dev environment. Document differences between dev, staging, production.",
      },
      {
        checkpoint: "IaC solution designed",
        description: "Complete IaC architecture and migration plan",
        validationCriteria: [
          "IaC tool selected with justification",
          "Module structure designed",
          "Environment strategy defined",
          "State storage plan (S3, Terraform Cloud)",
          "Migration approach chosen (import vs recreate)",
          "Rollback procedures defined",
        ],
        hintIfStuck:
          "For AWS-heavy: consider Terraform for flexibility or CloudFormation for simplicity. Plan modules for common patterns (VPC, web server, database). Use separate directories or workspaces for environments. Store state in S3 with DynamoDB locking.",
      },
      {
        checkpoint: "Business case completed",
        description: "ROI and implementation plan documented",
        validationCriteria: [
          "Time savings calculated (hours to minutes)",
          "Error reduction benefits quantified",
          "Rollback capability value explained",
          "Training plan for team",
          "Phased rollout approach defined",
          "Success metrics and KPIs identified",
        ],
        hintIfStuck:
          "Calculate: current setup time vs IaC (80% reduction). Estimate error cost (downtime, debugging). Value of instant rollback (vs hours of manual work). Plan pilot with one environment first.",
      },
    ],
    resourcesAllowed: [
      "Current infrastructure documentation",
      "IaC tool documentation (Terraform, CloudFormation)",
      "Team interviews about pain points",
    ],
  },

  runIndependent: {
    objective:
      "Create comprehensive Infrastructure as Code adoption proposal for organization including technical design, migration strategy, business case, and implementation roadmap",
    successCriteria: [
      "Current state analysis: Document manual processes, time spent, error rate, audit gaps, consistency issues across environments",
      "IaC tool selection: Compare 3+ tools with scoring matrix, final recommendation with justification based on requirements",
      "Architecture design: Complete IaC structure with modules, environments, state management, naming conventions, directory layout",
      "Migration strategy: Phase 1 (import existing), Phase 2 (net new), Phase 3 (full adoption), rollback plans for each phase",
      "Business case: ROI calculation showing time savings, cost reduction, risk mitigation, productivity gains with 12-month projection",
      "Technical implementation: Sample IaC code for representative infrastructure, state backend configuration, CI/CD integration plan",
      "Team enablement: Training plan, documentation standards, code review process, on-call runbooks, knowledge transfer strategy",
      "Success metrics: KPIs (deployment time, change failure rate, MTTR, drift incidents), measurement approach, targets",
      "Risk assessment: Identify risks (state corruption, team adoption, legacy systems), mitigation strategies for each",
      "Roadmap: 6-month implementation timeline with milestones, dependencies, resource requirements, success gates",
    ],
    timeTarget: 15,
    minimumRequirements: [
      "Analysis of current manual infrastructure",
      "IaC tool recommendation",
      "Basic migration approach",
    ],
    evaluationRubric: [
      {
        criterion: "Analysis Quality",
        weight: 25,
        passingThreshold:
          "Thorough documentation of current state with specific pain points, time measurements, and concrete examples. Clear understanding of problems IaC will solve. Quantified benefits (hours saved, error reduction).",
      },
      {
        criterion: "Technical Design",
        weight: 30,
        passingThreshold:
          "Complete IaC architecture with well-designed modules, clear environment strategy, proper state management. Sample code demonstrates understanding. CI/CD integration planned. Rollback procedures defined.",
      },
      {
        criterion: "Business Value",
        weight: 25,
        passingThreshold:
          "Compelling business case with ROI calculation, risk analysis, and clear value proposition. Success metrics defined. Implementation roadmap is realistic and phased. Addresses stakeholder concerns.",
      },
      {
        criterion: "Implementation Readiness",
        weight: 20,
        passingThreshold:
          "Detailed implementation plan with training, documentation, and team enablement. Risk mitigation strategies. Realistic timeline. Team can execute plan independently. Lessons learned captured for continuous improvement.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=POPP2WTJ8es",
  documentation: [
    "https://www.terraform.io/intro",
    "https://docs.aws.amazon.com/cloudformation/",
    "https://www.pulumi.com/docs/",
    "https://learn.hashicorp.com/terraform",
    "https://www.hashicorp.com/resources/what-is-infrastructure-as-code",
  ],
  relatedConcepts: [
    "Cloud computing fundamentals",
    "Version control with Git",
    "CI/CD pipelines",
    "Configuration management",
    "DevOps principles",
    "Immutable infrastructure",
  ],
};

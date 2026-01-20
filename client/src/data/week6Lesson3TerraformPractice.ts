/**
 * Week 6 Lesson 3 - Terraform in Practice
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week6Lesson3TerraformPractice: LeveledLessonContent = {
  lessonId: "week6-lesson3-terraform-practice",

  baseLesson: {
    title:
      "Terraform in Practice: Advanced Patterns and Production Best Practices",
    description:
      "Master advanced Terraform: modules, workspaces, state manipulation, and production-ready patterns.",
    learningObjectives: [
      "Create reusable Terraform modules",
      "Use workspaces for environment management",
      "Handle state safely (import, move, rm)",
      "Implement Terraform in CI/CD pipelines",
      "Apply production best practices and patterns",
    ],
    prerequisites: [
      "Terraform basics (providers, resources, state)",
      "Variables and outputs",
      "AWS infrastructure knowledge",
      "Git and CI/CD fundamentals",
    ],
    estimatedTimePerLevel: {
      crawl: 55,
      walk: 45,
      runGuided: 40,
      runIndependent: 35,
    },
  },

  crawl: {
    introduction:
      "Learn advanced Terraform: creating modules, using workspaces, state operations, remote execution, CI/CD integration, and production best practices.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Create reusable Terraform module",
        command:
          'mkdir -p modules/web-server\n\n# modules/web-server/main.tf\ncat > modules/web-server/main.tf << \'EOF\'\nresource "aws_security_group" "web" {\n  name_prefix = "${var.name_prefix}-web-"\n  vpc_id      = var.vpc_id\n\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = "-1"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\n\nresource "aws_instance" "web" {\n  count                  = var.instance_count\n  ami                    = var.ami\n  instance_type          = var.instance_type\n  vpc_security_group_ids = [aws_security_group.web.id]\n  subnet_id              = var.subnet_id\n\n  tags = merge(var.tags, {\n    Name = "${var.name_prefix}-web-${count.index + 1}"\n  })\n}\nEOF',
        explanation:
          "Module = reusable infrastructure component. Define in modules/ directory. Uses input variables for customization. Can be used multiple times with different values. Encapsulates best practices.",
        expectedOutput:
          "Web server module created with security group and EC2 instances.",
        validationCriteria: [
          "Module directory structure created",
          "Resources defined in module",
          "Variables used for customization",
          "Module is self-contained",
          "Can be reused for different environments",
        ],
        commonMistakes: [
          "Hardcoding values in module (defeats reusability)",
          "Module too specific (can't reuse)",
          "Module too complex (hard to understand)",
          "Not documenting module variables",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Define module variables and outputs",
        command:
          '# modules/web-server/variables.tf\ncat > modules/web-server/variables.tf << \'EOF\'\nvariable "name_prefix" {\n  description = "Prefix for resource names"\n  type        = string\n}\n\nvariable "vpc_id" {\n  description = "VPC ID for resources"\n  type        = string\n}\n\nvariable "subnet_id" {\n  description = "Subnet ID for instances"\n  type        = string\n}\n\nvariable "ami" {\n  description = "AMI for EC2 instances"\n  type        = string\n}\n\nvariable "instance_type" {\n  description = "Instance type"\n  type        = string\n  default     = "t2.micro"\n}\n\nvariable "instance_count" {\n  description = "Number of instances"\n  type        = number\n  default     = 1\n}\n\nvariable "tags" {\n  description = "Additional tags"\n  type        = map(string)\n  default     = {}\n}\nEOF\n\n# modules/web-server/outputs.tf\ncat > modules/web-server/outputs.tf << \'EOF\'\noutput "instance_ids" {\n  description = "IDs of EC2 instances"\n  value       = aws_instance.web[*].id\n}\n\noutput "public_ips" {\n  description = "Public IPs of instances"\n  value       = aws_instance.web[*].public_ip\n}\n\noutput "security_group_id" {\n  description = "ID of security group"\n  value       = aws_security_group.web.id\n}\nEOF',
        explanation:
          "Module variables define inputs. Module outputs expose useful values. Consumers provide variables, receive outputs. Clear interface for module usage.",
        expectedOutput:
          "Module has complete interface: variables for inputs, outputs for results.",
        validationCriteria: [
          "All required inputs defined",
          "Defaults for optional inputs",
          "Clear descriptions",
          "Outputs expose useful information",
          "Types specified for validation",
        ],
        commonMistakes: [
          "Missing variable descriptions",
          "No outputs (can't access module results)",
          "Wrong variable types",
          "Required variable with default (confusing)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Use module in root configuration",
        command:
          '# Root main.tf\ncat > main.tf << \'EOF\'\nmodule "dev_web" {\n  source = "./modules/web-server"\n\n  name_prefix    = "dev"\n  vpc_id         = aws_vpc.main.id\n  subnet_id      = aws_subnet.public.id\n  ami            = "ami-0c55b159cbfafe1f0"\n  instance_type  = "t2.micro"\n  instance_count = 1\n\n  tags = {\n    Environment = "dev"\n    ManagedBy   = "terraform"\n  }\n}\n\nmodule "prod_web" {\n  source = "./modules/web-server"\n\n  name_prefix    = "prod"\n  vpc_id         = aws_vpc.main.id\n  subnet_id      = aws_subnet.public.id\n  ami            = "ami-0c55b159cbfafe1f0"\n  instance_type  = "t2.large"\n  instance_count = 3\n\n  tags = {\n    Environment = "production"\n    ManagedBy   = "terraform"\n  }\n}\nEOF',
        explanation:
          "Use module{} block to instantiate module. source points to module directory. Provide values for variables. Can use module multiple times with different configs. Promotes consistency.",
        expectedOutput:
          "Root configuration uses module twice: dev (1 small instance) and prod (3 large instances).",
        validationCriteria: [
          "Module sourced correctly",
          "All required variables provided",
          "Different values for dev vs prod",
          "Module reused successfully",
          "Can access module outputs",
        ],
        commonMistakes: [
          "Wrong source path (module not found)",
          "Missing required variables (error)",
          "Duplicating code instead of using modules",
          "Not customizing per environment",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Access module outputs",
        command:
          '# Root outputs.tf\ncat > outputs.tf << \'EOF\'\noutput "dev_web_ips" {\n  description = "Dev web server IPs"\n  value       = module.dev_web.public_ips\n}\n\noutput "prod_web_ips" {\n  description = "Prod web server IPs"\n  value       = module.prod_web.public_ips\n}\n\noutput "dev_instance_count" {\n  description = "Number of dev instances"\n  value       = length(module.dev_web.instance_ids)\n}\nEOF\n\nterraform apply\n\nOutputs:\ndev_web_ips = ["54.123.45.67"]\nprod_web_ips = ["54.123.45.68", "54.123.45.69", "54.123.45.70"]',
        explanation:
          "Access module outputs with module.name.output_name. Use in root outputs or other resources. Enables composition of modules.",
        expectedOutput:
          "Root configuration exposes dev and prod IPs from module outputs.",
        validationCriteria: [
          "Module outputs accessible",
          "Used in root outputs",
          "Can be used in other resources",
          "Values displayed after apply",
          "Enables module composition",
        ],
        commonMistakes: [
          "Wrong output name (doesn't exist in module)",
          "Not exposing module outputs (can't access results)",
          "Circular dependencies between modules",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Use Terraform workspaces for environments",
        command:
          '# List workspaces\nterraform workspace list\n# * default\n\n# Create dev workspace\nterraform workspace new dev\n# Created and switched to workspace "dev"\n\n# Create prod workspace\nterraform workspace new prod\n\n# Switch workspaces\nterraform workspace select dev\n\n# Current workspace\nterraform workspace show\n# dev\n\n# Use workspace in config\nresource "aws_instance" "web" {\n  instance_type = terraform.workspace == "prod" ? "t2.large" : "t2.micro"\n  \n  tags = {\n    Environment = terraform.workspace\n  }\n}',
        explanation:
          "Workspaces = multiple state files from same config. Each workspace has isolated state. Use terraform.workspace variable in code. Common for dev/staging/prod. State stored separately per workspace.",
        expectedOutput:
          "Multiple workspaces created, can switch between them, state isolated.",
        validationCriteria: [
          "Workspaces created successfully",
          "Can switch between workspaces",
          "State isolated per workspace",
          "terraform.workspace usable in code",
          "Each workspace can have different resources",
        ],
        commonMistakes: [
          "Using workspaces for completely different infrastructure (use separate configs)",
          "Not switching workspace before apply (wrong environment)",
          "Relying too heavily on terraform.workspace (hard to read)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Import existing infrastructure into Terraform",
        command:
          '# Manually created EC2 instance exists: i-0abcdef123456\n\n# 1. Write Terraform config for it\nresource "aws_instance" "imported" {\n  # Will be filled after import\n}\n\n# 2. Import the resource\nterraform import aws_instance.imported i-0abcdef123456\n\n# 3. Check state\nterraform state show aws_instance.imported\n# Shows all attributes\n\n# 4. Update config to match\nresource "aws_instance" "imported" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n  # ... other attributes from state\n}\n\n# 5. Verify no changes\nterraform plan\n# No changes. Infrastructure is up-to-date.',
        explanation:
          "Import adds existing resources to Terraform state. Write config first (can be minimal). Run import with resource ID. Update config to match actual resource. Brings manual resources under Terraform management.",
        expectedOutput:
          "Existing AWS resource imported into Terraform, now managed by code.",
        validationCriteria: [
          "Resource config written",
          "Import command succeeds",
          "Resource in state file",
          "Config updated to match reality",
          "Plan shows no changes",
        ],
        commonMistakes: [
          "Not writing config before import (import fails)",
          "Config doesn't match reality (plan wants changes)",
          "Importing into wrong resource name",
          "Not checking plan after import",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Safely manipulate state: move and remove",
        command:
          "# Move resource to new name\nterraform state mv aws_instance.old aws_instance.new\n\n# Move resource into module\nterraform state mv aws_instance.web module.web.aws_instance.main\n\n# Remove resource from state (doesn't destroy in AWS)\nterraform state rm aws_instance.temp\n\n# List all resources in state\nterraform state list\n\n# Show specific resource\nterraform state show aws_instance.example\n\n# Pull current state\nterraform state pull > terraform.tfstate.backup",
        explanation:
          "State commands manipulate state file safely. mv renames resources without recreating. rm removes from Terraform (resource stays in cloud). list/show inspect state. pull backs up state.",
        expectedOutput:
          "Understanding: Safe state manipulation for refactoring without destroying resources.",
        validationCriteria: [
          "Can rename resources in state",
          "Can remove from state without destroying",
          "Can inspect state",
          "Can backup state",
          "Refactoring doesn't cause recreation",
        ],
        commonMistakes: [
          "Editing state file manually (corruption)",
          "Using state rm thinking it destroys resource (it doesn't)",
          "Not backing up state before manipulation",
          "Breaking dependencies when moving",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Use data sources to reference existing resources",
        command:
          '# Reference existing VPC not managed by this Terraform\ndata "aws_vpc" "existing" {\n  filter {\n    name   = "tag:Name"\n    values = ["my-existing-vpc"]\n  }\n}\n\n# Use in resource\nresource "aws_subnet" "app" {\n  vpc_id     = data.aws_vpc.existing.id\n  cidr_block = "10.0.1.0/24"\n}\n\n# Reference AMI\ndata "aws_ami" "ubuntu" {\n  most_recent = true\n  owners      = ["099720109477"]  # Canonical\n\n  filter {\n    name   = "name"\n    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]\n  }\n}\n\nresource "aws_instance" "web" {\n  ami = data.aws_ami.ubuntu.id\n}',
        explanation:
          "Data sources read existing infrastructure not managed by Terraform. Query by filters, tags, IDs. Use results in resources. Enables integration with existing infrastructure.",
        expectedOutput:
          "Data sources reference existing VPC and latest Ubuntu AMI.",
        validationCriteria: [
          "Data source queries existing resources",
          "Filters find correct resource",
          "Data accessible in resources",
          "No state modification (read-only)",
          "Enables integration with existing infra",
        ],
        commonMistakes: [
          "Confusing data source with resource (data reads, resource creates)",
          "Filters too broad (multiple results error)",
          "Not handling missing resources (fails apply)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Implement Terraform in CI/CD pipeline",
        command:
          "# .github/workflows/terraform.yml\nname: Terraform\n\non:\n  pull_request:\n    paths: ['infrastructure/**']\n  push:\n    branches: [main]\n\njobs:\n  terraform:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Terraform\n        uses: hashicorp/setup-terraform@v3\n        with:\n          terraform_version: 1.6.0\n      \n      - name: Terraform Init\n        run: terraform init\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n      \n      - name: Terraform Plan\n        run: terraform plan -no-color\n        continue-on-error: true\n      \n      - name: Terraform Apply\n        if: github.ref == 'refs/heads/main'\n        run: terraform apply -auto-approve\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}",
        explanation:
          "Terraform in CI/CD: Plan on PRs (review changes), Apply on merge to main (automate deployment). Credentials from secrets. -auto-approve for automation. continue-on-error shows plan even if fails.",
        expectedOutput:
          "GitHub Actions workflow automates Terraform plan on PRs, apply on main.",
        validationCriteria: [
          "Plan runs on pull requests",
          "Apply runs on main branch only",
          "Credentials from secrets",
          "Terraform version pinned",
          "Plan output visible in PR",
        ],
        commonMistakes: [
          "Auto-applying without review (risky)",
          "Hardcoding credentials (security risk)",
          "Not pinning Terraform version (inconsistent)",
          "Applying on every commit (too frequent)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Use count for conditional resources",
        command:
          'variable "enable_monitoring" {\n  description = "Enable CloudWatch monitoring"\n  type        = bool\n  default     = false\n}\n\nresource "aws_cloudwatch_metric_alarm" "cpu" {\n  count = var.enable_monitoring ? 1 : 0\n  \n  alarm_name          = "high-cpu"\n  comparison_operator = "GreaterThanThreshold"\n  # ... other alarm config\n}\n\n# Access with [0] if exists\noutput "alarm_arn" {\n  value = var.enable_monitoring ? aws_cloudwatch_metric_alarm.cpu[0].arn : null\n}',
        explanation:
          "count = 0 skips resource creation. count = 1 creates one. Use ternary (condition ? true : false) for conditional. Access with [index]. Enables feature flags.",
        expectedOutput:
          "Conditional resource creation based on variable value.",
        validationCriteria: [
          "count uses ternary operator",
          "Resource created only when condition true",
          "Access with [0] when count = 1",
          "Null output when not created",
          "Useful for optional features",
        ],
        commonMistakes: [
          "Forgetting [0] when accessing (error)",
          "Complex count expressions (hard to read)",
          "count on required resources (dangerous)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Use for_each for multiple similar resources",
        command:
          'variable "users" {\n  description = "IAM users to create"\n  type        = set(string)\n  default     = ["alice", "bob", "charlie"]\n}\n\nresource "aws_iam_user" "users" {\n  for_each = var.users\n  name     = each.key\n\n  tags = {\n    Department = "Engineering"\n  }\n}\n\n# Access specific user\noutput "alice_arn" {\n  value = aws_iam_user.users["alice"].arn\n}\n\n# All user ARNs\noutput "all_user_arns" {\n  value = { for user in var.users : user => aws_iam_user.users[user].arn }\n}',
        explanation:
          'for_each creates resource for each item in set/map. each.key is item. More flexible than count (can add/remove items). Access with ["key"]. Terraform tracks by key, not index.',
        expectedOutput:
          "Multiple IAM users created from set, accessible by name.",
        validationCriteria: [
          "for_each on set or map",
          "each.key used correctly",
          "Can access by key",
          "Adding/removing items works cleanly",
          "Preferred over count for sets",
        ],
        commonMistakes: [
          "for_each on list (use toset() to convert)",
          "Complex for_each expressions (hard to debug)",
          "Accessing with wrong key (error)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Production Terraform best practices",
        command:
          "BEST PRACTICES:\n\n1. REMOTE STATE:\n   - Store in S3 with versioning\n   - Enable encryption\n   - Use DynamoDB for locking\n\n2. MODULES:\n   - Small, focused modules\n   - Versioned modules (git tags)\n   - Clear variable/output contracts\n\n3. ENVIRONMENTS:\n   - Separate directories or workspaces\n   - Same code, different variables\n   - Isolated state per environment\n\n4. SECURITY:\n   - Never commit credentials\n   - Use IAM roles in AWS\n   - Scan code with tfsec/checkov\n\n5. CI/CD:\n   - Plan on PRs for review\n   - Auto-apply only for dev\n   - Manual approval for production\n\n6. CODE QUALITY:\n   - terraform fmt (formatting)\n   - terraform validate (syntax)\n   - tflint (linting)\n   - Pre-commit hooks\n\n7. DOCUMENTATION:\n   - README with usage\n   - Variable descriptions\n   - Architecture diagrams\n   - Runbooks for operations",
        explanation:
          "Production Terraform requires: remote state, modular code, environment isolation, security practices, CI/CD automation, code quality tools, and comprehensive documentation. Follow these for reliable infrastructure management.",
        expectedOutput:
          "Understanding: Production Terraform best practices for reliability and maintainability.",
        validationCriteria: [
          "Remote state configured",
          "Modules used appropriately",
          "Environments isolated",
          "No security vulnerabilities",
          "CI/CD automates workflows",
          "Code is formatted and validated",
          "Documentation is comprehensive",
        ],
        commonMistakes: [
          "Local state in production (team can't collaborate)",
          "Monolithic configs (hard to maintain)",
          "Shared state across environments (dangerous)",
          "Hardcoded secrets (security risk)",
          "Manual terraform apply (inconsistent)",
          "No code quality checks (accumulates technical debt)",
          "Missing documentation (knowledge silos)",
        ],
      },
    ],
    expectedOutcome:
      "You can create reusable modules, use workspaces for environments, import and manipulate state safely, integrate Terraform in CI/CD, use count/for_each for dynamic resources, and apply production best practices.",
  },

  walk: {
    introduction:
      "Practice advanced Terraform through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create reusable module with proper interface.",
        template:
          'Module structure:\nmodules/database/\n  __MAIN__.tf (resources)\n  __VARIABLES__.tf (inputs)\n  __OUTPUTS__.tf (results)\n\nvariables.tf:\nvariable "db_name" {\n  type = __STRING__\n}\n\nvariable "instance_class" {\n  type    = string\n  default = "__T2_MICRO__"\n}\n\noutputs.tf:\noutput "endpoint" {\n  value = aws_db_instance.main.__ENDPOINT__\n}',
        blanks: [
          {
            id: "MAIN",
            label: "MAIN",
            hint: "Standard Terraform filename",
            correctValue: "main",
            validationPattern: ".*(main).*",
          },
          {
            id: "VARIABLES",
            label: "VARIABLES",
            hint: "Input definitions file",
            correctValue: "variables",
            validationPattern: ".*(variable).*",
          },
          {
            id: "OUTPUTS",
            label: "OUTPUTS",
            hint: "Output definitions file",
            correctValue: "outputs",
            validationPattern: ".*(output).*",
          },
          {
            id: "STRING",
            label: "STRING",
            hint: "Type for text",
            correctValue: "string",
            validationPattern: ".*(string).*",
          },
          {
            id: "T2_MICRO",
            label: "T2_MICRO",
            hint: "Small DB instance",
            correctValue: "db.t2.micro",
            validationPattern: ".*(t2.*micro|micro).*",
          },
          {
            id: "ENDPOINT",
            label: "ENDPOINT",
            hint: "Database connection string",
            correctValue: "endpoint",
            validationPattern: ".*(endpoint|address).*",
          },
        ],
        solution:
          'Module structure:\nmodules/database/\n  main.tf (resources)\n  variables.tf (inputs)\n  outputs.tf (results)\n\nvariables.tf:\nvariable "db_name" {\n  type = string\n}\n\nvariable "instance_class" {\n  type    = string\n  default = "db.t2.micro"\n}\n\noutputs.tf:\noutput "endpoint" {\n  value = aws_db_instance.main.endpoint\n}',
        explanation:
          "Standard module structure with main.tf, variables.tf, outputs.tf providing clear interface.",
      },
      {
        exerciseNumber: 2,
        scenario: "Use module in root configuration.",
        template:
          'module "__DATABASE__" {\n  __SOURCE__ = "./modules/database"\n\n  db_name        = "myapp"\n  instance_class = "db.__T2_SMALL__"\n}\n\noutput "db_endpoint" {\n  value = module.__DATABASE__.__ENDPOINT__\n}',
        blanks: [
          {
            id: "DATABASE",
            label: "DATABASE",
            hint: "Module instance name",
            correctValue: "database",
            validationPattern: ".*(database|db).*",
          },
          {
            id: "SOURCE",
            label: "SOURCE",
            hint: "Module location attribute",
            correctValue: "source",
            validationPattern: ".*(source).*",
          },
          {
            id: "T2_SMALL",
            label: "T2_SMALL",
            hint: "Medium DB instance",
            correctValue: "t2.small",
            validationPattern: ".*(small).*",
          },
          {
            id: "ENDPOINT",
            label: "ENDPOINT",
            hint: "Module output name",
            correctValue: "endpoint",
            validationPattern: ".*(endpoint).*",
          },
        ],
        solution:
          'module "database" {\n  source = "./modules/database"\n\n  db_name        = "myapp"\n  instance_class = "db.t2.small"\n}\n\noutput "db_endpoint" {\n  value = module.database.endpoint\n}',
        explanation:
          "Use module with source path, provide variables, access outputs with module.name.output.",
      },
      {
        exerciseNumber: 3,
        scenario: "Workspace workflow for environments.",
        template:
          'Commands:\n\n# Create workspaces\nterraform workspace __NEW__ dev\nterraform workspace new __PROD__\n\n# Switch\nterraform workspace __SELECT__ dev\n\n# Show current\nterraform workspace __SHOW__\n\n# Use in code\nresource "aws_instance" "web" {\n  instance_type = terraform.__WORKSPACE__ == "prod" ? "t2.large" : "t2.micro"\n}',
        blanks: [
          {
            id: "NEW",
            label: "NEW",
            hint: "Create workspace command",
            correctValue: "new",
            validationPattern: ".*(new).*",
          },
          {
            id: "PROD",
            label: "PROD",
            hint: "Production workspace",
            correctValue: "prod",
            validationPattern: ".*(prod).*",
          },
          {
            id: "SELECT",
            label: "SELECT",
            hint: "Switch workspace command",
            correctValue: "select",
            validationPattern: ".*(select).*",
          },
          {
            id: "SHOW",
            label: "SHOW",
            hint: "Display current workspace",
            correctValue: "show",
            validationPattern: ".*(show).*",
          },
          {
            id: "WORKSPACE",
            label: "WORKSPACE",
            hint: "Built-in variable",
            correctValue: "workspace",
            validationPattern: ".*(workspace).*",
          },
        ],
        solution:
          'Commands:\n\n# Create workspaces\nterraform workspace new dev\nterraform workspace new prod\n\n# Switch\nterraform workspace select dev\n\n# Show current\nterraform workspace show\n\n# Use in code\nresource "aws_instance" "web" {\n  instance_type = terraform.workspace == "prod" ? "t2.large" : "t2.micro"\n}',
        explanation:
          "Workspace commands: new, select, show. Use terraform.workspace in code for environment-specific logic.",
      },
      {
        exerciseNumber: 4,
        scenario: "Import existing resource workflow.",
        template:
          'Steps:\n\n1. Write __CONFIG__ for resource\nresource "aws_instance" "imported" {\n  # Initial config\n}\n\n2. Import with resource ID\nterraform __IMPORT__ aws_instance.imported __INSTANCE_ID__\n\n3. View imported state\nterraform __STATE__ show aws_instance.imported\n\n4. Update config to match\n5. Verify: terraform __PLAN__ shows __NO_CHANGES__',
        blanks: [
          {
            id: "CONFIG",
            label: "CONFIG",
            hint: "Terraform resource definition",
            correctValue: "config",
            validationPattern: ".*(config|resource).*",
          },
          {
            id: "IMPORT",
            label: "IMPORT",
            hint: "Command to bring into state",
            correctValue: "import",
            validationPattern: ".*(import).*",
          },
          {
            id: "INSTANCE_ID",
            label: "INSTANCE_ID",
            hint: "AWS resource identifier",
            correctValue: "i-0123456789abcdef",
            validationPattern: ".*(i-|instance).*",
          },
          {
            id: "STATE",
            label: "STATE",
            hint: "State inspection command",
            correctValue: "state",
            validationPattern: ".*(state).*",
          },
          {
            id: "PLAN",
            label: "PLAN",
            hint: "Preview changes",
            correctValue: "plan",
            validationPattern: ".*(plan).*",
          },
          {
            id: "NO_CHANGES",
            label: "NO_CHANGES",
            hint: "Config matches reality",
            correctValue: "no changes",
            validationPattern: ".*(no.*change|up.*to.*date).*",
          },
        ],
        solution:
          'Steps:\n\n1. Write config for resource\nresource "aws_instance" "imported" {\n  # Initial config\n}\n\n2. Import with resource ID\nterraform import aws_instance.imported i-0123456789abcdef\n\n3. View imported state\nterraform state show aws_instance.imported\n\n4. Update config to match\n5. Verify: terraform plan shows no changes',
        explanation:
          "Import workflow: write config → import with ID → inspect state → update config → verify plan.",
      },
      {
        exerciseNumber: 5,
        scenario: "CI/CD workflow for Terraform.",
        template:
          "Pipeline stages:\n\non:\n  pull_request: __PLAN__ (review changes)\n  push to main: __APPLY__ (deploy)\n\nSteps:\n1. Setup Terraform (version __PINNED__)\n2. terraform __INIT__\n3. terraform __PLAN__ (show changes)\n4. terraform __APPLY__ -auto-approve (if main branch)\n\nCredentials: Store in __SECRETS__, use env vars",
        blanks: [
          {
            id: "PLAN",
            label: "PLAN",
            hint: "Preview in PR",
            correctValue: "Plan",
            validationPattern: ".*(plan).*",
          },
          {
            id: "APPLY",
            label: "APPLY",
            hint: "Execute on merge",
            correctValue: "Apply",
            validationPattern: ".*(apply).*",
          },
          {
            id: "PINNED",
            label: "PINNED",
            hint: "Fixed version number",
            correctValue: "1.6.0",
            validationPattern: ".*(\\d+\\.\\d+|pin|fixed|specific).*",
          },
          {
            id: "INIT",
            label: "INIT",
            hint: "Initialize providers",
            correctValue: "init",
            validationPattern: ".*(init).*",
          },
          {
            id: "SECRETS",
            label: "SECRETS",
            hint: "GitHub secure storage",
            correctValue: "secrets",
            validationPattern: ".*(secret).*",
          },
        ],
        solution:
          "Pipeline stages:\n\non:\n  pull_request: Plan (review changes)\n  push to main: Apply (deploy)\n\nSteps:\n1. Setup Terraform (version 1.6.0)\n2. terraform init\n3. terraform plan (show changes)\n4. terraform apply -auto-approve (if main branch)\n\nCredentials: Store in secrets, use env vars",
        explanation:
          "CI/CD: Plan on PRs for review, Apply on main for automation. Pin version, secure credentials.",
      },
    ],
    hints: [
      "Modules should be focused and reusable",
      "Workspaces for same infrastructure, different environments",
      "Import existing resources to bring under Terraform management",
      "for_each preferred over count for sets of resources",
      "CI/CD automates Terraform for consistency",
    ],
  },

  runGuided: {
    objective:
      "Build production-ready Terraform setup with reusable modules, multi-environment support, CI/CD integration, and comprehensive documentation",
    conceptualGuidance: [
      "Design module structure: VPC module, compute module, database module",
      "Create environment configurations: dev, staging, production",
      "Implement workspace or directory-based environment isolation",
      "Configure remote state with S3 backend and DynamoDB locking",
      "Set up CI/CD pipeline: plan on PR, apply on merge",
      "Add code quality tools: terraform fmt, validate, tflint",
      "Implement security scanning: tfsec or checkov",
      "Document architecture, modules, and operational procedures",
      "Test: deploy all environments, verify isolation",
      "Create runbook for common operations",
    ],
    keyConceptsToApply: [
      "Module design and composition",
      "Environment management strategies",
      "CI/CD automation",
      "State management",
      "Code quality and security",
    ],
    checkpoints: [
      {
        checkpoint: "Modular architecture implemented",
        description: "Reusable modules with clear interfaces",
        validationCriteria: [
          "At least 3 modules created (network, compute, database)",
          "Each module has variables.tf, main.tf, outputs.tf",
          "Modules used in multiple environments",
          "Clear variable descriptions and validation",
          "Outputs provide useful information",
          "Modules are versioned (git tags)",
        ],
        hintIfStuck:
          "Start with network module (VPC, subnets). Then compute (EC2, security groups). Then database (RDS). Each should take inputs, create resources, expose outputs. Use in dev first, then copy to staging/prod with different variables.",
      },
      {
        checkpoint: "Multi-environment setup working",
        description: "Isolated dev, staging, production environments",
        validationCriteria: [
          "Three environments: dev, staging, production",
          "State isolated per environment (workspaces or separate backends)",
          "Same modules, different variable values",
          "Can deploy to all three independently",
          "No cross-environment dependencies",
          "Each environment has appropriate sizing",
        ],
        hintIfStuck:
          "Use separate directories (env/dev/, env/staging/, env/prod/) with separate tfvars files. Each references same modules. Configure separate S3 state paths. Deploy dev first, then staging, then prod.",
      },
      {
        checkpoint: "CI/CD and quality gates complete",
        description: "Automated workflows with quality checks",
        validationCriteria: [
          "GitHub Actions workflow configured",
          "Plan runs on pull requests",
          "Apply runs on merge to main (dev only, manual for prod)",
          "Code formatted (terraform fmt check)",
          "Code validated (terraform validate)",
          "Security scanned (tfsec or checkov)",
          "Documentation complete (README, module docs, runbook)",
        ],
        hintIfStuck:
          "Create .github/workflows/terraform.yml. Add jobs for fmt, validate, tfsec, plan, apply. Plan on PR, apply on main with conditional (workspace or directory-based). Store AWS credentials in GitHub secrets.",
      },
    ],
    resourcesAllowed: [
      "Terraform documentation",
      "Module examples from Terraform Registry",
      "CI/CD examples (GitHub Actions, GitLab CI)",
      "Security scanning tools (tfsec, checkov)",
    ],
  },

  runIndependent: {
    objective:
      "Build enterprise-grade Terraform infrastructure with modular architecture, advanced state management, complete CI/CD automation, security hardening, and production operational readiness",
    successCriteria: [
      "Module library: 5+ reusable modules (VPC, compute, database, monitoring, security) with comprehensive variable validation and outputs",
      "Multi-environment: Dev, staging, production with full isolation, separate AWS accounts, cross-account role assumption",
      "Advanced state: S3 backend with versioning, encryption, MFA delete, DynamoDB locking, state isolation per environment/workspace",
      "CI/CD pipeline: Full automation with plan on PR (with cost estimation), manual approval for staging, production. Separate workflows per environment",
      "Security: tfsec/checkov scanning in CI, no hardcoded secrets, AWS Secrets Manager integration, least-privilege IAM, encrypted everything",
      "Code quality: Pre-commit hooks (fmt, validate, tflint), automated formatting, comprehensive validation, documentation generation",
      "Monitoring: Terraform Cloud/Enterprise integration OR custom monitoring of state changes, drift detection, cost tracking",
      "Documentation: Auto-generated module docs (terraform-docs), architecture diagrams (draw.io/Lucidchart), operational runbooks, troubleshooting guide",
      "Testing: Terratest or similar for module testing, environment promotion strategy, rollback procedures tested",
      "Production ready: Successfully deployed to all environments, drift detection configured, backup/restore procedures documented, team trained",
    ],
    timeTarget: 35,
    minimumRequirements: [
      "Working Terraform modules",
      "Multi-environment configuration",
      "CI/CD pipeline with plan/apply automation",
    ],
    evaluationRubric: [
      {
        criterion: "Architecture Excellence",
        weight: 30,
        passingThreshold:
          "Comprehensive module library with clear abstractions. DRY principles applied. Modules are composable and versioned. Architecture supports scalability and maintainability. Separation of concerns is clear.",
      },
      {
        criterion: "Operational Readiness",
        weight: 25,
        passingThreshold:
          "Complete CI/CD automation with appropriate gates. Multi-environment deployment works flawlessly. State management is bulletproof with backups. Drift detection configured. Monitoring provides visibility. Team can operate independently.",
      },
      {
        criterion: "Security and Compliance",
        weight: 25,
        passingThreshold:
          "Security scanning integrated in CI/CD. No secrets in code or state. Encryption everywhere. Least-privilege IAM. Compliance controls (MFA, audit logging). Security best practices documented and enforced.",
      },
      {
        criterion: "Quality and Documentation",
        weight: 20,
        passingThreshold:
          "Code quality tools enforced. Comprehensive testing. Auto-generated documentation. Architecture diagrams clear. Runbooks enable team operations. Troubleshooting guides resolve common issues. Knowledge is transferable.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=7xngnjfIlK4",
  documentation: [
    "https://developer.hashicorp.com/terraform/language/modules",
    "https://developer.hashicorp.com/terraform/cli/workspaces",
    "https://developer.hashicorp.com/terraform/cli/state",
    "https://developer.hashicorp.com/terraform/tutorials/automation/automate-terraform",
    "https://github.com/terraform-linters/tflint",
    "https://github.com/aquasecurity/tfsec",
  ],
  relatedConcepts: [
    "Terraform basics",
    "Module design patterns",
    "State management strategies",
    "CI/CD for infrastructure",
    "Infrastructure testing",
    "Security scanning and compliance",
  ],
};

/**
 * Week 11 Lesson 2 - Advanced Terraform & Infrastructure as Code
 * 4-Level Mastery Progression: Terraform modules, state management, testing, best practices
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week11Lesson2TerraformAdvanced: LeveledLessonContent = {
  lessonId: "week11-lesson2-terraform-advanced",

  baseLesson: {
    title: "Advanced Terraform & Infrastructure as Code",
    description:
      "Master advanced Terraform concepts including reusable modules, remote state, workspaces, and infrastructure testing.",
    learningObjectives: [
      "Design reusable Terraform modules with inputs and outputs",
      "Manage remote state with locking and encryption",
      "Use workspaces for multi-environment management",
      "Implement infrastructure testing and validation",
      "Apply Terraform best practices for production",
    ],
    prerequisites: [
      "Terraform basics (resources, variables, providers)",
      "Cloud platform knowledge (AWS/Azure/GCP)",
      "Understanding of infrastructure concepts",
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
      "Learn advanced Terraform step-by-step. You will create modules, manage state, use workspaces, and test infrastructure code.",
    expectedOutcome:
      "Complete understanding of Terraform modules, remote state with S3/DynamoDB, workspaces for environments, infrastructure testing with Terratest, and production best practices",
    steps: [
      {
        stepNumber: 1,
        instruction: "Understand Terraform module structure",
        command:
          'echo "Terraform Module Structure:\nmodules/vpc/\n  main.tf - Resources\n  variables.tf - Input variables\n  outputs.tf - Output values\n  README.md - Documentation\n  versions.tf - Provider versions\n\nBenefits:\n- Reusability across projects\n- Encapsulation of complexity\n- Versioning and testing\n- Team collaboration"',
        explanation:
          "Modules are reusable Terraform configurations. Root module calls child modules with input variables, gets output values. Like functions in programming.",
        expectedOutput: "Module structure explained",
        validationCriteria: [
          "Understand module directory structure",
          "Know inputs/outputs purpose",
          "Recognize reusability benefits",
        ],
        commonMistakes: [
          "Not separating modules properly",
          "Hardcoding values in modules",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Create reusable VPC module",
        command:
          'mkdir -p modules/vpc && cat > modules/vpc/main.tf <<EOF\nresource "aws_vpc" "main" {\n  cidr_block           = var.cidr_block\n  enable_dns_hostnames = true\n  enable_dns_support   = true\n  tags = merge(var.tags, { Name = var.name })\n}\n\nresource "aws_subnet" "public" {\n  count                   = length(var.public_subnet_cidrs)\n  vpc_id                  = aws_vpc.main.id\n  cidr_block              = var.public_subnet_cidrs[count.index]\n  availability_zone       = data.aws_availability_zones.available.names[count.index]\n  map_public_ip_on_launch = true\n  tags                    = merge(var.tags, { Name = "${var.name}-public-${count.index + 1}" })\n}\n\nresource "aws_internet_gateway" "main" {\n  vpc_id = aws_vpc.main.id\n  tags   = merge(var.tags, { Name = "${var.name}-igw" })\n}\n\ndata "aws_availability_zones" "available" {\n  state = "available"\n}\nEOF',
        explanation:
          "VPC module encapsulates VPC, subnets, internet gateway. Takes inputs: cidr_block, subnet CIDRs, tags. Reusable across environments.",
        expectedOutput: "VPC module created",
        validationCriteria: [
          "Module resources defined",
          "Variables used (not hardcoded)",
          "Data sources for dynamic values",
        ],
        commonMistakes: [
          "Hardcoding CIDR blocks",
          "Not using count for subnets",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Define module variables and outputs",
        command:
          'cat > modules/vpc/variables.tf <<EOF\nvariable "name" {\n  description = "Name prefix for VPC resources"\n  type        = string\n}\n\nvariable "cidr_block" {\n  description = "CIDR block for VPC"\n  type        = string\n  validation {\n    condition     = can(cidrhost(var.cidr_block, 0))\n    error_message = "Must be valid IPv4 CIDR."\n  }\n}\n\nvariable "public_subnet_cidrs" {\n  description = "CIDR blocks for public subnets"\n  type        = list(string)\n}\n\nvariable "tags" {\n  description = "Tags to apply to resources"\n  type        = map(string)\n  default     = {}\n}\nEOF\ncat > modules/vpc/outputs.tf <<EOF\noutput "vpc_id" {\n  description = "VPC ID"\n  value       = aws_vpc.main.id\n}\n\noutput "public_subnet_ids" {\n  description = "Public subnet IDs"\n  value       = aws_subnet.public[*].id\n}\n\noutput "vpc_cidr" {\n  description = "VPC CIDR block"\n  value       = aws_vpc.main.cidr_block\n}\nEOF',
        explanation:
          "Variables define module inputs with types, descriptions, validation. Outputs expose resource IDs for use in root module. Documentation via descriptions.",
        expectedOutput: "Variables and outputs defined",
        validationCriteria: [
          "Input validation configured",
          "Type constraints set",
          "Outputs documented",
        ],
        commonMistakes: ["Missing type constraints", "No validation rules"],
      },
      {
        stepNumber: 4,
        instruction: "Use module in root configuration",
        command:
          'cat > main.tf <<EOF\nmodule "vpc_prod" {\n  source = "./modules/vpc"\n  \n  name               = "production"\n  cidr_block         = "10.0.0.0/16"\n  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]\n  \n  tags = {\n    Environment = "production"\n    ManagedBy   = "terraform"\n  }\n}\n\noutput "vpc_id" {\n  value = module.vpc_prod.vpc_id\n}\nEOF\nterraform init && terraform plan',
        explanation:
          "Root module calls VPC module with source path, passes input variables, uses outputs. Multiple module instances for different environments.",
        expectedOutput: "Module instantiated",
        validationCriteria: [
          "Module source referenced",
          "Variables passed",
          "Outputs accessible",
        ],
        commonMistakes: ["Wrong source path", "Missing required variables"],
      },
      {
        stepNumber: 5,
        instruction: "Configure remote state with S3 backend",
        command:
          'cat > backend.tf <<EOF\nterraform {\n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.tfstate"\n    region         = "us-east-1"\n    encrypt        = true\n    dynamodb_table = "terraform-locks"\n  }\n}\nEOF\naws s3 mb s3://my-terraform-state --region us-east-1 && aws s3api put-bucket-versioning --bucket my-terraform-state --versioning-configuration Status=Enabled && aws dynamodb create-table --table-name terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST',
        explanation:
          "Remote state stores terraform.tfstate in S3 with encryption. DynamoDB table provides state locking preventing concurrent modifications. Versioning enables rollback.",
        expectedOutput: "Remote backend configured",
        validationCriteria: [
          "S3 bucket created with versioning",
          "DynamoDB table for locks",
          "State encrypted at rest",
        ],
        commonMistakes: ["No state locking", "Bucket not encrypted"],
      },
      {
        stepNumber: 6,
        instruction: "Initialize backend and migrate state",
        command:
          'terraform init -backend-config="bucket=my-terraform-state" -backend-config="key=prod/terraform.tfstate" && terraform state list',
        explanation:
          "terraform init configures backend, migrates local state to S3. State locking prevents race conditions. Team members share same state.",
        expectedOutput: "State migrated to S3",
        validationCriteria: [
          "State in S3 bucket",
          "Lock table configured",
          "Local state backup created",
        ],
        commonMistakes: [
          "Losing local state",
          "No state backup before migration",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Use workspaces for multi-environment management",
        command:
          "terraform workspace list && terraform workspace new staging && terraform workspace new production && terraform workspace select staging && terraform workspace show",
        explanation:
          "Workspaces isolate state for different environments using same config. Default workspace + custom workspaces (staging, prod). Switch with terraform workspace select.",
        expectedOutput: "Workspaces created",
        validationCriteria: [
          "Multiple workspaces exist",
          "Can switch between workspaces",
          "State isolated per workspace",
        ],
        commonMistakes: [
          "Applying to wrong workspace",
          "Not using workspace in resource names",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Reference workspace in configuration",
        command:
          'cat > main.tf <<EOF\nlocals {\n  environment = terraform.workspace\n  instance_counts = {\n    default    = 1\n    staging    = 2\n    production = 5\n  }\n  instance_count = lookup(local.instance_counts, local.environment, 1)\n}\n\nresource "aws_instance" "app" {\n  count         = local.instance_count\n  ami           = "ami-12345678"\n  instance_type = local.environment == "production" ? "t3.large" : "t3.micro"\n  \n  tags = {\n    Name        = "${local.environment}-app-${count.index + 1}"\n    Environment = local.environment\n  }\n}\nEOF',
        explanation:
          "terraform.workspace gives current workspace name. Use to vary instance counts, sizes, names by environment. Conditional logic: production gets larger instances.",
        expectedOutput: "Workspace-aware config",
        validationCriteria: [
          "Instance count varies by workspace",
          "Tags include workspace name",
          "Conditional resource sizing",
        ],
        commonMistakes: [
          "Not tagging with workspace",
          "Same config for all environments",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Implement infrastructure testing with Terratest",
        command:
          'mkdir -p test && cat > test/vpc_test.go <<EOF\npackage test\n\nimport (\n  "testing"\n  "github.com/gruntwork-io/terratest/modules/terraform"\n  "github.com/stretchr/testify/assert"\n)\n\nfunc TestVPCModule(t *testing.T) {\n  terraformOptions := &terraform.Options{\n    TerraformDir: "../modules/vpc",\n    Vars: map[string]interface{}{\n      "name":                "test",\n      "cidr_block":          "10.0.0.0/16",\n      "public_subnet_cidrs": []string{"10.0.1.0/24"},\n    },\n  }\n  \n  defer terraform.Destroy(t, terraformOptions)\n  terraform.InitAndApply(t, terraformOptions)\n  \n  vpcID := terraform.Output(t, terraformOptions, "vpc_id")\n  assert.NotEmpty(t, vpcID)\n}\nEOF\ncd test && go mod init vpc-test && go mod tidy',
        explanation:
          "Terratest tests Terraform modules in real cloud. Applies config, validates outputs, destroys resources. Catches issues before production.",
        expectedOutput: "Test created",
        validationCriteria: [
          "Test applies module",
          "Validates outputs",
          "Cleans up resources",
        ],
        commonMistakes: [
          "Not cleaning up test resources",
          "Testing in production account",
        ],
      },
      {
        stepNumber: 10,
        instruction:
          "Validate configuration with terraform validate and tflint",
        command:
          "terraform validate && curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash && tflint --init && tflint",
        explanation:
          "terraform validate checks syntax and internal consistency. tflint detects deprecated syntax, provider errors, best practice violations.",
        expectedOutput: "Validation passed",
        validationCriteria: [
          "No syntax errors",
          "No deprecated syntax",
          "Best practices followed",
        ],
        commonMistakes: [
          "Skipping validation in CI/CD",
          "Ignoring tflint warnings",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Implement cost estimation with Infracost",
        command:
          "curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh && infracost auth login && infracost breakdown --path . && infracost diff --path .",
        explanation:
          "Infracost estimates cloud costs from Terraform. Shows monthly cost breakdown before apply. Diff shows cost changes. Integrate in pull requests.",
        expectedOutput: "Cost estimate generated",
        validationCriteria: [
          "Monthly cost calculated",
          "Cost per resource shown",
          "Diff available for changes",
        ],
        commonMistakes: [
          "Not reviewing costs before apply",
          "Deploying expensive resources accidentally",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Implement automated testing in CI/CD",
        command:
          "cat > .github/workflows/terraform.yml <<EOF\nname: Terraform\non: [pull_request]\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - uses: hashicorp/setup-terraform@v2\n    - run: terraform fmt -check\n    - run: terraform init\n    - run: terraform validate\n    - uses: terraform-linters/setup-tflint@v3\n    - run: tflint --init\n    - run: tflint\n    - uses: infracost/actions/setup@v2\n    - run: infracost breakdown --path . --format json --out-file /tmp/infracost.json\n    - uses: infracost/actions/comment@v1\n      with:\n        path: /tmp/infracost.json\nEOF",
        explanation:
          "CI/CD validates Terraform on every PR: format check, syntax validation, linting, cost estimation. Fails PR if validation fails. Prevents bad code merging.",
        expectedOutput: "CI/CD pipeline configured",
        validationCriteria: [
          "Validation runs on PR",
          "Format checked",
          "Costs estimated and commented",
        ],
        commonMistakes: [
          "No automated validation",
          "Merging without cost review",
        ],
      },
    ],
  },

  walk: {
    introduction: "Apply advanced Terraform through hands-on exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create Terraform module with variables and outputs.",
        template: `# modules/s3-bucket/main.tf
resource "aws_s3_bucket" "this" {
  bucket = var.__BUCKET_NAME__
  tags   = var.tags
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration {
    status = "__ENABLED__"
  }
}

# modules/s3-bucket/variables.tf
variable "bucket_name" {
  description = "Name of S3 bucket"
  type        = __STRING__
}

variable "tags" {
  description = "Tags for bucket"
  type        = __MAP(STRING)__
  default     = {}
}

# modules/s3-bucket/outputs.tf
output "bucket_id" {
  description = "S3 bucket ID"
  value       = aws_s3_bucket.this.__ID__
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.this.__ARN__
}`,
        blanks: [
          {
            id: "BUCKET_NAME",
            label: "BUCKET_NAME",
            hint: "Variable reference",
            correctValue: "bucket_name",
            validationPattern: "bucket.*name",
          },
          {
            id: "ENABLED",
            label: "ENABLED",
            hint: "Versioning status",
            correctValue: "Enabled",
            validationPattern: "enabled",
          },
          {
            id: "STRING",
            label: "STRING",
            hint: "Variable type",
            correctValue: "string",
            validationPattern: "string",
          },
          {
            id: "MAP(STRING)",
            label: "MAP(STRING)",
            hint: "Variable type",
            correctValue: "map(string)",
            validationPattern: "map",
          },
          {
            id: "ID",
            label: "ID",
            hint: "Bucket attribute",
            correctValue: "id",
            validationPattern: "id",
          },
          {
            id: "ARN",
            label: "ARN",
            hint: "Bucket attribute",
            correctValue: "arn",
            validationPattern: "arn",
          },
        ],
        solution:
          "S3 bucket module with versioning. Variables define inputs (bucket_name, tags) with types. Outputs expose bucket ID and ARN for use in root module. Reusable across projects.",
        explanation:
          "Terraform modules encapsulate resources with typed inputs and outputs",
      },
      {
        exerciseNumber: 2,
        scenario: "Configure remote state backend with S3 and DynamoDB.",
        template: `terraform {
  backend "__S3__" {
    bucket         = "__MY-TERRAFORM-STATE__"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = __TRUE__
    dynamodb_table = "__TERRAFORM-LOCKS__"
    kms_key_id     = "arn:aws:kms:us-east-1:123456789:key/abc123"
  }
}

# Create backend resources
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "__ENABLED__"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "__PAY_PER_REQUEST__"
  hash_key     = "__LOCK_ID__"
  
  attribute {
    name = "LockID"
    type = "__S__"
  }
}`,
        blanks: [
          {
            id: "S3",
            label: "S3",
            hint: "Backend type",
            correctValue: "s3",
            validationPattern: "s3",
          },
          {
            id: "MY-TERRAFORM-STATE",
            label: "MY-TERRAFORM-STATE",
            hint: "Bucket name",
            correctValue: "my-terraform-state",
            validationPattern: "terraform.*state",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Enable encryption",
            correctValue: "true",
            validationPattern: "true",
          },
          {
            id: "TERRAFORM-LOCKS",
            label: "TERRAFORM-LOCKS",
            hint: "DynamoDB table",
            correctValue: "terraform-locks",
            validationPattern: "locks",
          },
          {
            id: "ENABLED",
            label: "ENABLED",
            hint: "Versioning status",
            correctValue: "Enabled",
            validationPattern: "enabled",
          },
          {
            id: "PAY_PER_REQUEST",
            label: "PAY_PER_REQUEST",
            hint: "Billing mode",
            correctValue: "PAY_PER_REQUEST",
            validationPattern: "pay.*request",
          },
          {
            id: "LOCK_ID",
            label: "LOCK_ID",
            hint: "Hash key",
            correctValue: "LockID",
            validationPattern: "lock.*id",
          },
          {
            id: "S",
            label: "S",
            hint: "Attribute type",
            correctValue: "S",
            validationPattern: "s",
          },
        ],
        solution:
          "Remote S3 backend with encryption and versioning. DynamoDB table provides state locking preventing concurrent modifications. KMS encryption for security. Versioning enables state rollback.",
        explanation:
          "Remote state with locking enables team collaboration and prevents conflicts",
      },
      {
        exerciseNumber: 3,
        scenario: "Use workspaces for environment management.",
        template: `locals {
  environment = __TERRAFORM.WORKSPACE__
  
  instance_config = {
    dev = {
      count = __1__
      type  = "t3.micro"
    }
    staging = {
      count = 2
      type  = "t3.small"
    }
    production = {
      count = __5__
      type  = "__T3.LARGE__"
    }
  }
  
  config = __LOOKUP__(local.instance_config, local.environment, local.instance_config.dev)
}

resource "aws_instance" "app" {
  count         = local.config.__COUNT__
  ami           = "ami-12345678"
  instance_type = local.config.__TYPE__
  
  tags = {
    Name        = "\${local.environment}-app-\${count.index + 1}"
    Environment = local.environment
  }
}`,
        blanks: [
          {
            id: "TERRAFORM.WORKSPACE",
            label: "TERRAFORM.WORKSPACE",
            hint: "Workspace reference",
            correctValue: "terraform.workspace",
            validationPattern: "terraform.*workspace",
          },
          {
            id: "1",
            label: "1",
            hint: "Dev instance count",
            correctValue: "1",
            validationPattern: "1",
          },
          {
            id: "5",
            label: "5",
            hint: "Prod instance count",
            correctValue: "5",
            validationPattern: "5",
          },
          {
            id: "T3.LARGE",
            label: "T3.LARGE",
            hint: "Prod instance type",
            correctValue: "t3.large",
            validationPattern: "t3.*large",
          },
          {
            id: "LOOKUP",
            label: "LOOKUP",
            hint: "Map function",
            correctValue: "lookup",
            validationPattern: "lookup",
          },
          {
            id: "COUNT",
            label: "COUNT",
            hint: "Config key",
            correctValue: "count",
            validationPattern: "count",
          },
          {
            id: "TYPE",
            label: "TYPE",
            hint: "Config key",
            correctValue: "type",
            validationPattern: "type",
          },
        ],
        solution:
          "Workspaces manage environments with single config. Dev gets 1 t3.micro, staging 2 t3.small, production 5 t3.large. Lookup function selects config by workspace. Tags include environment name.",
        explanation:
          "Workspaces enable environment-specific configurations from single codebase",
      },
      {
        exerciseNumber: 4,
        scenario: "Implement module with validation and lifecycle rules.",
        template: `variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  
  validation {
    condition     = can(__CIDRHOST__(var.vpc_cidr, 0))
    error_message = "Must be valid IPv4 CIDR block."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

resource "aws_instance" "app" {
  ami           = "ami-12345678"
  instance_type = "t3.micro"
  
  lifecycle {
    __PREVENT_DESTROY__ = true
    ignore_changes      = [__AMI__, tags]
    create_before_destroy = __TRUE__
  }
  
  tags = {
    Environment = var.environment
  }
}`,
        blanks: [
          {
            id: "CIDRHOST",
            label: "CIDRHOST",
            hint: "CIDR function",
            correctValue: "cidrhost",
            validationPattern: "cidr",
          },
          {
            id: "PREVENT_DESTROY",
            label: "PREVENT_DESTROY",
            hint: "Lifecycle rule",
            correctValue: "prevent_destroy",
            validationPattern: "prevent.*destroy",
          },
          {
            id: "AMI",
            label: "AMI",
            hint: "Attribute to ignore",
            correctValue: "ami",
            validationPattern: "ami",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Enable rule",
            correctValue: "true",
            validationPattern: "true",
          },
        ],
        solution:
          "Variable validation ensures CIDR is valid IPv4 and environment is allowed value. Lifecycle rules: prevent_destroy protects critical resources, ignore_changes prevents drift, create_before_destroy enables zero-downtime replacement.",
        explanation:
          "Validation and lifecycle rules enforce safety and prevent errors",
      },
      {
        exerciseNumber: 5,
        scenario: "Set up CI/CD validation pipeline.",
        template: `name: Terraform
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: __1.6.0__
    
    - name: Format check
      run: terraform __FMT__ -check -recursive
    
    - name: Init
      run: terraform __INIT__
    
    - name: Validate
      run: terraform __VALIDATE__
    
    - name: Plan
      run: terraform __PLAN__ -out=tfplan
      env:
        AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
    
    - uses: infracost/actions/setup@v2
    - name: Cost estimate
      run: infracost __BREAKDOWN__ --path . --format json`,
        blanks: [
          {
            id: "1.6.0",
            label: "1.6.0",
            hint: "Terraform version",
            correctValue: "1.6.0",
            validationPattern: "1\\.6",
          },
          {
            id: "FMT",
            label: "FMT",
            hint: "Format command",
            correctValue: "fmt",
            validationPattern: "fmt",
          },
          {
            id: "INIT",
            label: "INIT",
            hint: "Initialize command",
            correctValue: "init",
            validationPattern: "init",
          },
          {
            id: "VALIDATE",
            label: "VALIDATE",
            hint: "Validation command",
            correctValue: "validate",
            validationPattern: "validate",
          },
          {
            id: "PLAN",
            label: "PLAN",
            hint: "Planning command",
            correctValue: "plan",
            validationPattern: "plan",
          },
          {
            id: "BREAKDOWN",
            label: "BREAKDOWN",
            hint: "Infracost command",
            correctValue: "breakdown",
            validationPattern: "breakdown",
          },
        ],
        solution:
          "GitHub Actions pipeline validates Terraform on PRs: format check, init, validate, plan, cost estimate. Prevents merging invalid code. Costs visible before approval.",
        explanation:
          "CI/CD automation ensures code quality and cost visibility",
      },
    ],
    hints: [
      "Modules should have variables.tf, main.tf, outputs.tf, versions.tf",
      "Remote state requires S3 bucket + DynamoDB table for locking",
      "Workspaces isolate state; use terraform.workspace in configs",
      "Variable validation prevents invalid inputs at plan time",
      "CI/CD should validate format, syntax, and estimate costs",
    ],
  },

  runGuided: {
    objective:
      "Build production Terraform infrastructure with reusable modules, remote state, multi-environment management, and automated testing",
    conceptualGuidance: [
      "Design module library: VPC, compute, storage, database modules",
      "Structure repo: modules/, environments/, shared/",
      "Configure remote S3 backend with state locking",
      "Use workspaces or separate state files for environments",
      "Implement variable validation and type constraints",
      "Add lifecycle rules: prevent_destroy, ignore_changes",
      "Write Terratest tests for critical modules",
      "Set up CI/CD: validate, plan, cost estimate on PRs",
      "Document modules with README and examples",
      "Version modules with Git tags for stability",
    ],
    keyConceptsToApply: [
      "Reusable module design",
      "Remote state management",
      "Workspace-based environments",
      "Infrastructure testing",
      "CI/CD automation",
    ],
    checkpoints: [
      {
        checkpoint: "Terraform modules created and reusable",
        description: "Module library with proper structure",
        validationCriteria: [
          "Modules in modules/ directory",
          "Each module has variables.tf, outputs.tf, main.tf",
          "Input validation on critical variables",
          "Outputs documented with descriptions",
          "Modules tested independently",
          "README with usage examples",
        ],
        hintIfStuck:
          "Create modules/vpc, modules/compute. Add variables.tf with validation. Define outputs.tf. Document in README. Test with Terratest or manual apply/destroy.",
      },
      {
        checkpoint: "Remote state with locking configured",
        description: "Team can collaborate safely on infrastructure",
        validationCriteria: [
          "S3 backend configured with encryption",
          "Bucket versioning enabled",
          "DynamoDB table for state locking",
          "State organized by environment/component",
          "Locking prevents concurrent modifications",
          "State accessible to team members",
        ],
        hintIfStuck:
          "Create S3 bucket with versioning and encryption. Create DynamoDB table with LockID key. Configure backend in backend.tf. Run terraform init to migrate state.",
      },
      {
        checkpoint: "Multi-environment management working",
        description: "Dev, staging, production environments isolated",
        validationCriteria: [
          "Workspaces or separate state per environment",
          "Environment-specific configurations",
          "Different resource counts/sizes per environment",
          "Tags include environment name",
          "Can deploy changes to staging before production",
          "No cross-environment interference",
        ],
        hintIfStuck:
          "Use terraform workspace for environments. Reference terraform.workspace in locals. Create map of environment configs. Apply to staging workspace first, then production.",
      },
    ],
    resourcesAllowed: [
      "Terraform module documentation",
      "Terraform backend configuration",
      "Terratest examples",
      "Infracost documentation",
    ],
  },

  runIndependent: {
    objective:
      "Build production-grade infrastructure-as-code platform with comprehensive module library, remote state, multi-environment management, automated testing, and complete CI/CD integration",
    successCriteria: [
      "Module library: reusable modules for VPC, compute, storage, database",
      "Remote state: S3 backend with encryption, versioning, DynamoDB locking",
      "Multi-environment: workspaces or separate state files for dev/staging/prod",
      "Variable validation: type constraints, custom validation rules",
      "Lifecycle management: prevent_destroy, ignore_changes, create_before_destroy",
      "Infrastructure testing: Terratest for critical modules",
      "CI/CD pipeline: format, validate, plan, cost estimate on PRs",
      "Documentation: module READMEs, architecture diagrams, runbooks",
      "Cost management: Infracost integrated, budgets monitored",
      "Security: sensitive values in secrets, least privilege IAM, encrypted state",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Reusable modules with inputs/outputs",
      "Remote state with locking",
      "Multi-environment management working",
    ],
    evaluationRubric: [
      {
        criterion: "Module Design",
        weight: 25,
        passingThreshold:
          "Modules properly structured with variables/outputs. Input validation configured. Reusable across projects. Documentation complete. Versioned with Git tags. Examples provided. Tested independently.",
      },
      {
        criterion: "State Management",
        weight: 25,
        passingThreshold:
          "Remote S3 backend with encryption and versioning. DynamoDB locking preventing conflicts. State organized by environment. Locking working correctly. Team can collaborate safely. Backup strategy documented.",
      },
      {
        criterion: "Environment Management",
        weight: 25,
        passingThreshold:
          "Workspaces or separate states per environment. Environment-specific configs (sizes, counts). Promotion workflow documented. No environment interference. Can deploy staging before production. Tags identify environment.",
      },
      {
        criterion: "Automation & Testing",
        weight: 25,
        passingThreshold:
          "CI/CD validating on PRs (format, validate, plan). Cost estimation automated. Terratest covering critical modules. No manual validation needed. Infracost integrated. Security scanning active.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=7xngnjfIlK4",
  documentation: [
    "https://developer.hashicorp.com/terraform/language/modules",
    "https://developer.hashicorp.com/terraform/language/state/remote",
    "https://developer.hashicorp.com/terraform/language/state/workspaces",
    "https://terratest.gruntwork.io/",
    "https://www.infracost.io/docs/",
    "https://github.com/terraform-linters/tflint",
  ],
  relatedConcepts: [
    "Terraform modules and reusability",
    "Remote state with S3 and DynamoDB",
    "Workspace-based environments",
    "Infrastructure testing with Terratest",
    "CI/CD for Terraform",
    "Cost estimation and optimization",
  ],
};

/**
 * Week 6 Lesson 2 - Terraform Basics
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week6Lesson2TerraformBasics: LeveledLessonContent = {
  lessonId: "week6-lesson2-terraform-basics",

  baseLesson: {
    title: "Terraform Basics: Your First Infrastructure as Code",
    description:
      "Learn Terraform fundamentals: providers, resources, variables, state, and basic workflows.",
    learningObjectives: [
      "Install and configure Terraform",
      "Write Terraform configuration for basic infrastructure",
      "Understand Terraform workflow: init, plan, apply, destroy",
      "Use variables and outputs effectively",
      "Manage Terraform state safely",
    ],
    prerequisites: [
      "Infrastructure as Code concepts",
      "AWS account and credentials",
      "Basic command line skills",
      "Text editor or IDE",
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
      "Learn Terraform step-by-step: installation, providers, resources, workflow commands, variables, outputs, and state management.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Install Terraform",
        command:
          "# macOS\nbrew tap hashicorp/tap\nbrew install hashicorp/tap/terraform\n\n# Windows (PowerShell)\nchoco install terraform\n\n# Linux\nwget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip\nunzip terraform_1.6.0_linux_amd64.zip\nsudo mv terraform /usr/local/bin/\n\n# Verify installation\nterraform version\n# Output: Terraform v1.6.0",
        explanation:
          "Terraform is single binary. Install via package manager or download directly. Verify with terraform version. No dependencies needed.",
        expectedOutput:
          "Terraform installed successfully, version command shows 1.6.0 or later.",
        validationCriteria: [
          "Terraform binary in PATH",
          "terraform version runs successfully",
          "Version 1.5+ recommended",
          "Command accessible from any directory",
        ],
        commonMistakes: [
          "Not adding to PATH (can't run terraform command)",
          "Using very old version (missing features)",
          "Installing in local directory (hard to access)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Create first Terraform configuration",
        command:
          'mkdir terraform-demo && cd terraform-demo\n\ncat > main.tf << \'EOF\'\nterraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "example" {\n  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2\n  instance_type = "t2.micro"\n\n  tags = {\n    Name = "terraform-example"\n  }\n}\nEOF',
        explanation:
          "Terraform configuration in HCL (HashiCorp Configuration Language). terraform{} block declares providers. provider{} configures AWS. resource{} defines EC2 instance. .tf files contain infrastructure code.",
        expectedOutput:
          "main.tf file created with provider and EC2 resource configuration.",
        validationCriteria: [
          "main.tf exists",
          "Valid HCL syntax",
          "Provider configured",
          "Resource defined",
          "AMI appropriate for region",
        ],
        commonMistakes: [
          "Wrong AMI for region (AMI IDs are region-specific)",
          "Syntax errors (HCL is sensitive to formatting)",
          "No tags (hard to identify resources in console)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Configure AWS credentials",
        command:
          '# Option 1: Environment variables (recommended for CI/CD)\nexport AWS_ACCESS_KEY_ID="your-access-key"\nexport AWS_SECRET_ACCESS_KEY="your-secret-key"\n\n# Option 2: AWS CLI credentials file (recommended for dev)\naws configure\n# Prompts for access key, secret key, region\n\n# Option 3: IAM instance role (for EC2)\n# No configuration needed\n\n# Verify\naws sts get-caller-identity',
        explanation:
          "Terraform needs AWS credentials. Environment variables or AWS CLI config. Never hardcode credentials in .tf files. Verify with AWS STS.",
        expectedOutput:
          "AWS credentials configured, get-caller-identity shows your account.",
        validationCriteria: [
          "Credentials configured (not in code)",
          "get-caller-identity succeeds",
          "Proper IAM permissions (EC2, VPC)",
          "Credentials not committed to Git",
        ],
        commonMistakes: [
          "Hardcoding credentials in Terraform files (security risk)",
          "Committing credentials to Git (exposed)",
          "Insufficient IAM permissions (Terraform fails)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Initialize Terraform: terraform init",
        command:
          'terraform init\n\n# Output:\nInitializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching "~> 5.0"...\n- Installing hashicorp/aws v5.25.0...\n- Installed hashicorp/aws v5.25.0\n\nTerraform has been successfully initialized!',
        explanation:
          "terraform init downloads provider plugins (AWS). Creates .terraform directory and lock file. Must run first, and after adding new providers. Safe to run multiple times.",
        expectedOutput:
          ".terraform/ directory created, providers downloaded, terraform.lock.hcl generated.",
        validationCriteria: [
          ".terraform directory exists",
          "Provider plugins downloaded",
          "terraform.lock.hcl created (version locking)",
          "Success message displayed",
          "Ready for plan/apply",
        ],
        commonMistakes: [
          "Skipping init (Terraform won't work)",
          "Not running init after adding providers (missing plugins)",
          "Deleting .terraform directory (must re-init)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Preview changes: terraform plan",
        command:
          'terraform plan\n\n# Output:\nTerraform will perform the following actions:\n\n  # aws_instance.example will be created\n  + resource "aws_instance" "example" {\n      + ami                    = "ami-0c55b159cbfafe1f0"\n      + instance_type          = "t2.micro"\n      + id                     = (known after apply)\n      + public_ip              = (known after apply)\n      + tags                   = {\n          + "Name" = "terraform-example"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.',
        explanation:
          "terraform plan shows what will change. + means create, ~ means modify, - means destroy. (known after apply) are values set by AWS. Always run plan before apply to review changes.",
        expectedOutput: "Plan shows 1 EC2 instance will be created, no errors.",
        validationCriteria: [
          "Plan executes without errors",
          "Shows 1 resource to add",
          "No unexpected changes",
          "Output is understandable",
          "Ready to apply safely",
        ],
        commonMistakes: [
          "Not reading plan output (miss important changes)",
          "Applying without planning (risky)",
          "Ignoring errors in plan (apply will fail)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Apply changes: terraform apply",
        command:
          "terraform apply\n\n# Shows same plan output, then asks:\nDo you want to perform these actions?\n  Terraform will perform the actions described above.\n  Only 'yes' will be accepted to approve.\n\n  Enter a value: yes\n\n# Creating resources...\naws_instance.example: Creating...\naws_instance.example: Still creating... [10s elapsed]\naws_instance.example: Creation complete after 31s [id=i-0123456789abcdef0]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.",
        explanation:
          'terraform apply creates infrastructure. Shows plan, requires "yes" confirmation. Creates resources, updates state file. Gives resource IDs when complete.',
        expectedOutput:
          "EC2 instance created successfully, state file updated, instance ID displayed.",
        validationCriteria: [
          "Apply completes successfully",
          "Instance created in AWS",
          "terraform.tfstate file created",
          "Instance ID shown",
          "Can see instance in AWS console",
        ],
        commonMistakes: [
          'Typing "y" instead of "yes" (Terraform rejects it)',
          "Not waiting for completion (killing process)",
          "Applying without reviewing plan (risky)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Understand state file: terraform.tfstate",
        command:
          'cat terraform.tfstate\n\n{\n  "version": 4,\n  "terraform_version": "1.6.0",\n  "resources": [\n    {\n      "type": "aws_instance",\n      "name": "example",\n      "instances": [\n        {\n          "attributes": {\n            "id": "i-0123456789abcdef0",\n            "public_ip": "54.123.45.67",\n            "ami": "ami-0c55b159cbfafe1f0",\n            "instance_type": "t2.micro"\n          }\n        }\n      ]\n    }\n  ]\n}',
        explanation:
          "State file maps Terraform code to real resources. Contains resource IDs, attributes, dependencies. Critical file - losing it means losing track of infrastructure. Contains sensitive data. Never commit to Git.",
        expectedOutput:
          "Understanding: State file is Terraform's database of managed infrastructure.",
        validationCriteria: [
          "State file exists after apply",
          "Contains resource details",
          "Maps code to AWS resource IDs",
          "Is JSON format",
          "Must be protected and backed up",
        ],
        commonMistakes: [
          "Committing state to Git (exposes sensitive data)",
          "Editing state manually (corruption)",
          "Deleting state file (lose infrastructure tracking)",
          "Not backing up state (catastrophic if lost)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Add variables for reusability",
        command:
          'cat > variables.tf << \'EOF\'\nvariable "region" {\n  description = "AWS region"\n  type        = string\n  default     = "us-east-1"\n}\n\nvariable "instance_type" {\n  description = "EC2 instance type"\n  type        = string\n  default     = "t2.micro"\n}\n\nvariable "instance_name" {\n  description = "Name tag for instance"\n  type        = string\n}\nEOF\n\n# Update main.tf to use variables:\nprovider "aws" {\n  region = var.region\n}\n\nresource "aws_instance" "example" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = var.instance_type\n\n  tags = {\n    Name = var.instance_name\n  }\n}',
        explanation:
          "Variables make code reusable. Define in variables.tf with type and default. Use with var.name syntax. Some can have defaults, others must be provided. Makes code flexible for different environments.",
        expectedOutput:
          "variables.tf created, main.tf updated to use variables.",
        validationCriteria: [
          "Variables defined with types",
          "Descriptions clear",
          "main.tf uses var. syntax",
          "Defaults for optional variables",
          "Required variables have no default",
        ],
        commonMistakes: [
          "Not setting default for optional variables",
          "Unclear variable descriptions",
          "Wrong variable types",
          "Hardcoding values that should be variables",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Provide variable values",
        command:
          '# Option 1: terraform.tfvars file (recommended)\ncat > terraform.tfvars << \'EOF\'\nregion        = "us-west-2"\ninstance_type = "t2.small"\ninstance_name = "my-server"\nEOF\n\n# Option 2: Command line\nterraform apply -var="instance_name=my-server"\n\n# Option 3: Environment variables\nexport TF_VAR_instance_name="my-server"\n\n# Option 4: Interactive prompt (if no value provided)\nterraform apply\n# var.instance_name\n#   Name tag for instance\n#   Enter a value: my-server',
        explanation:
          "Multiple ways to provide variable values. terraform.tfvars is most common (committed to Git). Command line for overrides. Environment vars for CI/CD. Prompts for required vars without defaults.",
        expectedOutput:
          "Variable values provided, Terraform can use them during apply.",
        validationCriteria: [
          "Variables have values",
          "terraform.tfvars for defaults",
          "Can override via -var flag",
          "Environment vars work",
          "No prompts for vars with values",
        ],
        commonMistakes: [
          "Committing terraform.tfvars with secrets (use .gitignore)",
          "Not documenting variable requirements",
          "Inconsistent variable naming",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Use outputs to expose values",
        command:
          'cat > outputs.tf << \'EOF\'\noutput "instance_id" {\n  description = "ID of the EC2 instance"\n  value       = aws_instance.example.id\n}\n\noutput "instance_public_ip" {\n  description = "Public IP of EC2 instance"\n  value       = aws_instance.example.public_ip\n}\n\noutput "instance_url" {\n  description = "URL to access instance"\n  value       = "http://${aws_instance.example.public_ip}"\n}\nEOF\n\nterraform apply\n\nOutputs:\ninstance_id = "i-0123456789abcdef0"\ninstance_public_ip = "54.123.45.67"\ninstance_url = "http://54.123.45.67"',
        explanation:
          "Outputs display values after apply. Expose resource attributes (IDs, IPs). Can be used by other Terraform configs or scripts. Helpful for debugging and integration.",
        expectedOutput: "Outputs defined, values displayed after apply.",
        validationCriteria: [
          "Outputs defined in outputs.tf",
          "Values shown after apply",
          "Can reference with terraform output",
          "Useful information exposed",
          "Descriptions are clear",
        ],
        commonMistakes: [
          "Outputting sensitive data (use sensitive = true)",
          "No descriptions on outputs",
          "Not outputting useful values (IDs, IPs)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Modify infrastructure",
        command:
          '# Change instance type in terraform.tfvars\ninstance_type = "t2.medium"\n\nterraform plan\n# Output:\n  ~ resource "aws_instance" "example" {\n      ~ instance_type = "t2.micro" -> "t2.medium"\n      # (other attributes unchanged)\n    }\n\nPlan: 0 to add, 1 to change, 0 to destroy.\n\nterraform apply\n# AWS will modify instance (may require stop/start)',
        explanation:
          "Change code, run plan to see diff. ~ means modify. Terraform determines if resource can be updated in-place or must be recreated. Instance type change may stop instance.",
        expectedOutput:
          "Instance type changed, Terraform shows modification in plan.",
        validationCriteria: [
          "Plan shows modification (~)",
          "Only intended change shown",
          "Apply updates resource",
          "No unnecessary recreates",
          "State updated with new values",
        ],
        commonMistakes: [
          "Not planning before apply (surprises)",
          "Forcing recreation when in-place update possible",
          "Making multiple changes without incremental testing",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Destroy infrastructure: terraform destroy",
        command:
          "terraform destroy\n\n# Shows plan of resources to destroy:\nPlan: 0 to add, 0 to change, 1 to destroy.\n\nDo you really want to destroy all resources?\n  Terraform will destroy all your managed infrastructure.\n  Enter a value: yes\n\naws_instance.example: Destroying... [id=i-0123456789abcdef0]\naws_instance.example: Destruction complete after 33s\n\nDestroy complete! Resources: 1 destroyed.",
        explanation:
          'terraform destroy deletes all resources. Requires "yes" confirmation. Removes from AWS and state file. Use for cleanup, tear down environments. Can target specific resources with -target.',
        expectedOutput:
          "All resources destroyed, state file empty, AWS resources gone.",
        validationCriteria: [
          "Destroy plan shows all resources",
          "Confirmation required",
          "Resources deleted from AWS",
          "State file emptied",
          "No orphaned resources",
        ],
        commonMistakes: [
          "Destroying production by accident (protect with workspace)",
          "Not reviewing destroy plan (delete wrong things)",
          "Interrupting destroy (partial state)",
        ],
      },
    ],
    expectedOutcome:
      "You can install Terraform, write basic configurations with providers and resources, use variables and outputs, execute init/plan/apply/destroy workflow, and understand state management basics.",
  },

  walk: {
    introduction: "Practice Terraform through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create complete Terraform configuration for web server.",
        template:
          'terraform {\n  required_providers {\n    __PROVIDER__ = {\n      source  = "hashicorp/aws"\n      version = "~> __VERSION__"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.__REGION__\n}\n\nresource "aws_instance" "web" {\n  ami           = var.ami\n  instance_type = var.__INSTANCE_TYPE__\n\n  tags = {\n    Name = var.__NAME_TAG__\n  }\n}\n\noutput "public_ip" {\n  value = aws_instance.web.__PUBLIC_IP__\n}',
        blanks: [
          {
            id: "PROVIDER",
            label: "PROVIDER",
            hint: "Cloud provider name",
            correctValue: "aws",
            validationPattern: ".*(aws).*",
          },
          {
            id: "VERSION",
            label: "VERSION",
            hint: "Major version",
            correctValue: "5.0",
            validationPattern: ".*(5|5\\.0).*",
          },
          {
            id: "REGION",
            label: "REGION",
            hint: "Variable for AWS region",
            correctValue: "region",
            validationPattern: ".*(region).*",
          },
          {
            id: "INSTANCE_TYPE",
            label: "INSTANCE_TYPE",
            hint: "Variable for instance size",
            correctValue: "instance_type",
            validationPattern: ".*(instance.*type).*",
          },
          {
            id: "NAME_TAG",
            label: "NAME_TAG",
            hint: "Variable for name",
            correctValue: "instance_name",
            validationPattern: ".*(name|tag).*",
          },
          {
            id: "PUBLIC_IP",
            label: "PUBLIC_IP",
            hint: "Instance attribute for IP",
            correctValue: "public_ip",
            validationPattern: ".*(public.*ip).*",
          },
        ],
        solution:
          'terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.region\n}\n\nresource "aws_instance" "web" {\n  ami           = var.ami\n  instance_type = var.instance_type\n\n  tags = {\n    Name = var.instance_name\n  }\n}\n\noutput "public_ip" {\n  value = aws_instance.web.public_ip\n}',
        explanation:
          "Complete Terraform configuration with provider, resource, variables, and output.",
      },
      {
        exerciseNumber: 2,
        scenario: "Define variables with appropriate types and defaults.",
        template:
          'variable "region" {\n  description = "AWS region"\n  type        = __STRING__\n  default     = "us-east-1"\n}\n\nvariable "instance_count" {\n  description = "Number of instances"\n  type        = __NUMBER__\n  default     = __ONE__\n}\n\nvariable "instance_tags" {\n  description = "Tags for instances"\n  type        = map(__STRING__)\n  default     = {\n    Environment = "dev"\n    Managed     = "terraform"\n  }\n}\n\nvariable "enable_monitoring" {\n  description = "Enable detailed monitoring"\n  type        = __BOOL__\n  default     = __FALSE__\n}',
        blanks: [
          {
            id: "STRING",
            label: "STRING",
            hint: "Type for text",
            correctValue: "string",
            validationPattern: ".*(string).*",
          },
          {
            id: "NUMBER",
            label: "NUMBER",
            hint: "Type for integers",
            correctValue: "number",
            validationPattern: ".*(number|num).*",
          },
          {
            id: "ONE",
            label: "ONE",
            hint: "Default count",
            correctValue: "1",
            validationPattern: ".*(1|one).*",
          },
          {
            id: "BOOL",
            label: "BOOL",
            hint: "Type for true/false",
            correctValue: "bool",
            validationPattern: ".*(bool).*",
          },
          {
            id: "FALSE",
            label: "FALSE",
            hint: "Monitoring default off",
            correctValue: "false",
            validationPattern: ".*(false).*",
          },
        ],
        solution:
          'variable "region" {\n  description = "AWS region"\n  type        = string\n  default     = "us-east-1"\n}\n\nvariable "instance_count" {\n  description = "Number of instances"\n  type        = number\n  default     = 1\n}\n\nvariable "instance_tags" {\n  description = "Tags for instances"\n  type        = map(string)\n  default     = {\n    Environment = "dev"\n    Managed     = "terraform"\n  }\n}\n\nvariable "enable_monitoring" {\n  description = "Enable detailed monitoring"\n  type        = bool\n  default     = false\n}',
        explanation:
          "Variables with proper types: string, number, map, bool. Defaults for optional values.",
      },
      {
        exerciseNumber: 3,
        scenario: "Execute Terraform workflow in correct order.",
        template:
          "Terraform workflow:\n\n1. __INIT__: Download providers\n2. __PLAN__: Preview changes\n3. __APPLY__: Create infrastructure\n4. __OUTPUT__: View output values\n5. __DESTROY__: Clean up resources\n\nCommands:\n$ terraform __INIT__\n$ terraform __PLAN__\n$ terraform __APPLY__ (type __YES__ to confirm)\n$ terraform __OUTPUT__\n$ terraform __DESTROY__ (type yes to confirm)",
        blanks: [
          {
            id: "INIT",
            label: "INIT",
            hint: "Initialize Terraform",
            correctValue: "init",
            validationPattern: ".*(init).*",
          },
          {
            id: "PLAN",
            label: "PLAN",
            hint: "Show what will change",
            correctValue: "plan",
            validationPattern: ".*(plan).*",
          },
          {
            id: "APPLY",
            label: "APPLY",
            hint: "Execute changes",
            correctValue: "apply",
            validationPattern: ".*(apply).*",
          },
          {
            id: "YES",
            label: "YES",
            hint: "Confirmation word (not y)",
            correctValue: "yes",
            validationPattern: ".*(yes).*",
          },
          {
            id: "OUTPUT",
            label: "OUTPUT",
            hint: "Show outputs",
            correctValue: "output",
            validationPattern: ".*(output).*",
          },
          {
            id: "DESTROY",
            label: "DESTROY",
            hint: "Delete all resources",
            correctValue: "destroy",
            validationPattern: ".*(destroy).*",
          },
        ],
        solution:
          "Terraform workflow:\n\n1. init: Download providers\n2. plan: Preview changes\n3. apply: Create infrastructure\n4. output: View output values\n5. destroy: Clean up resources\n\nCommands:\n$ terraform init\n$ terraform plan\n$ terraform apply (type yes to confirm)\n$ terraform output\n$ terraform destroy (type yes to confirm)",
        explanation:
          "Standard Terraform workflow: init → plan → apply → output → destroy.",
      },
      {
        exerciseNumber: 4,
        scenario: "Understand Terraform plan output.",
        template:
          "Plan output symbols:\n\n__PLUS__: Resource will be created\n__TILDE__: Resource will be modified in-place\n__MINUS__: Resource will be destroyed\n__MINUS_PLUS__: Resource must be destroyed and recreated\n\nExample:\nPlan: __ADD__ to add, __CHANGE__ to change, __DESTROY__ to destroy.",
        blanks: [
          {
            id: "PLUS",
            label: "PLUS",
            hint: "Symbol for create",
            correctValue: "+",
            validationPattern: ".*(\\+|plus).*",
          },
          {
            id: "TILDE",
            label: "TILDE",
            hint: "Symbol for modify",
            correctValue: "~",
            validationPattern: ".*(~|tilde).*",
          },
          {
            id: "MINUS",
            label: "MINUS",
            hint: "Symbol for destroy",
            correctValue: "-",
            validationPattern: ".*(-|minus).*",
          },
          {
            id: "MINUS_PLUS",
            label: "MINUS_PLUS",
            hint: "Symbol for replace",
            correctValue: "-/+",
            validationPattern: ".*(-/\\+|replace).*",
          },
          {
            id: "ADD",
            label: "ADD",
            hint: "Count in summary",
            correctValue: "1",
            validationPattern: ".*(\\d+|number).*",
          },
          {
            id: "CHANGE",
            label: "CHANGE",
            hint: "Count in summary",
            correctValue: "0",
            validationPattern: ".*(\\d+|number).*",
          },
          {
            id: "DESTROY",
            label: "DESTROY",
            hint: "Count in summary",
            correctValue: "0",
            validationPattern: ".*(\\d+|number).*",
          },
        ],
        solution:
          "Plan output symbols:\n\n+: Resource will be created\n~: Resource will be modified in-place\n-: Resource will be destroyed\n-/+: Resource must be destroyed and recreated\n\nExample:\nPlan: 1 to add, 0 to change, 0 to destroy.",
        explanation:
          "Terraform plan uses symbols to show planned changes: +create, ~modify, -destroy, -/+replace.",
      },
      {
        exerciseNumber: 5,
        scenario: "Remote state configuration for team collaboration.",
        template:
          'terraform {\n  backend "__S3__" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.__TFSTATE__"\n    region         = "us-east-1"\n    encrypt        = __TRUE__\n    dynamodb_table = "terraform-__LOCKS__"\n  }\n}\n\n# Benefits:\n- __SHARED__ state for team\n- __LOCKING__ prevents concurrent runs\n- __ENCRYPTED__ at rest\n- __VERSIONED__ (S3 versioning)',
        blanks: [
          {
            id: "S3",
            label: "S3",
            hint: "AWS storage service",
            correctValue: "s3",
            validationPattern: ".*(s3).*",
          },
          {
            id: "TFSTATE",
            label: "TFSTATE",
            hint: "State file extension",
            correctValue: "tfstate",
            validationPattern: ".*(tfstate).*",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Enable encryption",
            correctValue: "true",
            validationPattern: ".*(true).*",
          },
          {
            id: "LOCKS",
            label: "LOCKS",
            hint: "Prevent concurrent access",
            correctValue: "locks",
            validationPattern: ".*(lock).*",
          },
          {
            id: "SHARED",
            label: "SHARED",
            hint: "Team can access",
            correctValue: "Shared",
            validationPattern: ".*(shared|team).*",
          },
          {
            id: "LOCKING",
            label: "LOCKING",
            hint: "Prevents conflicts",
            correctValue: "Locking",
            validationPattern: ".*(lock).*",
          },
          {
            id: "ENCRYPTED",
            label: "ENCRYPTED",
            hint: "Secure storage",
            correctValue: "Encrypted",
            validationPattern: ".*(encrypt).*",
          },
          {
            id: "VERSIONED",
            label: "VERSIONED",
            hint: "History of state changes",
            correctValue: "Versioned",
            validationPattern: ".*(version|history).*",
          },
        ],
        solution:
          'terraform {\n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.tfstate"\n    region         = "us-east-1"\n    encrypt        = true\n    dynamodb_table = "terraform-locks"\n  }\n}\n\n# Benefits:\n- Shared state for team\n- Locking prevents concurrent runs\n- Encrypted at rest\n- Versioned (S3 versioning)',
        explanation:
          "Remote S3 backend with DynamoDB locking enables team collaboration on Terraform.",
      },
    ],
    hints: [
      "Always run plan before apply to preview changes",
      "Use variables for values that differ between environments",
      "Store state remotely for team collaboration",
      "Never commit state files or terraform.tfvars with secrets to Git",
      "terraform init after adding new providers",
    ],
  },

  runGuided: {
    objective:
      "Build multi-resource AWS infrastructure with Terraform including VPC, security groups, EC2 instances, and proper state management",
    conceptualGuidance: [
      "Design infrastructure: VPC, subnets, security group, EC2 instances",
      "Create modular configuration: separate files for network, compute, variables, outputs",
      "Use variables for environment-specific values (instance count, sizes)",
      "Configure remote state backend (S3 + DynamoDB)",
      "Implement proper security: no hardcoded credentials, encrypted state",
      "Add outputs for useful information (IPs, DNS names)",
      "Test workflow: init, plan, apply, verify in AWS console",
      "Document configuration and usage in README",
      "Clean up resources with destroy",
    ],
    keyConceptsToApply: [
      "Resource dependencies",
      "Variable usage",
      "Remote state configuration",
      "Terraform workflow",
      "Infrastructure organization",
    ],
    checkpoints: [
      {
        checkpoint: "Configuration created and organized",
        description: "Terraform files structured properly",
        validationCriteria: [
          "Separate files: main.tf, variables.tf, outputs.tf, backend.tf",
          "VPC, subnet, security group, EC2 resources defined",
          "Variables for all environment-specific values",
          "Outputs expose useful information",
          "No hardcoded sensitive values",
        ],
        hintIfStuck:
          "Create VPC first, then subnet (depends on VPC), security group (depends on VPC), finally EC2 (depends on subnet and security group). Use resource.name.id to reference dependencies.",
      },
      {
        checkpoint: "Remote state configured",
        description: "State backend working for team collaboration",
        validationCriteria: [
          "S3 bucket created for state storage",
          "DynamoDB table for locking",
          "Backend configuration in code",
          "terraform init migrates state to S3",
          "State encryption enabled",
          "Multiple team members can run Terraform safely",
        ],
        hintIfStuck:
          'Create S3 bucket manually first. Enable versioning. Create DynamoDB table with LockID partition key. Add backend "s3" {} block. Run terraform init to migrate local state to S3.',
      },
      {
        checkpoint: "Infrastructure deployed and documented",
        description: "Working infrastructure with documentation",
        validationCriteria: [
          "terraform apply succeeds",
          "All resources created in AWS",
          "Outputs show IPs and IDs",
          "README documents: how to use, required AWS permissions, variables",
          "Can destroy and recreate infrastructure reliably",
          "Team can understand and use configuration",
        ],
        hintIfStuck:
          "Document prerequisites (AWS credentials, Terraform version), required variables, how to run (init, plan, apply), how to access resources (SSH to IPs from outputs), how to clean up (destroy).",
      },
    ],
    resourcesAllowed: [
      "Terraform AWS provider documentation",
      "Terraform language documentation",
      "AWS console for verification",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready Terraform project with multi-environment support, modules, remote state, CI/CD integration, and comprehensive documentation",
    successCriteria: [
      "Multi-environment: Dev, staging, production with separate state, appropriate sizing per environment",
      "Modular design: Reusable modules for VPC, compute, database, shared across environments",
      "Complete infrastructure: VPC with public/private subnets, NAT gateway, security groups, EC2 instances, RDS database, S3 bucket",
      "Remote state: S3 backend with encryption and locking, state isolation per environment",
      "Variables: All environment-specific values parameterized, validation rules, sensitive variables marked",
      "Outputs: Useful information exposed (IPs, DNS, connection strings), descriptions provided",
      "Security: No hardcoded credentials, secrets in AWS Secrets Manager or SSM Parameter Store, least-privilege IAM",
      "CI/CD integration: GitHub Actions workflow to plan on PR, apply on merge to main, separate jobs per environment",
      "Documentation: Architecture diagram, module usage, variable requirements, deployment guide, troubleshooting",
      "Testing: Successfully deploy to all three environments, verify resources work, destroy cleanly",
    ],
    timeTarget: 30,
    minimumRequirements: [
      "Working Terraform configuration creating AWS resources",
      "Variables and outputs implemented",
      "Remote state configured",
    ],
    evaluationRubric: [
      {
        criterion: "Infrastructure Completeness",
        weight: 30,
        passingThreshold:
          "Complete multi-tier infrastructure (VPC, compute, database, storage). All resources configured properly with security groups, proper networking. Health checks validate deployment. Production-ready configuration.",
      },
      {
        criterion: "Code Quality and Organization",
        weight: 25,
        passingThreshold:
          "Modular design with reusable components. Clear file organization. Variables for all configurable values. Outputs provide useful information. Code is DRY (Don't Repeat Yourself). Follows Terraform best practices.",
      },
      {
        criterion: "State Management and Security",
        weight: 25,
        passingThreshold:
          "Remote state in S3 with encryption and locking. State isolated per environment. No secrets in code or state (use AWS Secrets Manager). Proper IAM permissions. Backend configuration versioned.",
      },
      {
        criterion: "Operational Readiness",
        weight: 20,
        passingThreshold:
          "CI/CD pipeline automates plan/apply. Multi-environment deployment works. Documentation enables team to use independently. Can deploy, modify, and destroy reliably. Troubleshooting guide helps resolve common issues.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=SLB_c_ayRMo",
  documentation: [
    "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs",
    "https://developer.hashicorp.com/terraform/language",
    "https://developer.hashicorp.com/terraform/cli/commands",
  ],
  relatedConcepts: [
    "Infrastructure as Code principles",
    "AWS services and networking",
    "State management and backends",
    "CI/CD integration",
    "Security and secrets management",
    "Module design and reusability",
  ],
};

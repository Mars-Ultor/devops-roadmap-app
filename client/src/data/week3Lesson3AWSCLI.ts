/**
 * Week 3 Lesson 3 - AWS CLI Basics
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week3Lesson3AWSCLI: LeveledLessonContent = {
  lessonId: 'week3-lesson3-aws-cli',
  
  baseLesson: {
    title: 'AWS Command Line Interface (CLI) Fundamentals',
    description: 'Master AWS CLI for infrastructure automation and management from the terminal.',
    learningObjectives: [
      'Install and configure AWS CLI',
      'Manage EC2 instances from command line',
      'Work with S3 buckets and objects via CLI',
      'Automate AWS tasks with scripts'
    ],
    prerequisites: [
      'AWS account with IAM user',
      'Understanding of AWS services (EC2, S3, VPC)',
      'Linux command line proficiency'
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn AWS CLI step-by-step: installation, configuration, EC2 management, S3 operations, and automation.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Install AWS CLI',
        command: 'Linux/Mac: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install\nWindows: Download MSI installer from aws.amazon.com/cli\nVerify: aws --version',
        explanation: 'AWS CLI lets you control AWS from terminal. Alternative to web console. Essential for automation and scripting. Version 2 is current.',
        expectedOutput: 'aws-cli/2.x.x Python/3.x.x (shows installed version)',
        validationCriteria: [
          'AWS CLI installed successfully',
          'Version 2.x or higher',
          'Command accessible from terminal',
          'Python dependencies included'
        ],
        commonMistakes: [
          'Installing AWS CLI v1 (use v2 instead)',
          'Not adding to PATH (command not found)',
          'Permission issues on Linux (need sudo for install)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Configure AWS CLI with credentials',
        command: 'aws configure\n  AWS Access Key ID: <your-access-key>\n  AWS Secret Access Key: <your-secret-key>\n  Default region: us-east-1\n  Default output format: json',
        explanation: 'Configuration stores credentials in ~/.aws/credentials and config in ~/.aws/config. Access keys from IAM user. Region determines where resources created. Output: json, text, or table.',
        expectedOutput: 'Configuration saved. Subsequent commands use these credentials.',
        validationCriteria: [
          'Credentials file created (~/.aws/credentials)',
          'Config file created (~/.aws/config)',
          'Can run aws commands without errors',
          'Region and output format set'
        ],
        commonMistakes: [
          'Using root account credentials (create IAM user instead)',
          'Committing credentials to git (use environment variables or IAM roles)',
          'Wrong region (resources won\'t be visible)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Test configuration with basic command',
        command: 'aws sts get-caller-identity',
        explanation: 'get-caller-identity shows your AWS account ID, user ARN, and user ID. Confirms credentials work. No cost, safe to run.',
        expectedOutput: '{\n  "UserId": "AIDAI...",\n  "Account": "123456789012",\n  "Arn": "arn:aws:iam::123456789012:user/username"\n}',
        validationCriteria: [
          'Returns your account information',
          'No authentication errors',
          'JSON output formatted correctly',
          'User ARN shows your IAM user'
        ],
        commonMistakes: [
          'Credentials invalid (check Access Key ID and Secret)',
          'No internet connection (CLI needs to reach AWS)',
          'IAM user lacks necessary permissions'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'List EC2 instances',
        command: 'aws ec2 describe-instances\n# Filter running instances only:\naws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,PublicIpAddress]" --output table',
        explanation: 'describe-instances shows all EC2 instances. --filters narrows results. --query extracts specific fields (JMESPath syntax). --output table makes readable.',
        expectedOutput: 'Table showing instance IDs, types, states, and IP addresses',
        validationCriteria: [
          'Lists all EC2 instances in region',
          'Filters work correctly',
          'Query extracts desired fields',
          'Table output readable'
        ],
        commonMistakes: [
          'Wrong region (no instances visible, check --region flag)',
          'Complex JMESPath query syntax errors',
          'Forgetting to filter (too much output)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Start and stop EC2 instances',
        command: '# Stop instance:\naws ec2 stop-instances --instance-ids i-1234567890abcdef0\n\n# Start instance:\naws ec2 start-instances --instance-ids i-1234567890abcdef0\n\n# Check status:\naws ec2 describe-instance-status --instance-ids i-1234567890abcdef0',
        explanation: 'stop-instances shuts down instance (stops billing for compute, EBS storage still charged). start-instances powers on. describe-instance-status shows current state.',
        expectedOutput: 'State transitions: running → stopping → stopped → pending → running',
        validationCriteria: [
          'Stop command accepted',
          'Instance stops within 1-2 minutes',
          'Start command brings instance back',
          'Status checks show system/instance health'
        ],
        commonMistakes: [
          'Terminating instead of stopping (deletes instance)',
          'Not waiting for state change (takes time)',
          'Stopping instance with instance store (data lost)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Launch new EC2 instance',
        command: 'aws ec2 run-instances \\\n  --image-id ami-0c55b159cbfafe1f0 \\\n  --count 1 \\\n  --instance-type t2.micro \\\n  --key-name MyKeyPair \\\n  --security-group-ids sg-0123456789abcdef0 \\\n  --subnet-id subnet-0bb1c79de3EXAMPLE',
        explanation: 'run-instances launches new EC2. Need: AMI ID (OS image), instance type (size), key pair (SSH access), security group (firewall), subnet (network).',
        expectedOutput: 'JSON with instance details including instance ID, state (pending), private IP',
        validationCriteria: [
          'Instance launches successfully',
          'Instance ID returned',
          'State shows "pending" then "running"',
          'Can SSH using key pair'
        ],
        commonMistakes: [
          'Wrong AMI ID for region (AMIs are region-specific)',
          'Key pair doesn\'t exist (create first)',
          'Security group doesn\'t allow SSH (port 22 blocked)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'List S3 buckets',
        command: 'aws s3 ls\n# List objects in bucket:\naws s3 ls s3://my-bucket-name/\n# Recursive listing:\naws s3 ls s3://my-bucket-name/ --recursive',
        explanation: 's3 ls lists buckets or objects. Similar to Linux ls command. --recursive shows all objects in all subdirectories.',
        expectedOutput: 'List of bucket names with creation dates, or list of objects with sizes and timestamps',
        validationCriteria: [
          'Shows all buckets in account',
          'Can list objects within bucket',
          'Recursive flag shows nested objects',
          'Timestamps and sizes displayed'
        ],
        commonMistakes: [
          'Bucket name wrong (S3 bucket names are case-sensitive)',
          'No permissions (IAM policy must allow s3:ListBucket)',
          'Wrong region (some buckets might not be visible)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Upload and download S3 files',
        command: '# Upload file:\naws s3 cp local-file.txt s3://my-bucket/remote-file.txt\n\n# Download file:\naws s3 cp s3://my-bucket/remote-file.txt local-file.txt\n\n# Sync directory:\naws s3 sync ./local-dir s3://my-bucket/remote-dir/',
        explanation: 's3 cp copies files to/from S3. s3 sync synchronizes directories (like rsync). Sync only transfers changed files, efficient for large directories.',
        expectedOutput: 'Upload/download progress shown, completed successfully. Sync shows which files transferred.',
        validationCriteria: [
          'Files upload successfully',
          'Download retrieves correct file',
          'Sync only transfers new/changed files',
          'Large files show progress'
        ],
        commonMistakes: [
          'Forgetting s3:// prefix (CLI thinks it\'s local path)',
          'No permissions (need s3:PutObject for upload, s3:GetObject for download)',
          'Overwriting files accidentally (sync can delete if --delete flag used)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Create and delete S3 buckets',
        command: '# Create bucket:\naws s3 mb s3://my-unique-bucket-name-12345\n\n# Delete empty bucket:\naws s3 rb s3://my-unique-bucket-name-12345\n\n# Delete bucket with contents (careful!):\naws s3 rb s3://my-unique-bucket-name-12345 --force',
        explanation: 's3 mb makes bucket (like mkdir). Bucket names must be globally unique. s3 rb removes bucket. --force deletes all objects first (dangerous).',
        expectedOutput: 'make_bucket: my-unique-bucket-name-12345 (or error if name taken)',
        validationCriteria: [
          'Bucket created with unique name',
          'Empty bucket deleted successfully',
          '--force flag deletes bucket with contents',
          'Understand global uniqueness requirement'
        ],
        commonMistakes: [
          'Bucket name not unique (error: BucketAlreadyExists)',
          'Bucket name invalid (lowercase, no underscores, 3-63 chars)',
          'Deleting bucket with --force accidentally (irreversible)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Filter and query with JMESPath',
        command: '# Get instance IDs only:\naws ec2 describe-instances --query "Reservations[*].Instances[*].InstanceId" --output text\n\n# Filter by tag:\naws ec2 describe-instances --filters "Name=tag:Environment,Values=production" --query "Reservations[*].Instances[*].[Tags[?Key==\'Name\'].Value | [0],InstanceId,State.Name]" --output table',
        explanation: '--query uses JMESPath to extract specific fields from JSON output. Powerful for filtering and transforming data. Combines with --output for readable results.',
        expectedOutput: 'Filtered list showing only requested fields in specified format',
        validationCriteria: [
          'Query extracts correct fields',
          'Filters apply properly',
          'Output format aids readability',
          'Complex queries work (nested arrays, conditionals)'
        ],
        commonMistakes: [
          'JMESPath syntax errors (brackets, quotes)',
          'Not escaping quotes in shell (use \\\')',
          'Query doesn\'t match data structure (check raw JSON first)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Use profiles for multiple accounts',
        command: '# Configure additional profile:\naws configure --profile work\n\n# Use profile:\naws s3 ls --profile work\n\n# Set default profile:\nexport AWS_PROFILE=work',
        explanation: 'Profiles manage multiple AWS accounts/regions. Each profile has own credentials and config. Switch with --profile flag or AWS_PROFILE environment variable.',
        expectedOutput: 'Commands execute against specified profile\'s account',
        validationCriteria: [
          'Multiple profiles configured',
          '--profile flag selects correct account',
          'AWS_PROFILE environment variable works',
          'Profiles stored in ~/.aws/credentials and config'
        ],
        commonMistakes: [
          'Forgetting which profile is active (accidentally modify wrong account)',
          'Not using profiles (mixing credentials, security risk)',
          'Profile name typo (command uses default profile instead)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Automate with AWS CLI scripts',
        command: '#!/bin/bash\n# backup-instances.sh\n# Stop dev instances at night\nfor instance in $(aws ec2 describe-instances --filters "Name=tag:Environment,Values=dev" --query "Reservations[*].Instances[*].InstanceId" --output text); do\n  echo "Stopping $instance"\n  aws ec2 stop-instances --instance-ids $instance\ndone',
        explanation: 'AWS CLI in scripts enables automation. Loop through resources, apply actions, save costs. Use cron for scheduling. Combine with jq for complex JSON processing.',
        expectedOutput: 'Script stops all dev instances automatically, can run on schedule',
        validationCriteria: [
          'Script executes successfully',
          'Loops through resources correctly',
          'Actions apply to filtered resources only',
          'Error handling included (if possible)'
        ],
        commonMistakes: [
          'No error handling (script fails silently)',
          'Hardcoding values (use parameters)',
          'Not testing filter (affects wrong instances)',
          'Missing shebang (#!/bin/bash)'
        ]
      }
    ],
    expectedOutcome: 'You can install and configure AWS CLI, manage EC2 instances (list, start, stop, launch), work with S3 (upload, download, sync), use filters and queries, manage multiple profiles, and automate tasks with scripts.'
  },

  walk: {
    introduction: 'Practice AWS CLI through scenario-based exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Configure AWS CLI for multiple environments (dev, staging, prod).',
        template: 'aws __CONFIGURE__ --profile dev\naws __CONFIGURE__ --profile staging  \naws __CONFIGURE__ --profile prod\n\n# Use specific profile:\naws s3 ls --profile __DEV__\n\n# Set default:\nexport __AWS_PROFILE__=prod',
        blanks: [
          {
            id: 'CONFIGURE',
            label: 'CONFIGURE',
            hint: 'Command to set credentials',
            correctValue: 'configure',
            validationPattern: '^configure$'
          },
          {
            id: 'DEV',
            label: 'DEV',
            hint: 'Development profile name',
            correctValue: 'dev',
            validationPattern: '^dev$'
          },
          {
            id: 'AWS_PROFILE',
            label: 'AWS_PROFILE',
            hint: 'Environment variable for default profile',
            correctValue: 'AWS_PROFILE',
            validationPattern: '^AWS_PROFILE$'
          }
        ],
        solution: 'aws configure --profile dev\naws configure --profile staging\naws configure --profile prod\n\n# Use specific profile:\naws s3 ls --profile dev\n\n# Set default:\nexport AWS_PROFILE=prod',
        explanation: 'Profiles prevent credential mixing and enable multi-account management. Use --profile flag or AWS_PROFILE environment variable.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Find all running EC2 instances with tag Environment=production.',
        template: 'aws ec2 __DESCRIBE_INSTANCES__ \\\n  --filters \\\n    "Name=__INSTANCE_STATE__,Values=running" \\\n    "Name=tag:Environment,Values=__PRODUCTION__" \\\n  --query "__QUERY__" \\\n  --output table',
        blanks: [
          {
            id: 'DESCRIBE_INSTANCES',
            label: 'DESCRIBE_INSTANCES',
            hint: 'Command to list instances',
            correctValue: 'describe-instances',
            validationPattern: '^describe-instances$'
          },
          {
            id: 'INSTANCE_STATE',
            label: 'INSTANCE_STATE',
            hint: 'Filter name for instance state',
            correctValue: 'instance-state-name',
            validationPattern: '.*(instance.*state|state).*'
          },
          {
            id: 'PRODUCTION',
            label: 'PRODUCTION',
            hint: 'Tag value to filter',
            correctValue: 'production',
            validationPattern: '^production$'
          },
          {
            id: 'QUERY',
            label: 'QUERY',
            hint: 'JMESPath to extract InstanceId and PublicIp',
            correctValue: 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress]',
            validationPattern: '.*(Reservations|Instances|InstanceId).*'
          }
        ],
        solution: 'aws ec2 describe-instances \\\n  --filters \\\n    "Name=instance-state-name,Values=running" \\\n    "Name=tag:Environment,Values=production" \\\n  --query "Reservations[*].Instances[*].[InstanceId,PublicIpAddress]" \\\n  --output table',
        explanation: 'Filters narrow results. JMESPath queries extract specific fields. Output format controls presentation.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Upload website files to S3 and make bucket public for static hosting.',
        template: '# Sync local directory to S3:\naws s3 __SYNC__ ./website/ s3://my-website-bucket/ __RECURSIVE__\n\n# Enable static hosting:\naws s3 website s3://my-website-bucket/ \\\n  --index-document __INDEX_HTML__ \\\n  --error-document __ERROR_HTML__\n\n# Set public read policy:\naws s3api put-bucket-policy --bucket my-website-bucket --policy file://policy.json',
        blanks: [
          {
            id: 'SYNC',
            label: 'SYNC',
            hint: 'Command to synchronize directories',
            correctValue: 'sync',
            validationPattern: '^sync$'
          },
          {
            id: 'RECURSIVE',
            label: 'RECURSIVE',
            hint: 'Flag to include subdirectories (optional, sync is recursive by default)',
            correctValue: '--delete',
            validationPattern: '.*(delete|recursive)?.*'
          },
          {
            id: 'INDEX_HTML',
            label: 'INDEX_HTML',
            hint: 'Default document',
            correctValue: 'index.html',
            validationPattern: '.*(index\\.html).*'
          },
          {
            id: 'ERROR_HTML',
            label: 'ERROR_HTML',
            hint: 'Error page',
            correctValue: 'error.html',
            validationPattern: '.*(error\\.html|404\\.html).*'
          }
        ],
        solution: '# Sync local directory to S3:\naws s3 sync ./website/ s3://my-website-bucket/\n\n# Enable static hosting:\naws s3 website s3://my-website-bucket/ \\\n  --index-document index.html \\\n  --error-document error.html\n\n# Set public read policy:\naws s3api put-bucket-policy --bucket my-website-bucket --policy file://policy.json',
        explanation: 'S3 sync uploads files efficiently. Static website hosting serves HTML/CSS/JS. Bucket policy controls public access.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Create script to stop all dev instances outside business hours.',
        template: '#!/bin/bash\n# stop-dev-instances.sh\n\n# Get dev instance IDs:\nINSTANCES=$(aws ec2 describe-instances \\\n  --filters "Name=tag:Environment,Values=__DEV__" \\\n             "Name=instance-state-name,Values=__RUNNING__" \\\n  --query "Reservations[*].Instances[*].InstanceId" \\\n  --output text)\n\n# Stop each instance:\nfor instance in $INSTANCES; do\n  aws ec2 __STOP_INSTANCES__ --instance-ids $instance\ndone',
        blanks: [
          {
            id: 'DEV',
            label: 'DEV',
            hint: 'Environment tag value',
            correctValue: 'dev',
            validationPattern: '^dev$'
          },
          {
            id: 'RUNNING',
            label: 'RUNNING',
            hint: 'Instance state',
            correctValue: 'running',
            validationPattern: '^running$'
          },
          {
            id: 'STOP_INSTANCES',
            label: 'STOP_INSTANCES',
            hint: 'Command to stop instances',
            correctValue: 'stop-instances',
            validationPattern: '^stop-instances$'
          }
        ],
        solution: '#!/bin/bash\n# stop-dev-instances.sh\n\n# Get dev instance IDs:\nINSTANCES=$(aws ec2 describe-instances \\\n  --filters "Name=tag:Environment,Values=dev" \\\n             "Name=instance-state-name,Values=running" \\\n  --query "Reservations[*].Instances[*].InstanceId" \\\n  --output text)\n\n# Stop each instance:\nfor instance in $INSTANCES; do\n  aws ec2 stop-instances --instance-ids $instance\ndone',
        explanation: 'Automation saves costs by stopping unused dev instances. Combine with cron for scheduling (e.g., 6pm daily).'
      },
      {
        exerciseNumber: 5,
        scenario: 'Backup all S3 buckets to local storage.',
        template: '#!/bin/bash\n# backup-s3.sh\n\n# Get all bucket names:\nBUCKETS=$(aws s3 __LS__ | awk \'{print $3}\')\n\n# Sync each bucket:\nfor bucket in $BUCKETS; do\n  echo "Backing up $bucket"\n  aws s3 __SYNC__ s3://$bucket/ ./backups/$bucket/\ndone',
        blanks: [
          {
            id: 'LS',
            label: 'LS',
            hint: 'List buckets command',
            correctValue: 'ls',
            validationPattern: '^ls$'
          },
          {
            id: 'SYNC',
            label: 'SYNC',
            hint: 'Synchronize command',
            correctValue: 'sync',
            validationPattern: '^sync$'
          }
        ],
        solution: '#!/bin/bash\n# backup-s3.sh\n\n# Get all bucket names:\nBUCKETS=$(aws s3 ls | awk \'{print $3}\')\n\n# Sync each bucket:\nfor bucket in $BUCKETS; do\n  echo "Backing up $bucket"\n  aws s3 sync s3://$bucket/ ./backups/$bucket/\ndone',
        explanation: 'S3 sync creates local backups. Only downloads new/changed files. Schedule with cron for regular backups.'
      }
    ],
    hints: [
      'Use --profile for multi-account management',
      'JMESPath queries extract specific JSON fields',
      's3 sync is more efficient than cp for directories',
      'Filters reduce output and improve script performance'
    ]
  },

  runGuided: {
    objective: 'Create automated infrastructure management scripts using AWS CLI',
    conceptualGuidance: [
      'Identify repetitive AWS management tasks (starting/stopping instances, backups, cleanup)',
      'Design scripts with error handling and logging',
      'Use AWS CLI filters and queries for targeted actions',
      'Implement dry-run mode for testing before actual changes',
      'Schedule scripts with cron for automation',
      'Create wrapper functions for common operations',
      'Log all actions with timestamps for audit trail',
      'Test scripts in dev environment before production',
      'Document script usage and required IAM permissions'
    ],
    keyConceptsToApply: [
      'Bash scripting with AWS CLI',
      'Error handling and logging',
      'Filtering and querying AWS resources',
      'Automation and scheduling',
      'IAM permissions for CLI access'
    ],
    checkpoints: [
      {
        checkpoint: 'Cost optimization script created',
        description: 'Script that stops/starts instances based on schedule or tags',
        validationCriteria: [
          'Identifies instances by tag (Environment, Schedule)',
          'Stops instances outside business hours',
          'Starts instances at beginning of day',
          'Logs all actions with timestamps',
          'Error handling for failed operations'
        ],
        hintIfStuck: 'Filter instances with --filters "Name=tag:Schedule,Values=business-hours". Use cron: "0 18 * * * /path/to/stop-instances.sh" (6pm) and "0 8 * * * /path/to/start-instances.sh" (8am).'
      },
      {
        checkpoint: 'Backup automation implemented',
        description: 'Automated backup of S3 buckets and/or EC2 snapshots',
        validationCriteria: [
          'Creates EBS snapshots of tagged volumes',
          'Syncs critical S3 buckets to backup location',
          'Implements retention policy (delete old backups)',
          'Sends notification on completion or failure',
          'Scheduled to run daily'
        ],
        hintIfStuck: 'Use "aws ec2 create-snapshot" for EBS. Use "aws s3 sync" for S3. Delete old snapshots: "aws ec2 delete-snapshot" with date filter. SNS for notifications.'
      },
      {
        checkpoint: 'Reporting script developed',
        description: 'Generate infrastructure reports (running instances, costs, security)',
        validationCriteria: [
          'Lists all running resources by environment',
          'Identifies cost optimization opportunities (unattached EBS, old snapshots)',
          'Security audit (public S3 buckets, open security groups)',
          'Output formatted as HTML or CSV report',
          'Scheduled weekly'
        ],
        hintIfStuck: 'Query all resources with filters. Check for public S3: "aws s3api get-bucket-acl". Find open security groups: check for 0.0.0.0/0. Format with awk/sed or convert JSON to HTML.'
      }
    ],
    resourcesAllowed: [
      'AWS CLI documentation',
      'JMESPath tutorial',
      'Bash scripting guides',
      'Cron syntax reference'
    ]
  },

  runIndependent: {
    objective: 'Build comprehensive AWS management toolkit with CLI scripts for common operations, documentation, and scheduling',
    successCriteria: [
      'Instance management: Scripts to start/stop/list instances by tag, environment, or schedule',
      'Cost optimization: Identify and cleanup unused resources (unattached EBS, old snapshots, stopped instances)',
      'Backup automation: EBS snapshots, S3 bucket sync, automated retention policies',
      'Security audit: Check for public S3 buckets, overly permissive security groups, unused IAM keys',
      'Resource reporting: Generate reports on infrastructure inventory, costs, compliance',
      'Error handling: All scripts include logging, error handling, dry-run mode',
      'Documentation: README with script descriptions, usage examples, required IAM permissions',
      'Scheduling: Cron jobs or systemd timers configured for automated execution',
      'Notification: Email or Slack alerts on script success/failure (using SNS or external service)',
      'Testing: Test suite or manual testing checklist for each script'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'At least 3 working scripts (instance management, backup, reporting)',
      'Error handling and logging in all scripts',
      'Documentation explaining usage and IAM requirements'
    ],
    evaluationRubric: [
      {
        criterion: 'Functionality',
        weight: 30,
        passingThreshold: 'Scripts work correctly. Perform intended AWS operations. Error handling prevents failures. Dry-run mode for testing. Production-ready code quality.'
      },
      {
        criterion: 'Automation Value',
        weight: 25,
        passingThreshold: 'Solves real operational problems. Saves time on repetitive tasks. Cost optimization realized. Security posture improved. Scheduled for unattended execution.'
      },
      {
        criterion: 'Code Quality',
        weight: 25,
        passingThreshold: 'Clean, readable code. Reusable functions. Proper error handling. Logging with timestamps. Parameters for flexibility. Comments explain complex logic.'
      },
      {
        criterion: 'Documentation',
        weight: 20,
        passingThreshold: 'Clear README. Usage examples for each script. IAM permissions documented. Cron schedule examples. Troubleshooting guide. Someone else can use your toolkit.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=qiPt1NoyZm0',
  documentation: [
    'https://docs.aws.amazon.com/cli/',
    'https://awscli.amazonaws.com/v2/documentation/api/latest/index.html',
    'https://jmespath.org/tutorial.html',
    'https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html'
  ],
  relatedConcepts: [
    'Infrastructure as Code (next step: Terraform, CloudFormation)',
    'AWS SDK (programmatic access with Python boto3, etc.)',
    'JMESPath advanced queries',
    'IAM policies and permissions',
    'AWS automation with Lambda',
    'CI/CD integration with AWS CLI'
  ]
};

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const weeks = [
  {
    weekNumber: 1,
    title: "DevOps Foundations & Linux Basics",
    description: "Start your DevOps journey by understanding core concepts and mastering the Linux command line.",
    objectives: [
      "Understand DevOps culture and principles",
      "Navigate the Linux filesystem confidently",
      "Manage files, permissions, and processes",
      "Use essential command-line tools"
    ],
    lessons: [
      { 
        id: "w1-l1", 
        title: "What is DevOps?", 
        description: "Learn the history, culture, and practices that define DevOps.", 
        duration: "15 min", 
        xp: 50,
        videoId: "UbtB4sMaaNM", // DevOps in 5 Minutes
        content: `# What is DevOps?

## Introduction
DevOps is a cultural and professional movement that emphasizes collaboration between software developers (Dev) and IT operations (Ops). It aims to shorten the development lifecycle while delivering features, fixes, and updates frequently in close alignment with business objectives.

## Core Principles
1. **Collaboration**: Breaking down silos between teams
2. **Automation**: Reducing manual work and human error
3. **Continuous Improvement**: Always iterating and optimizing
4. **Customer-Centric**: Focusing on delivering value

## Why DevOps?
- Faster time to market
- Improved deployment frequency
- Lower failure rate of new releases
- Shortened lead time between fixes
- Faster mean time to recovery

## Key Practices
- Continuous Integration (CI)
- Continuous Delivery (CD)
- Infrastructure as Code (IaC)
- Monitoring and Logging
- Communication and Collaboration

Watch the video to understand how DevOps transforms modern software development!`
      },
      { 
        id: "w1-l2", 
        title: "Linux Fundamentals", 
        description: "Introduction to Linux and why it's the foundation of modern DevOps.", 
        duration: "20 min", 
        xp: 50,
        videoId: "sWbUDq4S6Y8", // Linux for Beginners
        content: `# Linux Fundamentals

## Why Linux for DevOps?
- **Open Source**: Free and community-driven
- **Stability**: Powers 96% of the world's top 1 million servers
- **Security**: Robust permission system
- **Flexibility**: Highly customizable

## Linux Distributions
- **Ubuntu**: Beginner-friendly, large community
- **CentOS/RHEL**: Enterprise standard
- **Amazon Linux**: Optimized for AWS
- **Alpine**: Lightweight for containers

## The Linux Philosophy
1. Everything is a file
2. Small, single-purpose programs
3. Ability to chain programs together
4. Avoid captive user interfaces
5. Configuration data stored in text

## Essential Concepts
- **Shell**: Command-line interface (bash, zsh)
- **Kernel**: Core of the operating system
- **Root**: Superuser with full system access
- **Home Directory**: User's personal space (/home/username)

Get ready to master the command line!`
      },
      { 
        id: "w1-l3", 
        title: "Linux File System", 
        description: "Understand the Linux directory structure.", 
        duration: "15 min", 
        xp: 50,
        videoId: "HbgzrKJvDRw", // Linux File System Explained
        content: `# Linux File System Structure

## Directory Hierarchy

### / (Root)
The top-level directory of the entire filesystem.

### /home
User home directories. Each user gets their own folder here.
- \`/home/john\` - John's files
- \`/home/jane\` - Jane's files

### /etc
System-wide configuration files.
- \`/etc/passwd\` - User accounts
- \`/etc/hosts\` - DNS hosts file

### /var
Variable data that changes frequently.
- \`/var/log\` - Log files
- \`/var/www\` - Web server files

### /tmp
Temporary files (cleared on reboot).

### /usr
User programs and data.
- \`/usr/bin\` - User binaries
- \`/usr/local\` - Locally installed software

### /bin and /sbin
Essential system binaries.

### /opt
Optional third-party software.

## File Paths
- **Absolute path**: Starts with / (e.g., /home/user/file.txt)
- **Relative path**: Relative to current directory (e.g., ./file.txt)

## Navigation Commands
- \`pwd\` - Print working directory
- \`ls\` - List directory contents
- \`cd\` - Change directory
- \`tree\` - Display directory tree

Master the filesystem to navigate like a pro!`
      }
    ],
    labs: [
      { id: "w1-lab1", title: "Linux Command Line Basics", description: "Practice essential Linux commands.", difficulty: "beginner", estimatedTime: 30, xp: 100, tasks: ["Navigate to /home", "Create directory 'devops-practice'", "Create file 'file1.txt'"] },
      { id: "w1-lab2", title: "File Permissions Lab", description: "Master chmod and file ownership.", difficulty: "beginner", estimatedTime: 30, xp: 100, tasks: ["Check permissions with ls -l", "Change file permissions", "Change file ownership"] },
      { id: "w1-lab3", title: "Package Management Lab", description: "Install software using apt/yum.", difficulty: "beginner", estimatedTime: 30, xp: 100, tasks: ["Update package lists", "Install a package", "Remove a package"] }
    ]
  },
  {
    weekNumber: 2,
    title: "Version Control with Git & GitHub",
    description: "Master Git workflows and collaboration on GitHub.",
    objectives: [
      "Understand Git fundamentals and version control",
      "Create and manage repositories",
      "Work with branches and merges",
      "Collaborate using pull requests"
    ],
    lessons: [
      { 
        id: "w2-l1", 
        title: "Git Basics", 
        description: "Learn version control fundamentals.", 
        duration: "20 min", 
        xp: 50,
        videoId: "RGOj5yH7evk", // Git and GitHub for Beginners
        content: `# Git Basics

## What is Version Control?

Version control is a system that records changes to files over time, allowing you to recall specific versions later. Git is the most popular distributed version control system in the world.

## Why Git?

- **Track Changes**: See who changed what and when
- **Collaboration**: Multiple people can work on the same project
- **Branching**: Create isolated environments for features
- **Backup**: Your code is safely stored with history
- **DevOps Foundation**: Essential for CI/CD pipelines

## Core Git Concepts

### Repository (Repo)
A repository is a directory that contains your project work, including all files and the revision history.

### Commit
A commit is a snapshot of your repository at a specific point in time. Think of it as a save point in a video game.

### Branch
A branch is a parallel version of your repository. It allows you to work on features without affecting the main codebase.

### Remote
A remote is a version of your repository hosted on the internet (like GitHub, GitLab, or Bitbucket).

## Basic Git Workflow

1. **Initialize**: \`git init\` - Create a new Git repository
2. **Stage**: \`git add .\` - Add files to staging area
3. **Commit**: \`git commit -m "message"\` - Save changes
4. **Push**: \`git push origin main\` - Upload to remote

## Essential Git Commands

\`\`\`bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Create repository
git init

# Check status
git status

# Add files
git add filename.txt
git add .  # Add all files

# Commit changes
git commit -m "Descriptive message"

# View history
git log
git log --oneline  # Compact view
\`\`\`

## Best Practices

1. **Write clear commit messages**: Explain WHAT and WHY, not how
2. **Commit often**: Small, focused commits are better
3. **Pull before push**: Stay up to date with team changes
4. **Don't commit sensitive data**: Use .gitignore for secrets

Ready to track your code like a pro! 🚀`
      },
      { 
        id: "w2-l2", 
        title: "Branching & Merging", 
        description: "Master Git workflows.", 
        duration: "25 min", 
        xp: 50,
        videoId: "e2IbNHi4uCI", // Git Branching and Merging
        content: `# Branching & Merging

## What are Branches?

Branches allow you to diverge from the main line of development and continue to work without affecting that main line. This is crucial for:

- Developing new features
- Fixing bugs
- Experimenting with ideas
- Collaborating with teams

## Branch Workflow

### The Main Branch
Previously called "master", now commonly "main" - this is your production-ready code.

### Feature Branches
Create a new branch for each feature or bug fix:

\`\`\`bash
# Create and switch to new branch
git checkout -b feature/user-authentication

# Or using newer syntax
git switch -c feature/user-authentication
\`\`\`

## Branch Commands

\`\`\`bash
# List all branches
git branch

# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name
git switch feature-name  # Newer command

# Create and switch in one command
git checkout -b feature-name

# Delete branch
git branch -d feature-name

# Force delete (if unmerged)
git branch -D feature-name
\`\`\`

## Merging Branches

Once your feature is complete, merge it back to main:

\`\`\`bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature/user-authentication
\`\`\`

## Types of Merges

### Fast-Forward Merge
When there are no new commits on main, Git just moves the pointer forward.

### Three-Way Merge
When both branches have new commits, Git creates a merge commit.

## Merge Conflicts

Conflicts occur when the same lines are changed in both branches.

**How to resolve:**
1. Git marks conflicted files
2. Open files and look for conflict markers:
   \`\`\`
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> feature-branch
   \`\`\`
3. Choose which changes to keep
4. Remove conflict markers
5. Stage and commit the resolved file

## Popular Branching Strategies

### Git Flow
- \`main\`: Production code
- \`develop\`: Integration branch
- \`feature/*\`: New features
- \`hotfix/*\`: Emergency fixes
- \`release/*\`: Release preparation

### GitHub Flow (Simpler)
- \`main\`: Always deployable
- Feature branches for all changes
- Pull requests for review
- Deploy from main

## Best Practices

1. **Keep branches short-lived**: Merge frequently
2. **Use descriptive names**: \`feature/add-login\`, not \`fix\`
3. **One feature per branch**: Stay focused
4. **Delete merged branches**: Keep repo clean
5. **Pull main regularly**: Stay up to date

Master branching to collaborate like a DevOps pro! 🌿`
      },
      { 
        id: "w2-l3", 
        title: "GitHub Collaboration", 
        description: "Work with remote repositories.", 
        duration: "20 min", 
        xp: 50,
        videoId: "nhNq2kIvi9s", // GitHub Tutorial
        content: `# GitHub Collaboration

## What is GitHub?

GitHub is a cloud-based platform built on Git that provides:
- Remote repository hosting
- Collaboration tools
- Code review via Pull Requests
- Project management (Issues, Projects)
- CI/CD with GitHub Actions

## Setting Up GitHub

### 1. Create Repository on GitHub
- Click "New repository"
- Choose public or private
- Initialize with README (optional)
- Add .gitignore for your language
- Choose a license

### 2. Connect Local to Remote

\`\`\`bash
# Add remote (if starting locally)
git remote add origin https://github.com/username/repo.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
\`\`\`

## Clone vs Fork

### Clone
Copy a repository to your local machine:
\`\`\`bash
git clone https://github.com/username/repo.git
\`\`\`

### Fork
Create your own copy of someone else's repository on GitHub. Used for contributing to open source.

## Pull Requests (PRs)

Pull Requests are how teams review code before merging.

### Creating a PR:
1. Push your branch to GitHub
2. Click "New Pull Request"
3. Select base (main) and compare (your feature) branches
4. Add title and description
5. Request reviewers
6. Submit PR

### PR Best Practices:
- **Keep PRs small**: Easier to review
- **Write clear descriptions**: Explain what and why
- **Reference issues**: Use #123 to link issues
- **Respond to feedback**: Be open to suggestions
- **Update branch**: Keep it current with main

## Common GitHub Workflows

### Pushing Changes
\`\`\`bash
# Stage changes
git add .

# Commit
git commit -m "Add user authentication"

# Push to GitHub
git push origin feature/auth
\`\`\`

### Pulling Updates
\`\`\`bash
# Fetch and merge changes from remote
git pull origin main

# Or fetch first, then merge
git fetch origin
git merge origin/main
\`\`\`

### Syncing Fork
\`\`\`bash
# Add upstream remote (original repo)
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
\`\`\`

## GitHub Features for Teams

### Issues
- Track bugs and features
- Assign to team members
- Label and milestone organization
- Reference in commits with #issue-number

### Projects
- Kanban boards for task management
- Track progress across repositories
- Automate workflows

### GitHub Actions
- CI/CD pipelines
- Automated testing
- Deployment automation
- Schedule tasks

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use SSH keys**: More secure than HTTPS
3. **Enable 2FA**: Protect your account
4. **Review permissions**: Be careful with access
5. **Use .gitignore**: Exclude sensitive files

## Collaboration Tips

1. **Communicate**: Use PR descriptions and comments
2. **Code review**: Give constructive feedback
3. **Document**: Keep README.md updated
4. **Follow conventions**: Match team's coding style
5. **Test before PR**: Don't break the build

## Common Commands Reference

\`\`\`bash
# Clone repository
git clone <url>

# Check remote
git remote -v

# Fetch updates
git fetch origin

# Pull updates
git pull origin main

# Push changes
git push origin branch-name

# Create PR from command line (with gh CLI)
gh pr create --title "Title" --body "Description"
\`\`\`

Collaborate effectively and contribute to open source! 🤝`
      }
    ],
    labs: [
      { id: "w2-lab1", title: "Git Basics Lab", description: "Initialize and push to GitHub.", difficulty: "beginner", estimatedTime: 30, xp: 100, tasks: ["Init repo", "First commit", "Push to GitHub"] },
      { id: "w2-lab2", title: "Branching and Merging Lab", description: "Practice Git workflows.", difficulty: "intermediate", estimatedTime: 45, xp: 150, tasks: ["Create branch", "Make changes", "Merge to main"] }
    ]
  },
  {
    weekNumber: 3,
    title: "Cloud Fundamentals with AWS",
    description: "Get hands-on with AWS core services - the foundation for the Cloud Resume Challenge.",
    objectives: [
      "Navigate AWS Console",
      "Understand IAM and security",
      "Work with S3 storage",
      "Deploy static websites"
    ],
    lessons: [
      { 
        id: "w3-l1", 
        title: "Introduction to Cloud Computing", 
        description: "Understand IaaS, PaaS, SaaS.", 
        duration: "20 min", 
        xp: 50,
        videoId: "M988_fsOSWo", // AWS Tutorial for Beginners
        content: `# Introduction to Cloud Computing

## What is Cloud Computing?

Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

## Cloud Service Models

### IaaS (Infrastructure as a Service)
**What**: Virtual machines, storage, networks  
**You manage**: OS, applications, data  
**Provider manages**: Servers, storage, networking hardware  
**Examples**: AWS EC2, Azure Virtual Machines, Google Compute Engine

**Use cases:**
- Website hosting
- Development/test environments
- Storage and backup

### PaaS (Platform as a Service)
**What**: Platform for building and deploying apps  
**You manage**: Applications, data  
**Provider manages**: OS, servers, storage, networking  
**Examples**: AWS Elastic Beanstalk, Heroku, Google App Engine

**Use cases:**
- Web application development
- API development
- Database services

### SaaS (Software as a Service)
**What**: Complete software applications  
**You manage**: Your data and settings  
**Provider manages**: Everything else  
**Examples**: Gmail, Salesforce, Office 365, Slack

**Use cases:**
- Email
- CRM
- Collaboration tools

## Why Cloud Computing?

### 1. Cost Savings
- No upfront hardware costs
- Pay only for what you use
- Reduce IT staff costs

### 2. Scalability
- Scale up during traffic spikes
- Scale down to save money
- Global reach instantly

### 3. Performance
- Run on worldwide network
- Upgrade regularly
- Low latency

### 4. Reliability
- 99.99% uptime SLAs
- Automated backups
- Disaster recovery

### 5. Security
- Enterprise-grade security
- Compliance certifications
- Data encryption

## Major Cloud Providers

### Amazon Web Services (AWS)
- Market leader (32% market share)
- 200+ services
- Most mature platform

### Microsoft Azure
- Second largest (23% market share)
- Great Windows integration
- Enterprise focused

### Google Cloud Platform (GCP)
- Third largest (10% market share)
- Strong in ML/AI
- Competitive pricing

## Cloud Deployment Models

### Public Cloud
Resources owned and operated by third-party cloud service provider delivered over the internet.
- **Pros**: Low cost, no maintenance, scalable
- **Cons**: Less control, security concerns

### Private Cloud
Computing resources used exclusively by one organization.
- **Pros**: More control, better security
- **Cons**: Higher cost, maintenance required

### Hybrid Cloud
Combination of public and private clouds.
- **Pros**: Flexibility, optimized costs
- **Cons**: Complex management

## Cloud Computing in DevOps

Cloud and DevOps go hand-in-hand:

1. **Infrastructure as Code (IaC)**: Define infrastructure in code
2. **CI/CD**: Automated pipelines in the cloud
3. **Microservices**: Cloud-native architecture
4. **Containers**: Docker and Kubernetes
5. **Monitoring**: Cloud-based observability

## Getting Started with AWS

AWS offers a Free Tier with:
- 750 hours/month of EC2 (12 months)
- 5GB S3 storage
- 25GB DynamoDB storage
- And much more!

## Key AWS Services for Beginners

- **EC2**: Virtual servers
- **S3**: Object storage
- **RDS**: Managed databases
- **Lambda**: Serverless functions
- **VPC**: Virtual networking
- **IAM**: Identity management
- **CloudWatch**: Monitoring

Welcome to the cloud! ☁️`
      },
      { 
        id: "w3-l2", 
        title: "AWS Console Tour", 
        description: "Navigate AWS services.", 
        duration: "15 min", 
        xp: 50,
        videoId: "ubCNZRNjhyo", // AWS Console Tour
        content: `# AWS Console Tour

## AWS Management Console

The AWS Management Console is your web-based interface for accessing and managing AWS services.

**URL**: https://console.aws.amazon.com

## Console Layout

### Top Navigation Bar
- **Services**: Access all AWS services
- **Resource Groups**: Organize resources
- **Account**: Billing, security, support
- **Region Selector**: Choose geographic location

### Search Bar
Quickly find services by typing their name. Example: "EC2", "S3", "Lambda"

### Service Cards
Recently used services appear on the homepage for quick access.

## Important AWS Regions

AWS has data centers worldwide organized into regions:

- **us-east-1** (N. Virginia): Default, cheapest, most services
- **us-west-2** (Oregon): Popular for production
- **eu-west-1** (Ireland): European users
- **ap-southeast-1** (Singapore): Asian users

**Best Practice**: Choose region closest to your users for lower latency.

## Key Services Overview

### Compute
- **EC2**: Virtual servers (like DigitalOcean Droplets)
- **Lambda**: Run code without servers
- **ECS/EKS**: Container orchestration

### Storage
- **S3**: Object storage (files, images, videos)
- **EBS**: Block storage for EC2
- **EFS**: Shared file storage

### Database
- **RDS**: Managed SQL databases (MySQL, PostgreSQL)
- **DynamoDB**: NoSQL database
- **Aurora**: High-performance MySQL/PostgreSQL

### Networking
- **VPC**: Virtual private network
- **Route 53**: DNS service
- **CloudFront**: CDN for fast content delivery

### Security
- **IAM**: Users and permissions
- **Security Groups**: Firewall rules
- **ACM**: SSL/TLS certificates

### Developer Tools
- **CodePipeline**: CI/CD automation
- **CodeBuild**: Build and test code
- **CodeDeploy**: Automated deployment

### Monitoring
- **CloudWatch**: Logs and metrics
- **CloudTrail**: API activity tracking
- **X-Ray**: Application debugging

## Navigating the Console

### 1. Finding Services
Use the search bar or click "Services" → Category

### 2. Service Dashboard
Each service has its own dashboard showing:
- Resources you've created
- Getting started guides
- Documentation links

### 3. Creating Resources
Most services have a "Create" or "Launch" button

### 4. Resource Management
- View all resources in a table
- Filter and search
- Bulk actions (start, stop, delete)

## AWS CLI Alternative

For automation, use AWS CLI:
\`\`\`bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# List S3 buckets
aws s3 ls

# Create EC2 instance
aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro
\`\`\`

## Console Best Practices

1. **Enable MFA**: Protect your account
2. **Use IAM users**: Don't use root account
3. **Tag resources**: Organize and track costs
4. **Set up billing alerts**: Avoid surprise charges
5. **Bookmark favorites**: Quick access to frequently used services

## Cost Management

### Free Tier Dashboard
Monitor your Free Tier usage to avoid charges.

### Billing Dashboard
- Current charges
- Cost forecasts
- Detailed usage reports

### Cost Explorer
Visualize and analyze your AWS spending.

## Getting Help

- **Documentation**: Built into each service
- **AWS Support**: Free tier includes basic support
- **AWS Forums**: Community help
- **AWS Training**: Free courses on AWS Skill Builder

Navigate AWS like a pro! 🧭`
      },
      { 
        id: "w3-l3", 
        title: "IAM and Security", 
        description: "Manage users and permissions.", 
        duration: "25 min", 
        xp: 50,
        videoId: "ExjW_YPu-NM", // AWS IAM Tutorial
        content: `# IAM and Security

## What is IAM?

AWS Identity and Access Management (IAM) controls **who** can access **what** in your AWS account.

**Core Principle**: Least Privilege - Give only the permissions needed, nothing more.

## IAM Components

### 1. Users
Individual people or applications that need AWS access.

**Best Practice**: Create individual users, never share credentials.

\`\`\`bash
# Create user via CLI
aws iam create-user --user-name john-doe
\`\`\`

### 2. Groups
Collections of users with similar permission needs.

**Examples**:
- Developers group
- Admins group
- Read-only group

### 3. Roles
Temporary credentials that can be assumed by users, applications, or services.

**Use Cases**:
- EC2 instances accessing S3
- Lambda functions accessing DynamoDB
- Cross-account access

### 4. Policies
JSON documents defining permissions.

**Example Policy** (Allow S3 read access):
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
\`\`\`

## Policy Types

### AWS Managed Policies
Pre-built by AWS:
- \`AdministratorAccess\`: Full access (be careful!)
- \`PowerUserAccess\`: Everything except IAM
- \`ReadOnlyAccess\`: View resources only

### Customer Managed Policies
Custom policies you create for specific needs.

### Inline Policies
Directly attached to a single user/role/group.

## IAM Best Practices

### 1. Enable MFA (Multi-Factor Authentication)
Require second factor (phone app) for login.

**How to enable**:
1. IAM → Users → Security credentials
2. Assign MFA device
3. Scan QR code with Google Authenticator/Authy

### 2. Use Roles for EC2 Instances
Never hardcode credentials in your code!

\`\`\`python
# Bad: Hardcoded credentials
aws_access_key = "AKIAIOSFODNN7EXAMPLE"

# Good: Use IAM role attached to EC2
import boto3
s3 = boto3.client('s3')  # Credentials from instance role
\`\`\`

### 3. Rotate Access Keys Regularly
Change keys every 90 days or less.

### 4. Use Groups for Permissions
Attach policies to groups, add users to groups.

### 5. Enable CloudTrail
Log all API calls for auditing.

## Creating an IAM User

### Via Console:
1. Go to IAM → Users → Add user
2. Enter username
3. Select access type:
   - **Programmatic access**: For CLI/SDK (gives access keys)
   - **Console access**: For web login
4. Set permissions (attach to group or policy)
5. Review and create
6. **Save credentials** (you won't see them again!)

### Via CLI:
\`\`\`bash
# Create user
aws iam create-user --user-name developer

# Create access key
aws iam create-access-key --user-name developer

# Attach policy
aws iam attach-user-policy \\
  --user-name developer \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
\`\`\`

## Understanding ARNs

Amazon Resource Names (ARNs) uniquely identify AWS resources.

**Format**: \`arn:partition:service:region:account-id:resource\`

**Examples**:
- S3 bucket: \`arn:aws:s3:::my-bucket\`
- EC2 instance: \`arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0\`
- IAM user: \`arn:aws:iam::123456789012:user/john-doe\`

## Security Best Practices

### 1. Protect Root Account
- Enable MFA
- Don't use for daily tasks
- Don't create access keys

### 2. Principle of Least Privilege
Give minimum permissions needed.

### 3. Regular Audits
- Review unused credentials
- Check CloudTrail logs
- Use IAM Access Analyzer

### 4. Use Service Control Policies (SCPs)
For multi-account management (AWS Organizations).

### 5. Secure Secrets
- Use AWS Secrets Manager or Parameter Store
- Never commit credentials to Git

## Common IAM Scenarios

### Scenario 1: Developer Needs S3 Access
1. Create group "Developers"
2. Attach \`AmazonS3FullAccess\` policy
3. Add user to group

### Scenario 2: EC2 Needs DynamoDB Access
1. Create IAM role
2. Attach \`AmazonDynamoDBFullAccess\`
3. Attach role to EC2 instance

### Scenario 3: Lambda Needs Multiple Services
1. Create role for Lambda
2. Attach multiple policies:
   - \`AWSLambdaBasicExecutionRole\`
   - \`AmazonS3ReadOnlyAccess\`
   - \`AmazonDynamoDBFullAccess\`

## Troubleshooting Access Issues

### "Access Denied" Errors
1. Check attached policies
2. Verify resource ARN
3. Look for explicit "Deny"
4. Check service-specific permissions

### Debugging Tools
- IAM Policy Simulator
- Access Advisor (shows used permissions)
- CloudTrail logs

Security is the foundation of cloud success! 🔒`
      }
    ],
    labs: [
      { id: "w3-lab1", title: "Deploy Static Website on S3", description: "Host your first website on AWS.", difficulty: "beginner", estimatedTime: 40, xp: 150, tasks: ["Create S3 bucket", "Upload files", "Enable static hosting", "Test website"] },
      { id: "w3-lab2", title: "IAM Users and Policies", description: "Create users with proper permissions.", difficulty: "intermediate", estimatedTime: 35, xp: 100, tasks: ["Create IAM user", "Attach policy", "Test permissions"] }
    ]
  },
  {
    weekNumber: 4,
    title: "Networking & DNS Basics",
    description: "Understand networking fundamentals crucial for cloud infrastructure.",
    objectives: [
      "Understand TCP/IP and networking concepts",
      "Work with DNS and domain names",
      "Configure CloudFront CDN",
      "Set up HTTPS with certificates"
    ],
    lessons: [
      { 
        id: "w4-l1", 
        title: "Networking Fundamentals", 
        description: "Learn TCP/IP, ports, and protocols.", 
        duration: "25 min", 
        xp: 50,
        videoId: "IPvYjXCsTg8", // Networking Basics
        content: `# Networking Fundamentals

## The OSI Model (Simplified)

### Layer 7: Application (HTTP, FTP, DNS)
What you interact with - web browsers, email clients

### Layer 4: Transport (TCP, UDP)
How data is transferred - reliable (TCP) or fast (UDP)

### Layer 3: Network (IP)
Routing between networks - IP addresses

### Layer 2: Data Link (Ethernet)
Local network communication - MAC addresses

## IP Addresses

### IPv4
**Format**: 192.168.1.1 (4 numbers, 0-255)  
**Total**: ~4.3 billion addresses  
**Problem**: Running out!

### IPv6
**Format**: 2001:0db8:85a3:0000:0000:8a2e:0370:7334  
**Total**: 340 undecillion addresses  
**Future**: Gradually replacing IPv4

### Private vs Public IPs

**Private IP ranges** (not routable on internet):
- 10.0.0.0 to 10.255.255.255
- 172.16.0.0 to 172.31.255.255
- 192.168.0.0 to 192.168.255.255

**Public IPs**: Globally unique, assigned by ISP

## Ports

Ports identify specific services on a computer (0-65535).

### Common Ports:
- **22**: SSH (Secure Shell)
- **80**: HTTP (Web traffic)
- **443**: HTTPS (Secure web)
- **3306**: MySQL database
- **5432**: PostgreSQL database
- **27017**: MongoDB
- **6379**: Redis
- **3000**: Common dev servers (Node.js, React)

## TCP vs UDP

### TCP (Transmission Control Protocol)
- **Reliable**: Guarantees delivery
- **Ordered**: Packets arrive in order
- **Error-checked**: Detects corruption
- **Slower**: Due to overhead
- **Use cases**: Web, email, file transfer

### UDP (User Datagram Protocol)
- **Fast**: No error checking
- **Unreliable**: Packets may be lost
- **No order**: Packets may arrive out of order
- **Lower overhead**
- **Use cases**: Video streaming, gaming, DNS

## DNS (Domain Name System)

DNS translates domain names to IP addresses.

\`\`\`
www.google.com → 142.250.185.46
\`\`\`

### DNS Records:
- **A**: Domain to IPv4
- **AAAA**: Domain to IPv6
- **CNAME**: Alias to another domain
- **MX**: Mail server
- **TXT**: Text data (SPF, DKIM)

### How DNS Works:
1. You type www.example.com
2. Browser checks local cache
3. Queries DNS resolver
4. Resolver queries root servers
5. Then TLD servers (.com)
6. Then authoritative nameserver
7. Returns IP address
8. Browser connects to IP

## HTTP/HTTPS

### HTTP (HyperText Transfer Protocol)
- Port 80
- Unencrypted (insecure!)
- Fast

### HTTPS (HTTP Secure)
- Port 443
- Encrypted with SSL/TLS
- Secure (required for production)

### HTTP Methods:
- **GET**: Retrieve data
- **POST**: Submit data
- **PUT**: Update data
- **DELETE**: Remove data
- **PATCH**: Partial update

## Firewalls & Security Groups

### Firewall
Controls inbound and outbound network traffic based on rules.

### AWS Security Groups
Virtual firewalls for EC2 instances.

**Example rules**:
- Allow port 22 (SSH) from your IP only
- Allow port 80 (HTTP) from anywhere
- Allow port 443 (HTTPS) from anywhere

## CIDR Notation

**Example**: 10.0.0.0/16

- **/32**: Single IP (10.0.0.1/32)
- **/24**: 256 IPs (10.0.0.0/24 = 10.0.0.0 to 10.0.0.255)
- **/16**: 65,536 IPs
- **/0**: All IPs (0.0.0.0/0 = entire internet)

## Load Balancers

Distribute traffic across multiple servers for:
- **High availability**: If one server fails, others continue
- **Scalability**: Handle more traffic
- **Health checks**: Route only to healthy servers

### Types:
- **Application Load Balancer** (Layer 7): HTTP/HTTPS routing
- **Network Load Balancer** (Layer 4): TCP/UDP, high performance
- **Classic Load Balancer**: Legacy (avoid)

## CDN (Content Delivery Network)

Cache content at edge locations worldwide for:
- **Faster load times**: Content served from nearest location
- **Reduced load**: Origin server handles fewer requests
- **DDoS protection**: Distributed network absorbs attacks

**AWS CDN**: CloudFront

Networking is the backbone of cloud infrastructure! 🌐`
      },
      { 
        id: "w4-l2", 
        title: "DNS Deep Dive", 
        description: "Understand how DNS works.", 
        duration: "20 min", 
        xp: 50,
        videoId: "mpQZVYPuDGU", // DNS Explained
        content: `# DNS Deep Dive

## DNS Hierarchy

\`\`\`
Root (.)
  └── TLD (.com, .org, .net)
      └── Domain (example.com)
          └── Subdomain (www.example.com)
\`\`\`

## DNS Record Types

### A Record (Address)
Maps domain to IPv4 address.
\`\`\`
example.com → 93.184.216.34
\`\`\`

### AAAA Record
Maps domain to IPv6 address.

### CNAME (Canonical Name)
Alias one domain to another.
\`\`\`
www.example.com → example.com
blog.example.com → example.com
\`\`\`

**Limitation**: Cannot use at root domain (example.com)

### ALIAS Record (AWS)
Like CNAME but works at root domain. AWS-specific.
\`\`\`
example.com → d111111abcdef8.cloudfront.net
\`\`\`

### MX Record (Mail Exchange)
Specifies mail servers.
\`\`\`
example.com MX 10 mail.example.com
\`\`\`

### TXT Record
Arbitrary text data.

**Common uses**:
- SPF (email authentication)
- DKIM (email signing)
- Domain verification

### NS Record (Nameserver)
Specifies authoritative nameservers for domain.

### SOA Record (Start of Authority)
Contains domain admin info, TTL, serial number.

## TTL (Time To Live)

How long DNS records are cached (in seconds).

- **Low TTL** (60s): Changes propagate fast, more DNS queries
- **High TTL** (86400s = 24h): Fewer queries, slower updates

**Best practice**: Lower TTL before making changes, then raise it after.

## Route 53 Basics

AWS's DNS service. Named after DNS port 53.

### Features:
- **Domain registration**: Buy domains
- **DNS hosting**: Manage DNS records
- **Health checks**: Monitor endpoints
- **Traffic routing**: Advanced routing policies

### Routing Policies:

#### Simple Routing
One record, one or more IPs (random selection).

#### Weighted Routing
Split traffic by percentage.
\`\`\`
70% → Server A
30% → Server B
\`\`\`

#### Latency Routing
Route to lowest latency region for user.

#### Failover Routing
Primary/secondary setup for high availability.

#### Geolocation Routing
Route based on user's geographic location.

#### Geoproximity Routing
Route based on distance to resources.

## DNS Propagation

After changing DNS records, it takes time to propagate worldwide.

**Timeframe**: Minutes to 48 hours (usually < 24 hours)

**Why**: DNS caching at multiple levels:
- Your computer
- Your ISP
- Intermediate DNS servers

**Check propagation**: https://www.whatsmydns.net/

## Common DNS Issues

### 1. NXDOMAIN (Non-Existent Domain)
Domain doesn't exist or DNS not configured.

### 2. SERVFAIL
DNS server encountered an error.

### 3. Slow Resolution
- High TTL
- Distant DNS server
- Network issues

### 4. DNS Hijacking
Attacker redirects DNS queries to malicious servers.

**Prevention**: Use DNSSEC, trusted DNS providers

## DNS Tools

### dig (Linux/Mac)
\`\`\`bash
dig example.com
dig example.com A
dig example.com MX
\`\`\`

### nslookup (Windows/Linux/Mac)
\`\`\`bash
nslookup example.com
\`\`\`

### host (Linux/Mac)
\`\`\`bash
host example.com
\`\`\`

## DNS Security (DNSSEC)

Adds cryptographic signatures to DNS records to prevent:
- DNS spoofing
- Cache poisoning
- Man-in-the-middle attacks

**Status**: Not widely adopted yet

## Best Practices

1. **Use short TTLs** before major changes
2. **Backup DNS provider** for redundancy
3. **Monitor DNS queries** for anomalies
4. **Use ALIAS records** for root domains on AWS
5. **Document changes** before modifying DNS

DNS is critical infrastructure—handle with care! 🎯`
      },
      { 
        id: "w4-l3", 
        title: "Content Delivery Networks", 
        description: "Learn about CDNs and CloudFront.", 
        duration: "20 min", 
        xp: 50,
        videoId: "Bsq5cKkS33I", // CDN Explained
        content: `# Content Delivery Networks (CDN)

## What is a CDN?

A CDN is a globally distributed network of servers that cache and deliver content from locations closest to users.

### Without CDN:
\`\`\`
User in Australia → Server in US East → 200ms latency
\`\`\`

### With CDN:
\`\`\`
User in Australia → Sydney edge location → 10ms latency
\`\`\`

## How CDNs Work

1. **Origin Server**: Your original content (S3, web server)
2. **Edge Locations**: CDN servers worldwide
3. **Cache**: Edge locations store copies of content
4. **User Request**: Routed to nearest edge
5. **Cache Hit**: Content served from edge (fast!)
6. **Cache Miss**: Fetched from origin, then cached

## Benefits of CDNs

### 1. Faster Load Times
Content served from nearest location reduces latency by 50-90%.

### 2. Reduced Origin Load
CDN serves 80-90% of requests from cache.

### 3. Better Availability
If origin fails, CDN can serve cached content.

### 4. DDoS Protection
Distributed network absorbs attack traffic.

### 5. Lower Bandwidth Costs
Less data transferred from origin server.

## AWS CloudFront

Amazon's global CDN with 400+ edge locations.

### Key Features:
- **Global reach**: Serve users worldwide
- **AWS integration**: Works seamlessly with S3, EC2, Load Balancers
- **SSL/TLS**: Free HTTPS certificates
- **Custom domains**: Use your own domain
- **Geo-restriction**: Block content by country
- **Real-time metrics**: Monitor performance

## CloudFront Concepts

### Distribution
A CloudFront configuration for serving content.

### Origin
Where CloudFront gets your files:
- S3 bucket
- EC2 instance
- Load Balancer
- Custom HTTP server

### Cache Behavior
Rules for how content is cached:
- Path patterns (/images/*)
- TTL settings
- Query string forwarding
- Compress files

### Edge Location
Physical server location serving content.

### Regional Edge Cache
Mid-tier cache between origin and edge locations for less popular content.

## Caching Strategies

### TTL (Time To Live)
How long content stays cached.

**Examples**:
- Static assets (images, CSS): 1 year
- HTML pages: 1 hour
- API responses: 0 seconds (no cache)

### Cache Invalidation
Force CloudFront to fetch fresh content from origin.

\`\`\`bash
# Invalidate all files
aws cloudfront create-invalidation \\
  --distribution-id E1234567890 \\
  --paths "/*"

# Invalidate specific files
aws cloudfront create-invalidation \\
  --distribution-id E1234567890 \\
  --paths "/index.html" "/css/main.css"
\`\`\`

**Cost**: First 1000 invalidations/month free, then $0.005 per path.

### Versioned Files
Instead of invalidation, use versioning:
\`\`\`
/css/style.v1.css
/css/style.v2.css
/js/app.123456.js (hash)
\`\`\`

## CloudFront with S3

Perfect combo for static websites!

### Setup:
1. Create S3 bucket
2. Upload website files
3. Create CloudFront distribution
4. Point origin to S3
5. Update DNS to CloudFront domain

### Benefits:
- S3 serves as reliable origin
- CloudFront caches globally
- Built-in HTTPS
- Custom domain support

## SSL/TLS Certificates

### Default CloudFront Domain
\`\`\`
d111111abcdef8.cloudfront.net
\`\`\`
Free HTTPS automatically!

### Custom Domain
\`\`\`
cdn.yourdomain.com
\`\`\`

**Requirements**:
1. Request certificate in ACM (us-east-1 region only!)
2. Attach to CloudFront distribution
3. Create CNAME in Route 53

## CloudFront Pricing

### Data Transfer Out
- First 10 TB: $0.085/GB
- Next 40 TB: $0.080/GB
- Over 150 TB: $0.060/GB

### HTTP Requests
- $0.0075 per 10,000 requests

### Invalidations
- First 1000/month: Free
- Additional: $0.005 per path

**Tip**: Always-Free tier includes 1 TB out and 10M requests/month for 12 months!

## Performance Optimization

### 1. Enable Compression
CloudFront can gzip files automatically (50-70% size reduction).

### 2. Use HTTP/2
Faster than HTTP/1.1, enabled by default.

### 3. Optimize Cache Hit Ratio
- Use consistent URLs
- Avoid unique query strings
- Version files instead of invalidating

### 4. Use Origin Shield
Additional caching layer for better origin protection.

## Security Features

### 1. Geo-Restriction
Block content in specific countries (whitelist or blacklist).

### 2. Signed URLs
Temporary access to private content.

### 3. Signed Cookies
Grant access to multiple files.

### 4. WAF (Web Application Firewall)
Protect against:
- SQL injection
- Cross-site scripting (XSS)
- DDoS attacks

### 5. Field-Level Encryption
Encrypt sensitive data at edge before sending to origin.

## Monitoring

### CloudWatch Metrics:
- **Requests**: Number of requests
- **BytesDownloaded**: Data transferred
- **4xx/5xx errors**: Error rates
- **CacheHitRate**: % of requests served from cache

### Real-Time Logs
Stream logs to Kinesis for analysis.

### Access Logs
Detailed logs stored in S3.

## Common Use Cases

1. **Static Website**: S3 + CloudFront
2. **API Acceleration**: Cache GET responses
3. **Video Streaming**: HLS/DASH delivery
4. **Software Distribution**: Download acceleration
5. **Dynamic Sites**: Cache static assets

## Best Practices

1. **Use versioning** instead of invalidations
2. **Set appropriate TTLs** based on content type
3. **Enable compression** for text files
4. **Monitor cache hit ratio** (aim for >80%)
5. **Use custom domains** for branding
6. **Enable HTTPS only** for security

CDNs make your website lightning fast worldwide! ⚡`
      }
    ],
    labs: [
      { id: "w4-lab1", title: "Configure CloudFront Distribution", description: "Add CDN to your S3 website.", difficulty: "intermediate", estimatedTime: 45, xp: 150, tasks: ["Create CloudFront distribution", "Link to S3", "Configure caching", "Test performance"] },
      { id: "w4-lab2", title: "Custom Domain with Route 53", description: "Connect your domain name.", difficulty: "intermediate", estimatedTime: 40, xp: 100, tasks: ["Register domain", "Create hosted zone", "Configure DNS records"] }
    ]
  },
  {
    weekNumber: 5,
    title: "Python for DevOps",
    description: "Learn Python programming for automation and scripting.",
    objectives: [
      "Write Python scripts for automation",
      "Work with APIs and HTTP requests",
      "Handle JSON data",
      "Create simple web applications"
    ],
    lessons: [
      { 
        id: "w5-l1", 
        title: "Python Basics", 
        description: "Variables, loops, and functions.", 
        duration: "30 min", 
        xp: 50,
        videoId: "kqtD5dpn9C8", // Python for Beginners
        content: `# Python Basics

## Why Python for DevOps?

Python is the #1 language for DevOps automation because:
- **Easy to learn**: Clear, readable syntax
- **Powerful libraries**: Automation, AWS, APIs, data processing
- **Cross-platform**: Works on Linux, Mac, Windows
- **Industry standard**: Used by Google, Netflix, NASA

## Variables and Data Types

\`\`\`python
# Strings
name = "DevOps Engineer"
greeting = 'Hello, World!'

# Numbers
age = 25
price = 99.99
count = 1000

# Booleans
is_deployed = True
has_errors = False

# Lists (arrays)
servers = ["web1", "web2", "web3"]
ports = [80, 443, 8080]

# Dictionaries (key-value pairs)
server = {
    "name": "web-server-01",
    "ip": "10.0.1.5",
    "status": "running"
}
\`\`\`

## Printing and String Formatting

\`\`\`python
# Simple print
print("Hello, DevOps!")

# f-strings (modern way)
name = "Alice"
print(f"Welcome, {name}!")

# String concatenation
print("Server: " + server["name"])

# Multiple values
print(f"Server {server['name']} is {server['status']}")
\`\`\`

## Conditionals

\`\`\`python
# If statements
status = "running"

if status == "running":
    print("Server is healthy")
elif status == "stopped":
    print("Server is down")
else:
    print("Unknown status")

# Comparison operators
# == (equal), != (not equal), < > <= >=
cpu_usage = 85

if cpu_usage > 90:
    print("CRITICAL: High CPU!")
elif cpu_usage > 75:
    print("WARNING: Elevated CPU")
else:
    print("CPU normal")
\`\`\`

## Loops

### For Loops
\`\`\`python
# Loop through list
servers = ["web1", "web2", "web3"]
for server in servers:
    print(f"Checking {server}...")

# Loop with range
for i in range(5):  # 0, 1, 2, 3, 4
    print(f"Iteration {i}")

# Loop through dictionary
server_info = {"name": "web1", "ip": "10.0.1.5"}
for key, value in server_info.items():
    print(f"{key}: {value}")
\`\`\`

### While Loops
\`\`\`python
# While loop
attempts = 0
while attempts < 3:
    print(f"Attempt {attempts + 1}")
    attempts += 1
\`\`\`

## Functions

\`\`\`python
# Simple function
def greet():
    print("Hello!")

greet()  # Call function

# Function with parameters
def greet_user(name):
    print(f"Hello, {name}!")

greet_user("Alice")

# Function with return value
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(result)  # 8

# Function with default parameters
def check_server(name, status="running"):
    print(f"{name} is {status}")

check_server("web1")  # Uses default
check_server("web2", "stopped")  # Custom value
\`\`\`

## Lists and List Operations

\`\`\`python
# Create list
servers = ["web1", "web2", "web3"]

# Add item
servers.append("web4")

# Remove item
servers.remove("web1")

# Get length
print(len(servers))  # 3

# Access by index
first_server = servers[0]
last_server = servers[-1]

# Slice
first_two = servers[0:2]

# Check if exists
if "web2" in servers:
    print("Found!")

# List comprehension (advanced)
numbers = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in numbers]
\`\`\`

## Dictionaries

\`\`\`python
# Create dictionary
server = {
    "name": "web-server-01",
    "ip": "10.0.1.5",
    "port": 80,
    "status": "running"
}

# Access values
print(server["name"])
print(server.get("ip"))

# Add/update key
server["region"] = "us-east-1"
server["port"] = 443

# Remove key
del server["status"]

# Check if key exists
if "region" in server:
    print(f"Region: {server['region']}")

# Loop through keys and values
for key, value in server.items():
    print(f"{key}: {value}")
\`\`\`

## File Operations

\`\`\`python
# Write to file
with open("servers.txt", "w") as f:
    f.write("web1\\n")
    f.write("web2\\n")

# Read from file
with open("servers.txt", "r") as f:
    content = f.read()
    print(content)

# Read lines
with open("servers.txt", "r") as f:
    for line in f:
        print(line.strip())

# Append to file
with open("servers.txt", "a") as f:
    f.write("web3\\n")
\`\`\`

## Error Handling

\`\`\`python
# Try-except block
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple exceptions
try:
    server = servers[100]
except IndexError:
    print("Server not found")
except Exception as e:
    print(f"Error: {e}")

# Finally block (always runs)
try:
    f = open("config.txt")
    data = f.read()
except FileNotFoundError:
    print("File not found")
finally:
    f.close()
\`\`\`

## Modules and Imports

\`\`\`python
# Import entire module
import os
print(os.getcwd())

# Import specific function
from datetime import datetime
now = datetime.now()

# Import with alias
import json as j
data = j.loads('{"key": "value"}')

# Common DevOps modules
import subprocess  # Run shell commands
import sys         # System operations
import re          # Regular expressions
import requests    # HTTP requests (install first)
\`\`\`

## Practical DevOps Example

\`\`\`python
#!/usr/bin/env python3
import subprocess
import json

def check_disk_space():
    """Check disk space and alert if low"""
    result = subprocess.run(
        ["df", "-h", "/"],
        capture_output=True,
        text=True
    )
    
    lines = result.stdout.split("\\n")
    usage_line = lines[1].split()
    usage_percent = int(usage_line[4].replace("%", ""))
    
    if usage_percent > 80:
        print(f"WARNING: Disk {usage_percent}% full!")
    else:
        print(f"Disk usage: {usage_percent}%")

def list_running_containers():
    """List Docker containers"""
    result = subprocess.run(
        ["docker", "ps", "--format", "{{.Names}}"],
        capture_output=True,
        text=True
    )
    
    containers = result.stdout.strip().split("\\n")
    for container in containers:
        print(f"Container: {container}")

if __name__ == "__main__":
    check_disk_space()
    list_running_containers()
\`\`\`

## Best Practices

1. **Use meaningful names**: \`server_count\` not \`sc\`
2. **Follow PEP 8**: Python style guide
3. **Add docstrings**: Document functions
4. **Use virtual environments**: Isolate dependencies
5. **Handle errors**: Don't let scripts crash

Python makes DevOps automation simple! 🐍`
      },
      { 
        id: "w5-l2", 
        title: "Working with APIs", 
        description: "Make HTTP requests with Python.", 
        duration: "25 min", 
        xp: 50,
        videoId: "Wjx_0lpbbKI", // Python REST API
        content: `# Working with APIs

## What are APIs?

API (Application Programming Interface) allows programs to communicate with each other.

**REST API**: Uses HTTP methods (GET, POST, PUT, DELETE) to interact with resources.

## The requests Library

\`\`\`bash
# Install requests
pip install requests
\`\`\`

## Making GET Requests

\`\`\`python
import requests

# Simple GET request
response = requests.get("https://api.github.com")
print(response.status_code)  # 200
print(response.text)          # Raw response

# Get JSON data
response = requests.get("https://api.github.com/users/octocat")
data = response.json()        # Parse JSON to dict
print(data["name"])
print(data["public_repos"])

# With query parameters
params = {
    "q": "python",
    "sort": "stars"
}
response = requests.get(
    "https://api.github.com/search/repositories",
    params=params
)
repos = response.json()
\`\`\`

## HTTP Status Codes

- **200**: OK - Success
- **201**: Created - Resource created
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server error

## Handling Responses

\`\`\`python
import requests

response = requests.get("https://api.github.com/users/octocat")

# Check if successful
if response.status_code == 200:
    data = response.json()
    print(f"User: {data['name']}")
elif response.status_code == 404:
    print("User not found")
else:
    print(f"Error: {response.status_code}")

# Using raise_for_status()
try:
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
\`\`\`

## POST Requests

\`\`\`python
# Send JSON data
payload = {
    "title": "Test Issue",
    "body": "This is a test"
}

headers = {
    "Authorization": "token YOUR_TOKEN",
    "Accept": "application/vnd.github.v3+json"
}

response = requests.post(
    "https://api.github.com/repos/owner/repo/issues",
    json=payload,
    headers=headers
)

if response.status_code == 201:
    issue = response.json()
    print(f"Created issue #{issue['number']}")
\`\`\`

## PUT and DELETE Requests

\`\`\`python
# PUT - Update resource
response = requests.put(
    "https://api.example.com/users/123",
    json={"name": "New Name"}
)

# DELETE - Remove resource
response = requests.delete(
    "https://api.example.com/users/123"
)
\`\`\`

## Authentication

### API Keys
\`\`\`python
# In headers
headers = {"X-API-Key": "your-api-key"}
response = requests.get(url, headers=headers)

# In query parameters
params = {"api_key": "your-api-key"}
response = requests.get(url, params=params)
\`\`\`

### Bearer Token
\`\`\`python
headers = {"Authorization": "Bearer your-token"}
response = requests.get(url, headers=headers)
\`\`\`

### Basic Auth
\`\`\`python
from requests.auth import HTTPBasicAuth

response = requests.get(
    url,
    auth=HTTPBasicAuth("username", "password")
)
\`\`\`

## Working with JSON

\`\`\`python
import json

# Parse JSON string
json_string = '{"name": "Alice", "age": 30}'
data = json.loads(json_string)
print(data["name"])  # Alice

# Convert dict to JSON
data = {"name": "Bob", "age": 25}
json_string = json.dumps(data)
print(json_string)  # {"name": "Bob", "age": 25}

# Pretty print JSON
json_string = json.dumps(data, indent=2)
print(json_string)

# Save to file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read from file
with open("data.json", "r") as f:
    data = json.load(f)
\`\`\`

## Error Handling

\`\`\`python
import requests
from requests.exceptions import RequestException, Timeout

try:
    response = requests.get(
        "https://api.example.com/data",
        timeout=5  # 5 second timeout
    )
    response.raise_for_status()
    data = response.json()
    
except Timeout:
    print("Request timed out")
except requests.exceptions.ConnectionError:
    print("Connection failed")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except RequestException as e:
    print(f"Error: {e}")
\`\`\`

## Practical Example: GitHub API

\`\`\`python
import requests
import os

def get_user_repos(username):
    """Get all repositories for a GitHub user"""
    url = f"https://api.github.com/users/{username}/repos"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        repos = response.json()
        
        print(f"\\nRepositories for {username}:")
        for repo in repos:
            print(f"  - {repo['name']} ⭐ {repo['stargazers_count']}")
            
    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            print(f"User '{username}' not found")
        else:
            print(f"Error: {e}")

def create_issue(token, repo, title, body):
    """Create a GitHub issue"""
    url = f"https://api.github.com/repos/{repo}/issues"
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    payload = {
        "title": title,
        "body": body
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 201:
        issue = response.json()
        print(f"✓ Created issue #{issue['number']}: {issue['html_url']}")
    else:
        print(f"✗ Failed: {response.status_code}")
        print(response.json())

# Usage
get_user_repos("octocat")
\`\`\`

## AWS API Example

\`\`\`python
# Note: Use boto3 for AWS instead of raw requests
import requests

def get_ec2_metadata():
    """Get EC2 instance metadata (only works from EC2)"""
    base_url = "http://169.254.169.254/latest/meta-data/"
    
    try:
        # Get instance ID
        response = requests.get(f"{base_url}instance-id", timeout=2)
        instance_id = response.text
        
        # Get availability zone
        response = requests.get(f"{base_url}placement/availability-zone")
        az = response.text
        
        print(f"Instance ID: {instance_id}")
        print(f"Availability Zone: {az}")
        
    except requests.exceptions.RequestException:
        print("Not running on EC2 or metadata service unavailable")

get_ec2_metadata()
\`\`\`

## Best Practices

1. **Always set timeouts**: Prevent hanging
2. **Handle errors gracefully**: Don't crash
3. **Use environment variables** for secrets
4. **Check status codes**: Don't assume success
5. **Rate limit**: Respect API limits
6. **Log requests**: For debugging

Master APIs to integrate everything! 🔗`
      },
      { 
        id: "w5-l3", 
        title: "Python for AWS", 
        description: "Use Boto3 SDK.", 
        duration: "30 min", 
        xp: 50,
        videoId: "Cb2czfCV2yA", // Boto3 Tutorial
        content: `# Python for AWS (Boto3)

## What is Boto3?

Boto3 is the AWS SDK for Python. It allows you to create, configure, and manage AWS services programmatically.

**Use Cases**:
- Automate EC2 instance management
- Upload files to S3
- Query DynamoDB
- Create CloudFormation stacks
- Monitor with CloudWatch

## Installation

\`\`\`bash
pip install boto3
\`\`\`

## AWS Credentials Setup

### Option 1: AWS CLI Configuration
\`\`\`bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region, Output format
\`\`\`

### Option 2: Environment Variables
\`\`\`bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=us-east-1
\`\`\`

### Option 3: IAM Role (EC2/Lambda)
No credentials needed! AWS provides them automatically.

## Basic Boto3 Concepts

### Client vs Resource

**Client**: Low-level AWS service access
\`\`\`python
import boto3

# Client (more control)
s3_client = boto3.client('s3')
response = s3_client.list_buckets()
\`\`\`

**Resource**: Higher-level, object-oriented
\`\`\`python
# Resource (easier to use)
s3_resource = boto3.resource('s3')
bucket = s3_resource.Bucket('my-bucket')
\`\`\`

## Working with S3

### List Buckets
\`\`\`python
import boto3

s3 = boto3.client('s3')

# List all buckets
response = s3.list_buckets()

print("S3 Buckets:")
for bucket in response['Buckets']:
    print(f"  - {bucket['Name']} (created {bucket['CreationDate']})")
\`\`\`

### Create Bucket
\`\`\`python
s3 = boto3.client('s3')

bucket_name = 'my-unique-bucket-name-12345'

try:
    s3.create_bucket(
        Bucket=bucket_name,
        CreateBucketConfiguration={
            'LocationConstraint': 'us-west-2'  # Not needed for us-east-1
        }
    )
    print(f"Created bucket: {bucket_name}")
except Exception as e:
    print(f"Error: {e}")
\`\`\`

### Upload File
\`\`\`python
s3 = boto3.client('s3')

# Upload file
s3.upload_file(
    'local-file.txt',      # Local file
    'my-bucket',           # Bucket name
    'remote-file.txt'      # S3 key (filename)
)

# Upload with metadata
s3.upload_file(
    'index.html',
    'my-website-bucket',
    'index.html',
    ExtraArgs={
        'ContentType': 'text/html',
        'ACL': 'public-read'
    }
)
\`\`\`

### Download File
\`\`\`python
s3.download_file(
    'my-bucket',          # Bucket
    'remote-file.txt',    # S3 key
    'local-copy.txt'      # Local destination
)
\`\`\`

### List Objects in Bucket
\`\`\`python
s3 = boto3.client('s3')

response = s3.list_objects_v2(Bucket='my-bucket')

if 'Contents' in response:
    for obj in response['Contents']:
        print(f"{obj['Key']} ({obj['Size']} bytes)")
\`\`\`

### Delete Object
\`\`\`python
s3.delete_object(Bucket='my-bucket', Key='file-to-delete.txt')
\`\`\`

## Working with EC2

### List Instances
\`\`\`python
import boto3

ec2 = boto3.client('ec2')

response = ec2.describe_instances()

for reservation in response['Reservations']:
    for instance in reservation['Instances']:
        print(f"Instance ID: {instance['InstanceId']}")
        print(f"State: {instance['State']['Name']}")
        print(f"Type: {instance['InstanceType']}")
        print("---")
\`\`\`

### Start/Stop Instances
\`\`\`python
ec2 = boto3.client('ec2')

instance_id = 'i-1234567890abcdef0'

# Start instance
ec2.start_instances(InstanceIds=[instance_id])
print(f"Starting {instance_id}")

# Stop instance
ec2.stop_instances(InstanceIds=[instance_id])
print(f"Stopping {instance_id}")

# Terminate instance (careful!)
ec2.terminate_instances(InstanceIds=[instance_id])
\`\`\`

### Create EC2 Instance
\`\`\`python
ec2 = boto3.client('ec2')

response = ec2.run_instances(
    ImageId='ami-0c55b159cbfafe1f0',  # Amazon Linux 2
    InstanceType='t2.micro',
    MinCount=1,
    MaxCount=1,
    KeyName='my-key-pair',
    SecurityGroupIds=['sg-12345678'],
    TagSpecifications=[
        {
            'ResourceType': 'instance',
            'Tags': [
                {'Key': 'Name', 'Value': 'Python-Created-Instance'},
                {'Key': 'Environment', 'Value': 'Dev'}
            ]
        }
    ]
)

instance_id = response['Instances'][0]['InstanceId']
print(f"Created instance: {instance_id}")
\`\`\`

## Working with DynamoDB

### Create Table
\`\`\`python
dynamodb = boto3.resource('dynamodb')

table = dynamodb.create_table(
    TableName='Users',
    KeySchema=[
        {'AttributeName': 'user_id', 'KeyType': 'HASH'}  # Partition key
    ],
    AttributeDefinitions=[
        {'AttributeName': 'user_id', 'AttributeType': 'S'}
    ],
    BillingMode='PAY_PER_REQUEST'
)

table.wait_until_exists()
print("Table created!")
\`\`\`

### Put Item
\`\`\`python
table = dynamodb.Table('Users')

table.put_item(
    Item={
        'user_id': '123',
        'name': 'Alice',
        'email': 'alice@example.com',
        'age': 30
    }
)
\`\`\`

### Get Item
\`\`\`python
response = table.get_item(
    Key={'user_id': '123'}
)

if 'Item' in response:
    user = response['Item']
    print(f"User: {user['name']}, Email: {user['email']}")
else:
    print("User not found")
\`\`\`

### Query Items
\`\`\`python
from boto3.dynamodb.conditions import Key

response = table.query(
    KeyConditionExpression=Key('user_id').eq('123')
)

for item in response['Items']:
    print(item)
\`\`\`

### Scan Table
\`\`\`python
response = table.scan()

for item in response['Items']:
    print(f"{item['user_id']}: {item['name']}")
\`\`\`

## Working with Lambda

### Invoke Lambda Function
\`\`\`python
import json

lambda_client = boto3.client('lambda')

response = lambda_client.invoke(
    FunctionName='my-function',
    InvocationType='RequestResponse',  # or 'Event' for async
    Payload=json.dumps({'key': 'value'})
)

result = json.loads(response['Payload'].read())
print(result)
\`\`\`

## CloudWatch Logs

### Read Logs
\`\`\`python
logs = boto3.client('logs')

response = logs.describe_log_streams(
    logGroupName='/aws/lambda/my-function',
    orderBy='LastEventTime',
    descending=True,
    limit=1
)

stream_name = response['logStreams'][0]['logStreamName']

# Get log events
events = logs.get_log_events(
    logGroupName='/aws/lambda/my-function',
    logStreamName=stream_name
)

for event in events['events']:
    print(event['message'])
\`\`\`

## Practical Example: S3 Backup Script

\`\`\`python
#!/usr/bin/env python3
import boto3
import os
from datetime import datetime

def backup_directory_to_s3(local_dir, bucket_name, prefix=''):
    """Backup local directory to S3"""
    s3 = boto3.client('s3')
    
    # Create timestamp for backup
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    
    uploaded_files = 0
    
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, local_dir)
            s3_key = f"{prefix}{timestamp}/{relative_path}"
            
            try:
                s3.upload_file(local_path, bucket_name, s3_key)
                print(f"✓ Uploaded: {s3_key}")
                uploaded_files += 1
            except Exception as e:
                print(f"✗ Failed {local_path}: {e}")
    
    print(f"\\nBackup complete! {uploaded_files} files uploaded to s3://{bucket_name}/{prefix}{timestamp}/")

# Usage
backup_directory_to_s3(
    local_dir='/path/to/backup',
    bucket_name='my-backup-bucket',
    prefix='backups/'
)
\`\`\`

## Error Handling

\`\`\`python
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client('s3')

try:
    s3.head_bucket(Bucket='my-bucket')
    print("Bucket exists!")
except ClientError as e:
    error_code = e.response['Error']['Code']
    if error_code == '404':
        print("Bucket does not exist")
    elif error_code == '403':
        print("Access denied")
    else:
        print(f"Error: {e}")
\`\`\`

## Best Practices

1. **Use IAM roles** instead of access keys when possible
2. **Handle pagination** for large result sets
3. **Use resource objects** for simpler code
4. **Set appropriate timeouts**
5. **Log operations** for auditing
6. **Use boto3.Session()** for multiple regions

Automate AWS with Python power! ⚡`
      }
    ],
    labs: [
      { id: "w5-lab1", title: "Python Scripting Lab", description: "Automate tasks with Python.", difficulty: "intermediate", estimatedTime: 45, xp: 150, tasks: ["Write Python script", "Read/write files", "Process data"] },
      { id: "w5-lab2", title: "Build a REST API Client", description: "Interact with APIs using Python.", difficulty: "intermediate", estimatedTime: 50, xp: 150, tasks: ["Make GET request", "Parse JSON", "Handle errors"] }
    ]
  },
  {
    weekNumber: 6,
    title: "Serverless Computing with AWS Lambda",
    description: "Build serverless applications using AWS Lambda and DynamoDB.",
    objectives: [
      "Understand serverless architecture",
      "Create Lambda functions",
      "Work with DynamoDB",
      "Build API Gateway endpoints"
    ],
    lessons: [
      { 
        id: "w6-l1", 
        title: "Introduction to Serverless", 
        description: "Learn serverless concepts.", 
        duration: "20 min", 
        xp: 50,
        videoId: "vxJobGtqKVM", // Serverless Computing Explained
        content: `# Introduction to Serverless

## What is Serverless?

**Serverless** doesn't mean "no servers" - it means you don't manage servers!

### Traditional vs Serverless

**Traditional**:
- Provision servers
- Manage OS updates
- Configure scaling
- Pay for idle capacity
- Monitor infrastructure

**Serverless**:
- Write code only
- Auto-scaling
- Pay per execution
- No server management
- Focus on business logic

## Key Characteristics

1. **No server management**: Cloud provider handles infrastructure
2. **Automatic scaling**: From 0 to thousands of requests
3. **Pay-per-use**: Only pay when code runs
4. **Event-driven**: Functions triggered by events
5. **Stateless**: Each invocation is independent

## Benefits

✅ **Lower costs**: No idle server charges  
✅ **Faster development**: Focus on code, not infrastructure  
✅ **Auto-scaling**: Handle any load  
✅ **High availability**: Built-in redundancy  
✅ **Reduced complexity**: Less to manage  

## Challenges

⚠️ **Cold starts**: First request can be slow  
⚠️ **Execution limits**: Max runtime (15 min for Lambda)  
⚠️ **Debugging**: Harder than traditional apps  
⚠️ **Vendor lock-in**: Tied to cloud provider  
⚠️ **Stateless design**: Need external storage  

## Serverless Services on AWS

### Compute
- **Lambda**: Run code in response to events
- **Fargate**: Serverless containers

### Storage
- **S3**: Object storage (trigger Lambda on upload)

### Database
- **DynamoDB**: NoSQL database with serverless scaling
- **Aurora Serverless**: Auto-scaling relational database

### API & Integration
- **API Gateway**: Create REST/WebSocket APIs
- **EventBridge**: Event bus for app integration
- **SQS**: Message queues
- **SNS**: Pub/sub messaging

### Other
- **Step Functions**: Orchestrate workflows
- **AppSync**: GraphQL APIs

## How Lambda Works

\`\`\`
1. Event occurs (HTTP request, file upload, schedule)
   ↓
2. Lambda triggered
   ↓
3. Container created (if cold start)
   ↓
4. Your code executes
   ↓
5. Response returned
   ↓
6. Container may be reused for next request
\`\`\`

## Common Use Cases

### 1. REST APIs
\`\`\`
API Gateway → Lambda → DynamoDB
\`\`\`
Perfect for CRUD operations, microservices

### 2. File Processing
\`\`\`
S3 Upload → Lambda → Process image/video → Save result
\`\`\`
Image resizing, video transcoding, data transformation

### 3. Scheduled Tasks
\`\`\`
EventBridge (cron) → Lambda → Cleanup old files
\`\`\`
Database cleanup, report generation, backups

### 4. Real-time Stream Processing
\`\`\`
Kinesis Stream → Lambda → Process data → Store
\`\`\`
Log processing, analytics, monitoring

### 5. Chatbots
\`\`\`
User message → API Gateway → Lambda → AI Service → Response
\`\`\`

## Lambda Pricing

**Free Tier**:
- 1 million requests/month
- 400,000 GB-seconds compute time

**Pricing**:
- $0.20 per 1 million requests
- $0.0000166667 per GB-second

**Example**:
- Function: 128 MB, runs 200ms
- 1 million requests/month
- Cost: ~$0.20 + $0.42 = **$0.62/month**

Compare to EC2 t2.micro ($8.50/month) even when idle!

Serverless = Build more, manage less! 🚀`
      },
      { 
        id: "w6-l2", 
        title: "AWS Lambda Deep Dive", 
        description: "Create and deploy functions.", 
        duration: "30 min", 
        xp: 50,
        videoId: "eOBq__h4OJ4", // AWS Lambda Tutorial
        content: `# AWS Lambda Deep Dive

See full Lambda tutorial with code examples, deployment, testing, and best practices.`
      },
      { 
        id: "w6-l3", 
        title: "DynamoDB Basics", 
        description: "NoSQL database fundamentals.", 
        duration: "25 min", 
        xp: 50,
        videoId: "2k2GINpO308", // DynamoDB Tutorial
        content: `# DynamoDB Basics

Complete guide to DynamoDB operations, querying, indexes, and best practices.`
      }
    ],
    labs: [
      { id: "w6-lab1", title: "Create Your First Lambda Function", description: "Build a serverless function.", difficulty: "intermediate", estimatedTime: 40, xp: 150, tasks: ["Write Lambda code", "Test function", "View logs"] },
      { id: "w6-lab2", title: "DynamoDB CRUD Operations", description: "Store and retrieve data.", difficulty: "intermediate", estimatedTime: 45, xp: 150, tasks: ["Create table", "Insert items", "Query data"] },
      { id: "w6-lab3", title: "API Gateway + Lambda", description: "Create a REST API.", difficulty: "advanced", estimatedTime: 60, xp: 200, tasks: ["Create API", "Connect Lambda", "Test endpoints"] }
    ]
  },
  {
    weekNumber: 7,
    title: "Cloud Resume Challenge - Part 1",
    description: "Build the frontend of your cloud-native resume website.",
    objectives: [
      "Create HTML/CSS resume",
      "Deploy to S3 with CloudFront",
      "Configure custom domain",
      "Set up HTTPS with ACM"
    ],
    lessons: [
      { 
        id: "w7-l1", 
        title: "Cloud Resume Challenge Overview", 
        description: "Understand the full architecture.", 
        duration: "15 min", 
        xp: 50,
        videoId: "PlTgPlfhCfo", // Cloud Resume Challenge Explained
        content: `# Cloud Resume Challenge Overview

## What is the Cloud Resume Challenge?

The Cloud Resume Challenge is a hands-on project that combines **multiple cloud technologies** to build a production-ready resume website with a visitor counter. Created by Forrest Brazeal, it's designed to give you real-world experience with AWS.

## Full Architecture

### Frontend (Week 7)
- **HTML/CSS Resume**: Professional, responsive design
- **S3 Static Hosting**: Store and serve your website files
- **CloudFront CDN**: Fast, global content delivery
- **Route 53**: Custom domain name (yourname.com)
- **ACM Certificate**: HTTPS encryption for security

### Backend (Week 8)  
- **DynamoDB**: NoSQL database for visitor count
- **Lambda Function**: Serverless code to increment counter
- **API Gateway**: RESTful API endpoint
- **JavaScript**: Frontend calls API to display count

### Infrastructure as Code (Week 9)
- **Terraform**: Define entire infrastructure as code
- **Version Control**: Track infrastructure changes
- **Automated Deployment**: One command to deploy everything

## Why This Project Matters

1. **Portfolio Piece**: Demonstrates multiple cloud skills
2. **Real Architecture**: Same patterns used by companies
3. **Interview Ready**: Discuss concrete experience
4. **Resume Builder**: You're building your own resume!

## Key Learning Outcomes

- Static website hosting in the cloud
- Serverless backend development
- CI/CD pipelines
- Infrastructure automation
- DNS and HTTPS configuration
- API integration with JavaScript

## Success Metrics

By the end of this challenge, you'll have:
- Live resume at custom domain (https://yourname.com)
- Working visitor counter
- All infrastructure defined in code
- GitHub repo showcasing your work
- Blog post explaining your architecture

## Getting Started

Start with Week 7 to build and deploy the frontend. We'll add complexity each week!
`
      },
      { 
        id: "w7-l2", 
        title: "HTML/CSS Best Practices", 
        description: "Build a professional resume.", 
        duration: "30 min", 
        xp: 50,
        videoId: "UB1O30fR-EE", // HTML & CSS Full Course
        content: `# HTML/CSS Resume Best Practices

## Professional Resume Structure

### Essential Sections

1. **Header**
   - Full name (largest text)
   - Contact information (email, phone, LinkedIn, GitHub)
   - Optional: Professional photo

2. **Summary/Objective**
   - 2-3 sentences highlighting your DevOps focus
   - Key skills and career goals
   - Example: "DevOps Engineer passionate about automation and cloud infrastructure"

3. **Technical Skills**
   - Organized by category (Cloud, CI/CD, Languages, Tools)
   - Be specific: "AWS (EC2, S3, Lambda)" vs just "AWS"

4. **Experience**
   - Most recent first
   - Use action verbs: "Automated", "Deployed", "Configured"
   - Quantify results: "Reduced deployment time by 60%"

5. **Projects**
   - Cloud Resume Challenge (this project!)
   - Other portfolio projects with GitHub links

6. **Education & Certifications**
   - Degree, school, graduation date
   - AWS certifications, courses completed

## HTML Best Practices

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="DevOps Engineer Resume">
    <title>Your Name - DevOps Engineer</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Your Name</h1>
        <p>DevOps Engineer</p>
    </header>
    
    <section id="contact">
        <a href="mailto:you@example.com">Email</a>
        <a href="https://linkedin.com/in/yourname">LinkedIn</a>
        <a href="https://github.com/yourname">GitHub</a>
    </section>
    
    <section id="summary">
        <h2>Professional Summary</h2>
        <p>Your compelling summary here...</p>
    </section>
    
    <!-- More sections... -->
</body>
</html>
\`\`\`

## CSS Design Tips

### Modern, Clean Design
\`\`\`css
:root {
    --primary-color: #2c3e50;
    --accent-color: #3498db;
    --text-color: #333;
    --bg-color: #f5f5f5;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: var(--bg-color);
}

h1 {
    color: var(--primary-color);
    font-size: 2.5em;
    margin-bottom: 0.2em;
}

h2 {
    color: var(--accent-color);
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 5px;
}

section {
    background: white;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
\`\`\`

### Responsive Design
\`\`\`css
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    h1 {
        font-size: 2em;
    }
    
    section {
        padding: 15px;
    }
}
\`\`\`

## Common Mistakes to Avoid

1. **Too Much Information**: Keep it concise, 1-2 pages
2. **Generic Descriptions**: Be specific about what you did
3. **No Contact Info**: Make it easy for recruiters to reach you
4. **Poor Formatting**: Inconsistent fonts, colors, spacing
5. **Typos**: Proofread multiple times!

## Optimization for Web

- **Semantic HTML**: Use proper tags (header, section, article)
- **Accessibility**: Alt text, ARIA labels, proper headings
- **Performance**: Minimize CSS, optimize images
- **Mobile-First**: Design for phones, then desktop
- **SEO**: Meta tags, proper title, structured data

## Testing Your Resume

- [ ] Looks good on phone, tablet, desktop
- [ ] Links work correctly
- [ ] No spelling/grammar errors
- [ ] Loads quickly (<2 seconds)
- [ ] Professional appearance
- [ ] Contact information visible

Your resume is your first impression - make it count!
`
      }
    ],
    labs: [],
    project: {
      id: "cloud-resume-p1",
      title: "Cloud Resume Challenge - Frontend",
      description: "Deploy your HTML/CSS resume to AWS using S3, CloudFront, and Route 53.",
      xp: 500
    }
  },
  {
    weekNumber: 8,
    title: "Cloud Resume Challenge - Part 2",
    description: "Add a serverless visitor counter to your resume.",
    objectives: [
      "Build Lambda function for visitor counter",
      "Create DynamoDB table",
      "Set up API Gateway",
      "Connect frontend to backend with JavaScript"
    ],
    lessons: [
      { 
        id: "w8-l1", 
        title: "JavaScript Basics", 
        description: "Fetch API and async/await.", 
        duration: "25 min", 
        xp: 50,
        videoId: "PkZNo7MFNFg", // JavaScript Tutorial for Beginners
        content: `# JavaScript for Serverless Applications

## Why JavaScript for DevOps?

JavaScript (and Node.js) is essential for:
- **Frontend interactions** (calling APIs)
- **Lambda functions** (serverless backend)
- **Automation scripts**
- **Build tools and CI/CD**

## JavaScript Basics Review

### Variables and Data Types
\`\`\`javascript
// Modern variable declarations
const apiUrl = 'https://api.example.com/count'; // Immutable
let counter = 0; // Mutable

// Data types
const string = "Hello";
const number = 42;
const boolean = true;
const array = [1, 2, 3];
const object = { name: "John", age: 30 };
\`\`\`

### Functions
\`\`\`javascript
// Traditional function
function addNumbers(a, b) {
    return a + b;
}

// Arrow function (modern)
const multiply = (a, b) => a * b;

// Async function (for API calls)
async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}
\`\`\`

## Fetch API for HTTP Requests

### GET Request
\`\`\`javascript
async function getVisitorCount() {
    try {
        const response = await fetch('https://your-api.com/count');
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        console.log('Visitor count:', data.count);
        return data.count;
    } catch (error) {
        console.error('Error fetching count:', error);
        return 0;
    }
}
\`\`\`

### POST Request
\`\`\`javascript
async function incrementCount() {
    try {
        const response = await fetch('https://your-api.com/count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'increment' })
        });
        
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\`

## Async/Await Explained

### Old Way (Callbacks)
\`\`\`javascript
// Callback hell ❌
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error(error));
\`\`\`

### Modern Way (Async/Await)
\`\`\`javascript
// Clean and readable ✅
async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
\`\`\`

## DOM Manipulation

### Update Visitor Counter
\`\`\`javascript
async function updateCounter() {
    // Get counter from API
    const count = await getVisitorCount();
    
    // Update the DOM
    const counterElement = document.getElementById('visitor-count');
    counterElement.textContent = count;
    
    // Add animation
    counterElement.classList.add('fade-in');
}

// Run when page loads
document.addEventListener('DOMContentLoaded', updateCounter);
\`\`\`

### HTML for Counter
\`\`\`html
<div class="visitor-counter">
    <p>Visitors: <span id="visitor-count">Loading...</span></p>
</div>
\`\`\`

## Error Handling Best Practices

\`\`\`javascript
async function robustAPICall() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            timeout: 5000 // 5 second timeout
        });
        
        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(\`API error: \${response.status}\`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        // Log error for debugging
        console.error('API call failed:', error);
        
        // Return fallback value
        return { count: 0, error: true };
    }
}
\`\`\`

## Testing Your JavaScript

### Console Testing
\`\`\`javascript
// Test in browser console
console.log('Testing API call...');
getVisitorCount().then(count => {
    console.log('Count:', count);
});
\`\`\`

### Debugging Tips
- Use \`console.log()\` liberally
- Check Network tab in DevTools
- Look for CORS errors
- Verify API endpoint URL
- Check response status codes

## Lambda Function Example (Node.js)

\`\`\`javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: 'VisitorCount',
        Key: { id: 'count' },
        UpdateExpression: 'ADD #count :inc',
        ExpressionAttributeNames: { '#count': 'count' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW'
    };
    
    try {
        const result = await dynamodb.update(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                count: result.Attributes.count
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update count' })
        };
    }
};
\`\`\`

## Next Steps

1. **Write HTML/CSS** resume (Week 7)
2. **Deploy to S3** and configure CloudFront
3. **Build Lambda function** for visitor counter
4. **Create API Gateway** endpoint
5. **Add JavaScript** to frontend to call API
6. **Test end-to-end** functionality

JavaScript bridges your beautiful frontend with powerful serverless backend!
`
      },
      { 
        id: "w8-l2", 
        title: "CORS Configuration", 
        description: "Enable cross-origin requests.", 
        duration: "15 min", 
        xp: 50,
        videoId: "4KHiSt0oLJ0", // CORS Explained
        content: `# CORS: Cross-Origin Resource Sharing

## What is CORS?

**CORS** is a security feature that controls which websites can access your API. When your resume website (https://yourname.com) calls your API (https://api.yourname.com), the browser checks CORS policies.

## Why CORS Exists

### Same-Origin Policy
Browsers block requests from one domain to another by default for security:
- **Allowed**: https://example.com → https://example.com/api ✅
- **Blocked**: https://example.com → https://api.different.com ❌

### CORS Makes Cross-Origin Requests Possible
CORS headers tell the browser: "It's okay for example.com to call this API"

## Common CORS Error

You'll see this in the browser console:
\`\`\`
Access to fetch at 'https://api.yourname.com/count' from origin 
'https://yourname.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
\`\`\`

## Fixing CORS in Lambda

### Lambda Response with CORS Headers
\`\`\`javascript
exports.handler = async (event) => {
    // Your logic here...
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow all domains
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count: 123 })
    };
};
\`\`\`

### Specific Domain (More Secure)
\`\`\`javascript
headers: {
    'Access-Control-Allow-Origin': 'https://yourname.com', // Only your domain
    'Access-Control-Allow-Credentials': 'true'
}
\`\`\`

## CORS in API Gateway

### Enable CORS in Console
1. Select your API
2. Click **Actions** → **Enable CORS**
3. Check these methods: GET, POST, OPTIONS
4. Add headers: Content-Type, Authorization
5. Click **Enable CORS and replace existing values**
6. **Deploy API** to stage

### Manually Configure CORS
\`\`\`yaml
responses:
  default:
    statusCode: 200
    headers:
      Access-Control-Allow-Origin: "'*'"
      Access-Control-Allow-Headers: "'Content-Type,Authorization'"
      Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
\`\`\`

## Preflight Requests (OPTIONS)

Browsers send an OPTIONS request first to check if CORS is allowed:

\`\`\`javascript
exports.handler = async (event) => {
    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            body: ''
        };
    }
    
    // Handle GET/POST requests
    // ... your actual logic
};
\`\`\`

## Testing CORS

### Using Browser Console
\`\`\`javascript
fetch('https://your-api.com/count')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('CORS error:', error));
\`\`\`

### Using curl (No CORS Issues)
\`\`\`bash
curl https://your-api.com/count
\`\`\`
CORS only affects browsers, not command-line tools!

## Common CORS Mistakes

1. **Forgetting to Deploy**: Changes in API Gateway don't apply until you deploy
2. **Missing OPTIONS Handler**: Browser preflight fails
3. **Wrong Origin**: 'Access-Control-Allow-Origin': 'http://...' when site is https://
4. **Missing Headers**: Not allowing Content-Type in headers

## CORS Checklist

- [ ] Lambda returns CORS headers in response
- [ ] API Gateway has CORS enabled
- [ ] OPTIONS method handler exists
- [ ] Access-Control-Allow-Origin matches your domain
- [ ] API Gateway deployed to stage
- [ ] Test in browser (check Network tab)

## Debugging CORS

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Make API request**
4. **Click on request**
5. **Check Response Headers**:
   - Look for "Access-Control-Allow-Origin"
   - Should match your domain or be "*"

## Security Considerations

### Development
\`\`\`javascript
'Access-Control-Allow-Origin': '*' // Allow all (development only)
\`\`\`

### Production
\`\`\`javascript
'Access-Control-Allow-Origin': 'https://yourname.com' // Specific domain
\`\`\`

### Multiple Domains
\`\`\`javascript
const allowedOrigins = ['https://yourname.com', 'https://www.yourname.com'];
const origin = event.headers.origin;

headers: {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : ''
}
\`\`\`

## Complete Lambda Example with CORS

\`\`\`javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
};

exports.handler = async (event) => {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        // Increment counter
        const result = await dynamodb.update({
            TableName: 'VisitorCount',
            Key: { id: 'count' },
            UpdateExpression: 'ADD #count :inc',
            ExpressionAttributeNames: { '#count': 'count' },
            ExpressionAttributeValues: { ':inc': 1 },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ count: result.Attributes.count })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update count' })
        };
    }
};
\`\`\`

CORS is critical for connecting your frontend and backend - master it!
`
      }
    ],
    labs: [],
    project: {
      id: "cloud-resume-p2",
      title: "Cloud Resume Challenge - Backend",
      description: "Build a serverless visitor counter with Lambda, DynamoDB, and API Gateway.",
      xp: 600
    }
  },
  {
    weekNumber: 9,
    title: "Infrastructure as Code with Terraform",
    description: "Automate your cloud infrastructure using Terraform.",
    objectives: [
      "Understand IaC principles",
      "Write Terraform configurations",
      "Manage state files",
      "Deploy Cloud Resume with Terraform"
    ],
    lessons: [
      { 
        id: "w9-l1", 
        title: "Introduction to IaC", 
        description: "Why Infrastructure as Code matters.", 
        duration: "20 min", 
        xp: 50,
        videoId: "POPP2WTJ8es", // Infrastructure as Code Explained
        content: `# Infrastructure as Code (IaC)

## What is Infrastructure as Code?

**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through **code files** instead of manual configuration.

### Traditional Way (Manual) ❌
1. Log into AWS Console
2. Click through menus to create EC2 instance
3. Configure security groups manually
4. Set up S3 bucket through UI
5. Document everything in a Word doc
6. **Problem**: Hard to replicate, error-prone, no history

### IaC Way (Automated) ✅
1. Write \`main.tf\` file describing infrastructure
2. Run \`terraform apply\`
3. Infrastructure created automatically
4. **Benefits**: Repeatable, versioned, documented as code

## Why IaC is Essential

### 1. **Repeatability**
Create identical environments every time:
\`\`\`hcl
# dev.tfvars
environment = "development"
instance_type = "t2.micro"

# prod.tfvars  
environment = "production"
instance_type = "t3.large"
\`\`\`

### 2. **Version Control**
Track infrastructure changes in Git:
\`\`\`bash
git log main.tf
# See who changed what, when, and why
\`\`\`

### 3. **Documentation**
Code IS the documentation:
\`\`\`hcl
# S3 bucket for static website hosting
resource "aws_s3_bucket" "resume" {
  bucket = "my-resume-bucket"
  # Self-documenting!
}
\`\`\`

### 4. **Collaboration**
Multiple engineers work together:
- Pull requests for infrastructure changes
- Code reviews before applying
- Consistent environments across team

### 5. **Disaster Recovery**
Infrastructure destroyed? Recreate it in minutes:
\`\`\`bash
terraform apply  # Rebuild everything
\`\`\`

## IaC Tools Comparison

### Terraform (HashiCorp) 🔶
- **Language**: HCL (HashiCorp Configuration Language)
- **Cloud**: Multi-cloud (AWS, Azure, GCP, etc.)
- **State**: Requires state file management
- **Best for**: Complex, multi-cloud infrastructure

### CloudFormation (AWS) ☁️
- **Language**: JSON or YAML
- **Cloud**: AWS only
- **State**: Managed by AWS
- **Best for**: AWS-native teams

### Pulumi 🐙
- **Language**: Python, TypeScript, Go, C#
- **Cloud**: Multi-cloud
- **State**: Managed service or self-hosted
- **Best for**: Developers who prefer real programming languages

### AWS CDK 📦
- **Language**: TypeScript, Python, Java
- **Cloud**: AWS only (uses CloudFormation under the hood)
- **Best for**: Complex AWS apps with real code

## Core IaC Principles

### 1. Declarative vs Imperative

**Declarative (Terraform)**: Describe the WHAT
\`\`\`hcl
resource "aws_instance" "web" {
  ami           = "ami-12345"
  instance_type = "t2.micro"
}
# Terraform figures out HOW to create it
\`\`\`

**Imperative (scripts)**: Describe the HOW
\`\`\`bash
aws ec2 run-instances --image-id ami-12345 --instance-type t2.micro
# You tell it exactly what to do
\`\`\`

### 2. Idempotency
Running the same code multiple times produces the same result:
\`\`\`bash
terraform apply  # Creates resources
terraform apply  # No changes, already exists ✅
\`\`\`

### 3. Immutable Infrastructure
Instead of modifying servers, replace them:
- **Old way**: SSH into server, update config ❌
- **IaC way**: Change code, deploy new server ✅

## Real-World Example

### Manual Process (1 hour)
1. Create S3 bucket
2. Enable static website hosting
3. Configure bucket policy
4. Create CloudFront distribution
5. Set up Route 53 records
6. Request ACM certificate
7. Configure HTTPS

### Terraform Process (5 minutes)
\`\`\`hcl
module "static_website" {
  source = "./modules/static-website"
  
  domain_name = "yourname.com"
  bucket_name = "yourname-resume"
}
\`\`\`
\`\`\`bash
terraform apply  # Done!
\`\`\`

## Benefits for Cloud Resume Challenge

### Without IaC ❌
- Manual S3 bucket creation
- Click through CloudFront settings
- Configure Route 53 by hand
- If something breaks, hard to fix
- Can't easily replicate for others

### With IaC (Terraform) ✅
\`\`\`hcl
resource "aws_s3_bucket" "resume" {
  bucket = "my-resume-${var.environment}"
}

resource "aws_cloudfront_distribution" "cdn" {
  # ... configuration
}

resource "aws_route53_record" "website" {
  # ... DNS configuration
}
\`\`\`
- **Repeatable**: Destroy and recreate anytime
- **Shareable**: Others can use your code
- **Documented**: Code shows exact setup
- **Testable**: Create test environment easily

## IaC Best Practices

1. **Version Control**: Always use Git
2. **State Management**: Use remote state (S3 + DynamoDB)
3. **Modules**: Reuse code with modules
4. **Variables**: Parameterize for flexibility
5. **Documentation**: Comment complex resources
6. **Testing**: Validate before applying
7. **Security**: Never commit secrets
8. **Peer Review**: Code review infrastructure changes

## Common Pitfalls

1. **Manual Changes**: Editing in console breaks state
2. **No State Locking**: Multiple people applying at once
3. **Hardcoded Values**: Not using variables
4. **No Backups**: Losing state file = disaster
5. **Ignoring Drift**: Manual changes not tracked

## Getting Started with IaC

1. **Choose a Tool**: Start with Terraform (most popular)
2. **Learn Basics**: Providers, resources, state
3. **Start Small**: One S3 bucket first
4. **Add Complexity**: CloudFront, Route 53, Lambda
5. **Use Modules**: Organize code
6. **Automate**: CI/CD for infrastructure

## IaC Workflow

\`\`\`
Write Code → Review → Test → Apply → Monitor
    ↓          ↓        ↓       ↓        ↓
  main.tf → PR → plan → apply → logs
\`\`\`

## Next Steps

- **Week 9**: Learn Terraform basics
- **Write \`.tf\` files** for Cloud Resume infrastructure
- **Manage state** with S3 backend
- **Deploy everything** with one command

Infrastructure as Code transforms infrastructure management from art to engineering!
`
      },
      { 
        id: "w9-l2", 
        title: "Terraform Basics", 
        description: "Resources, providers, and variables.", 
        duration: "30 min", 
        xp: 50,
        videoId: "tomUWcQ0P3k", // Terraform Course - Automate your AWS cloud infrastructure
        content: `# Terraform Basics

## Terraform Fundamentals

Terraform uses **declarative configuration files** to manage infrastructure. You describe what you want, Terraform makes it happen.

## Core Concepts

### 1. Providers

Providers are plugins that let Terraform interact with cloud platforms:

\`\`\`hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
\`\`\`

Popular providers:
- AWS, Azure, GCP (cloud)
- GitHub, GitLab (version control)
- Kubernetes, Docker (containers)
- DataDog, PagerDuty (monitoring)

### 2. Resources

Resources are infrastructure components you want to create:

\`\`\`hcl
resource "aws_s3_bucket" "resume_bucket" {
  bucket = "my-unique-resume-bucket"
  
  tags = {
    Name        = "My Resume Bucket"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_website_configuration" "resume_website" {
  bucket = aws_s3_bucket.resume_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}
\`\`\`

**Syntax**: \`resource "TYPE" "NAME" { config }\`

### 3. Data Sources

Fetch information about existing resources:

\`\`\`hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
}
\`\`\`

### 4. Variables

Make code reusable and flexible:

\`\`\`hcl
# variables.tf
variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "my-resume-bucket"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  validation {
    condition     = can(regex("^(dev|staging|prod)$", var.environment))
    error_message = "Environment must be dev, staging, or prod."
  }
}

# main.tf
resource "aws_s3_bucket" "resume" {
  bucket = "${var.bucket_name}-${var.environment}"
}
\`\`\`

Use variables:
\`\`\`bash
terraform apply -var="environment=prod"
# or
terraform apply -var-file="prod.tfvars"
\`\`\`

### 5. Outputs

Export values after resource creation:

\`\`\`hcl
output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.resume.id
}

output "website_url" {
  description = "URL of the static website"
  value       = "http://${aws_s3_bucket_website_configuration.resume_website.website_endpoint}"
}
\`\`\`

View outputs:
\`\`\`bash
terraform output
terraform output bucket_name
\`\`\`

## Terraform Workflow

### 1. **Write** Configuration
\`\`\`hcl
# main.tf
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
}
\`\`\`

### 2. **Initialize** Terraform
\`\`\`bash
terraform init
\`\`\`
Downloads providers and initializes backend.

### 3. **Plan** Changes
\`\`\`bash
terraform plan
\`\`\`
Shows what Terraform will create/modify/destroy.

### 4. **Apply** Changes
\`\`\`bash
terraform apply
\`\`\`
Creates actual infrastructure. Type "yes" to confirm.

### 5. **Destroy** (when needed)
\`\`\`bash
terraform destroy
\`\`\`
Removes all managed infrastructure.

## File Structure

\`\`\`
project/
├── main.tf         # Main resources
├── variables.tf    # Input variables
├── outputs.tf      # Output values
├── terraform.tfvars # Variable values (don't commit secrets!)
├── providers.tf    # Provider configuration
└── .terraform/     # Downloaded providers (auto-generated)
\`\`\`

## Example: S3 Static Website

\`\`\`hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket
resource "aws_s3_bucket" "resume" {
  bucket = var.bucket_name
}

# Website Configuration
resource "aws_s3_bucket_website_configuration" "resume" {
  bucket = aws_s3_bucket.resume.id

  index_document {
    suffix = "index.html"
  }
}

# Public Access Block (disable for public website)
resource "aws_s3_bucket_public_access_block" "resume" {
  bucket = aws_s3_bucket.resume.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket Policy for Public Read
resource "aws_s3_bucket_policy" "resume" {
  bucket = aws_s3_bucket.resume.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.resume.arn}/*"
      }
    ]
  })
}

# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "S3 bucket name (must be globally unique)"
  type        = string
}

# outputs.tf
output "website_url" {
  value = "http://${aws_s3_bucket_website_configuration.resume.website_endpoint}"
}
\`\`\`

Run it:
\`\`\`bash
terraform init
terraform plan -var="bucket_name=my-unique-bucket-12345"
terraform apply -var="bucket_name=my-unique-bucket-12345"
\`\`\`

## Resource Dependencies

Terraform automatically detects dependencies:

\`\`\`hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "my-bucket"
}

resource "aws_s3_bucket_website_configuration" "config" {
  bucket = aws_s3_bucket.bucket.id  # Implicit dependency
  # Terraform creates bucket first, then configuration
}
\`\`\`

Explicit dependencies:
\`\`\`hcl
resource "aws_instance" "app" {
  # ...
  depends_on = [aws_s3_bucket.bucket]
}
\`\`\`

## State File

Terraform tracks infrastructure in \`terraform.tfstate\`:
- **Stores** current infrastructure state
- **Maps** config to real resources
- **Critical**: Loss = can't manage infrastructure

\`\`\`bash
# View state
terraform show

# List resources
terraform state list

# Inspect resource
terraform state show aws_s3_bucket.resume
\`\`\`

**Never edit state file manually!**

## Common Commands

\`\`\`bash
terraform init          # Initialize directory
terraform validate      # Check syntax
terraform fmt           # Format code
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Destroy all resources
terraform output        # Show outputs
terraform state list    # List resources
terraform refresh       # Update state with real infra
\`\`\`

## Best Practices

1. **Use Variables**: Don't hardcode values
2. **Organize Files**: Separate main, variables, outputs
3. **Comment Code**: Explain complex resources
4. **Format Code**: Run \`terraform fmt\`
5. **Validate**: Run \`terraform validate\`
6. **Plan First**: Always review \`terraform plan\`
7. **Remote State**: Use S3 for state (we'll cover this)
8. **Version Control**: Commit \`.tf\` files, not \`.tfstate\`

## .gitignore for Terraform

\`\`\`
# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# Crash log files
crash.log

# Variable files with secrets
*.tfvars
\`\`\`

## Next Steps

1. Install Terraform
2. Configure AWS credentials
3. Write your first \`main.tf\`
4. Create an S3 bucket
5. Add website configuration
6. Deploy your resume!

In the next lesson, we'll cover **state management** and how to work with teams using remote state.
`
      },
      { 
        id: "w9-l3", 
        title: "Terraform State Management", 
        description: "Remote state with S3.", 
        duration: "25 min", 
        xp: 50,
        videoId: "92hKEaEy6Fo", // Terraform State Management
        content: `# Terraform State Management

## What is Terraform State?

The **state file** (\`terraform.tfstate\`) is Terraform's database of your infrastructure:
- Maps configuration to real resources
- Tracks metadata and resource dependencies
- Improves performance for large infrastructures
- Required for Terraform to function

## Local vs Remote State

### Local State (Default) 🏠

\`\`\`bash
terraform apply  # Creates terraform.tfstate in current directory
\`\`\`

**Problems**:
- ❌ Single point of failure (lose file = lose infrastructure)
- ❌ Can't collaborate (only one person can work)
- ❌ No locking (conflicts when multiple applies)
- ❌ Sensitive data stored locally
- ❌ No versioning or backup

### Remote State (Production) ☁️

Store state in **S3** with **DynamoDB locking**:
- ✅ Shared across team
- ✅ Versioned and backed up
- ✅ State locking prevents conflicts
- ✅ Encrypted at rest
- ✅ Works with CI/CD

## Configuring Remote State (S3)

### Step 1: Create S3 Bucket for State

\`\`\`hcl
# backend-setup.tf (run this first, then comment out)
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state-bucket-unique-12345"
  
  lifecycle {
    prevent_destroy = true  # Protect state bucket
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  versioning_configuration {
    status = "Enabled"  # Version history
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"  # Encrypt state
    }
  }
}

# DynamoDB for State Locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
\`\`\`

Run once:
\`\`\`bash
terraform init
terraform apply  # Creates S3 bucket and DynamoDB table
\`\`\`

### Step 2: Configure Backend

\`\`\`hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket-unique-12345"
    key            = "resume/terraform.tfstate"  # Path in bucket
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"  # For locking
  }
}
\`\`\`

### Step 3: Migrate State

\`\`\`bash
terraform init  # Migrates local state to S3
# Answer "yes" when prompted
\`\`\`

Now your state is in S3, and you can delete local \`terraform.tfstate\`.

## State Locking

**Problem**: Two engineers run \`terraform apply\` simultaneously:
- Both read current state
- Both make changes
- Second one overwrites first = **corrupted state**

**Solution**: DynamoDB locking
\`\`\`
Engineer A: terraform apply → Acquires lock → Makes changes → Releases lock
Engineer B: terraform apply → Waits for lock → Sees updated state → Makes changes
\`\`\`

Locking is automatic with DynamoDB table configured.

## State Commands

### View State
\`\`\`bash
terraform show  # Detailed state info
terraform state list  # List all resources
\`\`\`

### Inspect Specific Resource
\`\`\`bash
terraform state show aws_s3_bucket.resume
\`\`\`

### Remove Resource from State
\`\`\`bash
terraform state rm aws_s3_bucket.old_bucket
# Resource still exists in AWS, but Terraform won't manage it
\`\`\`

### Import Existing Resource
\`\`\`bash
terraform import aws_s3_bucket.existing_bucket my-bucket-name
# Add manually created resource to Terraform state
\`\`\`

### Move Resource
\`\`\`bash
terraform state mv aws_s3_bucket.old_name aws_s3_bucket.new_name
\`\`\`

### Pull Remote State
\`\`\`bash
terraform state pull > backup.tfstate
\`\`\`

## Multi-Environment State

Separate state for dev, staging, prod:

### Option 1: Different State Keys
\`\`\`hcl
# dev backend
backend "s3" {
  key = "resume/dev/terraform.tfstate"
}

# prod backend
backend "s3" {
  key = "resume/prod/terraform.tfstate"
}
\`\`\`

### Option 2: Terraform Workspaces
\`\`\`bash
terraform workspace new dev
terraform workspace new prod

terraform workspace select dev
terraform apply  # Affects only dev

terraform workspace select prod
terraform apply  # Affects only prod
\`\`\`

Each workspace has separate state in:
\`resume/env:/dev/terraform.tfstate\`
\`resume/env:/prod/terraform.tfstate\`

## State Best Practices

### 1. **Always Use Remote State in Production**
\`\`\`hcl
terraform {
  backend "s3" {
    # ... S3 configuration
  }
}
\`\`\`

### 2. **Enable Versioning**
Allows rollback to previous state:
\`\`\`hcl
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  versioning_configuration {
    status = "Enabled"
  }
}
\`\`\`

### 3. **Encrypt State**
Sensitive data (passwords, keys) stored in state:
\`\`\`hcl
resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform.id
    }
  }
}
\`\`\`

### 4. **Restrict Access**
Bucket policy for state bucket:
\`\`\`hcl
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          "${aws_s3_bucket.terraform_state.arn}",
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
\`\`\`

### 5. **Backup State Regularly**
\`\`\`bash
# Download backup
terraform state pull > backup-$(date +%Y%m%d).tfstate

# Restore from backup (if needed)
terraform state push backup-20241108.tfstate
\`\`\`

### 6. **Use Separate State Per Project**
\`\`\`
my-terraform-state-bucket/
├── resume/terraform.tfstate
├── api-gateway/terraform.tfstate
└── database/terraform.tfstate
\`\`\`

## Troubleshooting State Issues

### State Locked (Won't Release)
\`\`\`bash
# Force unlock (use carefully!)
terraform force-unlock <LOCK_ID>
\`\`\`

### State Drift (Manual Changes)
\`\`\`bash
# Compare actual infrastructure to state
terraform plan

# Update state to match reality
terraform refresh

# Or import manually changed resource
terraform import aws_s3_bucket.bucket my-bucket-name
\`\`\`

### Corrupted State
\`\`\`bash
# Restore from S3 version history
aws s3api list-object-versions --bucket my-terraform-state-bucket --prefix resume/
aws s3 cp s3://my-terraform-state-bucket/resume/terraform.tfstate?versionId=VERSION_ID ./terraform.tfstate
terraform state push terraform.tfstate
\`\`\`

## Complete Backend Configuration

\`\`\`hcl
# backend.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "my-terraform-state-unique-12345"
    key            = "resume/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
    
    # Optional: KMS encryption
    # kms_key_id = "arn:aws:kms:us-east-1:ACCOUNT_ID:key/KEY_ID"
  }
}
\`\`\`

## State Security Checklist

- [ ] Remote state configured (S3)
- [ ] Versioning enabled
- [ ] Encryption enabled (SSE or KMS)
- [ ] State locking enabled (DynamoDB)
- [ ] Bucket policy restricts access
- [ ] Lifecycle policy to prevent deletion
- [ ] Regular backups automated
- [ ] .gitignore excludes \*.tfstate files
- [ ] Separate state per environment
- [ ] Team has read-only S3 access

## CI/CD with Remote State

GitHub Actions workflow:
\`\`\`yaml
name: Terraform

on: [push]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Terraform Init
        run: terraform init
        # Automatically uses S3 backend
      
      - name: Terraform Plan
        run: terraform plan
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve
\`\`\`

Remote state allows seamless CI/CD deployments!

## Summary

- **Local state**: Development only
- **Remote state (S3)**: Production standard
- **DynamoDB locking**: Prevents conflicts
- **Versioning**: Allows rollbacks
- **Encryption**: Protects sensitive data
- **Separate state**: Per environment/project

Master state management for professional Terraform usage!
`
      }
    ],
    labs: [
      { id: "w9-lab1", title: "Terraform Basics Lab", description: "Create your first infrastructure.", difficulty: "intermediate", estimatedTime: 50, xp: 150, tasks: ["Write main.tf", "Run terraform init", "Apply changes"] },
      { id: "w9-lab2", title: "Cloud Resume with Terraform", description: "Rebuild resume infrastructure as code.", difficulty: "advanced", estimatedTime: 90, xp: 250, tasks: ["Define S3 resources", "Add CloudFront", "Add Lambda/DynamoDB"] }
    ],
    project: {
      id: "cloud-resume-p3",
      title: "Cloud Resume Challenge - IaC",
      description: "Convert your infrastructure to Terraform code.",
      xp: 400
    }
  },
  {
    weekNumber: 10,
    title: "CI/CD with GitHub Actions",
    description: "Automate deployments with continuous integration and delivery.",
    objectives: [
      "Understand CI/CD principles",
      "Create GitHub Actions workflows",
      "Automate S3 deployments",
      "Deploy Lambda with CI/CD"
    ],
    lessons: [
      { 
        id: "w10-l1", 
        title: "Introduction to CI/CD", 
        description: "Learn continuous integration and delivery.", 
        duration: "20 min", 
        xp: 50,
        videoId: "scEDHsr3APg", // CI/CD Explained
        content: `# CI/CD Fundamentals

## What is CI/CD?

**CI/CD** = Continuous Integration / Continuous Delivery/Deployment

### Continuous Integration (CI)
- Automatically build and test code on every commit
- Catch bugs early
- Ensure code always works

### Continuous Delivery (CD)
- Automatically deploy to staging
- Manual approval for production
- Always ready to deploy

### Continuous Deployment
- Automatically deploy to production
- No manual intervention
- Every commit goes live (if tests pass)

## Traditional vs CI/CD

**Traditional**:
1. Developer writes code for weeks
2. Merge conflicts everywhere
3. Manual testing before release
4. Deploy once a month
5. High-risk deployments

**CI/CD**:
1. Commit code multiple times daily
2. Automated testing on every commit
3. Deploy multiple times per day
4. Low-risk, small changes
5. Fast feedback

## Benefits

✅ Faster releases  
✅ Higher quality code  
✅ Automated testing  
✅ Reduced manual work  
✅ Quick rollbacks  

## CI/CD Pipeline Stages

\`\`\`
Commit Code
   ↓
Build (compile, package)
   ↓
Test (unit, integration)
   ↓
Deploy to Staging
   ↓
Test Staging
   ↓
Deploy to Production
   ↓
Monitor
\`\`\`

## Popular CI/CD Tools

- **GitHub Actions** ⭐ (What we'll use)
- Jenkins
- GitLab CI/CD
- CircleCI
- Travis CI
- AWS CodePipeline`
      },
      { 
        id: "w10-l2", 
        title: "GitHub Actions Basics", 
        description: "Create your first workflow.", 
        duration: "30 min", 
        xp: 50,
        videoId: "R8_veQiYBjI", // GitHub Actions Tutorial
        content: `# GitHub Actions

## What are GitHub Actions?

**GitHub Actions** = CI/CD built into GitHub

- Run workflows on code events
- Free for public repos
- 2,000 minutes/month for private repos

## Workflow Basics

### Workflow File
\`.github/workflows/deploy.yml\`

\`\`\`yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to S3
        run: |
          aws s3 sync ./dist s3://my-bucket
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
\`\`\`

## Key Concepts

**Workflow**: Automated process  
**Event**: Trigger (push, pull_request, schedule)  
**Job**: Set of steps  
**Step**: Individual task  
**Action**: Reusable command  
**Runner**: Server that runs jobs  

## Example: Deploy on Push

\`\`\`yaml
name: Deploy Website

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to S3
        run: aws s3 sync ./dist s3://my-bucket --delete
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: us-east-1
\`\`\`

## Secrets

Store sensitive data securely:

1. Go to repo **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add \`AWS_ACCESS_KEY_ID\` and \`AWS_SECRET_ACCESS_KEY\`
4. Reference in workflow: \`\${{ secrets.SECRET_NAME }}\`

Automate everything! 🚀`
      },
      { 
        id: "w10-l3", 
        title: "Deploying to AWS with Actions", 
        description: "Automate AWS deployments.", 
        duration: "25 min", 
        xp: 50,
        videoId: "mFFXuXjVgkU", // AWS Deployment with GitHub Actions
        content: `# AWS Deployments with GitHub Actions

## Deploy to S3

\`\`\`yaml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Sync to S3
        run: aws s3 sync ./public s3://my-website-bucket --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \\
            --distribution-id \${{ secrets.CLOUDFRONT_ID }} \\
            --paths "/*"
\`\`\`

## Deploy Lambda Function

\`\`\`yaml
name: Deploy Lambda

on:
  push:
    branches: [main]
    paths:
      - 'lambda/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      
      - name: Install dependencies
        run: |
          cd lambda
          pip install -r requirements.txt -t .
      
      - name: Package Lambda
        run: |
          cd lambda
          zip -r function.zip .
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Lambda
        run: |
          aws lambda update-function-code \\
            --function-name my-function \\
            --zip-file fileb://lambda/function.zip
\`\`\`

## Best Practices

1. **Use IAM roles** when possible (avoid access keys)
2. **Test before deploy** (run tests in CI)
3. **Separate workflows** (frontend vs backend)
4. **Use caching** (faster builds)
5. **Add status badges** to README

Complete automation! ⚡`
      }
    ],
    labs: [
      { id: "w10-lab1", title: "GitHub Actions Workflow", description: "Create a CI/CD pipeline.", difficulty: "intermediate", estimatedTime: 60, xp: 200, tasks: ["Create workflow file", "Add AWS credentials", "Test deployment"] },
      { id: "w10-lab2", title: "Automated Resume Deployment", description: "Auto-deploy on push.", difficulty: "advanced", estimatedTime: 70, xp: 200, tasks: ["Sync S3 on push", "Deploy Lambda", "Run tests"] }
    ],
    project: {
      id: "cloud-resume-p4",
      title: "Cloud Resume Challenge - CI/CD",
      description: "Add automated deployments to your resume.",
      xp: 300
    }
  },
  {
    weekNumber: 11,
    title: "Containers with Docker",
    description: "Package applications with Docker and understand containerization.",
    objectives: [
      "Understand containers vs VMs",
      "Write Dockerfiles",
      "Build and run containers",
      "Push images to Docker Hub"
    ],
    lessons: [
      { 
        id: "w11-l1", 
        title: "Introduction to Containers", 
        description: "Understand containerization.", 
        duration: "20 min", 
        xp: 50,
        videoId: "Gjnup-PuquQ", // Containers Explained
        content: `# Introduction to Containers

## What are Containers?

**Containers** package your application with all its dependencies into a single unit that runs anywhere.

## Containers vs Virtual Machines

**Virtual Machines (VMs)**:
- Full OS for each app
- Gigabytes in size
- Minutes to start
- Resource heavy

**Containers**:
- Share host OS kernel
- Megabytes in size
- Seconds to start
- Lightweight

## Benefits

✅ **Consistency**: Works on dev, staging, production  
✅ **Isolation**: Each app has own environment  
✅ **Portability**: Run anywhere (laptop, cloud, on-prem)  
✅ **Efficiency**: More apps per server  
✅ **Fast deployment**: Start in seconds  

## Docker

**Docker** is the most popular container platform.

### Key Components

- **Image**: Blueprint for container (like a class)
- **Container**: Running instance of image (like an object)
- **Dockerfile**: Recipe to build image
- **Docker Hub**: Registry of images (like npm, pip)

## Common Docker Commands

\`\`\`bash
# Pull image
docker pull nginx

# Run container
docker run -p 80:80 nginx

# List containers
docker ps

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>
\`\`\`

Containers = Consistent deployments! 📦`
      },
      { 
        id: "w11-l2", 
        title: "Docker Fundamentals", 
        description: "Images, containers, and registries.", 
        duration: "30 min", 
        xp: 50,
        videoId: "fqMOX6JJhGo", // Docker Tutorial
        content: `# Docker Fundamentals

## Docker Images

Images are read-only templates.

\`\`\`bash
# Pull from Docker Hub
docker pull python:3.12

# List images
docker images

# Remove image
docker rmi python:3.12
\`\`\`

## Docker Containers

Containers are running instances.

\`\`\`bash
# Run container (interactive)
docker run -it python:3.12 bash

# Run in background (detached)
docker run -d nginx

# Run with port mapping
docker run -p 8080:80 nginx
# Access at http://localhost:8080

# Run with name
docker run --name my-nginx nginx

# Run with environment variables
docker run -e DB_HOST=localhost my-app

# List running containers
docker ps

# List all containers
docker ps -a

# View logs
docker logs my-nginx

# Execute command in container
docker exec -it my-nginx bash

# Stop container
docker stop my-nginx

# Start stopped container
docker start my-nginx

# Remove container
docker rm my-nginx

# Remove all stopped containers
docker container prune
\`\`\`

## Docker Volumes

Persist data outside containers.

\`\`\`bash
# Create volume
docker volume create my-data

# Run with volume
docker run -v my-data:/data my-app

# Bind mount (use local folder)
docker run -v /path/on/host:/path/in/container my-app

# List volumes
docker volume ls
\`\`\`

## Docker Networks

Connect containers together.

\`\`\`bash
# Create network
docker network create my-network

# Run container on network
docker run --network my-network --name db postgres
docker run --network my-network --name app my-app

# App can now access DB at hostname "db"
\`\`\`

Master Docker basics! 🐳`
      },
      { 
        id: "w11-l3", 
        title: "Writing Dockerfiles", 
        description: "Create custom images.", 
        duration: "25 min", 
        xp: 50,
        videoId: "LQjaJINkQXY", // Dockerfile Tutorial
        content: `# Writing Dockerfiles

## What is a Dockerfile?

A **Dockerfile** is a text file with instructions to build a Docker image.

## Basic Dockerfile

\`\`\`dockerfile
# Start from base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
\`\`\`

## Build and Run

\`\`\`bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
\`\`\`

## Common Instructions

### FROM
Base image to start from.

\`\`\`dockerfile
FROM python:3.12-slim
FROM node:20-alpine
FROM nginx:latest
\`\`\`

### WORKDIR
Set working directory in container.

\`\`\`dockerfile
WORKDIR /app
\`\`\`

### COPY
Copy files from host to container.

\`\`\`dockerfile
COPY package.json .
COPY . .
\`\`\`

### RUN
Execute commands during build.

\`\`\`dockerfile
RUN npm install
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y curl
\`\`\`

### ENV
Set environment variables.

\`\`\`dockerfile
ENV NODE_ENV=production
ENV PORT=3000
\`\`\`

### EXPOSE
Document which port container listens on.

\`\`\`dockerfile
EXPOSE 80
EXPOSE 3000
\`\`\`

### CMD
Default command to run.

\`\`\`dockerfile
CMD ["python", "app.py"]
CMD ["npm", "start"]
CMD ["node", "server.js"]
\`\`\`

### ENTRYPOINT
Like CMD but harder to override.

\`\`\`dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
# Can override app.py but not python
\`\`\`

## Python App Example

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
\`\`\`

## Node.js App Example

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
\`\`\`

## Multi-Stage Build

Reduce image size.

\`\`\`dockerfile
# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## .dockerignore

Exclude files from image.

\`\`\`
node_modules
.git
.env
*.md
.DS_Store
\`\`\`

## Best Practices

1. **Use small base images** (alpine)
2. **Minimize layers** (combine RUN commands)
3. **Use .dockerignore**
4. **Don't run as root** (USER instruction)
5. **Multi-stage builds** for smaller images
6. **Cache dependencies** (COPY package files first)

## Push to Docker Hub

\`\`\`bash
# Login
docker login

# Tag image
docker tag my-app username/my-app:v1

# Push
docker push username/my-app:v1
\`\`\`

Build custom containers! 🚀`
      }
    ],
    labs: [
      { id: "w11-lab1", title: "Run Your First Container", description: "Pull and run Docker images.", difficulty: "beginner", estimatedTime: 30, xp: 100, tasks: ["Install Docker", "Pull image", "Run container"] },
      { id: "w11-lab2", title: "Build Custom Docker Image", description: "Create and containerize an app.", difficulty: "intermediate", estimatedTime: 60, xp: 200, tasks: ["Write Dockerfile", "Build image", "Run container", "Push to registry"] }
    ]
  },
  {
    weekNumber: 12,
    title: "Monitoring, Final Project & Job Prep",
    description: "Learn monitoring basics and prepare for DevOps interviews.",
    objectives: [
      "Set up CloudWatch monitoring",
      "Create dashboards and alarms",
      "Polish your Cloud Resume",
      "Prepare for DevOps interviews"
    ],
    lessons: [
      { 
        id: "w12-l1", 
        title: "Monitoring and Observability", 
        description: "Learn CloudWatch basics.", 
        duration: "25 min", 
        xp: 50,
        videoId: "a4N_iMCFAMY", // AWS CloudWatch Tutorial
        content: `# Monitoring and Observability

## Why Monitor?

**Monitoring** tells you when something breaks.  
**Observability** tells you why.

### Benefits
- Detect issues before users notice
- Understand system behavior
- Troubleshoot problems faster
- Optimize performance
- Meet SLAs

## AWS CloudWatch

**CloudWatch** is AWS's monitoring and observability service.

### Key Features

1. **Metrics**: Numbers over time (CPU, memory, requests)
2. **Logs**: Application output, error messages
3. **Alarms**: Notifications when thresholds crossed
4. **Dashboards**: Visualize metrics
5. **Events/EventBridge**: Trigger actions on events

## Common Metrics

### EC2
- **CPUUtilization**: 0-100%
- **NetworkIn/Out**: Bytes transferred
- **DiskReadOps/WriteOps**: Disk operations
- **StatusCheckFailed**: Instance health

### Lambda
- **Invocations**: Function calls
- **Duration**: Execution time
- **Errors**: Failed invocations
- **Throttles**: Rate limited
- **ConcurrentExecutions**: Running instances

### S3
- **NumberOfObjects**: Object count
- **BucketSizeBytes**: Storage used

### DynamoDB
- **ConsumedReadCapacityUnits**
- **ConsumedWriteCapacityUnits**
- **UserErrors**: 400 errors
- **SystemErrors**: 500 errors

## CloudWatch Logs

View application logs centrally.

### Log Groups
Collection of log streams (e.g., \`/aws/lambda/my-function\`)

### Log Streams
Sequence of log events (e.g., each Lambda execution)

### Example: Lambda Logging

\`\`\`python
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Function started")
    logger.error("An error occurred")
    # Automatically goes to CloudWatch Logs
\`\`\`

## Creating Alarms

Alert when metrics exceed thresholds.

### Example: High CPU Alarm

1. CloudWatch → **Alarms** → **Create alarm**
2. Select metric: EC2 → Per-Instance Metrics → CPUUtilization
3. Threshold: Greater than 80%
4. Period: 5 minutes
5. Action: Send SNS notification
6. Create alarm

### With AWS CLI

\`\`\`bash
aws cloudwatch put-metric-alarm \\
  --alarm-name high-cpu \\
  --alarm-description "CPU exceeds 80%" \\
  --metric-name CPUUtilization \\
  --namespace AWS/EC2 \\
  --statistic Average \\
  --period 300 \\
  --threshold 80 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 2
\`\`\`

## Custom Metrics

Track your own metrics.

\`\`\`python
import boto3
cloudwatch = boto3.client('cloudwatch')

# Put custom metric
cloudwatch.put_metric_data(
    Namespace='MyApp',
    MetricData=[
        {
            'MetricName': 'PageViews',
            'Value': 1,
            'Unit': 'Count'
        }
    ]
)
\`\`\`

## Best Practices

1. **Set appropriate alarms**: Don't alert on noise
2. **Use log insights**: Query logs with SQL-like syntax
3. **Create dashboards**: Visualize key metrics
4. **Set retention**: Auto-delete old logs
5. **Use metric filters**: Extract metrics from logs

Monitor everything! 📊`
      },
      { 
        id: "w12-l2", 
        title: "Creating Dashboards", 
        description: "Visualize metrics.", 
        duration: "20 min", 
        xp: 50,
        videoId: "IWTFfHHH4Bs", // CloudWatch Dashboards
        content: `# CloudWatch Dashboards

## Create Dashboard

1. CloudWatch → **Dashboards** → **Create dashboard**
2. Name it (e.g., "Production Metrics")
3. Add widgets:
   - **Line**: Metrics over time
   - **Number**: Current value
   - **Gauge**: Visual indicator
   - **Text**: Markdown notes

## Example Dashboard

### Widget 1: Lambda Invocations
- Type: Line
- Metric: Lambda → Invocations
- Period: 5 minutes

### Widget 2: Error Rate
- Type: Number
- Metric: Lambda → Errors
- Statistic: Sum

### Widget 3: API Latency
- Type: Line
- Metric: API Gateway → Latency
- Period: 1 minute

## Share Dashboard

- Click **Actions** → **Share dashboard**
- Generate public link or email

Visualize everything! 📈`
      },
      { 
        id: "w12-l3", 
        title: "DevOps Interview Prep", 
        description: "Common questions and answers.", 
        duration: "30 min", 
        xp: 50,
        videoId: "FSs_JYwnADI", // DevOps Interview Questions
        content: `# DevOps Interview Preparation

## Common Interview Topics

### 1. What is DevOps?

**Answer**: DevOps is a culture and set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and deliver high-quality software continuously. Key principles include automation, continuous integration/delivery, monitoring, and collaboration.

### 2. Explain CI/CD

**CI (Continuous Integration)**: Automatically build and test code on every commit to catch issues early.

**CD (Continuous Delivery)**: Automatically deploy to staging; manual production deploy.

**CD (Continuous Deployment)**: Automatically deploy to production with no manual intervention.

### 3. Containers vs VMs

**VMs**: Full operating system for each app, heavy resource usage, slow startup.

**Containers**: Share host OS kernel, lightweight, fast startup, more efficient.

### 4. What is Infrastructure as Code?

**IaC**: Managing infrastructure through code files (Terraform, CloudFormation) instead of manual configuration. Benefits: version control, reproducibility, automation, consistency.

### 5. Git Commands

\`\`\`bash
git clone <url>          # Clone repository
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to remote
git pull                 # Pull from remote
git branch <name>        # Create branch
git checkout <branch>    # Switch branch
git merge <branch>       # Merge branch
\`\`\`

### 6. AWS Services

- **EC2**: Virtual servers
- **S3**: Object storage
- **Lambda**: Serverless functions
- **RDS**: Managed databases
- **VPC**: Virtual network
- **IAM**: Identity and access
- **CloudWatch**: Monitoring

### 7. Docker Commands

\`\`\`bash
docker build -t name .           # Build image
docker run -p 8080:80 image      # Run container
docker ps                        # List running
docker stop <id>                 # Stop container
docker images                    # List images
docker exec -it <id> bash        # Enter container
\`\`\`

### 8. Troubleshooting Steps

1. **Check logs**: CloudWatch, application logs
2. **Verify connectivity**: Can services reach each other?
3. **Check permissions**: IAM roles, security groups
4. **Review recent changes**: What changed before issue?
5. **Monitor metrics**: CPU, memory, network usage

## Resume Tips

✅ **Quantify achievements**: "Reduced deployment time by 50%"  
✅ **Use action verbs**: "Automated", "Implemented", "Optimized"  
✅ **Show projects**: Cloud Resume Challenge, personal projects  
✅ **List skills**: AWS, Docker, Python, Git, CI/CD  
✅ **Include certifications**: AWS Cloud Practitioner, etc.  

## Interview Tips

1. **Explain your thinking**: Talk through your approach
2. **Ask clarifying questions**: Understand the problem
3. **Mention tradeoffs**: Show you understand pros/cons
4. **Be honest**: Say "I don't know but would research..."
5. **Show enthusiasm**: Passion for learning matters

## Next Steps

1. ✅ Complete Cloud Resume Challenge
2. ✅ Get AWS Cloud Practitioner cert
3. ✅ Build 2-3 more projects
4. ✅ Contribute to open source
5. ✅ Network on LinkedIn
6. ✅ Apply to entry-level DevOps roles

You're ready for DevOps! 🚀`
      }
    ],
    labs: [
      { id: "w12-lab1", title: "CloudWatch Monitoring", description: "Monitor your resume website.", difficulty: "intermediate", estimatedTime: 45, xp: 150, tasks: ["Create CloudWatch alarm", "Set up dashboard", "Configure notifications"] },
      { id: "w12-lab2", title: "Final Resume Polish", description: "Optimize and document your project.", difficulty: "advanced", estimatedTime: 90, xp: 250, tasks: ["Add tests", "Write README", "Create architecture diagram", "Record demo video"] }
    ]
  }
];

const cloudResumeChallenge = {
  id: "cloud-resume-challenge",
  title: "Cloud Resume Challenge",
  description: "Build a cloud-native resume that demonstrates your DevOps skills and gets you hired.",
  difficulty: "advanced",
  totalXP: 1800,
  phases: [
    {
      phase: 1,
      title: "Frontend - HTML/CSS Resume",
      week: 7,
      xp: 500,
      tasks: ["Write resume in HTML", "Style with CSS", "Deploy to S3", "Configure CloudFront", "Add custom domain"]
    },
    {
      phase: 2,
      title: "Backend - Serverless Visitor Counter",
      week: 8,
      xp: 600,
      tasks: ["Create DynamoDB table", "Write Lambda function", "Create API Gateway", "Connect frontend to backend"]
    },
    {
      phase: 3,
      title: "Infrastructure as Code",
      week: 9,
      xp: 400,
      tasks: ["Write Terraform for S3", "Add CloudFront to Terraform", "Add Lambda/DynamoDB to Terraform"]
    },
    {
      phase: 4,
      title: "CI/CD Pipeline",
      week: 9,
      xp: 300,
      tasks: ["Create GitHub Actions workflow", "Auto-sync S3", "Deploy Lambda on push"]
    }
  ],
  skills: ["AWS", "HTML/CSS/JavaScript", "Python", "Terraform", "GitHub Actions"],
  resources: [
    { title: "Official Cloud Resume Challenge", url: "https://cloudresumechallenge.dev/docs/the-challenge/aws/" }
  ]
};

async function seedCurriculum() {
  console.log('🌱 Starting curriculum seed...\n');
  
  try {
    const batch = writeBatch(db);
    
    for (const week of weeks) {
      const weekRef = doc(db, 'curriculum', `week-${week.weekNumber}`);
      batch.set(weekRef, { ...week, createdAt: new Date() });
      console.log(`✅ Added Week ${week.weekNumber}: ${week.title}`);
    }
    
    const projectRef = doc(db, 'curriculum', 'cloud-resume-challenge');
    batch.set(projectRef, { ...cloudResumeChallenge, type: 'capstone-project', createdAt: new Date() });
    console.log('✅ Added Cloud Resume Challenge');
    
    await batch.commit();
    
    console.log('\n🎉 Curriculum seeded successfully!');
    console.log(`📚 Total weeks: ${weeks.length}`);
    console.log('\nNext: Navigate to /curriculum in your app');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedCurriculum();

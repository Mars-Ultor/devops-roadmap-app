/* eslint-disable max-lines-per-function, sonarjs/no-duplicate-string */
import {
  FileCode,
  Terminal,
  Book,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";

export default function Resources() {
  const interviewQuestions = [
    {
      category: "DevOps Fundamentals",
      questions: [
        {
          q: "What is DevOps and why is it important?",
          a: "DevOps is a culture and set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and deliver high-quality software continuously. It emphasizes collaboration, automation, continuous integration/delivery, and monitoring.",
        },
        {
          q: "Explain the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment.",
          a: "CI (Continuous Integration): Automatically build and test code on every commit. CD (Continuous Delivery): Automatically deploy to staging, manual production deploy. CD (Continuous Deployment): Automatically deploy to production with no manual intervention.",
        },
        {
          q: "What are the key principles of DevOps?",
          a: "Collaboration, automation, continuous improvement, customer-centric action, and fail fast with quick recovery.",
        },
      ],
    },
    {
      category: "Linux & Command Line",
      questions: [
        {
          q: "How do you check disk space in Linux?",
          a: 'Use "df -h" to show disk space in human-readable format, or "du -sh *" to show directory sizes.',
        },
        {
          q: "What's the difference between hard links and soft links?",
          a: "Hard link: Points to the same inode as the original file (same data). Soft link (symlink): Points to the filename (like a shortcut). Hard links can't cross filesystems, symlinks can.",
        },
        {
          q: "How do you find running processes using a specific port?",
          a: 'Use "netstat -tulpn | grep :8080" or "lsof -i :8080" or "ss -tulpn | grep :8080"',
        },
      ],
    },
    {
      category: "Git & Version Control",
      questions: [
        {
          q: "What's the difference between git pull and git fetch?",
          a: "git fetch: Downloads changes from remote but doesn't merge them. git pull: Downloads changes AND merges them into your current branch (fetch + merge).",
        },
        {
          q: "How do you undo the last commit but keep the changes?",
          a: 'Use "git reset --soft HEAD~1" to undo the commit but keep changes staged, or "git reset HEAD~1" to keep changes unstaged.',
        },
        {
          q: "Explain git rebase vs git merge.",
          a: "Merge: Creates a merge commit, preserves history. Rebase: Replays commits on top of another branch, creates linear history. Use merge for public branches, rebase for cleaning up local history.",
        },
      ],
    },
    {
      category: "Docker & Containers",
      questions: [
        {
          q: "What's the difference between a Docker image and a container?",
          a: "Image: Read-only template (blueprint). Container: Running instance of an image (like an object from a class).",
        },
        {
          q: "How do you reduce Docker image size?",
          a: "Use multi-stage builds, use alpine base images, minimize layers, use .dockerignore, combine RUN commands, remove unnecessary packages.",
        },
        {
          q: "What's the difference between CMD and ENTRYPOINT?",
          a: "CMD: Default command that can be overridden. ENTRYPOINT: Main command that runs, CMD becomes arguments. ENTRYPOINT is harder to override.",
        },
      ],
    },
    {
      category: "AWS & Cloud",
      questions: [
        {
          q: "What are the main AWS compute services?",
          a: "EC2 (virtual servers), Lambda (serverless functions), ECS/EKS (containers), Elastic Beanstalk (PaaS), Fargate (serverless containers).",
        },
        {
          q: "Explain the difference between S3 storage classes.",
          a: "Standard (frequent access), Intelligent-Tiering (auto-optimize), Infrequent Access (IA - less frequent), Glacier (archival, cheap), One Zone-IA (single AZ).",
        },
        {
          q: "What is IAM and why is it important?",
          a: "Identity and Access Management - controls who can access AWS resources and what they can do. Uses users, groups, roles, and policies to enforce least-privilege access.",
        },
      ],
    },
    {
      category: "CI/CD",
      questions: [
        {
          q: "What is a CI/CD pipeline?",
          a: "Automated process that takes code from commit to production: Code → Build → Test → Deploy to Staging → Deploy to Production → Monitor.",
        },
        {
          q: "How do you handle secrets in CI/CD pipelines?",
          a: "Use secret management tools (AWS Secrets Manager, HashiCorp Vault), environment variables, encrypted secrets in CI tools (GitHub Secrets), never commit secrets to git.",
        },
        {
          q: "What is blue-green deployment?",
          a: "Two identical environments (blue = current, green = new). Deploy to green, test, then switch traffic. Easy rollback by switching back to blue.",
        },
      ],
    },
  ];

  const cheatSheets = [
    {
      title: "Git Commands",
      icon: FileCode,
      commands: [
        { cmd: "git init", desc: "Initialize new repository" },
        { cmd: "git clone <url>", desc: "Clone repository" },
        { cmd: "git add .", desc: "Stage all changes" },
        { cmd: 'git commit -m "msg"', desc: "Commit with message" },
        { cmd: "git push origin main", desc: "Push to remote" },
        { cmd: "git pull", desc: "Fetch and merge" },
        { cmd: "git branch <name>", desc: "Create branch" },
        { cmd: "git checkout <branch>", desc: "Switch branch" },
        { cmd: "git merge <branch>", desc: "Merge branch" },
        { cmd: "git log --oneline", desc: "View commit history" },
        { cmd: "git status", desc: "Check status" },
        { cmd: "git diff", desc: "Show changes" },
      ],
    },
    {
      title: "Docker Commands",
      icon: Terminal,
      commands: [
        { cmd: "docker build -t name .", desc: "Build image" },
        {
          cmd: "docker run -p 8080:80 image",
          desc: "Run container with port mapping",
        },
        { cmd: "docker ps", desc: "List running containers" },
        { cmd: "docker ps -a", desc: "List all containers" },
        { cmd: "docker images", desc: "List images" },
        { cmd: "docker stop <id>", desc: "Stop container" },
        { cmd: "docker rm <id>", desc: "Remove container" },
        { cmd: "docker rmi <image>", desc: "Remove image" },
        { cmd: "docker exec -it <id> bash", desc: "Enter container shell" },
        { cmd: "docker logs <id>", desc: "View container logs" },
        { cmd: "docker pull <image>", desc: "Download image" },
        { cmd: "docker push <image>", desc: "Upload image to registry" },
      ],
    },
    {
      title: "AWS CLI Commands",
      icon: Terminal,
      commands: [
        { cmd: "aws s3 ls", desc: "List S3 buckets" },
        { cmd: "aws s3 cp file.txt s3://bucket/", desc: "Upload to S3" },
        {
          cmd: "aws s3 sync ./dist s3://bucket/",
          desc: "Sync directory to S3",
        },
        { cmd: "aws ec2 describe-instances", desc: "List EC2 instances" },
        { cmd: "aws lambda list-functions", desc: "List Lambda functions" },
        {
          cmd: "aws lambda invoke --function-name <name>",
          desc: "Invoke Lambda",
        },
        { cmd: "aws iam list-users", desc: "List IAM users" },
        {
          cmd: "aws logs tail <log-group> --follow",
          desc: "Tail CloudWatch logs",
        },
        { cmd: "aws configure", desc: "Configure AWS credentials" },
        { cmd: "aws sts get-caller-identity", desc: "Get current identity" },
      ],
    },
    {
      title: "Linux Commands",
      icon: Terminal,
      commands: [
        { cmd: "ls -lah", desc: "List files (detailed, hidden)" },
        { cmd: "cd /path/to/dir", desc: "Change directory" },
        { cmd: "pwd", desc: "Print working directory" },
        { cmd: "mkdir -p path/to/dir", desc: "Create directory (recursive)" },
        { cmd: "rm -rf dir/", desc: "Remove directory recursively" },
        { cmd: "cat file.txt", desc: "Display file contents" },
        { cmd: "tail -f log.txt", desc: "Follow log file" },
        { cmd: 'grep "pattern" file.txt', desc: "Search in file" },
        { cmd: 'find . -name "*.js"', desc: "Find files by name" },
        { cmd: "chmod 755 script.sh", desc: "Change permissions" },
        { cmd: "ps aux | grep node", desc: "Find process" },
        { cmd: "df -h", desc: "Disk space" },
        { cmd: "top", desc: "Monitor processes" },
        { cmd: "curl https://api.com", desc: "Make HTTP request" },
      ],
    },
  ];

  const glossary = [
    {
      term: "API",
      definition:
        "Application Programming Interface - allows programs to communicate with each other",
    },
    {
      term: "CI/CD",
      definition:
        "Continuous Integration/Continuous Delivery - automated software delivery pipeline",
    },
    {
      term: "Container",
      definition:
        "Lightweight, standalone package that includes application code and dependencies",
    },
    {
      term: "Deployment",
      definition: "Process of making software available for use",
    },
    {
      term: "Docker",
      definition:
        "Platform for developing, shipping, and running applications in containers",
    },
    { term: "EC2", definition: "Elastic Compute Cloud - AWS virtual servers" },
    {
      term: "Git",
      definition:
        "Distributed version control system for tracking code changes",
    },
    {
      term: "IAM",
      definition:
        "Identity and Access Management - controls who can access what in AWS",
    },
    {
      term: "IaC",
      definition:
        "Infrastructure as Code - managing infrastructure through code files",
    },
    {
      term: "Kubernetes",
      definition:
        "Container orchestration platform for automating deployment and scaling",
    },
    {
      term: "Lambda",
      definition:
        "AWS serverless compute service - run code without managing servers",
    },
    {
      term: "Load Balancer",
      definition: "Distributes incoming traffic across multiple servers",
    },
    {
      term: "Microservices",
      definition: "Architectural style with small, independent services",
    },
    {
      term: "Monitoring",
      definition: "Observing system performance and health metrics",
    },
    { term: "S3", definition: "Simple Storage Service - AWS object storage" },
    {
      term: "Serverless",
      definition: "Cloud execution model where provider manages infrastructure",
    },
    {
      term: "SSH",
      definition:
        "Secure Shell - encrypted network protocol for secure remote login",
    },
    {
      term: "VPC",
      definition: "Virtual Private Cloud - isolated network in AWS",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interview Prep & Resources
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Essential interview questions, command cheat sheets, and DevOps
            terminology to help you succeed
          </p>
        </div>

        {/* Interview Questions */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">
              Common Interview Questions
            </h2>
          </div>

          <div className="space-y-6">
            {interviewQuestions.map((category) => (
              <div
                key={category.category}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <h3 className="text-2xl font-semibold text-indigo-400 mb-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((item) => (
                    <div
                      key={item.q}
                      className="border-l-4 border-indigo-500 pl-4 py-2"
                    >
                      <p className="text-lg font-semibold text-white mb-2">
                        Q: {item.q}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        A: {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Command Cheat Sheets */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">
              Command Cheat Sheets
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cheatSheets.map((sheet) => (
              <div
                key={sheet.title}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <sheet.icon className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {sheet.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {sheet.commands.map((cmd) => (
                    <div key={cmd.cmd} className="flex flex-col gap-1">
                      <code className="text-sm text-green-400 bg-slate-900 px-3 py-2 rounded font-mono">
                        {cmd.cmd}
                      </code>
                      <p className="text-xs text-slate-400 pl-3">{cmd.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">DevOps Glossary</h2>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-4">
              {glossary.map((item) => (
                <div
                  key={item.term}
                  className="border-l-4 border-purple-500 pl-4 py-2"
                >
                  <p className="text-lg font-semibold text-purple-400">
                    {item.term}
                  </p>
                  <p className="text-sm text-slate-300">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Templates */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">
              DevOps Resume Templates
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Entry-Level Resume */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">
                Entry-Level DevOps Engineer
              </h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-white mb-2">
                    Summary Example:
                  </p>
                  <p className="text-slate-400 italic bg-slate-900 p-3 rounded">
                    "Recent graduate with hands-on experience in AWS, Docker,
                    and CI/CD pipelines. Completed Cloud Resume Challenge
                    demonstrating proficiency in serverless architecture,
                    Infrastructure as Code (Terraform), and automated
                    deployments. Passionate about automation and continuous
                    learning in DevOps practices."
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    Skills Section:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                    <li>
                      <strong>Cloud:</strong> AWS (EC2, S3, Lambda, DynamoDB,
                      CloudFront, Route 53)
                    </li>
                    <li>
                      <strong>Containers:</strong> Docker, Docker Compose
                    </li>
                    <li>
                      <strong>CI/CD:</strong> GitHub Actions, automated testing
                      & deployment
                    </li>
                    <li>
                      <strong>IaC:</strong> Terraform, CloudFormation basics
                    </li>
                    <li>
                      <strong>Languages:</strong> Python, Bash, JavaScript
                      (basic)
                    </li>
                    <li>
                      <strong>Version Control:</strong> Git, GitHub
                    </li>
                    <li>
                      <strong>OS:</strong> Linux (Ubuntu, Amazon Linux)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    Project Example:
                  </p>
                  <div className="bg-slate-900 p-3 rounded text-slate-400">
                    <p className="font-semibold text-indigo-400">
                      Cloud Resume Challenge
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                      <li>
                        Built serverless resume website with visitor counter
                        using AWS Lambda, DynamoDB, and CloudFront
                      </li>
                      <li>
                        Implemented CI/CD pipeline with GitHub Actions for
                        automated deployments
                      </li>
                      <li>
                        Provisioned infrastructure using Terraform (S3,
                        CloudFront, Lambda, API Gateway)
                      </li>
                      <li>
                        Achieved 99.9% uptime with CloudWatch monitoring and
                        automated alerts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid-Level Resume */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                Mid-Level DevOps Engineer
              </h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-white mb-2">
                    Summary Example:
                  </p>
                  <p className="text-slate-400 italic bg-slate-900 p-3 rounded">
                    "DevOps Engineer with 2+ years of experience automating
                    deployments and managing cloud infrastructure. Proven track
                    record of reducing deployment time by 60% through CI/CD
                    pipeline optimization. Skilled in Kubernetes, Terraform, and
                    AWS with strong focus on security and cost optimization."
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    Achievement Examples:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2">
                    <li>
                      Reduced deployment time from 45 minutes to 15 minutes by
                      implementing parallel testing and optimized Docker builds
                    </li>
                    <li>
                      Cut AWS costs by 35% through resource rightsizing,
                      reserved instances, and automated shutdown schedules
                    </li>
                    <li>
                      Achieved 99.95% uptime SLA by implementing comprehensive
                      monitoring and automated failover
                    </li>
                    <li>
                      Migrated 15 microservices to Kubernetes, improving
                      scalability and resource utilization by 40%
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">
                    Advanced Skills:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                    <li>
                      <strong>Orchestration:</strong> Kubernetes (EKS), Helm,
                      ArgoCD
                    </li>
                    <li>
                      <strong>Monitoring:</strong> Prometheus, Grafana, ELK
                      Stack, CloudWatch
                    </li>
                    <li>
                      <strong>Security:</strong> IAM, Secrets management
                      (Vault), security scanning
                    </li>
                    <li>
                      <strong>Automation:</strong> Ansible, Python scripting,
                      Bash
                    </li>
                    <li>
                      <strong>Databases:</strong> RDS, DynamoDB, Redis
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">
              💡 Resume Tips for DevOps Roles
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Quantify achievements:</strong> Use metrics (%
                  reduction, time saved, uptime %, cost savings)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Use action verbs:</strong> Automated, Implemented,
                  Optimized, Reduced, Migrated, Designed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Show tools & technologies:</strong> List specific
                  tools you've used (Docker, Kubernetes, Terraform, etc.)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Include certifications:</strong> AWS, Azure, CKA, CKAD
                  boost credibility
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Link to projects:</strong> GitHub, deployed apps,
                  portfolio sites (Cloud Resume!)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>
                  <strong>Tailor to job description:</strong> Match keywords
                  from the job posting
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Study Schedule */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">
              12-Week Study Schedule
            </h2>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 mb-6">
              Follow this schedule to complete the DevOps Roadmap program in 3
              months. Adjust the pace based on your availability.
            </p>

            <div className="space-y-6">
              {/* Schedule Overview */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                  Recommended Time Commitment
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-yellow-400 font-semibold mb-2">
                      Full-Time (40h/week)
                    </p>
                    <p className="text-slate-300">• Complete in 6-8 weeks</p>
                    <p className="text-slate-300">• 2 weeks per module</p>
                    <p className="text-slate-300">• 8 hours/day</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-green-400 font-semibold mb-2">
                      Part-Time (20h/week)
                    </p>
                    <p className="text-slate-300">• Complete in 12 weeks</p>
                    <p className="text-slate-300">• 1 week per module</p>
                    <p className="text-slate-300">• 3-4 hours/day</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-blue-400 font-semibold mb-2">
                      Casual (10h/week)
                    </p>
                    <p className="text-slate-300">• Complete in 24 weeks</p>
                    <p className="text-slate-300">• 2 weeks per module</p>
                    <p className="text-slate-300">• 1.5 hours/day</p>
                  </div>
                </div>
              </div>

              {/* Weekly Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Week-by-Week Plan (Part-Time Schedule)
                </h3>

                {[
                  {
                    week: 1,
                    title: "DevOps Foundations & Linux",
                    hours: "15-20h",
                    tasks: [
                      "Complete all 3 lessons",
                      "Finish 3 labs",
                      "Take Week 1 quiz (70%+ required)",
                      "Set up AWS free tier account",
                    ],
                  },
                  {
                    week: 2,
                    title: "Version Control with Git & GitHub",
                    hours: "15-20h",
                    tasks: [
                      "Learn Git fundamentals",
                      "Create GitHub account & repos",
                      "Complete 3 labs",
                      "Pass Week 2 quiz",
                    ],
                  },
                  {
                    week: 3,
                    title: "Cloud Fundamentals with AWS",
                    hours: "15-20h",
                    tasks: [
                      "Launch EC2 instances",
                      "Work with S3 buckets",
                      "Understand IAM",
                      "Complete labs & quiz",
                    ],
                  },
                  {
                    week: 4,
                    title: "Networking & DNS Basics",
                    hours: "15-20h",
                    tasks: [
                      "Learn networking concepts",
                      "Configure Route 53",
                      "Understand CDN (CloudFront)",
                      "Labs & quiz",
                    ],
                  },
                  {
                    week: 5,
                    title: "Python for DevOps",
                    hours: "20-25h",
                    tasks: [
                      "Python basics & syntax",
                      "boto3 AWS SDK",
                      "Automation scripts",
                      "Labs & quiz",
                    ],
                  },
                  {
                    week: 6,
                    title: "Serverless Computing with Lambda",
                    hours: "15-20h",
                    tasks: [
                      "Create Lambda functions",
                      "DynamoDB basics",
                      "API Gateway",
                      "Labs & quiz",
                    ],
                  },
                  {
                    week: 7,
                    title: "Cloud Resume Challenge - Part 1",
                    hours: "20-25h",
                    tasks: [
                      "HTML/CSS resume",
                      "Deploy to S3",
                      "CloudFront distribution",
                      "Custom domain setup",
                    ],
                  },
                  {
                    week: 8,
                    title: "Cloud Resume Challenge - Part 2",
                    hours: "20-25h",
                    tasks: [
                      "JavaScript visitor counter",
                      "Lambda backend",
                      "DynamoDB database",
                      "CORS configuration",
                    ],
                  },
                  {
                    week: 9,
                    title: "Infrastructure as Code with Terraform",
                    hours: "25-30h",
                    tasks: [
                      "Terraform basics",
                      "Provision AWS resources",
                      "State management",
                      "Refactor Cloud Resume with IaC",
                    ],
                  },
                  {
                    week: 10,
                    title: "CI/CD with GitHub Actions",
                    hours: "15-20h",
                    tasks: [
                      "Create workflows",
                      "Automated testing",
                      "Automated deployments",
                      "Labs & quiz",
                    ],
                  },
                  {
                    week: 11,
                    title: "Containers with Docker",
                    hours: "15-20h",
                    tasks: [
                      "Docker basics",
                      "Dockerfile creation",
                      "Multi-stage builds",
                      "Labs & quiz",
                    ],
                  },
                  {
                    week: 12,
                    title: "Monitoring & Job Prep",
                    hours: "20-25h",
                    tasks: [
                      "CloudWatch monitoring",
                      "Final project polish",
                      "Resume prep",
                      "Interview practice",
                      "Quiz",
                    ],
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-yellow-500 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Week {item.week}: {item.title}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {item.hours} estimated time
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-semibold rounded-full">
                        Week {item.week}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {item.tasks.map((task) => (
                        <li
                          key={task}
                          className="text-sm text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-yellow-400 mt-1">→</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Study Tips */}
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">
                  📚 Study Tips for Success
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Consistency over intensity:</strong> Daily
                        2-hour sessions beat weekend cramming
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Hands-on practice:</strong> Don't skip the labs
                        - they're crucial for retention
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Use spaced repetition:</strong> Review lessons
                        when due to maximize retention
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Document your learning:</strong> Blog posts or
                        notes help solidify knowledge
                      </span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Join communities:</strong> r/devops, DevOps
                        Discord servers for support
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Build in public:</strong> Share your Cloud
                        Resume progress on LinkedIn/Twitter
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Take breaks:</strong> Pomodoro technique (25 min
                        work, 5 min break) works well
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong>Track progress:</strong> Use the dashboard
                        streak feature to build momentum
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Tips */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Apply?
            </h2>
            <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
              Complete the Cloud Resume Challenge to build a portfolio project
              that demonstrates all these skills!
            </p>
            <a
              href="/projects"
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              View Cloud Resume Challenge
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

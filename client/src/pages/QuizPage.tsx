import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Quiz from '../components/Quiz';
import type { QuizQuestion } from '../components/Quiz';

// Quiz data for each week
const quizData: Record<string, {
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
}> = {
  'week1-quiz': {
    title: 'Week 1: DevOps & Linux Fundamentals Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is the primary goal of DevOps?',
        options: [
          'To replace developers with operations teams',
          'To shorten the development lifecycle and deliver features frequently',
          'To eliminate the need for testing',
          'To reduce the cost of servers'
        ],
        correctAnswer: 1,
        explanation: 'DevOps aims to shorten the development lifecycle while delivering features, fixes, and updates frequently in close alignment with business objectives.'
      },
      {
        question: 'Which Linux directory contains user home directories?',
        options: [
          '/usr',
          '/var',
          '/home',
          '/etc'
        ],
        correctAnswer: 2,
        explanation: 'The /home directory contains individual home directories for each user on the system.'
      },
      {
        question: 'What command is used to print the current working directory in Linux?',
        options: [
          'cd',
          'pwd',
          'ls',
          'dir'
        ],
        correctAnswer: 1,
        explanation: 'The pwd (print working directory) command displays the full path of the current directory.'
      },
      {
        question: 'Which of the following is NOT a core DevOps principle?',
        options: [
          'Collaboration',
          'Automation',
          'Manual deployment only',
          'Continuous improvement'
        ],
        correctAnswer: 2,
        explanation: 'DevOps emphasizes automation, not manual-only deployments. Automation reduces human error and speeds up processes.'
      },
      {
        question: 'What is the root user in Linux?',
        options: [
          'A user with limited permissions',
          'The superuser with full system access',
          'A regular user account',
          'A guest account'
        ],
        correctAnswer: 1,
        explanation: 'The root user is the superuser with unrestricted access to all commands, files, and resources on the system.'
      },
      {
        question: 'Which directory typically contains system-wide configuration files?',
        options: [
          '/bin',
          '/tmp',
          '/etc',
          '/opt'
        ],
        correctAnswer: 2,
        explanation: 'The /etc directory contains system-wide configuration files for the operating system and installed software.'
      },
      {
        question: 'What does CI/CD stand for in DevOps?',
        options: [
          'Code Integration / Code Deployment',
          'Continuous Integration / Continuous Delivery',
          'Computer Integration / Computer Development',
          'Central Integration / Central Delivery'
        ],
        correctAnswer: 1,
        explanation: 'CI/CD stands for Continuous Integration and Continuous Delivery, key practices in DevOps for automating software development.'
      },
      {
        question: 'Which Linux distribution is optimized for AWS?',
        options: [
          'Ubuntu',
          'CentOS',
          'Amazon Linux',
          'Debian'
        ],
        correctAnswer: 2,
        explanation: 'Amazon Linux is a distribution specifically optimized for running on Amazon Web Services (AWS).'
      },
      {
        question: 'What is an absolute path in Linux?',
        options: [
          'A path relative to the current directory',
          'A path that starts with /',
          'A path that uses ~ symbol',
          'A path without any slashes'
        ],
        correctAnswer: 1,
        explanation: 'An absolute path starts with / and specifies the complete path from the root directory (e.g., /home/user/file.txt).'
      },
      {
        question: 'Why is Linux important for DevOps?',
        options: [
          'It is only used for personal computers',
          'It powers 96% of the world\'s top servers and is free and customizable',
          'It cannot run server applications',
          'It requires expensive licenses'
        ],
        correctAnswer: 1,
        explanation: 'Linux is crucial for DevOps because it\'s open-source, powers most servers worldwide, offers stability, security, and flexibility.'
      }
    ]
  },
  'week2-quiz': {
    title: 'Week 2: Git & GitHub Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is Git primarily used for?',
        options: [
          'Image editing',
          'Version control of code',
          'Database management',
          'Network configuration'
        ],
        correctAnswer: 1,
        explanation: 'Git is a distributed version control system designed to track changes in source code during software development.'
      },
      {
        question: 'What command initializes a new Git repository?',
        options: [
          'git start',
          'git create',
          'git init',
          'git new'
        ],
        correctAnswer: 2,
        explanation: 'git init creates a new Git repository in the current directory.'
      },
      {
        question: 'What is the difference between git pull and git fetch?',
        options: [
          'They are the same command',
          'git pull downloads and merges, git fetch only downloads',
          'git fetch is faster than git pull',
          'git pull is for remote repos, git fetch is for local'
        ],
        correctAnswer: 1,
        explanation: 'git pull fetches changes from remote AND merges them, while git fetch only downloads changes without merging.'
      },
      {
        question: 'What does "git add ." do?',
        options: [
          'Deletes all files',
          'Stages all modified files for commit',
          'Pushes changes to remote',
          'Creates a new branch'
        ],
        correctAnswer: 1,
        explanation: 'git add . stages all modified and new files in the current directory for the next commit.'
      },
      {
        question: 'What is a Git branch?',
        options: [
          'A type of tree in Linux',
          'A separate line of development',
          'A backup of your code',
          'A network connection'
        ],
        correctAnswer: 1,
        explanation: 'A branch in Git is a parallel version of the repository, allowing you to work on features independently.'
      },
      {
        question: 'What command creates and switches to a new branch?',
        options: [
          'git branch -new feature',
          'git create branch feature',
          'git checkout -b feature',
          'git switch --create feature (or git checkout -b feature)'
        ],
        correctAnswer: 3,
        explanation: 'Both "git checkout -b feature" and "git switch --create feature" create and switch to a new branch in one command.'
      },
      {
        question: 'What is a merge conflict?',
        options: [
          'When Git crashes',
          'When two branches have incompatible changes to the same file',
          'When you run out of disk space',
          'When GitHub is down'
        ],
        correctAnswer: 1,
        explanation: 'A merge conflict occurs when Git cannot automatically merge changes because the same lines were modified in different ways.'
      },
      {
        question: 'What is the .gitignore file used for?',
        options: [
          'To delete files from Git',
          'To specify files Git should not track',
          'To ignore merge conflicts',
          'To hide files from other developers'
        ],
        correctAnswer: 1,
        explanation: '.gitignore specifies files and folders that Git should not track or commit (like node_modules, .env files).'
      },
      {
        question: 'What is a Pull Request (PR)?',
        options: [
          'A request to download code',
          'A proposal to merge your changes into another branch',
          'A command to fetch remote changes',
          'A way to undo commits'
        ],
        correctAnswer: 1,
        explanation: 'A Pull Request is a GitHub feature that allows you to notify others about changes you\'ve pushed and request code review before merging.'
      },
      {
        question: 'What does git clone do?',
        options: [
          'Copies a remote repository to your local machine',
          'Creates a backup of your repository',
          'Duplicates a branch',
          'Makes an exact copy of a commit'
        ],
        correctAnswer: 0,
        explanation: 'git clone downloads a complete copy of a remote repository to your local machine, including all history and branches.'
      }
    ]
  },
  'week3-quiz': {
    title: 'Week 3: AWS Cloud Fundamentals Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What does AWS stand for?',
        options: [
          'Amazon Web Services',
          'Advanced Web Solutions',
          'Automated Website System',
          'Amazon Workflow Services'
        ],
        correctAnswer: 0,
        explanation: 'AWS stands for Amazon Web Services, Amazon\'s cloud computing platform.'
      },
      {
        question: 'What is EC2 in AWS?',
        options: [
          'A database service',
          'Virtual servers in the cloud',
          'A storage service',
          'A networking tool'
        ],
        correctAnswer: 1,
        explanation: 'EC2 (Elastic Compute Cloud) provides resizable virtual servers (instances) in AWS cloud.'
      },
      {
        question: 'What is S3 primarily used for?',
        options: [
          'Running applications',
          'Object storage',
          'Managing databases',
          'Load balancing'
        ],
        correctAnswer: 1,
        explanation: 'S3 (Simple Storage Service) is an object storage service for storing and retrieving any amount of data.'
      },
      {
        question: 'What is IAM in AWS?',
        options: [
          'Internet Access Manager',
          'Identity and Access Management',
          'Image Analysis Module',
          'Instance Automation Manager'
        ],
        correctAnswer: 1,
        explanation: 'IAM (Identity and Access Management) controls who can access AWS resources and what they can do.'
      },
      {
        question: 'Which AWS region code represents US East (N. Virginia)?',
        options: [
          'us-west-1',
          'us-east-1',
          'eu-west-1',
          'ap-south-1'
        ],
        correctAnswer: 1,
        explanation: 'us-east-1 is the region code for US East (N. Virginia), often the default region for AWS services.'
      },
      {
        question: 'What is the AWS Free Tier?',
        options: [
          'A programming course',
          'Free access to certain AWS services within limits',
          'A type of EC2 instance',
          'A storage class in S3'
        ],
        correctAnswer: 1,
        explanation: 'AWS Free Tier provides limited free access to AWS services for 12 months to help you explore and learn.'
      },
      {
        question: 'What is an S3 bucket?',
        options: [
          'A container for storing objects in S3',
          'A type of database',
          'A virtual server',
          'A load balancer'
        ],
        correctAnswer: 0,
        explanation: 'An S3 bucket is a container for storing objects (files) in Amazon S3. Each bucket has a unique name.'
      },
      {
        question: 'What is the purpose of AWS CloudWatch?',
        options: [
          'Video streaming',
          'Monitoring and observability',
          'Code repository',
          'DNS management'
        ],
        correctAnswer: 1,
        explanation: 'CloudWatch monitors AWS resources and applications, collecting metrics, logs, and setting alarms.'
      },
      {
        question: 'What is an AMI in AWS?',
        options: [
          'Amazon Machine Image - template for EC2 instances',
          'Automatic Memory Increment',
          'AWS Monitoring Interface',
          'Application Management Interface'
        ],
        correctAnswer: 0,
        explanation: 'An AMI (Amazon Machine Image) is a template containing the software configuration for launching EC2 instances.'
      },
      {
        question: 'What is the principle of least privilege in IAM?',
        options: [
          'Give users maximum permissions by default',
          'Grant only the minimum permissions needed',
          'Allow all users to access everything',
          'Disable all permissions'
        ],
        correctAnswer: 1,
        explanation: 'Least privilege means granting only the minimum permissions required for users to perform their tasks, improving security.'
      }
    ]
  },
  'week4-quiz': {
    title: 'Week 4: Networking & DNS Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What does DNS stand for?',
        options: [
          'Data Network System',
          'Domain Name System',
          'Digital Naming Service',
          'Distributed Network Server'
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.'
      },
      {
        question: 'What is an IP address?',
        options: [
          'A unique identifier for devices on a network',
          'A type of domain name',
          'A security protocol',
          'A web browser'
        ],
        correctAnswer: 0,
        explanation: 'An IP address is a unique numerical label assigned to each device on a network for identification and communication.'
      },
      {
        question: 'What is the difference between HTTP and HTTPS?',
        options: [
          'HTTPS is faster',
          'HTTPS is encrypted with SSL/TLS',
          'HTTP is newer',
          'They are the same'
        ],
        correctAnswer: 1,
        explanation: 'HTTPS is HTTP with encryption using SSL/TLS, securing data transmission between client and server.'
      },
      {
        question: 'What port does HTTP typically use?',
        options: [
          '21',
          '22',
          '80',
          '443'
        ],
        correctAnswer: 2,
        explanation: 'HTTP uses port 80 by default, while HTTPS uses port 443.'
      },
      {
        question: 'What is a CDN?',
        options: [
          'Content Delivery Network - distributed server network',
          'Central Database Node',
          'Cloud Domain Name',
          'Container Deployment Network'
        ],
        correctAnswer: 0,
        explanation: 'A CDN (Content Delivery Network) is a geographically distributed network of servers that deliver content to users faster.'
      },
      {
        question: 'What is Route 53 in AWS?',
        options: [
          'A highway in Virginia',
          'AWS DNS and domain registration service',
          'A type of EC2 instance',
          'A storage service'
        ],
        correctAnswer: 1,
        explanation: 'Route 53 is AWS\'s scalable DNS web service for domain registration and routing internet traffic.'
      },
      {
        question: 'What is a DNS A record?',
        options: [
          'Maps domain to IPv4 address',
          'Maps domain to email server',
          'Maps domain to another domain',
          'Maps domain to IPv6 address'
        ],
        correctAnswer: 0,
        explanation: 'An A record (Address record) maps a domain name to an IPv4 address.'
      },
      {
        question: 'What does TTL stand for in DNS?',
        options: [
          'Total Transfer Limit',
          'Time To Live - cache duration',
          'Traffic Type Label',
          'Transmission Time Log'
        ],
        correctAnswer: 1,
        explanation: 'TTL (Time To Live) specifies how long DNS records should be cached before refreshing.'
      },
      {
        question: 'What is CloudFront?',
        options: [
          'Weather forecasting service',
          'AWS CDN for content delivery',
          'Cloud storage',
          'Database service'
        ],
        correctAnswer: 1,
        explanation: 'CloudFront is AWS\'s CDN that caches content at edge locations worldwide for faster delivery.'
      },
      {
        question: 'What is the purpose of SSL/TLS certificates?',
        options: [
          'Speed up websites',
          'Encrypt data and verify identity',
          'Store passwords',
          'Manage domain names'
        ],
        correctAnswer: 1,
        explanation: 'SSL/TLS certificates encrypt data in transit and verify the identity of websites, enabling HTTPS.'
      }
    ]
  },
  'week5-quiz': {
    title: 'Week 5: Python for DevOps Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is Python primarily known for?',
        options: [
          'Being difficult to learn',
          'Readable syntax and versatility',
          'Only used for web development',
          'Fastest programming language'
        ],
        correctAnswer: 1,
        explanation: 'Python is known for its clean, readable syntax and versatility across automation, web dev, data science, and DevOps.'
      },
      {
        question: 'What does pip stand for?',
        options: [
          'Python Installation Package',
          'Pip Installs Packages',
          'Python Internet Protocol',
          'Package Integration Program'
        ],
        correctAnswer: 1,
        explanation: 'pip is a recursive acronym for "Pip Installs Packages" - Python\'s package installer.'
      },
      {
        question: 'What is a virtual environment in Python?',
        options: [
          'A cloud server',
          'Isolated Python environment for project dependencies',
          'A testing framework',
          'A type of database'
        ],
        correctAnswer: 1,
        explanation: 'A virtual environment isolates project dependencies, preventing conflicts between different projects.'
      },
      {
        question: 'What library is commonly used for HTTP requests in Python?',
        options: [
          'http-lib',
          'requests',
          'urllib3-only',
          'fetch'
        ],
        correctAnswer: 1,
        explanation: 'The "requests" library is the most popular and user-friendly library for making HTTP requests in Python.'
      },
      {
        question: 'What is boto3?',
        options: [
          'A web framework',
          'AWS SDK for Python',
          'A database driver',
          'A testing tool'
        ],
        correctAnswer: 1,
        explanation: 'boto3 is the AWS SDK for Python, allowing you to interact with AWS services programmatically.'
      },
      {
        question: 'What does JSON stand for?',
        options: [
          'JavaScript Object Notation',
          'Java Standard Object Network',
          'Just Simple Online Notation',
          'Joint System Object Name'
        ],
        correctAnswer: 0,
        explanation: 'JSON (JavaScript Object Notation) is a lightweight data interchange format commonly used in APIs.'
      },
      {
        question: 'How do you import a module in Python?',
        options: [
          'include module_name',
          'require module_name',
          'import module_name',
          'use module_name'
        ],
        correctAnswer: 2,
        explanation: 'Use "import module_name" to import modules in Python (e.g., import requests, import boto3).'
      },
      {
        question: 'What is a REST API?',
        options: [
          'A sleep function',
          'Architectural style for web services using HTTP',
          'A database type',
          'A Python framework'
        ],
        correctAnswer: 1,
        explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications using standard HTTP methods.'
      },
      {
        question: 'What HTTP method is used to retrieve data?',
        options: [
          'POST',
          'PUT',
          'GET',
          'DELETE'
        ],
        correctAnswer: 2,
        explanation: 'GET is the HTTP method used to retrieve/read data from a server.'
      },
      {
        question: 'Why is Python popular for DevOps automation?',
        options: [
          'It\'s the only scripting language',
          'Readable syntax, rich libraries, cross-platform',
          'It\'s the fastest language',
          'It requires no installation'
        ],
        correctAnswer: 1,
        explanation: 'Python is popular for DevOps due to readable syntax, extensive libraries (boto3, requests), and cross-platform compatibility.'
      }
    ]
  },
  'week6-quiz': {
    title: 'Week 6: Serverless & AWS Lambda Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is serverless computing?',
        options: [
          'Computing without any servers',
          'Cloud provider manages servers, you focus on code',
          'On-premise data centers',
          'Manual server management'
        ],
        correctAnswer: 1,
        explanation: 'Serverless means the cloud provider manages infrastructure, allowing you to focus on code without server management.'
      },
      {
        question: 'What is AWS Lambda?',
        options: [
          'A database service',
          'Serverless compute service that runs code in response to events',
          'A storage service',
          'A load balancer'
        ],
        correctAnswer: 1,
        explanation: 'AWS Lambda is a serverless compute service that runs your code in response to events without managing servers.'
      },
      {
        question: 'How is Lambda pricing calculated?',
        options: [
          'Fixed monthly fee',
          'Per server hour',
          'Number of requests and compute time',
          'Data storage only'
        ],
        correctAnswer: 2,
        explanation: 'Lambda pricing is based on the number of requests and compute time (GB-seconds) your functions consume.'
      },
      {
        question: 'What is a Lambda function trigger?',
        options: [
          'A gun mechanism',
          'Event that invokes the Lambda function',
          'A database query',
          'A server restart'
        ],
        correctAnswer: 1,
        explanation: 'A trigger is an event (like S3 upload, API call, schedule) that invokes a Lambda function.'
      },
      {
        question: 'What is DynamoDB?',
        options: [
          'A relational database',
          'NoSQL database service by AWS',
          'A caching service',
          'A file storage system'
        ],
        correctAnswer: 1,
        explanation: 'DynamoDB is a fully managed NoSQL database service that provides fast, predictable performance with seamless scalability.'
      },
      {
        question: 'What is the maximum execution time for a Lambda function?',
        options: [
          '5 seconds',
          '1 minute',
          '15 minutes',
          'Unlimited'
        ],
        correctAnswer: 2,
        explanation: 'Lambda functions can run for a maximum of 15 minutes before timing out.'
      },
      {
        question: 'What languages are supported by Lambda?',
        options: [
          'Only Python',
          'Python, Node.js, Java, Go, .NET, Ruby, and custom runtimes',
          'Only JavaScript',
          'Only compiled languages'
        ],
        correctAnswer: 1,
        explanation: 'Lambda supports multiple languages including Python, Node.js, Java, Go, Ruby, .NET, and custom runtimes.'
      },
      {
        question: 'What is cold start in Lambda?',
        options: [
          'Starting Lambda in winter',
          'Initial delay when function hasn\'t run recently',
          'Database connection error',
          'Network latency'
        ],
        correctAnswer: 1,
        explanation: 'Cold start is the latency that occurs when Lambda initializes a new execution environment for a function that hasn\'t run recently.'
      },
      {
        question: 'What is an API Gateway?',
        options: [
          'A network router',
          'Service to create, publish, and manage APIs',
          'A database interface',
          'A load balancer'
        ],
        correctAnswer: 1,
        explanation: 'API Gateway is an AWS service for creating, publishing, maintaining, and securing APIs at scale, often used with Lambda.'
      },
      {
        question: 'What is a key benefit of serverless architecture?',
        options: [
          'More servers to manage',
          'Pay only for actual compute time used',
          'Higher upfront costs',
          'Manual scaling required'
        ],
        correctAnswer: 1,
        explanation: 'Key benefits include pay-per-use pricing, automatic scaling, and no server management overhead.'
      }
    ]
  },
  'week10-quiz': {
    title: 'Week 10: CI/CD & GitHub Actions Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What does CI stand for in CI/CD?',
        options: [
          'Computer Integration',
          'Continuous Integration',
          'Code Implementation',
          'Central Infrastructure'
        ],
        correctAnswer: 1,
        explanation: 'CI stands for Continuous Integration - automatically building and testing code changes.'
      },
      {
        question: 'What is the main goal of Continuous Integration?',
        options: [
          'Deploy to production immediately',
          'Automatically build and test code on every commit',
          'Manually test everything',
          'Avoid code reviews'
        ],
        correctAnswer: 1,
        explanation: 'CI aims to automatically build and test code changes frequently to catch issues early.'
      },
      {
        question: 'What is a GitHub Actions workflow?',
        options: [
          'A type of branch',
          'Automated process defined in YAML',
          'A pull request template',
          'A repository setting'
        ],
        correctAnswer: 1,
        explanation: 'A GitHub Actions workflow is an automated process defined in YAML that runs in response to events.'
      },
      {
        question: 'Where are GitHub Actions workflows stored?',
        options: [
          '/workflows',
          '.github/workflows/',
          '/actions',
          '.git/workflows'
        ],
        correctAnswer: 1,
        explanation: 'Workflows are stored in .github/workflows/ directory as YAML files.'
      },
      {
        question: 'What triggers a GitHub Actions workflow?',
        options: [
          'Only manual triggers',
          'Events like push, pull_request, schedule, etc.',
          'Only on weekends',
          'Database updates'
        ],
        correctAnswer: 1,
        explanation: 'Workflows can be triggered by various events including push, pull_request, schedule (cron), and manual triggers.'
      },
      {
        question: 'What is a GitHub Actions runner?',
        options: [
          'A person who runs code',
          'Server that executes workflow jobs',
          'A type of workflow',
          'A deployment target'
        ],
        correctAnswer: 1,
        explanation: 'A runner is a server (GitHub-hosted or self-hosted) that executes jobs in your workflows.'
      },
      {
        question: 'What is Continuous Delivery (CD)?',
        options: [
          'Same as Continuous Integration',
          'Automatically deploying to staging, manual to production',
          'Deleting code continuously',
          'Backing up code daily'
        ],
        correctAnswer: 1,
        explanation: 'Continuous Delivery means code is automatically deployed to staging environments, with manual approval for production.'
      },
      {
        question: 'What is Continuous Deployment?',
        options: [
          'Manual deployment only',
          'Automatic deployment to production without manual approval',
          'Same as Continuous Delivery',
          'Deploying once a month'
        ],
        correctAnswer: 1,
        explanation: 'Continuous Deployment automatically deploys every change that passes tests directly to production without manual intervention.'
      },
      {
        question: 'What is a build artifact?',
        options: [
          'An ancient relic',
          'Output file from build process (e.g., compiled code, Docker image)',
          'A type of bug',
          'A git branch'
        ],
        correctAnswer: 1,
        explanation: 'A build artifact is the output of a build process, such as compiled code, packaged applications, or Docker images.'
      },
      {
        question: 'Why is automated testing important in CI/CD?',
        options: [
          'It\'s not important',
          'Catches bugs early before reaching production',
          'Slows down development',
          'Only for large teams'
        ],
        correctAnswer: 1,
        explanation: 'Automated testing in CI/CD catches bugs early, ensures code quality, and provides confidence when deploying.'
      }
    ]
  },
  'week11-quiz': {
    title: 'Week 11: Docker & Containers Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is Docker?',
        options: [
          'A type of ship',
          'Platform for developing and running containers',
          'A programming language',
          'A database'
        ],
        correctAnswer: 1,
        explanation: 'Docker is a platform that packages applications into containers for consistent deployment across environments.'
      },
      {
        question: 'What is a Docker container?',
        options: [
          'A physical box',
          'Lightweight, standalone package with app code and dependencies',
          'A virtual machine',
          'A cloud server'
        ],
        correctAnswer: 1,
        explanation: 'A container is a lightweight, standalone executable package containing everything needed to run an application.'
      },
      {
        question: 'What is the difference between an image and a container?',
        options: [
          'They are the same',
          'Image is the template, container is a running instance',
          'Image is running, container is stopped',
          'Container is bigger than image'
        ],
        correctAnswer: 1,
        explanation: 'An image is a read-only template, while a container is a running instance of that image.'
      },
      {
        question: 'What is a Dockerfile?',
        options: [
          'A file containing text documents',
          'Script with instructions to build a Docker image',
          'A configuration file for containers',
          'A log file'
        ],
        correctAnswer: 1,
        explanation: 'A Dockerfile is a text file containing instructions to build a Docker image layer by layer.'
      },
      {
        question: 'What command builds a Docker image?',
        options: [
          'docker create',
          'docker make',
          'docker build',
          'docker compile'
        ],
        correctAnswer: 2,
        explanation: 'docker build creates an image from a Dockerfile (e.g., docker build -t myapp .).'
      },
      {
        question: 'What is Docker Hub?',
        options: [
          'Docker headquarters',
          'Registry for storing and sharing Docker images',
          'A social network',
          'A monitoring tool'
        ],
        correctAnswer: 1,
        explanation: 'Docker Hub is a cloud-based registry service for sharing and storing Docker images.'
      },
      {
        question: 'What is the difference between CMD and ENTRYPOINT in Dockerfile?',
        options: [
          'They are identical',
          'CMD provides defaults, ENTRYPOINT sets main command',
          'CMD is faster',
          'ENTRYPOINT is deprecated'
        ],
        correctAnswer: 1,
        explanation: 'ENTRYPOINT sets the main command to run, while CMD provides default arguments that can be overridden.'
      },
      {
        question: 'What command runs a Docker container?',
        options: [
          'docker start',
          'docker execute',
          'docker run',
          'docker launch'
        ],
        correctAnswer: 2,
        explanation: 'docker run creates and starts a container from an image (e.g., docker run -p 8080:80 nginx).'
      },
      {
        question: 'What is the benefit of using multi-stage builds?',
        options: [
          'Slower builds',
          'Smaller final image size by excluding build tools',
          'More complex setup',
          'No benefits'
        ],
        correctAnswer: 1,
        explanation: 'Multi-stage builds create smaller production images by excluding build tools and intermediate files.'
      },
      {
        question: 'What is Docker Compose?',
        options: [
          'A music app',
          'Tool for defining multi-container applications in YAML',
          'A build tool',
          'A monitoring service'
        ],
        correctAnswer: 1,
        explanation: 'Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file.'
      }
    ]
  },
  'week12-quiz': {
    title: 'Week 12: Monitoring & Final Concepts Quiz',
    passingScore: 70,
    xpReward: 150,
    questions: [
      {
        question: 'What is monitoring in DevOps?',
        options: [
          'Watching employees work',
          'Observing system performance and health metrics',
          'Security cameras',
          'Code reviews'
        ],
        correctAnswer: 1,
        explanation: 'Monitoring involves tracking system performance, availability, and health through metrics, logs, and alerts.'
      },
      {
        question: 'What is AWS CloudWatch?',
        options: [
          'A weather service',
          'Monitoring and observability service for AWS resources',
          'A video streaming platform',
          'A database'
        ],
        correctAnswer: 1,
        explanation: 'CloudWatch monitors AWS resources and applications, collecting metrics, logs, and setting alarms.'
      },
      {
        question: 'What are the three pillars of observability?',
        options: [
          'Logs, Metrics, Traces',
          'CPU, Memory, Disk',
          'Frontend, Backend, Database',
          'Dev, Test, Prod'
        ],
        correctAnswer: 0,
        explanation: 'The three pillars of observability are Logs (events), Metrics (measurements), and Traces (request flows).'
      },
      {
        question: 'What is a CloudWatch alarm?',
        options: [
          'A loud noise',
          'Automated action triggered when metric crosses threshold',
          'A security warning',
          'A backup notification'
        ],
        correctAnswer: 1,
        explanation: 'A CloudWatch alarm monitors a metric and triggers actions (notifications, auto-scaling) when thresholds are breached.'
      },
      {
        question: 'What is Infrastructure as Code (IaC)?',
        options: [
          'Writing code on servers',
          'Managing infrastructure through code files',
          'Coding infrastructure manually',
          'Physical server documentation'
        ],
        correctAnswer: 1,
        explanation: 'IaC is the practice of managing and provisioning infrastructure through machine-readable definition files.'
      },
      {
        question: 'What is Terraform?',
        options: [
          'A container platform',
          'IaC tool for provisioning cloud infrastructure',
          'A monitoring tool',
          'A programming language'
        ],
        correctAnswer: 1,
        explanation: 'Terraform is an IaC tool that allows you to define and provision infrastructure using declarative configuration files.'
      },
      {
        question: 'What is a microservices architecture?',
        options: [
          'Very small applications',
          'Application built as collection of small, independent services',
          'Monolithic applications',
          'Embedded systems'
        ],
        correctAnswer: 1,
        explanation: 'Microservices architecture structures an application as a collection of loosely coupled, independently deployable services.'
      },
      {
        question: 'What is the purpose of log aggregation?',
        options: [
          'Delete all logs',
          'Collect logs from multiple sources into central location',
          'Compress logs',
          'Encrypt logs'
        ],
        correctAnswer: 1,
        explanation: 'Log aggregation centralizes logs from multiple services/servers for easier searching, analysis, and monitoring.'
      },
      {
        question: 'What is a dashboard in monitoring?',
        options: [
          'Car instrument panel',
          'Visual display of key metrics and system health',
          'Login page',
          'Configuration panel'
        ],
        correctAnswer: 1,
        explanation: 'A monitoring dashboard visualizes key metrics, performance data, and alerts in real-time for quick insights.'
      },
      {
        question: 'What is SRE (Site Reliability Engineering)?',
        options: [
          'Software Rewriting Exercise',
          'Discipline applying software engineering to operations',
          'Security Response Engineering',
          'System Repair Engineering'
        ],
        correctAnswer: 1,
        explanation: 'SRE is a discipline that applies software engineering practices to infrastructure and operations problems.'
      }
    ]
  }
};

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  if (!quizId || !quizData[quizId]) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Quiz not found</p>
          <button
            onClick={() => navigate('/curriculum')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Return to Curriculum
          </button>
        </div>
      </div>
    );
  }

  const quiz = quizData[quizId];

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/curriculum')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Curriculum</span>
        </button>

        <Quiz
          quizId={quizId}
          title={quiz.title}
          questions={quiz.questions}
          passingScore={quiz.passingScore}
          xpReward={quiz.xpReward}
        />
      </div>
    </div>
  );
}

/**
 * Week 3 Lesson 2 - AWS Core Services
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week3Lesson2AWSServices: LeveledLessonContent = {
  lessonId: "week3-lesson2-aws-services",

  baseLesson: {
    title: "AWS Core Services Overview",
    description:
      "Learn essential AWS services for compute, storage, networking, and databases.",
    learningObjectives: [
      "Understand EC2 for virtual servers",
      "Use S3 for object storage",
      "Configure VPC for networking",
      "Choose appropriate database services (RDS, DynamoDB)",
    ],
    prerequisites: [
      "Cloud computing concepts",
      "Basic networking understanding",
      "Linux command line skills",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25,
    },
  },

  crawl: {
    introduction:
      "Learn AWS core services step-by-step: EC2, S3, VPC, RDS, and when to use each.",
    steps: [
      {
        stepNumber: 1,
        instruction:
          "EC2 (Elastic Compute Cloud): Virtual servers in the cloud",
        command:
          "AWS Console → EC2 → Launch Instance → Choose AMI (Amazon Machine Image) → Select instance type → Configure → Launch",
        explanation:
          "EC2 = rent virtual machines. Choose OS (Amazon Linux, Ubuntu, Windows), CPU/RAM size (t2.micro, m5.large), storage. Pay per hour. Start/stop anytime.",
        expectedOutput:
          "Virtual server running in AWS. SSH access via key pair. Full control over OS and applications.",
        validationCriteria: [
          "Instance launches successfully",
          "Can SSH/RDP into server",
          "Understanding instance types (t2.micro = 1 vCPU, 1GB RAM)",
          "Know how to start/stop/terminate instances",
        ],
        commonMistakes: [
          "Leaving instances running when not needed (costs money)",
          "Choosing wrong instance type (too small = slow, too large = expensive)",
          "Not securing security groups (open to internet attacks)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "EC2 Instance Types: Choose right size for workload",
        command:
          "t2.micro: 1 vCPU, 1GB RAM (free tier, testing)\nt3.medium: 2 vCPU, 4GB RAM (small apps)\nm5.large: 2 vCPU, 8GB RAM (production web servers)\nc5.xlarge: 4 vCPU, 8GB RAM (compute-intensive)\nr5.large: 2 vCPU, 16GB RAM (memory-intensive)",
        explanation:
          "Instance families: T (burstable, low cost), M (general purpose), C (compute-optimized), R (memory-optimized). Numbers = generation (higher = newer). Size: nano < micro < small < medium < large < xlarge.",
        expectedOutput:
          "Understanding which instance type fits your workload based on CPU/memory needs.",
        validationCriteria: [
          "Know t2.micro for testing (free tier)",
          "Understand general purpose (m5) for most apps",
          "Recognize compute (c5) vs memory (r5) optimized",
          "Can estimate costs (larger = more expensive)",
        ],
        commonMistakes: [
          "Always using largest instance (waste money)",
          "Using t2.micro for production (not enough capacity)",
          "Not monitoring utilization (over/under-provisioned)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "S3 (Simple Storage Service): Object storage for files",
        command:
          "AWS Console → S3 → Create bucket → Upload files → Set permissions → Access via HTTPS URL",
        explanation:
          "S3 = unlimited file storage. Store any file type. Pay per GB stored + requests. Highly durable (11 9s). Use for backups, static websites, data lakes, logs.",
        expectedOutput:
          "S3 bucket created, files uploaded, accessible via URL or API.",
        validationCriteria: [
          "Bucket created with unique name (globally unique)",
          "Files uploaded successfully",
          "Understanding public vs private access",
          "Know S3 URL format: s3://bucket-name/key",
        ],
        commonMistakes: [
          "Making bucket public by accident (data leaks)",
          "Not using lifecycle policies (old data costs money)",
          "Forgetting bucket names are global (must be unique across all AWS)",
        ],
      },
      {
        stepNumber: 4,
        instruction:
          "S3 Storage Classes: Optimize costs based on access patterns",
        command:
          "S3 Standard: Frequent access, millisecond latency\nS3 Intelligent-Tiering: Auto-moves between tiers\nS3 Glacier: Archive, retrieval takes minutes/hours\nS3 Glacier Deep Archive: Lowest cost, 12-hour retrieval",
        explanation:
          "Trade access speed for cost. Frequently accessed = Standard. Rarely accessed = Glacier. Intelligent-Tiering auto-optimizes. Lifecycle rules move objects automatically.",
        expectedOutput:
          "Understanding: Choose storage class based on how often you access data.",
        validationCriteria: [
          "Standard for active data (highest cost)",
          "Glacier for archives (90% cheaper than Standard)",
          "Lifecycle policies automate transitions",
          "Retrieval time vs cost trade-off",
        ],
        commonMistakes: [
          "Keeping old logs in Standard (expensive)",
          "Using Glacier for frequently accessed data (slow retrieval)",
          "Not implementing lifecycle policies (manual management)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "VPC (Virtual Private Cloud): Isolated network in AWS",
        command:
          "AWS Console → VPC → Create VPC → CIDR block (10.0.0.0/16) → Create subnets (public, private) → Configure route tables → Internet Gateway",
        explanation:
          "VPC = your own private network in AWS. Define IP ranges (CIDR), create subnets, control routing. Public subnet has internet access. Private subnet isolated. Security groups = firewall.",
        expectedOutput:
          "VPC created with public and private subnets, internet gateway attached, route tables configured.",
        validationCriteria: [
          "VPC with CIDR block (e.g., 10.0.0.0/16)",
          "Public subnet (route to Internet Gateway)",
          "Private subnet (no internet route)",
          "Understanding security groups (instance-level firewall)",
        ],
        commonMistakes: [
          "Not planning CIDR ranges (IP conflicts later)",
          "Putting everything in public subnet (security risk)",
          "Misconfiguring security groups (too open or too restrictive)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Security Groups: Virtual firewalls for EC2 instances",
        command:
          "Inbound rules: Allow HTTP (port 80), HTTPS (443), SSH (22) from specific IPs\nOutbound rules: Allow all by default (can restrict)\nStateful: Return traffic automatically allowed",
        explanation:
          "Security groups control traffic to/from instances. Whitelist approach (deny all, allow specific). Specify protocol (TCP/UDP), port, source IP. Changes apply immediately.",
        expectedOutput:
          "Understanding how to configure security groups for web servers, databases, SSH access.",
        validationCriteria: [
          "Allow only necessary ports (principle of least privilege)",
          "Restrict SSH to your IP (not 0.0.0.0/0)",
          "Web servers allow 80/443 from anywhere",
          "Database instances only from app subnet",
        ],
        commonMistakes: [
          "Opening SSH to 0.0.0.0/0 (entire internet, security risk)",
          "Allowing all traffic (defeats purpose of firewall)",
          "Not using security group references (instead of IP ranges)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "RDS (Relational Database Service): Managed databases",
        command:
          "AWS Console → RDS → Create database → Choose engine (PostgreSQL, MySQL, MariaDB) → Instance class → Storage → Automated backups",
        explanation:
          "RDS = managed relational databases. AWS handles patches, backups, failover. You just use the database. Supports PostgreSQL, MySQL, MariaDB, Oracle, SQL Server. Multi-AZ for high availability.",
        expectedOutput:
          "RDS database running with automated backups, accessible from EC2 instances.",
        validationCriteria: [
          "Database engine selected",
          "Endpoint URL for connections",
          "Automated backups enabled (retention period)",
          "Multi-AZ for production (automatic failover)",
        ],
        commonMistakes: [
          "Public accessibility enabled (databases should be private)",
          "Not enabling automated backups (data loss risk)",
          "Using single-AZ for production (no failover)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "DynamoDB: Managed NoSQL database",
        command:
          "AWS Console → DynamoDB → Create table → Partition key → Optional sort key → Provisioned or On-demand capacity",
        explanation:
          "DynamoDB = fully managed NoSQL. Key-value and document store. Millisecond latency. Auto-scaling. Pay per request or reserved capacity. No servers to manage.",
        expectedOutput:
          "DynamoDB table created, can store/retrieve items via API or console.",
        validationCriteria: [
          "Table created with partition key",
          "Understanding primary key (partition + optional sort key)",
          "On-demand vs provisioned capacity",
          "Suitable for high-scale applications",
        ],
        commonMistakes: [
          "Using DynamoDB for relational data (use RDS instead)",
          "Not planning partition key properly (hot partitions)",
          "Choosing provisioned when usage is unpredictable (waste money)",
        ],
      },
      {
        stepNumber: 9,
        instruction:
          "IAM (Identity and Access Management): Control access to AWS",
        command:
          "Users: People (email/password or access keys)\nGroups: Collections of users with same permissions\nRoles: For services (EC2, Lambda) to access other AWS resources\nPolicies: JSON documents defining permissions",
        explanation:
          "IAM controls who can do what in AWS. Users for people. Roles for services. Policies define permissions (allow/deny actions on resources). Principle of least privilege.",
        expectedOutput:
          "Understanding IAM users, groups, roles, and policies for secure AWS access.",
        validationCriteria: [
          "Never use root account (create IAM users)",
          "Enable MFA (multi-factor authentication)",
          "Use roles for EC2/Lambda (not access keys)",
          "Grant minimum permissions needed",
        ],
        commonMistakes: [
          "Using root account for daily tasks (security risk)",
          "Hardcoding access keys in code (use roles)",
          "Granting admin permissions to everyone (too permissive)",
        ],
      },
      {
        stepNumber: 10,
        instruction:
          "ELB (Elastic Load Balancer): Distribute traffic across servers",
        command:
          "Application Load Balancer (ALB): HTTP/HTTPS, Layer 7\nNetwork Load Balancer (NLB): TCP/UDP, Layer 4, ultra-low latency\nClassic Load Balancer: Legacy",
        explanation:
          "Load balancers distribute traffic across multiple EC2 instances. Health checks detect failures. Auto-scaling adds/removes instances. ALB for web apps (path-based routing). NLB for high performance.",
        expectedOutput:
          "Understanding when to use ALB vs NLB, and how load balancing improves availability.",
        validationCriteria: [
          "ALB for HTTP/HTTPS applications",
          "NLB for TCP/UDP or extreme performance needs",
          "Health checks ensure traffic only to healthy instances",
          "Integrates with Auto Scaling",
        ],
        commonMistakes: [
          "Using Classic Load Balancer (deprecated, use ALB/NLB)",
          "Not configuring health checks (traffic to failed instances)",
          "Single instance behind load balancer (defeats purpose)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "CloudWatch: Monitoring and logging",
        command:
          "Metrics: CPU, disk, network for EC2, RDS, etc.\nLogs: Centralized log storage and search\nAlarms: Trigger actions when thresholds exceeded\nDashboards: Visualize metrics",
        explanation:
          "CloudWatch monitors AWS resources. Collects metrics automatically. Set alarms for high CPU, failed health checks. Store application logs. Create dashboards for visibility.",
        expectedOutput:
          "CloudWatch monitoring EC2 instances, alarms configured, logs centralized.",
        validationCriteria: [
          "Default metrics available (CPU, network)",
          "Custom metrics for application-specific data",
          "Alarms trigger SNS notifications or Auto Scaling",
          "Log groups for application logs",
        ],
        commonMistakes: [
          "Not setting alarms (miss critical issues)",
          "Ignoring CloudWatch Logs (losing application logs)",
          "No dashboards (lack of visibility)",
        ],
      },
      {
        stepNumber: 12,
        instruction: "AWS service selection: Choosing right tool for the job",
        command:
          "Compute: EC2 (VMs), Lambda (serverless functions), ECS/EKS (containers)\nStorage: S3 (objects), EBS (block storage for EC2), EFS (file storage)\nDatabase: RDS (relational), DynamoDB (NoSQL), ElastiCache (Redis/Memcached)\nNetworking: VPC, Route53 (DNS), CloudFront (CDN)",
        explanation:
          "AWS has 200+ services. Core: EC2, S3, RDS, VPC. Serverless: Lambda, DynamoDB. Containers: ECS, EKS. Choose based on workload requirements, not hype.",
        expectedOutput:
          "Ability to select appropriate AWS services for common scenarios.",
        validationCriteria: [
          "EC2 for long-running applications",
          "Lambda for event-driven, short tasks",
          "S3 for static files, backups",
          "RDS for relational data, DynamoDB for key-value",
        ],
        commonMistakes: [
          "Using Lambda for long-running processes (15-min limit)",
          "Using RDS when NoSQL better fits (scalability needs)",
          "Over-engineering with too many services",
        ],
      },
    ],
    expectedOutcome:
      "You understand AWS core services: EC2 for compute, S3 for storage, VPC for networking, RDS/DynamoDB for databases, IAM for security, ELB for load balancing, CloudWatch for monitoring. You can choose appropriate services for different workloads.",
  },

  walk: {
    introduction:
      "Practice AWS service selection through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Deploy a web application with database to AWS.",
        template:
          "Architecture:\n1. __VPC__ with public and private subnets\n2. __EC2__ instances in __AUTO_SCALING__ group\n3. __ALB__ distributes traffic across instances\n4. __RDS__ database in __PRIVATE__ subnet\n5. __S3__ for static assets (images, CSS)\n6. __CLOUDWATCH__ for monitoring",
        blanks: [
          {
            id: "VPC",
            label: "VPC",
            hint: "Isolated network",
            correctValue: "VPC",
            validationPattern: "^VPC$",
          },
          {
            id: "EC2",
            label: "EC2",
            hint: "Virtual servers",
            correctValue: "EC2",
            validationPattern: "^EC2$",
          },
          {
            id: "AUTO_SCALING",
            label: "AUTO_SCALING",
            hint: "Automatically add/remove instances",
            correctValue: "Auto Scaling",
            validationPattern: ".*(auto.*scal|ASG).*",
          },
          {
            id: "ALB",
            label: "ALB",
            hint: "Application Load Balancer",
            correctValue: "ALB",
            validationPattern: ".*(ALB|load.*balancer).*",
          },
          {
            id: "RDS",
            label: "RDS",
            hint: "Managed relational database",
            correctValue: "RDS",
            validationPattern: "^RDS$",
          },
          {
            id: "PRIVATE",
            label: "PRIVATE",
            hint: "Not internet-accessible",
            correctValue: "private",
            validationPattern: "^private$",
          },
          {
            id: "S3",
            label: "S3",
            hint: "Object storage",
            correctValue: "S3",
            validationPattern: "^S3$",
          },
          {
            id: "CLOUDWATCH",
            label: "CLOUDWATCH",
            hint: "Monitoring service",
            correctValue: "CloudWatch",
            validationPattern: ".*(CloudWatch|monitoring).*",
          },
        ],
        solution:
          "Architecture:\n1. VPC with public and private subnets\n2. EC2 instances in Auto Scaling group\n3. ALB distributes traffic across instances\n4. RDS database in private subnet\n5. S3 for static assets (images, CSS)\n6. CloudWatch for monitoring",
        explanation:
          "Standard 3-tier web app: Load balancer in public subnet, app servers in private subnet with auto-scaling, database in private subnet, static assets in S3.",
      },
      {
        exerciseNumber: 2,
        scenario: "Choose instance type for different workloads.",
        template:
          "Development/testing: __T2_MICRO__ (free tier, low cost)\nProduction web server: __M5_LARGE__ (general purpose)\nData processing: __C5_XLARGE__ (compute-optimized)\nIn-memory cache: __R5_LARGE__ (memory-optimized)",
        blanks: [
          {
            id: "T2_MICRO",
            label: "T2_MICRO",
            hint: "Free tier eligible",
            correctValue: "t2.micro",
            validationPattern: ".*(t2\\.micro|t3\\.micro).*",
          },
          {
            id: "M5_LARGE",
            label: "M5_LARGE",
            hint: "General purpose, balanced",
            correctValue: "m5.large",
            validationPattern: ".*(m5\\.large|m5\\.xlarge).*",
          },
          {
            id: "C5_XLARGE",
            label: "C5_XLARGE",
            hint: "High CPU",
            correctValue: "c5.xlarge",
            validationPattern: ".*(c5\\..*|compute).*",
          },
          {
            id: "R5_LARGE",
            label: "R5_LARGE",
            hint: "High memory",
            correctValue: "r5.large",
            validationPattern: ".*(r5\\..*|memory).*",
          },
        ],
        solution:
          "Development/testing: t2.micro (free tier, low cost)\nProduction web server: m5.large (general purpose)\nData processing: c5.xlarge (compute-optimized)\nIn-memory cache: r5.large (memory-optimized)",
        explanation:
          "Match instance type to workload: T for low-cost testing, M for general apps, C for CPU-intensive, R for memory-intensive.",
      },
      {
        exerciseNumber: 3,
        scenario: "Configure S3 storage classes for different data types.",
        template:
          "Active user uploads: __S3_STANDARD__\n30-day old backups: __INTELLIGENT_TIERING__\n1-year compliance archives: __GLACIER__\n7-year legal hold: __DEEP_ARCHIVE__\nAutomation: Use __LIFECYCLE__ policies",
        blanks: [
          {
            id: "S3_STANDARD",
            label: "S3_STANDARD",
            hint: "Frequently accessed",
            correctValue: "S3 Standard",
            validationPattern: ".*(standard|frequent).*",
          },
          {
            id: "INTELLIGENT_TIERING",
            label: "INTELLIGENT_TIERING",
            hint: "Auto-optimizes",
            correctValue: "Intelligent-Tiering",
            validationPattern: ".*(intelligent|auto).*",
          },
          {
            id: "GLACIER",
            label: "GLACIER",
            hint: "Archive storage",
            correctValue: "Glacier",
            validationPattern: ".*(glacier|archive).*",
          },
          {
            id: "DEEP_ARCHIVE",
            label: "DEEP_ARCHIVE",
            hint: "Lowest cost, longest retrieval",
            correctValue: "Glacier Deep Archive",
            validationPattern: ".*(deep.*archive).*",
          },
          {
            id: "LIFECYCLE",
            label: "LIFECYCLE",
            hint: "Automate transitions",
            correctValue: "lifecycle",
            validationPattern: ".*(lifecycle|policy).*",
          },
        ],
        solution:
          "Active user uploads: S3 Standard\n30-day old backups: Intelligent-Tiering\n1-year compliance archives: Glacier\n7-year legal hold: Glacier Deep Archive\nAutomation: Use lifecycle policies",
        explanation:
          "Match storage class to access frequency: Standard for active data, Glacier for archives, lifecycle policies automate transitions.",
      },
      {
        exerciseNumber: 4,
        scenario: "Secure VPC configuration for web application.",
        template:
          "Network setup:\n- VPC with __CIDR__ block 10.0.0.0/16\n- __PUBLIC__ subnet for load balancer (10.0.1.0/24)\n- __PRIVATE__ subnet for app servers (10.0.2.0/24)\n- __INTERNET_GATEWAY__ for public subnet\n- __NAT_GATEWAY__ for private subnet outbound access\n- Security group: Allow __80_443__ from anywhere, __22__ from your IP only",
        blanks: [
          {
            id: "CIDR",
            label: "CIDR",
            hint: "IP address range notation",
            correctValue: "CIDR",
            validationPattern: ".*(CIDR|IP.*range).*",
          },
          {
            id: "PUBLIC",
            label: "PUBLIC",
            hint: "Internet-accessible",
            correctValue: "Public",
            validationPattern: "^[Pp]ublic$",
          },
          {
            id: "PRIVATE",
            label: "PRIVATE",
            hint: "Not internet-accessible",
            correctValue: "Private",
            validationPattern: "^[Pp]rivate$",
          },
          {
            id: "INTERNET_GATEWAY",
            label: "INTERNET_GATEWAY",
            hint: "Allows internet access",
            correctValue: "Internet Gateway",
            validationPattern: ".*(internet.*gateway|IGW).*",
          },
          {
            id: "NAT_GATEWAY",
            label: "NAT_GATEWAY",
            hint: "Outbound internet for private subnet",
            correctValue: "NAT Gateway",
            validationPattern: ".*(NAT|network.*address).*",
          },
          {
            id: "80_443",
            label: "80_443",
            hint: "HTTP and HTTPS ports",
            correctValue: "80/443",
            validationPattern: ".*(80|443|HTTP).*",
          },
          {
            id: "22",
            label: "22",
            hint: "SSH port",
            correctValue: "22",
            validationPattern: ".*(22|SSH).*",
          },
        ],
        solution:
          "Network setup:\n- VPC with CIDR block 10.0.0.0/16\n- Public subnet for load balancer (10.0.1.0/24)\n- Private subnet for app servers (10.0.2.0/24)\n- Internet Gateway for public subnet\n- NAT Gateway for private subnet outbound access\n- Security group: Allow 80/443 from anywhere, 22 from your IP only",
        explanation:
          "Secure VPC: Public subnet for internet-facing resources, private subnet for app servers, restrict SSH access.",
      },
      {
        exerciseNumber: 5,
        scenario: "Choose database service for different use cases.",
        template:
          "E-commerce product catalog: __RDS_POSTGRES__ (relational, ACID)\nSession storage: __ELASTICACHE_REDIS__ (in-memory, fast)\nUser activity tracking: __DYNAMODB__ (high-scale NoSQL)\nData warehouse: __REDSHIFT__ (analytics)\nFull-text search: __ELASTICSEARCH__ (search engine)",
        blanks: [
          {
            id: "RDS_POSTGRES",
            label: "RDS_POSTGRES",
            hint: "Managed relational database",
            correctValue: "RDS PostgreSQL",
            validationPattern: ".*(RDS|PostgreSQL|relational).*",
          },
          {
            id: "ELASTICACHE_REDIS",
            label: "ELASTICACHE_REDIS",
            hint: "In-memory cache",
            correctValue: "ElastiCache Redis",
            validationPattern: ".*(ElastiCache|Redis|cache).*",
          },
          {
            id: "DYNAMODB",
            label: "DYNAMODB",
            hint: "NoSQL key-value store",
            correctValue: "DynamoDB",
            validationPattern: ".*(DynamoDB|NoSQL).*",
          },
          {
            id: "REDSHIFT",
            label: "REDSHIFT",
            hint: "Data warehouse",
            correctValue: "Redshift",
            validationPattern: ".*(Redshift|warehouse).*",
          },
          {
            id: "ELASTICSEARCH",
            label: "ELASTICSEARCH",
            hint: "Search and analytics",
            correctValue: "Elasticsearch",
            validationPattern: ".*(Elasticsearch|OpenSearch|search).*",
          },
        ],
        solution:
          "E-commerce product catalog: RDS PostgreSQL (relational, ACID)\nSession storage: ElastiCache Redis (in-memory, fast)\nUser activity tracking: DynamoDB (high-scale NoSQL)\nData warehouse: Redshift (analytics)\nFull-text search: Elasticsearch (search engine)",
        explanation:
          "Choose database based on data model and access patterns: RDS for relational, DynamoDB for NoSQL, ElastiCache for caching, Redshift for analytics.",
      },
    ],
    hints: [
      "RDS for relational data, DynamoDB for NoSQL",
      "Always use private subnets for databases",
      "S3 lifecycle policies save money on old data",
      "Security groups should follow least privilege",
    ],
  },

  runGuided: {
    objective:
      "Design complete AWS architecture for a production web application with high availability",
    conceptualGuidance: [
      "Start with VPC design: Multiple Availability Zones, public and private subnets",
      "Compute tier: EC2 instances behind Application Load Balancer, Auto Scaling group",
      "Database tier: RDS Multi-AZ for high availability, read replicas for scaling",
      "Storage: S3 for static assets with CloudFront CDN",
      "Security: IAM roles, security groups, Network ACLs",
      "Monitoring: CloudWatch alarms, dashboards, logs",
      "Backup: Automated RDS snapshots, S3 versioning",
      "Cost optimization: Reserved instances for baseline, On-Demand for peaks",
      "Disaster recovery: Multi-region strategy or backup region",
    ],
    keyConceptsToApply: [
      "High availability through multiple AZs",
      "Auto Scaling for elasticity",
      "Managed services reduce operational burden",
      "Security in depth (network, IAM, encryption)",
      "Cost optimization through right-sizing",
    ],
    checkpoints: [
      {
        checkpoint: "Architecture diagram created",
        description: "Visual representation of AWS infrastructure",
        validationCriteria: [
          "VPC with multiple Availability Zones",
          "Public subnets (ALB) and private subnets (EC2, RDS)",
          "Auto Scaling group for EC2 instances",
          "RDS Multi-AZ deployment",
          "S3 and CloudFront for static assets",
          "Security groups illustrated",
        ],
        hintIfStuck:
          "Use draw.io or Lucidchart. Show VPC boundary, subnets in 2+ AZs, ALB distributing to EC2, EC2 connecting to RDS, S3 for static files.",
      },
      {
        checkpoint: "High availability validated",
        description: "Architecture survives failures",
        validationCriteria: [
          "Deployed across 2+ Availability Zones",
          "Auto Scaling replaces failed instances",
          "RDS Multi-AZ provides database failover",
          "Load balancer health checks detect failures",
          "No single point of failure",
        ],
        hintIfStuck:
          "Ask: What if an AZ fails? What if EC2 instance crashes? What if database goes down? Architecture should handle each scenario.",
      },
      {
        checkpoint: "Security controls documented",
        description: "Security measures at every layer",
        validationCriteria: [
          "Security groups restrict traffic (app tier from ALB only, database from app only)",
          "IAM roles for EC2 (no hardcoded credentials)",
          "Database in private subnet (no public access)",
          "S3 bucket policies control access",
          "Encryption at rest and in transit",
        ],
        hintIfStuck:
          "Layer security: Network (VPC, security groups), Identity (IAM), Data (encryption). Follow least privilege principle.",
      },
    ],
    resourcesAllowed: [
      "AWS Architecture Icons (for diagrams)",
      "AWS Well-Architected Framework",
      "AWS reference architectures",
    ],
  },

  runIndependent: {
    objective:
      "Build complete AWS infrastructure documentation including architecture, cost estimate, deployment guide, and operational runbook",
    successCriteria: [
      "Architecture diagram: VPC, subnets, EC2, RDS, S3, ALB, security groups",
      "Component specifications: Instance types, database engine/size, storage capacity",
      "High availability design: Multi-AZ deployment, auto-scaling configuration, failover procedures",
      "Security architecture: Network segmentation, IAM policies, encryption strategy",
      "Cost estimate: Monthly costs for each service, total monthly/annual cost, reserved instance savings",
      "Deployment guide: Step-by-step instructions to deploy infrastructure (can be manual or IaC)",
      "Operational runbook: Monitoring setup, backup procedures, scaling policies, incident response",
      "Disaster recovery plan: Backup strategy, RTO/RPO targets, recovery procedures",
      "Performance optimization: Caching strategy, database indexing, CDN configuration",
      "Maintenance procedures: Patching schedule, database maintenance windows, log rotation",
    ],
    timeTarget: 25,
    minimumRequirements: [
      "Complete architecture diagram",
      "Cost estimate with breakdown by service",
      "Deployment guide that someone could follow",
    ],
    evaluationRubric: [
      {
        criterion: "Architecture Quality",
        weight: 30,
        passingThreshold:
          "High availability through multi-AZ. Proper network segmentation. Appropriate service selection. Security best practices followed. Scalable design.",
      },
      {
        criterion: "Completeness",
        weight: 25,
        passingThreshold:
          "All required components documented. Cost estimate thorough. Deployment guide complete. Operational procedures included. Nothing major missing.",
      },
      {
        criterion: "Production Readiness",
        weight: 25,
        passingThreshold:
          "Monitoring configured. Backups automated. Disaster recovery planned. Security controls in place. Ready to handle real traffic.",
      },
      {
        criterion: "Cost Optimization",
        weight: 20,
        passingThreshold:
          "Right-sized instances. Reserved instance strategy. S3 lifecycle policies. Auto-scaling to match demand. Cost monitoring configured.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
  documentation: [
    "https://docs.aws.amazon.com/ec2/",
    "https://docs.aws.amazon.com/s3/",
    "https://docs.aws.amazon.com/vpc/",
    "https://docs.aws.amazon.com/rds/",
    "https://aws.amazon.com/architecture/",
  ],
  relatedConcepts: [
    "AWS Well-Architected Framework",
    "Infrastructure as Code (Terraform, CloudFormation)",
    "Cost optimization strategies",
    "High availability patterns",
    "AWS networking deep dive",
    "Database migration strategies",
  ],
};

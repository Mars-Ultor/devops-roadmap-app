/**
 * Base curriculum week structures (without lessons)
 * This is separated to allow lazy loading of lesson content
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xp: number;
  tasks: string[];
  hints?: string[];
  steps?: unknown[];
  tcs?: unknown;
}

export interface Week {
  weekNumber: number;
  title: string;
  description: string;
  objectives: string[];
  lessons: LeveledLessonContent[]; // Will be populated by lazy loader
  labs: Lab[];
  project?: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
}

export const baseWeeks: Week[] = [
  {
    weekNumber: 1,
    title: "DevOps Foundations & Linux",
    description: "Master the fundamentals of DevOps culture, Linux systems, and basic tooling",
    objectives: [
      "Understand DevOps principles and culture",
      "Master Linux command line operations",
      "Learn version control with Git",
      "Set up development environments"
    ],
    lessons: [], // Populated by lazy loader
    labs: [
      {
        id: "w1-lab1",
        title: "Linux Command Line Basics",
        description: "Practice essential Linux commands for file management, process control, and system navigation",
        difficulty: "beginner",
        estimatedTime: 45,
        xp: 100,
        tasks: [
          "Navigate file system with cd, ls, pwd",
          "Create, copy, move, and delete files/directories",
          "Use file permissions and ownership commands",
          "Manage processes with ps, top, kill",
          "Use text processing tools: grep, sed, awk"
        ],
        hints: [
          "Start with 'man command' to see help for any command",
          "Use tab completion to avoid typing full paths",
          "Combine commands with pipes (|) for powerful operations"
        ]
      },
      {
        id: "w1-lab2",
        title: "Git Version Control",
        description: "Learn Git fundamentals for source code management and collaboration",
        difficulty: "beginner",
        estimatedTime: 60,
        xp: 150,
        tasks: [
          "Initialize Git repository and make first commit",
          "Create and merge feature branches",
          "Resolve merge conflicts",
          "Work with remote repositories (clone, push, pull)",
          "Use Git log and status to track changes"
        ],
        hints: [
          "Use 'git status' frequently to see repository state",
          "Commit early and often with descriptive messages",
          "Use 'git log --oneline' for a clean history view"
        ]
      }
    ]
  },
  {
    weekNumber: 2,
    title: "Scripting & Automation",
    description: "Automate tasks with Bash scripting and understand infrastructure as code principles",
    objectives: [
      "Write efficient Bash scripts",
      "Understand shell programming concepts",
      "Implement error handling and logging",
      "Create reusable automation scripts"
    ],
    lessons: [],
    labs: [
      {
        id: "w2-lab1",
        title: "Bash Scripting Fundamentals",
        description: "Create Bash scripts for system automation and task scheduling",
        difficulty: "intermediate",
        estimatedTime: 75,
        xp: 200,
        tasks: [
          "Write scripts with variables, conditionals, and loops",
          "Handle command line arguments and exit codes",
          "Implement error handling with traps",
          "Create functions and source external scripts",
          "Schedule tasks with cron"
        ]
      }
    ]
  },
  {
    weekNumber: 3,
    title: "Containerization with Docker",
    description: "Master container technology for application packaging and deployment",
    objectives: [
      "Understand container concepts and benefits",
      "Build and manage Docker images",
      "Create multi-container applications",
      "Implement container networking and volumes"
    ],
    lessons: [],
    labs: [
      {
        id: "w3-lab1",
        title: "Docker Container Management",
        description: "Build, run, and manage Docker containers for application deployment",
        difficulty: "intermediate",
        estimatedTime: 90,
        xp: 250,
        tasks: [
          "Create Dockerfiles for different application types",
          "Manage container lifecycle (run, stop, remove)",
          "Work with Docker volumes and networking",
          "Build multi-stage Docker images",
          "Use Docker Compose for multi-container apps"
        ]
      }
    ]
  },
  {
    weekNumber: 4,
    title: "CI/CD Pipelines",
    description: "Implement continuous integration and deployment workflows",
    objectives: [
      "Design CI/CD pipeline architectures",
      "Configure automated testing and deployment",
      "Implement quality gates and approvals",
      "Monitor pipeline performance and reliability"
    ],
    lessons: [],
    labs: [
      {
        id: "w4-lab1",
        title: "GitHub Actions CI/CD",
        description: "Create comprehensive CI/CD pipelines using GitHub Actions",
        difficulty: "intermediate",
        estimatedTime: 120,
        xp: 300,
        tasks: [
          "Set up automated testing workflows",
          "Configure deployment to multiple environments",
          "Implement security scanning and quality gates",
          "Create release automation and versioning",
          "Monitor pipeline metrics and performance"
        ]
      }
    ]
  },
  {
    weekNumber: 5,
    title: "Infrastructure as Code",
    description: "Manage infrastructure through code using Terraform and configuration management",
    objectives: [
      "Write infrastructure as code with Terraform",
      "Manage cloud resources programmatically",
      "Implement configuration drift detection",
      "Create reusable infrastructure modules"
    ],
    lessons: [],
    labs: [
      {
        id: "w5-lab1",
        title: "Terraform Infrastructure Management",
        description: "Provision and manage cloud infrastructure using Terraform",
        difficulty: "advanced",
        estimatedTime: 150,
        xp: 400,
        tasks: [
          "Write Terraform configurations for AWS/GCP/Azure",
          "Manage state files and locking",
          "Create reusable modules and workspaces",
          "Implement remote state and collaboration",
          "Handle infrastructure changes and rollbacks"
        ]
      }
    ]
  },
  {
    weekNumber: 6,
    title: "Cloud Platforms & Services",
    description: "Master cloud platform services and serverless architectures",
    objectives: [
      "Deploy applications to cloud platforms",
      "Configure serverless functions and APIs",
      "Implement cloud storage and databases",
      "Optimize cloud resource costs and performance"
    ],
    lessons: [],
    labs: [
      {
        id: "w6-lab1",
        title: "AWS Serverless Application",
        description: "Build and deploy a serverless application on AWS",
        difficulty: "advanced",
        estimatedTime: 180,
        xp: 500,
        tasks: [
          "Create Lambda functions and API Gateway",
          "Configure DynamoDB tables and S3 buckets",
          "Implement CloudFormation templates",
          "Set up monitoring with CloudWatch",
          "Configure CI/CD for serverless deployment"
        ]
      }
    ]
  },
  {
    weekNumber: 7,
    title: "Monitoring & Observability",
    description: "Implement comprehensive monitoring and logging solutions",
    objectives: [
      "Set up application and infrastructure monitoring",
      "Configure centralized logging",
      "Create dashboards and alerts",
      "Implement distributed tracing"
    ],
    lessons: [],
    labs: [
      {
        id: "w7-lab1",
        title: "ELK Stack Implementation",
        description: "Set up Elasticsearch, Logstash, and Kibana for log aggregation and analysis",
        difficulty: "advanced",
        estimatedTime: 200,
        xp: 600,
        tasks: [
          "Configure Elasticsearch cluster",
          "Set up Logstash for log processing",
          "Create Kibana dashboards and visualizations",
          "Implement log parsing and filtering",
          "Set up alerts and notifications"
        ]
      }
    ]
  },
  {
    weekNumber: 8,
    title: "Security & Compliance",
    description: "Implement DevSecOps practices and security automation",
    objectives: [
      "Integrate security into CI/CD pipelines",
      "Implement vulnerability scanning",
      "Configure secrets management",
      "Ensure compliance with security standards"
    ],
    lessons: [],
    labs: [
      {
        id: "w8-lab1",
        title: "DevSecOps Pipeline",
        description: "Create a secure CI/CD pipeline with automated security testing",
        difficulty: "advanced",
        estimatedTime: 220,
        xp: 700,
        tasks: [
          "Integrate SAST and DAST scanning",
          "Configure secrets management with Vault",
          "Implement compliance checks",
          "Set up security monitoring and alerting",
          "Create security testing environments"
        ]
      },
      {
        id: "w8-lab2",
        title: "Zero Trust Architecture Implementation",
        description: "Implement a comprehensive zero trust security model for cloud infrastructure",
        difficulty: "advanced",
        estimatedTime: 260,
        xp: 850,
        tasks: [
          "Configure identity and access management (IAM)",
          "Implement network segmentation and micro-segmentation",
          "Set up continuous authentication and authorization",
          "Deploy endpoint protection and detection",
          "Create security policy automation",
          "Implement data encryption at rest and in transit",
          "Configure security monitoring and incident response"
        ],
        hints: [
          "Start with identity as the new perimeter",
          "Implement least privilege access principles",
          "Use service mesh for east-west traffic security",
          "Automate security policy enforcement"
        ]
      },
      {
        id: "w8-lab3",
        title: "Compliance Automation & Audit",
        description: "Build automated compliance monitoring and audit systems for enterprise environments",
        difficulty: "advanced",
        estimatedTime: 240,
        xp: 800,
        tasks: [
          "Implement CIS, NIST, or SOC 2 compliance frameworks",
          "Create automated compliance scanning and reporting",
          "Set up continuous compliance monitoring",
          "Configure audit logging and retention policies",
          "Build compliance dashboards and alerting",
          "Implement remediation workflows",
          "Create compliance documentation automation"
        ],
        hints: [
          "Use tools like OpenSCAP or custom compliance scanners",
          "Implement compliance as code principles",
          "Set up automated evidence collection",
          "Create compliance gates in CI/CD pipelines"
        ]
      }
    ]
  },
  {
    weekNumber: 9,
    title: "Microservices & Service Mesh",
    description: "Design and deploy microservices architectures with service mesh",
    objectives: [
      "Design microservices architectures",
      "Implement service communication patterns",
      "Configure service mesh with Istio",
      "Manage distributed system complexity"
    ],
    lessons: [],
    labs: [
      {
        id: "w9-lab1",
        title: "Kubernetes Microservices",
        description: "Deploy and manage microservices on Kubernetes with Istio service mesh",
        difficulty: "advanced",
        estimatedTime: 250,
        xp: 800,
        tasks: [
          "Design microservices architecture",
          "Deploy services to Kubernetes",
          "Configure Istio service mesh",
          "Implement service discovery and load balancing",
          "Set up distributed tracing and monitoring"
        ]
      },
      {
        id: "w9-lab2",
        title: "Chaos Engineering & Resilience",
        description: "Implement chaos engineering practices to build resilient distributed systems",
        difficulty: "advanced",
        estimatedTime: 280,
        xp: 950,
        tasks: [
          "Set up chaos engineering toolkit (Chaos Mesh/Litmus)",
          "Design and execute chaos experiments",
          "Implement circuit breakers and bulkheads",
          "Create automated chaos testing in CI/CD",
          "Build system resilience metrics and monitoring",
          "Develop incident response playbooks",
          "Implement graceful degradation patterns"
        ],
        hints: [
          "Start with simple experiments (pod failures, network delays)",
          "Use the scientific method: hypothesis → experiment → analysis",
          "Implement chaos testing in staging environments first",
          "Measure system resilience with SLIs/SLOs"
        ]
      },
      {
        id: "w9-lab3",
        title: "Event-Driven Microservices",
        description: "Build event-driven architectures with message queues and streaming platforms",
        difficulty: "advanced",
        estimatedTime: 300,
        xp: 1000,
        tasks: [
          "Design event-driven architecture patterns",
          "Implement Apache Kafka or NATS messaging",
          "Create event sourcing and CQRS patterns",
          "Build event-driven microservices",
          "Implement event streaming and processing",
          "Configure message routing and filtering",
          "Set up event monitoring and debugging tools"
        ],
        hints: [
          "Use domain events to decouple services",
          "Implement event versioning and schema evolution",
          "Consider eventual consistency trade-offs",
          "Monitor event throughput and latency"
        ]
      }
    ]
  },
  {
    weekNumber: 10,
    title: "Advanced Cloud Native",
    description: "Master advanced cloud-native technologies and patterns",
    objectives: [
      "Implement advanced Kubernetes patterns",
      "Configure cloud-native storage solutions",
      "Deploy complex application architectures",
      "Optimize for cloud-native performance"
    ],
    lessons: [],
    labs: [
      {
        id: "w10-lab1",
        title: "Cloud Native Advanced Deployments",
        description: "Implement advanced deployment strategies and cloud-native patterns",
        difficulty: "advanced",
        estimatedTime: 280,
        xp: 900,
        tasks: [
          "Implement canary and blue-green deployments",
          "Configure advanced Kubernetes features",
          "Set up cloud-native storage solutions",
          "Implement auto-scaling and self-healing",
          "Optimize for cost and performance"
        ]
      },
      {
        id: "w10-lab2",
        title: "Multi-Cloud & Hybrid Cloud Architecture",
        description: "Design and implement multi-cloud and hybrid cloud architectures",
        difficulty: "advanced",
        estimatedTime: 320,
        xp: 1100,
        tasks: [
          "Design multi-cloud architecture patterns",
          "Implement cross-cloud networking and connectivity",
          "Configure hybrid cloud data synchronization",
          "Set up multi-cloud CI/CD pipelines",
          "Implement cloud-agnostic infrastructure as code",
          "Configure multi-cloud monitoring and alerting",
          "Optimize for cost across cloud providers",
          "Implement disaster recovery across clouds"
        ],
        hints: [
          "Use cloud-agnostic tools (Terraform, Kubernetes)",
          "Implement service mesh for cross-cloud communication",
          "Consider data gravity and compliance requirements",
          "Use multi-cloud for high availability and vendor lock-in avoidance"
        ]
      },
      {
        id: "w10-lab3",
        title: "Cloud-Native Databases & Storage",
        description: "Implement advanced cloud-native database and storage solutions",
        difficulty: "advanced",
        estimatedTime: 290,
        xp: 1000,
        tasks: [
          "Design cloud-native database architectures",
          "Implement database sharding and partitioning",
          "Configure cloud-native storage (S3, GCS, Azure Blob)",
          "Set up database backup and disaster recovery",
          "Implement database migration strategies",
          "Configure database monitoring and performance tuning",
          "Implement data caching and CDN strategies",
          "Set up database security and encryption"
        ],
        hints: [
          "Choose the right database for the workload (relational vs NoSQL)",
          "Implement database connection pooling",
          "Use managed database services for operational simplicity",
          "Consider data consistency and CAP theorem trade-offs"
        ]
      }
    ]
  },
  {
    weekNumber: 11,
    title: "GitOps & Platform Engineering",
    description: "Implement GitOps workflows and internal developer platforms",
    objectives: [
      "Set up GitOps with ArgoCD",
      "Create internal developer platforms",
      "Implement policy as code",
      "Automate platform operations"
    ],
    lessons: [],
    labs: [
      {
        id: "w11-lab1",
        title: "GitOps with ArgoCD",
        description: "Implement GitOps workflows for Kubernetes application management",
        difficulty: "advanced",
        estimatedTime: 300,
        xp: 1000,
        tasks: [
          "Set up ArgoCD for GitOps",
          "Create application manifests",
          "Implement deployment strategies",
          "Configure sync policies and rollbacks",
          "Set up monitoring and alerting"
        ]
      },
      {
        id: "w11-lab2",
        title: "Internal Developer Platform (IDP)",
        description: "Build an internal developer platform for self-service infrastructure and deployments",
        difficulty: "advanced",
        estimatedTime: 350,
        xp: 1200,
        tasks: [
          "Design platform architecture and user experience",
          "Implement self-service infrastructure provisioning",
          "Create golden path templates and patterns",
          "Build developer portals and documentation",
          "Implement platform monitoring and analytics",
          "Configure access controls and governance",
          "Set up cost management and optimization",
          "Create platform adoption and training programs"
        ],
        hints: [
          "Focus on developer experience and self-service",
          "Implement guardrails to ensure security and compliance",
          "Use backstage.io or custom platform solutions",
          "Measure platform adoption and developer productivity"
        ]
      },
      {
        id: "w11-lab3",
        title: "Policy as Code & Governance",
        description: "Implement policy as code for infrastructure and application governance",
        difficulty: "advanced",
        estimatedTime: 320,
        xp: 1100,
        tasks: [
          "Implement Open Policy Agent (OPA) for policy enforcement",
          "Create infrastructure and security policies",
          "Configure policy testing and validation",
          "Set up automated policy compliance checking",
          "Implement policy versioning and deployment",
          "Create policy monitoring and reporting",
          "Build policy authoring workflows",
          "Integrate policies with CI/CD pipelines"
        ],
        hints: [
          "Use Rego language for writing OPA policies",
          "Implement policy testing with conftest",
          "Start with security and compliance policies",
          "Create policy libraries for reusability"
        ]
      }
    ]
  },
  {
    weekNumber: 12,
    title: "Capstone & Career Development",
    description: "Apply all skills in a comprehensive capstone project and prepare for DevOps careers",
    objectives: [
      "Design and implement complex systems",
      "Apply DevOps best practices at scale",
      "Prepare for DevOps career opportunities",
      "Build a professional portfolio"
    ],
    lessons: [],
    labs: [
      {
        id: "w12-lab1",
        title: "DevOps Capstone Project",
        description: "Design and implement a complete DevOps solution for a complex application",
        difficulty: "advanced",
        estimatedTime: 400,
        xp: 1500,
        tasks: [
          "Design complete system architecture",
          "Implement CI/CD pipelines",
          "Configure monitoring and logging",
          "Set up security and compliance",
          "Deploy to production environment",
          "Create documentation and runbooks"
        ]
      },
      {
        id: "w12-lab2",
        title: "Production Incident Management",
        description: "Build and manage production incident response and post-mortem processes",
        difficulty: "advanced",
        estimatedTime: 280,
        xp: 1000,
        tasks: [
          "Design incident response playbooks and procedures",
          "Implement incident management tools and workflows",
          "Create automated alerting and escalation systems",
          "Build post-mortem analysis and improvement processes",
          "Implement blameless culture and learning practices",
          "Configure incident communication and coordination",
          "Set up incident metrics and reporting",
          "Create incident prevention strategies"
        ],
        hints: [
          "Follow ITIL or SRE incident management frameworks",
          "Implement automated runbooks for common incidents",
          "Focus on learning and improvement over blame",
          "Use tools like PagerDuty, OpsGenie, or custom solutions"
        ]
      },
      {
        id: "w12-lab3",
        title: "Site Reliability Engineering (SRE)",
        description: "Implement SRE practices for reliable, scalable production systems",
        difficulty: "advanced",
        estimatedTime: 350,
        xp: 1300,
        tasks: [
          "Define and implement SLIs, SLOs, and SLAs",
          "Build error budgets and reliability targets",
          "Implement automated remediation and self-healing",
          "Create capacity planning and performance optimization",
          "Set up production readiness reviews and checklists",
          "Implement gradual rollouts and feature flags",
          "Configure automated testing in production",
          "Build reliability dashboards and reporting"
        ],
        hints: [
          "Start with key user journeys for SLIs",
          "Use error budgets to balance innovation and reliability",
          "Implement progressive rollouts (canary, percentage-based)",
          "Focus on toil reduction through automation"
        ]
      },
      {
        id: "w12-lab4",
        title: "Enterprise DevOps Transformation",
        description: "Lead DevOps transformation initiatives in large enterprise environments",
        difficulty: "advanced",
        estimatedTime: 380,
        xp: 1400,
        tasks: [
          "Assess current DevOps maturity and gaps",
          "Create transformation roadmap and strategy",
          "Implement organizational change management",
          "Build cross-functional DevOps teams",
          "Establish DevOps metrics and KPIs",
          "Create training and enablement programs",
          "Implement governance and compliance frameworks",
          "Scale DevOps practices across the organization"
        ],
        hints: [
          "Focus on culture and mindset changes",
          "Start with pilot projects to demonstrate value",
          "Build internal champions and advocates",
          "Measure both technical and business outcomes"
        ]
      }
    ]
  },
  {
    weekNumber: 13,
    title: "Emerging Technologies & Future DevOps",
    description: "Explore cutting-edge technologies shaping the future of DevOps and cloud-native development",
    objectives: [
      "Master emerging DevOps technologies and patterns",
      "Implement AI/ML in DevOps workflows",
      "Explore WebAssembly and edge computing",
      "Build for the future of cloud-native development"
    ],
    lessons: [],
    labs: [
      {
        id: "w13-lab1",
        title: "AI-Powered DevOps (AIOps)",
        description: "Implement artificial intelligence and machine learning in DevOps operations",
        difficulty: "advanced",
        estimatedTime: 320,
        xp: 1200,
        tasks: [
          "Implement AI-powered monitoring and anomaly detection",
          "Create automated incident triage and diagnosis",
          "Build predictive analytics for system performance",
          "Implement ML-based capacity planning",
          "Configure automated root cause analysis",
          "Set up AI-driven release optimization",
          "Create intelligent alerting and noise reduction"
        ],
        hints: [
          "Start with log analysis and pattern recognition",
          "Use tools like Elastic ML, Prometheus with ML, or custom ML models",
          "Focus on reducing MTTR through intelligent automation",
          "Implement gradual AI adoption with human oversight"
        ]
      },
      {
        id: "w13-lab2",
        title: "WebAssembly & Edge Computing",
        description: "Build and deploy applications using WebAssembly and edge computing platforms",
        difficulty: "advanced",
        estimatedTime: 300,
        xp: 1100,
        tasks: [
          "Develop applications with WebAssembly (Wasm)",
          "Implement edge computing architectures",
          "Configure serverless edge functions",
          "Build distributed edge applications",
          "Implement edge-to-cloud synchronization",
          "Configure edge security and access controls",
          "Optimize for edge performance and latency"
        ],
        hints: [
          "Use platforms like Cloudflare Workers, Fastly Compute, or Vercel Edge",
          "Consider WebAssembly for cross-platform deployment",
          "Implement edge caching and CDN strategies",
          "Focus on data locality and privacy requirements"
        ]
      },
      {
        id: "w13-lab3",
        title: "Quantum Computing & DevOps",
        description: "Prepare DevOps practices for quantum computing and post-quantum cryptography",
        difficulty: "advanced",
        estimatedTime: 350,
        xp: 1300,
        tasks: [
          "Implement post-quantum cryptography standards",
          "Configure quantum-resistant encryption",
          "Build quantum-safe CI/CD pipelines",
          "Implement quantum computing development environments",
          "Create quantum algorithm testing frameworks",
          "Configure hybrid classical-quantum systems",
          "Set up quantum computing monitoring and metrics"
        ],
        hints: [
          "Focus on cryptography migration strategies",
          "Use NIST post-quantum cryptography standards",
          "Prepare for quantum computing as a service",
          "Consider quantum advantage for optimization problems"
        ]
      }
    ]
  }
];
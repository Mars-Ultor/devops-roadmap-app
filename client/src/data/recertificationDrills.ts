import type { RecertificationDrill, SkillDecayModel } from '../types/training';

// Skill Decay Models - How knowledge degrades over time
export const SKILL_DECAY_MODELS: Record<string, SkillDecayModel> = {
  'docker-basics': {
    skillId: 'docker-basics',
    baseRetentionRate: 0.85,
    decayRatePerDay: 0.002,
    recertificationBoost: 0.95,
    minimumCompetence: 0.7
  },
  'kubernetes-fundamentals': {
    skillId: 'kubernetes-fundamentals',
    baseRetentionRate: 0.80,
    decayRatePerDay: 0.003,
    recertificationBoost: 0.90,
    minimumCompetence: 0.65
  },
  'terraform-iac': {
    skillId: 'terraform-iac',
    baseRetentionRate: 0.75,
    decayRatePerDay: 0.004,
    recertificationBoost: 0.85,
    minimumCompetence: 0.6
  },
  'aws-services': {
    skillId: 'aws-services',
    baseRetentionRate: 0.78,
    decayRatePerDay: 0.0035,
    recertificationBoost: 0.88,
    minimumCompetence: 0.62
  },
  'monitoring-observability': {
    skillId: 'monitoring-observability',
    baseRetentionRate: 0.82,
    decayRatePerDay: 0.0028,
    recertificationBoost: 0.92,
    minimumCompetence: 0.68
  }
};

// Recertification Drills by Certification Level
export const RECERTIFICATION_DRILLS: RecertificationDrill[] = [
  // BRONZE LEVEL - Basic Knowledge Verification
  {
    id: 'recert-bronze-docker-001',
    title: 'Docker Fundamentals Recertification',
    description: 'Verify your understanding of basic Docker concepts and commands',
    category: 'deployment',
    certificationLevel: 'bronze',
    recertificationIntervalDays: 90, // Every 3 months
    timeLimitMinutes: 20,
    passingScore: 75,
    prerequisites: ['week4-completed'],
    questions: [
      {
        id: 'q1',
        question: 'Which command is used to build a Docker image?',
        type: 'multiple-choice',
        options: ['docker run', 'docker build', 'docker pull', 'docker push'],
        correctAnswer: 1,
        explanation: 'docker build is used to build an image from a Dockerfile',
        difficulty: 'basic',
        timeLimitSeconds: 30
      },
      {
        id: 'q2',
        question: 'What does the EXPOSE instruction in a Dockerfile do?',
        type: 'multiple-choice',
        options: [
          'Makes a port accessible from outside the container',
          'Documents which port the container listens on',
          'Automatically maps host ports to container ports',
          'Creates a firewall rule for the port'
        ],
        correctAnswer: 1,
        explanation: 'EXPOSE documents which ports the container listens on at runtime',
        difficulty: 'basic',
        timeLimitSeconds: 45
      },
      {
        id: 'q3',
        question: 'True or False: Docker containers are immutable once created.',
        type: 'true-false',
        correctAnswer: false,
        explanation: 'Containers can be modified, but changes are lost when the container stops. Images are immutable.',
        difficulty: 'basic',
        timeLimitSeconds: 20
      }
    ]
  },

  {
    id: 'recert-bronze-k8s-001',
    title: 'Kubernetes Basics Recertification',
    description: 'Test your knowledge of fundamental Kubernetes concepts',
    category: 'infrastructure',
    certificationLevel: 'bronze',
    recertificationIntervalDays: 90,
    timeLimitMinutes: 25,
    passingScore: 70,
    prerequisites: ['week7-completed'],
    questions: [
      {
        id: 'q1',
        question: 'What is a Kubernetes Pod?',
        type: 'multiple-choice',
        options: [
          'A storage volume for containers',
          'The smallest deployable unit in Kubernetes',
          'A networking policy for services',
          'A configuration management tool'
        ],
        correctAnswer: 1,
        explanation: 'A Pod is the smallest and simplest unit in the Kubernetes object model that you can create or deploy.',
        difficulty: 'basic',
        timeLimitSeconds: 45
      },
      {
        id: 'q2',
        question: 'Which Kubernetes object is used to expose applications running in Pods?',
        type: 'multiple-choice',
        options: ['ConfigMap', 'Secret', 'Service', 'Volume'],
        correctAnswer: 2,
        explanation: 'A Service is an abstraction that defines a logical set of Pods and a policy for accessing them.',
        difficulty: 'basic',
        timeLimitSeconds: 40
      }
    ]
  },

  // SILVER LEVEL - Intermediate Skills Assessment
  {
    id: 'recert-silver-deployment-001',
    title: 'Container Deployment Mastery',
    description: 'Advanced container deployment scenarios and troubleshooting',
    category: 'deployment',
    certificationLevel: 'silver',
    recertificationIntervalDays: 120, // Every 4 months
    timeLimitMinutes: 35,
    passingScore: 80,
    prerequisites: ['docker-basics', 'k8s-fundamentals'],
    questions: [
      {
        id: 'q1',
        question: 'You have a container that keeps restarting. Which command would you use to investigate?',
        type: 'multiple-choice',
        options: [
          'docker logs <container>',
          'docker inspect <container>',
          'docker ps -a',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All these commands are useful for troubleshooting container issues.',
        difficulty: 'intermediate',
        timeLimitSeconds: 60
      },
      {
        id: 'q2',
        question: 'What is the correct order for a blue-green deployment?',
        type: 'scenario',
        options: [
          'Deploy new version, switch traffic, decommission old',
          'Switch traffic first, then deploy new version',
          'Deploy new version, test, switch traffic',
          'Test locally, deploy, switch traffic'
        ],
        correctAnswer: 0,
        explanation: 'Blue-green deployment: deploy new version alongside old, test, switch traffic, then decommission old.',
        difficulty: 'intermediate',
        timeLimitSeconds: 90
      }
    ],
    practicalTasks: [
      {
        id: 'task1',
        description: 'Create a multi-stage Dockerfile for a Node.js application',
        commands: ['FROM node:18-alpine AS builder', 'COPY package*.json ./', 'RUN npm ci --only=production'],
        validationCriteria: [
          'Uses multi-stage build',
          'Copies package files first for better caching',
          'Uses production dependencies only in final stage'
        ],
        hints: [
          'Use AS builder for the build stage',
          'Copy package.json before source code',
          'Use --only=production for the final stage'
        ],
        timeLimitMinutes: 15
      }
    ]
  },

  {
    id: 'recert-silver-security-001',
    title: 'DevSecOps Security Practices',
    description: 'Security best practices and vulnerability assessment',
    category: 'security',
    certificationLevel: 'silver',
    recertificationIntervalDays: 120,
    timeLimitMinutes: 40,
    passingScore: 75,
    prerequisites: ['week9-completed'],
    questions: [
      {
        id: 'q1',
        question: 'Which of these is NOT a principle of the principle of least privilege?',
        type: 'multiple-choice',
        options: [
          'Grant only the minimum permissions needed',
          'Use root/admin access for all operations',
          'Regularly review and revoke unnecessary permissions',
          'Implement role-based access control'
        ],
        correctAnswer: 1,
        explanation: 'Using root/admin access for all operations violates least privilege.',
        difficulty: 'intermediate',
        timeLimitSeconds: 50
      },
      {
        id: 'q2',
        question: 'What should you do if you find a high-severity vulnerability in production?',
        type: 'scenario',
        options: [
          'Immediately patch without testing',
          'Assess impact, plan mitigation, test, deploy',
          'Ignore it until the next maintenance window',
          'Shut down the service immediately'
        ],
        correctAnswer: 1,
        explanation: 'Proper vulnerability management requires assessment, planning, testing, and controlled deployment.',
        difficulty: 'intermediate',
        timeLimitSeconds: 75
      }
    ]
  },

  // GOLD LEVEL - Advanced Expertise
  {
    id: 'recert-gold-observability-001',
    title: 'Advanced Monitoring & Observability',
    description: 'Complex monitoring scenarios and incident response',
    category: 'monitoring',
    certificationLevel: 'gold',
    recertificationIntervalDays: 180, // Every 6 months
    timeLimitMinutes: 50,
    passingScore: 85,
    prerequisites: ['monitoring-observability', 'week8-completed'],
    questions: [
      {
        id: 'q1',
        question: 'You notice increasing error rates but CPU and memory are normal. What should you investigate first?',
        type: 'multiple-choice',
        options: [
          'Database connection pool exhaustion',
          'Network latency issues',
          'Application code errors',
          'Load balancer configuration'
        ],
        correctAnswer: 0,
        explanation: 'Connection pool exhaustion often causes errors without high resource usage.',
        difficulty: 'advanced',
        timeLimitSeconds: 60
      },
      {
        id: 'q2',
        question: 'How would you implement distributed tracing in a microservices architecture?',
        type: 'scenario',
        options: [
          'Add correlation IDs to all service calls',
          'Use a tracing library like Jaeger or Zipkin',
          'Implement both correlation IDs and tracing libraries',
          'Monitor network traffic with tcpdump'
        ],
        correctAnswer: 2,
        explanation: 'Distributed tracing requires both correlation IDs and proper tracing instrumentation.',
        difficulty: 'advanced',
        timeLimitSeconds: 90
      }
    ],
    practicalTasks: [
      {
        id: 'task1',
        description: 'Create a Prometheus alerting rule for high error rates',
        commands: [
          'groups:',
          '  - name: example.rules',
          '    rules:',
          '    - alert: HighErrorRate',
          '      expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05'
        ],
        validationCriteria: [
          'Uses proper Prometheus expression syntax',
          'Calculates error rate correctly',
          'Includes appropriate time windows',
          'Has meaningful alert name'
        ],
        hints: [
          'Use rate() function for calculating rates over time',
          'Filter by status codes starting with 5',
          'Use 5m (5 minute) windows for both numerator and denominator'
        ],
        timeLimitMinutes: 20
      }
    ]
  },

  // PLATINUM LEVEL - Expert Level
  {
    id: 'recert-platinum-platform-001',
    title: 'Platform Engineering Excellence',
    description: 'Advanced platform engineering and architecture decisions',
    category: 'infrastructure',
    certificationLevel: 'platinum',
    recertificationIntervalDays: 365, // Annual recertification
    timeLimitMinutes: 60,
    passingScore: 90,
    prerequisites: ['terraform-iac', 'kubernetes-fundamentals', 'platform-engineering'],
    questions: [
      {
        id: 'q1',
        question: 'When designing a multi-region architecture, which factor is most critical for data consistency?',
        type: 'multiple-choice',
        options: [
          'Network latency between regions',
          'CAP theorem trade-offs',
          'Cost optimization',
          'Compliance requirements'
        ],
        correctAnswer: 1,
        explanation: 'CAP theorem (Consistency, Availability, Partition tolerance) is fundamental to multi-region design.',
        difficulty: 'advanced',
        timeLimitSeconds: 75
      },
      {
        id: 'q2',
        question: 'How would you implement chaos engineering in a production environment?',
        type: 'scenario',
        options: [
          'Randomly terminate instances during peak hours',
          'Start with small, controlled experiments in staging',
          'Use chaos tools only in development environments',
          'Implement without any monitoring or alerting'
        ],
        correctAnswer: 1,
        explanation: 'Chaos engineering should start small and controlled, with proper monitoring and gradual production rollout.',
        difficulty: 'advanced',
        timeLimitSeconds: 120
      }
    ]
  },

  // MASTER LEVEL - Thought Leadership
  {
    id: 'recert-master-innovation-001',
    title: 'DevOps Innovation & Leadership',
    description: 'Cutting-edge DevOps practices and organizational transformation',
    category: 'recovery',
    certificationLevel: 'master',
    recertificationIntervalDays: 365,
    timeLimitMinutes: 75,
    passingScore: 95,
    prerequisites: ['all-certifications-gold-or-higher'],
    questions: [
      {
        id: 'q1',
        question: 'How would you measure and improve DevOps culture in a large organization?',
        type: 'scenario',
        options: [
          'Track deployment frequency and lead time only',
          'Implement comprehensive metrics including psychological safety and learning culture',
          'Focus only on technical metrics, ignore human factors',
          'Conduct annual surveys without follow-up actions'
        ],
        correctAnswer: 1,
        explanation: 'DevOps culture requires measuring both technical and human factors for sustainable improvement.',
        difficulty: 'advanced',
        timeLimitSeconds: 150
      }
    ]
  }
];

// Certification Level Requirements
export const CERTIFICATION_REQUIREMENTS = {
  bronze: {
    minScore: 70,
    requiredDrills: 3,
    validityDays: 180,
    gracePeriodDays: 30
  },
  silver: {
    minScore: 75,
    requiredDrills: 5,
    validityDays: 270,
    gracePeriodDays: 45
  },
  gold: {
    minScore: 80,
    requiredDrills: 7,
    validityDays: 365,
    gracePeriodDays: 60
  },
  platinum: {
    minScore: 85,
    requiredDrills: 10,
    validityDays: 365,
    gracePeriodDays: 90
  },
  master: {
    minScore: 90,
    requiredDrills: 15,
    validityDays: 730, // 2 years
    gracePeriodDays: 180
  }
};

// Recertification Scheduling
export const RECERTIFICATION_SCHEDULES = {
  bronze: {
    intervalDays: 90,
    reminderDays: [30, 14, 7, 1],
    penaltyForLate: 'reduced_grace_period'
  },
  silver: {
    intervalDays: 120,
    reminderDays: [45, 21, 14, 7, 1],
    penaltyForLate: 'level_demotion'
  },
  gold: {
    intervalDays: 180,
    reminderDays: [60, 30, 14, 7, 1],
    penaltyForLate: 'suspension'
  },
  platinum: {
    intervalDays: 365,
    reminderDays: [90, 60, 30, 14, 7, 1],
    penaltyForLate: 'revocation'
  },
  master: {
    intervalDays: 365,
    reminderDays: [180, 90, 60, 30, 14, 7, 1],
    penaltyForLate: 'peer_review_required'
  }
};
/**
 * Scenario Challenge Templates - Military Training Methodology
 * 50+ real-world DevOps scenario challenges for application testing
 */

import type { ChallengeScenario, ChallengeProgress } from '../types/scenarios';

export const SCENARIO_CHALLENGES: ChallengeScenario[] = [
  // Week 1-4: Beginner Challenges
  {
    id: 'daily-001',
    title: 'Basic Container Deployment',
    description: 'Deploy a simple web application using Docker',
    difficulty: 'week1-4',
    type: 'daily',
    timeLimitSeconds: 600, // 10 minutes
    scenario: 'You need to deploy a basic Node.js web application. The Dockerfile is provided but the container won\'t start. Users are reporting that the application is not accessible.',
    objectives: [
      'Fix the Dockerfile configuration',
      'Build the Docker image successfully',
      'Run the container and verify it\'s accessible',
      'Check application logs for any errors'
    ],
    successCriteria: [
      'Container builds without errors',
      'Container runs and stays up',
      'Application responds on port 3000',
      'No critical errors in logs'
    ],
    hints: [
      {
        id: 'hint-001-1',
        trigger: 'time',
        triggerValue: 300,
        content: 'Check the Dockerfile for common issues like missing dependencies or wrong port exposure',
        penalty: 1.0,
        category: 'diagnostic'
      },
      {
        id: 'hint-001-2',
        trigger: 'stuck',
        triggerValue: 240,
        content: 'Look at the package.json to understand what dependencies are needed',
        penalty: 1.2,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Dockerfile Reference',
        url: 'https://docs.docker.com/engine/reference/builder/',
        available: true
      },
      {
        type: 'command',
        title: 'Docker Build Command',
        content: 'docker build -t myapp .',
        available: true
      }
    ],
    tags: ['docker', 'containers', 'deployment', 'nodejs'],
    estimatedDifficulty: 1,
    prerequisites: ['Basic Docker concepts', 'Node.js fundamentals']
  },

  {
    id: 'daily-002',
    title: 'Git Branch Management',
    description: 'Fix a messy Git repository with incorrect branch structure',
    difficulty: 'week1-4',
    type: 'daily',
    timeLimitSeconds: 480, // 8 minutes
    scenario: 'The development team has been working on multiple features simultaneously. The Git repository has become messy with incorrect branch naming, uncommitted changes, and merge conflicts. Clean up the repository structure.',
    objectives: [
      'Identify all branches and their purposes',
      'Rename incorrectly named branches',
      'Stash or commit uncommitted changes appropriately',
      'Create a clean branch structure'
    ],
    successCriteria: [
      'All branches have descriptive names',
      'No uncommitted changes in working directory',
      'Clean git status output',
      'Branch structure follows team conventions'
    ],
    hints: [
      {
        id: 'hint-002-1',
        trigger: 'request',
        content: 'Use git branch -a to see all branches, then git branch -m to rename them',
        penalty: 1.0,
        category: 'solution'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Git Branching',
        url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell',
        available: true
      }
    ],
    tags: ['git', 'version-control', 'branching'],
    estimatedDifficulty: 2,
    prerequisites: ['Basic Git commands']
  },

  {
    id: 'daily-003',
    title: 'Environment Variable Configuration',
    description: 'Fix application configuration using environment variables',
    difficulty: 'week1-4',
    type: 'daily',
    timeLimitSeconds: 420, // 7 minutes
    scenario: 'A Node.js application is failing to connect to the database. The error shows "connection refused". The application should use environment variables for configuration but they\'re not being read properly.',
    objectives: [
      'Identify the configuration issue',
      'Fix environment variable usage',
      'Test database connection',
      'Verify application functionality'
    ],
    successCriteria: [
      'Application starts without configuration errors',
      'Database connection successful',
      'Environment variables are properly loaded',
      'Application serves requests correctly'
    ],
    hints: [
      {
        id: 'hint-003-1',
        trigger: 'stuck',
        triggerValue: 180,
        content: 'Check how environment variables are accessed in Node.js (process.env.VARIABLE_NAME)',
        penalty: 1.1,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Node.js Environment Variables',
        url: 'https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs',
        available: true
      }
    ],
    tags: ['nodejs', 'environment-variables', 'configuration'],
    estimatedDifficulty: 2,
    prerequisites: ['Node.js basics', 'Environment variables']
  },

  {
    id: 'daily-003b',
    title: 'CI/CD Pipeline Debugging',
    description: 'Fix a broken CI/CD pipeline in GitHub Actions',
    difficulty: 'week1-4',
    type: 'daily',
    timeLimitSeconds: 540, // 9 minutes
    scenario: 'Your GitHub Actions workflow is failing. The build step completes successfully but the deployment step fails with permissions errors. The team needs this fixed urgently to deploy a critical hotfix.',
    objectives: [
      'Identify the failing step in the workflow',
      'Check permissions and credentials',
      'Fix the deployment configuration',
      'Verify successful pipeline execution'
    ],
    successCriteria: [
      'Pipeline runs without errors',
      'Build step succeeds',
      'Deployment completes successfully',
      'Application is accessible after deployment'
    ],
    hints: [
      {
        id: 'hint-003b-1',
        trigger: 'time',
        triggerValue: 240,
        content: 'Check the workflow secrets and ensure deployment credentials are properly configured',
        penalty: 1.1,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'GitHub Actions',
        url: 'https://docs.github.com/en/actions',
        available: true
      }
    ],
    tags: ['ci-cd', 'github-actions', 'deployment', 'automation'],
    estimatedDifficulty: 2,
    prerequisites: ['CI/CD basics', 'YAML syntax']
  },

  // Week 5-8: Intermediate Challenges
  {
    id: 'daily-004',
    title: 'Kubernetes Pod Scheduling Issue',
    description: 'Debug why pods are not being scheduled on nodes',
    difficulty: 'week5-8',
    type: 'daily',
    timeLimitSeconds: 720, // 12 minutes
    scenario: 'You deployed a web application to Kubernetes but the pods are stuck in "Pending" status. The kubectl describe pod command shows scheduling issues. Users cannot access the application.',
    objectives: [
      'Check pod scheduling status',
      'Identify resource constraints',
      'Fix node resource allocation',
      'Verify pod deployment success'
    ],
    successCriteria: [
      'Pods transition to "Running" status',
      'Application becomes accessible',
      'Resource requests are properly configured',
      'No scheduling errors in cluster'
    ],
    hints: [
      {
        id: 'hint-004-1',
        trigger: 'time',
        triggerValue: 240,
        content: 'Use kubectl describe pod <pod-name> to see detailed scheduling information',
        penalty: 1.2,
        category: 'diagnostic'
      },
      {
        id: 'hint-004-2',
        trigger: 'stuck',
        triggerValue: 300,
        content: 'Check node resources with kubectl describe node and compare with pod requests',
        penalty: 1.4,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Kubernetes Scheduling',
        url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/',
        available: true
      },
      {
        type: 'command',
        title: 'Check Pod Status',
        content: 'kubectl get pods -o wide',
        available: true
      }
    ],
    tags: ['kubernetes', 'scheduling', 'resources', 'debugging'],
    estimatedDifficulty: 3,
    prerequisites: ['Kubernetes basics', 'Pod concepts']
  },

  {    id: 'daily-004b',
    title: 'Load Balancer Configuration',
    description: 'Fix NGINX load balancer not distributing traffic correctly',
    difficulty: 'week5-8',
    type: 'daily',
    timeLimitSeconds: 600, // 10 minutes
    scenario: 'Your NGINX load balancer is sending all traffic to a single backend server instead of distributing it across 3 servers. One server is overloaded while the others sit idle.',
    objectives: [
      'Review NGINX configuration',
      'Fix load balancing algorithm',
      'Verify traffic distribution',
      'Test failover behavior'
    ],
    successCriteria: [
      'Traffic distributed across all 3 servers',
      'Load balancing algorithm working correctly',
      'Health checks configured properly',
      'Failover works when server goes down'
    ],
    hints: [
      {
        id: 'hint-004b-1',
        trigger: 'time',
        triggerValue: 300,
        content: 'Check the upstream block configuration and ensure all servers are listed with proper weights',
        penalty: 1.2,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'NGINX Load Balancing',
        url: 'https://nginx.org/en/docs/http/load_balancing.html',
        available: true
      }
    ],
    tags: ['nginx', 'load-balancing', 'networking', 'traffic-management'],
    estimatedDifficulty: 3,
    prerequisites: ['NGINX basics', 'Load balancing concepts']
  },

  {
    id: 'daily-004c',
    title: 'Database Connection Pool Tuning',
    description: 'Fix application performance issues caused by improper connection pooling',
    difficulty: 'week5-8',
    type: 'daily',
    timeLimitSeconds: 660, // 11 minutes
    scenario: 'Your application is experiencing intermittent "connection timeout" errors during peak traffic. Database CPU is at 20% but connection errors are spiking. The connection pool settings need optimization.',
    objectives: [
      'Identify connection pool configuration',
      'Analyze connection usage patterns',
      'Adjust pool size and timeouts',
      'Test under load'
    ],
    successCriteria: [
      'No connection timeout errors',
      'Optimal pool size configured',
      'Connection reuse working properly',
      'Application performance improved'
    ],
    hints: [
      {
        id: 'hint-004c-1',
        trigger: 'stuck',
        triggerValue: 300,
        content: 'Check max pool size vs concurrent connections needed. Pool too small causes timeouts.',
        penalty: 1.3,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Connection Pooling Best Practices',
        url: 'https://www.postgresql.org/docs/current/runtime-config-connection.html',
        available: true
      }
    ],
    tags: ['database', 'performance', 'connection-pooling', 'optimization'],
    estimatedDifficulty: 3,
    prerequisites: ['Database basics', 'Application architecture']
  },

  {    id: 'daily-005',
    title: 'CI/CD Pipeline Failure',
    description: 'Fix a broken Jenkins/GitHub Actions pipeline',
    difficulty: 'week5-8',
    type: 'daily',
    timeLimitSeconds: 900, // 15 minutes
    scenario: 'The CI/CD pipeline is failing during the build stage. The error log shows dependency installation issues. Recent code changes introduced new packages that aren\'t being installed correctly.',
    objectives: [
      'Analyze pipeline failure logs',
      'Identify dependency issues',
      'Fix package installation configuration',
      'Verify pipeline runs successfully'
    ],
    successCriteria: [
      'Pipeline completes all stages',
      'Dependencies install correctly',
      'Build artifacts are generated',
      'Tests pass if configured'
    ],
    hints: [
      {
        id: 'hint-005-1',
        trigger: 'request',
        content: 'Check the pipeline configuration file for dependency installation steps',
        penalty: 1.2,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'GitHub Actions Dependencies',
        url: 'https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs',
        available: true
      }
    ],
    tags: ['ci-cd', 'pipelines', 'dependencies', 'automation'],
    estimatedDifficulty: 3,
    prerequisites: ['CI/CD basics', 'Pipeline configuration']
  },

  {
    id: 'daily-005b',
    title: 'Monitoring Alert Fatigue',
    description: 'Fix noisy monitoring alerts and improve alert quality',
    difficulty: 'week5-8',
    type: 'daily',
    timeLimitSeconds: 660, // 11 minutes
    scenario: 'Your team is receiving 500+ alerts per day, most of them false positives. Critical alerts are being missed. You need to tune alert thresholds and reduce alert fatigue.',
    objectives: [
      'Analyze current alert patterns',
      'Identify false positive triggers',
      'Adjust thresholds and conditions',
      'Implement alert grouping and routing'
    ],
    successCriteria: [
      'Alerts reduced to actionable items only',
      'No false positives for critical alerts',
      'Alert severity properly classified',
      'On-call team satisfied with alert quality'
    ],
    hints: [
      {
        id: 'hint-005b-1',
        trigger: 'time',
        triggerValue: 330,
        content: 'Use statistical analysis to set thresholds based on historical patterns, not arbitrary values',
        penalty: 1.2,
        category: 'best_practice'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Alert Best Practices',
        url: 'https://prometheus.io/docs/practices/alerting/',
        available: true
      }
    ],
    tags: ['monitoring', 'alerts', 'observability', 'sre'],
    estimatedDifficulty: 3,
    prerequisites: ['Monitoring concepts', 'Prometheus/Grafana']
  },

  // Week 9-12: Advanced Challenges
  {
    id: 'daily-006',
    title: 'Production Database Outage',
    description: 'Handle a critical database outage affecting user transactions',
    difficulty: 'week5-8',
    type: 'weekly',
    timeLimitSeconds: 7200, // 2 hours
    scenario: 'CRITICAL: Production database is down. Users cannot login, place orders, or access their accounts. The database server shows high CPU usage and connection timeouts. Business impact: $50,000+ per hour in lost revenue.',
    objectives: [
      'Assess database server status and resource usage',
      'Identify root cause of high CPU and connection issues',
      'Implement immediate mitigation steps',
      'Restore database functionality',
      'Verify data integrity and application recovery',
      'Document incident and prevention measures'
    ],
    successCriteria: [
      'Database connections restored',
      'User authentication working',
      'Transaction processing functional',
      'Data integrity verified',
      'Application fully operational',
      'Incident documented with root cause analysis'
    ],
    hints: [
      {
        id: 'hint-w001-1',
        trigger: 'time',
        triggerValue: 1800,
        content: 'Start with basic database connectivity checks and resource monitoring',
        penalty: 1.3,
        category: 'diagnostic'
      },
      {
        id: 'hint-w001-2',
        trigger: 'stuck',
        triggerValue: 2700,
        content: 'Check for long-running queries, connection pool exhaustion, or resource constraints',
        penalty: 1.5,
        category: 'diagnostic'
      },
      {
        id: 'hint-w001-3',
        trigger: 'request',
        content: 'Consider database restart as last resort - focus on identifying the root cause first',
        penalty: 2.0,
        category: 'best_practice'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'PostgreSQL Troubleshooting',
        url: 'https://www.postgresql.org/docs/current/monitoring.html',
        available: true
      },
      {
        type: 'tool',
        title: 'Database Monitoring Dashboard',
        url: '/monitoring/db-dashboard',
        available: true
      },
      {
        type: 'command',
        title: 'Check Database Connections',
        content: 'SELECT count(*) FROM pg_stat_activity;',
        available: true
      }
    ],
    tags: ['database', 'outage', 'production', 'incident-response', 'postgresql'],
    estimatedDifficulty: 4,
    prerequisites: ['Database administration', 'System monitoring', 'Incident response']
  },

  // Week 9-12: Advanced Challenges
  {
    id: 'daily-006',
    title: 'Service Mesh Traffic Routing',
    description: 'Configure Istio traffic routing for canary deployment',
    difficulty: 'week9-12',
    type: 'daily',
    timeLimitSeconds: 1200, // 20 minutes
    scenario: 'You need to implement a canary deployment strategy using Istio service mesh. Route 10% of traffic to the new version while monitoring for issues. The current configuration is not working properly.',
    objectives: [
      'Configure VirtualService for traffic splitting',
      'Set up DestinationRule for subsets',
      'Apply traffic routing rules',
      'Verify traffic distribution',
      'Monitor service metrics during rollout'
    ],
    successCriteria: [
      '10% of traffic routes to canary version',
      '90% continues to stable version',
      'No traffic routing errors',
      'Metrics show proper distribution'
    ],
    hints: [
      {
        id: 'hint-006-1',
        trigger: 'time',
        triggerValue: 600,
        content: 'Create a VirtualService with HTTP route rules and weight-based routing',
        penalty: 1.4,
        category: 'solution'
      },
      {
        id: 'hint-006-2',
        trigger: 'stuck',
        triggerValue: 900,
        content: 'Ensure DestinationRule defines subsets matching your deployment labels',
        penalty: 1.6,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Istio Traffic Management',
        url: 'https://istio.io/latest/docs/concepts/traffic-management/',
        available: false // Advanced - no docs allowed
      },
      {
        type: 'command',
        title: 'Apply Istio Configuration',
        content: 'kubectl apply -f virtualservice.yaml',
        available: true
      }
    ],
    tags: ['istio', 'service-mesh', 'traffic-routing', 'canary-deployment'],
    estimatedDifficulty: 4,
    prerequisites: ['Kubernetes', 'Istio basics', 'Traffic management']
  },

  {
    id: 'daily-006b',
    title: 'Terraform State File Corruption',
    description: 'Recover from Terraform state file issues blocking deployments',
    difficulty: 'week9-12',
    type: 'daily',
    timeLimitSeconds: 900, // 15 minutes
    scenario: 'Terraform state is out of sync with actual infrastructure. Terraform apply fails with state lock errors and drift detection shows mismatches. Team cannot deploy critical infrastructure changes.',
    objectives: [
      'Diagnose state file issues',
      'Safely unlock state if needed',
      'Reconcile state with actual infrastructure',
      'Restore ability to apply changes'
    ],
    successCriteria: [
      'State lock released properly',
      'State matches actual infrastructure',
      'Terraform plan shows expected changes only',
      'Team can deploy changes again'
    ],
    hints: [
      {
        id: 'hint-006b-1',
        trigger: 'time',
        triggerValue: 450,
        content: 'Use terraform state commands to inspect and fix state issues. Consider terraform refresh.',
        penalty: 1.4,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Terraform State Management',
        url: 'https://www.terraform.io/docs/language/state/index.html',
        available: false
      }
    ],
    tags: ['terraform', 'infrastructure-as-code', 'state-management', 'iac'],
    estimatedDifficulty: 4,
    prerequisites: ['Terraform', 'IaC concepts', 'State management']
  },

  {
    id: 'daily-006c',
    title: 'Security Vulnerability Patching',
    description: 'Emergency patch deployment for critical security vulnerability',
    difficulty: 'week9-12',
    type: 'daily',
    timeLimitSeconds: 1080, // 18 minutes
    scenario: 'A critical CVE has been discovered affecting your production containers. You have 2 hours to patch all systems. Security team demands immediate action. Zero-downtime deployment required.',
    objectives: [
      'Assess vulnerability impact across services',
      'Build patched container images',
      'Deploy patches with zero downtime',
      'Verify vulnerability is resolved'
    ],
    successCriteria: [
      'All containers patched to safe versions',
      'No service downtime during rollout',
      'Vulnerability scans show no critical CVEs',
      'Rollback plan tested and ready'
    ],
    hints: [
      {
        id: 'hint-006c-1',
        trigger: 'stuck',
        triggerValue: 600,
        content: 'Use rolling deployment strategy with health checks to ensure zero downtime',
        penalty: 1.5,
        category: 'best_practice'
      }
    ],
    resources: [
      {
        type: 'tool',
        title: 'CVE Database',
        url: 'https://cve.mitre.org/',
        available: true
      }
    ],
    tags: ['security', 'patching', 'vulnerabilities', 'zero-downtime'],
    estimatedDifficulty: 4,
    prerequisites: ['Security basics', 'Container deployment', 'Rolling updates']
  },

  {
    id: 'daily-007',
    title: 'Multi-Region Failover',
    description: 'Execute emergency failover to backup region during outage',
    difficulty: 'week9-12',
    type: 'daily',
    timeLimitSeconds: 1200, // 20 minutes
    scenario: 'Primary AWS region (us-east-1) is experiencing major outage. You need to failover to backup region (us-west-2) immediately to maintain service availability. DNS, databases, and application tiers all need coordination.',
    objectives: [
      'Initiate regional failover procedure',
      'Update DNS to point to backup region',
      'Verify database replication and promote replica',
      'Validate application functionality in new region'
    ],
    successCriteria: [
      'Traffic routing to backup region',
      'Database writes working in backup region',
      'All critical services operational',
      'User impact minimized (< 5 min downtime)'
    ],
    hints: [
      {
        id: 'hint-007-1',
        trigger: 'time',
        triggerValue: 600,
        content: 'Follow the DR runbook: 1) Stop writes to primary 2) Promote replica 3) Update DNS 4) Start writes',
        penalty: 1.6,
        category: 'best_practice'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'DR Runbook',
        content: 'Emergency failover procedures and checklists',
        available: true
      }
    ],
    tags: ['disaster-recovery', 'multi-region', 'failover', 'high-availability'],
    estimatedDifficulty: 4,
    prerequisites: ['Multi-region architecture', 'DNS', 'Database replication']
  },

  {
    id: 'daily-008',
    title: 'Kubernetes Cluster Upgrade',
    description: 'Perform in-place Kubernetes cluster upgrade without downtime',
    difficulty: 'week13-16',
    type: 'daily',
    timeLimitSeconds: 1500, // 25 minutes
    scenario: 'Your Kubernetes cluster is 3 versions behind and must be upgraded to receive critical security patches. 50+ production workloads running. Zero downtime requirement. Rollback plan required.',
    objectives: [
      'Plan upgrade path and compatibility check',
      'Backup cluster state and critical data',
      'Perform rolling upgrade of nodes',
      'Verify workload compatibility and stability'
    ],
    successCriteria: [
      'Cluster upgraded to target version',
      'All workloads running without issues',
      'No service disruption during upgrade',
      'Rollback tested and documented'
    ],
    hints: [
      {
        id: 'hint-008-1',
        trigger: 'time',
        triggerValue: 750,
        content: 'Upgrade control plane first, then worker nodes one at a time with pod drain',
        penalty: 1.5,
        category: 'best_practice'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Kubernetes Upgrade Guide',
        url: 'https://kubernetes.io/docs/tasks/administer-cluster/cluster-upgrade/',
        available: false
      }
    ],
    tags: ['kubernetes', 'cluster-management', 'upgrades', 'zero-downtime'],
    estimatedDifficulty: 5,
    prerequisites: ['Kubernetes administration', 'Cluster operations']
  },

  // Weekly Boss Battles - End of week challenges
  {
    id: 'weekly-001',
    title: 'Week 1-4 Boss: Multi-Service Deployment Crisis',
    description: 'Deploy and troubleshoot a multi-container application under time pressure',
    difficulty: 'week1-4',
    type: 'weekly',
    timeLimitSeconds: 3600, // 1 hour
    scenario: 'URGENT: The development team pushed a new multi-service application to staging but it\'s completely broken. You have 1 hour to get it working before the demo to stakeholders. The application has a frontend, backend API, and database that all need to communicate.',
    objectives: [
      'Fix Docker Compose configuration for all services',
      'Establish proper networking between containers',
      'Configure environment variables correctly',
      'Debug and resolve startup failures',
      'Verify end-to-end application functionality',
      'Document the fixes for the team'
    ],
    successCriteria: [
      'All containers running without crashes',
      'Frontend can communicate with backend',
      'Backend can connect to database',
      'Application accessible via browser',
      'No errors in any service logs',
      'Configuration documented'
    ],
    hints: [
      {
        id: 'hint-w1-1',
        trigger: 'time',
        triggerValue: 1200,
        content: 'Check docker-compose.yml for network configuration and port mappings',
        penalty: 1.2,
        category: 'diagnostic'
      },
      {
        id: 'hint-w1-2',
        trigger: 'stuck',
        triggerValue: 1800,
        content: 'Use docker logs to see why services are failing. Common issues: wrong env vars, port conflicts',
        penalty: 1.4,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Docker Compose Networking',
        url: 'https://docs.docker.com/compose/networking/',
        available: true
      }
    ],
    tags: ['docker', 'docker-compose', 'multi-container', 'networking', 'troubleshooting'],
    estimatedDifficulty: 3,
    prerequisites: ['Docker basics', 'Networking fundamentals']
  },

  {
    id: 'weekly-002',
    title: 'Week 5-8 Boss: Production Database Outage',
    description: 'Handle a critical database outage affecting user transactions',
    difficulty: 'week5-8',
    type: 'weekly',
    timeLimitSeconds: 5400, // 1.5 hours
    scenario: 'CRITICAL: Production database is down. Users cannot login, place orders, or access their accounts. The database server shows high CPU usage and connection timeouts. Business impact: $50,000+ per hour in lost revenue.',
    objectives: [
      'Assess database server status and resource usage',
      'Identify root cause of high CPU and connection issues',
      'Implement immediate mitigation steps',
      'Restore database functionality',
      'Verify data integrity and application recovery',
      'Document incident and prevention measures'
    ],
    successCriteria: [
      'Database connections restored',
      'User authentication working',
      'Transaction processing functional',
      'Data integrity verified',
      'Application fully operational',
      'Incident documented with root cause analysis'
    ],
    hints: [
      {
        id: 'hint-w2-1',
        trigger: 'time',
        triggerValue: 1800,
        content: 'Start with basic database connectivity checks and resource monitoring',
        penalty: 1.3,
        category: 'diagnostic'
      },
      {
        id: 'hint-w2-2',
        trigger: 'stuck',
        triggerValue: 2700,
        content: 'Check for long-running queries, connection pool exhaustion, or resource constraints',
        penalty: 1.5,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'PostgreSQL Troubleshooting',
        url: 'https://www.postgresql.org/docs/current/monitoring.html',
        available: true
      },
      {
        type: 'tool',
        title: 'Database Monitoring Dashboard',
        url: '/monitoring/db-dashboard',
        available: true
      }
    ],
    tags: ['database', 'outage', 'production', 'incident-response', 'postgresql'],
    estimatedDifficulty: 4,
    prerequisites: ['Database administration', 'System monitoring', 'Incident response']
  },

  {
    id: 'weekly-003',
    title: 'Week 9-12 Boss: Kubernetes Cluster Crisis',
    description: 'Recover from a cascading failure in production Kubernetes cluster',
    difficulty: 'week9-12',
    type: 'weekly',
    timeLimitSeconds: 7200, // 2 hours
    scenario: 'EMERGENCY: Production Kubernetes cluster experiencing cascading failures. Multiple pods in CrashLoopBackOff, nodes becoming NotReady, and services are intermittently unavailable. Customer support is flooded with complaints. The cluster was fine 2 hours ago.',
    objectives: [
      'Perform cluster health assessment',
      'Identify the cascade trigger event',
      'Stabilize failing nodes',
      'Restore pod deployments',
      'Verify service availability',
      'Implement safeguards to prevent recurrence',
      'Create incident timeline and postmortem'
    ],
    successCriteria: [
      'All nodes in Ready state',
      'Pods running without crashes',
      'Services responding normally',
      'Resource usage within normal ranges',
      'No critical alerts firing',
      'Root cause identified and documented',
      'Prevention measures implemented'
    ],
    hints: [
      {
        id: 'hint-w3-1',
        trigger: 'time',
        triggerValue: 2400,
        content: 'Check cluster events, node status, and pod logs to find the initial failure point',
        penalty: 1.4,
        category: 'diagnostic'
      },
      {
        id: 'hint-w3-2',
        trigger: 'stuck',
        triggerValue: 3600,
        content: 'Common triggers: resource exhaustion, failed deployments, network issues, or cert expiration',
        penalty: 1.6,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Kubernetes Troubleshooting',
        url: 'https://kubernetes.io/docs/tasks/debug/',
        available: false
      },
      {
        type: 'tool',
        title: 'Cluster Monitoring',
        url: '/monitoring/k8s-dashboard',
        available: true
      }
    ],
    tags: ['kubernetes', 'cluster-management', 'incident-response', 'cascading-failure'],
    estimatedDifficulty: 5,
    prerequisites: ['Kubernetes operations', 'Cluster troubleshooting', 'System architecture']
  },

  {
    id: 'weekly-004',
    title: 'Week 13-16 Boss: Multi-Region Disaster Recovery',
    description: 'Execute complete disaster recovery across multiple cloud regions',
    difficulty: 'week13-16',
    type: 'weekly',
    timeLimitSeconds: 10800, // 3 hours
    scenario: 'DISASTER: Primary AWS region (us-east-1) has suffered complete failure - datacenter power outage with no ETA. You must execute DR procedures to failover entire production to backup region (us-west-2). This includes 50+ microservices, 10 databases, CDN, and all supporting infrastructure. Downtime currently at 15 minutes.',
    objectives: [
      'Activate disaster recovery plan',
      'Assess backup region readiness',
      'Execute database failover and promote replicas',
      'Redirect traffic to backup region (DNS, CDN)',
      'Verify all services operational in new region',
      'Validate data integrity across systems',
      'Communicate with stakeholders throughout',
      'Document DR execution and lessons learned'
    ],
    successCriteria: [
      'All services running in backup region',
      'Database writes working (replicas promoted)',
      'User traffic routed to backup region',
      'Zero data loss confirmed',
      'Total downtime under 30 minutes',
      'All monitoring and alerting functional',
      'Stakeholders updated every 15 minutes',
      'Complete DR execution report delivered'
    ],
    hints: [
      {
        id: 'hint-w4-1',
        trigger: 'time',
        triggerValue: 3600,
        content: 'Follow DR runbook: 1) Verify backups 2) Promote DB replicas 3) Update DNS 4) Validate services',
        penalty: 1.5,
        category: 'best_practice'
      },
      {
        id: 'hint-w4-2',
        trigger: 'stuck',
        triggerValue: 5400,
        content: 'Critical path: Database promotion, DNS propagation, service health checks. Parallelize where possible.',
        penalty: 1.7,
        category: 'solution'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Disaster Recovery Runbook',
        content: 'Complete DR procedures and checklists',
        available: true
      },
      {
        type: 'tool',
        title: 'Multi-Region Dashboard',
        url: '/monitoring/multi-region',
        available: true
      }
    ],
    tags: ['disaster-recovery', 'multi-region', 'failover', 'high-availability', 'incident-command'],
    estimatedDifficulty: 5,
    prerequisites: ['Multi-region architecture', 'DR procedures', 'Incident command', 'Database replication']
  },

  // Capstone Challenge
  {
    id: 'capstone-001',
    title: 'Final Capstone: Global Platform Incident',
    description: 'Handle a catastrophic production outage affecting millions of users',
    difficulty: 'week13-16',
    type: 'capstone',
    timeLimitSeconds: 14400, // 4 hours
    scenario: 'CRITICAL INCIDENT: Global production outage affecting 2M+ users. Complete service unavailability across all regions. Revenue loss: $200,000/hour. Social media blowing up with user complaints. Executive team demanding immediate updates. You are the incident commander.',
    objectives: [
      'Assemble incident response team and establish communication',
      'Perform rapid triage and impact assessment',
      'Identify root cause through systematic investigation',
      'Implement immediate containment and mitigation',
      'Execute recovery procedures with minimal data loss',
      'Verify system stability and gradual service restoration',
      'Conduct post-incident analysis and prevention planning',
      'Communicate with stakeholders throughout incident'
    ],
    successCriteria: [
      'Incident contained within 2 hours',
      'Service restoration completed within 4 hours',
      'No data loss during incident',
      'Root cause identified and documented',
      'Prevention measures implemented',
      'Stakeholder communication maintained',
      'Post-mortem report delivered'
    ],
    hints: [
      {
        id: 'hint-c001-1',
        trigger: 'time',
        triggerValue: 1800,
        content: 'Start with the incident response checklist: alert team, establish timeline, gather initial data',
        penalty: 1.5,
        category: 'best_practice'
      },
      {
        id: 'hint-c001-2',
        trigger: 'time',
        triggerValue: 3600,
        content: 'Focus on high-level symptoms first - check global load balancers, DNS, and core infrastructure',
        penalty: 1.8,
        category: 'diagnostic'
      },
      {
        id: 'hint-c001-3',
        trigger: 'stuck',
        triggerValue: 5400,
        content: 'Consider infrastructure-level issues: region failures, network outages, or configuration changes',
        penalty: 2.0,
        category: 'diagnostic'
      }
    ],
    resources: [
      {
        type: 'documentation',
        title: 'Incident Response Playbook',
        content: 'Internal incident response procedures and checklists',
        available: true
      },
      {
        type: 'tool',
        title: 'Global Monitoring Dashboard',
        url: '/monitoring/global-dashboard',
        available: true
      },
      {
        type: 'tool',
        title: 'Incident Management System',
        url: '/incidents/create',
        available: true
      }
    ],
    tags: ['incident-response', 'production', 'global-outage', 'leadership', 'communication'],
    estimatedDifficulty: 5,
    prerequisites: ['All DevOps concepts', 'Incident management', 'Leadership experience']
  }
];

// Helper functions for scenario management
export function getScenariosByDifficulty(difficulty: ChallengeScenario['difficulty']): ChallengeScenario[] {
  return SCENARIO_CHALLENGES.filter(scenario => scenario.difficulty === difficulty);
}

export function getScenariosByType(type: ChallengeScenario['type']): ChallengeScenario[] {
  return SCENARIO_CHALLENGES.filter(scenario => scenario.type === type);
}

export function getScenarioById(id: string): ChallengeScenario | undefined {
  return SCENARIO_CHALLENGES.find(scenario => scenario.id === id);
}

export function getRecommendedScenarios(userProgress: ChallengeProgress): ChallengeScenario[] {
  // Simple recommendation logic based on user performance
  const userStrengths = new Set(userProgress.strengths);
  const userWeaknesses = new Set(userProgress.weaknesses);

  return SCENARIO_CHALLENGES.filter(scenario => {
    // Recommend scenarios that match weaknesses or build on strengths
    const scenarioTags = new Set(scenario.tags);
    const hasWeaknessTag = [...scenarioTags].some(tag => userWeaknesses.has(tag));
    const hasStrengthTag = [...scenarioTags].some(tag => userStrengths.has(tag));

    return hasWeaknessTag || (hasStrengthTag && scenario.estimatedDifficulty <= 3);
  }).slice(0, 5); // Return top 5 recommendations
}
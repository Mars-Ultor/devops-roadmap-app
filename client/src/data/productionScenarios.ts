/**
 * Real Production Scenarios Library
 * Based on common DevOps incidents
 */

import type { ProductionScenario } from "../types/scenarios";

export const PRODUCTION_SCENARIOS: ProductionScenario[] = [
  // BEGINNER: Docker deployment failure
  {
    id: "docker-port-conflict",
    title: "Docker Container Won't Start - Port Conflict",
    category: "deployment-failure",
    difficulty: "beginner",

    description:
      "Your Node.js API container fails to start after deployment. The previous version is still running.",
    businessImpact:
      "New features cannot be deployed. Development team blocked.",
    affectedUsers: 0,

    symptoms: [
      {
        type: "log",
        severity: "error",
        description:
          "Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use",
        source: "docker",
      },
      {
        type: "alert",
        severity: "error",
        description: "Container api-v2 failed to start",
        source: "docker-daemon",
      },
    ],

    investigationSteps: [
      {
        id: "check-running-containers",
        description: "Check what containers are currently running",
        command: "docker ps",
        expectedFindings: ["Old api-v1 container still running on port 3000"],
        hints: [
          "Use docker ps to see running containers",
          "Look for containers using port 3000",
        ],
        timeEstimate: 30,
      },
      {
        id: "check-port-usage",
        description: "Verify which process is using port 3000",
        command: "netstat -ano | findstr :3000",
        expectedFindings: ["Port 3000 is bound by existing Docker container"],
        hints: ["Check network connections", "Find process ID using the port"],
        timeEstimate: 45,
      },
    ],

    rootCause: {
      id: "old-container-not-stopped",
      description:
        "Previous version of the container was not stopped before deploying the new version",
      category: "deployment-failure",
      impact: "medium",
    },

    resolutionSteps: [
      {
        id: "stop-old-container",
        description: "Stop the old container",
        command: "docker stop api-v1",
        validation: "docker ps should not show api-v1",
        canRollback: true,
        estimatedTime: 10,
      },
      {
        id: "remove-old-container",
        description: "Remove the stopped container",
        command: "docker rm api-v1",
        validation: "docker ps -a should not show api-v1",
        canRollback: false,
        estimatedTime: 10,
      },
      {
        id: "start-new-container",
        description: "Start the new container",
        command: "docker run -d -p 3000:3000 --name api-v2 myapi:v2",
        validation: "curl http://localhost:3000/health returns 200",
        canRollback: true,
        estimatedTime: 20,
      },
    ],

    preventionMeasures: [
      "Always stop old containers before starting new ones",
      "Use docker-compose for managing multi-container deployments",
      "Implement blue-green deployment strategy",
      "Add pre-deployment health checks to CI/CD pipeline",
    ],

    estimatedTimeToResolve: 5,
    prerequisiteKnowledge: [
      "Docker basics",
      "Port binding",
      "Container lifecycle",
    ],
    learningObjectives: [
      "Diagnose Docker port conflicts",
      "Safely stop and remove containers",
      "Implement proper deployment sequences",
    ],

    maxScore: 100,
    timeBonus: true,
    completionCriteria: [
      "Old container stopped",
      "New container running",
      "Service health check passing",
    ],
  },

  // INTERMEDIATE: Database connection pool exhaustion
  {
    id: "db-connection-leak",
    title: "API Slowdown - Database Connection Leak",
    category: "performance-degradation",
    difficulty: "intermediate",

    description:
      "API response times have increased from 200ms to 5+ seconds. Users reporting timeouts.",
    businessImpact:
      "Customer experience severely degraded. Potential revenue loss.",
    affectedUsers: 5000,
    revenueImpact: 500,

    symptoms: [
      {
        type: "metric",
        severity: "critical",
        description: "API response time: 5000ms (baseline: 200ms)",
        source: "monitoring",
      },
      {
        type: "log",
        severity: "error",
        description: "TimeoutError: Connection pool exhausted",
        source: "api-server",
        timestamp: "2025-12-06T14:23:15Z",
      },
      {
        type: "user-report",
        severity: "critical",
        description: 'Multiple users reporting "Request timeout" errors',
        source: "support-tickets",
      },
      {
        type: "metric",
        severity: "warning",
        description: "Database connection pool: 100/100 (max capacity)",
        source: "database",
      },
    ],

    investigationSteps: [
      {
        id: "check-db-connections",
        description: "Check current database connection count",
        command: "SELECT count(*) FROM pg_stat_activity;",
        expectedFindings: [
          "Connection count at maximum (100)",
          "Many idle connections",
        ],
        hints: [
          "Query the database connection pool status",
          "Look for idle or long-running connections",
          "Check if connections are being released",
        ],
        timeEstimate: 60,
      },
      {
        id: "review-api-logs",
        description: "Review API server logs for connection errors",
        command: 'grep "Connection" /var/log/api/server.log | tail -100',
        expectedFindings: [
          "Connection pool exhausted errors",
          "No connection release logs",
        ],
        hints: [
          "Search for database-related errors",
          "Look for patterns in error timing",
          "Check if connections are timing out",
        ],
        timeEstimate: 90,
      },
      {
        id: "analyze-code-deployment",
        description: "Check recent code deployments",
        command: 'git log --oneline --since="24 hours ago"',
        expectedFindings: ["Recent deployment changed database query logic"],
        hints: [
          "Review recent changes to database code",
          "Look for missing connection.close() calls",
          "Check for new database queries",
        ],
        timeEstimate: 120,
      },
    ],

    rootCause: {
      id: "missing-connection-release",
      description:
        "Recent code deployment introduced database queries that don't release connections back to the pool",
      category: "performance-degradation",
      impact: "critical",
    },

    resolutionSteps: [
      {
        id: "immediate-restart",
        description:
          "Restart API servers to clear connection pool (temporary fix)",
        command: "kubectl rollout restart deployment/api-server",
        validation: "API response times return to normal",
        canRollback: true,
        estimatedTime: 120,
      },
      {
        id: "rollback-deployment",
        description: "Rollback to previous working version",
        command: "kubectl rollout undo deployment/api-server",
        validation: "Connection pool usage drops below 50%",
        canRollback: true,
        estimatedTime: 180,
      },
      {
        id: "fix-code",
        description: "Fix code to properly release database connections",
        validation: "Code review confirms all queries use connection.release()",
        canRollback: false,
        estimatedTime: 600,
      },
      {
        id: "deploy-fix",
        description: "Deploy fixed version with proper connection handling",
        command: "kubectl apply -f deployment.yaml",
        validation:
          "Monitor connection pool for 30 minutes - should stay under 30%",
        canRollback: true,
        estimatedTime: 300,
      },
    ],

    preventionMeasures: [
      "Implement connection pool monitoring alerts",
      "Add connection leak detection to load tests",
      "Use ORM with automatic connection management",
      "Set connection timeout limits",
      "Code review checklist: verify connection cleanup",
    ],

    estimatedTimeToResolve: 20,
    prerequisiteKnowledge: [
      "Database connection pooling",
      "Application performance monitoring",
      "Kubernetes deployments",
      "Code debugging",
    ],
    learningObjectives: [
      "Diagnose resource exhaustion issues",
      "Implement quick vs permanent fixes",
      "Analyze application logs for patterns",
      "Perform safe rollbacks under pressure",
    ],
    realWorldExample: "Similar to GitHub's 2018 connection pool incident",

    maxScore: 200,
    timeBonus: true,
    completionCriteria: [
      "Service restored to normal performance",
      "Root cause identified",
      "Permanent fix deployed",
      "Monitoring added to prevent recurrence",
    ],
  },

  // ADVANCED: Kubernetes pod crash loop
  {
    id: "k8s-crashloop-memory",
    title: "Production Outage - Kubernetes Pod Crash Loop",
    category: "service-outage",
    difficulty: "advanced",

    description:
      "Payment processing service pods are crash looping. All payment transactions failing.",
    businessImpact: "Complete payment processing outage. Revenue stopped.",
    affectedUsers: 50000,
    revenueImpact: 10000,

    symptoms: [
      {
        type: "alert",
        severity: "critical",
        description: "Pod payment-service-7d9c8-xyz in CrashLoopBackOff",
        source: "kubernetes",
        timestamp: "2025-12-06T15:10:23Z",
      },
      {
        type: "log",
        severity: "error",
        description: "OOMKilled: Container exceeded memory limit (512Mi)",
        source: "kubelet",
      },
      {
        type: "metric",
        severity: "critical",
        description: "Payment success rate: 0% (baseline: 99.9%)",
        source: "datadog",
      },
      {
        type: "user-report",
        severity: "critical",
        description:
          "Customers cannot complete purchases. Shopping carts abandoned.",
        source: "support",
      },
    ],

    investigationSteps: [
      {
        id: "check-pod-status",
        description: "Check pod status and recent events",
        command:
          "kubectl get pods -n production | grep payment-service; kubectl describe pod <pod-name> -n production",
        expectedFindings: [
          "CrashLoopBackOff state",
          "OOMKilled exit code",
          "Memory limit: 512Mi",
        ],
        hints: [
          "Check pod status in Kubernetes",
          "Look at pod events and exit codes",
          "Review resource limits",
        ],
        timeEstimate: 60,
      },
      {
        id: "check-pod-logs",
        description: "Examine pod logs before crash",
        command: "kubectl logs <pod-name> -n production --previous",
        expectedFindings: [
          "Memory usage climbing",
          "Large data processing job",
          "No cleanup of objects",
        ],
        hints: [
          "Use --previous flag to see logs from crashed container",
          "Look for memory warnings",
          "Check what operation was running when crash occurred",
        ],
        timeEstimate: 90,
      },
      {
        id: "check-resource-usage",
        description: "Review historical resource metrics",
        command: "kubectl top pod <pod-name> -n production",
        expectedFindings: [
          "Memory usage consistently near limit",
          "Trending upward before crash",
        ],
        hints: [
          "Check current resource consumption",
          "Look at resource trends over time",
          "Compare to resource limits",
        ],
        timeEstimate: 120,
      },
      {
        id: "review-recent-changes",
        description: "Check recent deployments and config changes",
        command:
          "kubectl rollout history deployment/payment-service -n production",
        expectedFindings: [
          "New version deployed 2 hours ago",
          "Added batch processing feature",
        ],
        hints: [
          "Review deployment history",
          "Check what changed recently",
          "Look at git commits for new features",
        ],
        timeEstimate: 180,
      },
    ],

    rootCause: {
      id: "memory-limit-too-low",
      description:
        "New batch processing feature requires more memory than allocated. Memory limit (512Mi) insufficient for current workload.",
      category: "resource-exhaustion",
      impact: "critical",
    },

    resolutionSteps: [
      {
        id: "increase-memory-limit",
        description: "Temporarily increase memory limit to 2Gi",
        command:
          "kubectl set resources deployment payment-service --limits=memory=2Gi -n production",
        validation: "Pods restart successfully and stay running",
        canRollback: true,
        estimatedTime: 120,
      },
      {
        id: "verify-service-health",
        description: "Verify payment service is processing transactions",
        command: "curl https://api.company.com/health/payment",
        validation: "Health check returns 200 OK",
        canRollback: false,
        estimatedTime: 60,
      },
      {
        id: "optimize-batch-processing",
        description: "Optimize batch processing to use less memory",
        validation:
          "Code review confirms streaming approach instead of loading all data",
        canRollback: false,
        estimatedTime: 1800,
      },
      {
        id: "right-size-resources",
        description: "Set appropriate memory limits based on actual usage",
        command:
          "kubectl set resources deployment payment-service --limits=memory=1Gi --requests=memory=768Mi",
        validation: "Memory usage stays under 80% of limit",
        canRollback: true,
        estimatedTime: 300,
      },
      {
        id: "add-monitoring",
        description: "Add memory usage alerts",
        validation: "Alert fires when memory usage exceeds 80%",
        canRollback: false,
        estimatedTime: 600,
      },
    ],

    preventionMeasures: [
      "Load test new features before production deployment",
      "Set up resource usage alerts (CPU, memory)",
      "Implement horizontal pod autoscaling",
      "Use memory profiling in staging environment",
      "Establish resource request/limit guidelines",
      "Monitor memory trends over time",
    ],

    estimatedTimeToResolve: 30,
    prerequisiteKnowledge: [
      "Kubernetes resource management",
      "Container memory limits",
      "Log analysis",
      "Performance troubleshooting",
    ],
    learningObjectives: [
      "Diagnose Kubernetes pod failures",
      "Interpret OOMKilled errors",
      "Balance quick fixes vs permanent solutions",
      "Right-size container resources",
      "Implement production monitoring",
    ],
    realWorldExample: "Similar to Slack's 2020 memory leak incident",

    maxScore: 300,
    timeBonus: true,
    completionCriteria: [
      "Service restored to full functionality",
      "Root cause identified and documented",
      "Permanent fix implemented",
      "Prevention measures in place",
      "Post-incident review completed",
    ],
  },
];

export function getScenariosByDifficulty(
  difficulty: string,
): ProductionScenario[] {
  return PRODUCTION_SCENARIOS.filter((s) => s.difficulty === difficulty);
}

export function getScenariosByCategory(category: string): ProductionScenario[] {
  return PRODUCTION_SCENARIOS.filter((s) => s.category === category);
}

export function getScenarioById(id: string): ProductionScenario | undefined {
  return PRODUCTION_SCENARIOS.find((s) => s.id === id);
}

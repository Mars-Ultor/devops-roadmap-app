/**
 * TCS Lab Examples - Military-Style Lab Definitions
 * Phase 11: Task-Conditions-Standards Format
 *
 * These examples demonstrate proper TCS structure for different difficulty levels
 */

import type { TCSTask } from "../components/training/TCSDisplay";

/**
 * EXAMPLE 1: Beginner Level - Docker Basics
 * Full support with hints and step-by-step guidance
 */
export const DOCKER_BASICS_TCS: TCSTask = {
  task: "Deploy and manage containerized applications using Docker, demonstrating proficiency in image building, container lifecycle management, and basic networking.",

  conditions: {
    timeLimit: 45,
    environment:
      "Linux system with Docker Engine 20.10+ installed and Docker daemon running",
    resources: [
      "Docker CLI with full access",
      "Dockerfile templates and examples",
      "Official Docker documentation",
      "Step-by-step hints available after 30-minute struggle period",
      "Sample application code provided",
      "Internet access for pulling images from Docker Hub",
    ],
    restrictions: [
      "No graphical Docker Desktop interface - CLI only",
      "Must build custom images, not just pull pre-built ones",
      "No copying Dockerfiles without understanding each line",
      "Must demonstrate understanding of each layer in image",
    ],
  },

  standards: [
    {
      id: "std-1",
      description:
        "Create valid Dockerfile with FROM, COPY, RUN, EXPOSE, and CMD instructions",
      required: true,
      met: false,
    },
    {
      id: "std-2",
      description: "Build Docker image successfully with no build errors",
      required: true,
      met: false,
    },
    {
      id: "std-3",
      description:
        "Run container from built image and verify it starts without errors",
      required: true,
      met: false,
    },
    {
      id: "std-4",
      description: "Expose port correctly and verify application is accessible",
      required: true,
      met: false,
    },
    {
      id: "std-5",
      description:
        "Stop and remove container cleanly, verify removal with docker ps -a",
      required: true,
      met: false,
    },
    {
      id: "std-6",
      description:
        "List images and demonstrate image size awareness (< 500MB for simple apps)",
      required: false,
      met: false,
    },
  ],
};

/**
 * EXAMPLE 2: Intermediate Level - Kubernetes Deployment
 * Reduced support, requires more independent thinking
 */
export const K8S_DEPLOYMENT_TCS: TCSTask = {
  task: "Deploy a multi-container application to Kubernetes using Deployments, Services, and ConfigMaps, ensuring high availability and proper resource management.",

  conditions: {
    timeLimit: 60,
    environment:
      "Kubernetes cluster (minikube, kind, or cloud provider) with kubectl configured",
    resources: [
      "kubectl CLI with cluster admin access",
      "YAML manifest templates (basic structure only)",
      "Kubernetes official documentation",
      "Conceptual hints available after struggle documentation",
      "Cluster with minimum 2 worker nodes",
    ],
    restrictions: [
      "No GUI dashboards - kubectl CLI only",
      "Must write YAML manifests from scratch (no copy/paste)",
      "No Helm charts - raw Kubernetes manifests only",
      "Must demonstrate understanding of pod scheduling and resource requests",
      "No direct pod creation - must use Deployments",
    ],
  },

  standards: [
    {
      id: "std-1",
      description:
        "Create Deployment manifest with minimum 3 replicas and valid selector",
      required: true,
      met: false,
    },
    {
      id: "std-2",
      description:
        "Set resource requests (CPU: 100m, Memory: 128Mi) and limits on containers",
      required: true,
      met: false,
    },
    {
      id: "std-3",
      description:
        "Create Service of type LoadBalancer or NodePort to expose application",
      required: true,
      met: false,
    },
    {
      id: "std-4",
      description:
        "Create ConfigMap for application configuration and mount in deployment",
      required: true,
      met: false,
    },
    {
      id: "std-5",
      description:
        "Verify all 3 replicas are running and distributed across nodes",
      required: true,
      met: false,
    },
    {
      id: "std-6",
      description:
        "Demonstrate rolling update: change image version, verify zero-downtime deployment",
      required: true,
      met: false,
    },
    {
      id: "std-7",
      description:
        "Application accessible via Service, responds to HTTP requests",
      required: true,
      met: false,
    },
    {
      id: "std-8",
      description:
        "Clean up all resources (deployment, service, configmap) successfully",
      required: true,
      met: false,
    },
  ],
};

/**
 * EXAMPLE 3: Advanced Level - Production CI/CD Pipeline
 * Minimal support, objective-only guidance
 */
export const CICD_PIPELINE_TCS: TCSTask = {
  task: "Design and implement a complete CI/CD pipeline that automatically builds, tests, and deploys a containerized application to production with rollback capability and monitoring.",

  conditions: {
    timeLimit: 90,
    environment:
      "Jenkins server, Docker registry, Kubernetes cluster, Git repository",
    resources: [
      "Jenkins admin access with plugin installation rights",
      "Private Docker registry or Docker Hub account",
      "Kubernetes cluster with ingress controller",
      "Git repository with push access",
      "Objective-only guidance - no implementation hints",
      "Official documentation for all tools",
    ],
    restrictions: [
      "No pre-built pipeline templates",
      "No hints available - simulate real production environment",
      "Must implement proper secret management (no hardcoded credentials)",
      "Must include automated testing stage",
      "Time pressure enforced - 90 minutes maximum",
      "No external help - demonstrate independent competence",
    ],
  },

  standards: [
    {
      id: "std-1",
      description:
        "Jenkinsfile defines multi-stage pipeline: Build, Test, Push, Deploy",
      required: true,
      met: false,
    },
    {
      id: "std-2",
      description:
        "Build stage successfully compiles code and creates Docker image",
      required: true,
      met: false,
    },
    {
      id: "std-3",
      description:
        "Test stage runs automated tests and fails pipeline if tests fail",
      required: true,
      met: false,
    },
    {
      id: "std-4",
      description:
        "Push stage uploads image to registry with proper tagging (version + 'latest')",
      required: true,
      met: false,
    },
    {
      id: "std-5",
      description:
        "Deploy stage updates Kubernetes deployment without manual intervention",
      required: true,
      met: false,
    },
    {
      id: "std-6",
      description: "Secrets stored in Jenkins credentials, not in Jenkinsfile",
      required: true,
      met: false,
    },
    {
      id: "std-7",
      description: "Pipeline triggers automatically on Git push to main branch",
      required: true,
      met: false,
    },
    {
      id: "std-8",
      description:
        "Deployment verification: application is accessible and returns HTTP 200",
      required: true,
      met: false,
    },
    {
      id: "std-9",
      description:
        "Rollback capability demonstrated: can revert to previous version",
      required: true,
      met: false,
    },
    {
      id: "std-10",
      description:
        "Pipeline execution time under 10 minutes from commit to deployment",
      required: false,
      met: false,
    },
    {
      id: "std-11",
      description:
        "All pipeline stages include proper error handling and notifications",
      required: true,
      met: false,
    },
  ],
};

/**
 * EXAMPLE 4: Battle Drill - Incident Response
 * Time-critical, muscle memory focused
 */
export const INCIDENT_RESPONSE_TCS: TCSTask = {
  task: "Respond to production outage by identifying failed pod, retrieving logs, diagnosing issue, and restoring service within 15 minutes.",

  conditions: {
    timeLimit: 15, // Battle drills are time-critical
    environment: "Production Kubernetes cluster with simulated failure",
    resources: [
      "kubectl CLI access",
      "Log aggregation system (read-only)",
      "Slack channel for incident communication",
      "Runbook with standard procedures",
      "No hints - battle drill simulation",
    ],
    restrictions: [
      "15-minute hard deadline",
      "No looking up commands - must know from memory",
      "No trial and error - precision required",
      "Must follow incident response protocol",
      "All actions must be logged in incident channel",
    ],
  },

  standards: [
    {
      id: "std-1",
      description:
        "Identify failing pod within 2 minutes using kubectl commands",
      required: true,
      met: false,
    },
    {
      id: "std-2",
      description: "Retrieve and analyze pod logs to determine root cause",
      required: true,
      met: false,
    },
    {
      id: "std-3",
      description:
        "Post initial status update in incident channel within 3 minutes",
      required: true,
      met: false,
    },
    {
      id: "std-4",
      description: "Apply fix (scaling, config update, or manual intervention)",
      required: true,
      met: false,
    },
    {
      id: "std-5",
      description: "Verify service restoration: all health checks passing",
      required: true,
      met: false,
    },
    {
      id: "std-6",
      description: "Complete incident response within 15-minute deadline",
      required: true,
      met: false,
    },
    {
      id: "std-7",
      description: "Document actions taken in proper incident format",
      required: true,
      met: false,
    },
  ],
};

/**
 * TCS Best Practices
 */
export const TCS_GUIDELINES = {
  task: {
    shouldBe: "Clear, measurable objective. One sentence. Action-oriented.",
    shouldNotBe:
      "Vague goals, multiple unrelated tasks, or learning objectives",
  },

  conditions: {
    shouldInclude: [
      "Execution environment (OS, tools, versions)",
      "Available resources (docs, hints, time)",
      "Specific restrictions (no GUI, CLI only, time limits)",
    ],
    shouldNotInclude: [
      "Implementation steps",
      "Solutions or answers",
      "Unnecessary permissions",
    ],
  },

  standards: {
    shouldBe: "Pass/fail criteria. Binary. Measurable. Verifiable.",
    shouldNotBe: "Partial credit. Subjective judgment. Unclear metrics.",
    rules: [
      "All required standards must be met to pass",
      "Optional standards are bonuses, not required",
      "Each standard should be independently verifiable",
      "Standards should align with task objective",
    ],
  },
};

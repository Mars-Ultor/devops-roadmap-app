/* eslint-disable sonarjs/no-duplicate-string */
/**
 * Week 11 Lesson 3 - Platform Engineering & Developer Experience
 * 4-Level Mastery Progression: Internal developer platforms, self-service, golden paths
 * Contains intentionally repeated content type values
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week11Lesson3PlatformEngineering: LeveledLessonContent = {
  lessonId: "week11-lesson3-platform-engineering",

  baseLesson: {
    title: "Platform Engineering & Developer Experience",
    description:
      "Build internal developer platforms (IDPs) with self-service capabilities, golden paths, and excellent developer experience.",
    learningObjectives: [
      "Understand platform engineering principles and value",
      "Design internal developer platforms with self-service",
      "Implement golden paths for common workflows",
      "Build developer portals with Backstage",
      "Create platform abstractions reducing cognitive load",
    ],
    prerequisites: [
      "Kubernetes fundamentals",
      "GitOps and CI/CD concepts",
      "Infrastructure as Code basics",
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20,
    },
  },

  crawl: {
    introduction:
      "Learn platform engineering step-by-step. You will build internal developer platforms, create self-service capabilities, and improve developer experience.",
    expectedOutcome:
      "Complete understanding of platform engineering principles, internal developer platforms, self-service portals, golden paths, developer productivity, and platform abstractions",
    steps: [
      {
        stepNumber: 1,
        instruction: "Understand platform engineering principles",
        command:
          'echo "Platform Engineering:\n1. Self-Service - Developers provision resources without tickets\n2. Golden Paths - Opinionated, paved roads for common tasks\n3. Abstraction - Hide complexity, expose capabilities\n4. Developer Experience - Fast, reliable, delightful workflows\n5. Product Thinking - Platform as product with users (developers)"',
        explanation:
          "Platform engineering builds internal platforms reducing cognitive load. Developers self-serve infrastructure, follow golden paths, ship faster.",
        expectedOutput: "Platform principles listed",
        validationCriteria: [
          "Understand self-service concept",
          "Know golden path purpose",
          "Recognize DX importance",
        ],
        commonMistakes: [
          "Building platforms without user feedback",
          "Over-engineering abstractions",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Install Backstage developer portal",
        command: "npx @backstage/create-app@latest && cd backstage && yarn dev",
        explanation:
          "Backstage is open-source developer portal (created by Spotify). Service catalog, documentation, scaffolding templates, integrations with tools.",
        expectedOutput: "Backstage installed",
        validationCriteria: [
          "Backstage app created",
          "Development server running",
          "UI accessible at localhost:3000",
        ],
        commonMistakes: ["Wrong Node version", "Missing dependencies"],
      },
      {
        stepNumber: 3,
        instruction: "Create service catalog for microservices",
        command:
          "cat > catalog-info.yaml <<EOF\napiVersion: backstage.io/v1alpha1\nkind: Component\nmetadata:\n  name: user-service\n  description: User authentication and management service\n  annotations:\n    github.com/project-slug: myorg/user-service\n    backstage.io/techdocs-ref: dir:.\nspec:\n  type: service\n  lifecycle: production\n  owner: backend-team\n  system: authentication\n  providesApis:\n    - user-api\n  consumesApis:\n    - postgres-db\nEOF",
        explanation:
          "Service catalog tracks all services: ownership, dependencies, APIs, lifecycle. Developers discover services, understand system architecture.",
        expectedOutput: "Catalog entry created",
        validationCriteria: [
          "Component defined",
          "Ownership specified",
          "Dependencies listed",
        ],
        commonMistakes: ["Missing ownership", "Not tracking dependencies"],
      },
      {
        stepNumber: 4,
        instruction: "Create software template for new services",
        command:
          "cat > templates/nodejs-service/template.yaml <<EOF\napiVersion: scaffolder.backstage.io/v1beta3\nkind: Template\nmetadata:\n  name: nodejs-service\n  title: Node.js Microservice\n  description: Create a new Node.js microservice with CI/CD\nspec:\n  owner: platform-team\n  type: service\n  parameters:\n    - title: Service Information\n      required:\n        - name\n        - owner\n      properties:\n        name:\n          title: Service Name\n          type: string\n          description: Unique name for the service\n        owner:\n          title: Owner\n          type: string\n          description: Team owning this service\n          ui:field: OwnerPicker\n  steps:\n    - id: fetch-base\n      name: Fetch Base\n      action: fetch:template\n      input:\n        url: ./skeleton\n        values:\n          name: ${{ parameters.name }}\n          owner: ${{ parameters.owner }}\n    - id: publish\n      name: Publish to GitHub\n      action: publish:github\n      input:\n        repoUrl: github.com?repo=${{ parameters.name }}&owner=myorg\n    - id: register\n      name: Register Component\n      action: catalog:register\n      input:\n        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}\nEOF",
        explanation:
          "Software templates = golden paths. Developers create new services by filling form. Template generates repo, CI/CD, K8s manifests, documentation.",
        expectedOutput: "Template created",
        validationCriteria: [
          "Template parameters defined",
          "Steps scaffold project",
          "Auto-registers in catalog",
        ],
        commonMistakes: ["Complex templates", "Not matching team workflow"],
      },
      {
        stepNumber: 5,
        instruction: "Set up Crossplane for infrastructure self-service",
        command:
          "kubectl create namespace crossplane-system && helm repo add crossplane-stable https://charts.crossplane.io/stable && helm install crossplane --namespace crossplane-system crossplane-stable/crossplane && kubectl wait --for=condition=available --timeout=300s deployment/crossplane -n crossplane-system",
        explanation:
          "Crossplane provisions cloud resources via Kubernetes APIs. Developers create database with kubectl apply, Crossplane provisions RDS. Self-service infrastructure.",
        expectedOutput: "Crossplane installed",
        validationCriteria: [
          "Crossplane pods running",
          "CRDs registered",
          "Ready to provision cloud resources",
        ],
        commonMistakes: [
          "Missing cloud provider credentials",
          "Wrong Crossplane version",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Create Crossplane Composite Resource for PostgreSQL",
        command:
          'kubectl apply -f - <<EOF\napiVersion: apiextensions.crossplane.io/v1\nkind: CompositeResourceDefinition\nmetadata:\n  name: xpostgresqlinstances.database.example.org\nspec:\n  group: database.example.org\n  names:\n    kind: XPostgreSQLInstance\n    plural: xpostgresqlinstances\n  claimNames:\n    kind: PostgreSQLInstance\n    plural: postgresqlinstances\n  versions:\n  - name: v1alpha1\n    served: true\n    referenceable: true\n    schema:\n      openAPIV3Schema:\n        type: object\n        properties:\n          spec:\n            type: object\n            properties:\n              parameters:\n                type: object\n                properties:\n                  storageGB:\n                    type: integer\n                  version:\n                    type: string\n                required:\n                - storageGB\n            required:\n            - parameters\n---\napiVersion: apiextensions.crossplane.io/v1\nkind: Composition\nmetadata:\n  name: xpostgresqlinstances.aws.database.example.org\nspec:\n  compositeTypeRef:\n    apiVersion: database.example.org/v1alpha1\n    kind: XPostgreSQLInstance\n  resources:\n  - name: rdsinstance\n    base:\n      apiVersion: database.aws.crossplane.io/v1beta1\n      kind: RDSInstance\n      spec:\n        forProvider:\n          dbInstanceClass: db.t3.micro\n          engine: postgres\n          skipFinalSnapshot: true\n    patches:\n    - fromFieldPath: "spec.parameters.storageGB"\n      toFieldPath: "spec.forProvider.allocatedStorage"\n    - fromFieldPath: "spec.parameters.version"\n      toFieldPath: "spec.forProvider.engineVersion"\nEOF',
        explanation:
          "Composite Resource Definition (XRD) defines PostgreSQL API. Developers request database with simple YAML, Crossplane provisions RDS with all complexity hidden.",
        expectedOutput: "Database API created",
        validationCriteria: [
          "XRD defining PostgreSQL",
          "Composition mapping to RDS",
          "Abstraction simplifying provisioning",
        ],
        commonMistakes: [
          "Exposing too much complexity",
          "No sensible defaults",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Developer self-serves database",
        command:
          'kubectl apply -f - <<EOF\napiVersion: database.example.org/v1alpha1\nkind: PostgreSQLInstance\nmetadata:\n  name: myapp-db\n  namespace: default\nspec:\n  parameters:\n    storageGB: 20\n    version: "14.7"\nEOF\nkubectl get postgresqlinstance myapp-db -w',
        explanation:
          "Developer provisions PostgreSQL with 3 lines. Crossplane creates RDS, manages credentials, connection strings. No AWS console, no tickets.",
        expectedOutput: "Database provisioned",
        validationCriteria: [
          "PostgreSQL claim created",
          "RDS instance provisioning",
          "Connection secret generated",
        ],
        commonMistakes: [
          "No RBAC limiting who can provision",
          "Missing cost controls",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Create platform portal with documentation",
        command:
          'cat > docs/platform/getting-started.md <<EOF\n# Platform Getting Started\n\n## Create New Service\n1. Go to Backstage → Create\n2. Select "Node.js Microservice" template\n3. Fill form: service name, team owner\n4. Click Create\n\nPlatform auto-creates:\n- Git repository\n- CI/CD pipeline\n- Kubernetes manifests\n- ArgoCD application\n- Service catalog entry\n\n## Provision Database\n\\`\\`\\`yaml\napiVersion: database.example.org/v1alpha1\nkind: PostgreSQLInstance\nmetadata:\n  name: myapp-db\nspec:\n  parameters:\n    storageGB: 20\n    version: "14.7"\n\\`\\`\\`\n\n## Deploy to Staging\n\\`\\`\\`bash\ngit commit -m "Feature"\ngit push origin main\n# ArgoCD auto-deploys to staging\n\\`\\`\\`\nEOF',
        explanation:
          "Platform documentation shows golden paths. Developers follow guides, self-serve infrastructure, ship faster. Clear, opinionated workflows.",
        expectedOutput: "Documentation created",
        validationCriteria: [
          "Getting started guide",
          "Common workflows documented",
          "Examples provided",
        ],
        commonMistakes: ["Documentation out of date", "Too complex"],
      },
      {
        stepNumber: 9,
        instruction: "Implement platform metrics and SLOs",
        command:
          "cat > platform-slos.yaml <<EOF\nSLOs:\n  Service Creation Time:\n    Target: < 5 minutes from template to running service\n    Current: 3.2 minutes\n  \n  Build Time:\n    Target: < 10 minutes for CI/CD pipeline\n    Current: 7.5 minutes\n  \n  Deployment Frequency:\n    Target: 10+ deploys per day per team\n    Current: 15 deploys/day\n  \n  Self-Service Adoption:\n    Target: 80% of teams using platform\n    Current: 65%\n  \n  Developer Satisfaction:\n    Target: NPS > 40\n    Current: NPS 52\nEOF",
        explanation:
          "Platform team tracks metrics: provisioning speed, build time, deployment frequency, adoption, satisfaction. Treat platform as product.",
        expectedOutput: "SLOs defined",
        validationCriteria: [
          "Speed metrics tracked",
          "Adoption measured",
          "Developer satisfaction surveyed",
        ],
        commonMistakes: [
          "Not measuring developer experience",
          "Ignoring feedback",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Create service health dashboard",
        command:
          'kubectl apply -f - <<EOF\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: grafana-dashboard\ndata:\n  platform-health.json: |\n    {\n      "dashboard": {\n        "title": "Platform Health",\n        "panels": [\n          {\n            "title": "Service Creation Time",\n            "targets": [{"expr": "histogram_quantile(0.95, platform_service_creation_duration_seconds)"}]\n          },\n          {\n            "title": "Build Success Rate",\n            "targets": [{"expr": "rate(platform_builds_total{status=\\"success\\"}[5m])"}]\n          },\n          {\n            "title": "Deployment Frequency",\n            "targets": [{"expr": "rate(platform_deployments_total[1h])"}]\n          },\n          {\n            "title": "Platform API Errors",\n            "targets": [{"expr": "rate(platform_api_errors_total[5m])"}]\n          }\n        ]\n      }\n    }\nEOF',
        explanation:
          "Platform health dashboard shows service creation time, build success, deployment frequency. Platform team monitors, improves continuously.",
        expectedOutput: "Dashboard configured",
        validationCriteria: [
          "Metrics visualized",
          "SLOs tracked",
          "Trends visible",
        ],
        commonMistakes: ["Not monitoring platform health", "Vanity metrics"],
      },
      {
        stepNumber: 11,
        instruction: "Implement cost visibility per team",
        command:
          'kubectl apply -f - <<EOF\napiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: backend-team-quota\n  namespace: backend\nspec:\n  hard:\n    requests.cpu: "100"\n    requests.memory: 200Gi\n    persistentvolumeclaims: "50"\n---\napiVersion: v1\nkind: LimitRange\nmetadata:\n  name: backend-team-limits\n  namespace: backend\nspec:\n  limits:\n  - max:\n      cpu: "4"\n      memory: 8Gi\n    min:\n      cpu: 100m\n      memory: 128Mi\n    type: Container\nEOF',
        explanation:
          "ResourceQuotas limit team resource usage. LimitRanges prevent runaway containers. Track costs per team, provide visibility, enforce budgets.",
        expectedOutput: "Resource limits configured",
        validationCriteria: [
          "Quotas per namespace/team",
          "Limits preventing waste",
          "Cost tracking active",
        ],
        commonMistakes: ["No cost controls", "Teams surprised by bills"],
      },
      {
        stepNumber: 12,
        instruction: "Create platform feedback loop",
        command:
          "cat > platform-feedback.yaml <<EOF\nFeedback Channels:\n  Slack: #platform-support\n    - Questions answered within 1 hour\n    - Feature requests tracked\n  \n  Office Hours: Tuesdays 2-3pm\n    - Platform team available\n    - Live troubleshooting\n  \n  Quarterly Survey:\n    - Developer satisfaction (NPS)\n    - Pain points\n    - Feature requests\n  \n  Metrics:\n    - Service creation failures\n    - Support ticket trends\n    - Adoption metrics\n\nImprovement Loop:\n  1. Collect feedback (surveys, metrics, support)\n  2. Prioritize improvements\n  3. Ship changes\n  4. Measure impact\n  5. Repeat\nEOF",
        explanation:
          "Platform teams listen to developers: surveys, Slack, office hours, metrics. Continuous improvement based on user feedback.",
        expectedOutput: "Feedback mechanisms defined",
        validationCriteria: [
          "Multiple feedback channels",
          "Regular developer engagement",
          "Improvements data-driven",
        ],
        commonMistakes: ["Building in isolation", "Not acting on feedback"],
      },
    ],
  },

  walk: {
    introduction: "Apply platform engineering through hands-on exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create Backstage service catalog entry.",
        template: `apiVersion: backstage.io/__V1ALPHA1__
kind: __COMPONENT__
metadata:
  name: payment-service
  description: Payment processing microservice
  annotations:
    github.com/project-slug: myorg/__PAYMENT-SERVICE__
    backstage.io/techdocs-ref: dir:.
spec:
  type: __SERVICE__
  lifecycle: __PRODUCTION__
  owner: __PAYMENTS-TEAM__
  system: commerce
  providesApis:
    - payment-api
  consumesApis:
    - __USER-API__
    - stripe-api
  dependsOn:
    - resource:__POSTGRES-DB__`,
        blanks: [
          {
            id: "V1ALPHA1",
            label: "V1ALPHA1",
            hint: "API version",
            correctValue: "v1alpha1",
            validationPattern: "v1alpha1",
          },
          {
            id: "COMPONENT",
            label: "COMPONENT",
            hint: "Resource kind",
            correctValue: "Component",
            validationPattern: "component",
          },
          {
            id: "PAYMENT-SERVICE",
            label: "PAYMENT-SERVICE",
            hint: "Repository name",
            correctValue: "payment-service",
            validationPattern: "payment",
          },
          {
            id: "SERVICE",
            label: "SERVICE",
            hint: "Component type",
            correctValue: "service",
            validationPattern: "service",
          },
          {
            id: "PRODUCTION",
            label: "PRODUCTION",
            hint: "Lifecycle stage",
            correctValue: "production",
            validationPattern: "prod",
          },
          {
            id: "PAYMENTS-TEAM",
            label: "PAYMENTS-TEAM",
            hint: "Owning team",
            correctValue: "payments-team",
            validationPattern: "payments",
          },
          {
            id: "USER-API",
            label: "USER-API",
            hint: "Consumed API",
            correctValue: "user-api",
            validationPattern: "user",
          },
          {
            id: "POSTGRES-DB",
            label: "POSTGRES-DB",
            hint: "Database dependency",
            correctValue: "postgres-db",
            validationPattern: "postgres",
          },
        ],
        solution:
          "Backstage catalog tracks service metadata: ownership (payments-team), lifecycle (production), APIs provided/consumed, dependencies. Enables service discovery and architecture understanding.",
        explanation:
          "Service catalogs provide visibility into microservices architecture",
      },
      {
        exerciseNumber: 2,
        scenario: "Create Crossplane Composite Resource for S3 bucket.",
        template: `apiVersion: apiextensions.crossplane.io/__V1__
kind: __COMPOSITE_RESOURCE_DEFINITION__
metadata:
  name: xs3buckets.storage.example.org
spec:
  group: storage.example.org
  names:
    kind: XS3Bucket
    plural: xs3buckets
  claimNames:
    kind: __S3_BUCKET__
    plural: s3buckets
  versions:
  - name: __V1ALPHA1__
    served: true
    referenceable: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              parameters:
                type: object
                properties:
                  public:
                    type: __BOOLEAN__
                    default: __FALSE__`,
        blanks: [
          {
            id: "V1",
            label: "V1",
            hint: "API version",
            correctValue: "v1",
            validationPattern: "v1",
          },
          {
            id: "COMPOSITE_RESOURCE_DEFINITION",
            label: "COMPOSITE_RESOURCE_DEFINITION",
            hint: "Resource kind",
            correctValue: "CompositeResourceDefinition",
            validationPattern: "composite.*resource",
          },
          {
            id: "S3_BUCKET",
            label: "S3_BUCKET",
            hint: "Claim kind",
            correctValue: "S3Bucket",
            validationPattern: "s3.*bucket",
          },
          {
            id: "V1ALPHA1",
            label: "V1ALPHA1",
            hint: "Version name",
            correctValue: "v1alpha1",
            validationPattern: "v1alpha1",
          },
          {
            id: "BOOLEAN",
            label: "BOOLEAN",
            hint: "Property type",
            correctValue: "boolean",
            validationPattern: "boolean",
          },
          {
            id: "FALSE",
            label: "FALSE",
            hint: "Default value",
            correctValue: "false",
            validationPattern: "false",
          },
        ],
        solution:
          "Crossplane XRD defines simplified S3 API. Developers provision bucket with single parameter (public: true/false). Complexity hidden, safe defaults enforced.",
        explanation:
          "Platform abstractions simplify infrastructure provisioning",
      },
      {
        exerciseNumber: 3,
        scenario: "Create Backstage software template for new service.",
        template: `apiVersion: scaffolder.backstage.io/__V1BETA3__
kind: __TEMPLATE__
metadata:
  name: microservice-template
  title: Microservice Starter
  description: Create new microservice with CI/CD
spec:
  owner: __PLATFORM-TEAM__
  type: service
  parameters:
    - title: Service Info
      required:
        - name
        - __OWNER__
      properties:
        name:
          title: Service Name
          type: __STRING__
        owner:
          title: Team Owner
          type: string
          ui:field: __OWNER_PICKER__
  steps:
    - id: fetch
      name: Fetch Template
      action: __FETCH:TEMPLATE__
      input:
        url: ./skeleton
        values:
          name: \${{ parameters.name }}
    - id: publish
      name: Publish to GitHub
      action: __PUBLISH:GITHUB__
      input:
        repoUrl: github.com?repo=\${{ parameters.name }}&owner=myorg`,
        blanks: [
          {
            id: "V1BETA3",
            label: "V1BETA3",
            hint: "API version",
            correctValue: "v1beta3",
            validationPattern: "v1beta3",
          },
          {
            id: "TEMPLATE",
            label: "TEMPLATE",
            hint: "Resource kind",
            correctValue: "Template",
            validationPattern: "template",
          },
          {
            id: "PLATFORM-TEAM",
            label: "PLATFORM-TEAM",
            hint: "Template owner",
            correctValue: "platform-team",
            validationPattern: "platform",
          },
          {
            id: "OWNER",
            label: "OWNER",
            hint: "Required field",
            correctValue: "owner",
            validationPattern: "owner",
          },
          {
            id: "STRING",
            label: "STRING",
            hint: "Property type",
            correctValue: "string",
            validationPattern: "string",
          },
          {
            id: "OWNER_PICKER",
            label: "OWNER_PICKER",
            hint: "UI field type",
            correctValue: "OwnerPicker",
            validationPattern: "owner.*picker",
          },
          {
            id: "FETCH:TEMPLATE",
            label: "FETCH:TEMPLATE",
            hint: "Scaffolder action",
            correctValue: "fetch:template",
            validationPattern: "fetch",
          },
          {
            id: "PUBLISH:GITHUB",
            label: "PUBLISH:GITHUB",
            hint: "Publish action",
            correctValue: "publish:github",
            validationPattern: "publish",
          },
        ],
        solution:
          "Backstage template scaffolds new microservices. Developers fill form (name, owner), template creates Git repo with skeleton code, CI/CD, K8s manifests. Golden path automation.",
        explanation:
          "Software templates automate service creation following best practices",
      },
      {
        exerciseNumber: 4,
        scenario: "Configure resource quotas for cost control.",
        template: `apiVersion: v1
kind: __RESOURCE_QUOTA__
metadata:
  name: team-quota
  namespace: __MY-TEAM__
spec:
  hard:
    requests.cpu: "__100__"
    requests.memory: __200GI__
    persistentvolumeclaims: "50"
    services.loadbalancers: "__5__"
---
apiVersion: v1
kind: __LIMIT_RANGE__
metadata:
  name: team-limits
  namespace: my-team
spec:
  limits:
  - max:
      cpu: "__4__"
      memory: 8Gi
    min:
      cpu: __100M__
      memory: 128Mi
    type: __CONTAINER__`,
        blanks: [
          {
            id: "RESOURCE_QUOTA",
            label: "RESOURCE_QUOTA",
            hint: "Resource kind",
            correctValue: "ResourceQuota",
            validationPattern: "resource.*quota",
          },
          {
            id: "MY-TEAM",
            label: "MY-TEAM",
            hint: "Namespace",
            correctValue: "my-team",
            validationPattern: "team",
          },
          {
            id: "100",
            label: "100",
            hint: "CPU quota",
            correctValue: "100",
            validationPattern: "100",
          },
          {
            id: "200GI",
            label: "200GI",
            hint: "Memory quota",
            correctValue: "200Gi",
            validationPattern: "200",
          },
          {
            id: "5",
            label: "5",
            hint: "LoadBalancer limit",
            correctValue: "5",
            validationPattern: "5",
          },
          {
            id: "LIMIT_RANGE",
            label: "LIMIT_RANGE",
            hint: "Resource kind",
            correctValue: "LimitRange",
            validationPattern: "limit.*range",
          },
          {
            id: "4",
            label: "4",
            hint: "Max CPU",
            correctValue: "4",
            validationPattern: "4",
          },
          {
            id: "100M",
            label: "100M",
            hint: "Min CPU",
            correctValue: "100m",
            validationPattern: "100m",
          },
          {
            id: "CONTAINER",
            label: "CONTAINER",
            hint: "Limit type",
            correctValue: "Container",
            validationPattern: "container",
          },
        ],
        solution:
          "ResourceQuota limits namespace resources: 100 CPU cores, 200Gi memory, 50 PVCs, 5 LoadBalancers. LimitRange constrains container sizes: 100m-4 CPU, 128Mi-8Gi memory. Prevents cost overruns.",
        explanation:
          "Resource quotas and limits control costs and prevent waste",
      },
      {
        exerciseNumber: 5,
        scenario: "Define platform SLOs and metrics.",
        template: `Platform SLOs:
  Service Provisioning:
    Description: Time from template to running service
    Target: __< 5 MINUTES__
    Measurement: p95 of service_creation_duration_seconds
    
  Build Pipeline:
    Description: CI/CD pipeline success rate
    Target: __> 95%__
    Measurement: builds_success_total / builds_total
    
  Deployment Frequency:
    Description: Deployments per team per day
    Target: __> 10__
    Measurement: avg(deployments_total) by team
    
  Platform Availability:
    Description: Platform API uptime
    Target: __99.9%__
    Measurement: platform_api_available
    
  Developer Satisfaction:
    Description: Quarterly NPS score
    Target: __> 40__
    Measurement: quarterly_survey_nps`,
        blanks: [
          {
            id: "< 5 MINUTES",
            label: "< 5 MINUTES",
            hint: "Speed target",
            correctValue: "< 5 minutes",
            validationPattern: "5.*min",
          },
          {
            id: "> 95%",
            label: "> 95%",
            hint: "Success rate target",
            correctValue: "> 95%",
            validationPattern: "95",
          },
          {
            id: "> 10",
            label: "> 10",
            hint: "Frequency target",
            correctValue: "> 10",
            validationPattern: "10",
          },
          {
            id: "99.9%",
            label: "99.9%",
            hint: "Availability target",
            correctValue: "99.9%",
            validationPattern: "99",
          },
          {
            id: "> 40",
            label: "> 40",
            hint: "NPS target",
            correctValue: "> 40",
            validationPattern: "40",
          },
        ],
        solution:
          "Platform SLOs measure success: provisioning speed (<5min), build success (>95%), deployment frequency (>10/day), uptime (99.9%), developer satisfaction (NPS>40). Data-driven improvements.",
        explanation: "Platform SLOs ensure excellent developer experience",
      },
    ],
    hints: [
      "Service catalogs track ownership, APIs, and dependencies",
      "Crossplane XRDs abstract infrastructure complexity",
      "Backstage templates automate service creation",
      "ResourceQuotas prevent cost overruns per team",
      "Platform SLOs measure developer experience metrics",
    ],
  },

  runGuided: {
    objective:
      "Build production internal developer platform with self-service, golden paths, developer portal, and excellent developer experience",
    conceptualGuidance: [
      "Design platform capabilities: what can developers self-serve?",
      "Deploy Backstage as developer portal and service catalog",
      "Create software templates for common workflows (new service, database, etc)",
      "Install Crossplane for infrastructure self-service",
      "Build Composite Resources abstracting cloud complexity",
      "Document golden paths clearly with examples",
      "Implement cost controls: quotas, limits, visibility",
      "Set up platform observability: SLOs, metrics, dashboards",
      "Establish feedback loops: surveys, Slack, office hours",
      "Treat platform as product with developer users",
    ],
    keyConceptsToApply: [
      "Self-service platform capabilities",
      "Golden paths and paved roads",
      "Platform abstractions reducing complexity",
      "Developer experience optimization",
      "Product thinking for platforms",
    ],
    checkpoints: [
      {
        checkpoint: "Developer portal deployed with service catalog",
        description: "Backstage tracking all services and ownership",
        validationCriteria: [
          "Backstage running and accessible",
          "Service catalog populated with all services",
          "Ownership assigned to teams",
          "APIs and dependencies documented",
          "TechDocs for each service",
          "SSO integrated",
        ],
        hintIfStuck:
          "Install Backstage with npx create-app. Create catalog-info.yaml for each service. Register components. Integrate GitHub for auto-discovery. Add TechDocs plugin.",
      },
      {
        checkpoint: "Self-service infrastructure with Crossplane",
        description: "Developers provision databases, buckets via kubectl",
        validationCriteria: [
          "Crossplane installed with cloud provider",
          "XRDs for common resources (DB, S3, cache)",
          "Developers can provision with simple YAML",
          "Composition handles complexity",
          "Credentials auto-injected to apps",
          "Cost controls enforced",
        ],
        hintIfStuck:
          "Install Crossplane and AWS provider. Create XRDs for PostgreSQL, S3. Define Compositions mapping to cloud resources. Add RBAC limiting provisioning. Test with kubectl apply.",
      },
      {
        checkpoint: "Golden paths automated with templates",
        description: "Developers create services via templates",
        validationCriteria: [
          "Software templates for common workflows",
          "New service template scaffolding complete app",
          "CI/CD auto-configured",
          "K8s manifests generated",
          "ArgoCD Application created",
          "Service registered in catalog",
        ],
        hintIfStuck:
          "Create Backstage Template with parameters. Skeleton includes app code, Dockerfile, CI/CD, K8s manifests. Steps: fetch template, publish to Git, register catalog, create ArgoCD app.",
      },
    ],
    resourcesAllowed: [
      "Backstage documentation",
      "Crossplane documentation",
      "Platform engineering best practices",
      "Team Topologies book",
    ],
  },

  runIndependent: {
    objective:
      "Build production-grade internal developer platform with comprehensive self-service, automated golden paths, excellent developer experience, complete observability, and continuous improvement",
    successCriteria: [
      "Developer portal: Backstage with service catalog, API docs, TechDocs, SSO",
      "Self-service infrastructure: Crossplane XRDs for databases, storage, queues",
      "Golden paths: templates automating service creation, database provisioning, deployments",
      "Cost controls: ResourceQuotas per team, visibility dashboards, budget alerts",
      "Developer experience: <5min service creation, >95% build success, >10 deploys/day",
      "Documentation: clear guides for common workflows, troubleshooting, FAQs",
      "Observability: platform SLOs, metrics dashboards, alerts on degradation",
      "Feedback loops: quarterly surveys, Slack support, office hours, issue tracking",
      "Security: RBAC limiting access, automated policy enforcement, audit logging",
      "Continuous improvement: data-driven prioritization, regular releases, changelog",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Developer portal with service catalog",
      "Self-service infrastructure working",
      "At least one golden path automated",
    ],
    evaluationRubric: [
      {
        criterion: "Self-Service Capabilities",
        weight: 30,
        passingThreshold:
          "Developers provision infrastructure without tickets. Crossplane XRDs for common resources. Backstage templates for workflows. RBAC enforcing guardrails. Cost controls active. Provisioning <5 minutes.",
      },
      {
        criterion: "Developer Experience",
        weight: 30,
        passingThreshold:
          "Service creation automated end-to-end. Clear documentation with examples. Build success >95%. Deployment frequency >10/day. Developer satisfaction NPS >40. Fast feedback on failures.",
      },
      {
        criterion: "Platform Operations",
        weight: 20,
        passingThreshold:
          "SLOs defined and tracked. Metrics dashboards showing health. Alerts on degradation. Cost visibility per team. Security controls enforced. Audit logging active. Backup and DR tested.",
      },
      {
        criterion: "Continuous Improvement",
        weight: 20,
        passingThreshold:
          "Regular developer surveys. Feedback channels active (Slack, office hours). Improvements prioritized by data. Changelog communicated. Adoption growing. Platform team responsive.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=AimSwK8Mw-U",
  documentation: [
    "https://backstage.io/docs/",
    "https://www.crossplane.io/docs/",
    "https://platformengineering.org/",
    "https://teamtopologies.com/key-concepts",
    "https://internaldeveloperplatform.org/",
    "https://tag-app-delivery.cncf.io/whitepapers/platforms/",
  ],
  relatedConcepts: [
    "Platform engineering principles",
    "Internal developer platforms",
    "Self-service infrastructure",
    "Golden paths and paved roads",
    "Developer experience optimization",
    "Platform as product mindset",
  ],
};

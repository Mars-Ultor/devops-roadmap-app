/**
 * Week 12 Lesson 1 - Capstone Project & Portfolio
 * 4-Level Mastery Progression: Build production-grade portfolio project demonstrating all skills
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week12Lesson1CapstoneProject: LeveledLessonContent = {
  lessonId: 'week12-lesson1-capstone-project',
  
  baseLesson: {
    title: 'Capstone Project & Portfolio',
    description: 'Build comprehensive DevOps portfolio project demonstrating cloud infrastructure, CI/CD, monitoring, security, and platform engineering skills.',
    learningObjectives: [
      'Design end-to-end production infrastructure',
      'Implement complete CI/CD with GitOps',
      'Deploy multi-tier application with observability',
      'Document architecture and decisions',
      'Create portfolio showcasing DevOps skills'
    ],
    prerequisites: [
      'All previous weeks completed',
      'Kubernetes, Terraform, CI/CD knowledge',
      'Cloud provider account (AWS/GCP/Azure)'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Build your capstone DevOps portfolio project step-by-step. You will create production-grade infrastructure, CI/CD pipelines, monitoring, and comprehensive documentation.',
    expectedOutcome: 'Complete portfolio project with infrastructure as code, GitOps deployment, observability, security scanning, cost optimization, and professional documentation',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Design capstone project architecture',
        command: 'cat > architecture-design.md <<EOF\n# DevOps Portfolio Project Architecture\n\n## Application\n- **Frontend**: React SPA (S3 + CloudFront)\n- **API**: Node.js REST API (EKS)\n- **Database**: PostgreSQL (RDS)\n- **Cache**: Redis (ElastiCache)\n- **Queue**: SQS for async processing\n\n## Infrastructure\n- **IaC**: Terraform modules (VPC, EKS, RDS, S3)\n- **Container Orchestration**: Amazon EKS\n- **GitOps**: ArgoCD for deployments\n- **Service Mesh**: Istio for traffic management\n\n## CI/CD Pipeline\n- **Source Control**: GitHub with branch protection\n- **CI**: GitHub Actions (build, test, scan)\n- **CD**: ArgoCD automated sync\n- **Artifact Storage**: ECR for containers\n\n## Observability\n- **Metrics**: Prometheus + Grafana\n- **Logs**: Loki centralized logging\n- **Tracing**: Jaeger distributed tracing\n- **Alerts**: AlertManager + PagerDuty\n\n## Security\n- **Secrets**: Vault for secret management\n- **Scanning**: Trivy (containers), OWASP ZAP (DAST)\n- **Policy**: OPA for admission control\n- **Network**: Network policies, mTLS via Istio\nEOF',
        explanation: 'Architecture document defines project scope: multi-tier application, cloud-native infrastructure, complete CI/CD, observability, security. Portfolio demonstrates production readiness.',
        expectedOutput: 'Architecture documented',
        validationCriteria: [
          'Application tiers defined',
          'Infrastructure components listed',
          'CI/CD pipeline designed',
          'Observability planned'
        ],
        commonMistakes: ['Too simple (just deployment)', 'Too complex (never finish)']
      },
      {
        stepNumber: 2,
        instruction: 'Create Terraform workspace structure',
        command: 'mkdir -p infrastructure/{modules/{vpc,eks,rds,monitoring},environments/{dev,staging,prod}} && cat > infrastructure/main.tf <<EOF\nterraform {\n  required_version = ">= 1.6"\n  \n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "capstone/terraform.tfstate"\n    region         = "us-east-1"\n    dynamodb_table = "terraform-locks"\n    encrypt        = true\n  }\n  \n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n    kubernetes = {\n      source  = "hashicorp/kubernetes"\n      version = "~> 2.23"\n    }\n  }\n}\n\nmodule "vpc" {\n  source = "./modules/vpc"\n  \n  environment = var.environment\n  cidr_block  = var.vpc_cidr\n}\n\nmodule "eks" {\n  source = "./modules/eks"\n  \n  environment    = var.environment\n  vpc_id         = module.vpc.vpc_id\n  subnet_ids     = module.vpc.private_subnet_ids\n  cluster_name   = "\${var.environment}-cluster"\n}\n\nmodule "rds" {\n  source = "./modules/rds"\n  \n  environment       = var.environment\n  vpc_id            = module.vpc.vpc_id\n  subnet_ids        = module.vpc.database_subnet_ids\n  instance_class    = var.rds_instance_class\n}\nEOF',
        explanation: 'Terraform workspace with modules for reusability, S3 backend for state, multi-environment support. Demonstrates IaC best practices.',
        expectedOutput: 'Infrastructure structure created',
        validationCriteria: [
          'Module structure organized',
          'Remote state configured',
          'Environment separation',
          'Version constraints set'
        ],
        commonMistakes: ['No modules (not reusable)', 'Local state (not collaborative)']
      },
      {
        stepNumber: 3,
        instruction: 'Create application with Dockerfile',
        command: 'mkdir -p app/backend && cat > app/backend/Dockerfile <<EOF\n# Multi-stage build for efficiency\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nRUN npm run build\n\n# Production image\nFROM node:20-alpine\nWORKDIR /app\n\n# Security: non-root user\nRUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001\n\nCOPY --from=builder --chown=nodejs:nodejs /app/dist ./dist\nCOPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules\n\nUSER nodejs\nEXPOSE 3000\n\nHEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\\\n  CMD node healthcheck.js\n\nCMD ["node", "dist/index.js"]\nEOF',
        explanation: 'Multi-stage Dockerfile: builder stage compiles, production stage minimal. Non-root user for security, healthcheck for reliability. Production-ready container.',
        expectedOutput: 'Dockerfile created',
        validationCriteria: [
          'Multi-stage build',
          'Non-root user',
          'Health check defined',
          'Minimal production image'
        ],
        commonMistakes: ['Running as root', 'No health check', 'Large image size']
      },
      {
        stepNumber: 4,
        instruction: 'Create GitHub Actions CI pipeline',
        command: 'mkdir -p .github/workflows && cat > .github/workflows/ci.yml <<EOF\nname: CI Pipeline\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      \n      - name: Install dependencies\n        run: npm ci\n      \n      - name: Run linting\n        run: npm run lint\n      \n      - name: Run tests\n        run: npm test -- --coverage\n      \n      - name: Upload coverage\n        uses: codecov/codecov-action@v3\n  \n  security-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Run Trivy vulnerability scanner\n        uses: aquasecurity/trivy-action@master\n        with:\n          scan-type: fs\n          scan-ref: .\n          severity: CRITICAL,HIGH\n  \n  build-push:\n    needs: [test, security-scan]\n    runs-on: ubuntu-latest\n    if: github.ref == \'refs/heads/main\'\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Configure AWS credentials\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          aws-access-key-id: \\${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: \\${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      \n      - name: Login to Amazon ECR\n        id: login-ecr\n        uses: aws-actions/amazon-ecr-login@v2\n      \n      - name: Build and push image\n        env:\n          ECR_REGISTRY: \\${{ steps.login-ecr.outputs.registry }}\n          IMAGE_TAG: \\${{ github.sha }}\n        run: |\n          docker build -t \\$ECR_REGISTRY/app:\\$IMAGE_TAG .\n          docker push \\$ECR_REGISTRY/app:\\$IMAGE_TAG\n          docker tag \\$ECR_REGISTRY/app:\\$IMAGE_TAG \\$ECR_REGISTRY/app:latest\n          docker push \\$ECR_REGISTRY/app:latest\nEOF',
        explanation: 'CI pipeline: test (unit tests, coverage), security-scan (Trivy), build-push (ECR). Runs on PR, deploys on main merge. Quality gates before deployment.',
        expectedOutput: 'CI workflow created',
        validationCriteria: [
          'Tests run on every PR',
          'Security scanning integrated',
          'Images pushed to ECR',
          'Coverage tracked'
        ],
        commonMistakes: ['No security scanning', 'Deploying without tests']
      },
      {
        stepNumber: 5,
        instruction: 'Create Kubernetes manifests with Kustomize',
        command: 'mkdir -p k8s/{base,overlays/{dev,staging,prod}} && cat > k8s/base/deployment.yaml <<EOF\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: backend\n  template:\n    metadata:\n      labels:\n        app: backend\n        version: v1\n    spec:\n      containers:\n      - name: app\n        image: REGISTRY/app:TAG\n        ports:\n        - containerPort: 3000\n        env:\n        - name: NODE_ENV\n          value: production\n        - name: DB_HOST\n          valueFrom:\n            secretKeyRef:\n              name: db-credentials\n              key: host\n        resources:\n          requests:\n            cpu: 100m\n            memory: 128Mi\n          limits:\n            cpu: 500m\n            memory: 512Mi\n        livenessProbe:\n          httpGet:\n            path: /health\n            port: 3000\n          initialDelaySeconds: 30\n          periodSeconds: 10\n        readinessProbe:\n          httpGet:\n            path: /ready\n            port: 3000\n          initialDelaySeconds: 5\n          periodSeconds: 5\nEOF',
        explanation: 'Kubernetes Deployment with resource limits, health probes, secrets from external store. Kustomize base with environment overlays for DRY configuration.',
        expectedOutput: 'K8s manifests created',
        validationCriteria: [
          'Resource limits defined',
          'Health probes configured',
          'Secrets externalized',
          'Kustomize structure'
        ],
        commonMistakes: ['No resource limits', 'Hardcoded secrets', 'No health checks']
      },
      {
        stepNumber: 6,
        instruction: 'Configure ArgoCD Application for GitOps',
        command: 'cat > argocd/application.yaml <<EOF\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: portfolio-app\n  namespace: argocd\nspec:\n  project: default\n  \n  source:\n    repoURL: https://github.com/myuser/portfolio-project\n    targetRevision: main\n    path: k8s/overlays/prod\n  \n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  \n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n      allowEmpty: false\n    syncOptions:\n    - CreateNamespace=true\n    retry:\n      limit: 5\n      backoff:\n        duration: 5s\n        factor: 2\n        maxDuration: 3m\n  \n  ignoreDifferences:\n  - group: apps\n    kind: Deployment\n    jsonPointers:\n    - /spec/replicas\nEOF',
        explanation: 'ArgoCD Application with automated sync, self-heal, pruning. Git as single source of truth. Ignores HPA-managed replica count. Production GitOps.',
        expectedOutput: 'ArgoCD app configured',
        validationCriteria: [
          'Automated sync enabled',
          'Self-healing active',
          'Retry configured',
          'Namespace auto-created'
        ],
        commonMistakes: ['Manual sync (not GitOps)', 'No retry logic']
      },
      {
        stepNumber: 7,
        instruction: 'Set up Prometheus monitoring',
        command: 'cat > monitoring/prometheus-values.yaml <<EOF\nprometheus:\n  prometheusSpec:\n    retention: 30d\n    storageSpec:\n      volumeClaimTemplate:\n        spec:\n          accessModes: ["ReadWriteOnce"]\n          resources:\n            requests:\n              storage: 50Gi\n    \n    additionalScrapeConfigs:\n    - job_name: app\n      kubernetes_sd_configs:\n      - role: pod\n      relabel_configs:\n      - source_labels: [__meta_kubernetes_pod_label_app]\n        action: keep\n        regex: backend\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]\n        action: keep\n        regex: true\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]\n        action: replace\n        target_label: __metrics_path__\n        regex: (.+)\n\nalerting:\n  alertmanagers:\n  - static_configs:\n    - targets: [\'alertmanager:9093\']\n\ngrafana:\n  enabled: true\n  adminPassword: changeme\n  persistence:\n    enabled: true\n    size: 10Gi\nEOF',
        explanation: 'Prometheus with 30-day retention, persistent storage, automatic pod discovery. Scrapes app metrics, sends alerts to AlertManager. Grafana for visualization.',
        expectedOutput: 'Monitoring configured',
        validationCriteria: [
          'Prometheus scraping pods',
          'Persistent storage configured',
          'Grafana integrated',
          'AlertManager connected'
        ],
        commonMistakes: ['No persistence (data loss)', 'Manual scrape configs']
      },
      {
        stepNumber: 8,
        instruction: 'Create SLO dashboard',
        command: 'cat > monitoring/slo-dashboard.json <<EOF\n{\n  "dashboard": {\n    "title": "Application SLOs",\n    "panels": [\n      {\n        "title": "Availability SLO (99.9%)",\n        "targets": [{\n          "expr": "sum(rate(http_requests_total{status=~\'2..|3..\'}[5m])) / sum(rate(http_requests_total[5m]))"\n        }],\n        "thresholds": [{"value": 0.999, "color": "green"}]\n      },\n      {\n        "title": "Latency SLO (p95 < 500ms)",\n        "targets": [{\n          "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"\n        }],\n        "thresholds": [{"value": 0.5, "color": "green"}]\n      },\n      {\n        "title": "Error Budget Remaining",\n        "targets": [{\n          "expr": "1 - ((1 - (sum(rate(http_requests_total{status=~\'2..|3..\'}[30d])) / sum(rate(http_requests_total[30d])))) / (1 - 0.999))"\n        }]\n      },\n      {\n        "title": "Deployment Frequency",\n        "targets": [{\n          "expr": "increase(argocd_app_sync_total{dest_namespace=\'production\'}[1d])"\n        }]\n      }\n    ]\n  }\n}\nEOF',
        explanation: 'SLO dashboard tracks: 99.9% availability, p95 latency <500ms, error budget consumption, deployment frequency. DORA metrics and SRE practices.',
        expectedOutput: 'SLO dashboard created',
        validationCriteria: [
          'Availability tracked',
          'Latency percentiles shown',
          'Error budget calculated',
          'Deployment frequency visible'
        ],
        commonMistakes: ['Vanity metrics', 'No SLOs defined']
      },
      {
        stepNumber: 9,
        instruction: 'Implement centralized logging with Loki',
        command: 'cat > logging/loki-stack.yaml <<EOF\nloki:\n  persistence:\n    enabled: true\n    size: 50Gi\n  config:\n    schema_config:\n      configs:\n      - from: 2024-01-01\n        store: boltdb-shipper\n        object_store: s3\n        schema: v11\n        index:\n          prefix: loki_index_\n          period: 24h\n    storage_config:\n      aws:\n        s3: s3://us-east-1/loki-logs\n        bucketnames: loki-logs\n    limits_config:\n      retention_period: 30d\n\npromtail:\n  config:\n    clients:\n    - url: http://loki:3100/loki/api/v1/push\n    snippets:\n      scrapeConfigs: |\n        - job_name: kubernetes-pods\n          kubernetes_sd_configs:\n          - role: pod\n          relabel_configs:\n          - source_labels: [__meta_kubernetes_pod_label_app]\n            target_label: app\n          - source_labels: [__meta_kubernetes_namespace]\n            target_label: namespace\nEOF',
        explanation: 'Loki for log aggregation with S3 storage, 30-day retention. Promtail collects pod logs, labels with app/namespace. Query logs in Grafana.',
        expectedOutput: 'Logging configured',
        validationCriteria: [
          'Loki collecting logs',
          'S3 backend for storage',
          'Retention configured',
          'Grafana integration'
        ],
        commonMistakes: ['Local storage only', 'No retention policy']
      },
      {
        stepNumber: 10,
        instruction: 'Add distributed tracing with Jaeger',
        command: 'cat > tracing/jaeger.yaml <<EOF\napiVersion: jaegertracing.io/v1\nkind: Jaeger\nmetadata:\n  name: jaeger\nspec:\n  strategy: production\n  \n  storage:\n    type: elasticsearch\n    options:\n      es:\n        server-urls: http://elasticsearch:9200\n    esIndexCleaner:\n      enabled: true\n      numberOfDays: 7\n  \n  ingress:\n    enabled: true\n    annotations:\n      kubernetes.io/ingress.class: nginx\n    hosts:\n    - jaeger.example.com\nEOF',
        explanation: 'Jaeger distributed tracing with Elasticsearch backend, 7-day retention. Traces requests across microservices, identifies bottlenecks. Production observability complete.',
        expectedOutput: 'Tracing configured',
        validationCriteria: [
          'Jaeger deployed',
          'Elasticsearch storage',
          'Index cleanup configured',
          'UI accessible'
        ],
        commonMistakes: ['In-memory storage (data loss)', 'No retention cleanup']
      },
      {
        stepNumber: 11,
        instruction: 'Create comprehensive README',
        command: 'cat > README.md <<EOF\n# DevOps Portfolio Project\n\n## Architecture\n![Architecture Diagram](./docs/architecture.png)\n\n**Tech Stack**: Node.js, PostgreSQL, Redis, Kubernetes, Terraform, ArgoCD\n\n## Infrastructure\n- **Cloud**: AWS (EKS, RDS, ElastiCache, S3)\n- **IaC**: Terraform with modules and remote state\n- **Container Orchestration**: Amazon EKS\n- **GitOps**: ArgoCD automated deployments\n\n## CI/CD Pipeline\n1. **Code Push** → GitHub triggers workflow\n2. **Testing** → Unit tests, integration tests, coverage\n3. **Security Scanning** → Trivy (containers), OWASP ZAP (DAST)\n4. **Build** → Docker multi-stage build\n5. **Push** → Amazon ECR\n6. **Deploy** → ArgoCD syncs from Git\n\n## Observability\n- **Metrics**: Prometheus + Grafana dashboards\n- **Logs**: Loki centralized logging\n- **Tracing**: Jaeger distributed tracing\n- **SLOs**: 99.9% availability, p95 latency <500ms\n\n## Security\n- Non-root containers\n- Network policies + mTLS (Istio)\n- Secrets in Vault\n- RBAC + Pod Security Standards\n- Automated vulnerability scanning\n\n## Getting Started\n\\`\\`\\`bash\n# Deploy infrastructure\ncd infrastructure\nterraform init\nterraform apply\n\n# Deploy application\nkubectl apply -f argocd/application.yaml\n\\`\\`\\`\n\n## Monitoring\n- Grafana: https://grafana.example.com\n- Prometheus: https://prometheus.example.com\n- Jaeger: https://jaeger.example.com\n\n## Repository Structure\n\\`\\`\\`\n├── app/                   # Application code\n├── infrastructure/        # Terraform modules\n├── k8s/                   # Kubernetes manifests\n├── argocd/                # ArgoCD applications\n├── monitoring/            # Prometheus, Grafana\n├── .github/workflows/     # CI/CD pipelines\n└── docs/                  # Architecture diagrams\n\\`\\`\\`\nEOF',
        explanation: 'Professional README showcasing: architecture, tech stack, CI/CD flow, observability, security measures. Clear setup instructions. Demonstrates communication skills.',
        expectedOutput: 'Documentation created',
        validationCriteria: [
          'Architecture explained',
          'Tech stack listed',
          'Setup instructions clear',
          'Repository structure shown'
        ],
        commonMistakes: ['No README', 'Incomplete documentation']
      },
      {
        stepNumber: 12,
        instruction: 'Create portfolio presentation',
        command: 'cat > docs/PORTFOLIO.md <<EOF\n# DevOps Portfolio Project Highlights\n\n## Project Overview\nProduction-grade cloud-native application demonstrating:\n- Infrastructure as Code\n- GitOps deployment model\n- Complete observability\n- Security best practices\n- Cost optimization\n\n## Key Achievements\n✅ **Infrastructure**: Multi-region AWS with Terraform modules\n✅ **CI/CD**: Automated pipeline with quality gates (tests, security, coverage)\n✅ **GitOps**: ArgoCD automated sync with self-healing\n✅ **Observability**: Prometheus, Grafana, Loki, Jaeger (full stack)\n✅ **Security**: Vulnerability scanning, non-root containers, network policies\n✅ **SRE**: SLOs defined (99.9% availability), error budgets tracked\n\n## Technical Decisions\n\n### Why Kubernetes?\n- Industry standard for container orchestration\n- Declarative configuration\n- Rich ecosystem (Istio, ArgoCD, Prometheus)\n\n### Why GitOps?\n- Git as single source of truth\n- Auditable deployments\n- Automated rollback capability\n\n### Why Terraform Modules?\n- Reusable infrastructure components\n- Environment consistency (dev/staging/prod)\n- Team collaboration with remote state\n\n## Metrics\n- **Deployment Frequency**: 15+ per day\n- **Lead Time**: <10 minutes commit to production\n- **MTTR**: <5 minutes (automated rollback)\n- **Change Failure Rate**: <5%\n\n## Live Demo\n- **Application**: https://app.example.com\n- **Monitoring**: https://grafana.example.com\n- **Source Code**: https://github.com/myuser/portfolio\n\n## Skills Demonstrated\n- Cloud Infrastructure (AWS)\n- Container Orchestration (Kubernetes)\n- Infrastructure as Code (Terraform)\n- CI/CD (GitHub Actions)\n- GitOps (ArgoCD)\n- Observability (Prometheus, Grafana, Loki, Jaeger)\n- Security (Trivy, OPA, Network Policies)\n- SRE Practices (SLOs, Error Budgets)\nEOF',
        explanation: 'Portfolio highlights document for resume/interviews. Shows achievements, technical decisions, metrics, skills. Demonstrates impact and thought process.',
        expectedOutput: 'Portfolio highlights created',
        validationCriteria: [
          'Achievements quantified',
          'Technical decisions explained',
          'DORA metrics shown',
          'Skills listed'
        ],
        commonMistakes: ['No quantifiable results', 'Missing rationale']
      }
    ]
  },

  walk: {
    introduction: 'Apply capstone project concepts through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create Terraform module for EKS cluster.',
        template: `module "eks" {
  source = "__./MODULES/EKS__"
  
  cluster_name    = "\${var.environment}-cluster"
  cluster_version = "__1.28__"
  
  vpc_id          = module.vpc.__VPC_ID__
  subnet_ids      = module.vpc.__PRIVATE_SUBNET_IDS__
  
  node_groups = {
    general = {
      desired_size = __2__
      min_size     = 1
      max_size     = __5__
      
      instance_types = ["__T3.MEDIUM__"]
      capacity_type  = "ON_DEMAND"
      
      labels = {
        role = "general"
      }
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = "portfolio"
  }
}`,
        blanks: [
          {
            id: './MODULES/EKS',
            label: './MODULES/EKS',
            hint: 'Module path',
            correctValue: './modules/eks',
            validationPattern: 'modules.*eks'
          },
          {
            id: '1.28',
            label: '1.28',
            hint: 'Kubernetes version',
            correctValue: '1.28',
            validationPattern: '1\\.2[0-9]'
          },
          {
            id: 'VPC_ID',
            label: 'VPC_ID',
            hint: 'VPC output',
            correctValue: 'vpc_id',
            validationPattern: 'vpc.*id'
          },
          {
            id: 'PRIVATE_SUBNET_IDS',
            label: 'PRIVATE_SUBNET_IDS',
            hint: 'Subnet output',
            correctValue: 'private_subnet_ids',
            validationPattern: 'private.*subnet'
          },
          {
            id: '2',
            label: '2',
            hint: 'Desired nodes',
            correctValue: '2',
            validationPattern: '2'
          },
          {
            id: '5',
            label: '5',
            hint: 'Max nodes',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: 'T3.MEDIUM',
            label: 'T3.MEDIUM',
            hint: 'Instance type',
            correctValue: 't3.medium',
            validationPattern: 't3'
          }
        ],
        solution: 'EKS module creates managed Kubernetes cluster with node group: 2-5 t3.medium instances in private subnets. Demonstrates IaC modularity and reusability.',
        explanation: 'Terraform modules make infrastructure reusable across environments'
      },
      {
        exerciseNumber: 2,
        scenario: 'Create ArgoCD Application with health checks.',
        template: `apiVersion: argoproj.io/__V1ALPHA1__
kind: __APPLICATION__
metadata:
  name: portfolio-app
  namespace: __ARGOCD__
spec:
  project: __DEFAULT__
  
  source:
    repoURL: https://github.com/myuser/portfolio
    targetRevision: __MAIN__
    path: k8s/overlays/__PROD__
  
  destination:
    server: https://kubernetes.default.svc
    namespace: __PRODUCTION__
  
  syncPolicy:
    automated:
      prune: __TRUE__
      selfHeal: __TRUE__
    syncOptions:
    - CreateNamespace=__TRUE__`,
        blanks: [
          {
            id: 'V1ALPHA1',
            label: 'V1ALPHA1',
            hint: 'API version',
            correctValue: 'v1alpha1',
            validationPattern: 'v1alpha1'
          },
          {
            id: 'APPLICATION',
            label: 'APPLICATION',
            hint: 'Resource kind',
            correctValue: 'Application',
            validationPattern: 'application'
          },
          {
            id: 'ARGOCD',
            label: 'ARGOCD',
            hint: 'ArgoCD namespace',
            correctValue: 'argocd',
            validationPattern: 'argocd'
          },
          {
            id: 'DEFAULT',
            label: 'DEFAULT',
            hint: 'Project name',
            correctValue: 'default',
            validationPattern: 'default'
          },
          {
            id: 'MAIN',
            label: 'MAIN',
            hint: 'Git branch',
            correctValue: 'main',
            validationPattern: 'main'
          },
          {
            id: 'PROD',
            label: 'PROD',
            hint: 'Environment overlay',
            correctValue: 'prod',
            validationPattern: 'prod'
          },
          {
            id: 'PRODUCTION',
            label: 'PRODUCTION',
            hint: 'Target namespace',
            correctValue: 'production',
            validationPattern: 'prod'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Prune enabled',
            correctValue: 'true',
            validationPattern: 'true'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Self-heal enabled',
            correctValue: 'true',
            validationPattern: 'true'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Create namespace',
            correctValue: 'true',
            validationPattern: 'true'
          }
        ],
        solution: 'ArgoCD Application deploys from Git (main/k8s/overlays/prod) to production namespace. Automated sync with prune and self-heal. GitOps in action.',
        explanation: 'GitOps uses Git as single source of truth for declarative infrastructure'
      },
      {
        exerciseNumber: 3,
        scenario: 'Create Grafana dashboard for SLOs.',
        template: `{
  "dashboard": {
    "title": "Application __SLO__ Dashboard",
    "panels": [
      {
        "title": "Availability SLO (__99.9%__)",
        "targets": [{
          "expr": "sum(rate(http_requests_total{status=~'2..|3..'}[5m])) / sum(rate(__HTTP_REQUESTS_TOTAL__[5m]))"
        }],
        "thresholds": [{"value": __0.999__, "color": "green"}]
      },
      {
        "title": "Latency SLO (p95 < __500MS__)",
        "targets": [{
          "expr": "histogram_quantile(__0.95__, rate(http_request_duration_seconds_bucket[5m]))"
        }],
        "thresholds": [{"value": __0.5__, "color": "green"}]
      },
      {
        "title": "__ERROR_BUDGET__ Remaining",
        "targets": [{
          "expr": "1 - ((1 - (sum(rate(http_requests_total{status=~'2..|3..'}[30d])) / sum(rate(http_requests_total[30d])))) / (1 - 0.999))"
        }]
      }
    ]
  }
}`,
        blanks: [
          {
            id: 'SLO',
            label: 'SLO',
            hint: 'Service Level Objective',
            correctValue: 'SLO',
            validationPattern: 'slo'
          },
          {
            id: '99.9%',
            label: '99.9%',
            hint: 'Availability target',
            correctValue: '99.9%',
            validationPattern: '99'
          },
          {
            id: 'HTTP_REQUESTS_TOTAL',
            label: 'HTTP_REQUESTS_TOTAL',
            hint: 'Metric name',
            correctValue: 'http_requests_total',
            validationPattern: 'http.*requests'
          },
          {
            id: '0.999',
            label: '0.999',
            hint: 'Threshold value',
            correctValue: '0.999',
            validationPattern: '0\\.999'
          },
          {
            id: '500MS',
            label: '500MS',
            hint: 'Latency target',
            correctValue: '500ms',
            validationPattern: '500'
          },
          {
            id: '0.95',
            label: '0.95',
            hint: 'Percentile',
            correctValue: '0.95',
            validationPattern: '0\\.95'
          },
          {
            id: '0.5',
            label: '0.5',
            hint: 'Seconds threshold',
            correctValue: '0.5',
            validationPattern: '0\\.5'
          },
          {
            id: 'ERROR_BUDGET',
            label: 'ERROR_BUDGET',
            hint: 'Budget type',
            correctValue: 'Error Budget',
            validationPattern: 'error.*budget'
          }
        ],
        solution: 'SLO dashboard tracks: 99.9% availability (success rate), p95 latency <500ms, error budget remaining (30-day window). SRE practices demonstrated.',
        explanation: 'SLOs define reliability targets; error budgets balance velocity and stability'
      },
      {
        exerciseNumber: 4,
        scenario: 'Create comprehensive CI pipeline with security scanning.',
        template: `name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: __UBUNTU-LATEST__
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: __20__
          cache: __NPM__
      - run: npm __CI__
      - run: npm test -- --__COVERAGE__
  
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: __FS__
          severity: __CRITICAL,HIGH__
  
  build:
    needs: [test, __SECURITY__]
    if: github.ref == 'refs/heads/__MAIN__'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app:latest .`,
        blanks: [
          {
            id: 'UBUNTU-LATEST',
            label: 'UBUNTU-LATEST',
            hint: 'Runner',
            correctValue: 'ubuntu-latest',
            validationPattern: 'ubuntu'
          },
          {
            id: '20',
            label: '20',
            hint: 'Node version',
            correctValue: '20',
            validationPattern: '20'
          },
          {
            id: 'NPM',
            label: 'NPM',
            hint: 'Cache type',
            correctValue: 'npm',
            validationPattern: 'npm'
          },
          {
            id: 'CI',
            label: 'CI',
            hint: 'Install command',
            correctValue: 'ci',
            validationPattern: 'ci'
          },
          {
            id: 'COVERAGE',
            label: 'COVERAGE',
            hint: 'Test flag',
            correctValue: 'coverage',
            validationPattern: 'coverage'
          },
          {
            id: 'FS',
            label: 'FS',
            hint: 'Scan type',
            correctValue: 'fs',
            validationPattern: 'fs'
          },
          {
            id: 'CRITICAL,HIGH',
            label: 'CRITICAL,HIGH',
            hint: 'Severity levels',
            correctValue: 'CRITICAL,HIGH',
            validationPattern: 'critical'
          },
          {
            id: 'SECURITY',
            label: 'SECURITY',
            hint: 'Job dependency',
            correctValue: 'security',
            validationPattern: 'security'
          },
          {
            id: 'MAIN',
            label: 'MAIN',
            hint: 'Branch name',
            correctValue: 'main',
            validationPattern: 'main'
          }
        ],
        solution: 'CI pipeline: test job (unit tests + coverage), security job (Trivy vulnerability scan), build job (only on main after tests pass). Quality gates enforced.',
        explanation: 'Automated CI with quality gates ensures code quality before deployment'
      },
      {
        exerciseNumber: 5,
        scenario: 'Document project in professional README.',
        template: `# DevOps Portfolio Project

## Architecture
**Tech Stack**: Node.js, __POSTGRESQL__, Redis, __KUBERNETES__, Terraform

## Infrastructure
- **Cloud**: __AWS__ (EKS, RDS, S3)
- **IaC**: __TERRAFORM__ with modules
- **GitOps**: __ARGOCD__ deployments

## CI/CD Pipeline
1. Code Push → __GITHUB__ Actions
2. Testing → Unit tests, __COVERAGE__
3. Security → __TRIVY__ scanning
4. Build → Docker __MULTI-STAGE__
5. Deploy → ArgoCD __SYNC__

## Observability
- **Metrics**: __PROMETHEUS__ + Grafana
- **Logs**: __LOKI__ centralized
- **Tracing**: __JAEGER__ distributed
- **SLOs**: __99.9%__ availability

## Skills Demonstrated
- Infrastructure as __CODE__
- Container __ORCHESTRATION__
- __CI/CD__ automation
- __GITOPS__ deployment`,
        blanks: [
          {
            id: 'POSTGRESQL',
            label: 'POSTGRESQL',
            hint: 'Database',
            correctValue: 'PostgreSQL',
            validationPattern: 'postgres'
          },
          {
            id: 'KUBERNETES',
            label: 'KUBERNETES',
            hint: 'Orchestrator',
            correctValue: 'Kubernetes',
            validationPattern: 'kubernetes'
          },
          {
            id: 'AWS',
            label: 'AWS',
            hint: 'Cloud provider',
            correctValue: 'AWS',
            validationPattern: 'aws'
          },
          {
            id: 'TERRAFORM',
            label: 'TERRAFORM',
            hint: 'IaC tool',
            correctValue: 'Terraform',
            validationPattern: 'terraform'
          },
          {
            id: 'ARGOCD',
            label: 'ARGOCD',
            hint: 'GitOps tool',
            correctValue: 'ArgoCD',
            validationPattern: 'argo'
          },
          {
            id: 'GITHUB',
            label: 'GITHUB',
            hint: 'CI platform',
            correctValue: 'GitHub',
            validationPattern: 'github'
          },
          {
            id: 'COVERAGE',
            label: 'COVERAGE',
            hint: 'Test metric',
            correctValue: 'coverage',
            validationPattern: 'coverage'
          },
          {
            id: 'TRIVY',
            label: 'TRIVY',
            hint: 'Security scanner',
            correctValue: 'Trivy',
            validationPattern: 'trivy'
          },
          {
            id: 'MULTI-STAGE',
            label: 'MULTI-STAGE',
            hint: 'Build type',
            correctValue: 'multi-stage',
            validationPattern: 'multi'
          },
          {
            id: 'SYNC',
            label: 'SYNC',
            hint: 'ArgoCD operation',
            correctValue: 'sync',
            validationPattern: 'sync'
          },
          {
            id: 'PROMETHEUS',
            label: 'PROMETHEUS',
            hint: 'Metrics tool',
            correctValue: 'Prometheus',
            validationPattern: 'prometheus'
          },
          {
            id: 'LOKI',
            label: 'LOKI',
            hint: 'Logging tool',
            correctValue: 'Loki',
            validationPattern: 'loki'
          },
          {
            id: 'JAEGER',
            label: 'JAEGER',
            hint: 'Tracing tool',
            correctValue: 'Jaeger',
            validationPattern: 'jaeger'
          },
          {
            id: '99.9%',
            label: '99.9%',
            hint: 'SLO target',
            correctValue: '99.9%',
            validationPattern: '99'
          },
          {
            id: 'CODE',
            label: 'CODE',
            hint: 'IaC principle',
            correctValue: 'Code',
            validationPattern: 'code'
          },
          {
            id: 'ORCHESTRATION',
            label: 'ORCHESTRATION',
            hint: 'Container skill',
            correctValue: 'Orchestration',
            validationPattern: 'orchestration'
          },
          {
            id: 'CI/CD',
            label: 'CI/CD',
            hint: 'Pipeline skill',
            correctValue: 'CI/CD',
            validationPattern: 'ci'
          },
          {
            id: 'GITOPS',
            label: 'GITOPS',
            hint: 'Deployment model',
            correctValue: 'GitOps',
            validationPattern: 'git'
          }
        ],
        solution: 'Professional README documents: architecture, tech stack, CI/CD flow, observability stack, skills demonstrated. Clear, concise, comprehensive. Portfolio-ready.',
        explanation: 'Documentation demonstrates communication skills and professionalism'
      }
    ],
    hints: [
      'Terraform modules enable infrastructure reusability',
      'ArgoCD automated sync implements GitOps principles',
      'SLO dashboards track reliability targets',
      'CI pipelines enforce quality gates before deployment',
      'Professional documentation showcases communication skills'
    ]
  },

  runGuided: {
    objective: 'Build complete DevOps portfolio project with production infrastructure, CI/CD, monitoring, security, and documentation',
    conceptualGuidance: [
      'Design architecture: multi-tier app, cloud infrastructure, CI/CD',
      'Implement IaC: Terraform modules for VPC, EKS, RDS, monitoring',
      'Build application: containerized with Dockerfile, health checks',
      'Create CI/CD: GitHub Actions with tests, security scanning, build',
      'Deploy GitOps: ArgoCD Applications with automated sync',
      'Set up observability: Prometheus, Grafana, Loki, Jaeger',
      'Define SLOs: availability, latency, error budget tracking',
      'Implement security: vulnerability scanning, RBAC, network policies',
      'Document thoroughly: README, architecture diagrams, runbooks',
      'Create portfolio presentation: achievements, decisions, metrics'
    ],
    keyConceptsToApply: [
      'Infrastructure as Code with modules',
      'GitOps deployment model',
      'Complete observability (metrics, logs, traces)',
      'SRE practices (SLOs, error budgets)',
      'Security scanning and hardening'
    ],
    checkpoints: [
      {
        checkpoint: 'Infrastructure deployed with IaC',
        description: 'Cloud resources managed by Terraform',
        validationCriteria: [
          'Terraform modules for VPC, EKS, RDS',
          'Remote state in S3 with locking',
          'Multi-environment support (dev, staging, prod)',
          'Resources tagged appropriately',
          'State stored securely',
          'Infrastructure documented'
        ],
        hintIfStuck: 'Create Terraform modules following DRY principle. Use S3 backend for state. Define variables for environment-specific configs. Apply to dev first, then staging/prod.'
      },
      {
        checkpoint: 'CI/CD pipeline operational',
        description: 'Automated build, test, security, deploy',
        validationCriteria: [
          'GitHub Actions workflow defined',
          'Tests run on every PR',
          'Security scanning with Trivy',
          'Coverage tracked',
          'Images pushed to ECR',
          'ArgoCD deploys on merge'
        ],
        hintIfStuck: 'Create .github/workflows/ci.yml with jobs: test, security, build. Use needs to enforce order. Push images to ECR. ArgoCD watches for new images.'
      },
      {
        checkpoint: 'Complete observability stack',
        description: 'Metrics, logs, traces, SLO dashboards',
        validationCriteria: [
          'Prometheus scraping metrics',
          'Grafana dashboards for SLOs',
          'Loki collecting logs',
          'Jaeger tracing requests',
          'AlertManager configured',
          'SLOs tracked (availability, latency)'
        ],
        hintIfStuck: 'Install kube-prometheus-stack. Add Loki-stack. Deploy Jaeger operator. Create Grafana dashboards for SLOs. Configure alerts for SLO violations.'
      }
    ],
    resourcesAllowed: [
      'Terraform documentation',
      'Kubernetes documentation',
      'ArgoCD documentation',
      'Prometheus best practices',
      'SRE workbook'
    ]
  },

  runIndependent: {
    objective: 'Build production-grade DevOps portfolio project demonstrating complete infrastructure, CI/CD, observability, security, SRE practices, and professional documentation',
    successCriteria: [
      'Infrastructure: Terraform modules for multi-tier app (VPC, EKS, RDS, cache, storage)',
      'Application: Containerized with multi-stage Dockerfile, non-root, health checks',
      'CI/CD: Automated pipeline (test, lint, security scan, build, push) with quality gates',
      'GitOps: ArgoCD Applications with automated sync, self-heal, multi-environment',
      'Observability: Prometheus metrics, Grafana dashboards, Loki logs, Jaeger traces',
      'SLOs: Defined and tracked (99.9% availability, p95 latency <500ms, error budget)',
      'Security: Trivy scanning, non-root containers, RBAC, network policies, Vault secrets',
      'Cost optimization: Resource limits, autoscaling, right-sizing, S3 lifecycle',
      'Documentation: Professional README, architecture diagrams, runbooks, ADRs',
      'Portfolio: Highlights document with achievements, metrics, technical decisions, live demo'
    ],
    timeTarget: 25,
    minimumRequirements: [
      'Infrastructure deployed via Terraform',
      'CI/CD pipeline operational',
      'Application running with monitoring'
    ],
    evaluationRubric: [
      {
        criterion: 'Infrastructure & IaC',
        weight: 25,
        passingThreshold: 'Terraform modules for all infrastructure. Remote state with locking. Multi-environment (dev/staging/prod). Resources properly sized and tagged. Security groups restrictive. Costs optimized.'
      },
      {
        criterion: 'CI/CD & GitOps',
        weight: 25,
        passingThreshold: 'Automated CI with tests, coverage, security scanning. Quality gates enforced. GitOps with ArgoCD automated sync. Deployment <10min. Rollback functional. Multi-environment promotion.'
      },
      {
        criterion: 'Observability & SRE',
        weight: 25,
        passingThreshold: 'Complete stack: Prometheus, Grafana, Loki, Jaeger. SLOs defined and tracked. Error budgets calculated. Alerts configured. Dashboards comprehensive. DORA metrics visible.'
      },
      {
        criterion: 'Documentation & Presentation',
        weight: 25,
        passingThreshold: 'Professional README with architecture, setup, monitoring. Portfolio highlights with achievements and metrics. Technical decisions explained. Live demo available. Communication clear.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=nvp0VI_EqKE',
  documentation: [
    'https://www.terraform.io/docs',
    'https://kubernetes.io/docs',
    'https://argo-cd.readthedocs.io',
    'https://prometheus.io/docs',
    'https://sre.google/books/',
    'https://github.com/readme/guides'
  ],
  relatedConcepts: [
    'Infrastructure as Code',
    'GitOps deployment model',
    'Complete observability stack',
    'SRE practices and SLOs',
    'Portfolio presentation',
    'Technical documentation'
  ]
};

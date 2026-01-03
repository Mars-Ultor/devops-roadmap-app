import type { LeveledLessonContent } from '../types/lessonContent';

export const week7Lesson3DeploymentsServices: LeveledLessonContent = {
  lessonId: 'week7-lesson3-deployments-services',
  baseLesson: {
    title: 'Deployments & Services',
    description: 'Master production deployment patterns, service networking, and operational practices for Kubernetes applications.',
    learningObjectives: [
      'Implement production-ready deployment strategies',
      'Configure advanced service networking patterns',
      'Manage application configuration and secrets',
      'Implement health checks and resource management',
      'Perform zero-downtime updates and rollbacks'
    ],
    prerequisites: ['Kubernetes basics', 'kubectl proficiency', 'YAML manifests', 'Container networking'],
    estimatedTimePerLevel: {
      crawl: 120,
      walk: 60,
      runGuided: 90,
      runIndependent: 180
    }
  },
  crawl: {
    introduction: 'Learn advanced Kubernetes patterns for production deployments, including multi-tier applications, configuration management, and operational best practices.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Create a multi-tier application with frontend, API, and database',
        command: `# Create namespace for isolation:
kubectl create namespace myapp

# Deploy database (PostgreSQL):
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: myapp
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: myapp
        - name: POSTGRES_USER
          value: appuser
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
EOF

# Create database secret:
kubectl create secret generic postgres-secret --from-literal=password=mysecretpassword -n myapp

# Create database service:
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: myapp
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
EOF`,
        explanation: 'Multi-tier applications need careful planning. We use StatefulSet for database (persistent identity and storage), ClusterIP Service for internal access, and Secrets for passwords. Namespace provides isolation. VolumeClaimTemplates create persistent storage that survives pod restarts.',
        expectedOutput: 'StatefulSet, Secret, and Service created successfully, postgres pod running with persistent volume',
        validationCriteria: [
          'StatefulSet creates postgres pod with persistent volume',
          'Secret contains password',
          'Service provides stable DNS name postgres.myapp.svc.cluster.local',
          'Database accessible internally'
        ],
        commonMistakes: [
          'Forgetting namespace in kubectl commands',
          'Using Deployment instead of StatefulSet for database (loses data on restart)',
          'Not creating Secret before StatefulSet (pod fails to start)',
          'Wrong volume mount path for PostgreSQL'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Deploy API tier with configuration management',
        command: `# Create ConfigMap for API configuration:
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: myapp
data:
  NODE_ENV: production
  PORT: "3000"
  DATABASE_URL: postgres://appuser:mysecretpassword@postgres.myapp.svc.cluster.local:5432/myapp
EOF

# Deploy API:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: node:18-alpine
        command: ["node", "server.js"]
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: api-config
        - secretRef:
            name: api-secret
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
EOF

# Create API secret:
kubectl create secret generic api-secret --from-literal=JWT_SECRET=myjwtsecret -n myapp

# Create API service:
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: myapp
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 3000
EOF`,
        explanation: 'ConfigMaps store non-sensitive configuration, Secrets for sensitive data. envFrom injects all values as environment variables. Resources prevent starvation and ensure scheduling. Readiness probes ensure traffic only goes to ready pods, liveness probes restart unhealthy containers.',
        expectedOutput: 'ConfigMap, Secret, Deployment with 3 replicas, Service created, all pods running and ready',
        validationCriteria: [
          'ConfigMap contains environment variables',
          'Secret contains JWT secret',
          'API pods have resource requests/limits',
          'Readiness and liveness probes configured',
          'All 3 API pods running and passing health checks'
        ],
        commonMistakes: [
          'Hardcoding secrets in ConfigMap (use Secrets for sensitive data)',
          'Not setting resource requests (pods may not schedule or starve resources)',
          'Wrong probe paths (must match actual API endpoints)',
          'Forgetting envFrom syntax (env vs envFrom)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Deploy frontend with external access',
        command: `# Create frontend ConfigMap:
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: myapp
data:
  API_URL: http://api.myapp.svc.cluster.local
EOF

# Deploy frontend:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: nginx:alpine
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: frontend-config
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 200m
            memory: 128Mi
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
EOF

# Create frontend service with LoadBalancer:
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: myapp
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
EOF`,
        explanation: 'Frontend uses nginx to serve static files. ConfigMap provides API URL. LoadBalancer Service provisions external load balancer (AWS ELB, GCP Load Balancer). External users access via LoadBalancer IP/DNS. Frontend calls API via internal Service DNS.',
        expectedOutput: 'Frontend deployment with 3 replicas, LoadBalancer Service created, external IP assigned',
        validationCriteria: [
          'Frontend pods running with nginx',
          'LoadBalancer Service gets external IP (cloud) or NodePort (local)',
          'Frontend can reach API via internal DNS',
          'External access works via LoadBalancer'
        ],
        commonMistakes: [
          'Using ClusterIP for frontend (not externally accessible)',
          'Wrong API URL in ConfigMap (must use internal Service DNS)',
          'Not setting readiness probe for nginx (traffic to unhealthy pods)',
          'LoadBalancer not working on local clusters (use NodePort instead)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Implement HorizontalPodAutoscaler for automatic scaling',
        command: `# Enable metrics server (required for HPA):
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Wait for metrics server to be ready:
kubectl get deployment metrics-server -n kube-system

# Create HPA for API:
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: myapp
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF

# Check HPA status:
kubectl get hpa -n myapp

# Generate load to trigger scaling:
kubectl run load-generator --image=busybox --rm -it --restart=Never -- sh -c "while true; do wget -q -O- http://api.myapp.svc.cluster.local/health; done"`,
        explanation: 'HPA automatically scales pods based on CPU/memory utilization. Metrics server collects resource metrics. HPA maintains target utilization by adding/removing pods. Multiple metrics can be used (CPU + memory). Load testing triggers scaling up.',
        expectedOutput: 'HPA created, shows current replicas and target utilization, pods scale up under load',
        validationCriteria: [
          'HPA created and shows metrics',
          'Pods scale up when CPU exceeds 70%',
          'Pods scale down when load decreases',
          'Stays within min/max replica bounds'
        ],
        commonMistakes: [
          'Metrics server not installed (HPA shows <unknown> metrics)',
          'No resource requests on pods (HPA can\'t calculate utilization)',
          'Too low minReplicas (can\'t handle traffic spikes)',
          'Too high maxReplicas (cost explosion under attack)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Configure Ingress for HTTP routing and SSL termination',
        command: `# Install NGINX Ingress Controller (if not already installed):
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Create Ingress for frontend:
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  namespace: myapp
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
EOF

# Create TLS secret (for demo - use cert-manager in production):
kubectl create secret tls myapp-tls --key /path/to/tls.key --cert /path/to/tls.crt -n myapp

# Check Ingress:
kubectl get ingress -n myapp

# Test access (update DNS or /etc/hosts to point myapp.example.com to Ingress IP)`,
        explanation: 'Ingress provides HTTP/HTTPS routing, SSL termination, and path-based routing. NGINX Ingress Controller handles traffic. Annotations control behavior (rewrites, rate limiting). TLS secrets enable HTTPS. Multiple hosts and paths supported.',
        expectedOutput: 'Ingress created, routes traffic to frontend service, HTTPS enabled with TLS secret',
        validationCriteria: [
          'Ingress shows ADDRESS (load balancer IP)',
          'HTTP requests route to frontend pods',
          'HTTPS works with valid certificate',
          'Host-based routing works (myapp.example.com)'
        ],
        commonMistakes: [
          'Ingress controller not installed (traffic not routed)',
          'Wrong ingressClassName (must match controller)',
          'TLS secret not created (HTTPS fails)',
          'DNS not pointing to Ingress IP (requests fail)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Implement rolling updates with blue-green deployment strategy',
        command: `# Update API with new image (rolling update):
kubectl set image deployment/api api=node:19-alpine -n myapp

# Watch rollout:
kubectl rollout status deployment/api -n myapp

# Check rollout history:
kubectl rollout history deployment/api -n myapp

# For blue-green: Create new deployment with different labels:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-green
  namespace: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
      version: green
  template:
    metadata:
      labels:
        app: api
        version: green
    spec:
      containers:
      - name: api
        image: node:19-alpine
        ports:
        - containerPort: 3000
EOF

# Switch service to green version:
kubectl patch service api -p '{"spec":{"selector":{"app":"api","version":"green"}}}' -n myapp

# Verify traffic switched:
kubectl get pods -l app=api -n myapp

# Delete blue deployment after verification:
kubectl delete deployment api -n myapp`,
        explanation: 'Rolling updates gradually replace pods (default). Blue-green creates parallel deployment, then switches Service selector. Zero downtime, easy rollback (switch selector back). Blue-green uses more resources but safer for complex changes.',
        expectedOutput: 'Rolling update completes without downtime, blue-green deployment switches traffic instantly',
        validationCriteria: [
          'Rolling update maintains service availability',
          'Blue-green switches all traffic at once',
          'Service selector change routes to new pods',
          'Old deployment can be kept for rollback'
        ],
        commonMistakes: [
          'Not waiting for rollout to complete before declaring success',
          'Blue-green: forgetting to update Service selector (traffic still goes to blue)',
          'Resource constraints during blue-green (double the pods)',
          'Not testing new version before switching traffic'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Set up monitoring with Prometheus and Grafana',
        command: `# Install kube-prometheus-stack (includes Prometheus, Grafana, AlertManager):
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Wait for pods to be ready:
kubectl get pods -n monitoring

# Get Grafana admin password:
kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" -n monitoring | base64 -d

# Port forward Grafana:
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring

# Access Grafana at http://localhost:3000 (admin/admin-password)

# Check Prometheus metrics:
kubectl port-forward svc/monitoring-prometheus 9090:9090 -n monitoring

# Query metrics at http://localhost:9090 (e.g., container_cpu_usage_seconds_total)`,
        explanation: 'kube-prometheus-stack provides production monitoring. Prometheus collects metrics, Grafana visualizes them. AlertManager handles alerts. Pre-configured dashboards for Kubernetes monitoring. Port forwarding enables local access.',
        expectedOutput: 'Prometheus and Grafana deployed, accessible via port forwarding, Kubernetes metrics collected',
        validationCriteria: [
          'All monitoring pods running',
          'Grafana accessible with admin credentials',
          'Kubernetes dashboards available',
          'Custom metrics can be queried in Prometheus'
        ],
        commonMistakes: [
          'Helm not installed (use kubectl apply for manifests instead)',
          'Port forwarding conflicts (choose different local ports)',
          'Security groups blocking access (open ports in cloud)',
          'Not waiting for all components to be ready'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Implement logging with centralized log aggregation',
        command: `# Install Elasticsearch, Fluent Bit, Kibana (EFK stack):
kubectl apply -f https://raw.githubusercontent.com/fluent/fluent-bit-kubernetes-logging/main/output/elasticsearch/fluent-bit-configmap.yaml
kubectl apply -f https://raw.githubusercontent.com/fluent/fluent-bit-kubernetes-logging/main/output/elasticsearch/fluent-bit-ds.yaml

# Install Elasticsearch and Kibana with Helm:
helm repo add elastic https://helm.elastic.co
helm repo update
helm install elasticsearch elastic/elasticsearch -n logging --create-namespace --set replicas=1
helm install kibana elastic/kibana -n logging

# Wait for components:
kubectl get pods -n logging

# Port forward Kibana:
kubectl port-forward svc/kibana-kibana 5601:5601 -n logging

# Access Kibana at http://localhost:5601

# View logs from pods:
kubectl logs -f deployment/api -n myapp

# Search logs in Kibana (create index pattern for fluent-bit*)`,
        explanation: 'Fluent Bit collects logs from all pods and sends to Elasticsearch. Kibana provides search and visualization. EFK stack enables centralized logging. Structured logging in applications enables better querying.',
        expectedOutput: 'EFK stack deployed, logs collected from all pods, searchable in Kibana',
        validationCriteria: [
          'Fluent Bit collecting logs from all namespaces',
          'Elasticsearch storing logs',
          'Kibana accessible for log search',
          'Application logs visible with pod metadata'
        ],
        commonMistakes: [
          'Resource constraints (Elasticsearch needs significant CPU/memory)',
          'Not configuring log parsing (logs as plain text)',
          'Security (EFK exposed externally without authentication)',
          'Log retention not configured (disk fills up)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Implement backup and disaster recovery',
        command: `# Backup database with pg_dump:
kubectl run pg-backup --image=postgres:15-alpine --rm -it --restart=Never -n myapp -- \
  pg_dump -h postgres.myapp.svc.cluster.local -U appuser -d myapp > /tmp/backup.sql

# Copy backup to local:
kubectl cp myapp/pg-backup:/tmp/backup.sql ./backup.sql

# For automated backups, create CronJob:
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
  namespace: myapp
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - pg_dump
            - -h
            - postgres.myapp.svc.cluster.local
            - -U
            - appuser
            - -d
            - myapp
            - -f
            - /backup/backup.sql
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: Never
EOF

# Create backup PVC:
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backup-pvc
  namespace: myapp
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
EOF`,
        explanation: 'Database backups critical for DR. pg_dump creates logical backup. CronJob automates daily backups. PVC provides persistent storage for backups. In production, use cloud storage (S3) and backup tools like Velero for cluster backups.',
        expectedOutput: 'Manual backup succeeds, CronJob created for automated backups, backups stored on PVC',
        validationCriteria: [
          'pg_dump creates valid SQL backup',
          'CronJob runs on schedule',
          'Backups stored persistently',
          'Backup can be restored (test with new database)'
        ],
        commonMistakes: [
          'Running backup during peak hours (schedule off-peak)',
          'No password environment variable (connection fails)',
          'Not testing backup restoration',
          'Insufficient PVC storage for backups'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Set up CI/CD pipeline for automated deployments',
        command: `# Create GitHub Actions workflow (.github/workflows/deploy.yml):
cat > .github/workflows/deploy.yml <<EOF
name: Deploy to Kubernetes
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
    
    - name: Build and push API image
      run: |
        docker build -t \${{ steps.login-ecr.outputs.registry }}/myapp-api:\${{ github.sha }} ./api
        docker push \${{ steps.login-ecr.outputs.registry }}/myapp-api:\${{ github.sha }}
    
    - name: Update deployment
      run: |
        aws eks update-kubeconfig --region us-east-1 --name my-cluster
        sed -i 's|image:.*|image: \${{ steps.login-ecr.outputs.registry }}/myapp-api:\${{ github.sha }}|g' k8s/api-deployment.yaml
        kubectl apply -f k8s/
        kubectl rollout status deployment/api -n myapp
EOF

# Store manifests in k8s/ directory:
mkdir k8s
# Copy all YAML manifests to k8s/ directory

# Push to GitHub, trigger deployment on merge to main`,
        explanation: 'GitHub Actions builds Docker images, pushes to ECR, updates Kubernetes manifests, applies to cluster. Automated deployment on every main branch push. Rollout status ensures deployment succeeds.',
        expectedOutput: 'GitHub Actions workflow created, triggers on push to main, builds and deploys successfully',
        validationCriteria: [
          'Workflow runs on push to main',
          'Docker image built and pushed to registry',
          'Kubernetes manifests updated and applied',
          'Rollout completes successfully'
        ],
        commonMistakes: [
          'AWS credentials not in GitHub secrets',
          'Wrong ECR registry URL',
          'Manifest paths incorrect in workflow',
          'Not waiting for rollout status (deployment may fail silently)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Implement security best practices',
        command: `# Create NetworkPolicy to restrict traffic:
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
  namespace: myapp
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
        port: 3000
EOF

# Create ServiceAccount with minimal permissions:
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-sa
  namespace: myapp
EOF

# Use security context:
kubectl patch deployment api -p '{
  "spec": {
    "template": {
      "spec": {
        "serviceAccountName": "api-sa",
        "securityContext": {
          "runAsNonRoot": true,
          "runAsUser": 1000
        },
        "containers": [{
          "name": "api",
          "securityContext": {
            "allowPrivilegeEscalation": false,
            "readOnlyRootFilesystem": true,
            "runAsNonRoot": true,
            "runAsUser": 1000,
            "capabilities": {
              "drop": ["ALL"]
            }
          }
        }]
      }
    }
  }
}' -n myapp

# Scan for vulnerabilities:
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: trivy-scan
  namespace: myapp
spec:
  restartPolicy: Never
  containers:
  - name: trivy
    image: aquasecurity/trivy:latest
    command: ["trivy", "image", "node:18-alpine"]
EOF`,
        explanation: 'NetworkPolicy restricts pod-to-pod communication. ServiceAccount provides identity. Security context runs containers as non-root, drops capabilities. Trivy scans for vulnerabilities. RBAC limits permissions.',
        expectedOutput: 'NetworkPolicy blocks unauthorized traffic, pods run with security context, vulnerability scan completes',
        validationCriteria: [
          'NetworkPolicy allows only frontend→API traffic',
          'Pods run as non-root user',
          'Capabilities dropped',
          'Trivy identifies known vulnerabilities'
        ],
        commonMistakes: [
          'NetworkPolicy too restrictive (blocks legitimate traffic)',
          'Security context breaks application (wrong user ID)',
          'Not scanning images regularly',
          'RBAC too permissive (principle of least privilege)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Troubleshoot common production issues',
        command: `# Check pod status and events:
kubectl get pods -n myapp
kubectl describe pod <pod-name> -n myapp
kubectl get events --sort-by=.metadata.creationTimestamp -n myapp

# Debug container issues:
kubectl logs <pod-name> -n myapp --previous
kubectl exec -it <pod-name> -n myapp -- /bin/sh

# Check resource usage:
kubectl top pods -n myapp
kubectl top nodes

# Debug networking:
kubectl get services -n myapp
kubectl get endpoints -n myapp
kubectl run test --image=curlimages/curl --rm -it --restart=Never -- curl http://api.myapp.svc.cluster.local

# Check cluster health:
kubectl get componentstatuses
kubectl cluster-info

# Debug deployments:
kubectl rollout status deployment/api -n myapp
kubectl rollout history deployment/api -n myapp`,
        explanation: 'Systematic troubleshooting: check status first, then events, logs, resources, networking. kubectl describe provides comprehensive information. --previous shows crashed container logs. kubectl top shows resource usage.',
        expectedOutput: 'All debugging commands work, issues identified and resolved using kubectl commands',
        validationCriteria: [
          'Pod status and events reveal issues',
          'Logs show application errors',
          'Resource usage identifies bottlenecks',
          'Networking tests verify connectivity',
          'Deployment status shows rollout issues'
        ],
        commonMistakes: [
          'Not checking events first (shows cluster-level issues)',
          'Forgetting -n namespace flag',
          'Not using --previous for crash logs',
          'Running debug commands as different user (RBAC issues)'
        ]
      }
    ],
    expectedOutcome: 'Production-ready Kubernetes deployment with multi-tier application, monitoring, security, CI/CD, and operational practices.'
  },
  walk: {
    introduction: 'Apply production deployment patterns to scenario-based exercises, focusing on configuration, networking, and operational excellence.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Design a production deployment for a Node.js API with PostgreSQL database. Complete the YAML manifests.',
        template: `# StatefulSet for PostgreSQL:
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: ___________
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: ___________
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            ___________:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-data
          mountPath: ___________
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: ___________

---
# Secret for database password:
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  password: ___________  # base64 encoded

---
# Deployment for API:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: ___________
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: node:18-alpine
        ports:
        - containerPort: ___________
        env:
        - name: DATABASE_URL
          value: ___________
        resources:
          requests:
            cpu: ___________
            memory: ___________
          limits:
            cpu: ___________
            memory: ___________
        readinessProbe:
          ___________:
            path: ___________
            port: ___________
          initialDelaySeconds: ___________
        livenessProbe:
          ___________:
            path: ___________
            port: ___________
          initialDelaySeconds: ___________`,
        blanks: [
          {
            id: 'statefulset_replicas',
            label: 'PostgreSQL replicas',
            hint: 'How many for database?',
            correctValue: '1',
            validationPattern: '1'
          },
          {
            id: 'postgres_port',
            label: 'PostgreSQL port',
            hint: 'Default PostgreSQL port',
            correctValue: '5432',
            validationPattern: '5432'
          },
          {
            id: 'env_valuefrom',
            label: 'Environment value source',
            hint: 'Where to get password from?',
            correctValue: 'secretKeyRef',
            validationPattern: 'secretKeyRef'
          },
          {
            id: 'postgres_mountpath',
            label: 'PostgreSQL data mount path',
            hint: 'Where PostgreSQL stores data?',
            correctValue: '/var/lib/postgresql/data',
            validationPattern: '/var/lib/postgresql/data'
          },
          {
            id: 'storage_size',
            label: 'Storage size',
            hint: 'How much storage for database?',
            correctValue: '10Gi',
            validationPattern: '10Gi|10.*Gi'
          },
          {
            id: 'secret_password',
            label: 'Base64 encoded password',
            hint: 'Encode password with base64',
            correctValue: 'bXlzZWNyZXRwYXNzd29yZA==',
            validationPattern: 'bXlzZWNyZXRwYXNzd29yZA==|base64.*password'
          },
          {
            id: 'api_replicas',
            label: 'API replicas',
            hint: 'How many for high availability?',
            correctValue: '3',
            validationPattern: '3'
          },
          {
            id: 'api_port',
            label: 'API container port',
            hint: 'What port does API listen on?',
            correctValue: '3000',
            validationPattern: '3000'
          },
          {
            id: 'database_url',
            label: 'Database URL value',
            hint: 'Full connection string',
            correctValue: 'postgres://appuser:mysecretpassword@postgres.default.svc.cluster.local:5432/myapp',
            validationPattern: 'postgres://.*@postgres.*svc.*5432'
          },
          {
            id: 'cpu_request',
            label: 'CPU request',
            hint: 'Minimum CPU for scheduling',
            correctValue: '100m',
            validationPattern: '100m|0\\.1'
          },
          {
            id: 'memory_request',
            label: 'Memory request',
            hint: 'Minimum memory for scheduling',
            correctValue: '128Mi',
            validationPattern: '128Mi|128.*Mi'
          },
          {
            id: 'cpu_limit',
            label: 'CPU limit',
            hint: 'Maximum CPU usage',
            correctValue: '500m',
            validationPattern: '500m|0\\.5'
          },
          {
            id: 'memory_limit',
            label: 'Memory limit',
            hint: 'Maximum memory usage',
            correctValue: '512Mi',
            validationPattern: '512Mi|512.*Mi'
          },
          {
            id: 'readiness_probe_type',
            label: 'Readiness probe type',
            hint: 'How to check if ready?',
            correctValue: 'httpGet',
            validationPattern: 'httpGet'
          },
          {
            id: 'readiness_path',
            label: 'Readiness probe path',
            hint: 'Health check endpoint',
            correctValue: '/health',
            validationPattern: '/health'
          },
          {
            id: 'readiness_port',
            label: 'Readiness probe port',
            hint: 'Which port to check?',
            correctValue: '3000',
            validationPattern: '3000'
          },
          {
            id: 'readiness_delay',
            label: 'Readiness initial delay',
            hint: 'How long to wait before first check?',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: 'liveness_probe_type',
            label: 'Liveness probe type',
            hint: 'How to check if alive?',
            correctValue: 'httpGet',
            validationPattern: 'httpGet'
          },
          {
            id: 'liveness_path',
            label: 'Liveness probe path',
            hint: 'Health check endpoint',
            correctValue: '/health',
            validationPattern: '/health'
          },
          {
            id: 'liveness_port',
            label: 'Liveness probe port',
            hint: 'Which port to check?',
            correctValue: '3000',
            validationPattern: '3000'
          },
          {
            id: 'liveness_delay',
            label: 'Liveness initial delay',
            hint: 'How long to wait before first check?',
            correctValue: '30',
            validationPattern: '30'
          }
        ],
        solution: `# StatefulSet for PostgreSQL:
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi

---
# Secret for database password:
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  password: bXlzZWNyZXRwYXNzd29yZA==  # base64 encoded 'mysecretpassword'

---
# Deployment for API:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: node:18-alpine
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: postgres://appuser:mysecretpassword@postgres.default.svc.cluster.local:5432/myapp
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30`,
        explanation: 'Production deployment uses StatefulSet for database persistence, Secrets for passwords, ConfigMaps for configuration, resource limits, and health probes. StatefulSet ensures ordered deployment and stable network identity.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Configure Ingress for a multi-service application with SSL and path-based routing.',
        template: `# Install NGINX Ingress Controller:
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Create Ingress for frontend and API:
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: ___________
spec:
  ingressClassName: ___________
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: ___________
        pathType: Prefix
        backend:
          service:
            name: ___________
            port:
              number: ___________
      - path: ___________
        pathType: Prefix
        backend:
          service:
            name: ___________
            port:
              number: ___________
  tls:
  - hosts:
    - myapp.example.com
    secretName: ___________

# Create TLS secret:
kubectl create secret tls myapp-tls --cert=/path/to/cert.pem --key=/path/to/key.pem

# Test routing:
curl -k https://myapp.example.com/api/health
curl -k https://myapp.example.com/`,
        blanks: [
          {
            id: 'rewrite_target',
            label: 'Rewrite target annotation',
            hint: 'How to handle path rewrites?',
            correctValue: '/',
            validationPattern: '/'
          },
          {
            id: 'ingress_class',
            label: 'Ingress class name',
            hint: 'Which controller to use?',
            correctValue: 'nginx',
            validationPattern: 'nginx'
          },
          {
            id: 'frontend_path',
            label: 'Frontend path',
            hint: 'Root path for frontend',
            correctValue: '/',
            validationPattern: '/'
          },
          {
            id: 'frontend_service',
            label: 'Frontend service name',
            hint: 'Which service serves frontend?',
            correctValue: 'frontend',
            validationPattern: 'frontend'
          },
          {
            id: 'frontend_port',
            label: 'Frontend service port',
            hint: 'Which port does frontend service expose?',
            correctValue: '80',
            validationPattern: '80'
          },
          {
            id: 'api_path',
            label: 'API path',
            hint: 'Path prefix for API routes',
            correctValue: '/api',
            validationPattern: '/api'
          },
          {
            id: 'api_service',
            label: 'API service name',
            hint: 'Which service serves API?',
            correctValue: 'api',
            validationPattern: 'api'
          },
          {
            id: 'api_port',
            label: 'API service port',
            hint: 'Which port does API service expose?',
            correctValue: '80',
            validationPattern: '80'
          },
          {
            id: 'tls_secret',
            label: 'TLS secret name',
            hint: 'Name of the TLS secret',
            correctValue: 'myapp-tls',
            validationPattern: 'myapp-tls'
          }
        ],
        solution: `# Install NGINX Ingress Controller:
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Create Ingress for frontend and API:
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 80
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls

# Create TLS secret:
kubectl create secret tls myapp-tls --cert=/path/to/cert.pem --key=/path/to/key.pem

# Test routing:
curl -k https://myapp.example.com/api/health
curl -k https://myapp.example.com/`,
        explanation: 'Ingress provides external access with path-based routing (/ for frontend, /api for API). TLS terminates SSL at ingress. NGINX controller handles the routing. Host-based routing enables multiple apps on same IP.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Implement HorizontalPodAutoscaler for an API service based on CPU and memory metrics.',
        template: `# Enable metrics server:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Create HPA:
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: ___________
    name: api
  minReplicas: ___________
  maxReplicas: ___________
  metrics:
  - type: Resource
    resource:
      name: ___________
      target:
        type: Utilization
        averageUtilization: ___________
  - type: Resource
    resource:
      name: ___________
      target:
        type: Utilization
        averageUtilization: ___________
  behavior:
    scaleDown:
      stabilizationWindowSeconds: ___________
      policies:
      - type: Percent
        value: ___________
        periodSeconds: ___________

# Check HPA status:
kubectl get hpa api-hpa

# Generate load to test scaling:
kubectl run load-test --image=busybox --rm -it --restart=Never -- \
  while true; do wget -q -O- http://api.default.svc.cluster.local/health; sleep 0.1; done`,
        blanks: [
          {
            id: 'hpa_kind',
            label: 'HPA scale target kind',
            hint: 'What resource type to scale?',
            correctValue: 'Deployment',
            validationPattern: 'Deployment'
          },
          {
            id: 'min_replicas',
            label: 'Minimum replicas',
            hint: 'Minimum pods to maintain',
            correctValue: '2',
            validationPattern: '2'
          },
          {
            id: 'max_replicas',
            label: 'Maximum replicas',
            hint: 'Maximum pods allowed',
            correctValue: '10',
            validationPattern: '10'
          },
          {
            id: 'cpu_metric',
            label: 'CPU metric name',
            hint: 'Resource name for CPU',
            correctValue: 'cpu',
            validationPattern: 'cpu'
          },
          {
            id: 'cpu_target',
            label: 'CPU target utilization',
            hint: 'Target CPU percentage',
            correctValue: '70',
            validationPattern: '70'
          },
          {
            id: 'memory_metric',
            label: 'Memory metric name',
            hint: 'Resource name for memory',
            correctValue: 'memory',
            validationPattern: 'memory'
          },
          {
            id: 'memory_target',
            label: 'Memory target utilization',
            hint: 'Target memory percentage',
            correctValue: '80',
            validationPattern: '80'
          },
          {
            id: 'stabilization_window',
            label: 'Scale down stabilization window',
            hint: 'How long to wait before scaling down?',
            correctValue: '300',
            validationPattern: '300'
          },
          {
            id: 'scale_down_percent',
            label: 'Scale down percentage',
            hint: 'How much to scale down at once?',
            correctValue: '10',
            validationPattern: '10'
          },
          {
            id: 'scale_down_period',
            label: 'Scale down period',
            hint: 'How often to apply scale down?',
            correctValue: '60',
            validationPattern: '60'
          }
        ],
        solution: `# Enable metrics server:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Create HPA:
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60

# Check HPA status:
kubectl get hpa api-hpa

# Generate load to test scaling:
kubectl run load-test --image=busybox --rm -it --restart=Never -- \
  while true; do wget -q -O- http://api.default.svc.cluster.local/health; sleep 0.1; done`,
        explanation: 'HPA scales based on CPU/memory utilization. Multiple metrics supported. Behavior controls scaling speed to prevent thrashing. Stabilization window prevents rapid scale-down on temporary load drops.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Set up monitoring with Prometheus and Grafana for a Kubernetes application.',
        template: `# Install kube-prometheus-stack:
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Port forward Grafana:
kubectl port-forward svc/monitoring-grafana ___________ -n monitoring

# Get Grafana password:
kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" -n monitoring | ___________

# Create custom dashboard for application:
# In Grafana UI:
# 1. Add new dashboard
# 2. Add panel: "Container CPU Usage"
# 3. Query: ___________
# 4. Add panel: "Container Memory Usage"
# 5. Query: ___________

# Set up alerts:
# In Grafana, create alert rule:
# Query: ___________
# Condition: ___________
# For: ___________

# Check Prometheus metrics:
kubectl port-forward svc/monitoring-prometheus ___________ -n monitoring`,
        blanks: [
          {
            id: 'grafana_port_forward',
            label: 'Grafana port forward command',
            hint: 'How to access Grafana locally?',
            correctValue: '3000:80',
            validationPattern: '3000.*80|80.*3000'
          },
          {
            id: 'get_password_command',
            label: 'Get password command',
            hint: 'How to decode base64 password?',
            correctValue: 'base64 -d',
            validationPattern: 'base64.*-d'
          },
          {
            id: 'cpu_query',
            label: 'Prometheus CPU query',
            hint: 'Query for container CPU usage',
            correctValue: 'rate(container_cpu_usage_seconds_total{pod=~"$pod", container!=""}[5m])',
            validationPattern: 'container_cpu_usage_seconds_total|rate.*cpu'
          },
          {
            id: 'memory_query',
            label: 'Prometheus memory query',
            hint: 'Query for container memory usage',
            correctValue: 'container_memory_usage_bytes{pod=~"$pod", container!=""}',
            validationPattern: 'container_memory_usage_bytes|memory.*usage'
          },
          {
            id: 'alert_query',
            label: 'Alert query',
            hint: 'What to alert on?',
            correctValue: 'up == 0',
            validationPattern: 'up.*==.*0'
          },
          {
            id: 'alert_condition',
            label: 'Alert condition',
            hint: 'When to trigger alert?',
            correctValue: 'WHEN last() OF query IS BELOW 1',
            validationPattern: 'below.*1|last.*below'
          },
          {
            id: 'alert_duration',
            label: 'Alert duration',
            hint: 'How long before alerting?',
            correctValue: '5m',
            validationPattern: '5m|5.*min'
          },
          {
            id: 'prometheus_port_forward',
            label: 'Prometheus port forward',
            hint: 'How to access Prometheus UI?',
            correctValue: '9090:9090',
            validationPattern: '9090.*9090'
          }
        ],
        solution: `# Install kube-prometheus-stack:
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Port forward Grafana:
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring

# Get Grafana password:
kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" -n monitoring | base64 -d

# Create custom dashboard for application:
# In Grafana UI:
# 1. Add new dashboard
# 2. Add panel: "Container CPU Usage"
# 3. Query: rate(container_cpu_usage_seconds_total{pod=~"$pod", container!=""}[5m])
# 4. Add panel: "Container Memory Usage"
# 5. Query: container_memory_usage_bytes{pod=~"$pod", container!=""}

# Set up alerts:
# In Grafana, create alert rule:
# Query: up == 0
# Condition: WHEN last() OF query IS BELOW 1
# For: 5m

# Check Prometheus metrics:
kubectl port-forward svc/monitoring-prometheus 9090:9090 -n monitoring`,
        explanation: 'kube-prometheus-stack provides complete monitoring. Grafana visualizes metrics, Prometheus stores them, AlertManager handles alerts. Custom dashboards show application-specific metrics. Port forwarding enables local access.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Implement a blue-green deployment strategy for zero-downtime updates.',
        template: `# Current production deployment (blue):
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
      version: blue
  template:
    metadata:
      labels:
        app: api
        version: blue
    spec:
      containers:
      - name: api
        image: api:v1.0

# Service pointing to blue:
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
    version: ___________
  ports:
  - port: 80
    targetPort: 3000

# Deploy green version:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
      version: green
  template:
    metadata:
      labels:
        app: api
        version: green
    spec:
      containers:
      - name: api
        image: api:v2.0
EOF

# Test green deployment:
kubectl run test-green --image=curlimages/curl --rm -it --restart=Never -- \
  curl http://api-green.default.svc.cluster.local/health

# Switch traffic to green:
kubectl patch service api -p '{"spec":{"selector":{"app":"api","version":"___________"}}}}'

# Verify traffic switched:
kubectl get endpoints api

# Rollback if needed:
kubectl patch service api -p '{"spec":{"selector":{"app":"api","version":"___________"}}}}'

# Clean up old deployment:
kubectl delete deployment api-blue`,
        blanks: [
          {
            id: 'service_blue_selector',
            label: 'Service selector for blue',
            hint: 'Initially points to blue version',
            correctValue: 'blue',
            validationPattern: 'blue'
          },
          {
            id: 'switch_to_green',
            label: 'Switch service to green',
            hint: 'Change selector to green',
            correctValue: 'green',
            validationPattern: 'green'
          },
          {
            id: 'rollback_selector',
            label: 'Rollback selector',
            hint: 'Switch back to blue',
            correctValue: 'blue',
            validationPattern: 'blue'
          }
        ],
        solution: `# Current production deployment (blue):
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
      version: blue
  template:
    metadata:
      labels:
        app: api
        version: blue
    spec:
      containers:
      - name: api
        image: api:v1.0

# Service pointing to blue:
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
    version: blue
  ports:
  - port: 80
    targetPort: 3000

# Deploy green version:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
      version: green
  template:
    metadata:
      labels:
        app: api
        version: green
    spec:
      containers:
      - name: api
        image: api:v2.0
EOF

# Test green deployment:
kubectl run test-green --image=curlimages/curl --rm -it --restart=Never -- \
  curl http://api-green.default.svc.cluster.local/health

# Switch traffic to green:
kubectl patch service api -p '{"spec":{"selector":{"app":"api","version":"green"}}}}'

# Verify traffic switched:
kubectl get endpoints api

# Rollback if needed:
kubectl patch service api -p '{"spec":{"selector":{"app":"api","version":"blue"}}}}'

# Clean up old deployment:
kubectl delete deployment api-blue`,
        explanation: 'Blue-green deployments run two versions simultaneously. Service selector switches traffic instantly. Test green thoroughly before switching. Rollback by switching selector back. Clean up old version after confirming stability.'
      }
    ],
    hints: [
      'StatefulSet for databases, Deployment for stateless services',
      'ConfigMaps for non-sensitive config, Secrets for passwords',
      'Resource requests ensure scheduling, limits prevent starvation',
      'Readiness probes ensure traffic only to ready pods',
      'LoadBalancer for external access, ClusterIP for internal',
      'HPA requires metrics server and resource requests on pods',
      'Blue-green enables instant rollback by switching Service selector'
    ]
  },
  runGuided: {
    objective: 'Design and implement a complete production-ready Kubernetes deployment for a real application with all operational considerations.',
    conceptualGuidance: [
      'Application Architecture: Multi-tier with proper separation (frontend, API, database, cache)',
      'Infrastructure: Managed Kubernetes cluster, persistent storage, networking',
      'Configuration Management: Externalized config, secrets management, environment-specific values',
      'High Availability: Multi-zone deployment, pod anti-affinity, health checks',
      'Security: Network policies, RBAC, security contexts, image scanning',
      'Monitoring & Observability: Metrics, logs, traces, alerts',
      'CI/CD Integration: Automated builds, deployments, testing',
      'Backup & Recovery: Database backups, cluster backups, disaster recovery',
      'Cost Optimization: Right-sizing resources, spot instances, auto-scaling'
    ],
    keyConceptsToApply: [
      'Deployments with rolling updates and health checks',
      'StatefulSets for stateful workloads with persistent storage',
      'Services for internal networking (ClusterIP) and external access (LoadBalancer/Ingress)',
      'ConfigMaps and Secrets for configuration management',
      'HorizontalPodAutoscaler for automatic scaling',
      'NetworkPolicies for security',
      'PersistentVolumeClaims for storage',
      'Ingress with TLS for external access',
      'Monitoring stack (Prometheus, Grafana, AlertManager)',
      'CI/CD pipelines for automated deployments'
    ],
    checkpoints: [
      {
        checkpoint: 'Production architecture designed with all components',
        description: 'Design complete architecture: frontend (nginx), API (Node.js/Python), database (PostgreSQL), cache (Redis), message queue (RabbitMQ). Define all K8s objects, networking, storage, and security.',
        validationCriteria: [
          'Architecture diagram with all components and their relationships',
          'K8s manifests for all tiers (Deployments, StatefulSets, Services, ConfigMaps, Secrets)',
          'Storage strategy (PVCs for databases, ephemeral for stateless)',
          'Networking plan (internal Services, external Ingress)',
          'Security design (NetworkPolicies, RBAC, security contexts)'
        ],
        hintIfStuck: 'Start with core tiers: frontend Deployment + LoadBalancer Service, API Deployment + ClusterIP Service, database StatefulSet + ClusterIP Service. Add cache and queue as needed. Use ConfigMaps for config, Secrets for passwords.'
      },
      {
        checkpoint: 'High availability and scaling implemented',
        description: 'Implement HA: multi-replica deployments, pod anti-affinity, HPA, cluster multi-zone. Configure rolling updates with proper strategy.',
        validationCriteria: [
          'All stateless services have 3+ replicas with anti-affinity rules',
          'HPA configured for CPU/memory scaling',
          'Rolling update strategy with maxUnavailable=0 or 1',
          'Readiness and liveness probes on all services',
          'Multi-zone cluster or node affinity for HA'
        ],
        hintIfStuck: 'Set replicas=3 for all Deployments. Add podAntiAffinity to spread across nodes. Configure HPA with metrics server. Set rollingUpdate maxUnavailable=1 for zero-downtime updates.'
      },
      {
        checkpoint: 'Monitoring, logging, and alerting configured',
        description: 'Deploy monitoring stack, configure application logging, set up alerts for critical metrics and errors.',
        validationCriteria: [
          'Prometheus collecting metrics from all services',
          'Grafana dashboards for application and infrastructure metrics',
          'Centralized logging (EFK or similar) with application logs',
          'Alert rules for pod crashes, high resource usage, failed health checks',
          'Log aggregation with searchable interface'
        ],
        hintIfStuck: 'Use kube-prometheus-stack Helm chart. Configure Prometheus service monitors. Set up Fluent Bit for log collection to Elasticsearch. Create Grafana dashboards for CPU/memory per pod.'
      },
      {
        checkpoint: 'CI/CD pipeline and operational procedures',
        description: 'Implement automated deployment pipeline, create runbooks for common operations, set up backup procedures.',
        validationCriteria: [
          'GitHub Actions or similar CI/CD pipeline building and deploying',
          'Automated testing in pipeline (unit, integration, e2e)',
          'Runbook for deploy, rollback, scale, troubleshoot',
          'Database backup strategy with automated schedules',
          'Cluster backup for disaster recovery'
        ],
        hintIfStuck: 'Create GitHub Actions workflow: checkout → build → test → push image → update manifests → deploy. Use kubectl rollout for rollbacks. Set up CronJobs for backups. Document procedures in README.'
      }
    ],
    resourcesAllowed: [
      'Kubernetes documentation for production patterns',
      'Helm charts for monitoring and logging stacks',
      'GitHub Actions documentation',
      'Production deployment examples',
      'Security best practices guides'
    ]
  },
  runIndependent: {
    objective: 'Independently design, deploy, and operate a complete production Kubernetes application with enterprise-grade features and operational excellence.',
    successCriteria: [
      'Complete multi-tier application deployed and running',
      'High availability across multiple zones/nodes',
      'Comprehensive monitoring and alerting',
      'Automated CI/CD pipeline with testing',
      'Security hardening with NetworkPolicies and RBAC',
      'Backup and disaster recovery procedures',
      'Performance optimization and cost management',
      'Complete documentation and runbooks',
      'Zero-downtime deployment capability',
      'Scalability to handle traffic spikes'
    ],
    timeTarget: 240,
    minimumRequirements: [
      'Architecture diagram and all YAML manifests',
      'Multi-tier application (frontend, API, database minimum)',
      'LoadBalancer or Ingress for external access',
      '3+ replicas for stateless services with anti-affinity',
      'HPA configured and working',
      'Prometheus/Grafana monitoring stack',
      'Centralized logging (EFK or similar)',
      'GitHub Actions CI/CD pipeline',
      'NetworkPolicies restricting traffic',
      'Runbook with 8+ operational procedures',
      'Backup strategy documented and implemented',
      'Security scan results (Trivy or similar)',
      'Performance test results showing auto-scaling'
    ],
    evaluationRubric: [
      {
        criterion: 'Architecture & Design',
        weight: 15,
        passingThreshold: 'Complete multi-tier architecture with proper K8s objects, clear separation of concerns, scalable design patterns, comprehensive YAML manifests'
      },
      {
        criterion: 'High Availability & Reliability',
        weight: 15,
        passingThreshold: 'Multi-zone deployment, pod anti-affinity, 3+ replicas, health checks, rolling updates with zero downtime, proper resource management'
      },
      {
        criterion: 'Security Implementation',
        weight: 15,
        passingThreshold: 'NetworkPolicies, RBAC, security contexts, Secrets for sensitive data, image scanning, no privileged containers, TLS encryption'
      },
      {
        criterion: 'Monitoring & Observability',
        weight: 15,
        passingThreshold: 'Complete monitoring stack, application metrics, centralized logging, alerting rules, dashboards for key metrics, log aggregation'
      },
      {
        criterion: 'CI/CD & Automation',
        weight: 10,
        passingThreshold: 'Automated build/test/deploy pipeline, infrastructure as code, deployment strategies (rolling/blue-green), automated testing'
      },
      {
        criterion: 'Operational Excellence',
        weight: 15,
        passingThreshold: 'Comprehensive runbooks, backup procedures, disaster recovery plan, troubleshooting guides, performance optimization, cost management'
      },
      {
        criterion: 'Documentation & Testing',
        weight: 10,
        passingThreshold: 'Complete documentation, runbooks for all procedures, performance test results, security scan reports, architecture diagrams'
      },
      {
        criterion: 'Scalability & Performance',
        weight: 5,
        passingThreshold: 'Auto-scaling working, performance tests showing capacity, resource optimization, cost-effective scaling policies'
      }
    ]
  },
  videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
  documentation: [
    'https://kubernetes.io/docs/setup/production-environment/',
    'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    'https://kubernetes.io/docs/concepts/services-networking/service/',
    'https://kubernetes.io/docs/concepts/services-networking/ingress/',
    'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/',
    'https://kubernetes.io/docs/concepts/configuration/configmap/',
    'https://kubernetes.io/docs/concepts/configuration/secret/',
    'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
    'https://kubernetes.io/docs/concepts/services-networking/network-policies/'
  ],
  relatedConcepts: ['Container orchestration', 'Microservices architecture', 'Infrastructure as Code', 'CI/CD pipelines', 'Monitoring and observability', 'Security best practices']
};

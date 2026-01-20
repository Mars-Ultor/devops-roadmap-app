/**
 * Week 10 Lesson 2 - Cloud-Native Storage & StatefulSets
 * 4-Level Mastery Progression: StatefulSets, persistent storage, operators, databases
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week10Lesson2CloudNativeStorage: LeveledLessonContent = {
  lessonId: "week10-lesson2-cloud-native-storage",

  baseLesson: {
    title: "Cloud-Native Storage & StatefulSets",
    description:
      "Deploy stateful applications with StatefulSets, manage persistent storage, and operate databases using Kubernetes operators.",
    learningObjectives: [
      "Deploy StatefulSets with stable network identities",
      "Configure PersistentVolumes and StorageClasses",
      "Implement database operators for PostgreSQL and MongoDB",
      "Manage stateful application lifecycle and scaling",
      "Configure backup and disaster recovery",
    ],
    prerequisites: [
      "Kubernetes Deployments and Services",
      "Basic database knowledge",
      "Understanding of storage concepts",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20,
    },
  },

  crawl: {
    introduction:
      "Learn stateful applications and persistent storage step-by-step. You will deploy StatefulSets, configure storage, and run databases.",
    expectedOutcome:
      "Complete understanding of StatefulSets, PersistentVolumes, StorageClasses, database operators, and stateful application management in Kubernetes",
    steps: [
      {
        stepNumber: 1,
        instruction: "Understand StatefulSet vs Deployment differences",
        command:
          'echo "StatefulSet vs Deployment:\n1. Stable pod names (pod-0, pod-1) vs random names\n2. Ordered deployment/scaling vs parallel\n3. Persistent identity across restarts\n4. Stable network hostnames\n5. Per-pod PersistentVolumes\n6. Use for: databases, queues, caches"',
        explanation:
          "StatefulSets guarantee pod identity and order. Each pod gets stable hostname, persistent storage. Critical for databases requiring stable network identity.",
        expectedOutput: "StatefulSet characteristics listed",
        validationCriteria: [
          "Understand stable pod naming",
          "Know when to use StatefulSet",
          "Recognize ordering guarantees",
        ],
        commonMistakes: [
          "Using StatefulSet when Deployment sufficient",
          "Not understanding ordering",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Create StorageClass for dynamic provisioning",
        command:
          'kubectl apply -f - <<EOF\napiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: fast-ssd\nprovisioner: kubernetes.io/aws-ebs\nparameters:\n  type: gp3\n  iops: "3000"\n  throughput: "125"\nreclaimPolicy: Retain\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true\nEOF',
        explanation:
          "StorageClass defines how PersistentVolumes are dynamically created. gp3 provides fast SSD storage. WaitForFirstConsumer delays provisioning until pod scheduled (topology-aware).",
        expectedOutput: "StorageClass created",
        validationCriteria: [
          "StorageClass supports dynamic provisioning",
          "Reclaim policy set to Retain",
          "Volume expansion enabled",
        ],
        commonMistakes: [
          "Wrong provisioner",
          "Delete reclaim policy losing data",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Deploy StatefulSet with PersistentVolumeClaims",
        command:
          "kubectl apply -f - <<EOF\napiVersion: v1\nkind: Service\nmetadata:\n  name: mysql\nspec:\n  clusterIP: None  # Headless service\n  selector:\n    app: mysql\n  ports:\n  - port: 3306\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: mysql\nspec:\n  serviceName: mysql\n  replicas: 3\n  selector:\n    matchLabels:\n      app: mysql\n  template:\n    metadata:\n      labels:\n        app: mysql\n    spec:\n      containers:\n      - name: mysql\n        image: mysql:8.0\n        ports:\n        - containerPort: 3306\n        volumeMounts:\n        - name: data\n          mountPath: /var/lib/mysql\n        env:\n        - name: MYSQL_ROOT_PASSWORD\n          valueFrom:\n            secretKeyRef:\n              name: mysql-secret\n              key: password\n  volumeClaimTemplates:\n  - metadata:\n      name: data\n    spec:\n      accessModes: [ReadWriteOnce]\n      storageClassName: fast-ssd\n      resources:\n        requests:\n          storage: 10Gi\nEOF",
        explanation:
          "StatefulSet creates 3 MySQL pods: mysql-0, mysql-1, mysql-2. Each gets persistent 10Gi volume. Headless service provides stable DNS: mysql-0.mysql, mysql-1.mysql.",
        expectedOutput: "StatefulSet and volumes created",
        validationCriteria: [
          "Pods created in order (0, 1, 2)",
          "Each pod has PersistentVolumeClaim",
          "Stable DNS names resolve",
        ],
        commonMistakes: ["Missing headless service", "Wrong volume mount path"],
      },
      {
        stepNumber: 4,
        instruction: "Verify stable pod identity and storage",
        command:
          "kubectl get pods -l app=mysql && kubectl get pvc && kubectl exec mysql-0 -- hostname && kubectl delete pod mysql-0 && sleep 30 && kubectl exec mysql-0 -- hostname",
        explanation:
          "Each pod gets stable name and hostname. Deleting mysql-0 recreates it with same name, same PVC, same data. Identity persists across restarts.",
        expectedOutput: "Pod recreated with same identity",
        validationCriteria: [
          "Pod name unchanged after deletion",
          "Same PVC reattached",
          "Data persists",
        ],
        commonMistakes: [
          "Expecting random pod names",
          "Not waiting for recreation",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Install CloudNativePG operator for PostgreSQL",
        command:
          "kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.21/releases/cnpg-1.21.0.yaml",
        explanation:
          "CloudNativePG operator manages PostgreSQL clusters on Kubernetes. Handles replication, failover, backups, monitoring without manual intervention.",
        expectedOutput: "Operator installed",
        validationCriteria: [
          "Operator pod running",
          "CRDs registered",
          "Webhooks configured",
        ],
        commonMistakes: ["Wrong Kubernetes version", "CRD conflicts"],
      },
      {
        stepNumber: 6,
        instruction: "Deploy PostgreSQL cluster with operator",
        command:
          'kubectl apply -f - <<EOF\napiVersion: postgresql.cnpg.io/v1\nkind: Cluster\nmetadata:\n  name: pg-cluster\nspec:\n  instances: 3\n  primaryUpdateStrategy: unsupervised\n  storage:\n    size: 20Gi\n    storageClass: fast-ssd\n  postgresql:\n    parameters:\n      shared_buffers: "256MB"\n      max_connections: "100"\n  bootstrap:\n    initdb:\n      database: myapp\n      owner: myapp\n  monitoring:\n    enablePodMonitor: true\nEOF',
        explanation:
          "Operator creates 3-node PostgreSQL cluster with automatic primary election, streaming replication, Prometheus monitoring. Handles failover automatically.",
        expectedOutput: "PostgreSQL cluster running",
        validationCriteria: [
          "3 pods running (1 primary, 2 replicas)",
          "Replication streaming",
          "Services created automatically",
        ],
        commonMistakes: ["Insufficient storage", "Wrong PostgreSQL version"],
      },
      {
        stepNumber: 7,
        instruction: "Connect to PostgreSQL cluster",
        command:
          "kubectl get cluster pg-cluster -o jsonpath='{.status.writeService}' && kubectl exec -it pg-cluster-1 -- psql -U myapp myapp -c \"CREATE TABLE test (id serial PRIMARY KEY, data text);\"",
        explanation:
          "Operator creates read-write service (pg-cluster-rw) for primary, read-only service (pg-cluster-ro) for replicas. Write to primary, read from any.",
        expectedOutput: "Table created",
        validationCriteria: [
          "Connection to primary successful",
          "SQL executed",
          "Replicas synchronized",
        ],
        commonMistakes: [
          "Connecting to read-only service",
          "Wrong credentials",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Configure automated backups",
        command:
          'kubectl apply -f - <<EOF\napiVersion: v1\nkind: Secret\nmetadata:\n  name: backup-secret\nstringData:\n  ACCESS_KEY_ID: AKIA...\n  ACCESS_SECRET_KEY: ...\n---\napiVersion: postgresql.cnpg.io/v1\nkind: Cluster\nmetadata:\n  name: pg-cluster\nspec:\n  instances: 3\n  storage:\n    size: 20Gi\n  backup:\n    barmanObjectStore:\n      destinationPath: s3://my-backups/pg-cluster\n      s3Credentials:\n        accessKeyId:\n          name: backup-secret\n          key: ACCESS_KEY_ID\n        secretAccessKey:\n          name: backup-secret\n          key: ACCESS_SECRET_KEY\n    retentionPolicy: "30d"\nEOF',
        explanation:
          "Operator uses Barman for continuous archiving to S3. Takes base backups, archives WAL files. Retention policy keeps 30 days of backups.",
        expectedOutput: "Backups configured",
        validationCriteria: [
          "Base backup taken",
          "WAL archiving active",
          "Backups in S3",
        ],
        commonMistakes: ["Wrong S3 permissions", "No encryption"],
      },
      {
        stepNumber: 9,
        instruction: "Simulate failover and recovery",
        command:
          "kubectl get cluster pg-cluster -o jsonpath='{.status.currentPrimary}' && kubectl delete pod pg-cluster-1 && sleep 30 && kubectl get cluster pg-cluster -o jsonpath='{.status.currentPrimary}'",
        explanation:
          "Operator detects primary failure, promotes replica to primary, updates services. Applications reconnect automatically. Failover typically < 30 seconds.",
        expectedOutput: "New primary elected",
        validationCriteria: [
          "Primary pod deleted",
          "Replica promoted to primary",
          "Services updated",
        ],
        commonMistakes: [
          "Not monitoring failover",
          "Application not handling reconnect",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Install MongoDB Community Operator",
        command:
          "kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/crd/bases/mongodbcommunity.mongodb.com_mongodbcommunity.yaml && kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/rbac/role.yaml && kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/manager/manager.yaml",
        explanation:
          "MongoDB operator manages replica sets, sharded clusters, users, backups. Declarative MongoDB management on Kubernetes.",
        expectedOutput: "Operator installed",
        validationCriteria: [
          "Operator pod running",
          "CRDs available",
          "Ready to manage MongoDB",
        ],
        commonMistakes: ["Missing RBAC", "CRD version mismatch"],
      },
      {
        stepNumber: 11,
        instruction: "Deploy MongoDB replica set",
        command:
          'kubectl apply -f - <<EOF\napiVersion: mongodbcommunity.mongodb.com/v1\nkind: MongoDBCommunity\nmetadata:\n  name: mongo-rs\nspec:\n  members: 3\n  type: ReplicaSet\n  version: "6.0.5"\n  security:\n    authentication:\n      modes: ["SCRAM"]\n  users:\n    - name: admin\n      db: admin\n      passwordSecretRef:\n        name: mongo-password\n      roles:\n        - name: clusterAdmin\n          db: admin\n      scramCredentialsSecretName: admin-scram\n  statefulSet:\n    spec:\n      volumeClaimTemplates:\n        - metadata:\n            name: data-volume\n          spec:\n            accessModes: ["ReadWriteOnce"]\n            resources:\n              requests:\n                storage: 10Gi\nEOF',
        explanation:
          "Operator creates 3-member MongoDB replica set with SCRAM authentication. Automatic primary election, data synchronization, connection strings updated automatically.",
        expectedOutput: "MongoDB replica set running",
        validationCriteria: [
          "3 pods running",
          "Replica set initialized",
          "Authentication enabled",
        ],
        commonMistakes: ["Missing password secret", "Wrong version"],
      },
      {
        stepNumber: 12,
        instruction: "Scale StatefulSet and observe ordering",
        command:
          "kubectl scale statefulset mysql --replicas=5 && kubectl get pods -l app=mysql -w",
        explanation:
          "StatefulSet scales by creating mysql-3, then mysql-4. Waits for each pod to be Running before next. Scaling down deletes in reverse order (4, then 3).",
        expectedOutput: "Ordered scaling observed",
        validationCriteria: [
          "Pods created sequentially",
          "Each pod Running before next",
          "Reverse order for scale down",
        ],
        commonMistakes: [
          "Expecting parallel scaling",
          "Not waiting for readiness",
        ],
      },
    ],
  },

  walk: {
    introduction:
      "Apply stateful applications and storage through hands-on exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create StatefulSet with volumeClaimTemplates.",
        template: `apiVersion: apps/__V1__
kind: __STATEFUL_SET__
metadata:
  name: redis
spec:
  serviceName: __REDIS__
  replicas: __3__
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: __DATA__
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [__READ_WRITE_ONCE__]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: __5GI__`,
        blanks: [
          {
            id: "V1",
            label: "V1",
            hint: "API version",
            correctValue: "v1",
            validationPattern: "v1",
          },
          {
            id: "STATEFUL_SET",
            label: "STATEFUL_SET",
            hint: "Resource kind",
            correctValue: "StatefulSet",
            validationPattern: "stateful.*set",
          },
          {
            id: "REDIS",
            label: "REDIS",
            hint: "Service name",
            correctValue: "redis",
            validationPattern: "redis",
          },
          {
            id: "3",
            label: "3",
            hint: "Number of replicas",
            correctValue: "3",
            validationPattern: "3",
          },
          {
            id: "DATA",
            label: "DATA",
            hint: "Volume name",
            correctValue: "data",
            validationPattern: "data",
          },
          {
            id: "READ_WRITE_ONCE",
            label: "READ_WRITE_ONCE",
            hint: "Access mode",
            correctValue: "ReadWriteOnce",
            validationPattern: "read.*write.*once",
          },
          {
            id: "5GI",
            label: "5GI",
            hint: "Storage size",
            correctValue: "5Gi",
            validationPattern: "5gi",
          },
        ],
        solution:
          "StatefulSet creates redis-0, redis-1, redis-2 with stable names. Each gets 5Gi PersistentVolume. volumeClaimTemplates create PVC per pod. ReadWriteOnce allows single node attachment.",
        explanation:
          "StatefulSets provide stable identity and persistent storage for stateful apps",
      },
      {
        exerciseNumber: 2,
        scenario: "Configure StorageClass with dynamic provisioning.",
        template: `apiVersion: storage.k8s.io/__V1__
kind: __STORAGE_CLASS__
metadata:
  name: fast-storage
provisioner: __KUBERNETES.IO/AWS-EBS__
parameters:
  type: __GP3__
  iops: "3000"
  encrypted: "__TRUE__"
reclaimPolicy: __RETAIN__
volumeBindingMode: __WAIT_FOR_FIRST_CONSUMER__
allowVolumeExpansion: __TRUE__`,
        blanks: [
          {
            id: "V1",
            label: "V1",
            hint: "API version",
            correctValue: "v1",
            validationPattern: "v1",
          },
          {
            id: "STORAGE_CLASS",
            label: "STORAGE_CLASS",
            hint: "Resource kind",
            correctValue: "StorageClass",
            validationPattern: "storage.*class",
          },
          {
            id: "KUBERNETES.IO/AWS-EBS",
            label: "KUBERNETES.IO/AWS-EBS",
            hint: "Provisioner",
            correctValue: "kubernetes.io/aws-ebs",
            validationPattern: "aws.*ebs",
          },
          {
            id: "GP3",
            label: "GP3",
            hint: "EBS type",
            correctValue: "gp3",
            validationPattern: "gp3",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Encryption",
            correctValue: "true",
            validationPattern: "true",
          },
          {
            id: "RETAIN",
            label: "RETAIN",
            hint: "Reclaim policy",
            correctValue: "Retain",
            validationPattern: "retain",
          },
          {
            id: "WAIT_FOR_FIRST_CONSUMER",
            label: "WAIT_FOR_FIRST_CONSUMER",
            hint: "Binding mode",
            correctValue: "WaitForFirstConsumer",
            validationPattern: "wait.*consumer",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Allow expansion",
            correctValue: "true",
            validationPattern: "true",
          },
        ],
        solution:
          "StorageClass dynamically provisions gp3 EBS volumes. WaitForFirstConsumer delays provisioning until pod scheduled (zone-aware). Retain policy keeps volumes after PVC deletion. Encrypted for security.",
        explanation:
          "StorageClasses enable dynamic provisioning with cloud-specific options",
      },
      {
        exerciseNumber: 3,
        scenario: "Deploy PostgreSQL cluster with CloudNativePG operator.",
        template: `apiVersion: postgresql.cnpg.io/__V1__
kind: __CLUSTER__
metadata:
  name: my-pg-cluster
spec:
  instances: __3__
  primaryUpdateStrategy: __UNSUPERVISED__
  storage:
    size: __20GI__
    storageClass: fast-ssd
  postgresql:
    parameters:
      max_connections: "__200__"
      shared_buffers: "512MB"
  bootstrap:
    initdb:
      database: __MYAPP__
      owner: myapp
  monitoring:
    enablePodMonitor: __TRUE__`,
        blanks: [
          {
            id: "V1",
            label: "V1",
            hint: "API version",
            correctValue: "v1",
            validationPattern: "v1",
          },
          {
            id: "CLUSTER",
            label: "CLUSTER",
            hint: "Resource kind",
            correctValue: "Cluster",
            validationPattern: "cluster",
          },
          {
            id: "3",
            label: "3",
            hint: "Number of instances",
            correctValue: "3",
            validationPattern: "3",
          },
          {
            id: "UNSUPERVISED",
            label: "UNSUPERVISED",
            hint: "Update strategy",
            correctValue: "unsupervised",
            validationPattern: "unsupervised",
          },
          {
            id: "20GI",
            label: "20GI",
            hint: "Storage size",
            correctValue: "20Gi",
            validationPattern: "20gi",
          },
          {
            id: "200",
            label: "200",
            hint: "Max connections",
            correctValue: "200",
            validationPattern: "200",
          },
          {
            id: "MYAPP",
            label: "MYAPP",
            hint: "Database name",
            correctValue: "myapp",
            validationPattern: "myapp",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Enable monitoring",
            correctValue: "true",
            validationPattern: "true",
          },
        ],
        solution:
          "CloudNativePG operator manages 3-instance PostgreSQL cluster. Automatic replication, failover, Prometheus monitoring. Unsupervised updates allow automatic rolling upgrades.",
        explanation:
          "Operators automate complex stateful application management",
      },
      {
        exerciseNumber: 4,
        scenario: "Configure backup for PostgreSQL cluster.",
        template: `apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: my-pg-cluster
spec:
  instances: 3
  storage:
    size: 20Gi
  backup:
    barmanObjectStore:
      destinationPath: __S3://MY-BACKUPS/PG__
      s3Credentials:
        accessKeyId:
          name: backup-secret
          key: __ACCESS_KEY_ID__
        secretAccessKey:
          name: backup-secret
          key: ACCESS_SECRET_KEY
      wal:
        compression: __GZIP__
    retentionPolicy: "__30D__"`,
        blanks: [
          {
            id: "S3://MY-BACKUPS/PG",
            label: "S3://MY-BACKUPS/PG",
            hint: "S3 path",
            correctValue: "s3://my-backups/pg",
            validationPattern: "s3://",
          },
          {
            id: "ACCESS_KEY_ID",
            label: "ACCESS_KEY_ID",
            hint: "Secret key",
            correctValue: "ACCESS_KEY_ID",
            validationPattern: "access.*key",
          },
          {
            id: "GZIP",
            label: "GZIP",
            hint: "Compression",
            correctValue: "gzip",
            validationPattern: "gzip",
          },
          {
            id: "30D",
            label: "30D",
            hint: "Retention period",
            correctValue: "30d",
            validationPattern: "30d",
          },
        ],
        solution:
          "Barman backs up PostgreSQL to S3 with WAL archiving. Gzip compression saves space. 30-day retention keeps month of backups. Enables point-in-time recovery.",
        explanation:
          "Automated backups critical for stateful application disaster recovery",
      },
      {
        exerciseNumber: 5,
        scenario: "Deploy MongoDB replica set with operator.",
        template: `apiVersion: mongodbcommunity.mongodb.com/__V1__
kind: __MONGODB_COMMUNITY__
metadata:
  name: mongo-cluster
spec:
  members: __3__
  type: __REPLICA_SET__
  version: "6.0.5"
  security:
    authentication:
      modes: ["__SCRAM__"]
  statefulSet:
    spec:
      volumeClaimTemplates:
        - metadata:
            name: data-volume
          spec:
            accessModes: ["ReadWriteOnce"]
            resources:
              requests:
                storage: __10GI__`,
        blanks: [
          {
            id: "V1",
            label: "V1",
            hint: "API version",
            correctValue: "v1",
            validationPattern: "v1",
          },
          {
            id: "MONGODB_COMMUNITY",
            label: "MONGODB_COMMUNITY",
            hint: "Resource kind",
            correctValue: "MongoDBCommunity",
            validationPattern: "mongodb.*community",
          },
          {
            id: "3",
            label: "3",
            hint: "Number of members",
            correctValue: "3",
            validationPattern: "3",
          },
          {
            id: "REPLICA_SET",
            label: "REPLICA_SET",
            hint: "Deployment type",
            correctValue: "ReplicaSet",
            validationPattern: "replica.*set",
          },
          {
            id: "SCRAM",
            label: "SCRAM",
            hint: "Auth mechanism",
            correctValue: "SCRAM",
            validationPattern: "scram",
          },
          {
            id: "10GI",
            label: "10GI",
            hint: "Storage size",
            correctValue: "10Gi",
            validationPattern: "10gi",
          },
        ],
        solution:
          "MongoDB operator creates 3-member replica set with SCRAM authentication. Automatic primary election, data replication. Each member gets 10Gi persistent storage.",
        explanation:
          "Database operators simplify complex distributed database management",
      },
    ],
    hints: [
      "StatefulSets create pods with stable names: pod-0, pod-1, pod-2",
      "volumeClaimTemplates create one PVC per pod automatically",
      "Headless services (clusterIP: None) provide stable DNS for StatefulSets",
      "Operators use CRDs to manage complex applications declaratively",
      "WaitForFirstConsumer ensures volumes created in correct availability zone",
    ],
  },

  runGuided: {
    objective:
      "Build production stateful application platform with StatefulSets, persistent storage, database operators, and backup automation",
    conceptualGuidance: [
      "Design storage strategy: StorageClasses for different performance tiers",
      "Deploy databases using operators (CloudNativePG, MongoDB, Redis)",
      "Configure persistent storage with appropriate access modes and sizes",
      "Implement backup automation with S3 or object storage",
      "Set up monitoring for storage and database health",
      "Plan disaster recovery with backup testing",
      "Configure StatefulSets with proper resource limits",
      "Implement database connection pooling and read replicas",
      "Test failover and recovery procedures",
    ],
    keyConceptsToApply: [
      "StatefulSet pod identity and ordering",
      "PersistentVolumes and dynamic provisioning",
      "Database operators and CRDs",
      "Backup and disaster recovery",
      "Storage performance tuning",
    ],
    checkpoints: [
      {
        checkpoint: "StatefulSets deployed with persistent storage",
        description: "Stateful applications running with stable identity",
        validationCriteria: [
          "StatefulSets running with ordered pod names",
          "PersistentVolumeClaims bound to each pod",
          "Headless services providing stable DNS",
          "StorageClasses configured for dynamic provisioning",
          "Volumes persisting data across pod restarts",
          "Scaling up/down works correctly",
        ],
        hintIfStuck:
          "Create StorageClass first. Deploy StatefulSet with serviceName and volumeClaimTemplates. Create headless service (clusterIP: None). Verify stable pod names and PVCs.",
      },
      {
        checkpoint: "Database operators managing clusters",
        description: "Automated database management with operators",
        validationCriteria: [
          "CloudNativePG or MongoDB operator installed",
          "Database clusters running with replication",
          "Automatic failover tested and working",
          "Connection strings available via services",
          "Monitoring enabled with Prometheus",
          "Backups configured and tested",
        ],
        hintIfStuck:
          "Install operator CRDs. Deploy Cluster resource with 3 instances. Verify replication status. Test failover by deleting primary pod. Configure S3 backups with Barman.",
      },
      {
        checkpoint: "Backup and recovery implemented",
        description: "Automated backups with tested recovery",
        validationCriteria: [
          "Backups running to S3 or object storage",
          "WAL archiving active for PostgreSQL",
          "Retention policy configured (30 days)",
          "Point-in-time recovery tested",
          "Backup monitoring and alerts",
          "Restore procedure documented",
        ],
        hintIfStuck:
          "Configure barmanObjectStore in PostgreSQL Cluster spec. Test backup by checking S3 bucket. Restore to new cluster to verify. Monitor backup age with Prometheus alerts.",
      },
    ],
    resourcesAllowed: [
      "Kubernetes StatefulSet documentation",
      "CloudNativePG operator guide",
      "Storage best practices",
      "Backup and recovery patterns",
    ],
  },

  runIndependent: {
    objective:
      "Build production-grade stateful application platform with comprehensive storage management, database operators, automated backups, disaster recovery, and complete monitoring",
    successCriteria: [
      "StatefulSets: properly configured with stable identities and persistent storage",
      "Storage strategy: multiple StorageClasses for different performance/cost tiers",
      "Database operators: PostgreSQL and MongoDB clusters with automated management",
      "High availability: multi-replica databases with automatic failover",
      "Backup automation: continuous backups to S3, WAL archiving, retention policies",
      "Disaster recovery: tested restore procedures, point-in-time recovery capability",
      "Monitoring: storage metrics, database health, backup status",
      "Security: encrypted storage, authentication, network policies",
      "Performance: appropriate resource limits, connection pooling, read replicas",
      "Documentation: architecture diagrams, runbooks, recovery procedures",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "StatefulSet deployed with persistent storage",
      "Database operator managing cluster",
      "Backups configured and verified",
    ],
    evaluationRubric: [
      {
        criterion: "Stateful Applications",
        weight: 25,
        passingThreshold:
          "StatefulSets with stable pod identities. PersistentVolumes bound correctly. Headless services configured. Scaling works properly. Data persists across restarts. Resource limits set appropriately.",
      },
      {
        criterion: "Database Management",
        weight: 30,
        passingThreshold:
          "Operators managing PostgreSQL/MongoDB. Multi-replica clusters with replication. Automatic failover tested. Connection pooling configured. Read replicas for scaling. Monitoring active. Performance tuned.",
      },
      {
        criterion: "Backup & Recovery",
        weight: 25,
        passingThreshold:
          "Automated backups to S3. WAL archiving for PostgreSQL. Retention policies enforced. Point-in-time recovery tested. Restore procedures documented. Backup monitoring with alerts. Encryption enabled.",
      },
      {
        criterion: "Storage & Performance",
        weight: 20,
        passingThreshold:
          "Multiple StorageClasses for different tiers. Dynamic provisioning working. Volumes encrypted. Performance appropriate for workload. Storage monitoring active. Expansion tested. No data loss scenarios.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=pPQKAR1pA9U",
  documentation: [
    "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
    "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    "https://cloudnative-pg.io/documentation/",
    "https://github.com/mongodb/mongodb-kubernetes-operator",
    "https://kubernetes.io/docs/concepts/storage/storage-classes/",
    "https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/",
  ],
  relatedConcepts: [
    "StatefulSets and pod identity",
    "PersistentVolumes and StorageClasses",
    "Database operators (CloudNativePG, MongoDB)",
    "Backup and disaster recovery",
    "Dynamic storage provisioning",
    "Kubernetes storage architecture",
  ],
};

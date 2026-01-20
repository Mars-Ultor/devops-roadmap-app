/**
 * Week 8 Lesson 3 - Log Aggregation & Analysis
 * 4-Level Mastery Progression: Centralized logging with ELK/Loki for distributed systems
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week8Lesson3LogAggregation: LeveledLessonContent = {
  lessonId: "week8-lesson3-log-aggregation",

  baseLesson: {
    title: "Centralized Log Aggregation & Analysis",
    description:
      "Deploy and operate centralized logging solutions (ELK or Loki) for distributed systems. Master structured logging, log querying, and correlation with traces.",
    learningObjectives: [
      "Deploy centralized log aggregation stack (Loki or ELK)",
      "Implement structured JSON logging across services",
      "Write LogQL or KQL queries for incident investigation",
      "Configure log retention and lifecycle management",
      "Correlate logs with distributed traces for root cause analysis",
    ],
    prerequisites: [
      "Understanding of Kubernetes",
      "Familiarity with microservices logging challenges",
      "Basic knowledge of distributed tracing",
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
      "Master centralized log aggregation for microservices. Learn to collect, parse, search, and analyze logs from distributed Kubernetes applications using ELK Stack or Grafana Loki.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Why Log Aggregation? The distributed logging problem",
        command:
          "Problem: Microservices on Kubernetes\n- 10 services × 3 replicas = 30 pods\n- Pods restart (ephemeral logs lost)\n- Need to search across all pods\n- Logs scattered across cluster\n\nSolution: Centralized log aggregation\n1. Collect logs from all pods automatically\n2. Store in searchable database\n3. Provide UI for querying\n4. Retain logs after pods die",
        explanation:
          "kubectl logs only shows one pod. Logs disappear when pod restarts. Debugging requires searching all replicas. Centralized logging collects from all pods, stores centrally, survives pod restarts, enables search across services.",
        expectedOutput:
          "Understanding: Centralized log aggregation is essential for debugging distributed systems.",
        validationCriteria: [
          "Logs collected from all pods automatically",
          "Logs persist after pod restarts",
          "Searchable across all services",
          "Structured logs enable filtering",
          "Historical log retention",
        ],
        commonMistakes: [
          "Only checking logs on one pod (miss the failing pod)",
          "Logs lost when pod restarts (no aggregation)",
          "Unstructured logs (can't search effectively)",
          "No log retention policy (storage costs explode)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Log aggregation architectures: ELK vs Loki",
        command:
          "Option 1: ELK Stack (Elasticsearch, Logstash, Kibana)\n- Elasticsearch: Search and storage\n- Logstash/Fluentd: Log collection and parsing\n- Kibana: UI for search and visualization\n- Pros: Powerful search, mature, full-text indexing\n- Cons: Resource-intensive, complex\n\nOption 2: Grafana Loki\n- Loki: Log storage (like Prometheus for logs)\n- Promtail: Log collector (agent on each node)\n- Grafana: UI (reuse Prometheus Grafana)\n- Pros: Lightweight, integrates with Grafana, cheaper\n- Cons: Less powerful search than Elasticsearch",
        explanation:
          "ELK is industry standard but heavy (indexes everything). Loki is lightweight (indexes only labels, not full text). Use ELK for complex queries and compliance. Use Loki for simpler needs and Grafana integration.",
        expectedOutput:
          "Understanding: ELK provides powerful search at higher cost; Loki is lightweight and integrates with Grafana.",
        validationCriteria: [
          "ELK: Full-text indexing, complex queries",
          "Loki: Label-based indexing, simple queries",
          "Both provide centralized storage and UI",
          "Choice depends on search needs and resources",
          "Both work with Kubernetes",
        ],
        commonMistakes: [
          "Using ELK when Loki sufficient (wasted resources)",
          "Using Loki when need complex queries (insufficient)",
          "Not considering cost (Elasticsearch can be expensive)",
          "Mixing architectures (use one, not both)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Deploy Grafana Loki stack to Kubernetes",
        command:
          "Install Loki stack with Helm:\n\nhelm repo add grafana https://grafana.github.io/helm-charts\nhelm repo update\nhelm install loki grafana/loki-stack \\\n  --namespace logging --create-namespace \\\n  --set grafana.enabled=true \\\n  --set promtail.enabled=true \\\n  --set loki.persistence.enabled=true \\\n  --set loki.persistence.size=10Gi\n\nComponents deployed:\n- Loki: Log storage\n- Promtail: DaemonSet (runs on every node, collects logs)\n- Grafana: UI for querying",
        explanation:
          "Promtail runs as DaemonSet - one pod per node. It reads container logs (/var/log/pods/) and sends to Loki. Loki stores logs with labels (pod, namespace, container). Grafana queries Loki. Enable persistence so logs survive Loki pod restarts.",
        expectedOutput:
          "Understanding: Loki stack deploys centralized logging with automatic collection from all pods.",
        validationCriteria: [
          "Promtail DaemonSet on every node",
          "Loki deployed with persistent storage",
          "Grafana connected to Loki data source",
          "Logs automatically collected from all pods",
          "No per-application configuration needed",
        ],
        commonMistakes: [
          "Not enabling persistence (logs lost on restart)",
          "Insufficient storage (fills up quickly)",
          "Promtail not running on all nodes (missing logs)",
          "Grafana not configured with Loki data source",
        ],
      },
      {
        stepNumber: 4,
        instruction: "How Promtail collects logs: DaemonSet architecture",
        command:
          'Promtail operation:\n1. Runs on every Kubernetes node (DaemonSet)\n2. Watches /var/log/pods/* (container stdout/stderr)\n3. Extracts labels from file path:\n   /var/log/pods/namespace_pod_uid/container/0.log\n   → {namespace="default", pod="api-123", container="api"}\n4. Adds custom labels from pod annotations\n5. Sends log lines to Loki with labels\n\nLoki indexes labels (not log content) for fast filtering',
        explanation:
          'Kubernetes writes container logs to files on node. Promtail reads these files. File path contains metadata (namespace, pod, container). Promtail extracts this as labels. Loki stores logs with labels. Query by label (namespace="prod") instead of full-text search.',
        expectedOutput:
          "Understanding: Promtail automatically discovers and labels logs from Kubernetes pod metadata.",
        validationCriteria: [
          "Promtail reads logs from /var/log/pods/",
          "Labels extracted from file path",
          "Additional labels from pod annotations",
          "Logs sent to Loki with labels",
          "No application code changes needed",
        ],
        commonMistakes: [
          "Expecting Promtail to parse log content (it doesn't)",
          "Not using structured logs (can't extract fields)",
          "Relying on full-text search (Loki doesn't index content)",
          "Not adding custom labels when needed",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Structured logging: JSON format for parseability",
        command:
          'Unstructured log (bad):\n2025-12-11 10:32:15 ERROR: Payment failed for user 12345 - Insufficient funds\n\nStructured log (good - JSON):\n{\n  "timestamp": "2025-12-11T10:32:15.123Z",\n  "level": "ERROR",\n  "message": "payment_failed",\n  "user_id": "12345",\n  "order_id": "67890",\n  "error_code": "INSUFFICIENT_FUNDS",\n  "amount": 99.99,\n  "service": "payment-service",\n  "trace_id": "abc-123"\n}\n\nBenefits:\n- Machine-parseable\n- Filterable by any field\n- Correlatable with traces (trace_id)',
        explanation:
          'Structured logs are JSON (or key-value format). Every field is extractable. Can filter "all INSUFFICIENT_FUNDS errors" or "all errors for user 12345". Loki can parse JSON and create labels. Correlation IDs (trace_id) link logs to distributed traces.',
        expectedOutput:
          "Understanding: Structured JSON logs enable powerful querying and correlation with traces.",
        validationCriteria: [
          "Consistent JSON format",
          "Required fields (timestamp, level, service, message)",
          "Correlation IDs (trace_id, request_id)",
          "Contextual data (user_id, order_id)",
          "Machine-parseable for log aggregators",
        ],
        commonMistakes: [
          "Inconsistent formats across services",
          "Missing critical fields (timestamp, service)",
          "No correlation IDs (can't link to traces)",
          "Logging sensitive data (passwords, credit cards)",
          "Dynamic JSON keys (breaks parsing)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "LogQL: Querying logs in Grafana Loki",
        command:
          'LogQL query examples:\n\n# All logs from namespace\n{namespace="production"}\n\n# Logs from specific service\n{namespace="production", app="api-service"}\n\n# Filter by log content (grep-like)\n{app="api-service"} |= "error"\n\n# Parse JSON and filter by field\n{app="api-service"} | json | error_code="INSUFFICIENT_FUNDS"\n\n# Count error logs\nsum(count_over_time({app="api-service"} |= "ERROR" [5m]))\n\n# Logs for specific trace_id (correlation)\n{namespace="production"} | json | trace_id="abc-123"',
        explanation:
          'LogQL is like PromQL for logs. Start with label selector {namespace="prod"}. Filter content with |= (contains). Parse JSON with | json. Extract fields. Aggregate with count_over_time(). Query by trace_id to correlate with distributed traces.',
        expectedOutput:
          "Understanding: LogQL enables label-based querying and JSON field extraction.",
        validationCriteria: [
          "Label selectors filter by metadata",
          "Content filters with |= (contains)",
          "JSON parsing extracts fields",
          "Aggregation functions (count, sum)",
          "Can query by correlation IDs",
        ],
        commonMistakes: [
          "Full-text search on large time ranges (slow)",
          "Not using labels (query all logs instead of filtering)",
          "Not parsing JSON (can't filter by fields)",
          "Overly complex queries (should use recording rules)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Deploy ELK Stack: Elasticsearch, Fluentd, Kibana",
        command:
          "ELK deployment (alternative to Loki):\n\n# Add Elastic Helm repo\nhelm repo add elastic https://helm.elastic.co\n\n# Install Elasticsearch\nhelm install elasticsearch elastic/elasticsearch \\\n  --namespace logging --create-namespace \\\n  --set replicas=3 \\\n  --set volumeClaimTemplate.resources.requests.storage=30Gi\n\n# Install Kibana\nhelm install kibana elastic/kibana --namespace logging\n\n# Install Fluentd (log collector)\nkubectl apply -f fluentd-daemonset.yaml\n\nComponents:\n- Elasticsearch: Search engine and storage\n- Fluentd: Collects logs, parses, sends to Elasticsearch\n- Kibana: Web UI for search and visualization",
        explanation:
          "Elasticsearch is distributed search engine. Fluentd (or Fluent Bit, Logstash) collects logs from all pods. Parses and enriches logs. Sends to Elasticsearch. Kibana provides UI for querying. More powerful than Loki but resource-intensive.",
        expectedOutput:
          "Understanding: ELK Stack provides full-text indexed search with rich querying capabilities.",
        validationCriteria: [
          "Elasticsearch cluster with replicas",
          "Fluentd DaemonSet collecting logs",
          "Kibana UI for querying",
          "Logs automatically indexed",
          "Full-text search enabled",
        ],
        commonMistakes: [
          "Single Elasticsearch node (no HA)",
          "Insufficient storage (Elasticsearch fills up)",
          "No index lifecycle management (old logs never deleted)",
          "Fluentd not parsing logs (stored as plain text)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Fluentd configuration: Parsing and enrichment",
        command:
          "Fluentd config (fluentd.conf):\n\n<source>\n  @type tail\n  path /var/log/containers/*.log\n  pos_file /var/log/fluentd-containers.log.pos\n  tag kubernetes.*\n  read_from_head true\n  <parse>\n    @type json\n    time_format %Y-%m-%dT%H:%M:%S.%NZ\n  </parse>\n</source>\n\n# Add Kubernetes metadata\n<filter kubernetes.**>\n  @type kubernetes_metadata\n  @id filter_kube_metadata\n</filter>\n\n# Send to Elasticsearch\n<match **>\n  @type elasticsearch\n  host elasticsearch.logging.svc.cluster.local\n  port 9200\n  index_name k8s-logs\n</match>",
        explanation:
          "Fluentd reads container logs. Parses JSON. kubernetes_metadata filter adds pod name, namespace, labels. Sends to Elasticsearch with index name. Fluentd can transform logs, add fields, filter, route. More flexible than Promtail.",
        expectedOutput:
          "Understanding: Fluentd provides powerful log parsing, transformation, and routing capabilities.",
        validationCriteria: [
          "Reads logs from container files",
          "Parses JSON logs",
          "Enriches with Kubernetes metadata",
          "Sends to Elasticsearch with indexing",
          "Configurable transformations",
        ],
        commonMistakes: [
          "Not parsing JSON (logs stored as strings)",
          "Missing kubernetes_metadata (no pod context)",
          "No buffering (loses logs under load)",
          "Incorrect index patterns (can't find logs)",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Kibana: Searching and visualizing logs",
        command:
          'Kibana operations:\n\n1. Create index pattern:\n   Management → Index Patterns → Create\n   Pattern: k8s-logs-*\n   Time field: @timestamp\n\n2. Search logs (Discover):\n   kubernetes.namespace: "production" AND level: "ERROR"\n   message: "payment failed"\n   trace_id: "abc-123"\n\n3. Save search as visualization\n\n4. Create dashboard:\n   - Error count over time (line chart)\n   - Error breakdown by service (pie chart)\n   - Recent errors (data table)\n   - Top error messages (tag cloud)',
        explanation:
          "Kibana Discover lets you search logs. Create visualizations from searches. Combine visualizations into dashboards. Powerful query language (KQL or Lucene). Can create alerts based on log patterns. Export dashboards for sharing.",
        expectedOutput:
          "Understanding: Kibana provides rich search, visualization, and dashboarding for logs.",
        validationCriteria: [
          "Index patterns configured",
          "Can search and filter logs",
          "Visualizations show trends",
          "Dashboards provide overview",
          "Can set up log-based alerts",
        ],
        commonMistakes: [
          "Not configuring index pattern (no logs visible)",
          "Overly broad searches (slow)",
          "Not using filters (searching all data)",
          "Too many visualizations (overwhelming)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Log retention and index lifecycle management",
        command:
          'Elasticsearch Index Lifecycle (ILM):\n\nPUT _ilm/policy/k8s-logs-policy\n{\n  "policy": {\n    "phases": {\n      "hot": {\n        "actions": {\n          "rollover": {\n            "max_size": "50GB",\n            "max_age": "1d"\n          }\n        }\n      },\n      "warm": {\n        "min_age": "7d",\n        "actions": {\n          "shrink": { "number_of_shards": 1 },\n          "forcemerge": { "max_num_segments": 1 }\n        }\n      },\n      "delete": {\n        "min_age": "30d",\n        "actions": { "delete": {} }\n      }\n    }\n  }\n}\n\nStrategy:\n- Hot: Recent logs (7 days), fast SSD storage\n- Warm: Older logs (7-30 days), compressed, slower storage\n- Delete: After 30 days',
        explanation:
          "Logs grow infinitely if not managed. ILM automatically moves logs through lifecycle. Hot phase: recent, fast. Warm phase: compressed, cheaper storage. Delete: remove old logs. Prevents storage exhaustion and controls costs.",
        expectedOutput:
          "Understanding: Index lifecycle management automates log retention and storage optimization.",
        validationCriteria: [
          "Hot phase for recent logs",
          "Warm phase for older logs (compressed)",
          "Delete phase removes old logs",
          "Storage costs controlled",
          "Performance optimized (hot data fast)",
        ],
        commonMistakes: [
          "No retention policy (storage fills up)",
          "Too short retention (delete logs you need)",
          "No warm phase (expensive hot storage)",
          "Manual deletion (error-prone, tedious)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Log correlation: Linking logs to traces and metrics",
        command:
          'Correlation strategy:\n\n1. Application emits log:\n   {\n     "trace_id": "abc-123",\n     "span_id": "span-456",\n     "service": "api",\n     "message": "payment_failed",\n     "timestamp": "2025-12-11T10:32:15Z"\n   }\n\n2. Distributed trace has same trace_id\n\n3. Grafana or Kibana:\n   - View trace in Jaeger\n   - Click span to see logs (filtered by trace_id)\n   - See metrics for same time period\n\n4. Complete picture:\n   Metric → spike in error rate\n   Log → error message "database timeout"\n   Trace → slow span in database service',
        explanation:
          "Correlation IDs (trace_id, request_id) are the key. Include in all logs. When debugging, start with metric alert, find trace_id in logs, pull up trace, see full request path. Complete observability requires linking all three pillars.",
        expectedOutput:
          "Understanding: Correlation IDs enable seamless navigation between metrics, logs, and traces.",
        validationCriteria: [
          "All logs include trace_id",
          "Can query logs by trace_id",
          "Trace UI links to logs",
          "Metrics alert includes trace context",
          "Single workflow: alert → logs → trace → root cause",
        ],
        commonMistakes: [
          "Not including trace_id in logs",
          "Different trace_id formats across services",
          "No tooling to jump between pillars",
          "Siloed observability (can't correlate)",
        ],
      },
      {
        stepNumber: 12,
        instruction:
          "Log aggregation best practices: Security, performance, cost",
        command:
          "Best practices:\n\n1. Security:\n   - Don't log PII (passwords, SSNs, credit cards)\n   - Encrypt logs in transit (TLS)\n   - RBAC for log access (limit who sees what)\n   - Audit log access\n\n2. Performance:\n   - Use buffering (Fluentd/Promtail buffers)\n   - Sample high-volume logs (not everything)\n   - Use structured logs (easier parsing)\n   - Separate indexes per service (faster queries)\n\n3. Cost:\n   - Retention policy (delete old logs)\n   - Compress old logs\n   - Sample debug logs in production\n   - Monitor storage usage\n\n4. Reliability:\n   - Log collector HA (multiple replicas)\n   - Elasticsearch cluster (3+ nodes)\n   - Backup logs (S3, GCS)",
        explanation:
          "Logging production systems requires balancing visibility, security, performance, and cost. Don't log secrets. Retain logs long enough for debugging (30-90 days typical). High-volume services may need sampling. Secure access to logs (sensitive data). Monitor log collector health.",
        expectedOutput:
          "Understanding: Production log aggregation requires careful balance of visibility, security, performance, and cost.",
        validationCriteria: [
          "No PII or secrets in logs",
          "Access controls on log queries",
          "Retention policy appropriate for needs",
          "Performance optimized (buffering, sampling)",
          "Cost controlled (compression, deletion)",
          "High availability for log infrastructure",
        ],
        commonMistakes: [
          "Logging secrets or PII (security breach)",
          "No retention policy (storage explosion)",
          "Logging everything at DEBUG level (noise, cost)",
          "No access controls (anyone can see logs)",
          "Single point of failure (one Elasticsearch node)",
        ],
      },
    ],
    expectedOutcome:
      "You understand centralized log aggregation architectures (ELK vs Loki), can deploy and configure log collectors (Promtail, Fluentd), query logs (LogQL, KQL), implement structured logging, manage retention, and correlate logs with traces and metrics.",
  },

  walk: {
    introduction: "Apply log aggregation concepts through practical exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Configure structured logging for a microservices application.",
        template:
          'Log schema (JSON):\n\n{\n  "__TIMESTAMP__": "2025-12-11T10:32:15.123Z",\n  "level": "__ERROR__",\n  "service": "payment-service",\n  "trace_id": "__ABC123__",\n  "span_id": "span-456",\n  "user_id": "user-789",\n  "message": "__PAYMENT_FAILED__",\n  "error": {\n    "type": "PaymentDeclinedException",\n    "message": "Insufficient funds",\n    "code": "__INSUFFICIENT_FUNDS__"\n  },\n  "context": {\n    "order_id": "order-12345",\n    "amount": __99.99__,\n    "currency": "USD",\n    "payment_method": "credit_card"\n  },\n  "duration_ms": __250__,\n  "environment": "__PRODUCTION__"\n}\n\nRequired fields:\n- Timestamp (__ISO8601__)\n- Log level (DEBUG/INFO/WARN/ERROR)\n- Service name\n- Trace ID (for __CORRELATION__)\n- Message (structured, not prose)',
        blanks: [
          {
            id: "TIMESTAMP",
            label: "TIMESTAMP",
            hint: "ISO 8601 format field",
            correctValue: "timestamp",
            validationPattern: "timestamp|time",
          },
          {
            id: "ERROR",
            label: "ERROR",
            hint: "Log severity level",
            correctValue: "ERROR",
            validationPattern: "error",
          },
          {
            id: "ABC123",
            label: "ABC123",
            hint: "Distributed trace identifier",
            correctValue: "abc-123",
            validationPattern: "abc|trace",
          },
          {
            id: "PAYMENT_FAILED",
            label: "PAYMENT_FAILED",
            hint: "Structured event name",
            correctValue: "payment_failed",
            validationPattern: "payment.*failed",
          },
          {
            id: "INSUFFICIENT_FUNDS",
            label: "INSUFFICIENT_FUNDS",
            hint: "Error code",
            correctValue: "INSUFFICIENT_FUNDS",
            validationPattern: "insufficient.*funds",
          },
          {
            id: "99.99",
            label: "99.99",
            hint: "Transaction amount",
            correctValue: "99.99",
            validationPattern: "99",
          },
          {
            id: "250",
            label: "250",
            hint: "Operation duration",
            correctValue: "250",
            validationPattern: "250|ms",
          },
          {
            id: "PRODUCTION",
            label: "PRODUCTION",
            hint: "Environment name",
            correctValue: "production",
            validationPattern: "production|prod",
          },
          {
            id: "ISO8601",
            label: "ISO8601",
            hint: "Timestamp standard",
            correctValue: "ISO 8601",
            validationPattern: "iso.*8601",
          },
          {
            id: "CORRELATION",
            label: "CORRELATION",
            hint: "Linking logs to traces",
            correctValue: "correlation",
            validationPattern: "correlation|link",
          },
        ],
        solution:
          '{\n  "timestamp": "2025-12-11T10:30:45Z",\n  "level": "error",\n  "service": "api-service",\n  "trace_id": "abc-123-def-456",\n  "message": "Database connection timeout",\n  "event": "db_connection_failed",\n  "context": {\n    "user_id": "user-789",\n    "query_duration_ms": 5000,\n    "database": "orders"\n  }\n}',
        explanation:
          "Structured JSON logging schema with required fields for observability",
      },
      {
        exerciseNumber: 2,
        scenario: "Write LogQL queries to investigate an incident.",
        template:
          'Incident: API latency spike at 10:30 AM\n\nQuery 1: All logs from API service during incident\n{__NAMESPACE__="production", __APP__="api-service"} \n  | __JSON__\n  | __TIMESTAMP__ >= "2025-12-11T10:30:00Z" \n    and __TIMESTAMP__ < "2025-12-11T10:35:00Z"\n\nQuery 2: Only ERROR logs\n{namespace="production", app="api-service"} \n  |= "__ERROR__"\n\nQuery 3: Filter by specific error code\n{namespace="production", app="api-service"} \n  | json \n  | error_code="__DATABASE_TIMEOUT__"\n\nQuery 4: Count errors per minute\nsum(count_over_time(\n  {namespace="production", app="api-service"} |= "ERROR" [__1M__]\n)) by (service)\n\nQuery 5: Find logs for specific trace\n{namespace="production"} \n  | json \n  | trace_id="__ABC123__"',
        blanks: [
          {
            id: "NAMESPACE",
            label: "NAMESPACE",
            hint: "Kubernetes namespace label",
            correctValue: "namespace",
            validationPattern: "namespace",
          },
          {
            id: "APP",
            label: "APP",
            hint: "Application label",
            correctValue: "app",
            validationPattern: "app|service",
          },
          {
            id: "JSON",
            label: "JSON",
            hint: "Parse JSON logs",
            correctValue: "json",
            validationPattern: "json",
          },
          {
            id: "TIMESTAMP",
            label: "TIMESTAMP",
            hint: "Time field",
            correctValue: "timestamp",
            validationPattern: "timestamp|time",
          },
          {
            id: "ERROR",
            label: "ERROR",
            hint: "Error level filter",
            correctValue: "ERROR",
            validationPattern: "error",
          },
          {
            id: "DATABASE_TIMEOUT",
            label: "DATABASE_TIMEOUT",
            hint: "Specific error code",
            correctValue: "DATABASE_TIMEOUT",
            validationPattern: "database.*timeout|timeout",
          },
          {
            id: "1M",
            label: "1M",
            hint: "One minute time range",
            correctValue: "1m",
            validationPattern: "1m|60s",
          },
          {
            id: "ABC123",
            label: "ABC123",
            hint: "Trace identifier",
            correctValue: "abc-123",
            validationPattern: "abc|trace",
          },
        ],
        solution:
          'Query 1: {namespace="production", app="api-service"} | json | timestamp >= "2025-12-11T10:30:00Z" and timestamp < "2025-12-11T10:35:00Z"\nQuery 2: {namespace="production", app="api-service"} |= "ERROR"\nQuery 3: {namespace="production", app="api-service"} | json | error_code="DATABASE_TIMEOUT"\nQuery 4: sum(count_over_time({namespace="production", app="api-service"} |= "ERROR" [1m])) by (service)\nQuery 5: {namespace="production"} | json | trace_id="abc-123"',
        explanation:
          "LogQL queries for incident investigation and troubleshooting",
      },
      {
        exerciseNumber: 3,
        scenario: "Deploy Grafana Loki stack to Kubernetes.",
        template:
          'Installation steps:\n\n1. Add Helm repository:\nhelm repo add __GRAFANA__ https://grafana.github.io/helm-charts\n\n2. Install Loki stack:\nhelm install loki grafana/loki-stack \\\n  --namespace __LOGGING__ --create-namespace \\\n  --set grafana.enabled=__TRUE__ \\\n  --set promtail.enabled=true \\\n  --set loki.persistence.enabled=true \\\n  --set loki.persistence.size=__10GI__\n\n3. Verify Promtail DaemonSet:\nkubectl get __DAEMONSET__ -n logging\n\n4. Access Grafana:\nkubectl port-forward -n logging svc/loki-grafana __3000__:80\n\n5. Add Loki data source:\nURL: http://__LOKI__:3100\n\n6. Query logs:\n{namespace="__DEFAULT__"}',
        blanks: [
          {
            id: "GRAFANA",
            label: "GRAFANA",
            hint: "Helm repo name",
            correctValue: "grafana",
            validationPattern: "grafana",
          },
          {
            id: "LOGGING",
            label: "LOGGING",
            hint: "Target namespace",
            correctValue: "logging",
            validationPattern: "logging",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Enable Grafana",
            correctValue: "true",
            validationPattern: "true",
          },
          {
            id: "10GI",
            label: "10GI",
            hint: "Storage size",
            correctValue: "10Gi",
            validationPattern: "10.*gi|10g",
          },
          {
            id: "DAEMONSET",
            label: "DAEMONSET",
            hint: "Kubernetes resource type",
            correctValue: "daemonset",
            validationPattern: "daemonset|ds",
          },
          {
            id: "3000",
            label: "3000",
            hint: "Grafana port",
            correctValue: "3000",
            validationPattern: "3000",
          },
          {
            id: "LOKI",
            label: "LOKI",
            hint: "Loki service name",
            correctValue: "loki",
            validationPattern: "loki",
          },
          {
            id: "DEFAULT",
            label: "DEFAULT",
            hint: "Kubernetes namespace",
            correctValue: "default",
            validationPattern: "default",
          },
        ],
        solution:
          'helm repo add grafana https://grafana.github.io/helm-charts\nhelm install loki grafana/loki-stack --namespace logging --create-namespace --set grafana.enabled=true --set promtail.enabled=true --set loki.persistence.enabled=true --set loki.persistence.size=10Gi\nkubectl get daemonset -n logging\nkubectl port-forward -n logging svc/loki-grafana 3000:80\nData source URL: http://loki:3100\nQuery: {namespace="default"}',
        explanation: "Grafana Loki stack deployment for centralized logging",
      },
      {
        exerciseNumber: 4,
        scenario:
          "Configure Fluentd to parse and forward logs to Elasticsearch.",
        template:
          "Fluentd configuration:\n\n<source>\n  @type __TAIL__\n  path /var/log/containers/*.log\n  pos_file /var/log/fluentd-containers.log.pos\n  tag kubernetes.*\n  <parse>\n    @type __JSON__\n  </parse>\n</source>\n\n<filter kubernetes.**>\n  @type __KUBERNETES_METADATA__\n  @id filter_kube_metadata\n</filter>\n\n<filter kubernetes.**>\n  @type parser\n  key_name log\n  <parse>\n    @type json\n  </parse>\n</filter>\n\n<match **>\n  @type __ELASTICSEARCH__\n  host __ELASTICSEARCH__.logging.svc.cluster.local\n  port __9200__\n  index_name __K8S_LOGS__\n  type_name _doc\n  <buffer>\n    @type file\n    path /var/log/fluentd-buffers/kubernetes\n    flush_interval __5S__\n  </buffer>\n</match>",
        blanks: [
          {
            id: "TAIL",
            label: "TAIL",
            hint: "Input plugin to read files",
            correctValue: "tail",
            validationPattern: "tail",
          },
          {
            id: "JSON",
            label: "JSON",
            hint: "Parse format",
            correctValue: "json",
            validationPattern: "json",
          },
          {
            id: "KUBERNETES_METADATA",
            label: "KUBERNETES_METADATA",
            hint: "Filter to add K8s metadata",
            correctValue: "kubernetes_metadata",
            validationPattern: "kubernetes.*metadata",
          },
          {
            id: "ELASTICSEARCH",
            label: "ELASTICSEARCH",
            hint: "Output plugin",
            correctValue: "elasticsearch",
            validationPattern: "elasticsearch",
          },
          {
            id: "ELASTICSEARCH",
            label: "ELASTICSEARCH",
            hint: "Service hostname",
            correctValue: "elasticsearch",
            validationPattern: "elasticsearch",
          },
          {
            id: "9200",
            label: "9200",
            hint: "Elasticsearch port",
            correctValue: "9200",
            validationPattern: "9200",
          },
          {
            id: "K8S_LOGS",
            label: "K8S_LOGS",
            hint: "Index name",
            correctValue: "k8s-logs",
            validationPattern: "k8s.*logs",
          },
          {
            id: "5S",
            label: "5S",
            hint: "Flush interval",
            correctValue: "5s",
            validationPattern: "5s|5",
          },
        ],
        solution:
          "<source>\n  @type tail\n  path /var/log/containers/*.log\n  pos_file /var/log/fluentd-containers.log.pos\n  tag kubernetes.*\n  <parse>\n    @type json\n  </parse>\n</source>\n\n<filter kubernetes.**>\n  @type kubernetes_metadata\n  @id filter_kube_metadata\n</filter>\n\n<match **>\n  @type elasticsearch\n  host elasticsearch.logging.svc.cluster.local\n  port 9200\n  index_name k8s-logs\n  type_name _doc\n  <buffer>\n    @type file\n    path /var/log/fluentd-buffers/kubernetes\n    flush_interval 5s\n  </buffer>\n</match>",
        explanation:
          "Fluentd configuration for log collection and forwarding to Elasticsearch",
      },
      {
        exerciseNumber: 5,
        scenario: "Implement log retention policy in Elasticsearch.",
        template:
          'Index Lifecycle Management (ILM) policy:\n\nPUT _ilm/policy/k8s-logs-policy\n{\n  "policy": {\n    "phases": {\n      "__HOT__": {\n        "actions": {\n          "rollover": {\n            "max_size": "__50GB__",\n            "max_age": "__1D__"\n          }\n        }\n      },\n      "__WARM__": {\n        "min_age": "__7D__",\n        "actions": {\n          "shrink": { "number_of_shards": 1 },\n          "__FORCEMERGE__": { "max_num_segments": 1 }\n        }\n      },\n      "__DELETE__": {\n        "min_age": "__30D__",\n        "actions": { "delete": {} }\n      }\n    }\n  }\n}\n\nApply to index template:\nPUT _index_template/k8s-logs-template\n{\n  "index_patterns": ["k8s-logs-*"],\n  "template": {\n    "settings": {\n      "index.lifecycle.name": "k8s-logs-policy"\n    }\n  }\n}',
        blanks: [
          {
            id: "HOT",
            label: "HOT",
            hint: "Recent data phase",
            correctValue: "hot",
            validationPattern: "hot",
          },
          {
            id: "50GB",
            label: "50GB",
            hint: "Rollover size",
            correctValue: "50GB",
            validationPattern: "50.*gb|50g",
          },
          {
            id: "1D",
            label: "1D",
            hint: "Rollover age",
            correctValue: "1d",
            validationPattern: "1d|day",
          },
          {
            id: "WARM",
            label: "WARM",
            hint: "Older data phase",
            correctValue: "warm",
            validationPattern: "warm",
          },
          {
            id: "7D",
            label: "7D",
            hint: "Warm phase age",
            correctValue: "7d",
            validationPattern: "7d|week",
          },
          {
            id: "FORCEMERGE",
            label: "FORCEMERGE",
            hint: "Optimize segments",
            correctValue: "forcemerge",
            validationPattern: "forcemerge",
          },
          {
            id: "DELETE",
            label: "DELETE",
            hint: "Removal phase",
            correctValue: "delete",
            validationPattern: "delete",
          },
          {
            id: "30D",
            label: "30D",
            hint: "Delete after age",
            correctValue: "30d",
            validationPattern: "30d|month",
          },
        ],
        solution: `PUT _ilm/policy/k8s-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": { "delete": {} }
      }
    }
  }
}`,
        explanation:
          "Elasticsearch Index Lifecycle Management (ILM) policy for log retention",
      },
    ],
    hints: [
      "Use JSON structured logging consistently across all services",
      "Include trace_id in all logs for correlation",
      "Loki is lighter than ELK but has less powerful search",
      "LogQL syntax is similar to PromQL with label selectors",
      "Configure retention early - logs grow fast",
    ],
  },

  runGuided: {
    objective:
      "Deploy complete centralized logging solution for Kubernetes application",
    conceptualGuidance: [
      "Choose between Loki (lightweight) or ELK (powerful search)",
      "Decide on log aggregation stack (Loki or ELK)",
      "Deploy stack to Kubernetes with proper storage",
      "Deploy log collector on all nodes (Promtail or Fluentd)",
      "Implement structured logging in application services",
      "Configure log queries and dashboards",
      "Set up retention policies",
      "Test correlation with distributed traces",
    ],
    keyConceptsToApply: [
      "Centralized logging architecture",
      "Structured logging with JSON",
      "LogQL or KQL query languages",
      "Log retention and lifecycle management",
      "Correlation with distributed traces",
    ],
    checkpoints: [
      {
        checkpoint: "Log aggregation stack deployed",
        description: "Complete logging stack running in Kubernetes",
        validationCriteria: [
          "Log aggregation stack deployed (Loki or Elasticsearch)",
          "Log collector running on all nodes (Promtail or Fluentd DaemonSet)",
          "UI accessible (Grafana or Kibana)",
          "Logs being collected from all pods",
          "Persistent storage configured",
          "Can query logs in UI",
        ],
        hintIfStuck:
          'Loki: Lightweight, integrates with Grafana, cheaper. ELK: More powerful search, better for compliance. Use Helm charts for both options. Verify DaemonSet pods running on all nodes. Test with: {namespace="default"} or k8s.namespace: "default"',
      },
      {
        checkpoint: "Structured logging implemented",
        description: "All services emit JSON logs with consistent schema",
        validationCriteria: [
          "All services emit JSON logs",
          "Consistent schema (timestamp, level, service, trace_id)",
          "Correlation IDs in all logs",
          "Contextual data included (user_id, order_id)",
          "No sensitive data in logs (PII, secrets)",
          "Logs parseable by aggregator",
        ],
        hintIfStuck:
          "Use logging libraries: Winston (Node.js), Logrus (Go), Log4j2 (Java). Test JSON parsing: kubectl logs pod-name | jq. Include trace_id from OpenTelemetry context. Add structured fields, not formatted strings. Review for sensitive data before deploying.",
      },
      {
        checkpoint: "Log queries and correlation configured",
        description: "Queries, dashboards, and correlation with traces working",
        validationCriteria: [
          "Saved queries for error investigation",
          "Dashboard showing log trends (errors over time, top services)",
          "Can query by trace_id to find related logs",
          "Demonstrate workflow: alert → logs → trace",
          "Retention policy configured (e.g., 30 days)",
          "Access controls configured (RBAC)",
        ],
        hintIfStuck:
          "Loki: Use LogQL in Grafana Explore. ELK: Use KQL in Kibana Discover. Create visualizations from saved searches. Test correlation: generate trace_id, find in logs. Configure ILM or retention in Loki config. Use Kubernetes RBAC or Grafana teams for access control.",
      },
    ],
    resourcesAllowed: [
      "Loki or Elasticsearch documentation",
      "LogQL or KQL query guides",
      "Structured logging best practices",
      "OpenTelemetry context propagation docs",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready centralized logging platform with complete observability correlation",
    successCriteria: [
      "Log aggregation: Deploy Loki or ELK stack with high availability and persistence",
      "Log collection: Promtail or Fluentd DaemonSet collecting from all pods",
      "Structured logging: All services emit JSON logs with consistent schema",
      "Correlation: All logs include trace_id for linking to distributed traces",
      "Querying: Saved queries for common investigations (errors, latency, specific users)",
      "Dashboards: Log analytics dashboard (error trends, top services, volume)",
      "Retention: Lifecycle management (30-90 day retention with archival)",
      "Alerting: Log-based alerts (error rate spike, specific error patterns)",
      "Integration: Demonstrate correlation: metric alert → logs → trace → root cause",
      "Documentation: Log schema guide, query examples, troubleshooting runbooks",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Centralized logging collecting from all services",
      "Structured logs with JSON format",
      "Log queries and basic dashboard working",
    ],
    evaluationRubric: [
      {
        criterion: "Log Infrastructure",
        weight: 30,
        passingThreshold:
          "High-availability logging stack deployed (Loki or ELK). Log collection from all pods via DaemonSet. Persistence configured. Retention policy defined. Production-ready performance and reliability.",
      },
      {
        criterion: "Structured Logging",
        weight: 25,
        passingThreshold:
          "All services emit JSON logs. Consistent schema (timestamp, level, service, trace_id, message). Context propagation working. Logs include relevant metadata for debugging. Query performance optimized via proper structure.",
      },
      {
        criterion: "Query and Correlation",
        weight: 25,
        passingThreshold:
          "Saved queries enable common investigations. Can correlate logs via trace_id. Dashboards show log trends. Can navigate from alert → logs → trace → root cause. Fast query performance (<5 seconds).",
      },
      {
        criterion: "Operational Excellence",
        weight: 20,
        passingThreshold:
          "Retention policy prevents storage issues. Access controls configured. Log-based alerting working. Complete observability demonstrated (metrics + logs + traces). Documentation enables team self-service.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=h4Sl21AKiDg",
  documentation: [
    "https://grafana.com/docs/loki/latest/",
    "https://grafana.com/docs/loki/latest/logql/",
    "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html",
    "https://www.elastic.co/guide/en/kibana/current/index.html",
    "https://docs.fluentd.org/",
    "https://github.com/grafana/loki/tree/main/clients/cmd/promtail",
    "https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html",
  ],
  relatedConcepts: [
    "Centralized logging architectures",
    "Log aggregation patterns",
    "Structured logging best practices",
    "Log retention and compliance",
    "ELK vs Loki trade-offs",
    "LogQL and KQL query languages",
  ],
};

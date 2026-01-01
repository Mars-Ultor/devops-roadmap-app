/**
 * Week 8 Lesson 2 - Prometheus & Grafana
 * 4-Level Mastery Progression: Implementing metrics collection and visualization
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week8Lesson2PrometheusGrafana: LeveledLessonContent = {
  lessonId: 'week8-lesson2-prometheus-grafana',
  
  baseLesson: {
    title: 'Prometheus & Grafana: Metrics Collection and Visualization',
    description: 'Master Prometheus for metrics collection and Grafana for visualization in Kubernetes environments.',
    learningObjectives: [
      'Deploy Prometheus stack with Prometheus Operator',
      'Instrument applications with Prometheus client libraries',
      'Write PromQL queries for metrics analysis',
      'Build Grafana dashboards using RED methodology',
      'Configure alerts with PrometheusRule and Alertmanager'
    ],
    prerequisites: [
      'Kubernetes fundamentals',
      'Understanding of observability concepts',
      'Basic knowledge of metrics and time-series data'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Master Prometheus for metrics collection and Grafana for visualization. Learn to monitor Kubernetes applications with dashboards and alerts.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'What is Prometheus? Pull-based metrics collection',
        command: 'Prometheus architecture:\n1. Time-series database: Stores metrics over time\n2. Pull model: Prometheus scrapes /metrics endpoints\n3. PromQL: Query language for metrics\n4. Alertmanager: Handles alert routing\n\nExample: Prometheus scrapes http://api-service:8080/metrics every 15s',
        explanation: 'Prometheus is the standard for Kubernetes monitoring. It pulls metrics from your services (you don\'t push to it). Stores metrics as time-series (value + timestamp). PromQL lets you query and aggregate metrics. Widely adopted CNCF project.',
        expectedOutput: 'Understanding: Prometheus collects metrics by scraping HTTP endpoints, stores time-series data, and uses PromQL for queries.',
        validationCriteria: [
          'Pull-based (Prometheus scrapes targets)',
          'Time-series database (metrics with timestamps)',
          'PromQL for querying and alerting',
          'Service discovery for dynamic targets',
          'Integrates with Kubernetes natively'
        ],
        commonMistakes: [
          'Thinking it\'s push-based (it pulls metrics)',
          'Not exposing /metrics endpoint (Prometheus can\'t scrape)',
          'Querying raw metrics (should use rate, avg, etc.)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Prometheus metric types: Counter, Gauge, Histogram, Summary',
        command: 'Metric types:\n\n1. Counter: Always increases\n   http_requests_total{service="api"} 1000, 1050, 1100\n   Use: Count events (requests, errors)\n\n2. Gauge: Goes up and down\n   memory_usage_bytes{pod="api-123"} 512MB, 600MB, 450MB\n   Use: Current values (memory, active connections)\n\n3. Histogram: Distribution with buckets\n   http_request_duration_seconds_bucket{le="0.1"} 950\n   http_request_duration_seconds_bucket{le="0.5"} 990\n   Use: Latency percentiles\n\n4. Summary: Similar to histogram, client-side',
        explanation: 'Choose the right type: Counter for cumulative totals (use rate() to get per-second). Gauge for snapshots (current memory). Histogram for distributions (calculate p95, p99 latency). Histograms are more flexible than summaries.',
        expectedOutput: 'Understanding: Different metric types serve different monitoring purposes.',
        validationCriteria: [
          'Counter: Monotonically increasing values',
          'Gauge: Current state that fluctuates',
          'Histogram: Distributions with buckets (latency)',
          'Summary: Pre-calculated percentiles',
          'Use appropriate type for your metric'
        ],
        commonMistakes: [
          'Using counter for gauge data (wrong aggregation)',
          'Not using rate() on counters (get raw cumulative value)',
          'Too many histogram buckets (high cardinality)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Deploy Prometheus to Kubernetes with Prometheus Operator',
        command: 'Install Prometheus Operator:\n\nhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts\nhelm repo update\nhelm install prometheus prometheus-community/kube-prometheus-stack \\\n  --namespace monitoring --create-namespace\n\nThis deploys:\n- Prometheus (metrics collection)\n- Grafana (visualization)\n- Alertmanager (alert routing)\n- Node Exporter (node metrics)\n- Kube State Metrics (K8s object metrics)',
        explanation: 'Prometheus Operator simplifies Prometheus deployment on Kubernetes. Kube-prometheus-stack includes everything: Prometheus, Grafana, and exporters. Prometheus discovers pods automatically using Kubernetes service discovery. Grafana comes pre-configured with dashboards.',
        expectedOutput: 'Understanding: Prometheus Operator automates Prometheus deployment and configuration on Kubernetes.',
        validationCriteria: [
          'Prometheus deployed in monitoring namespace',
          'ServiceMonitor resources enable automatic discovery',
          'Grafana included for visualization',
          'Pre-built dashboards for Kubernetes',
          'Alertmanager for alert routing'
        ],
        commonMistakes: [
          'Manual Prometheus config (use Operator for K8s)',
          'Not using ServiceMonitor (manual scrape config)',
          'Wrong namespace (can\'t discover targets)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Expose metrics from your application',
        command: 'Example: Node.js app with Prometheus client\n\nconst express = require(\'express\');\nconst promClient = require(\'prom-client\');\n\n// Collect default metrics (CPU, memory)\npromClient.collectDefaultMetrics();\n\n// Custom counter\nconst httpRequestsTotal = new promClient.Counter({\n  name: \'http_requests_total\',\n  help: \'Total HTTP requests\',\n  labelNames: [\'method\', \'path\', \'status\']\n});\n\n// Expose /metrics endpoint\napp.get(\'/metrics\', async (req, res) => {\n  res.set(\'Content-Type\', promClient.register.contentType);\n  res.end(await promClient.register.metrics());\n});\n\n// Increment counter on each request\napp.use((req, res, next) => {\n  res.on(\'finish\', () => {\n    httpRequestsTotal.inc({ method: req.method, path: req.path, status: res.statusCode });\n  });\n  next();\n});',
        explanation: 'Prometheus client libraries exist for all languages (Go, Python, Java, Node.js). Expose /metrics endpoint. Prometheus scrapes it periodically. Include labels for filtering (method, status code). Track both default metrics (memory, CPU) and business metrics.',
        expectedOutput: 'Understanding: Applications expose metrics via /metrics endpoint using Prometheus client libraries.',
        validationCriteria: [
          '/metrics endpoint exposes Prometheus format',
          'Default metrics (CPU, memory) included',
          'Custom metrics for business logic',
          'Labels enable filtering and aggregation',
          'Metrics updated in real-time'
        ],
        commonMistakes: [
          'Not exposing /metrics (Prometheus can\'t scrape)',
          'High cardinality labels (user_id, request_id)',
          'Metrics without labels (can\'t filter)',
          'Not testing locally (curl localhost:8080/metrics)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Configure ServiceMonitor for automatic discovery',
        command: 'ServiceMonitor tells Prometheus which services to scrape:\n\napiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: api-service-monitor\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: api-service\n  endpoints:\n  - port: metrics  # Service port named "metrics"\n    path: /metrics\n    interval: 15s\n\nPrometheus automatically discovers pods matching label app=api-service',
        explanation: 'ServiceMonitor is a custom resource used by Prometheus Operator. It defines which services to scrape. Selector matches service labels. Prometheus auto-discovers pods when they start/stop. No manual configuration needed.',
        expectedOutput: 'Understanding: ServiceMonitor enables automatic service discovery for Prometheus in Kubernetes.',
        validationCriteria: [
          'ServiceMonitor targets services via labels',
          'Scrape interval configured (default 30s)',
          'Metrics path specified (/metrics)',
          'Automatic discovery (no manual config)',
          'Works with dynamic pods'
        ],
        commonMistakes: [
          'Label mismatch (ServiceMonitor can\'t find service)',
          'Wrong namespace (RBAC issues)',
          'Port not named "metrics" in Service',
          'Not checking Prometheus targets UI (can\'t see if discovery works)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'PromQL basics: Querying metrics',
        command: 'Common PromQL queries:\n\n# Raw metric value\nhttp_requests_total{service="api"}\n\n# Rate (requests per second)\nrate(http_requests_total{service="api"}[5m])\n\n# Sum across all pods\nsum(rate(http_requests_total[5m])) by (service)\n\n# 95th percentile latency\nhistogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))\n\n# Memory usage\ncontainer_memory_usage_bytes{pod="api-pod-123"}\n\n# Error rate percentage\nsum(rate(http_requests_total{status=~"5.."}[5m])) \n/ \nsum(rate(http_requests_total[5m])) * 100',
        explanation: 'PromQL is powerful but takes practice. rate() converts counter to per-second rate. sum() aggregates across dimensions. histogram_quantile() calculates percentiles. Use [5m] for 5-minute window. Test queries in Prometheus UI before using in dashboards.',
        expectedOutput: 'Understanding: PromQL enables powerful querying and aggregation of metric data.',
        validationCriteria: [
          'rate() for counters (per-second rate)',
          'Aggregation functions (sum, avg, max)',
          'Label filtering (service="api")',
          'Time ranges ([5m], [1h])',
          'Percentile calculations with histogram_quantile()'
        ],
        commonMistakes: [
          'Using counter without rate() (get total, not rate)',
          'Wrong time range (too short = noisy, too long = delayed)',
          'Not testing queries (syntax errors in production)',
          'Complex queries without recording rules (slow)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Grafana: Visualizing Prometheus metrics',
        command: 'Access Grafana:\nkubectl port-forward -n monitoring svc/prometheus-grafana 3000:80\n\nDefault credentials: admin / prom-operator\n\nCreate dashboard:\n1. Add panel → Select Prometheus data source\n2. Enter PromQL query: rate(http_requests_total[5m])\n3. Visualization: Graph (time series)\n4. Add threshold: Warning at 1000 req/s\n5. Save dashboard\n\nPre-built dashboards available:\n- Kubernetes cluster monitoring\n- Node exporter metrics\n- Pod metrics',
        explanation: 'Grafana connects to Prometheus as data source. Build dashboards with multiple panels (graphs, gauges, tables). Each panel runs a PromQL query. Can set thresholds for visual alerts (yellow, red). Import community dashboards for Kubernetes, databases, applications.',
        expectedOutput: 'Understanding: Grafana provides rich visualization and dashboarding for Prometheus metrics.',
        validationCriteria: [
          'Grafana connected to Prometheus',
          'Dashboards with multiple panels',
          'PromQL queries in panels',
          'Thresholds for visual alerts',
          'Can import community dashboards'
        ],
        commonMistakes: [
          'Not using variables (hardcoding service names)',
          'Too many panels (overwhelming)',
          'No thresholds (can\'t spot problems visually)',
          'Not organizing dashboards (hard to find)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'RED method: Rate, Errors, Duration',
        command: 'Essential service metrics (RED method):\n\n1. Rate: Request throughput\n   sum(rate(http_requests_total[5m])) by (service)\n\n2. Errors: Error rate\n   sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)\n\n3. Duration: Latency (p95, p99)\n   histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))\n\nEvery service should have RED dashboard',
        explanation: 'RED method is industry standard for service monitoring. Rate shows load. Errors show reliability. Duration shows performance. Three metrics give comprehensive service health. Create RED dashboard for each microservice. Quick glance tells you service health.',
        expectedOutput: 'Understanding: RED method provides essential metrics for monitoring any service.',
        validationCriteria: [
          'Rate: Requests per second',
          'Errors: Error rate or count',
          'Duration: Latency percentiles (p50, p95, p99)',
          'Applied to every service',
          'Single dashboard shows service health'
        ],
        commonMistakes: [
          'Monitoring only infrastructure (not service metrics)',
          'Missing one of RED (incomplete picture)',
          'Using average latency (hides outliers, use percentiles)',
          'No per-endpoint breakdown (can\'t identify slow endpoints)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'USE method: Utilization, Saturation, Errors (for resources)',
        command: 'Resource monitoring (USE method):\n\nFor each resource (CPU, memory, disk, network):\n\n1. Utilization: % used\n   CPU: rate(container_cpu_usage_seconds_total[5m])\n   Memory: container_memory_usage_bytes\n\n2. Saturation: Queueing/waiting\n   CPU: Wait time, throttling\n   Memory: Swap usage\n\n3. Errors: Error events\n   Disk: I/O errors\n   Network: Packet loss\n\nUSE for resources, RED for services',
        explanation: 'USE method is for infrastructure resources. Utilization shows current usage. Saturation shows if resource is overloaded (queueing). Errors show failures. High utilization + high saturation = need more resources. Use RED for services, USE for resources.',
        expectedOutput: 'Understanding: USE method provides comprehensive resource monitoring.',
        validationCriteria: [
          'Utilization: How much resource is used',
          'Saturation: How much is waiting/queued',
          'Errors: Resource failures',
          'Applied to CPU, memory, disk, network',
          'Complements RED method (RED=services, USE=resources)'
        ],
        commonMistakes: [
          'Only monitoring utilization (miss saturation)',
          'Not monitoring saturation (don\'t see bottlenecks)',
          'Using USE for services (use RED instead)',
          'No alerts on saturation (only find out when failures happen)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Recording rules: Pre-compute expensive queries',
        command: 'Recording rule: Calculate and store query results\n\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: api-recording-rules\n  namespace: monitoring\nspec:\n  groups:\n  - name: api_service\n    interval: 30s\n    rules:\n    - record: job:http_requests:rate5m\n      expr: sum(rate(http_requests_total[5m])) by (job)\n    - record: job:http_errors:rate5m\n      expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)\n\nNow use pre-computed metric:\njob:http_requests:rate5m{job="api"}',
        explanation: 'Recording rules pre-calculate expensive queries and store results as new metrics. Dashboards query the pre-computed metric (fast). Reduces load on Prometheus. Useful for complex aggregations used in multiple dashboards. Run every 30s (configurable).',
        expectedOutput: 'Understanding: Recording rules optimize frequently-used queries by pre-computing results.',
        validationCriteria: [
          'Pre-computes expensive queries',
          'Stores as new metric',
          'Reduces dashboard query time',
          'Useful for queries used in multiple dashboards',
          'Configurable evaluation interval'
        ],
        commonMistakes: [
          'Recording rules for simple queries (unnecessary)',
          'Not using consistent naming (job:metric:aggregation)',
          'Too many recording rules (storage overhead)',
          'Recording rule depends on another recording rule (complex dependencies)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Alerting with PrometheusRule',
        command: 'Alert rule: Notify when condition met\n\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: api-alerts\n  namespace: monitoring\nspec:\n  groups:\n  - name: api_alerts\n    rules:\n    - alert: HighErrorRate\n      expr: |\n        sum(rate(http_requests_total{status=~"5.."}[5m])) \n        / \n        sum(rate(http_requests_total[5m])) > 0.05\n      for: 5m\n      labels:\n        severity: critical\n      annotations:\n        summary: "High error rate on {{ $labels.service }}"\n        description: "Error rate is {{ $value | humanizePercentage }}"\n        runbook_url: "https://wiki.company.com/runbooks/high-error-rate"',
        explanation: 'PrometheusRule defines alerts. Alert fires when expr is true for duration (for: 5m). Labels control routing (critical → page). Annotations provide context. Alertmanager receives firing alerts and routes them (Slack, PagerDuty, email). Include runbook URLs.',
        expectedOutput: 'Understanding: PrometheusRule defines alert conditions that Alertmanager routes to responders.',
        validationCriteria: [
          'Alert condition in PromQL',
          'Duration (for:) prevents flapping',
          'Severity labels for routing',
          'Annotations with context and runbook',
          'Alertmanager handles delivery'
        ],
        commonMistakes: [
          'No "for" duration (flapping alerts)',
          'Missing runbook (engineers don\'t know what to do)',
          'Alert on symptoms not visible to users',
          'Too many alerts (alert fatigue)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Grafana alerting and visualization best practices',
        command: 'Dashboard best practices:\n\n1. Structure: Organize by service or layer\n   - Cluster overview dashboard\n   - Per-service RED dashboards\n   - Resource (USE) dashboards\n\n2. Variables: Parameterize dashboards\n   - Namespace selector\n   - Service selector\n   - Time range picker\n\n3. Panels: Focus on actionable data\n   - RED metrics prominent\n   - SLO indicators\n   - Deployment annotations (show when deploys happened)\n\n4. Alerts: Configure in Grafana or Prometheus\n   - Link panels to alerts\n   - Test alert rules\n   - Include notification channels (Slack, email)',
        explanation: 'Good dashboards are organized, parameterized, and actionable. Use folders to categorize. Variables let users filter by namespace/service. Annotations show deploy times (correlate with metric changes). Both Prometheus and Grafana can alert - use Prometheus for metrics-based, Grafana for log-based.',
        expectedOutput: 'Understanding: Well-designed dashboards provide at-a-glance service health and rapid problem diagnosis.',
        validationCriteria: [
          'Organized dashboard structure',
          'Variables for filtering',
          'RED/USE metrics prominent',
          'Deployment annotations',
          'Links to runbooks',
          'Alerts configured and tested'
        ],
        commonMistakes: [
          'Too many dashboards (hard to find right one)',
          'No variables (separate dashboard per service)',
          'Information overload (too many panels)',
          'No annotations (can\'t correlate with deployments)',
          'Alerts not tested (fire when you don\'t expect)'
        ]
      }
    ],
    expectedOutcome: 'You understand Prometheus architecture, metric types, deployment with Operator, application instrumentation, PromQL queries, Grafana dashboarding, RED/USE methods, recording rules, and alerting. You can monitor Kubernetes applications end-to-end.'
  },

  walk: {
    introduction: 'Apply Prometheus and Grafana knowledge through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Instrument a Node.js API with Prometheus metrics.',
        template: 'Install Prometheus client:\nnpm install prom-client\n\nCode:\nconst promClient = require(\'prom-client\');\n\n// Default metrics\npromClient.collectDefaultMetrics();\n\n// Custom counter\nconst httpRequestsTotal = new promClient.__COUNTER__({\n  name: \'__HTTP_REQUESTS_TOTAL__\',\n  help: \'Total HTTP requests\',\n  labelNames: [\'__METHOD__\', \'__PATH__\', \'__STATUS__\']\n});\n\n// Custom histogram\nconst httpDuration = new promClient.__HISTOGRAM__({\n  name: \'http_request_duration_seconds\',\n  help: \'HTTP request latency\',\n  labelNames: [\'method\', \'path\', \'status\'],\n  buckets: [0.1, 0.5, 1, 2, 5]\n});\n\n// Expose /metrics\napp.get(\'/metrics\', async (req, res) => {\n  res.set(\'Content-Type\', promClient.register.contentType);\n  res.end(await promClient.register.__METRICS__());\n});\n\n// Track metrics\napp.use((req, res, next) => {\n  const end = httpDuration.startTimer();\n  res.on(\'finish\', () => {\n    httpRequestsTotal.inc({ method: req.method, path: req.path, status: res.statusCode });\n    end({ method: req.method, path: req.path, status: res.statusCode });\n  });\n  next();\n});',
        blanks: [
          {
            id: 'COUNTER',
            label: 'COUNTER',
            hint: 'Metric type that only increases',
            correctValue: 'Counter',
            validationPattern: 'counter'
          },
          {
            id: 'HTTP_REQUESTS_TOTAL',
            label: 'HTTP_REQUESTS_TOTAL',
            hint: 'Metric name for request count',
            correctValue: 'http_requests_total',
            validationPattern: 'http.*requests.*total'
          },
          {
            id: 'METHOD',
            label: 'METHOD',
            hint: 'HTTP method label (GET, POST)',
            correctValue: 'method',
            validationPattern: 'method'
          },
          {
            id: 'PATH',
            label: 'PATH',
            hint: 'Request path label',
            correctValue: 'path',
            validationPattern: 'path|route|endpoint'
          },
          {
            id: 'STATUS',
            label: 'STATUS',
            hint: 'HTTP status code label',
            correctValue: 'status',
            validationPattern: 'status|code'
          },
          {
            id: 'HISTOGRAM',
            label: 'HISTOGRAM',
            hint: 'Metric type for distributions',
            correctValue: 'Histogram',
            validationPattern: 'histogram'
          },
          {
            id: 'METRICS',
            label: 'METRICS',
            hint: 'Method to get all metrics',
            correctValue: 'metrics',
            validationPattern: 'metrics'
          }
        ],
        solution: 'Install Prometheus client:\nnpm install prom-client\n\nCode:\nconst promClient = require(\'prom-client\');\n\n// Default metrics\npromClient.collectDefaultMetrics();\n\n// Custom counter\nconst httpRequestsTotal = new promClient.Counter({\n  name: \'http_requests_total\',\n  help: \'Total HTTP requests\',\n  labelNames: [\'method\', \'path\', \'status\']\n});\n\n// Custom histogram\nconst httpDuration = new promClient.Histogram({\n  name: \'http_request_duration_seconds\',\n  help: \'HTTP request latency\',\n  labelNames: [\'method\', \'path\', \'status\'],\n  buckets: [0.1, 0.5, 1, 2, 5]\n});\n\n// Expose /metrics\napp.get(\'/metrics\', async (req, res) => {\n  res.set(\'Content-Type\', promClient.register.contentType);\n  res.end(await promClient.register.metrics());\n});\n\n// Track metrics\napp.use((req, res, next) => {\n  const end = httpDuration.startTimer();\n  res.on(\'finish\', () => {\n    httpRequestsTotal.inc({ method: req.method, path: req.path, status: res.statusCode });\n    end({ method: req.method, path: req.path, status: res.statusCode });\n  });\n  next();\n});',
        explanation: 'Complete application instrumentation with Prometheus metrics'
      },
      {
        exerciseNumber: 2,
        scenario: 'Write PromQL queries for service monitoring.',
        template: 'Queries:\n\n1. Request rate (req/sec):\n__RATE__(http_requests_total[5m])\n\n2. Total requests across all pods:\n__SUM__(rate(http_requests_total[5m])) by (__SERVICE__)\n\n3. Error rate percentage:\nsum(rate(http_requests_total{status=~"__5XX__"}[5m])) \n/ \nsum(rate(http_requests_total[5m])) * __100__\n\n4. 95th percentile latency:\n__HISTOGRAM_QUANTILE__(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))\n\n5. Memory usage:\ncontainer_memory_usage_bytes{pod=~"api-.*"}\n\n6. Requests per minute (last hour):\nsum(increase(http_requests_total[__1H__]))',
        blanks: [
          {
            id: 'RATE',
            label: 'RATE',
            hint: 'Function to calculate per-second rate',
            correctValue: 'rate',
            validationPattern: 'rate'
          },
          {
            id: 'SUM',
            label: 'SUM',
            hint: 'Aggregation function',
            correctValue: 'sum',
            validationPattern: 'sum'
          },
          {
            id: 'SERVICE',
            label: 'SERVICE',
            hint: 'Label to group by',
            correctValue: 'service',
            validationPattern: 'service|job'
          },
          {
            id: '5XX',
            label: '5XX',
            hint: 'Server error status codes',
            correctValue: '5..',
            validationPattern: '5\\.\\.|5xx'
          },
          {
            id: '100',
            label: '100',
            hint: 'Convert to percentage',
            correctValue: '100',
            validationPattern: '100'
          },
          {
            id: 'HISTOGRAM_QUANTILE',
            label: 'HISTOGRAM_QUANTILE',
            hint: 'Function to calculate percentiles',
            correctValue: 'histogram_quantile',
            validationPattern: 'histogram.*quantile'
          },
          {
            id: '1H',
            label: '1H',
            hint: 'One hour time range',
            correctValue: '1h',
            validationPattern: '1h|60m'
          }
        ],
        solution: 'Queries:\n\n1. Request rate (req/sec): rate(http_requests_total[5m])\n2. Total requests across all pods: sum(rate(http_requests_total[5m])) by (service)\n3. Error rate percentage: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100\n4. 95th percentile latency: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))\n5. Memory usage: container_memory_usage_bytes{pod=~"api-.*"}\n6. Requests per minute (last hour): sum(increase(http_requests_total[1h]))',
        explanation: 'Essential PromQL query patterns for service monitoring and alerting'
      },
      {
        exerciseNumber: 3,
        scenario: 'Create ServiceMonitor for automatic service discovery.',
        template: 'ServiceMonitor configuration:\n\napiVersion: monitoring.coreos.com/v1\nkind: __SERVICEMONITOR__\nmetadata:\n  name: api-service-monitor\n  namespace: __MONITORING__\n  labels:\n    release: prometheus\nspec:\n  selector:\n    matchLabels:\n      app: __API_SERVICE__\n  endpoints:\n  - port: __METRICS__\n    path: __/METRICS__\n    interval: __15S__\n    scrapeTimeout: 10s\n\nService (must have matching labels):\napiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\n  labels:\n    app: api-service\nspec:\n  ports:\n  - name: metrics\n    port: 8080\n  selector:\n    app: api-service',
        blanks: [
          {
            id: 'SERVICEMONITOR',
            label: 'SERVICEMONITOR',
            hint: 'Custom resource for Prometheus Operator',
            correctValue: 'ServiceMonitor',
            validationPattern: 'servicemonitor'
          },
          {
            id: 'MONITORING',
            label: 'MONITORING',
            hint: 'Namespace where Prometheus runs',
            correctValue: 'monitoring',
            validationPattern: 'monitoring'
          },
          {
            id: 'API_SERVICE',
            label: 'API_SERVICE',
            hint: 'Label value to match',
            correctValue: 'api-service',
            validationPattern: 'api.*service'
          },
          {
            id: 'METRICS',
            label: 'METRICS',
            hint: 'Port name for metrics',
            correctValue: 'metrics',
            validationPattern: 'metrics'
          },
          {
            id: '/METRICS',
            label: '/METRICS',
            hint: 'Endpoint path',
            correctValue: '/metrics',
            validationPattern: '/metrics'
          },
          {
            id: '15S',
            label: '15S',
            hint: 'Scrape interval',
            correctValue: '15s',
            validationPattern: '15s|30s'
          }
        ],
        solution: 'apiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: api-service-monitor\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: api-service\n  endpoints:\n  - port: metrics\n    path: /metrics\n    interval: 15s',
        explanation: 'ServiceMonitor configuration for automatic service discovery'
      },
      {
        exerciseNumber: 4,
        scenario: 'Build Grafana RED dashboard for a service.',
        template: 'Dashboard panels:\n\nPanel 1: Request Rate\nQuery: sum(rate(http_requests_total{service="api"}[__5M__])) by (method)\nVisualization: __TIME_SERIES__\nUnit: req/s\n\nPanel 2: Error Rate\nQuery: sum(rate(http_requests_total{service="api", status=~"__5XX__"}[5m])) \n       / \n       sum(rate(http_requests_total{service="api"}[5m])) * 100\nVisualization: __STAT__ (single value)\nUnit: __PERCENT__\nThresholds: < 1% green, 1-5% yellow, > 5% red\n\nPanel 3: Latency (p95)\nQuery: __HISTOGRAM_QUANTILE__(0.95, \n         sum(rate(http_request_duration_seconds_bucket{service="api"}[5m])) by (le))\nVisualization: Time series\nUnit: __SECONDS__\nThresholds: < 200ms green, 200-500ms yellow, > 500ms red\n\nPanel 4: Request Volume (total)\nQuery: sum(__INCREASE__(http_requests_total{service="api"}[1h]))\nVisualization: Stat\nUnit: requests',
        blanks: [
          {
            id: '5M',
            label: '5M',
            hint: 'Five minute time range',
            correctValue: '5m',
            validationPattern: '5m'
          },
          {
            id: 'TIME_SERIES',
            label: 'TIME_SERIES',
            hint: 'Graph visualization type',
            correctValue: 'Time series',
            validationPattern: 'time.*series|graph'
          },
          {
            id: '5XX',
            label: '5XX',
            hint: 'Server error pattern',
            correctValue: '5..',
            validationPattern: '5\\.\\.|5xx'
          },
          {
            id: 'STAT',
            label: 'STAT',
            hint: 'Single value panel type',
            correctValue: 'Stat',
            validationPattern: 'stat|singlestat'
          },
          {
            id: 'PERCENT',
            label: 'PERCENT',
            hint: 'Unit for percentages',
            correctValue: 'percent',
            validationPattern: 'percent|%'
          },
          {
            id: 'HISTOGRAM_QUANTILE',
            label: 'HISTOGRAM_QUANTILE',
            hint: 'Percentile calculation function',
            correctValue: 'histogram_quantile',
            validationPattern: 'histogram.*quantile'
          },
          {
            id: 'SECONDS',
            label: 'SECONDS',
            hint: 'Unit for duration',
            correctValue: 'seconds',
            validationPattern: 'seconds|s'
          },
          {
            id: 'INCREASE',
            label: 'INCREASE',
            hint: 'Total increase over time range',
            correctValue: 'increase',
            validationPattern: 'increase'
          }
        ],
        solution: 'Dashboard panels:\n\nPanel 1: Request Rate\nQuery: sum(rate(http_requests_total{service="api"}[5m])) by (method)\nVisualization: Time series\nUnit: req/s\n\nPanel 2: Error Rate\nQuery: sum(rate(http_requests_total{service="api", status=~"5.."}[5m])) / sum(rate(http_requests_total{service="api"}[5m])) * 100\nVisualization: Stat\nUnit: percent\nThresholds: < 1% green, 1-5% yellow, > 5% red\n\nPanel 3: Latency (p95)\nQuery: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="api"}[5m])) by (le))\nVisualization: Time series\nUnit: seconds\nThresholds: < 200ms green, 200-500ms yellow, > 500ms red\n\nPanel 4: Request Volume (total)\nQuery: sum(increase(http_requests_total{service="api"}[1h]))\nVisualization: Stat\nUnit: requests',
        explanation: 'Complete RED dashboard for service monitoring'
      },
      {
        exerciseNumber: 5,
        scenario: 'Configure Prometheus alerts for service health.',
        template: 'PrometheusRule:\n\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: api-alerts\n  namespace: monitoring\nspec:\n  groups:\n  - name: api_service_alerts\n    rules:\n    - alert: __HIGH_ERROR_RATE__\n      expr: |\n        sum(rate(http_requests_total{status=~"5.."}[5m])) \n        / \n        sum(rate(http_requests_total[5m])) > __0.05__\n      for: __5M__\n      labels:\n        severity: __CRITICAL__\n      annotations:\n        summary: "High error rate on API service"\n        description: "Error rate is {{ $value | humanizePercentage }}"\n        runbook_url: "https://wiki.example.com/runbooks/high-error-rate"\n    \n    - alert: HighLatency\n      expr: |\n        histogram_quantile(0.95, \n          sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > __0.5__\n      for: 10m\n      labels:\n        severity: __WARNING__\n      annotations:\n        summary: "High latency on API service"\n        description: "p95 latency is {{ $value }}s"',
        blanks: [
          {
            id: 'HIGH_ERROR_RATE',
            label: 'HIGH_ERROR_RATE',
            hint: 'Alert name',
            correctValue: 'HighErrorRate',
            validationPattern: 'high.*error.*rate'
          },
          {
            id: '0.05',
            label: '0.05',
            hint: '5% threshold',
            correctValue: '0.05',
            validationPattern: '0\\.05|5%'
          },
          {
            id: '5M',
            label: '5M',
            hint: 'Duration before firing',
            correctValue: '5m',
            validationPattern: '5m'
          },
          {
            id: 'CRITICAL',
            label: 'CRITICAL',
            hint: 'High severity label',
            correctValue: 'critical',
            validationPattern: 'critical'
          },
          {
            id: '0.5',
            label: '0.5',
            hint: '500ms in seconds',
            correctValue: '0.5',
            validationPattern: '0\\.5|500ms'
          },
          {
            id: 'WARNING',
            label: 'WARNING',
            hint: 'Medium severity label',
            correctValue: 'warning',
            validationPattern: 'warning'
          }
        ],
        solution: 'PrometheusRule:\n\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: api-alerts\n  namespace: monitoring\nspec:\n  groups:\n  - name: api_service_alerts\n    rules:\n    - alert: HighErrorRate\n      expr: |\n        sum(rate(http_requests_total{status=~"5.."}[5m])) \n        / \n        sum(rate(http_requests_total[5m])) > 0.05\n      for: 5m\n      labels:\n        severity: critical\n      annotations:\n        summary: "High error rate on API service"\n        description: "Error rate is {{ $value | humanizePercentage }}"\n        runbook_url: "https://wiki.example.com/runbooks/high-error-rate"\n    \n    - alert: HighLatency\n      expr: |\n        histogram_quantile(0.95, \n          sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.5\n      for: 10m\n      labels:\n        severity: warning\n      annotations:\n        summary: "High latency on API service"\n        description: "p95 latency is {{ $value }}s"',
        explanation: 'Prometheus alert configuration with critical and warning thresholds'
      }
    ],
    hints: [
      'Use prom-client library for Node.js, prometheus_client for Python',
      'Test PromQL queries in Prometheus UI before adding to dashboards',
      'ServiceMonitor labels must match Service labels exactly',
      'Use rate() for counters, not raw values',
      'Create recording rules for complex queries used in multiple places'
    ]
  },

  runGuided: {
    objective: 'Deploy and configure complete Prometheus/Grafana monitoring stack for Kubernetes applications',
    conceptualGuidance: [
      'Choose deployment method: Prometheus Operator (kube-prometheus-stack) for Kubernetes',
      'Understand service discovery: how Prometheus finds targets automatically',
      'Plan instrumentation: which metrics to collect from applications',
      'Design dashboards: RED (Rate, Errors, Duration) for services, USE (Utilization, Saturation, Errors) for resources',
      'Configure alerting: critical vs warning, notification routing',
      'Set up recording rules: pre-compute expensive queries',
      'Plan retention: balance visibility with storage costs',
      'Implement high availability: multiple Prometheus replicas',
      'Secure the stack: authentication, RBAC, network policies',
      'Document for team: runbooks, query examples, dashboard usage'
    ],
    keyConceptsToApply: [
      'Prometheus pull-based architecture',
      'PromQL query language',
      'ServiceMonitor for service discovery',
      'RED and USE methodologies',
      'Alert rule design and routing'
    ],
    checkpoints: [
      {
        checkpoint: 'Prometheus stack deployed',
        description: 'Complete Prometheus Operator stack running in Kubernetes',
        validationCriteria: [
          'Prometheus Operator installed in monitoring namespace',
          'Prometheus discovering default targets (kubelet, kube-state-metrics, node-exporter)',
          'Grafana accessible and connected to Prometheus',
          'Alertmanager deployed',
          'Pre-built Kubernetes dashboards working'
        ],
        hintIfStuck: 'Use Helm: helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace. Access Grafana: kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80. Get password: kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d'
      },
      {
        checkpoint: 'Application instrumented and discovered',
        description: 'Application exposing metrics, Prometheus scraping successfully',
        validationCriteria: [
          'Application exposes /metrics endpoint in Prometheus format',
          'ServiceMonitor created with correct label selector',
          'Application appears in Prometheus targets UI',
          'Metrics visible in Prometheus query UI',
          'Custom metrics (http_requests_total, http_request_duration_seconds) tracked'
        ],
        hintIfStuck: 'Use Prometheus client library for your language. ServiceMonitor selector must match Service labels. Service must have named port (e.g., name: metrics). Test locally: curl http://your-service:port/metrics'
      },
      {
        checkpoint: 'Dashboards and alerts configured',
        description: 'Grafana dashboards showing service health, alerts firing correctly',
        validationCriteria: [
          'RED dashboard with Rate, Errors, Duration panels',
          'Dashboard uses variables for namespace/service selection',
          'Alerts configured in PrometheusRule',
          'Alertmanager routing configured',
          'Test alerts by triggering conditions',
          'Runbooks linked in alert annotations'
        ],
        hintIfStuck: 'Use PromQL: rate() for throughput, histogram_quantile() for percentiles. Set realistic thresholds (test in staging). Configure Alertmanager routing in values.yaml. Test alerts by injecting errors or latency.'
      }
    ],
    resourcesAllowed: [
      'Prometheus documentation',
      'Grafana documentation',
      'PromQL query examples',
      'RED/USE methodology guides'
    ]
  },

  runIndependent: {
    objective: 'Build production-grade monitoring solution for multi-service e-commerce platform with comprehensive visibility, proactive alerting, and rapid troubleshooting',
    successCriteria: [
      'Complete Prometheus/Grafana infrastructure: High availability deployment with 3 Prometheus replicas',
      'Comprehensive instrumentation: All services expose RED metrics with consistent labeling',
      'Automatic discovery: ServiceMonitors configured for all application services',
      'Actionable dashboards: Cluster overview, per-service RED, resource USE, SLO tracking',
      'Intelligent alerting: Multi-tier alerts (Critical/Warning) with runbooks and Slack/PagerDuty integration',
      'Performance optimization: Recording rules for expensive queries, appropriate retention (30 days + long-term with Thanos)',
      'Security hardening: Authentication, RBAC, secure communications',
      'SLO tracking: Error budget dashboards showing burn rate',
      'Operational documentation: Alert runbooks, dashboard usage guide, PromQL query examples',
      'Validation: Can demonstrate incident detection, investigation, and resolution workflow'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Prometheus stack deployed and scraping services',
      'At least one service instrumented with custom metrics',
      'Basic RED dashboard created',
      'At least one alert configured and tested'
    ],
    evaluationRubric: [
      {
        criterion: 'Monitoring Coverage',
        weight: 30,
        passingThreshold: 'All microservices instrumented and auto-discovered. Dashboards cover service health (RED) and resources (USE). No monitoring blind spots. Can track requests end-to-end.'
      },
      {
        criterion: 'Alerting Quality',
        weight: 25,
        passingThreshold: 'Alerts are actionable and tuned (no false positives). Multi-tier severity with appropriate routing. Runbooks guide responders. SLO-based alerting prevents alert fatigue.'
      },
      {
        criterion: 'Operational Readiness',
        weight: 25,
        passingThreshold: 'High availability configured. Appropriate retention and storage. Recording rules optimize performance. Security hardened (auth, RBAC). Documented for team use.'
      },
      {
        criterion: 'Troubleshooting Capability',
        weight: 20,
        passingThreshold: 'Dashboards enable rapid issue identification. Can correlate metrics across services. Demonstrate efficient incident investigation. SLO tracking guides prioritization.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=h4Sl21AKiDg',
  documentation: [
      'https://prometheus.io/docs/introduction/overview/',
      'https://prometheus.io/docs/prometheus/latest/querying/basics/',
      'https://prometheus-operator.dev/docs/prologue/introduction/',
      'https://grafana.com/docs/grafana/latest/getting-started/',
      'https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/',
      'https://www.brendangregg.com/usemethod.html',
      'https://prometheus.io/docs/practices/alerting/'
  ],
  relatedConcepts: [
    'RED methodology (Rate, Errors, Duration)',
    'USE methodology (Utilization, Saturation, Errors)',
    'PromQL query language',
    'Service discovery patterns',
    'SLO-based alerting',
    'Time-series databases'
  ]
};

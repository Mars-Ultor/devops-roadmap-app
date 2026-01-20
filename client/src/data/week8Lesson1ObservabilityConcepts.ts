/**
 * Week 8 Lesson 1 - Observability Concepts
 * 4-Level Mastery Progression: Understanding monitoring, metrics, logs, and traces
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week8Lesson1ObservabilityConcepts: LeveledLessonContent = {
  lessonId: "week8-lesson1-observability-concepts",

  baseLesson: {
    title: "Observability Fundamentals: Metrics, Logs, and Traces",
    description:
      "Master the three pillars of observability and learn to build observable systems that enable rapid debugging and proactive issue detection.",
    learningObjectives: [
      "Understand the three pillars: metrics, logs, and distributed traces",
      "Implement structured logging and metric instrumentation",
      "Correlate observability data for incident investigation",
      "Define and track Service Level Objectives (SLOs)",
      "Design alerting strategies that avoid alert fatigue",
    ],
    prerequisites: [
      "Understanding of microservices architecture",
      "Basic knowledge of Kubernetes",
      "Familiarity with HTTP and REST APIs",
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
      "Master observability fundamentals: the three pillars (metrics, logs, traces) and why production systems need comprehensive visibility.",
    steps: [
      {
        stepNumber: 1,
        instruction:
          "Why Observability? Understanding the production blindness problem",
        command:
          "Scenario: Application deployed to production\n- Users report \"site is slow\"\n- No visibility into what's happening inside\n- Can't answer: Which service? What resource? Why now?\n\nObservability = ability to understand internal system state from external outputs",
        explanation:
          "Traditional monitoring alerts you that something is wrong. Observability lets you investigate WHY it's wrong. In microservices with 10+ services, you need to trace requests across systems, correlate metrics with logs, and identify root causes quickly.",
        expectedOutput:
          "Understanding: Observability provides the data needed to debug unknown problems in production systems.",
        validationCriteria: [
          "Monitoring = known problems (disk full, server down)",
          "Observability = unknown problems (why is checkout slow?)",
          "Enables debugging without predefined dashboards",
          "Critical for distributed systems (microservices)",
          'Answers "why" not just "what"',
        ],
        commonMistakes: [
          "Thinking monitoring is enough (only catches known issues)",
          "Adding observability after production problems (too late)",
          'Not investing in observability for "simple" systems',
        ],
      },
      {
        stepNumber: 2,
        instruction: "Three Pillars of Observability: Metrics, Logs, Traces",
        command:
          "Pillar 1 - Metrics: Numerical measurements over time\n- CPU usage: 45%, 62%, 78%\n- Request rate: 1000 req/sec\n- Error rate: 0.5%\n- Response time: p95 = 250ms\n\nGood for: Aggregation, trending, alerting",
        explanation:
          'Metrics are numbers that change over time. Low storage cost (just numbers). Great for dashboards and alerts. Example: "API response time increased from 100ms to 500ms" tells you there\'s a problem but not why.',
        expectedOutput:
          "Understanding: Metrics provide quantitative data about system performance and health.",
        validationCriteria: [
          "Metrics are numerical time-series data",
          "Low cardinality (not unique per request)",
          "Cheap to store and query",
          "Show trends and patterns",
          "Trigger alerts based on thresholds",
        ],
        commonMistakes: [
          "High cardinality metrics (user_id in metric name)",
          "Only tracking infrastructure (not application metrics)",
          "Not tracking business metrics (signups, revenue)",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Pillar 2 - Logs: Discrete event records",
        command:
          "Logs: Timestamped event messages\n- 2025-12-11 10:32:15 ERROR: Database connection failed: timeout\n- 2025-12-11 10:32:16 INFO: Retrying connection (attempt 2/3)\n- 2025-12-11 10:32:17 ERROR: User checkout failed - order_id: 12345\n\nGood for: Debugging specific events, context-rich investigation",
        explanation:
          'Logs tell the story of what happened. Rich context (user IDs, error messages, stack traces). Higher storage cost than metrics. Example: Log shows "DatabaseConnectionException: Connection pool exhausted" - that\'s your root cause.',
        expectedOutput:
          "Understanding: Logs provide detailed context about discrete events in your system.",
        validationCriteria: [
          "Logs are discrete events with timestamps",
          "Rich context (error messages, IDs, values)",
          "Higher storage cost than metrics",
          "Essential for debugging specific failures",
          "Can be searched and filtered",
        ],
        commonMistakes: [
          "Logging too little (no context for debugging)",
          "Logging too much (noise, high cost)",
          "Not structured (can't parse or search effectively)",
          "Logging sensitive data (passwords, PII)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Pillar 3 - Traces: Request journey across services",
        command:
          "Distributed Trace: Single request through microservices\nRequest ID: abc-123\n1. API Gateway: 5ms\n2. Auth Service: 50ms\n3. Product Service: 200ms (SLOW!)\n4. Database Query: 180ms (bottleneck found!)\n5. Cache Service: 10ms\nTotal: 445ms\n\nGood for: Understanding request flow, finding bottlenecks",
        explanation:
          'Traces follow a single request through multiple services. Each service adds a "span" showing its processing time. Reveals where time is spent. Example: Trace shows Product Service took 200ms, and 180ms was database - optimize that query.',
        expectedOutput:
          "Understanding: Traces show request paths through distributed systems, revealing bottlenecks.",
        validationCriteria: [
          "Traces follow single request across services",
          "Composed of spans (service processing segments)",
          "Show timing and causality",
          "Identify bottlenecks in distributed systems",
          "Highest storage cost (detailed per request)",
        ],
        commonMistakes: [
          "Not propagating trace context across services",
          "Sampling too aggressively (miss rare issues)",
          "Tracing everything (excessive cost)",
          "Not correlating traces with logs and metrics",
        ],
      },
      {
        stepNumber: 5,
        instruction: "Metrics in depth: Types and uses",
        command:
          "Metric Types:\n1. Counter: Monotonically increasing (total requests: 1000, 1001, 1002)\n2. Gauge: Current value (active connections: 45, 50, 42)\n3. Histogram: Distribution (response times: p50=100ms, p95=250ms, p99=500ms)\n4. Summary: Similar to histogram, client-side calculation\n\nUse cases: Dashboards, alerts, capacity planning",
        explanation:
          "Counters track totals (requests served). Gauges track current state (memory usage). Histograms track distributions (most requests fast, few slow). Different types answer different questions. Prometheus uses these types.",
        expectedOutput:
          "Understanding: Different metric types serve different monitoring purposes.",
        validationCriteria: [
          "Counters for cumulative values (total errors)",
          "Gauges for current state (queue depth)",
          "Histograms for distributions (latency percentiles)",
          "Choose type based on what you're measuring",
          "Metrics feed dashboards and alerts",
        ],
        commonMistakes: [
          "Using counter for gauge data (wrong math)",
          "Not tracking percentiles (averages hide problems)",
          "Too many metrics (overwhelming, high cost)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Structured Logging: Making logs machine-readable",
        command:
          'Unstructured (bad):\nERROR: User 12345 checkout failed with error payment declined at 2025-12-11\n\nStructured (good - JSON):\n{\n  "timestamp": "2025-12-11T10:32:15Z",\n  "level": "ERROR",\n  "message": "checkout_failed",\n  "user_id": "12345",\n  "order_id": "67890",\n  "error": "payment_declined",\n  "service": "checkout"\n}\n\nStructured logs = queryable, filterable, aggregatable',
        explanation:
          'Structured logging writes logs as JSON (or similar). Every field is parseable. Can query "all payment_declined errors" or "all errors for user 12345". Log aggregation tools (ELK, Splunk) parse structured logs automatically.',
        expectedOutput:
          "Understanding: Structured logging enables powerful querying and analysis of log data.",
        validationCriteria: [
          "Logs in consistent format (JSON, key-value)",
          "Searchable by any field",
          "Aggregatable (count errors by type)",
          "Correlatable with traces (trace_id in logs)",
          "Machine-readable, not just human-readable",
        ],
        commonMistakes: [
          "Inconsistent log formats across services",
          "Missing critical fields (timestamp, service name)",
          "Not including correlation IDs (can't link logs to traces)",
          "Dynamic keys (breaks parsing)",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Distributed Tracing architecture: How it works",
        command:
          'Trace propagation:\n1. Request enters API Gateway\n   - Generate trace_id: "abc-123"\n   - Create span_id: "span-1"\n2. Gateway calls Auth Service\n   - Pass trace_id: "abc-123" in header\n   - New span_id: "span-2", parent: "span-1"\n3. Auth calls Database\n   - Same trace_id: "abc-123"\n   - New span_id: "span-3", parent: "span-2"\n\nAll spans with same trace_id form complete trace',
        explanation:
          "Every service receives trace_id in HTTP headers (or gRPC metadata). Service creates new span for its work, linking to parent span. Traces sent to collector (Jaeger, Zipkin). Collector assembles complete trace from all spans.",
        expectedOutput:
          "Understanding: Distributed tracing requires context propagation across all services.",
        validationCriteria: [
          "Trace ID propagated in headers",
          "Each service creates child span",
          "Spans sent to trace collector",
          "Collector assembles full trace",
          "Works across different technologies (HTTP, gRPC, messaging)",
        ],
        commonMistakes: [
          "Forgetting to propagate headers",
          "Not instrumenting all services (incomplete traces)",
          "Clock skew between servers (incorrect timing)",
          "No sampling strategy (too much data)",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Correlation: Linking metrics, logs, and traces",
        command:
          'Unified observability:\n1. Alert fires: "API latency p95 > 500ms" (METRIC)\n2. Dashboard shows spike at 10:32 AM\n3. Query logs for timestamp 10:32:00 - 10:33:00 (LOGS)\n4. Logs show trace_id: "abc-123" with errors\n5. Pull up trace "abc-123" (TRACE)\n6. Trace shows Database service took 480ms\n7. Database logs show slow query on products table\n\nRoot cause found: Unoptimized query',
        explanation:
          "The three pillars work together. Metrics alert you. Logs provide context. Traces show the path. Correlation IDs (trace_id, request_id) link them all. This unified view enables rapid debugging.",
        expectedOutput:
          "Understanding: Correlating metrics, logs, and traces enables efficient root cause analysis.",
        validationCriteria: [
          "Metrics trigger investigation",
          "Logs provide error details",
          "Traces show bottleneck location",
          "Correlation IDs link all three",
          "Can navigate from alert to root cause",
        ],
        commonMistakes: [
          "Siloed tools (metrics separate from logs)",
          "No correlation IDs (can't link data)",
          "Not using timestamps consistently",
          "Missing context to jump between pillars",
        ],
      },
      {
        stepNumber: 9,
        instruction:
          "Service Level Objectives (SLOs): Defining reliability targets",
        command:
          "SLO Example:\nService: API Gateway\nSLI (Service Level Indicator): Request success rate\nSLO (Service Level Objective): 99.9% success rate over 30 days\nError Budget: 0.1% = ~43 minutes downtime per month\n\nMonitoring:\n- Current success rate: 99.95% ✅\n- Error budget remaining: 75%\n- Can afford some risk-taking (deploy new features)",
        explanation:
          "SLO = target reliability level. SLI = metric you measure. Error budget = allowed failures. If success rate is 99.95% when target is 99.9%, you have spare budget for deployments. If you hit 99.9%, freeze deployments and fix reliability.",
        expectedOutput:
          "Understanding: SLOs quantify acceptable reliability and guide operational decisions.",
        validationCriteria: [
          "SLI is measurable (latency, availability, error rate)",
          "SLO is realistic target (99.9%, not 100%)",
          "Error budget calculated (1 - SLO)",
          "Track budget consumption over time",
          "Budget guides risk decisions",
        ],
        commonMistakes: [
          "Setting SLO too high (100% impossible)",
          "Setting SLO too low (users unhappy)",
          "Not tracking error budget (can't make informed decisions)",
          "Ignoring SLO violations (defeats purpose)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Alerting best practices: Actionable, not noisy",
        command:
          'Good alert:\nName: "API Latency High"\nCondition: p95 latency > 500ms for 5 minutes\nSeverity: Critical\nRunbook: "Check database connection pool, review recent deployments"\nOn-call: Page engineer\n\nBad alert:\nName: "Server CPU High"\nCondition: CPU > 50% for 1 minute\nSeverity: Warning\nRunbook: None\nOn-call: Send email\n\nResult: Alert fatigue, ignored pages',
        explanation:
          "Alerts should be actionable (clear problem, clear fix), not informational. Alert on symptoms users see (latency, errors), not internal metrics (CPU). Include runbooks. Page only for urgent issues. Otherwise, alert fatigue causes real alerts to be ignored.",
        expectedOutput:
          "Understanding: Effective alerts are actionable, user-focused, and documented with remediation steps.",
        validationCriteria: [
          "Alert on user-facing issues (latency, errors)",
          "Not on internal metrics unless critical",
          "Include runbook/documentation",
          "Appropriate severity (page vs email)",
          "Avoid alert fatigue (too many false positives)",
        ],
        commonMistakes: [
          "Alerting on everything (alert fatigue)",
          "No runbooks (engineers don't know what to do)",
          "Alerts on symptoms, not root causes",
          "Same severity for all alerts (can't prioritize)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Observability for Kubernetes: Special considerations",
        command:
          "Kubernetes observability challenges:\n1. Dynamic pods: IPs change, pods restart\n2. Multi-layer: Pod, container, node, cluster\n3. Networking: Service mesh adds complexity\n\nSolutions:\n- Metrics: Prometheus with service discovery\n- Logs: Aggregate from all pods (Fluentd, Fluent Bit)\n- Traces: Inject sidecars or use service mesh\n- Use labels to correlate (app=frontend, version=v1.2)",
        explanation:
          "Kubernetes pods are ephemeral - IP changes when pod restarts. Need service discovery to find metrics endpoints. Must aggregate logs from all pod replicas. Labels enable correlation (all pods with app=frontend). Tools integrate with Kubernetes API.",
        expectedOutput:
          "Understanding: Kubernetes observability requires tools that handle dynamic, ephemeral infrastructure.",
        validationCriteria: [
          "Service discovery for dynamic pods",
          "Aggregate logs across pod replicas",
          "Label-based correlation",
          "Track pod lifecycle events",
          "Multi-layer visibility (pod, node, cluster)",
        ],
        commonMistakes: [
          "Static configuration (breaks when pods restart)",
          "Not aggregating logs (incomplete picture)",
          "Missing pod labels (can't correlate)",
          "Not monitoring cluster resources (nodes, storage)",
        ],
      },
      {
        stepNumber: 12,
        instruction:
          "Observability-Driven Development: Building observable systems",
        command:
          'Observable system design:\n1. Instrument from day 1\n   - Add metrics to every service\n   - Structured logging everywhere\n   - Trace context propagation\n2. Design for debugging\n   - Include correlation IDs\n   - Log state transitions\n   - Expose health/ready endpoints\n3. Think like an operator\n   - "How will I debug this at 2 AM?"\n   - "What data do I need for root cause analysis?"\n\nObservability is a feature, not an afterthought',
        explanation:
          "Building observability in from the start is cheaper than adding it later. Every service should expose metrics (/metrics), health checks (/health), and emit structured logs. Developers should test observability (can I debug this with the data available?).",
        expectedOutput:
          "Understanding: Observability should be designed into systems, not bolted on after production issues.",
        validationCriteria: [
          "Instrumentation is part of development",
          "Every service has metrics, logs, traces",
          "Health checks and readiness probes",
          "Correlation IDs in all logs and traces",
          "Test observability before production",
        ],
        commonMistakes: [
          "Adding observability only after problems",
          "Inconsistent instrumentation across services",
          "No correlation between components",
          "Not testing observability in development",
        ],
      },
    ],
    expectedOutcome:
      "You understand the three pillars of observability (metrics, logs, traces), how they complement each other, correlation strategies, SLOs, alerting best practices, Kubernetes observability challenges, and building observable systems from the start.",
  },

  walk: {
    introduction:
      "Apply observability concepts through scenario-based exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "Design observability strategy for a microservices e-commerce platform (5 services).",
        template:
          "Services: Frontend, Auth, Product, Cart, Payment\n\nMetrics to track:\n- __RESPONSE_TIME__ (p50, p95, p99 latency)\n- __ERROR_RATE__ (4xx, 5xx errors per second)\n- __THROUGHPUT__ (requests per second)\n- __AVAILABILITY__ (uptime percentage)\n\nLogs to capture:\n- __ERRORS__ (structured JSON with user_id, trace_id)\n- __BUSINESS_EVENTS__ (checkout completed, payment processed)\n- __SECURITY__ (failed auth, suspicious activity)\n\nTraces:\n- Propagate __TRACE_ID__ across all services\n- Track request flow: Frontend → Auth → Product → Cart → Payment\n\nAlerts:\n- Critical: __ERROR_RATE__ > 5% for 3 minutes\n- Warning: __RESPONSE_TIME__ p95 > 500ms for 5 minutes",
        blanks: [
          {
            id: "RESPONSE_TIME",
            label: "RESPONSE_TIME",
            hint: "How long requests take",
            correctValue: "Response time",
            validationPattern: "response.*time|latency",
          },
          {
            id: "ERROR_RATE",
            label: "ERROR_RATE",
            hint: "Percentage of failed requests",
            correctValue: "Error rate",
            validationPattern: "error.*rate|failure.*rate",
          },
          {
            id: "THROUGHPUT",
            label: "THROUGHPUT",
            hint: "Request volume",
            correctValue: "Throughput",
            validationPattern: "throughput|request.*rate|rps",
          },
          {
            id: "AVAILABILITY",
            label: "AVAILABILITY",
            hint: "Service uptime",
            correctValue: "Availability",
            validationPattern: "availability|uptime",
          },
          {
            id: "ERRORS",
            label: "ERRORS",
            hint: "Exception and error messages",
            correctValue: "Errors and exceptions",
            validationPattern: "error|exception",
          },
          {
            id: "BUSINESS_EVENTS",
            label: "BUSINESS_EVENTS",
            hint: "Important user actions",
            correctValue: "Business events",
            validationPattern: "business.*event|user.*action",
          },
          {
            id: "SECURITY",
            label: "SECURITY",
            hint: "Auth failures, anomalies",
            correctValue: "Security events",
            validationPattern: "security|auth|suspicious",
          },
          {
            id: "TRACE_ID",
            label: "TRACE_ID",
            hint: "Unique identifier for request journey",
            correctValue: "Trace ID",
            validationPattern: "trace.*id|request.*id|correlation.*id",
          },
        ],
        solution:
          "Services: Frontend, Auth, Product, Cart, Payment\n\nMetrics to track:\n- Response time (p50, p95, p99 latency)\n- Error rate (4xx, 5xx errors per second)\n- Throughput (requests per second)\n- Availability (uptime percentage)\n\nLogs to capture:\n- Errors and exceptions (structured JSON with user_id, trace_id)\n- Business events (checkout completed, payment processed)\n- Security events (failed auth, suspicious activity)\n\nTraces:\n- Propagate Trace ID across all services\n- Track request flow: Frontend → Auth → Product → Cart → Payment\n\nAlerts:\n- Critical: Error rate > 5% for 3 minutes\n- Warning: Response time p95 > 500ms for 5 minutes",
        explanation:
          "Comprehensive observability strategy covering metrics, logs, and traces with actionable alerting",
      },
      {
        exerciseNumber: 2,
        scenario: "Investigate production incident using observability data.",
        template:
          'Incident: Users reporting "checkout is slow"\n\nStep 1: Check metrics dashboard\n- API latency p95: __500MS__ (normal: 100ms) ❌\n- Error rate: __2%__ (normal: 0.1%) ❌\n- Throughput: Normal ✅\n\nStep 2: Query logs for errors (10:30-10:35)\n- Found: "__DATABASE_CONNECTION_TIMEOUT__" in Payment service\n- trace_id: "xyz-789"\n\nStep 3: Pull up trace "xyz-789"\n- Frontend: 10ms ✅\n- Auth: 20ms ✅\n- Cart: 15ms ✅\n- __PAYMENT__: 450ms ❌ (bottleneck found!)\n  - Database query: 400ms (slow!)\n\nStep 4: Check Payment service logs\n- Log: "Connection pool exhausted: 50/50 connections in use"\n\nRoot cause: __CONNECTION_POOL__ too small for traffic spike\nFix: Increase connection pool from 50 to 100',
        blanks: [
          {
            id: "500MS",
            label: "500MS",
            hint: "Elevated latency value",
            correctValue: "500ms",
            validationPattern: "500|five.*hundred",
          },
          {
            id: "2%",
            label: "2%",
            hint: "Elevated error rate",
            correctValue: "2%",
            validationPattern: "2|two",
          },
          {
            id: "DATABASE_CONNECTION_TIMEOUT",
            label: "DATABASE_CONNECTION_TIMEOUT",
            hint: "Error message in logs",
            correctValue: "Database connection timeout",
            validationPattern: "database.*timeout|connection.*timeout",
          },
          {
            id: "PAYMENT",
            label: "PAYMENT",
            hint: "Which service is slow?",
            correctValue: "Payment",
            validationPattern: "payment",
          },
          {
            id: "CONNECTION_POOL",
            label: "CONNECTION_POOL",
            hint: "Resource exhaustion issue",
            correctValue: "Connection pool",
            validationPattern: "connection.*pool|pool",
          },
        ],
        solution:
          'Incident: Users reporting "checkout is slow"\n\nStep 1: Check metrics dashboard\n- API latency p95: 500ms (normal: 100ms) ❌\n- Error rate: 2% (normal: 0.1%) ❌\n- Throughput: Normal ✅\n\nStep 2: Query logs for errors (10:30-10:35)\n- Found: "Database connection timeout" in Payment service\n- trace_id: "xyz-789"\n\nStep 3: Pull up trace "xyz-789"\n- Frontend: 10ms ✅\n- Auth: 20ms ✅\n- Cart: 15ms ✅\n- Payment: 450ms ❌ (bottleneck found!)\n  - Database query: 400ms (slow!)\n\nStep 4: Check Payment service logs\n- Log: "Connection pool exhausted: 50/50 connections in use"\n\nRoot cause: Connection pool too small for traffic spike\nFix: Increase connection pool from 50 to 100',
        explanation:
          "Efficient incident investigation workflow using correlated observability data",
      },
      {
        exerciseNumber: 3,
        scenario: "Define SLOs for a customer-facing API.",
        template:
          "API: Product Search Service\n\nSLI 1: Availability\n- Measurement: Successful responses / Total requests\n- SLO: __99_9__% over 30 days\n- Error budget: 0.1% = __43_MINUTES__ downtime/month\n\nSLI 2: Latency\n- Measurement: __P95__ response time\n- SLO: < __200MS__ for 95% of requests\n- Measurement window: __30_DAYS__\n\nSLI 3: Data Freshness\n- Measurement: Time since product catalog updated\n- SLO: < __5_MINUTES__ staleness\n\nMonitoring:\n- Track actual vs SLO in __DASHBOARD__\n- Alert when error budget < 10% remaining\n- Monthly __REVIEW__ of SLO compliance",
        blanks: [
          {
            id: "99_9",
            label: "99_9",
            hint: "Three nines reliability",
            correctValue: "99.9",
            validationPattern: "99\\.9|three.*nine",
          },
          {
            id: "43_MINUTES",
            label: "43_MINUTES",
            hint: "Allowed downtime per month",
            correctValue: "43 minutes",
            validationPattern: "43|forty.*three",
          },
          {
            id: "P95",
            label: "P95",
            hint: "95th percentile",
            correctValue: "p95",
            validationPattern: "p95|95th|percentile",
          },
          {
            id: "200MS",
            label: "200MS",
            hint: "Target latency",
            correctValue: "200ms",
            validationPattern: "200|two.*hundred",
          },
          {
            id: "30_DAYS",
            label: "30_DAYS",
            hint: "SLO evaluation period",
            correctValue: "30 days",
            validationPattern: "30|thirty|month",
          },
          {
            id: "5_MINUTES",
            label: "5_MINUTES",
            hint: "Maximum data staleness",
            correctValue: "5 minutes",
            validationPattern: "5|five",
          },
          {
            id: "DASHBOARD",
            label: "DASHBOARD",
            hint: "Visualization tool",
            correctValue: "Dashboard",
            validationPattern: "dashboard|grafana",
          },
          {
            id: "REVIEW",
            label: "REVIEW",
            hint: "Regular assessment",
            correctValue: "Review",
            validationPattern: "review|retrospective",
          },
        ],
        solution:
          "API: Product Search Service\n\nSLI 1: Availability\n- Measurement: Successful responses / Total requests\n- SLO: 99.9% over 30 days\n- Error budget: 0.1% = 43 minutes downtime/month\n\nSLI 2: Latency\n- Measurement: p95 response time\n- SLO: < 200ms for 95% of requests\n- Measurement window: 30 days\n\nSLI 3: Data Freshness\n- Measurement: Time since product catalog updated\n- SLO: < 5 minutes staleness\n\nMonitoring:\n- Track actual vs SLO in Dashboard\n- Alert when error budget < 10% remaining\n- Monthly Review of SLO compliance",
        explanation:
          "Comprehensive SLO framework with measurable objectives and error budgets",
      },
      {
        exerciseNumber: 4,
        scenario: "Design structured logging schema for microservices.",
        template:
          'Standard log format (JSON):\n{\n  "__TIMESTAMP__": "2025-12-11T10:32:15.123Z",\n  "level": "__ERROR__",\n  "service": "payment-service",\n  "trace_id": "__ABC123__",\n  "span_id": "span-456",\n  "user_id": "user-789",\n  "message": "payment_processing_failed",\n  "error": {\n    "type": "__PaymentDeclinedException__",\n    "message": "Insufficient funds",\n    "code": "INSUFFICIENT_FUNDS"\n  },\n  "context": {\n    "order_id": "order-12345",\n    "amount": 99.99,\n    "currency": "USD"\n  }\n}\n\nBenefits:\n- Searchable by __TRACE_ID__ (link to distributed trace)\n- Filterable by __SERVICE__ (isolate one microservice)\n- Aggregatable by __ERROR_TYPE__ (count payment failures)\n- Correlatable with user and order',
        blanks: [
          {
            id: "TIMESTAMP",
            label: "TIMESTAMP",
            hint: "ISO 8601 format",
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
            hint: "Correlation identifier",
            correctValue: "abc-123",
            validationPattern: "abc|trace|correlation",
          },
          {
            id: "PaymentDeclinedException",
            label: "PaymentDeclinedException",
            hint: "Exception class name",
            correctValue: "PaymentDeclinedException",
            validationPattern: "payment.*declined|exception",
          },
          {
            id: "TRACE_ID",
            label: "TRACE_ID",
            hint: "Links logs to traces",
            correctValue: "trace_id",
            validationPattern: "trace.*id",
          },
          {
            id: "SERVICE",
            label: "SERVICE",
            hint: "Service name field",
            correctValue: "service",
            validationPattern: "service",
          },
          {
            id: "ERROR_TYPE",
            label: "ERROR_TYPE",
            hint: "Exception or error category",
            correctValue: "error.type",
            validationPattern: "error.*type|exception.*type",
          },
        ],
        solution:
          'Standard log format (JSON):\n{\n  "timestamp": "2025-12-11T10:32:15.123Z",\n  "level": "ERROR",\n  "service": "payment-service",\n  "trace_id": "abc-123",\n  "span_id": "span-456",\n  "user_id": "user-789",\n  "message": "payment_processing_failed",\n  "error": {\n    "type": "PaymentDeclinedException",\n    "message": "Insufficient funds",\n    "code": "INSUFFICIENT_FUNDS"\n  },\n  "context": {\n    "order_id": "order-12345",\n    "amount": 99.99,\n    "currency": "USD"\n  }\n}\n\nBenefits:\n- Searchable by trace_id (link to distributed trace)\n- Filterable by service (isolate one microservice)\n- Aggregatable by error.type (count payment failures)\n- Correlatable with user and order',
        explanation:
          "Structured logging schema enabling powerful querying and correlation",
      },
      {
        exerciseNumber: 5,
        scenario: "Configure alerting strategy to avoid alert fatigue.",
        template:
          "Alert tiers:\n\n__CRITICAL__ (page on-call immediately):\n- Availability < __99%__ for 5 minutes\n- Error rate > __10%__ for 3 minutes\n- All instances down\n- SLO error budget < 5% remaining\nRunbook: Yes | Auto-remediation: Attempted\n\n__WARNING__ (send to Slack channel):\n- Latency p95 > __500MS__ for 10 minutes\n- Error rate > 2% for 5 minutes\n- Single instance down\n- SLO error budget < 25% remaining\nRunbook: Yes | Auto-remediation: No\n\n__INFO__ (log to dashboard only):\n- CPU > 70%\n- Memory > 80%\n- Deployment events\nRunbook: No | Auto-remediation: No\n\nPrinciples:\n- Alert on __USER_IMPACT__ not internal metrics\n- Include __RUNBOOK__ links\n- Test alerts in __STAGING__\n- Review and tune __MONTHLY__",
        blanks: [
          {
            id: "CRITICAL",
            label: "CRITICAL",
            hint: "Highest severity",
            correctValue: "CRITICAL",
            validationPattern: "critical|p1|sev1",
          },
          {
            id: "99%",
            label: "99%",
            hint: "Availability threshold",
            correctValue: "99%",
            validationPattern: "99",
          },
          {
            id: "10%",
            label: "10%",
            hint: "Error rate threshold",
            correctValue: "10%",
            validationPattern: "10|ten",
          },
          {
            id: "WARNING",
            label: "WARNING",
            hint: "Medium severity",
            correctValue: "WARNING",
            validationPattern: "warning|p2|sev2",
          },
          {
            id: "500MS",
            label: "500MS",
            hint: "Latency threshold",
            correctValue: "500ms",
            validationPattern: "500|five.*hundred",
          },
          {
            id: "INFO",
            label: "INFO",
            hint: "Lowest severity",
            correctValue: "INFO",
            validationPattern: "info|p3|sev3",
          },
          {
            id: "USER_IMPACT",
            label: "USER_IMPACT",
            hint: "Alert on symptoms users experience",
            correctValue: "User impact",
            validationPattern: "user.*impact|symptom|customer",
          },
          {
            id: "RUNBOOK",
            label: "RUNBOOK",
            hint: "Documentation for responders",
            correctValue: "Runbook",
            validationPattern: "runbook|playbook|documentation",
          },
          {
            id: "STAGING",
            label: "STAGING",
            hint: "Test environment",
            correctValue: "Staging",
            validationPattern: "staging|test|dev",
          },
          {
            id: "MONTHLY",
            label: "MONTHLY",
            hint: "Review frequency",
            correctValue: "Monthly",
            validationPattern: "monthly|regular",
          },
        ],
        solution:
          "Alert tiers:\n\nCRITICAL (page on-call immediately):\n- Availability < 99% for 5 minutes\n- Error rate > 10% for 3 minutes\n- All instances down\n- SLO error budget < 5% remaining\nRunbook: Yes | Auto-remediation: Attempted\n\nWARNING (send to Slack channel):\n- Latency p95 > 500ms for 10 minutes\n- Error rate > 2% for 5 minutes\n- Single instance down\n- SLO error budget < 25% remaining\nRunbook: Yes | Auto-remediation: No\n\nINFO (log to dashboard only):\n- CPU > 70%\n- Memory > 80%\n- Deployment events\nRunbook: No | Auto-remediation: No\n\nPrinciples:\n- Alert on User impact not internal metrics\n- Include Runbook links\n- Test alerts in Staging\n- Review and tune Monthly",
        explanation:
          "Multi-tier alerting strategy with runbooks to avoid alert fatigue",
      },
    ],
    hints: [
      "Start with service health metrics (RED: Rate, Errors, Duration)",
      "Use structured JSON logs with correlation IDs",
      "Implement distributed tracing with sampling (10-20%)",
      "Define realistic SLOs based on user experience",
      "Alert on symptoms users see, not internal metrics",
    ],
  },

  runGuided: {
    objective:
      "Design and implement complete observability platform with metrics, logs, traces, and correlation",
    conceptualGuidance: [
      "Choose observability stack: Prometheus (metrics), Loki/ELK (logs), Jaeger/Zipkin (traces)",
      "Design instrumentation strategy: what metrics, logs, and traces to collect",
      "Plan correlation strategy: use trace_id to link metrics, logs, and traces",
      "Define SLOs for key services: availability, latency, data freshness",
      "Configure tiered alerting: Critical (page), Warning (Slack), Info (dashboard)",
      "Implement retention policies: balance visibility with cost",
      "Create dashboards: service health, SLO tracking, incident investigation",
      "Document runbooks: how to investigate and resolve common issues",
      "Test observability: simulate incidents and validate investigation workflow",
      "Train team: onboarding guide for using observability tools",
    ],
    keyConceptsToApply: [
      "Three pillars of observability (metrics, logs, traces)",
      "Correlation via trace_id and timestamps",
      "SLO definition and error budget tracking",
      "Structured logging with JSON",
      "Alert fatigue prevention",
    ],
    checkpoints: [
      {
        checkpoint: "Observability architecture designed",
        description: "Complete architecture with all components documented",
        validationCriteria: [
          "Metrics: Prometheus with service discovery, retention policy",
          "Logs: Centralized aggregation with structured format",
          "Traces: Distributed tracing with sampling strategy",
          "Dashboards: Grafana with SLO tracking",
          "Alerts: Tiered alerting with runbooks",
          "Architecture diagram showing data flow",
        ],
        hintIfStuck:
          "Start with Prometheus for metrics, Loki for logs, Jaeger for traces. Use Kubernetes service discovery for dynamic pods. Define sampling rate (e.g., 10% of traces to control cost). Separate hot storage (7 days) from cold storage (90 days).",
      },
      {
        checkpoint: "Instrumentation implemented",
        description: "All services instrumented with metrics, logs, and traces",
        validationCriteria: [
          "All services expose Prometheus metrics on /metrics",
          "Structured JSON logging with required fields (timestamp, level, service, trace_id, message)",
          "Trace context propagated via HTTP headers (traceparent)",
          "Health and readiness endpoints implemented",
          "Business metrics tracked (signups, checkouts, revenue)",
          "Consistent labeling (service, environment, version)",
        ],
        hintIfStuck:
          "Use OpenTelemetry libraries for standardization. Include correlation IDs in all logs. Track both technical (latency) and business (conversion) metrics. Test instrumentation locally before deploying.",
      },
      {
        checkpoint: "Observability stack deployed and validated",
        description: "End-to-end observability working in production",
        validationCriteria: [
          "Prometheus scraping all services",
          "Grafana dashboards showing key metrics (RED: Rate, Errors, Duration)",
          "Log aggregation collecting from all pods",
          "Distributed traces visible in UI",
          "SLO dashboard tracking error budget",
          "Can trace single request from ingress to database",
          "Alerts configured and tested",
        ],
        hintIfStuck:
          "Use Prometheus Operator for Kubernetes integration. Create dashboard for each service (latency, errors, throughput). Test alerting by triggering threshold violations. Validate trace propagation across all services.",
      },
    ],
    resourcesAllowed: [
      "Prometheus documentation",
      "Grafana dashboard examples",
      "OpenTelemetry instrumentation guides",
      "SRE Workbook (SLO implementation)",
    ],
  },

  runIndependent: {
    objective:
      "Build production-grade observability platform enabling 10-minute mean time to resolution for a multi-service e-commerce application",
    successCriteria: [
      "Complete observability infrastructure: Prometheus, Loki/ELK, Jaeger/Zipkin deployed",
      "Comprehensive instrumentation: All services emit metrics, structured logs, and traces",
      "Correlation working: Can navigate from alert → logs → trace → root cause",
      "SLO tracking: Dashboards show availability, latency SLOs with error budgets",
      "Multi-tier alerting: Critical/Warning/Info with runbooks and integrations",
      "Cost optimization: Retention policies, sampling, aggregation configured",
      "Dashboards: Service health (RED), SLO tracking, incident investigation",
      "Documentation: Runbooks for common incidents, observability onboarding guide",
      "Validation: Can demonstrate complete incident investigation workflow",
      "Team enablement: Self-service tools and documentation for engineers",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "Metrics, logs, and traces all collecting from services",
      "At least one SLO defined and tracked",
      "Alerting configured with runbooks",
    ],
    evaluationRubric: [
      {
        criterion: "Observability Coverage",
        weight: 30,
        passingThreshold:
          "All three pillars implemented (metrics, logs, traces). Services fully instrumented with consistent standards. No observability blind spots. Can monitor all key user journeys.",
      },
      {
        criterion: "Incident Response Capability",
        weight: 25,
        passingThreshold:
          "Dashboards provide actionable insights. Can correlate metrics → logs → traces. Demonstrate complete investigation workflow from alert to root cause in under 10 minutes.",
      },
      {
        criterion: "Reliability Engineering",
        weight: 25,
        passingThreshold:
          "SLOs defined for key services. Error budget tracking working. Alerting tuned to avoid fatigue (no false positives). Runbooks guide responders effectively.",
      },
      {
        criterion: "Operational Excellence",
        weight: 20,
        passingThreshold:
          "Cost-optimized with retention and sampling. Documentation enables team self-service. High availability configured. Security best practices followed (RBAC, encryption).",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=MrwFQx4gf_A",
  documentation: [
    "https://prometheus.io/docs/introduction/overview/",
    "https://grafana.com/docs/grafana/latest/",
    "https://www.jaegertracing.io/docs/",
    "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html",
    "https://opentelemetry.io/docs/",
    "https://sre.google/workbook/implementing-slos/",
  ],
  relatedConcepts: [
    "Site Reliability Engineering (SRE)",
    "RED method (Rate, Errors, Duration)",
    "USE method (Utilization, Saturation, Errors)",
    "Error budgets and SLO-based alerting",
    "Distributed tracing and correlation",
    "Log aggregation and analysis",
  ],
};

/**
 * Week 4 Lesson 3 - Docker Compose
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week4Lesson3DockerCompose: LeveledLessonContent = {
  lessonId: 'week4-lesson3-docker-compose',
  
  baseLesson: {
    title: 'Docker Compose: Multi-Container Applications',
    description: 'Master Docker Compose for defining and running multi-container applications with a single configuration file.',
    learningObjectives: [
      'Write docker-compose.yml files for multi-tier applications',
      'Manage application lifecycle with docker-compose commands',
      'Configure networks and volumes in Compose',
      'Use environment variables and secrets in Compose'
    ],
    prerequisites: [
      'Docker basics (images, containers, networks, volumes)',
      'Understanding of multi-tier applications',
      'YAML syntax familiarity'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Learn Docker Compose step-by-step: YAML syntax, services, networks, volumes, and managing multi-container apps.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Problem: Managing multiple containers is complex',
        command: 'Without Compose:\ndocker network create myapp-network\ndocker run -d --name db --network myapp-network -e POSTGRES_PASSWORD=secret postgres\ndocker run -d --name redis --network myapp-network redis\ndocker run -d --name web --network myapp-network -p 8080:80 -e DATABASE_URL=postgres://db:5432 myapp\n\n4 commands, easy to make mistakes',
        explanation: 'Multi-container apps need networks, environment variables, volumes, dependencies. Running manually is error-prone. Hard to reproduce. Compose solves this with declarative config.',
        expectedOutput: 'Understanding: Manual container orchestration is tedious and error-prone.',
        validationCriteria: [
          'See complexity of multiple docker run commands',
          'Understand dependency management is manual',
          'Recognize configuration drift risk',
          'Want automated, reproducible deployment'
        ],
        commonMistakes: [
          'Thinking Compose is only for complex apps (useful even for 2 containers)',
          'Not seeing benefit until managing 5+ containers',
          'Believing manual is good enough (until it breaks)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Compose solution: docker-compose.yml declarative config',
        command: 'Create docker-compose.yml:\nversion: \'3.8\'\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n  redis:\n    image: redis:7\n  web:\n    image: myapp\n    ports:\n      - "8080:80"\n    environment:\n      DATABASE_URL: postgres://db:5432\n    depends_on:\n      - db\n      - redis',
        explanation: 'Compose file defines services (containers), networks, volumes. YAML format. Declare desired state. Run with one command: docker-compose up. Compose creates network automatically.',
        expectedOutput: 'Understanding: Compose simplifies multi-container management with declarative configuration.',
        validationCriteria: [
          'YAML defines all services',
          'Networks created automatically',
          'Environment variables centralized',
          'Dependencies declared (depends_on)',
          'Single command to launch everything'
        ],
        commonMistakes: [
          'Invalid YAML syntax (indentation matters)',
          'Wrong version number (use 3.8 or 3.9)',
          'Not using depends_on (containers start in wrong order)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Start application with docker-compose up',
        command: 'docker-compose up\n# Or in detached mode:\ndocker-compose up -d',
        explanation: 'docker-compose up reads docker-compose.yml, creates network, starts all services. -d runs in background. Compose ensures dependencies start first. Streams logs from all containers.',
        expectedOutput: 'All containers start, network created, application ready. Logs show startup sequence.',
        validationCriteria: [
          'All services start successfully',
          'Network created automatically',
          'Dependencies start before dependents',
          'Logs visible (or -d for detached)'
        ],
        commonMistakes: [
          'Not in directory with docker-compose.yml (file not found)',
          'Forgetting -d flag (terminal blocked with logs)',
          'Not waiting for dependencies to be ready (depends_on only waits for start, not health)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'View running services with docker-compose ps',
        command: 'docker-compose ps',
        explanation: 'Shows services defined in Compose file with status, ports. Like docker ps but filtered to this project. Lists service name, command, state, ports.',
        expectedOutput: 'Table showing service names, state (Up/Exited), ports, container names',
        validationCriteria: [
          'All services listed',
          'States shown (Up 2 minutes, Exited 1)',
          'Port mappings visible',
          'Container names follow project_service_1 pattern'
        ],
        commonMistakes: [
          'Confusing with docker ps (docker-compose ps is project-specific)',
          'Not seeing all services (some might have exited)',
          'Expecting different naming (Compose uses projectname_service_replica)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'View logs with docker-compose logs',
        command: 'docker-compose logs\n# Follow logs:\ndocker-compose logs -f\n# Specific service:\ndocker-compose logs web',
        explanation: 'docker-compose logs shows output from all services. -f follows (like tail -f). Specify service name for filtering. Color-coded by service. Useful for debugging.',
        expectedOutput: 'Logs from all services, color-coded, optionally following new output',
        validationCriteria: [
          'Logs from multiple services interleaved',
          'Service name prefix on each line',
          '-f flag streams new logs',
          'Can filter to specific service'
        ],
        commonMistakes: [
          'Not using -f when debugging (missing real-time output)',
          'Overwhelming logs from all services (filter to one service)',
          'Not checking logs when service fails (logs have error messages)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Stop application with docker-compose down',
        command: 'docker-compose down\n# Remove volumes too:\ndocker-compose down -v',
        explanation: 'docker-compose down stops and removes containers, network. Preserves volumes by default. -v removes volumes (deletes data). Clean shutdown.',
        expectedOutput: 'Containers stopped and removed, network removed, volumes preserved (unless -v)',
        validationCriteria: [
          'All containers stopped',
          'Containers removed (not just stopped)',
          'Network removed',
          'Volumes preserved unless -v flag'
        ],
        commonMistakes: [
          'Using docker-compose stop (stops but doesn\'t remove)',
          'Accidentally using -v (deletes database data)',
          'Not understanding down vs stop (down is more complete cleanup)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Define volumes for data persistence',
        command: 'version: \'3.8\'\nservices:\n  db:\n    image: postgres:15\n    volumes:\n      - postgres-data:/var/lib/postgresql/data\n    environment:\n      POSTGRES_PASSWORD: secret\n\nvolumes:\n  postgres-data:',
        explanation: 'Named volumes persist data across container restarts. Define in volumes section. Mount in service with service_name:/container/path. Data survives docker-compose down (unless -v).',
        expectedOutput: 'Volume created, database data persists across container recreations',
        validationCriteria: [
          'Named volume defined',
          'Volume mounted in service',
          'Data persists after down and up',
          'Volume listed in docker volume ls'
        ],
        commonMistakes: [
          'Using anonymous volumes (data hard to manage)',
          'Not defining volume in volumes section (Compose warns)',
          'Wrong mount path (data not persisted)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Configure custom networks',
        command: 'version: \'3.8\'\nservices:\n  web:\n    networks:\n      - frontend\n  api:\n    networks:\n      - frontend\n      - backend\n  db:\n    networks:\n      - backend\n\nnetworks:\n  frontend:\n  backend:',
        explanation: 'Custom networks segment services. Web only on frontend, API on both, DB only on backend. Security: web can\'t access DB directly. Define in networks section.',
        expectedOutput: 'Multiple networks created, services connected appropriately, isolation enforced',
        validationCriteria: [
          'Networks defined and created',
          'Services on correct networks',
          'web cannot ping db (different networks)',
          'api can communicate with both'
        ],
        commonMistakes: [
          'Not segmenting (all services on default network, no security)',
          'Forgetting to add service to network (communication fails)',
          'Typos in network names (YAML case-sensitive)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Use environment variables from .env file',
        command: 'Create .env file:\nPOSTGRES_PASSWORD=secret123\nDATABASE_URL=postgres://db:5432/myapp\n\ndocker-compose.yml:\nversion: \'3.8\'\nservices:\n  db:\n    environment:\n      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n  web:\n    environment:\n      DATABASE_URL: ${DATABASE_URL}',
        explanation: '.env file stores environment variables. Compose loads automatically. Use ${VAR_NAME} in Compose file. Keep secrets out of Compose file. Add .env to .gitignore.',
        expectedOutput: 'Variables loaded from .env, containers receive environment variables',
        validationCriteria: [
          '.env file in same directory as docker-compose.yml',
          'Variables referenced with ${} syntax',
          'Containers have correct environment variables',
          '.env in .gitignore (security)'
        ],
        commonMistakes: [
          'Committing .env to git (exposes secrets)',
          'Wrong .env syntax (no spaces around =)',
          'Not loading .env (docker-compose doesn\'t find variables)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Build images with docker-compose build',
        command: 'docker-compose.yml:\nservices:\n  web:\n    build:\n      context: ./web\n      dockerfile: Dockerfile\n    image: myapp-web:latest\n\nRun:\ndocker-compose build\n# Or build and start:\ndocker-compose up --build',
        explanation: 'Compose can build images from Dockerfile. build: section specifies context and Dockerfile. docker-compose build builds images. --build rebuilds before starting.',
        expectedOutput: 'Images built from Dockerfiles, tagged, ready to run',
        validationCriteria: [
          'build section defined',
          'Image built successfully',
          'Image tagged as specified',
          '--build flag rebuilds when needed'
        ],
        commonMistakes: [
          'Not using --build (old image used, changes not reflected)',
          'Wrong build context (COPY fails in Dockerfile)',
          'Forgetting to tag image (hard to identify)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Scale services with docker-compose up --scale',
        command: 'docker-compose up --scale web=3',
        explanation: 'Run multiple instances of a service. --scale web=3 starts 3 web containers. Load balancer needed to distribute traffic. Useful for testing horizontal scaling.',
        expectedOutput: '3 web containers running, named web_1, web_2, web_3',
        validationCriteria: [
          'Multiple replicas running',
          'Each has unique name',
          'All connected to network',
          'Can scale up or down'
        ],
        commonMistakes: [
          'Port conflicts (can\'t map same host port 3 times, remove ports or use range)',
          'Stateful services (scaling database without clustering breaks)',
          'Not using load balancer (traffic only goes to one instance)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Complete example: 3-tier web application',
        command: 'version: \'3.8\'\n\nservices:\n  nginx:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf\n    depends_on:\n      - api\n\n  api:\n    build: ./api\n    environment:\n      DATABASE_URL: postgres://db:5432/app\n      REDIS_URL: redis://cache:6379\n    depends_on:\n      - db\n      - cache\n\n  db:\n    image: postgres:15\n    volumes:\n      - db-data:/var/lib/postgresql/data\n    environment:\n      POSTGRES_DB: app\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n\n  cache:\n    image: redis:7\n\nvolumes:\n  db-data:',
        explanation: 'Complete app: Nginx (web server), API (application), PostgreSQL (database), Redis (cache). Dependencies ensure startup order. Volumes persist data. Environment variables configure connections.',
        expectedOutput: 'Full-stack application running: web server, API, database, cache all connected',
        validationCriteria: [
          'All 4 services defined',
          'Dependencies correct (api depends on db/cache, nginx depends on api)',
          'Volumes for database persistence',
          'Environment variables for configuration',
          'Single docker-compose up starts everything'
        ],
        commonMistakes: [
          'Missing depends_on (services start in wrong order)',
          'No volume for database (data lost on restart)',
          'Hardcoded secrets (use .env file)',
          'Not exposing nginx port (can\'t access application)'
        ]
      }
    ],
    expectedOutcome: 'You can write docker-compose.yml files for multi-tier applications, manage lifecycle (up, down, logs, ps), configure networks and volumes, use environment variables, build images, and scale services. You understand Compose as orchestration tool for development and simple production.'
  },

  walk: {
    introduction: 'Practice Docker Compose through scenario-based exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create docker-compose.yml for WordPress with MySQL.',
        template: 'version: \'3.8\'\n\nservices:\n  wordpress:\n    image: __WORDPRESS_IMAGE__\n    ports:\n      - "__PORT__:80"\n    environment:\n      WORDPRESS_DB_HOST: __DB_HOST__\n      WORDPRESS_DB_PASSWORD: __DB_PASSWORD__\n    __DEPENDS_ON__:\n      - db\n\n  db:\n    image: __MYSQL_IMAGE__\n    volumes:\n      - db-data:/var/lib/mysql\n    environment:\n      MYSQL_ROOT_PASSWORD: __DB_PASSWORD__\n      MYSQL_DATABASE: wordpress\n\n__VOLUMES__:\n  db-data:',
        blanks: [
          {
            id: 'WORDPRESS_IMAGE',
            label: 'WORDPRESS_IMAGE',
            hint: 'Official WordPress image',
            correctValue: 'wordpress:latest',
            validationPattern: '.*(wordpress).*'
          },
          {
            id: 'PORT',
            label: 'PORT',
            hint: 'Host port for WordPress',
            correctValue: '8080',
            validationPattern: '.*(8080|80|8000).*'
          },
          {
            id: 'DB_HOST',
            label: 'DB_HOST',
            hint: 'MySQL service name',
            correctValue: 'db',
            validationPattern: '^db$'
          },
          {
            id: 'DB_PASSWORD',
            label: 'DB_PASSWORD',
            hint: 'Database password variable',
            correctValue: 'secret',
            validationPattern: '.*(secret|password).*'
          },
          {
            id: 'DEPENDS_ON',
            label: 'DEPENDS_ON',
            hint: 'Dependency keyword',
            correctValue: 'depends_on',
            validationPattern: '.*(depends_on).*'
          },
          {
            id: 'MYSQL_IMAGE',
            label: 'MYSQL_IMAGE',
            hint: 'Official MySQL image',
            correctValue: 'mysql:8',
            validationPattern: '.*(mysql).*'
          },
          {
            id: 'VOLUMES',
            label: 'VOLUMES',
            hint: 'Top-level section',
            correctValue: 'volumes',
            validationPattern: '^volumes$'
          }
        ],
        solution: 'version: \'3.8\'\n\nservices:\n  wordpress:\n    image: wordpress:latest\n    ports:\n      - "8080:80"\n    environment:\n      WORDPRESS_DB_HOST: db\n      WORDPRESS_DB_PASSWORD: secret\n    depends_on:\n      - db\n\n  db:\n    image: mysql:8\n    volumes:\n      - db-data:/var/lib/mysql\n    environment:\n      MYSQL_ROOT_PASSWORD: secret\n      MYSQL_DATABASE: wordpress\n\nvolumes:\n  db-data:',
        explanation: 'WordPress depends on MySQL. Volume persists database data. Environment variables configure database connection.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Add custom networks for security segmentation.',
        template: 'services:\n  web:\n    networks:\n      - __FRONTEND__\n  api:\n    networks:\n      - frontend\n      - __BACKEND__\n  db:\n    networks:\n      - backend\n\n__NETWORKS__:\n  __FRONTEND__:\n  __BACKEND__:',
        blanks: [
          {
            id: 'FRONTEND',
            label: 'FRONTEND',
            hint: 'Public-facing network',
            correctValue: 'frontend',
            validationPattern: '^frontend$'
          },
          {
            id: 'BACKEND',
            label: 'BACKEND',
            hint: 'Internal network',
            correctValue: 'backend',
            validationPattern: '^backend$'
          },
          {
            id: 'NETWORKS',
            label: 'NETWORKS',
            hint: 'Top-level section',
            correctValue: 'networks',
            validationPattern: '^networks$'
          }
        ],
        solution: 'services:\n  web:\n    networks:\n      - frontend\n  api:\n    networks:\n      - frontend\n      - backend\n  db:\n    networks:\n      - backend\n\nnetworks:\n  frontend:\n  backend:',
        explanation: 'Network segmentation prevents web from directly accessing database. API bridges both networks.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Build custom image and run with Compose.',
        template: 'services:\n  app:\n    __BUILD__:\n      __CONTEXT__: ./app\n      __DOCKERFILE__: Dockerfile\n    image: myapp:__TAG__\n    ports:\n      - "3000:3000"\n\nRun:\ndocker-compose __UP__ __BUILD_FLAG__',
        blanks: [
          {
            id: 'BUILD',
            label: 'BUILD',
            hint: 'Build configuration keyword',
            correctValue: 'build',
            validationPattern: '^build$'
          },
          {
            id: 'CONTEXT',
            label: 'CONTEXT',
            hint: 'Build directory',
            correctValue: 'context',
            validationPattern: '^context$'
          },
          {
            id: 'DOCKERFILE',
            label: 'DOCKERFILE',
            hint: 'Dockerfile name',
            correctValue: 'dockerfile',
            validationPattern: '.*(dockerfile).*'
          },
          {
            id: 'TAG',
            label: 'TAG',
            hint: 'Image version',
            correctValue: 'latest',
            validationPattern: '.*(latest|1\\.0|v1).*'
          },
          {
            id: 'UP',
            label: 'UP',
            hint: 'Start command',
            correctValue: 'up',
            validationPattern: '^up$'
          },
          {
            id: 'BUILD_FLAG',
            label: 'BUILD_FLAG',
            hint: 'Rebuild before starting',
            correctValue: '--build',
            validationPattern: '.*(--build|-b).*'
          }
        ],
        solution: 'services:\n  app:\n    build:\n      context: ./app\n      dockerfile: Dockerfile\n    image: myapp:latest\n    ports:\n      - "3000:3000"\n\nRun:\ndocker-compose up --build',
        explanation: 'Compose builds image from Dockerfile before running. --build flag ensures rebuild with latest changes.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Use environment variables from .env file.',
        template: '.env file:\n__DB_PASSWORD__=secret123\nAPI_KEY=abc123\n\ndocker-compose.yml:\nservices:\n  app:\n    environment:\n      DB_PASSWORD: __VARIABLE_SYNTAX__\n      API_KEY: ${API_KEY}',
        blanks: [
          {
            id: 'DB_PASSWORD',
            label: 'DB_PASSWORD',
            hint: 'Variable name in .env',
            correctValue: 'DB_PASSWORD',
            validationPattern: '.*(DB_PASSWORD|PASSWORD).*'
          },
          {
            id: 'VARIABLE_SYNTAX',
            label: 'VARIABLE_SYNTAX',
            hint: 'Reference variable with ${}',
            correctValue: '${DB_PASSWORD}',
            validationPattern: '.*\\$\\{.*DB_PASSWORD.*\\}.*'
          }
        ],
        solution: '.env file:\nDB_PASSWORD=secret123\nAPI_KEY=abc123\n\ndocker-compose.yml:\nservices:\n  app:\n    environment:\n      DB_PASSWORD: ${DB_PASSWORD}\n      API_KEY: ${API_KEY}',
        explanation: '.env file stores secrets. Compose loads automatically. Use ${VAR} syntax to reference.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Complete lifecycle: up, logs, scale, down.',
        template: '# Start services:\ndocker-compose __UP__ -d\n\n# View logs:\ndocker-compose __LOGS__ -f web\n\n# Scale web service:\ndocker-compose up --__SCALE__ web=__3__\n\n# Stop and remove:\ndocker-compose __DOWN__',
        blanks: [
          {
            id: 'UP',
            label: 'UP',
            hint: 'Start command',
            correctValue: 'up',
            validationPattern: '^up$'
          },
          {
            id: 'LOGS',
            label: 'LOGS',
            hint: 'View output',
            correctValue: 'logs',
            validationPattern: '^logs$'
          },
          {
            id: 'SCALE',
            label: 'SCALE',
            hint: 'Scaling keyword',
            correctValue: 'scale',
            validationPattern: '^scale$'
          },
          {
            id: '3',
            label: '3',
            hint: 'Number of replicas',
            correctValue: '3',
            validationPattern: '^[0-9]+$'
          },
          {
            id: 'DOWN',
            label: 'DOWN',
            hint: 'Stop and remove',
            correctValue: 'down',
            validationPattern: '^down$'
          }
        ],
        solution: '# Start services:\ndocker-compose up -d\n\n# View logs:\ndocker-compose logs -f web\n\n# Scale web service:\ndocker-compose up --scale web=3\n\n# Stop and remove:\ndocker-compose down',
        explanation: 'Complete Compose lifecycle: start, monitor, scale, cleanup.'
      }
    ],
    hints: [
      'depends_on ensures startup order',
      'Named volumes persist data across restarts',
      'Custom networks provide isolation',
      'Use .env for secrets, add to .gitignore'
    ]
  },

  runGuided: {
    objective: 'Create Docker Compose configuration for a production-ready multi-tier application',
    conceptualGuidance: [
      'Design multi-tier architecture: web server, application, database, cache',
      'Use official base images (nginx, node, postgres, redis)',
      'Configure health checks for each service',
      'Set resource limits (memory, CPU)',
      'Implement restart policies (restart: always)',
      'Use secrets for sensitive data (not environment variables in Compose file)',
      'Configure logging (log driver, log options)',
      'Set up monitoring (expose metrics endpoints)',
      'Document service dependencies and startup order',
      'Create .env.example for configuration template'
    ],
    keyConceptsToApply: [
      'Multi-service orchestration',
      'Network segmentation',
      'Data persistence with volumes',
      'Configuration management',
      'Production readiness (health checks, restart policies, resource limits)'
    ],
    checkpoints: [
      {
        checkpoint: 'Multi-tier architecture defined',
        description: 'Complete docker-compose.yml with all tiers',
        validationCriteria: [
          'At least 3 services (web, app, database)',
          'Services properly networked',
          'Volumes for data persistence',
          'Environment variables externalized',
          'Dependencies declared with depends_on'
        ],
        hintIfStuck: 'Example: nginx (reverse proxy) → node app (API) → postgres (database) + redis (cache). Each in separate service. Use networks to control communication.'
      },
      {
        checkpoint: 'Production hardening implemented',
        description: 'Health checks, restart policies, resource limits configured',
        validationCriteria: [
          'Health checks defined for critical services',
          'Restart policies set (restart: unless-stopped)',
          'Resource limits (mem_limit, cpus)',
          'Logging configured',
          'Security: no hardcoded secrets'
        ],
        hintIfStuck: 'Add healthcheck with curl/wget to check if service responds. Set restart: unless-stopped. Use mem_limit: 512m, cpus: 0.5 to limit resources. Store secrets in .env file.'
      },
      {
        checkpoint: 'Documentation and testing complete',
        description: 'README, .env.example, testing instructions',
        validationCriteria: [
          'README explains architecture and services',
          '.env.example shows required variables',
          'Instructions for docker-compose up',
          'Tested: up, logs, ps, down work correctly',
          'Application accessible and functional'
        ],
        hintIfStuck: 'Create README.md: architecture overview, prerequisites, how to run (docker-compose up), how to access (http://localhost:8080), how to stop. Include .env.example with empty/example values.'
      }
    ],
    resourcesAllowed: [
      'Docker Compose documentation',
      'Official Docker images documentation',
      'docker-compose.yml examples from Docker Hub'
    ]
  },

  runIndependent: {
    objective: 'Build complete development environment with Docker Compose including application services, databases, monitoring, and tooling',
    successCriteria: [
      'Application stack: Web server, API, database, cache (4+ services)',
      'Development tools: Hot reload, debugging ports, volume mounts for code',
      'Monitoring: Metrics collection (Prometheus), visualization (Grafana)',
      'Logging: Centralized log aggregation (optional: ELK stack or simple log driver)',
      'Health checks: All critical services have health check endpoints',
      'Production-ready: Restart policies, resource limits, security hardening',
      'Network segmentation: Public-facing services separate from backend',
      'Data persistence: Named volumes for databases and stateful services',
      'Configuration: .env file for environment-specific settings, .env.example template',
      'Documentation: Comprehensive README with architecture diagram, setup instructions, troubleshooting'
    ],
    timeTarget: 25,
    minimumRequirements: [
      'Multi-tier application with at least 4 services',
      'Health checks and restart policies',
      'Complete documentation including setup and usage'
    ],
    evaluationRubric: [
      {
        criterion: 'Architecture Quality',
        weight: 30,
        passingThreshold: 'Well-designed multi-tier architecture. Proper service separation. Network segmentation for security. Volume strategy for persistence. Follows Docker and Compose best practices.'
      },
      {
        criterion: 'Production Readiness',
        weight: 30,
        passingThreshold: 'Health checks configured. Restart policies set. Resource limits prevent runaway containers. Secrets externalized. Logging configured. Monitoring in place. Ready for actual use.'
      },
      {
        criterion: 'Developer Experience',
        weight: 20,
        passingThreshold: 'Easy to start (docker-compose up). Hot reload for development. Clear logs. Good error messages. .env.example guides configuration. Single command to get running environment.'
      },
      {
        criterion: 'Documentation',
        weight: 20,
        passingThreshold: 'Architecture explained. Services documented. Setup instructions clear. Troubleshooting guide helpful. .env.example complete. Someone new can get environment running in under 10 minutes.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=Qw9zlE3t8Ko',
  documentation: [
    'https://docs.docker.com/compose/',
    'https://docs.docker.com/compose/compose-file/',
    'https://github.com/docker/awesome-compose',
    'https://docs.docker.com/compose/environment-variables/'
  ],
  relatedConcepts: [
    'Container orchestration (Kubernetes for production)',
    'Service mesh (Istio, Linkerd)',
    'Infrastructure as Code (Terraform with Docker provider)',
    'CI/CD integration with Compose',
    'Docker Swarm (simpler than Kubernetes)',
    'Compose in production (considerations and limitations)'
  ]
};

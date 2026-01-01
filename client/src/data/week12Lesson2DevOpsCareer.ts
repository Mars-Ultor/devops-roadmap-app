/**
 * Week 12 Lesson 2 - DevOps Career & Interview Preparation
 * 4-Level Mastery Progression: Resume building, interview skills, job search strategies
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week12Lesson2DevOpsCareer: LeveledLessonContent = {
  lessonId: 'week12-lesson2-devops-career',
  
  baseLesson: {
    title: 'DevOps Career & Interview Preparation',
    description: 'Master DevOps job search: resume optimization, technical interviews, behavioral questions, salary negotiation, and career advancement strategies.',
    learningObjectives: [
      'Build compelling DevOps resume with achievements',
      'Prepare for technical and behavioral interviews',
      'Navigate DevOps job market and applications',
      'Practice system design and troubleshooting',
      'Negotiate compensation and evaluate offers'
    ],
    prerequisites: [
      'Portfolio project completed',
      'Hands-on DevOps experience',
      'Understanding of DevOps tools and practices'
    ],
    estimatedTimePerLevel: {
      crawl: 35,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn DevOps career skills step-by-step. You will build resume, prepare for interviews, practice technical questions, and develop job search strategies.',
    expectedOutcome: 'Complete DevOps resume, interview preparation, technical question practice, behavioral story bank, salary negotiation skills, job search strategy',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand DevOps role landscape',
        command: 'cat > devops-roles.md <<EOF\n# DevOps Role Types\n\n## DevOps Engineer\n- CI/CD pipelines, automation, infrastructure\n- Tools: Jenkins, GitLab, GitHub Actions, Terraform\n- Salary: \\$90k-\\$140k\n\n## Site Reliability Engineer (SRE)\n- System reliability, SLOs, incident response\n- Tools: Prometheus, Grafana, PagerDuty, Kubernetes\n- Salary: \\$110k-\\$170k\n\n## Platform Engineer\n- Internal developer platforms, self-service\n- Tools: Kubernetes, ArgoCD, Backstage, Crossplane\n- Salary: \\$100k-\\$160k\n\n## Cloud Engineer\n- Cloud infrastructure, migration, optimization\n- Tools: AWS/GCP/Azure, Terraform, CloudFormation\n- Salary: \\$95k-\\$150k\n\n## Build & Release Engineer\n- Build systems, artifact management, deployments\n- Tools: Maven, Gradle, Artifactory, Nexus\n- Salary: \\$85k-\\$130k\n\nKey Skills Across Roles:\n- Linux/scripting (Bash, Python)\n- Containers (Docker, Kubernetes)\n- CI/CD (Jenkins, GitHub Actions)\n- IaC (Terraform, Ansible)\n- Cloud platforms (AWS, GCP, Azure)\n- Monitoring (Prometheus, Grafana)\nEOF',
        explanation: 'DevOps roles vary: DevOps Engineer (broad), SRE (reliability focus), Platform Engineer (developer experience), Cloud Engineer (cloud-specific). Understand fit.',
        expectedOutput: 'Role types documented',
        validationCriteria: [
          'Different DevOps roles listed',
          'Skills for each role',
          'Salary ranges noted'
        ],
        commonMistakes: ['Applying to all roles without targeting', 'Not researching company needs']
      },
      {
        stepNumber: 2,
        instruction: 'Build achievement-focused resume',
        command: 'cat > resume-devops.md <<EOF\n# John Doe\n**DevOps Engineer** | john@example.com | github.com/johndoe | linkedin.com/in/johndoe\n\n## Summary\nDevOps Engineer with 3 years automating infrastructure and CI/CD pipelines. Reduced deployment time 80% through GitOps. Proficient in Kubernetes, Terraform, AWS, and Python automation.\n\n## Skills\n**Cloud**: AWS (EC2, EKS, RDS, S3), GCP\n**Containers**: Docker, Kubernetes, Helm, Istio\n**IaC**: Terraform, Ansible, CloudFormation\n**CI/CD**: GitHub Actions, Jenkins, ArgoCD, GitLab CI\n**Monitoring**: Prometheus, Grafana, Loki, Jaeger\n**Languages**: Python, Bash, Go, YAML\n\n## Experience\n\n### DevOps Engineer | TechCorp | 2022-Present\n- **Reduced deployment time from 2 hours to 15 minutes** by implementing ArgoCD GitOps workflow\n- **Decreased infrastructure costs by 30%** through Kubernetes autoscaling and rightsizing\n- **Improved system reliability to 99.95%** by implementing comprehensive monitoring with Prometheus\n- Built Terraform modules enabling teams to self-serve infrastructure in <5 minutes\n- Automated security scanning (Trivy, OWASP ZAP) catching vulnerabilities pre-production\n\n### Junior DevOps Engineer | StartupCo | 2021-2022\n- **Automated 15+ manual deployment processes** reducing errors by 90%\n- Migrated monolith to microservices on Kubernetes, improving scalability\n- Created CI/CD pipelines with GitHub Actions for 20+ repositories\n- Implemented centralized logging with ELK stack for 50+ services\n\n## Projects\n\n### Cloud-Native E-Commerce Platform\n- Built production infrastructure: EKS, RDS, ElastiCache, S3\n- Implemented GitOps with ArgoCD, achieving 15+ deploys/day\n- Complete observability: Prometheus, Grafana, Loki, Jaeger\n- **GitHub**: github.com/johndoe/ecommerce-platform\n\n## Certifications\n- AWS Certified Solutions Architect - Associate\n- Certified Kubernetes Administrator (CKA)\n- HashiCorp Certified: Terraform Associate\nEOF',
        explanation: 'Resume highlights achievements with metrics: "Reduced deployment time 80%", "Decreased costs 30%". Shows impact, not just tasks. Skills section comprehensive.',
        expectedOutput: 'Resume created',
        validationCriteria: [
          'Achievements quantified with metrics',
          'Skills organized by category',
          'Projects with links',
          'Certifications listed'
        ],
        commonMistakes: ['Listing duties instead of achievements', 'No metrics/impact', 'Missing GitHub links']
      },
      {
        stepNumber: 3,
        instruction: 'Prepare technical interview questions',
        command: 'cat > technical-questions.md <<EOF\n# DevOps Technical Interview Questions\n\n## Kubernetes\nQ: Explain Pod, Deployment, Service, Ingress\nA: Pod = container group, Deployment = manages Pods with replicas/rolling updates, Service = load balances Pods, Ingress = HTTP routing to Services\n\nQ: How does Kubernetes handle rolling updates?\nA: Deployment creates new ReplicaSet, gradually scales up new Pods while scaling down old. maxUnavailable/maxSurge control rollout speed.\n\nQ: Troubleshoot: Pod in CrashLoopBackOff\nA: kubectl describe pod → check events. kubectl logs → check application errors. Check liveness/readiness probes, resource limits, image pull.\n\n## CI/CD\nQ: Design CI/CD pipeline for microservices\nA: 1) Code push → 2) Run tests + lint → 3) Security scan → 4) Build Docker image → 5) Push to registry → 6) Deploy to staging (ArgoCD) → 7) Integration tests → 8) Production deployment\n\nQ: How do you ensure zero-downtime deployments?\nA: Rolling updates, readiness probes (traffic only to ready Pods), PodDisruptionBudgets, blue-green or canary deployments.\n\n## Infrastructure as Code\nQ: Terraform state management best practices?\nA: Remote state (S3), state locking (DynamoDB), separate states per environment, terraform workspace for isolation, encrypted state.\n\nQ: How to handle secrets in Terraform?\nA: Never commit secrets. Use: AWS Secrets Manager, Vault, environment variables. Reference with data sources, not hardcode.\n\n## Monitoring\nQ: Design monitoring for microservices\nA: Metrics (Prometheus scraping /metrics), Logs (Loki aggregation), Traces (Jaeger for request flows), Dashboards (Grafana), Alerts (AlertManager)\n\nQ: What are SLIs, SLOs, SLAs?\nA: SLI = measurement (latency, availability), SLO = target (99.9% uptime), SLA = contract with consequences\n\n## Troubleshooting\nQ: Website is slow. How do you investigate?\nA: 1) Check metrics (CPU, memory, latency) 2) Review logs for errors 3) Check database queries 4) Network latency 5) Distributed tracing 6) Load test\n\nQ: Kubernetes cluster out of resources\nA: kubectl top nodes/pods → identify heavy users. Check resource requests/limits. Horizontal Pod Autoscaler. Add nodes. Investigate memory leaks.\nEOF',
        explanation: 'Technical questions cover: Kubernetes, CI/CD, IaC, monitoring, troubleshooting. Practice explaining clearly, demonstrate depth and practical experience.',
        expectedOutput: 'Question bank created',
        validationCriteria: [
          'Common topics covered',
          'Answers clear and concise',
          'Real-world scenarios included',
          'Troubleshooting methods shown'
        ],
        commonMistakes: ['Memorizing without understanding', 'Not asking clarifying questions']
      },
      {
        stepNumber: 4,
        instruction: 'Prepare behavioral questions (STAR method)',
        command: 'cat > behavioral-questions.md <<EOF\n# Behavioral Interview Questions (STAR Method)\n\n## STAR Framework\n**S**ituation: Context, background\n**T**ask: Your responsibility\n**A**ction: What you did (focus here)\n**R**esult: Outcome with metrics\n\n## Example Stories\n\n### Handling Production Incident\nS: Production API latency spiked to 5s, users complaining\nT: On-call engineer, needed to restore service quickly\nA: 1) Checked dashboards (database CPU 95%) 2) Identified slow query in logs 3) Added index 4) Latency dropped to 100ms 5) Wrote postmortem\nR: Restored service in 15min, prevented future issues with index, documented for team\n\n### Improving Deployment Process\nS: Deployments took 2 hours, error-prone manual steps\nT: Tasked with automation to reduce time and errors\nA: 1) Mapped current process 2) Built GitOps with ArgoCD 3) Automated tests in CI 4) Created runbooks 5) Trained team\nR: Deployment time reduced to 15min (88% faster), errors decreased 90%, 15+ deploys/day\n\n### Disagreement with Team\nS: Team wanted to use Jenkins, I preferred GitHub Actions\nT: Needed consensus on CI/CD tool\nA: 1) Listed requirements 2) Created comparison matrix 3) Built POCs for both 4) Presented findings 5) Team decided GitHub Actions\nR: Unified on tool, faster pipelines, learned to present data objectively\n\n### Learning New Technology\nS: Company migrated to Kubernetes, I had no experience\nT: Needed to become proficient quickly\nA: 1) Completed CKA course 2) Built home lab cluster 3) Migrated side project 4) Got CKA certified 5) Led team training\nR: Became team Kubernetes expert, led migration of 20+ services\n\n## Common Questions\n- Tell me about a time you failed\n- Describe a conflict with a teammate\n- How do you prioritize tasks?\n- Biggest technical challenge?\n- Time you had to learn quickly\n- How do you handle stress/on-call?\nEOF',
        explanation: 'STAR method structures behavioral answers: Situation, Task, Action, Result. Prepare stories showing problem-solving, collaboration, learning, resilience.',
        expectedOutput: 'Behavioral stories prepared',
        validationCriteria: [
          'STAR framework understood',
          '4-5 diverse stories prepared',
          'Results quantified',
          'Common questions covered'
        ],
        commonMistakes: ['Rambling without structure', 'No quantifiable results', 'Blaming others']
      },
      {
        stepNumber: 5,
        instruction: 'Practice system design question',
        command: 'cat > system-design.md <<EOF\n# System Design: CI/CD Platform\n\n## Question\nDesign a CI/CD platform for 100+ microservices with 200 developers.\n\n## Approach\n1. **Clarify Requirements**\n   - Scale: 100 services, 200 devs, 1000+ builds/day\n   - Features: Build, test, deploy, rollback\n   - SLAs: Build <10min, 99.9% uptime\n\n2. **Architecture**\n   ```\n   GitHub → Webhook → GitHub Actions (CI)\n                    → Build (tests, lint, security)\n                    → Push to ECR\n                    → Update Git manifest\n   Git Repo → ArgoCD (CD) → Kubernetes (EKS)\n                          → Sync applications\n   ```\n\n3. **Components**\n   - **Source Control**: GitHub with branch protection\n   - **CI**: GitHub Actions (parallel jobs, matrix builds)\n   - **Artifact Storage**: Amazon ECR (container images)\n   - **CD**: ArgoCD (GitOps, automated sync)\n   - **Secrets**: AWS Secrets Manager + Vault\n   - **Monitoring**: Prometheus tracking build/deploy metrics\n\n4. **Scalability**\n   - GitHub Actions: Auto-scales runners\n   - ECR: Unlimited storage, pull caching\n   - ArgoCD: Sharded for 100+ apps\n   - EKS: Node autoscaling\n\n5. **Reliability**\n   - Automated tests gate deployments\n   - Canary deployments with Flagger\n   - Automated rollback on failure\n   - Multi-region for DR\n\n6. **Security**\n   - OIDC for GitHub → AWS (no long-lived keys)\n   - Image signing with Cosign\n   - Vulnerability scanning with Trivy\n   - RBAC limiting deploy permissions\n\n7. **Monitoring**\n   - Build success rate, duration\n   - Deployment frequency, lead time\n   - MTTR, change failure rate\n   - Developer satisfaction (surveys)\n\n## Key Decisions\n- GitHub Actions (not Jenkins): Less maintenance, scales automatically\n- GitOps (not push-based CD): Audit trail, easy rollback, declarative\n- ArgoCD (not Flux): Better UI, mature ecosystem\nEOF',
        explanation: 'System design: clarify requirements, draw architecture, discuss components, address scale/reliability/security. Show tradeoffs, justify decisions.',
        expectedOutput: 'System design approach documented',
        validationCriteria: [
          'Requirements clarified',
          'Architecture drawn',
          'Scale/reliability addressed',
          'Decisions justified'
        ],
        commonMistakes: ['Jumping to solution without clarifying', 'Not discussing tradeoffs']
      },
      {
        stepNumber: 6,
        instruction: 'Build LinkedIn profile',
        command: 'cat > linkedin-profile.md <<EOF\n# LinkedIn Profile Optimization\n\n## Headline (120 chars)\nDevOps Engineer | Kubernetes, Terraform, AWS | GitOps & CI/CD Automation | Reducing Deploy Time 80%\n\n## About Section\nDevOps Engineer passionate about automating infrastructure and accelerating software delivery.\n\nI specialize in:\n- Cloud infrastructure (AWS, GCP) with Terraform IaC\n- Kubernetes orchestration and GitOps (ArgoCD)\n- CI/CD pipelines reducing deployment time from hours to minutes\n- Observability (Prometheus, Grafana) improving system reliability to 99.9%+\n\nRecent achievements:\n✅ Reduced deployment time by 80% through GitOps automation\n✅ Cut infrastructure costs 30% with Kubernetes autoscaling\n✅ Built platform enabling 15+ deployments per day\n\nCertified: AWS Solutions Architect, CKA, Terraform Associate\n\nAlways learning, currently exploring: Platform Engineering, eBPF, Istio service mesh\n\nOpen to DevOps and SRE opportunities. Let\'s connect!\n\n## Experience\n(Copy from resume with achievements)\n\n## Skills (Endorsements)\nTop Skills:\n- Kubernetes\n- Terraform\n- AWS\n- Docker\n- CI/CD\n- Python\n- Ansible\n- Jenkins\n- Prometheus\n- GitOps\n\n## Recommendations\nAsk managers, colleagues for recommendations highlighting:\n- Technical expertise\n- Problem-solving\n- Collaboration\n- Impact on team/company\nEOF',
        explanation: 'LinkedIn headline shows value: "Reducing Deploy Time 80%". About section highlights skills, achievements, certifications. Skills get endorsements. Recommendations build credibility.',
        expectedOutput: 'LinkedIn profile draft',
        validationCriteria: [
          'Headline compelling',
          'About section achievement-focused',
          'Skills comprehensive',
          'Experience matches resume'
        ],
        commonMistakes: ['Generic headline', 'About section reads like resume', 'Missing skills']
      },
      {
        stepNumber: 7,
        instruction: 'Create GitHub portfolio',
        command: 'cat > github-profile.md <<EOF\n# GitHub Portfolio Setup\n\n## Profile README (github.com/username/username/README.md)\n```markdown\n# Hi, I\'m John 👋\n\n## DevOps Engineer | Cloud Infrastructure & Automation\n\nI build reliable, scalable infrastructure and CI/CD pipelines.\n\n### 🔭 Currently Working On\n- Cloud-native e-commerce platform (Kubernetes, Terraform, ArgoCD)\n- Platform engineering with Backstage and Crossplane\n\n### 🛠️ Tech Stack\n![Kubernetes](https://img.shields.io/badge/-Kubernetes-326CE5?logo=kubernetes&logoColor=white)\n![Terraform](https://img.shields.io/badge/-Terraform-7B42BC?logo=terraform&logoColor=white)\n![AWS](https://img.shields.io/badge/-AWS-232F3E?logo=amazon-aws&logoColor=white)\n![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)\n\n### 📊 GitHub Stats\n![GitHub Stats](https://github-readme-stats.vercel.app/api?username=johndoe&show_icons=true)\n\n### 📫 Connect\n- LinkedIn: linkedin.com/in/johndoe\n- Blog: johndoe.dev\n```\n\n## Pinned Repositories (Choose 6)\n1. **devops-portfolio** - Production infrastructure (Terraform, K8s, ArgoCD)\n2. **kubernetes-homelab** - Self-hosted Kubernetes cluster\n3. **terraform-aws-modules** - Reusable AWS infrastructure modules\n4. **ci-cd-templates** - GitHub Actions workflows\n5. **monitoring-stack** - Prometheus/Grafana setup\n6. **python-automation** - DevOps automation scripts\n\n## Repository Best Practices\n- Professional README with architecture, setup, screenshots\n- Clear commit messages\n- Issues/PRs showing activity\n- Topics/tags for discoverability\n- MIT or Apache license\nEOF',
        explanation: 'GitHub profile README showcases skills, current projects, stats. Pin 6 best repositories demonstrating DevOps skills. Professional READMEs show communication skills.',
        expectedOutput: 'GitHub profile planned',
        validationCriteria: [
          'Profile README created',
          '6 repositories identified to pin',
          'READMEs professional',
          'Active contributions shown'
        ],
        commonMistakes: ['Empty profile', 'Poor READMEs', 'No pinned repos']
      },
      {
        stepNumber: 8,
        instruction: 'Research companies and roles',
        command: 'cat > job-search-strategy.md <<EOF\n# DevOps Job Search Strategy\n\n## Target Companies\n### Tech Companies (High DevOps Maturity)\n- Google, Amazon, Microsoft, Netflix, Uber\n- Mature DevOps practices, SRE culture\n- Competitive comp, learning opportunities\n\n### Scale-Ups (Growth Stage)\n- Companies 100-1000 employees\n- Building DevOps from scratch\n- High impact, equity potential\n\n### Consultancies\n- ThoughtWorks, Contino, Slalom\n- Variety of projects, rapid learning\n- Client-facing work\n\n## Where to Apply\n- **LinkedIn Jobs**: Set alerts for "DevOps Engineer"\n- **AngelList**: Startup DevOps roles\n- **HackerNews Who\'s Hiring**: Monthly thread\n- **Company Career Pages**: Direct applications\n- **Referrals**: Strongest signal, prioritize\n\n## Application Strategy\n1. **Resume Customization**: Match keywords from job description\n2. **Cover Letter**: Brief (3 paragraphs), highlight 1-2 achievements\n3. **Portfolio Link**: GitHub, live project demos\n4. **Follow Up**: After 1 week if no response\n\n## Networking\n- Attend DevOps/Cloud meetups\n- Contribute to open source\n- Write blog posts (Medium, Dev.to)\n- LinkedIn engagement (comment, share)\n- Informational interviews\n\n## Application Tracking\n| Company | Role | Applied | Status | Next Step |\n|---------|------|---------|--------|----------|\n| Acme | DevOps Eng | 1/1 | Phone Screen | Prep questions |\n| TechCo | SRE | 1/3 | Waiting | Follow up 1/10 |\nEOF',
        explanation: 'Job search strategy: target companies by maturity level, use multiple job boards, customize applications, network actively, track applications systematically.',
        expectedOutput: 'Job search plan created',
        validationCriteria: [
          'Company targets identified',
          'Job boards listed',
          'Application strategy defined',
          'Networking plan included'
        ],
        commonMistakes: ['Spray and pray applications', 'Not customizing resume', 'No networking']
      },
      {
        stepNumber: 9,
        instruction: 'Prepare for technical assessment',
        command: 'cat > technical-assessment.md <<EOF\n# DevOps Technical Assessments\n\n## Common Assessment Types\n\n### 1. Take-Home Project (2-4 hours)\n**Example**: Deploy 3-tier app (web, API, DB) to cloud\n**Deliverables**:\n- Infrastructure as Code (Terraform/CloudFormation)\n- CI/CD pipeline\n- Monitoring/logging\n- Documentation\n\n**Tips**:\n- Over-communicate: README explains choices\n- Production-ready: error handling, monitoring\n- Clean code: organized, commented\n- Bonus: tests, security scanning\n\n### 2. Live Coding (45-60 min)\n**Example**: Write Bash script to parse logs, find errors\n**Example**: Create Dockerfile for Node.js app\n**Example**: Write Terraform for VPC + subnets\n\n**Tips**:\n- Think aloud: explain your approach\n- Ask clarifying questions\n- Write comments as you code\n- Test as you go\n\n### 3. System Design (60 min)\n**Example**: Design HA web application infrastructure\n**Example**: Design CI/CD for microservices\n\n**Tips**:\n- Clarify requirements first\n- Draw diagram\n- Discuss tradeoffs\n- Address scalability, reliability, security\n\n### 4. Troubleshooting (30-45 min)\n**Scenario**: Kubernetes pod won\'t start\n**Approach**:\n1. kubectl describe pod → check events\n2. kubectl logs → application errors\n3. Check image pull, secrets, probes\n4. Verify resource limits\n5. Test locally if needed\n\n## Practice Resources\n- **KodeKloud**: Kubernetes, Terraform labs\n- **A Cloud Guru**: AWS, DevOps courses\n- **LeetCode**: Scripting problems\n- **GitHub**: Open source contributions\nEOF',
        explanation: 'Technical assessments: take-home projects, live coding, system design, troubleshooting. Practice common scenarios, communicate clearly, demonstrate production thinking.',
        expectedOutput: 'Assessment prep guide',
        validationCriteria: [
          'Assessment types listed',
          'Example problems included',
          'Tips for each type',
          'Practice resources noted'
        ],
        commonMistakes: ['Not explaining thought process', 'Ignoring edge cases', 'Poor documentation']
      },
      {
        stepNumber: 10,
        instruction: 'Understand compensation and negotiation',
        command: 'cat > compensation-negotiation.md <<EOF\n# DevOps Compensation & Negotiation\n\n## Salary Ranges (US, 2024)\n### By Experience\n- Junior DevOps (0-2 years): \\$70k-\\$100k\n- Mid-Level (2-5 years): \\$100k-\\$140k\n- Senior (5-8 years): \\$130k-\\$180k\n- Staff/Principal (8+ years): \\$170k-\\$250k+\n\n### By Location\n- San Francisco/NYC: +30-50%\n- Seattle/Austin/Boston: +20-30%\n- Remote: Market rate or location-based\n\n### By Company Type\n- FAANG: \\$150k-\\$300k+ (heavy equity)\n- Unicorn Startups: \\$120k-\\$200k (equity)\n- Mid-size Tech: \\$100k-\\$160k\n- Enterprise: \\$90k-\\$140k (stability)\n\n## Total Compensation Components\n1. **Base Salary**: Cash compensation\n2. **Bonus**: Annual performance bonus (10-20%)\n3. **Equity**: Stock options/RSUs (research vesting)\n4. **Benefits**: Health, 401k match, PTO\n5. **Perks**: Remote, learning budget, conferences\n\n## Negotiation Strategy\n\n### Research\n- Use levels.fyi, Glassdoor for data\n- Know your market value\n- Understand company stage/funding\n\n### Timing\n- Wait for offer before negotiating\n- Don\'t share current salary\n- Give range, not single number\n\n### Script\n"Thank you for the offer. I\'m excited about the role. Based on my research and experience with Kubernetes, AWS, and reducing deployment time by 80% at my current role, I was expecting \\$130k-\\$145k. Is there flexibility?"\n\n### Negotiable Items\n- Base salary (most important)\n- Signing bonus\n- Equity grant\n- Start date (more prep time)\n- Remote work flexibility\n- Learning/conference budget\n- Title (career progression)\n\n### Multiple Offers\n- Leverage competing offers\n- Be honest but tactful\n- Don\'t bluff\n\n### Red Flags\n- Unwilling to negotiate at all\n- Lowball offer with "equity upside"\n- Pressuring quick decision\nEOF',
        explanation: 'Compensation includes base, bonus, equity, benefits. Research market rates on levels.fyi. Negotiate after offer. Focus on total comp, not just salary. Multiple offers give leverage.',
        expectedOutput: 'Negotiation guide created',
        validationCriteria: [
          'Salary ranges by level/location',
          'Total comp components understood',
          'Negotiation strategy outlined',
          'Red flags noted'
        ],
        commonMistakes: ['Accepting first offer', 'Sharing current salary', 'Not researching market']
      },
      {
        stepNumber: 11,
        instruction: 'Prepare questions to ask interviewers',
        command: 'cat > questions-for-interviewer.md <<EOF\n# Questions to Ask Interviewers\n\n## About the Role\n- What does success look like in the first 6 months?\n- What\'s the biggest challenge the team is facing?\n- How much of the role is greenfield vs. maintenance?\n- What\'s the on-call rotation? Incident frequency?\n- What\'s the team\'s approach to technical debt?\n\n## About the Team\n- How large is the DevOps/Platform team?\n- What\'s the team\'s experience level?\n- How does the team collaborate (stand-ups, retros, pairing)?\n- What\'s the decision-making process for tech choices?\n- How do you handle disagreements?\n\n## About Technology\n- What\'s the current tech stack?\n- Any planned migrations or major changes?\n- How mature is the CI/CD pipeline?\n- What monitoring/observability tools are used?\n- How are secrets/credentials managed?\n\n## About Culture\n- How would you describe the engineering culture?\n- How does the company support learning/growth?\n- What\'s the work-life balance like?\n- Is there flexibility for remote work?\n- How does the company handle failures/incidents?\n\n## About Growth\n- What does the career ladder look like for DevOps?\n- Are there opportunities to mentor or lead?\n- Does the company support conferences/certifications?\n- How are performance reviews conducted?\n\n## About the Company\n- What\'s the company\'s runway/financial health?\n- How has the team changed in the last year?\n- What are the biggest product/business challenges?\n- How does DevOps fit into the company strategy?\n\n## Red Flags to Watch For\n- Vague answers about role/expectations\n- No clear growth path\n- Extremely high attrition\n- Always on-call culture\n- "We\'ll figure it out" for tech stack\nEOF',
        explanation: 'Ask questions showing interest: role expectations, team dynamics, tech stack, culture, growth. Listen for red flags: vague answers, high attrition, unclear expectations.',
        expectedOutput: 'Interview questions prepared',
        validationCriteria: [
          'Questions about role/team/tech',
          'Culture and growth questions',
          'Red flags identified',
          '5-7 questions per category'
        ],
        commonMistakes: ['No questions (shows disinterest)', 'Only asking about perks', 'Not listening to answers']
      },
      {
        stepNumber: 12,
        instruction: 'Create interview prep checklist',
        command: 'cat > interview-checklist.md <<EOF\n# DevOps Interview Checklist\n\n## Before Interview (1 Week)\n- [ ] Research company: products, tech stack, recent news\n- [ ] Review job description, note key requirements\n- [ ] Prepare STAR stories (5-7 diverse scenarios)\n- [ ] Review technical topics (K8s, Terraform, CI/CD)\n- [ ] Practice system design questions\n- [ ] Prepare questions to ask (5-7)\n- [ ] Test video/audio setup (if remote)\n\n## Day Before\n- [ ] Review company website, recent blog posts\n- [ ] Re-read resume, be ready to discuss any point\n- [ ] Practice common questions aloud\n- [ ] Prepare notepad and pen\n- [ ] Choose professional outfit\n- [ ] Get good sleep\n\n## Day Of (Remote)\n- [ ] Test tech 30min early (camera, mic, internet)\n- [ ] Professional background, good lighting\n- [ ] Water nearby, phone silent\n- [ ] Resume and notes accessible\n- [ ] Join 5min early\n\n## Day Of (Onsite)\n- [ ] Arrive 10min early\n- [ ] Bring printed resumes (5 copies)\n- [ ] Notepad and pen\n- [ ] Professional attire\n- [ ] Business cards (if you have them)\n\n## During Interview\n- [ ] Listen carefully, take notes\n- [ ] Ask clarifying questions\n- [ ] Use STAR for behavioral questions\n- [ ] Think aloud for technical questions\n- [ ] Show enthusiasm for role/company\n- [ ] Ask your prepared questions\n- [ ] Get business cards or emails\n\n## After Interview\n- [ ] Send thank-you email within 24 hours\n- [ ] Reference specific conversation points\n- [ ] Reiterate interest and fit\n- [ ] Note follow-up date if provided\n- [ ] Update application tracker\n\n## Thank You Email Template\nSubject: Thank you - DevOps Engineer Interview\n\nDear [Interviewer],\n\nThank you for taking the time to discuss the DevOps Engineer role today. I enjoyed learning about [specific project/challenge discussed] and how the team is [specific detail].\n\nOur conversation reinforced my interest in the position. My experience with [relevant skill] and achieving [specific achievement] aligns well with [team need discussed].\n\nI\'m excited about the opportunity to contribute to [company/team goal]. Please let me know if you need any additional information.\n\nBest regards,\n[Your Name]\nEOF',
        explanation: 'Interview checklist ensures preparation: research company, prepare stories, review tech, test setup. Follow up with thank-you email referencing specific conversation points.',
        expectedOutput: 'Interview checklist created',
        validationCriteria: [
          'Pre-interview tasks listed',
          'Day-of checklist complete',
          'Follow-up steps included',
          'Thank-you template provided'
        ],
        commonMistakes: ['Not testing tech beforehand', 'No follow-up email', 'Generic thank-you']
      }
    ]
  },

  walk: {
    introduction: 'Apply career preparation concepts through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create achievement-focused resume bullet.',
        template: `### DevOps Engineer | TechCorp
- **Reduced deployment time from __2 HOURS__ to __15 MINUTES__** by implementing __ARGOCD__ GitOps workflow
- **Decreased infrastructure costs by __30%__** through Kubernetes __AUTOSCALING__ and rightsizing
- **Improved system reliability to __99.95%__** by implementing comprehensive monitoring with __PROMETHEUS__
- Built __TERRAFORM__ modules enabling teams to self-serve infrastructure in <__5__ minutes
- Automated __SECURITY__ scanning catching vulnerabilities pre-production`,
        blanks: [
          {
            id: '2 HOURS',
            label: '2 HOURS',
            hint: 'Before time',
            correctValue: '2 hours',
            validationPattern: '2.*hour'
          },
          {
            id: '15 MINUTES',
            label: '15 MINUTES',
            hint: 'After time',
            correctValue: '15 minutes',
            validationPattern: '15.*min'
          },
          {
            id: 'ARGOCD',
            label: 'ARGOCD',
            hint: 'GitOps tool',
            correctValue: 'ArgoCD',
            validationPattern: 'argo'
          },
          {
            id: '30%',
            label: '30%',
            hint: 'Cost reduction',
            correctValue: '30%',
            validationPattern: '30'
          },
          {
            id: 'AUTOSCALING',
            label: 'AUTOSCALING',
            hint: 'K8s feature',
            correctValue: 'autoscaling',
            validationPattern: 'autoscal'
          },
          {
            id: '99.95%',
            label: '99.95%',
            hint: 'Reliability target',
            correctValue: '99.95%',
            validationPattern: '99'
          },
          {
            id: 'PROMETHEUS',
            label: 'PROMETHEUS',
            hint: 'Monitoring tool',
            correctValue: 'Prometheus',
            validationPattern: 'prometheus'
          },
          {
            id: 'TERRAFORM',
            label: 'TERRAFORM',
            hint: 'IaC tool',
            correctValue: 'Terraform',
            validationPattern: 'terraform'
          },
          {
            id: '5',
            label: '5',
            hint: 'Time in minutes',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: 'SECURITY',
            label: 'SECURITY',
            hint: 'Scanning type',
            correctValue: 'security',
            validationPattern: 'security'
          }
        ],
        solution: 'Resume bullets quantify impact: "Reduced deployment time from 2 hours to 15 minutes" (88% improvement), "Decreased costs by 30%". Shows business value, not just technical work.',
        explanation: 'Quantifiable achievements demonstrate impact more than task descriptions'
      },
      {
        exerciseNumber: 2,
        scenario: 'Answer behavioral question with STAR method.',
        template: `Q: Tell me about a time you improved a process.

**S**ituation: Production deployments took __2 HOURS__ with manual steps, causing __ERRORS__

**T**ask: Tasked with __AUTOMATING__ deployment process to reduce time and improve __RELIABILITY__

**A**ction:
1. Mapped current process identifying __MANUAL__ steps
2. Implemented __GITOPS__ with ArgoCD for automated sync
3. Created __CI/CD__ pipeline with GitHub Actions
4. Built comprehensive __TESTS__ catching issues early
5. Documented process and __TRAINED__ team

**R**esult: Deployment time reduced to __15 MINUTES__ (__88%__ faster), errors decreased __90%__, enabled __15+__ deploys per day`,
        blanks: [
          {
            id: '2 HOURS',
            label: '2 HOURS',
            hint: 'Original time',
            correctValue: '2 hours',
            validationPattern: '2.*hour'
          },
          {
            id: 'ERRORS',
            label: 'ERRORS',
            hint: 'Problem caused',
            correctValue: 'errors',
            validationPattern: 'error'
          },
          {
            id: 'AUTOMATING',
            label: 'AUTOMATING',
            hint: 'Your responsibility',
            correctValue: 'automating',
            validationPattern: 'automat'
          },
          {
            id: 'RELIABILITY',
            label: 'RELIABILITY',
            hint: 'Quality goal',
            correctValue: 'reliability',
            validationPattern: 'reliab'
          },
          {
            id: 'MANUAL',
            label: 'MANUAL',
            hint: 'Step type found',
            correctValue: 'manual',
            validationPattern: 'manual'
          },
          {
            id: 'GITOPS',
            label: 'GITOPS',
            hint: 'Deployment model',
            correctValue: 'GitOps',
            validationPattern: 'git'
          },
          {
            id: 'CI/CD',
            label: 'CI/CD',
            hint: 'Pipeline type',
            correctValue: 'CI/CD',
            validationPattern: 'ci'
          },
          {
            id: 'TESTS',
            label: 'TESTS',
            hint: 'Quality gates',
            correctValue: 'tests',
            validationPattern: 'test'
          },
          {
            id: 'TRAINED',
            label: 'TRAINED',
            hint: 'Team enablement',
            correctValue: 'trained',
            validationPattern: 'train'
          },
          {
            id: '15 MINUTES',
            label: '15 MINUTES',
            hint: 'New time',
            correctValue: '15 minutes',
            validationPattern: '15.*min'
          },
          {
            id: '88%',
            label: '88%',
            hint: 'Improvement percent',
            correctValue: '88%',
            validationPattern: '88'
          },
          {
            id: '90%',
            label: '90%',
            hint: 'Error reduction',
            correctValue: '90%',
            validationPattern: '90'
          },
          {
            id: '15+',
            label: '15+',
            hint: 'Deploy frequency',
            correctValue: '15+',
            validationPattern: '15'
          }
        ],
        solution: 'STAR answer: Situation (2-hour deployments with errors), Task (automate), Action (mapped process, GitOps, CI/CD, tests, training), Result (15min, 88% faster, 90% fewer errors, 15+ deploys/day).',
        explanation: 'STAR method structures behavioral answers with quantifiable results'
      },
      {
        exerciseNumber: 3,
        scenario: 'Explain Kubernetes architecture (technical question).',
        template: `Q: Explain Kubernetes architecture and key components.

A: Kubernetes is a container __ORCHESTRATION__ platform with:

**Control Plane:**
- **__API_SERVER__**: Central API for all operations
- **__ETCD__**: Distributed key-value store for cluster state
- **__SCHEDULER__**: Assigns Pods to Nodes based on resources
- **Controller Manager**: Maintains desired state (Deployments, __REPLICASETS__)

**Worker Nodes:**
- **__KUBELET__**: Agent ensuring containers run in Pods
- **__KUBE-PROXY__**: Network proxy for Services
- **Container Runtime**: __DOCKER__ or containerd running containers

**Key Resources:**
- **Pod**: Smallest unit, 1+ containers
- **Deployment**: Manages __REPLICAS__ with rolling updates
- **Service**: __LOAD_BALANCES__ traffic to Pods
- **Ingress**: __HTTP__ routing to Services`,
        blanks: [
          {
            id: 'ORCHESTRATION',
            label: 'ORCHESTRATION',
            hint: 'Platform type',
            correctValue: 'orchestration',
            validationPattern: 'orchestrat'
          },
          {
            id: 'API_SERVER',
            label: 'API_SERVER',
            hint: 'Control plane component',
            correctValue: 'API Server',
            validationPattern: 'api'
          },
          {
            id: 'ETCD',
            label: 'ETCD',
            hint: 'State store',
            correctValue: 'etcd',
            validationPattern: 'etcd'
          },
          {
            id: 'SCHEDULER',
            label: 'SCHEDULER',
            hint: 'Pod placement',
            correctValue: 'Scheduler',
            validationPattern: 'schedul'
          },
          {
            id: 'REPLICASETS',
            label: 'REPLICASETS',
            hint: 'Replica manager',
            correctValue: 'ReplicaSets',
            validationPattern: 'replica'
          },
          {
            id: 'KUBELET',
            label: 'KUBELET',
            hint: 'Node agent',
            correctValue: 'kubelet',
            validationPattern: 'kubelet'
          },
          {
            id: 'KUBE-PROXY',
            label: 'KUBE-PROXY',
            hint: 'Network proxy',
            correctValue: 'kube-proxy',
            validationPattern: 'proxy'
          },
          {
            id: 'DOCKER',
            label: 'DOCKER',
            hint: 'Container runtime',
            correctValue: 'Docker',
            validationPattern: 'docker'
          },
          {
            id: 'REPLICAS',
            label: 'REPLICAS',
            hint: 'Deployment manages',
            correctValue: 'replicas',
            validationPattern: 'replica'
          },
          {
            id: 'LOAD_BALANCES',
            label: 'LOAD_BALANCES',
            hint: 'Service function',
            correctValue: 'load balances',
            validationPattern: 'load.*balanc'
          },
          {
            id: 'HTTP',
            label: 'HTTP',
            hint: 'Ingress protocol',
            correctValue: 'HTTP',
            validationPattern: 'http'
          }
        ],
        solution: 'Kubernetes has control plane (API Server, etcd, Scheduler, Controllers) and worker nodes (kubelet, kube-proxy, runtime). Key resources: Pod, Deployment, Service, Ingress. Clear, structured explanation.',
        explanation: 'Technical answers should be clear, structured, demonstrating deep understanding'
      },
      {
        exerciseNumber: 4,
        scenario: 'Negotiate salary offer.',
        template: `Scenario: You receive offer for \\$110k. Market research shows \\$125k-\\$140k for your level.

Your Response:

"Thank you for the offer! I'm __EXCITED__ about joining the team and working on [specific project].

Based on my research on __LEVELS.FYI__ and my experience with __KUBERNETES__, __TERRAFORM__, and reducing deployment time by __80%__ at my current role, I was expecting \\$__130K__-\\$__145K__.

My __PORTFOLIO__ project demonstrates production-ready infrastructure with GitOps, observability, and __SECURITY__ best practices.

Is there __FLEXIBILITY__ on the base salary or signing bonus?"

(Remain __POSITIVE__, data-driven, emphasize __VALUE__)`,
        blanks: [
          {
            id: 'EXCITED',
            label: 'EXCITED',
            hint: 'Show enthusiasm',
            correctValue: 'excited',
            validationPattern: 'excit'
          },
          {
            id: 'LEVELS.FYI',
            label: 'LEVELS.FYI',
            hint: 'Research source',
            correctValue: 'levels.fyi',
            validationPattern: 'levels'
          },
          {
            id: 'KUBERNETES',
            label: 'KUBERNETES',
            hint: 'Key skill',
            correctValue: 'Kubernetes',
            validationPattern: 'kubernetes'
          },
          {
            id: 'TERRAFORM',
            label: 'TERRAFORM',
            hint: 'Another skill',
            correctValue: 'Terraform',
            validationPattern: 'terraform'
          },
          {
            id: '80%',
            label: '80%',
            hint: 'Achievement metric',
            correctValue: '80%',
            validationPattern: '80'
          },
          {
            id: '130K',
            label: '130K',
            hint: 'Lower bound',
            correctValue: '130k',
            validationPattern: '130'
          },
          {
            id: '145K',
            label: '145K',
            hint: 'Upper bound',
            correctValue: '145k',
            validationPattern: '145'
          },
          {
            id: 'PORTFOLIO',
            label: 'PORTFOLIO',
            hint: 'Demonstration',
            correctValue: 'portfolio',
            validationPattern: 'portfolio'
          },
          {
            id: 'SECURITY',
            label: 'SECURITY',
            hint: 'Best practice',
            correctValue: 'security',
            validationPattern: 'security'
          },
          {
            id: 'FLEXIBILITY',
            label: 'FLEXIBILITY',
            hint: 'Request openness',
            correctValue: 'flexibility',
            validationPattern: 'flexib'
          },
          {
            id: 'POSITIVE',
            label: 'POSITIVE',
            hint: 'Tone',
            correctValue: 'positive',
            validationPattern: 'positiv'
          },
          {
            id: 'VALUE',
            label: 'VALUE',
            hint: 'Emphasize contribution',
            correctValue: 'value',
            validationPattern: 'value'
          }
        ],
        solution: 'Negotiation: Thank them, show excitement. Cite research (levels.fyi), achievements (80% improvement), portfolio. Give range ($130k-$145k). Ask about flexibility. Stay positive, professional.',
        explanation: 'Salary negotiation requires research, confidence, and professionalism'
      },
      {
        exerciseNumber: 5,
        scenario: 'Prepare questions to ask interviewer.',
        template: `Good Questions to Ask:

**About the Role:**
- What does __SUCCESS__ look like in the first __6 MONTHS__?
- What's the biggest __CHALLENGE__ the team is facing?
- What's the __ON-CALL__ rotation like?

**About Technology:**
- What's the current __TECH_STACK__?
- How mature is the __CI/CD__ pipeline?
- What __MONITORING__ tools are used?

**About Culture:**
- How would you describe the __ENGINEERING_CULTURE__?
- What's the __WORK-LIFE_BALANCE__ like?
- How does the company handle __FAILURES__?

**About Growth:**
- What does the __CAREER_LADDER__ look like?
- Are there opportunities to __MENTOR__?
- Does the company support __CONFERENCES__?`,
        blanks: [
          {
            id: 'SUCCESS',
            label: 'SUCCESS',
            hint: 'Achievement definition',
            correctValue: 'success',
            validationPattern: 'success'
          },
          {
            id: '6 MONTHS',
            label: '6 MONTHS',
            hint: 'Timeframe',
            correctValue: '6 months',
            validationPattern: '6.*month'
          },
          {
            id: 'CHALLENGE',
            label: 'CHALLENGE',
            hint: 'Team difficulty',
            correctValue: 'challenge',
            validationPattern: 'challeng'
          },
          {
            id: 'ON-CALL',
            label: 'ON-CALL',
            hint: 'Rotation type',
            correctValue: 'on-call',
            validationPattern: 'call'
          },
          {
            id: 'TECH_STACK',
            label: 'TECH_STACK',
            hint: 'Technology used',
            correctValue: 'tech stack',
            validationPattern: 'tech.*stack'
          },
          {
            id: 'CI/CD',
            label: 'CI/CD',
            hint: 'Pipeline type',
            correctValue: 'CI/CD',
            validationPattern: 'ci'
          },
          {
            id: 'MONITORING',
            label: 'MONITORING',
            hint: 'Observability',
            correctValue: 'monitoring',
            validationPattern: 'monitor'
          },
          {
            id: 'ENGINEERING_CULTURE',
            label: 'ENGINEERING_CULTURE',
            hint: 'Team environment',
            correctValue: 'engineering culture',
            validationPattern: 'culture'
          },
          {
            id: 'WORK-LIFE_BALANCE',
            label: 'WORK-LIFE_BALANCE',
            hint: 'Balance quality',
            correctValue: 'work-life balance',
            validationPattern: 'work.*life'
          },
          {
            id: 'FAILURES',
            label: 'FAILURES',
            hint: 'Incident handling',
            correctValue: 'failures',
            validationPattern: 'fail'
          },
          {
            id: 'CAREER_LADDER',
            label: 'CAREER_LADDER',
            hint: 'Progression path',
            correctValue: 'career ladder',
            validationPattern: 'career.*ladder'
          },
          {
            id: 'MENTOR',
            label: 'MENTOR',
            hint: 'Leadership opportunity',
            correctValue: 'mentor',
            validationPattern: 'mentor'
          },
          {
            id: 'CONFERENCES',
            label: 'CONFERENCES',
            hint: 'Learning support',
            correctValue: 'conferences',
            validationPattern: 'conferenc'
          }
        ],
        solution: 'Ask about: role expectations (success in 6 months, challenges), technology (tech stack, CI/CD maturity), culture (work-life balance, failure handling), growth (career ladder, mentoring, conferences).',
        explanation: 'Thoughtful questions show genuine interest and help evaluate fit'
      }
    ],
    hints: [
      'Resume achievements should be quantifiable with metrics',
      'STAR method structures behavioral answers effectively',
      'Technical answers should be clear and demonstrate depth',
      'Salary negotiation requires market research and confidence',
      'Asking questions shows genuine interest in the role'
    ]
  },

  runGuided: {
    objective: 'Complete DevOps job search preparation: resume, LinkedIn, GitHub, interview skills, technical prep, and offer negotiation',
    conceptualGuidance: [
      'Build achievement-focused resume with quantified impacts',
      'Optimize LinkedIn with compelling headline and skills',
      'Create GitHub portfolio with pinned professional projects',
      'Prepare STAR stories for common behavioral questions',
      'Practice technical questions: Kubernetes, CI/CD, troubleshooting',
      'Research target companies and customize applications',
      'Prepare system design approach: clarify, architect, scale',
      'Understand compensation ranges and negotiation strategy',
      'Prepare thoughtful questions showing genuine interest',
      'Practice mock interviews for technical and behavioral'
    ],
    keyConceptsToApply: [
      'Quantifiable achievements over task descriptions',
      'STAR method for behavioral questions',
      'Clear technical explanations',
      'Market research for compensation',
      'Professional networking'
    ],
    checkpoints: [
      {
        checkpoint: 'Portfolio and applications ready',
        description: 'Resume, LinkedIn, GitHub optimized',
        validationCriteria: [
          'Resume with 5+ quantified achievements',
          'LinkedIn headline showing value proposition',
          'GitHub with 6 pinned professional repos',
          'Target companies list (10-20)',
          'Resume customized for target roles',
          'Portfolio project documented professionally'
        ],
        hintIfStuck: 'Resume: use "Reduced X by Y%" format. LinkedIn: headline shows impact. GitHub: pin best projects with professional READMEs. Research companies on levels.fyi, LinkedIn.'
      },
      {
        checkpoint: 'Interview preparation complete',
        description: 'Technical and behavioral questions practiced',
        validationCriteria: [
          '5-7 STAR stories prepared',
          'Technical topics reviewed (K8s, Terraform, CI/CD)',
          'System design approach practiced',
          '10+ questions to ask prepared',
          'Mock interviews completed',
          'Troubleshooting scenarios practiced'
        ],
        hintIfStuck: 'STAR: Write out 5-7 diverse stories. Technical: Review key concepts, practice explaining aloud. System design: Clarify requirements, draw diagrams, discuss tradeoffs. Mock interview with friend.'
      },
      {
        checkpoint: 'Compensation negotiation prepared',
        description: 'Market research and negotiation strategy',
        validationCriteria: [
          'Salary ranges researched for role/location',
          'Total comp components understood',
          'Negotiation script prepared',
          'Multiple offer strategy understood',
          'Red flags identified',
          'Confidence in asking for market value'
        ],
        hintIfStuck: 'Research levels.fyi, Glassdoor for salary data. Understand total comp: base + bonus + equity + benefits. Practice negotiation script with friend. Focus on value, not desperation.'
      }
    ],
    resourcesAllowed: [
      'levels.fyi for compensation data',
      'LinkedIn for networking',
      'Glassdoor for company reviews',
      'Pramp for mock interviews',
      'Interview prep books'
    ]
  },

  runIndependent: {
    objective: 'Execute complete DevOps job search: build portfolio, optimize profiles, prepare comprehensively for interviews, apply strategically, and negotiate offers successfully',
    successCriteria: [
      'Resume: 5+ quantified achievements, skills section comprehensive, projects linked, ATS-friendly',
      'LinkedIn: Compelling headline, achievement-focused About, 100+ connections, active engagement',
      'GitHub: Profile README, 6 pinned repos with professional READMEs, consistent contributions',
      'Interview Prep: 7+ STAR stories, technical topics reviewed, system design practiced, mock interviews',
      'Applications: 20+ applications to target companies, customized resumes, follow-ups tracked',
      'Technical Skills: Confident explaining K8s, Terraform, CI/CD, troubleshooting, system design',
      'Behavioral Skills: STAR answers polished, questions prepared, confident communication',
      'Negotiation: Market rates researched, compensation strategy defined, confidence in asking',
      'Networking: Attending meetups, contributing open source, informational interviews',
      'Offer Evaluation: Criteria defined, multiple offers compared, total comp calculated, decision made'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Professional resume and LinkedIn',
      'Interview prep completed',
      'Applications submitted'
    ],
    evaluationRubric: [
      {
        criterion: 'Portfolio & Materials',
        weight: 25,
        passingThreshold: 'Resume with quantified achievements. LinkedIn optimized with headline showing value. GitHub with professional pinned repos. Portfolio project documented. Materials ATS-friendly and customized per role.'
      },
      {
        criterion: 'Interview Preparation',
        weight: 30,
        passingThreshold: 'STAR stories prepared covering diverse scenarios. Technical topics reviewed deeply. System design approach practiced. Questions to ask prepared. Mock interviews completed. Confident communication demonstrated.'
      },
      {
        criterion: 'Job Search Strategy',
        weight: 20,
        passingThreshold: 'Target companies identified (20+). Applications customized and tracked. Networking active (meetups, LinkedIn, open source). Follow-ups systematic. Multiple channels used (LinkedIn, referrals, direct).'
      },
      {
        criterion: 'Negotiation Skills',
        weight: 25,
        passingThreshold: 'Market rates researched (levels.fyi). Total comp understood (base, bonus, equity, benefits). Negotiation script practiced. Confidence in asking for market value. Multiple offers leveraged. Red flags identified.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=PJKYqLP6MRE',
  documentation: [
    'https://www.levels.fyi/',
    'https://www.linkedin.com/help/linkedin/answer/a507663',
    'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile',
    'https://www.glassdoor.com/',
    'https://interviewing.io/',
    'https://www.pramp.com/'
  ],
  relatedConcepts: [
    'Resume achievement formatting',
    'STAR method for behavioral interviews',
    'Technical interview preparation',
    'System design methodology',
    'Salary negotiation strategies',
    'Professional networking'
  ]
};

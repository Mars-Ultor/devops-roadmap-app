# CI/CD Pipeline Documentation

This document outlines the comprehensive CI/CD pipeline for the DevOps Roadmap application.

## Overview

The CI/CD pipeline consists of multiple GitHub Actions workflows that handle:

- **Continuous Integration**: Testing, linting, and building
- **Continuous Deployment**: Automated deployment to staging and production
- **Security Monitoring**: Regular vulnerability scans
- **Performance Monitoring**: Lighthouse audits and performance checks
- **Dependency Management**: Automated dependency updates
- **Release Management**: Automated versioning and releases

## Workflows

### 1. Main CI/CD Pipeline (`ci-cd-pipeline.yml`)

**Triggers:**
- Push to `master`, `main`, or `develop` branches
- Pull requests to these branches
- Manual dispatch with environment selection

**Jobs:**
- `security-scan`: Vulnerability scanning with Trivy
- `test-client`: Client testing, linting, and building
- `test-server`: Server testing with PostgreSQL database
- `test-ml-service`: ML service testing and linting
- `code-quality`: Comprehensive code quality checks
- `deploy-staging`: Deploy to staging environment
- `deploy-production`: Deploy to production environment
- `rollback`: Manual rollback capability

### 2. Code Quality Checks (`code-quality.yml`)

**Triggers:** Pull requests

**Purpose:** Ensures code quality before merging

**Checks:**
- ESLint for JavaScript/TypeScript
- TypeScript type checking
- Code formatting (Prettier)
- Python linting (flake8, black, isort)
- Bundle size monitoring

### 3. Security Monitoring (`security-monitoring.yml`)

**Triggers:** Daily at 6 AM UTC

**Purpose:** Regular security vulnerability scanning

**Features:**
- Trivy container vulnerability scanning
- npm audit for Node.js dependencies
- Automatic issue creation for critical vulnerabilities
- Slack notifications for security alerts

### 4. Performance Monitoring (`performance-monitoring.yml`)

**Triggers:** Weekly on Wednesdays

**Purpose:** Monitor application performance

**Features:**
- Lighthouse performance audits
- Accessibility scoring
- SEO and best practices checks
- Automatic issue creation for performance degradation
- Slack notifications

### 5. Dependency Updates (`dependency-updates.yml`)

**Triggers:** Weekly on Mondays

**Purpose:** Keep dependencies up to date

**Features:**
- Automated dependency updates
- Security vulnerability fixes
- Test execution after updates
- Automatic pull request creation

### 6. Release Management (`release.yml`)

**Triggers:**
- Git tags matching `v*.*.*`
- Manual dispatch with version specification

**Features:**
- Semantic versioning
- Automated changelog generation
- Release asset creation
- GitHub release creation
- Slack notifications

### 7. Firebase Deploy (Legacy) (`firebase-deploy.yml`)

**Purpose:** Manual Firebase deployments

**Use:** For emergency deployments or testing

## Environment Configuration

### Required Secrets

```bash
# Firebase
FIREBASE_TOKEN
FIREBASE_PROJECT_ID_STAGING
FIREBASE_TOKEN_STAGING

# Railway
RAILWAY_API_TOKEN
RAILWAY_SERVER_SERVICE_ID
RAILWAY_SERVER_SERVICE_ID_STAGING
RAILWAY_ML_SERVICE_ID
RAILWAY_ML_SERVICE_ID_STAGING

# API URLs
VITE_API_URL
VITE_ML_API_URL
PRODUCTION_API_URL

# Slack Webhooks
SLACK_WEBHOOK_STAGING
SLACK_WEBHOOK_PRODUCTION
SLACK_SECURITY_WEBHOOK
SLACK_PERFORMANCE_WEBHOOK
SLACK_RELEASE_WEBHOOK

# JWT
JWT_SECRET
```

### Environment Variables

```bash
NODE_VERSION: '18'
PYTHON_VERSION: '3.9'
```

## Branch Strategy

- **`master`/`main`**: Production branch - triggers production deployment
- **`develop`**: Development branch - triggers staging deployment
- **Feature branches**: Create pull requests for code review

## Deployment Environments

### Staging
- **Trigger:** Push to `develop` branch
- **Services:** All services deployed to staging
- **Purpose:** Testing and validation before production

### Production
- **Trigger:** Push to `master` branch or manual dispatch
- **Services:** All services deployed to production
- **Features:** Health checks, rollback capability

## Manual Workflows

### Deploy to Specific Environment

```yaml
# Use workflow_dispatch
environment: staging|production
```

### Create Release

```yaml
# Use workflow_dispatch
version: "1.2.3"
release_type: patch|minor|major
```

### Rollback Deployment

```yaml
# Use workflow_dispatch
rollback: true
rollback_version: "v1.2.2"
```

## Monitoring and Alerts

### Slack Notifications

The pipeline sends notifications for:
- Deployment status (success/failure)
- Security vulnerabilities
- Performance issues
- New releases

### GitHub Issues

Automatic issue creation for:
- Security vulnerabilities (critical/high severity)
- Performance degradation
- Failed deployments

## Testing Strategy

### Unit Tests
- Client: Jest + React Testing Library
- Server: Jest + Supertest
- ML Service: pytest

### Integration Tests
- API endpoint testing
- Database integration
- Cross-service communication

### End-to-End Tests
- Cypress for critical user flows (planned)

## Security Features

### Vulnerability Scanning
- Container image scanning with Trivy
- Dependency vulnerability checks
- SAST (Static Application Security Testing)

### Access Control
- Branch protection rules
- Required reviews for production
- Environment protection

## Performance Monitoring

### Metrics Tracked
- Lighthouse Performance Score (target: ≥80)
- Lighthouse Accessibility Score (target: ≥90)
- Bundle size limits
- API response times

### Automated Actions
- Performance regression alerts
- Bundle size increase notifications
- Accessibility issue tracking

## Troubleshooting

### Common Issues

1. **Test Failures**
   - Check database connectivity
   - Verify environment variables
   - Review test logs

2. **Deployment Failures**
   - Check service credentials
   - Verify environment configuration
   - Review deployment logs

3. **Security Alerts**
   - Update vulnerable dependencies
   - Review security advisories
   - Implement security patches

### Debugging Workflows

1. **Re-run failed jobs** in GitHub Actions
2. **Check workflow logs** for detailed error messages
3. **Review artifacts** for test results and reports
4. **Use workflow dispatch** for manual testing

## Maintenance

### Regular Tasks

- **Weekly:** Review dependency update PRs
- **Monthly:** Audit security settings
- **Quarterly:** Review and update performance baselines

### Updating Workflows

1. Test changes on feature branch
2. Use workflow dispatch for validation
3. Update documentation
4. Merge to main branch

## Contributing

### Adding New Workflows

1. Create workflow file in `.github/workflows/`
2. Follow naming conventions
3. Add comprehensive documentation
4. Test thoroughly before deployment

### Modifying Existing Workflows

1. Create feature branch
2. Test changes with workflow dispatch
3. Update this documentation
4. Create pull request for review

## Support

For CI/CD pipeline issues:
1. Check GitHub Actions logs
2. Review workflow documentation
3. Create issue with detailed information
4. Contact DevOps team for assistance
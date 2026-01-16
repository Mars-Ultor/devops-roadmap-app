# Code Analysis Guide for DevOps Roadmap App

This document provides comprehensive guidance for analyzing the codebase using various static analysis, security scanning, and code quality tools.

## Table of Contents

1. [Overview](#overview)
2. [Static Analysis Tools](#static-analysis-tools)
3. [Security Scanning](#security-scanning)
4. [Performance Analysis](#performance-analysis)
5. [Code Quality Metrics](#code-quality-metrics)
6. [Automated Analysis Setup](#automated-analysis-setup)
7. [Manual Analysis Commands](#manual-analysis-commands)
8. [Configuration Files](#configuration-files)
9. [CI/CD Integration](#cicd-integration)
10. [Analysis Results Interpretation](#analysis-results-interpretation)

## Overview

The DevOps Roadmap App is a full-stack application with:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js/Express + TypeScript
- **ML Service**: Python + FastAPI
- **Database**: PostgreSQL + Prisma ORM
- **Infrastructure**: Docker + Railway/Render deployment

This analysis guide covers tools and techniques for maintaining code quality, security, and performance across all components.

## Static Analysis Tools

### ESLint (JavaScript/TypeScript)

**Purpose**: Code linting, style enforcement, and bug detection

**Configuration**: `client/eslint.config.js`, `server/eslint.config.js`

**Run Analysis**:
```bash
# Frontend
cd client && npm run lint

# Backend
cd server && npm run lint

# ML Service (if configured)
cd ml-service && flake8 . --max-line-length=88
```

**Key Rules**:
- TypeScript strict mode enabled
- React hooks rules
- Import/export consistency
- Code formatting with Prettier integration

### TypeScript Compiler (tsc)

**Purpose**: Type checking and compilation validation

**Configuration**: `client/tsconfig.json`, `server/tsconfig.json`

**Run Analysis**:
```bash
# Frontend
cd client && npx tsc --noEmit

# Backend
cd server && npx tsc --noEmit
```

**Analysis Focus**:
- Type safety validation
- Interface compliance
- Generic type usage
- Null/undefined safety

### SonarQube/SonarCloud

**Purpose**: Comprehensive code quality analysis

**Configuration**: Create `sonar-project.properties`:
```properties
sonar.projectKey=devops-roadmap-app
sonar.projectName=DevOps Roadmap App
sonar.projectVersion=1.0.0

sonar.sources=client/src,server/src,ml-service
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.*,**/*.spec.*
sonar.tests=client/src,server/src
sonar.test.inclusions=**/*.test.*,**/*.spec.*

sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.python.coverage.reportPaths=ml-service/coverage.xml

sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

**Run Analysis**:
```bash
# Install sonar-scanner
npm install -g sonarqube-scanner

# Run analysis
sonar-scanner
```

## Security Scanning

### Snyk

**Purpose**: Dependency vulnerability scanning and license compliance

**Configuration**: `snyk.config.js` (if needed)

**Run Analysis**:
```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Scan all components
cd client && snyk test
cd ../server && snyk test
cd ../ml-service && snyk test --file=requirements.txt

# Monitor for new vulnerabilities
snyk monitor
```

### OWASP Dependency Check

**Purpose**: Known vulnerability detection in dependencies

**Configuration**: Create `dependency-check-config.xml`:
```xml
<?xml version="1.0"?>
<configuration>
    <scanSet>
        <directory>client</directory>
        <directory>server</directory>
        <includes>
            <include>**/*.json</include>
            <include>**/*.js</include>
            <include>**/*.ts</include>
        </includes>
        <excludes>
            <exclude>**/node_modules/**</exclude>
            <exclude>**/dist/**</exclude>
        </excludes>
    </scanSet>
    <suppressionFile>dependency-check-suppression.xml</suppressionFile>
</configuration>
```

**Run Analysis**:
```bash
# Download and run OWASP Dependency Check
dependency-check --project "DevOps Roadmap App" --scan . --format ALL
```

### Trivy

**Purpose**: Container and filesystem vulnerability scanning

**Run Analysis**:
```bash
# Install Trivy
# Scan filesystem
trivy filesystem --format table --output trivy-fs-report.html .

# Scan Docker images (if built)
trivy image --format table --output trivy-image-report.html your-app:latest
```

### Semgrep

**Purpose**: Semantic code analysis for security vulnerabilities

**Configuration**: Create `.semgrep.yml`:
```yaml
rules:
  - id: javascript.security
  - id: typescript.security
  - id: python.security
  - id: docker.security

config:
  - rules: https://semgrep.dev/p/r2c-security-audit
  - rules: https://semgrep.dev/p/r2c-best-practices
```

**Run Analysis**:
```bash
# Install Semgrep
pip install semgrep

# Run security analysis
semgrep --config .semgrep.yml --output semgrep-report.json
```

## Performance Analysis

### Lighthouse

**Purpose**: Web app performance, accessibility, and SEO analysis

**Run Analysis**:
```bash
# Install Lighthouse
npm install -g lighthouse

# Analyze production build
lighthouse http://localhost:3000 --output html --output-path ./reports/lighthouse-report.html
```

### WebPageTest

**Purpose**: Real user monitoring and performance testing

**Run Analysis**:
```bash
# Using WebPageTest API
curl "https://www.webpagetest.org/runtest.php?url=https://your-app.com&f=json" > webpagetest-results.json
```

### Bundle Analyzer

**Purpose**: Analyze JavaScript bundle size and composition

**Configuration**: Add to `client/package.json`:
```json
{
  "scripts": {
    "analyze": "npx vite-bundle-analyzer dist"
  }
}
```

**Run Analysis**:
```bash
cd client && npm run build && npm run analyze
```

## Code Quality Metrics

### Code Coverage

**Purpose**: Measure test coverage across the application

**Configuration**: `client/vitest.config.ts`, `server/jest.config.cjs`

**Run Analysis**:
```bash
# Frontend coverage
cd client && npm run test:coverage

# Backend coverage
cd server && npm run test:coverage

# ML Service coverage (if configured)
cd ml-service && python -m pytest --cov=. --cov-report=html
```

### Code Complexity

**Purpose**: Measure cyclomatic complexity and maintainability

**Tools**:
- **ESLint complexity plugin**
- **SonarQube complexity metrics**
- **Python: radon (for ML service)**

**Run Analysis**:
```bash
# Python complexity
pip install radon
radon cc ml-service/ -a

# JavaScript/TypeScript complexity via ESLint
npx eslint . --ext .js,.ts,.tsx --format json | jq '.[] | select(.messages[].ruleId == "complexity")'
```

### Code Duplication

**Purpose**: Identify duplicate code blocks

**Tools**:
- **SonarQube duplication detection**
- **jscpd (JavaScript/TypeScript)**
- **PMD CPD (multi-language)**

**Run Analysis**:
```bash
# Install jscpd
npm install -g jscpd

# Run duplication analysis
jscpd --format json --output duplicates.json client/src server/src
```

## Automated Analysis Setup

### Pre-commit Hooks

**Configuration**: `.pre-commit-config.yaml`
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: local
    hooks:
      - id: eslint
        name: eslint
        entry: npx eslint
        language: system
        files: \.(js|ts|tsx)$
        args: [--fix]

      - id: tsc
        name: typescript
        entry: npx tsc
        language: system
        files: \.(ts|tsx)$
        args: [--noEmit]

      - id: prettier
        name: prettier
        entry: npx prettier
        language: system
        files: \.(js|ts|tsx|json|md)$
        args: [--write]
```

### GitHub Actions Workflow

**Configuration**: `.github/workflows/code-analysis.yml`
```yaml
name: Code Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci

      - name: Run ESLint
        run: |
          cd client && npm run lint
          cd ../server && npm run lint

      - name: Run TypeScript check
        run: |
          cd client && npx tsc --noEmit
          cd ../server && npx tsc --noEmit

      - name: Run tests with coverage
        run: |
          cd client && npm run test:coverage
          cd ../server && npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/lcov.info,./server/coverage/lcov.info

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --file=client/package.json

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@v1
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Manual Analysis Commands

### Complete Analysis Suite

```bash
#!/bin/bash
# Run all analysis tools

echo "🚀 Starting comprehensive code analysis..."

# Create reports directory
mkdir -p reports

# Frontend Analysis
echo "📊 Analyzing frontend..."
cd client
npm run lint > ../reports/eslint-frontend.txt 2>&1
npx tsc --noEmit > ../reports/tsc-frontend.txt 2>&1
npm run test:coverage > ../reports/coverage-frontend.txt 2>&1
cd ..

# Backend Analysis
echo "📊 Analyzing backend..."
cd server
npm run lint > ../reports/eslint-backend.txt 2>&1
npx tsc --noEmit > ../reports/tsc-backend.txt 2>&1
npm run test:coverage > ../reports/coverage-backend.txt 2>&1
cd ..

# ML Service Analysis
echo "📊 Analyzing ML service..."
cd ml-service
python -m flake8 . > ../reports/flake8-ml.txt 2>&1
python -m pytest --cov=. --cov-report=html > ../reports/coverage-ml.txt 2>&1
cd ..

# Security Analysis
echo "🔒 Running security scans..."
snyk test client > reports/snyk-frontend.txt 2>&1
snyk test server > reports/snyk-backend.txt 2>&1
trivy filesystem . > reports/trivy-filesystem.txt 2>&1

# Performance Analysis
echo "⚡ Running performance analysis..."
lighthouse http://localhost:3000 --output json --output-path ./reports/lighthouse.json || echo "Lighthouse failed - app not running"

echo "✅ Analysis complete! Check reports/ directory for results."
```

### Quick Analysis Script

```bash
#!/bin/bash
# Quick analysis for development

echo "🔍 Running quick code analysis..."

# Lint check
echo "ESLint:"
npx eslint client/src server/src --ext .ts,.tsx,.js --format compact

# Type check
echo -e "\nTypeScript:"
npx tsc --noEmit --project client/tsconfig.json
npx tsc --noEmit --project server/tsconfig.json

# Test run
echo -e "\nTests:"
cd client && npm test -- --run --coverage --watchAll=false
cd ../server && npm test -- --run --coverage --watchAll=false

echo "✅ Quick analysis complete!"
```

## Configuration Files

### ESLint Configurations

**client/eslint.config.js**:
```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // Custom rules for the project
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
```

### TypeScript Configurations

**client/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## CI/CD Integration

### GitHub Actions Complete Workflow

```yaml
name: Complete Code Analysis

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  analysis:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        cd client && npm ci
        cd ../server && npm ci
        cd ../ml-service && pip install -r requirements.txt

    - name: Lint and Type Check
      run: |
        cd client && npm run lint && npx tsc --noEmit
        cd ../server && npm run lint && npx tsc --noEmit
        cd ../ml-service && python -m flake8 .

    - name: Run Tests
      run: |
        cd client && npm run test:ci
        cd ../server && npm run test:ci
        cd ../ml-service && python -m pytest

    - name: Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

    - name: SonarQube Analysis
      uses: sonarsource/sonarqube-scan-action@v1
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

    - name: Upload Coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./client/coverage/lcov.info,./server/coverage/lcov.info,./ml-service/coverage.xml
```

## Analysis Results Interpretation

### ESLint Results
- **Errors**: Must be fixed before commit
- **Warnings**: Should be addressed, may indicate potential issues
- **Ignored rules**: Document why specific rules are disabled

### TypeScript Errors
- **Type errors**: Fix immediately - indicate type safety issues
- **Strict mode violations**: Address to maintain type safety
- **Unused variables**: Remove or prefix with `_` if intentionally unused

### Test Coverage
- **Target**: >80% coverage for critical paths
- **Branches**: Focus on conditional logic coverage
- **Functions**: Ensure all exported functions are tested

### Security Findings
- **Critical**: Fix immediately
- **High**: Fix within sprint
- **Medium/Low**: Address in technical debt sessions

### Performance Metrics
- **Lighthouse Score**: Target >90 for all categories
- **Bundle Size**: Monitor and optimize large bundles
- **Load Times**: Keep under 3 seconds for initial load

### Code Complexity
- **Cyclomatic complexity**: Keep under 10 for most functions
- **File length**: Limit to 300 lines per file
- **Function length**: Limit to 50 lines per function

## Maintenance

### Regular Analysis Schedule
- **Daily**: Pre-commit hooks and basic linting
- **Weekly**: Full security scan and dependency updates
- **Monthly**: Complete analysis suite and performance benchmarks
- **Quarterly**: Architecture review and code cleanup

### Tool Updates
- Keep all analysis tools updated to latest versions
- Review and update rule configurations annually
- Monitor for new security vulnerabilities in analysis tools themselves

### Documentation Updates
- Update this guide when new tools are added
- Document any custom rules or exceptions
- Maintain configuration file templates

---

## Quick Start

To run a complete analysis suite:

```bash
# Clone and setup
git clone <repository>
npm install

# Run analysis
./scripts/analyze.sh

# View results
open reports/
```

For development workflow:
```bash
# Install pre-commit hooks
pre-commit install

# Run quick analysis
./scripts/quick-analyze.sh
```

This comprehensive analysis setup ensures code quality, security, and performance standards are maintained throughout the development lifecycle.</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\CODE_ANALYSIS.md
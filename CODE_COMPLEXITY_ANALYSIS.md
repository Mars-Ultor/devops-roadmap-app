# Code Complexity Analysis

This document describes the code complexity analysis tools and processes implemented for the DevOps Roadmap App.

## Overview

Code complexity analysis helps maintain code quality by measuring:
- **Cyclomatic Complexity**: Number of linearly independent paths through code
- **Cognitive Complexity**: How difficult code is for humans to understand
- **Maintainability Index**: Overall maintainability score
- **Function Size**: Lines of code, parameter count, nesting depth

## Complexity Thresholds

### JavaScript/TypeScript
- **Cyclomatic Complexity**: ≤ 10 (client), ≤ 12 (server)
- **Cognitive Complexity**: ≤ 15 (client), ≤ 18 (server)
- **Max Lines per Function**: ≤ 50 (client), ≤ 60 (server)
- **Max Parameters**: ≤ 4 (client), ≤ 5 (server)
- **Max Nesting Depth**: ≤ 4

### Python
- **Cyclomatic Complexity**: ≤ 10
- **Maintainability Index**: ≥ 20
- **Max Lines per Function**: ≤ 50

## Tools Used

### Client (React/TypeScript)
- **ESLint** with complexity plugins:
  - `eslint-plugin-complexity`
  - `eslint-plugin-sonarjs`

### Server (Node.js/TypeScript)
- **ESLint** with complexity plugins:
  - `eslint-plugin-complexity`
  - `eslint-plugin-sonarjs`

### ML Service (Python)
- **Radon**: Cyclomatic complexity, maintainability index, Halstead metrics
- **Flake8**: Code quality with McCabe complexity
- **McCabe**: Direct complexity analysis

## Running Complexity Analysis

### Quick Analysis (Individual Services)

#### Client
```bash
cd client
npm run lint:complexity
```

#### Server
```bash
cd server
npm run lint:complexity
```

#### ML Service
```bash
cd ml-service
python analyze_complexity.py
# or
./analyze-complexity.sh
```

### Full Project Analysis

#### Linux/macOS
```bash
./analyze-complexity.sh
```

#### Windows
```cmd
analyze-complexity.bat
```

## CI/CD Integration

Complexity analysis runs automatically in GitHub Actions:

1. **Client**: ESLint complexity rules during `test-client` job
2. **Server**: ESLint complexity rules during `test-server` job
3. **ML Service**: Radon and Flake8 during `test-ml-service` job

Results are available in:
- GitHub Actions logs
- Individual service `analysis_output.log` files
- ML service `complexity-report.json`

## Configuration Files

### ESLint Complexity Rules

**Client** (`client/eslint.config.js`):
```javascript
rules: {
  'complexity': ['error', 10],           // Cyclomatic complexity
  'sonarjs/cognitive-complexity': ['error', 15], // Cognitive complexity
  'max-lines-per-function': ['error', 50], // Function size
  'max-params': ['error', 4],           // Parameter count
  'max-depth': ['error', 4],            // Nesting depth
}
```

**Server** (`server/.eslintrc.js`):
```javascript
rules: {
  'complexity': ['error', 12],           // Higher limit for backend
  'sonarjs/cognitive-complexity': ['error', 18],
  'max-lines-per-function': ['error', 60],
  'max-params': ['error', 5],
  'max-depth': ['error', 4],
}
```

### Python Complexity Configuration

**ML Service** (`ml-service/.complexity.cfg`):
```ini
[radon]
max-cc = 10
min-mi = 20

[flake8]
max-complexity = 10
max-line-length = 88
```

## Interpreting Results

### ESLint Complexity Output
```
error: Function 'complexFunction' has a complexity of 15 (max: 10)  complexity
error: Function 'anotherFunction' has a cognitive complexity of 20 (max: 15)  sonarjs/cognitive-complexity
```

### Radon Output
```
models/learning_path_predictor.py
    F 51:0 _preprocess_features - C (11)
    F 65:0 _train_model - C (8)
    F 75:0 _predict_model - C (6)

*** Overall:
    Cyclomatic complexity: 11 (max: 10)
    Maintainability index: 45.2 (min: 20)
```

### Recommended Actions

#### High Complexity Functions
1. **Extract Methods**: Break large functions into smaller, focused methods
2. **Reduce Nesting**: Use early returns and guard clauses
3. **Simplify Logic**: Replace complex conditionals with polymorphism or strategy patterns
4. **Add Comments**: Document complex business logic

#### Example Refactoring

**Before (High Complexity)**:
```typescript
function processUserData(user: User, options: ProcessOptions) {
  if (user && user.isActive) {
    if (options.includeProfile) {
      if (options.format === 'json') {
        // Complex nested logic...
      } else if (options.format === 'xml') {
        // More complex logic...
      }
    }
  }
}
```

**After (Lower Complexity)**:
```typescript
function processUserData(user: User, options: ProcessOptions) {
  if (!user?.isActive) return;

  if (options.includeProfile) {
    return formatUserData(user, options.format);
  }
}

function formatUserData(user: User, format: string) {
  const formatters = {
    json: formatAsJson,
    xml: formatAsXml
  };

  return formatters[format]?.(user) || user;
}
```

## Complexity vs. Performance

Complexity analysis focuses on **maintainability**, not performance:
- ✅ **Good**: Simple, readable code
- ❌ **Bad**: Complex, hard-to-maintain code
- ⚠️ **Note**: Some performance optimizations may increase complexity

## Continuous Monitoring

Complexity analysis runs on:
- Every push to main/develop branches
- All pull requests
- Manual workflow triggers

Monitor trends and address violations promptly to maintain code quality.

## Troubleshooting

### Common Issues

1. **ESLint Plugin Not Found**
   ```bash
   npm install eslint-plugin-complexity eslint-plugin-sonarjs
   ```

2. **Radon Not Found**
   ```bash
   pip install radon
   ```

3. **High Complexity in Legacy Code**
   - Add `// eslint-disable-next-line complexity` comments
   - Plan refactoring in technical debt sprints

### False Positives

Some complex functions may be acceptable if they:
- Implement well-known algorithms
- Have comprehensive test coverage
- Are well-documented with clear business logic

Use `// eslint-disable-next-line` comments with justification.

## Related Documentation

- [ESLint Complexity Plugin](https://www.npmjs.com/package/eslint-plugin-complexity)
- [SonarJS Rules](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Radon Documentation](https://radon.readthedocs.io/)
- [McCabe Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
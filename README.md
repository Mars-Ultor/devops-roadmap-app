# DevOps Roadmap App

A comprehensive learning platform for DevOps engineers with interactive lessons, hands-on labs, and AI-powered learning assistance.

<!-- Auto-commit watcher test - Jan 1, 2026 -->

## 🚀 Features

- **Interactive Learning**: Step-by-step DevOps curriculum
- **Hands-on Labs**: Real-world scenarios and exercises
- **AI Assistance**: Intelligent learning recommendations
- **Progress Tracking**: Comprehensive skill assessment
- **Multi-Platform**: Web application with scalable backend
- **Performance Caching**: Redis-powered caching for optimal performance

## 🏗️ Architecture

### Services

- **Client**: React/Vite frontend (Firebase Hosting)
- **Server**: Node.js/Express API with PostgreSQL (Railway)
- **ML Service**: Python ML models for learning analytics (Railway)
- **Redis**: High-performance caching layer (optional)

### Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **ML Service**: Python, scikit-learn, TensorFlow
- **Caching**: Redis (optional, improves performance)
- **Hosting**: Firebase (Client), Railway (Server/ML)
- **CI/CD**: GitHub Actions

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL (for local development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mars-Ultor/devops-roadmap-app.git
   cd devops-roadmap-app
   ```

2. **Install dependencies**
   ```bash
   # Client
   cd client && npm install

   # Server
   cd ../server && npm install

   # ML Service
   cd ../ml-service && pip install -r requirements.txt
   ```

3. **Database setup**
   ```bash
   cd server
   # Copy environment file
   cp .env.example .env
   # Edit .env with your database URL

   # Run migrations
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. **Redis setup (optional, improves performance)**
   ```bash
   # Linux/Mac
   ./setup-redis.sh

   # Windows
   setup-redis.bat

   # Add REDIS_URL to your .env files
   echo "REDIS_URL=redis://localhost:6379" >> server/.env
   echo "REDIS_URL=redis://localhost:6379" >> ml-service/.env
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Client
   cd client && npm run dev

   # Terminal 2: Server
   cd server && npm run dev

   # Terminal 3: ML Service
   cd ml-service && python main.py
   ```

## 🚢 Deployment

### Automatic Deployment

The application uses GitHub Actions for CI/CD:

- **Staging**: Push to `develop` branch
- **Production**: Push to `master` branch

### Auto-Commit Scripts

Automatically commit and push code changes to trigger CI/CD:

```batch
# Windows: One-time commit and push
auto-commit.bat

# Windows: Continuous file watcher
auto-commit-watcher.bat

# Linux/Mac: One-time commit and push
./auto-commit.sh
```

See `AUTO-COMMIT-README.md` for detailed usage instructions.

### Manual Deployment

```bash
# Deploy client to Firebase
cd client && firebase deploy --only hosting

# Deploy server/ML services via Railway dashboard
# Or use the deployment scripts
```

### Environment Configuration

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🧪 Testing

### Comprehensive Test Suite

The application includes a complete testing suite covering all aspects of production readiness:

- **Unit Tests**: 32/32 server tests, 9/9 ML service tests, 58/71 client tests
- **E2E Tests**: 30/30 Cypress tests covering user journeys
- **Integration Tests**: Cross-service communication testing (Client ↔ Server ↔ ML Service)
- **Load Testing**: k6 performance testing with 100-200 concurrent users

### Run Tests

```bash
# All tests (unit, integration, E2E)
npm test

# Load testing (requires running services)
npm run test:load

# Integration tests only
npm run test:integration

# Client tests only
cd client && npm test

# Server tests only
cd server && npm test

# ML Service tests only
cd ml-service && python -m pytest
```

### Load Testing

Performance testing with k6 framework:

```bash
# Install k6 (one-time)
npm install -g k6

# Run load tests
npm run test:load

# Load test scenarios:
# - User registration and authentication
# - Dashboard access and navigation
# - ML service integration
# - Concurrent user simulation (100→200 users)
```

### Integration Testing

Cross-service testing framework:

```bash
# Run integration tests
npm run test:integration

# Tests include:
# - Service health checks
# - Authentication flows
# - ML service integration
# - End-to-end user journeys
# - Error handling scenarios
```

### CI/CD Pipeline

The project uses comprehensive CI/CD with GitHub Actions:

- **Automated Testing**: All services tested on every push
- **Load Testing**: Performance benchmarks with regression detection
- **Integration Testing**: Cross-service communication validation
- **Security Scanning**: Regular vulnerability assessments
- **Performance Monitoring**: Lighthouse audits and k6 load testing
- **Code Quality**: Linting and formatting checks
- **Dependency Updates**: Automated security patches

See `LOAD_INTEGRATION_TESTING.md` for detailed testing documentation.

## 📊 Monitoring

### Application Metrics

- **Performance**: Lighthouse scores and Core Web Vitals
- **Security**: Vulnerability scanning and dependency audits
- **Uptime**: Health checks and error monitoring
- **Usage**: Analytics and user engagement metrics

### CI/CD Monitoring

- **Build Status**: GitHub Actions workflow results
- **Test Coverage**: Code coverage reports
- **Security Alerts**: Automated vulnerability notifications
- **Performance Trends**: Historical performance data

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   # Run tests locally
   npm test

   # Lint code
   npm run lint
   ```

3. **Create pull request**
   - All CI checks must pass
   - Code review required
   - Tests must be included

### Code Quality

- **Linting**: ESLint for JavaScript/TypeScript
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest for unit tests, Cypress for E2E

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [CI/CD Documentation](CI-CD_README.md)
- [Load & Integration Testing](LOAD_INTEGRATION_TESTING.md)
- [Database Migration](server/DATABASE_MIGRATION.md)
- [Testing Guide](server/TESTING_README.md)
- [API Documentation](server/README.md)

## 🔒 Security

### Vulnerability Management

- Automated dependency scanning
- Regular security audits
- Immediate patching of critical vulnerabilities
- Security headers and best practices

### Access Control

- Branch protection rules
- Required code reviews
- Environment-specific secrets
- Least privilege access

## 📈 Roadmap

### Upcoming Features

- [ ] Advanced ML models for learning prediction
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with popular DevOps tools

### Technical Improvements

- [x] End-to-end testing with Cypress (30/30 tests completed)
- [x] Load testing with k6 (100-200 concurrent users)
- [x] Integration testing across all services
- [ ] Performance optimization
- [ ] Advanced caching strategies
- [ ] Real-time collaboration features

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Mars-Ultor/devops-roadmap-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mars-Ultor/devops-roadmap-app/discussions)
- **Documentation**: See docs/ directory

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the DevOps community**
# DevOps Roadmap App - Load & Integration Testing Guide

## Overview

This guide covers the load testing and integration testing setup for the DevOps Roadmap App. These tests ensure the application can handle production loads and that all services communicate correctly.

## Test Types

### 1. Load Testing (k6)
- **Purpose**: Test application performance under various user loads
- **Tool**: k6 (modern load testing tool)
- **Coverage**: User registration, authentication, dashboard access, ML service integration

### 2. Integration Testing
- **Purpose**: Test communication between Client, Server, and ML Service
- **Tool**: Node.js with Axios and Chai
- **Coverage**: Service health, authentication flow, ML integration, error handling

## Prerequisites

### For Load Testing
```bash
# Install k6
# Windows (Chocolatey)
choco install k6

# macOS (Homebrew)
brew install k6

# Linux
sudo apt update
sudo apt install k6

# Or download from: https://k6.io/docs/get-started/installation/
```

### For Integration Testing
```bash
# Install dependencies
npm install
```

## Environment Setup

### Required Services Running

Before running tests, ensure all services are running:

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the ML service
cd ml-service
python main.py

# Terminal 3: Start the client (for full integration)
cd client
npm run dev
```

### Environment Variables

Create a `.env.test` file in the root directory:

```bash
# Test environment configuration
SERVER_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173

# Database (use test database)
DATABASE_URL="file:./test.db"

# JWT Secret (use test secret)
JWT_SECRET=test-jwt-secret-key-for-testing-only
```

## Running Tests

### Load Testing

#### Basic Load Test
```bash
# Run load test with default configuration
npm run test:load
```

#### Custom Load Test
```bash
# Run with custom base URL
k6 run -e BASE_URL=http://localhost:3000 load-test.js

# Run with different stages
k6 run --tag test_type=smoke load-test.js
```

#### CI/CD Load Test
```bash
# Run with JSON output for CI/CD integration
npm run test:load:ci

# View results
cat load-test-results.json
```

#### Load Test Scenarios

The load test includes:
1. **Ramp-up Phase**: Gradually increase to 100 users over 2 minutes
2. **Steady Load**: Maintain 100 users for 5 minutes
3. **Stress Test**: Ramp up to 200 users over 2 minutes
4. **Peak Load**: Maintain 200 users for 5 minutes
5. **Cool-down**: Gradually reduce to 0 users

### Integration Testing

#### Run All Integration Tests
```bash
npm run test:integration
```

#### Run Specific Test Components
```bash
# Test only service health
node -e "
const { IntegrationTester } = require('./integration-test');
const tester = new IntegrationTester();
tester.testServiceHealth().then(() => console.log('Health tests passed'));
"

# Test only authentication
node -e "
const { IntegrationTester } = require('./integration-test');
const tester = new IntegrationTester();
tester.testUserRegistration().then(() => tester.testAuthentication()).then(() => console.log('Auth tests passed'));
"
```

## Test Results Interpretation

### Load Test Results

#### Key Metrics
- **http_req_duration**: Response time percentiles
- **http_req_failed**: Error rate percentage
- **vus**: Virtual users active
- **iteration_duration**: Time per test iteration

#### Success Criteria
- **Response Time**: p99 < 1500ms (99% of requests < 1.5s)
- **Error Rate**: < 10% failed requests
- **Throughput**: Consistent request handling

#### Sample Output
```
     ✓ registration successful
     ✓ login successful
     ✓ dashboard access successful
     ✓ training data access successful
     ✓ ML insights request successful

     checks.........................: 100.00% ✓ 1250     ✗ 0
     data_received..................: 1.2 MB  24 kB/s
     data_sent......................: 456 kB  9.1 kB/s
     http_req_blocked...............: avg=1.23ms   min=0s       med=0s      max=45.67ms p(90)=0s      p(95)=0s
     http_req_connecting............: avg=0.45ms   min=0s       med=0s      max=23.45ms p(90)=0s      p(95)=0s
     http_req_duration..............: avg=234.56ms min=45.67ms  med=123.45ms max=1.23s   p(90)=456.78ms p(95)=567.89ms p(99)=789.01ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 1250
     http_req_receiving.............: avg=0.67ms   min=0s       med=0s      max=45.67ms p(90)=1.23ms  p(95)=2.34ms
     http_req_sending...............: avg=0.89ms   min=0s       med=0s      max=23.45ms p(90)=1.23ms  p(95)=2.34ms
     http_req_tls_handling..........: avg=1.23ms   min=0s       med=0s      max=45.67ms p(90)=2.34ms  p(95)=3.45ms
     http_req_waiting...............: avg=233.01ms min=44.44ms  med=122.22ms max=1.22s   p(90)=455.55ms p(95)=566.66ms p(99)=788.88ms
     iteration_duration.............: avg=1.45s    min=1.23s    med=1.34s   max=2.34s   p(90)=1.67s   p(95)=1.78s
     iterations.....................: 1250    25.0/s
     vus............................: 100     min=100    max=100
     vus_max........................: 100     min=100    max=100
```

### Integration Test Results

#### Success Indicators
- ✅ All service health checks pass
- ✅ User registration/authentication works
- ✅ ML service integration functions
- ✅ End-to-end user journey completes
- ✅ Error handling works correctly

#### Sample Output
```
🚀 Starting Integration Tests for DevOps Roadmap App
============================================================

📊 Testing Service Health Checks...
✅ Server health check passed
✅ ML Service health check passed
✅ Client accessibility check passed

👤 Testing User Registration Flow...
✅ User registration successful

🔐 Testing Authentication Flow...
✅ User authentication successful

🤖 Testing ML Service Integration...
✅ ML Service direct access successful
✅ ML Service integration via server successful

🚀 Testing End-to-End User Journey...
✅ Dashboard access successful
✅ Training data access successful
✅ User progress access successful
✅ End-to-end ML insights generation successful

⚠️ Testing Error Handling...
✅ Invalid authentication error handling correct
✅ Invalid ML request error handling correct
✅ Non-existent endpoint error handling correct

============================================================
✅ All integration tests passed!
```

## CI/CD Integration

### GitHub Actions Setup

Add to your `.github/workflows/ci-cd-pipeline.yml`:

```yaml
- name: Run Integration Tests
  run: |
    npm install
    npm run test:integration

- name: Run Load Tests
  run: |
    npm run test:load:ci
  env:
    K6_WEB_DASHBOARD: true
    K6_WEB_DASHBOARD_EXPORT: load-test-results.html
```

### Performance Baselines

Set performance budgets in your CI/CD:

```yaml
# k6 thresholds
thresholds:
  http_req_duration: ['p(95)<500', 'p(99)<1000']
  http_req_failed: ['rate<0.05']

# Integration test timeouts
timeout: 300000  # 5 minutes
```

## Troubleshooting

### Common Issues

#### Load Test Issues
- **High error rates**: Check if services are running and database connections are available
- **Slow response times**: Verify database performance and network latency
- **Memory issues**: Reduce virtual users or increase system resources

#### Integration Test Issues
- **Service not responding**: Ensure all services are started in correct order
- **Authentication failures**: Check JWT configuration and database connectivity
- **ML service timeouts**: Verify ML models are loaded and service is healthy

### Debug Mode

Run tests with verbose output:

```bash
# Load test debug
k6 run --verbose load-test.js

# Integration test debug
DEBUG=* npm run test:integration
```

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current Status |
|--------|--------|----------------|
| Response Time (p95) | < 500ms | ✅ |
| Response Time (p99) | < 1000ms | ✅ |
| Error Rate | < 5% | ✅ |
| Concurrent Users | 200+ | ✅ |
| ML Inference Time | < 2000ms | ✅ |

### Scaling Recommendations

- **Database**: Consider connection pooling for >100 concurrent users
- **ML Service**: Implement request queuing for high load periods
- **Caching**: Add Redis for frequently accessed data
- **CDN**: Implement for static assets at scale

## Maintenance

### Regular Testing Schedule
- **Daily**: Integration tests in CI/CD
- **Weekly**: Full load testing suite
- **Monthly**: Performance regression testing
- **Quarterly**: Scalability testing with increased load

### Test Data Management
- Use dedicated test database
- Clean up test data after runs
- Rotate test user accounts regularly
- Monitor test data growth

## Contributing

When adding new features:
1. Add corresponding integration tests
2. Update load test scenarios if needed
3. Update performance benchmarks
4. Document any new test requirements

## Support

For issues with testing:
1. Check service logs for errors
2. Verify environment configuration
3. Review test output for specific failures
4. Check network connectivity between services
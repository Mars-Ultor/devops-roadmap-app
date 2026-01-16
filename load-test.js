import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 }, // Ramp up to 200 users over 2 minutes
    { duration: '5m', target: 200 }, // Stay at 200 users for 5 minutes
    { duration: '2m', target: 0 },   // Ramp down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests should be below 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
  },
};

// Base URL for the application
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test scenarios
export default function () {
  // Scenario 1: User registration and login
  const registerPayload = {
    email: `testuser_${__VU}_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User'
  };

  let response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(registerPayload), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(response, {
    'registration successful': (r) => r.status === 201 || r.status === 200,
  });

  // Scenario 2: User login
  const loginPayload = {
    email: registerPayload.email,
    password: registerPayload.password
  };

  response = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(loginPayload), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(response, {
    'login successful': (r) => r.status === 200,
  });

  const authToken = response.json()?.token;

  if (authToken) {
    // Scenario 3: Access protected routes
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    // Get user dashboard
    response = http.get(`${BASE_URL}/api/dashboard`, { headers });
    check(response, {
      'dashboard access successful': (r) => r.status === 200,
    });

    // Get training data
    response = http.get(`${BASE_URL}/api/training`, { headers });
    check(response, {
      'training data access successful': (r) => r.status === 200,
    });

    // Scenario 4: ML Service integration
    const mlPayload = {
      userId: 'test-user-id',
      contentId: 'test-content-id',
      currentWeek: 1,
      performanceScore: 0.8,
      timeSpent: 3600,
      hintsUsed: 2,
      errorRate: 0.1,
      studyStreak: 5,
      avgScore: 85,
      completionRate: 0.75,
      struggleTime: 1800,
      topicScores: { 'git_basics': 0.9, 'linux_commands': 0.8 },
      attemptCounts: { 'git_basics': 3, 'linux_commands': 2 },
      timeSpentPerTopic: { 'git_basics': 1800, 'linux_commands': 1200 },
      errorPatterns: { 'git_basics': 1, 'linux_commands': 0 }
    };

    response = http.post(`${BASE_URL}/api/coach/insights`, JSON.stringify(mlPayload), { headers });
    check(response, {
      'ML insights request successful': (r) => r.status === 200,
    });

    sleep(1); // Wait 1 second between iterations
  }
}

// Setup function - runs before the test starts
export function setup() {
  console.log('Starting load test for DevOps Roadmap App');
  console.log(`Target URL: ${BASE_URL}`);

  // Health check
  const response = http.get(`${BASE_URL}/api/health`);
  if (response.status !== 200) {
    console.error(`Health check failed: ${response.status}`);
    return;
  }

  console.log('Health check passed - starting load test');
}

// Teardown function - runs after the test completes
export function teardown(data) {
  console.log('Load test completed');
}
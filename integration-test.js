#!/usr/bin/env node

/**
 * DevOps Roadmap App - Integration Tests
 * Tests communication between Client, Server, and ML Service
 */

const axios = require('axios');
const { expect } = require('chai');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

class IntegrationTester {
  constructor() {
    this.server = axios.create({
      baseURL: SERVER_URL,
      timeout: 10000,
    });

    this.mlService = axios.create({
      baseURL: ML_SERVICE_URL,
      timeout: 10000,
    });

    this.client = axios.create({
      baseURL: CLIENT_URL,
      timeout: 10000,
    });

    this.testUser = null;
    this.authToken = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Integration Tests for DevOps Roadmap App');
    console.log('=' .repeat(60));

    try {
      // Test 1: Service Health Checks
      await this.testServiceHealth();

      // Test 2: User Registration Flow
      await this.testUserRegistration();

      // Test 3: Authentication Flow
      await this.testAuthentication();

      // Test 4: ML Service Integration
      await this.testMLServiceIntegration();

      // Test 5: End-to-End User Journey
      await this.testEndToEndUserJourney();

      // Test 6: Error Handling
      await this.testErrorHandling();

      console.log('=' .repeat(60));
      console.log('✅ All integration tests passed!');

    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      process.exit(1);
    }
  }

  async testServiceHealth() {
    console.log('\n📊 Testing Service Health Checks...');

    // Test Server Health
    try {
      const serverResponse = await this.server.get('/api/health');
      expect(serverResponse.status).to.equal(200);
      expect(serverResponse.data).to.have.property('status', 'healthy');
      console.log('✅ Server health check passed');
    } catch (error) {
      throw new Error(`Server health check failed: ${error.message}`);
    }

    // Test ML Service Health
    try {
      const mlResponse = await this.mlService.get('/health');
      expect(mlResponse.status).to.equal(200);
      expect(mlResponse.data).to.have.property('status', 'healthy');
      console.log('✅ ML Service health check passed');
    } catch (error) {
      throw new Error(`ML Service health check failed: ${error.message}`);
    }

    // Test Client Accessibility (basic HTML response)
    try {
      const clientResponse = await this.client.get('/');
      expect(clientResponse.status).to.equal(200);
      expect(clientResponse.headers['content-type']).to.include('text/html');
      console.log('✅ Client accessibility check passed');
    } catch (error) {
      console.log('⚠️ Client accessibility check failed (expected in development)');
    }
  }

  async testUserRegistration() {
    console.log('\n👤 Testing User Registration Flow...');

    const testEmail = `integration-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Integration Test User';

    try {
      const response = await this.server.post('/api/auth/register', {
        email: testEmail,
        password: testPassword,
        name: testName
      });

      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('user');
      expect(response.data.user).to.have.property('email', testEmail);
      expect(response.data.user).to.have.property('name', testName);

      this.testUser = response.data.user;
      console.log('✅ User registration successful');

    } catch (error) {
      throw new Error(`User registration failed: ${error.message}`);
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication Flow...');

    if (!this.testUser) {
      throw new Error('No test user available for authentication test');
    }

    try {
      const response = await this.server.post('/api/auth/login', {
        email: this.testUser.email,
        password: 'TestPassword123!'
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('token');
      expect(response.data).to.have.property('user');

      this.authToken = response.data.token;
      console.log('✅ User authentication successful');

    } catch (error) {
      throw new Error(`User authentication failed: ${error.message}`);
    }
  }

  async testMLServiceIntegration() {
    console.log('\n🤖 Testing ML Service Integration...');

    // Test ML Service Direct Access
    try {
      const response = await this.mlService.get('/models');
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('models');
      expect(Array.isArray(response.data.models)).to.be.true;
      console.log('✅ ML Service direct access successful');
    } catch (error) {
      throw new Error(`ML Service direct access failed: ${error.message}`);
    }

    // Test ML Service via Server Proxy
    if (this.authToken) {
      try {
        const response = await this.server.post('/api/coach/insights', {
          userId: this.testUser.id,
          contentId: 'test-content',
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
        }, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('learningStyle');
        expect(response.data).to.have.property('skillGaps');
        expect(response.data).to.have.property('optimalPath');
        expect(response.data).to.have.property('performancePrediction');
        expect(response.data).to.have.property('motivationalProfile');

        console.log('✅ ML Service integration via server successful');

      } catch (error) {
        throw new Error(`ML Service integration via server failed: ${error.message}`);
      }
    }
  }

  async testEndToEndUserJourney() {
    console.log('\n🚀 Testing End-to-End User Journey...');

    if (!this.authToken) {
      throw new Error('No auth token available for end-to-end test');
    }

    try {
      // Step 1: Get user dashboard
      const dashboardResponse = await this.server.get('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      expect(dashboardResponse.status).to.equal(200);
      console.log('✅ Dashboard access successful');

      // Step 2: Get training data
      const trainingResponse = await this.server.get('/api/training', {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      expect(trainingResponse.status).to.equal(200);
      console.log('✅ Training data access successful');

      // Step 3: Get user progress
      const progressResponse = await this.server.get('/api/progress', {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      expect(progressResponse.status).to.be.oneOf([200, 404]); // 404 is acceptable if no progress yet
      console.log('✅ User progress access successful');

      // Step 4: Test ML insights generation
      const insightsResponse = await this.server.post('/api/coach/insights', {
        userId: this.testUser.id,
        contentId: 'integration-test',
        currentWeek: 2,
        performanceScore: 0.85,
        timeSpent: 7200,
        hintsUsed: 1,
        errorRate: 0.05,
        studyStreak: 7,
        avgScore: 90,
        completionRate: 0.8,
        struggleTime: 1200,
        topicScores: { 'docker_fundamentals': 0.95, 'kubernetes_basics': 0.85 },
        attemptCounts: { 'docker_fundamentals': 5, 'kubernetes_basics': 3 },
        timeSpentPerTopic: { 'docker_fundamentals': 3600, 'kubernetes_basics': 2400 },
        errorPatterns: { 'docker_fundamentals': 0, 'kubernetes_basics': 1 }
      }, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      expect(insightsResponse.status).to.equal(200);
      expect(insightsResponse.data).to.have.property('learningStyle');
      expect(insightsResponse.data).to.have.property('skillGaps');
      expect(insightsResponse.data).to.have.property('optimalPath');
      console.log('✅ End-to-end ML insights generation successful');

    } catch (error) {
      throw new Error(`End-to-end user journey failed: ${error.message}`);
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');

    // Test invalid authentication
    try {
      await this.server.get('/api/dashboard', {
        headers: { 'Authorization': 'Bearer invalid-token' }
      });
      throw new Error('Expected authentication error but request succeeded');
    } catch (error) {
      expect(error.response.status).to.equal(401);
      console.log('✅ Invalid authentication error handling correct');
    }

    // Test invalid ML request
    if (this.authToken) {
      try {
        await this.server.post('/api/coach/insights', {
          invalidField: 'test'
        }, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        throw new Error('Expected validation error but request succeeded');
      } catch (error) {
        expect(error.response.status).to.be.oneOf([400, 422]);
        console.log('✅ Invalid ML request error handling correct');
      }
    }

    // Test non-existent endpoint
    try {
      await this.server.get('/api/non-existent-endpoint');
      throw new Error('Expected 404 error but request succeeded');
    } catch (error) {
      expect(error.response.status).to.equal(404);
      console.log('✅ Non-existent endpoint error handling correct');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = IntegrationTester;
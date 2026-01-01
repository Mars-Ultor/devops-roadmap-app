# DevOps Roadmap App - Live Deployment Configuration

This document outlines the deployment strategy for the full-stack DevOps Roadmap App.

## Architecture Overview

The application consists of three main services:
1. **Client** - React/Vite frontend (Firebase Hosting)
2. **Server** - Node.js/Express API with Prisma (Railway)
3. **ML Service** - Python ML models (Railway)

## Deployment Strategy

### 1. Client Deployment (Firebase Hosting)

**Status:** ✅ Already configured
**URL:** https://my-devops-journey-d3a08.web.app

**Build Process:**
```bash
cd client
npm ci
npm run build
firebase deploy --only hosting
```

### 2. Server Deployment (Railway)

**Status:** 🔄 Needs configuration
**URL:** To be determined

**Requirements:**
- Node.js runtime
- PostgreSQL database (for production)
- Environment variables configuration

### 3. ML Service Deployment (Railway)

**Status:** 🔄 Needs configuration
**URL:** To be determined

**Requirements:**
- Python runtime
- Model files and dependencies
- Environment variables for API keys

## Environment Variables

### Server (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV="production"
```

### ML Service (.env)
```env
OPENAI_API_KEY="your-key"
MODEL_PATH="./models"
PORT=8000
```

### Client (.env.production)
```env
VITE_API_URL="https://your-server-url"
VITE_ML_API_URL="https://your-ml-service-url"
```

## Deployment Steps

### Step 1: Deploy Server to Railway

1. Create Railway account
2. Connect GitHub repository
3. Configure PostgreSQL database
4. Set environment variables
5. Deploy

### Step 2: Deploy ML Service to Railway

1. Create separate Railway service
2. Configure Python runtime
3. Set environment variables
4. Deploy models

### Step 3: Update Client Configuration

1. Update API URLs in client
2. Redeploy client to Firebase

### Step 4: Database Migration

1. Run Prisma migrations on production database
2. Seed initial data if needed

## Monitoring & Maintenance

- Set up error tracking (Sentry)
- Configure logging (Railway logs)
- Set up monitoring (UptimeRobot)
- Configure backups (Railway automated)

## Rollback Strategy

- Keep previous deployments available
- Use Railway's rollback feature
- Maintain database backups
- Test deployments in staging first
# Quick Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **Railway CLI**: `npm install -g @railway/cli`
3. **Firebase CLI**: `npm install -g firebase-tools`

## One-Command Deployment

```bash
# Deploy everything
./deploy.sh

# Or with PowerShell
.\deploy.ps1
```

## Selective Deployment

```bash
# Deploy only client
./deploy.sh --skip-server --skip-ml

# Deploy only backend services
./deploy.sh --skip-client

# Deploy only ML service
./deploy.sh --skip-client --skip-server
```

## Manual Deployment Steps

### 1. Deploy Client to Firebase
```bash
cd client
npm ci
npm run build
firebase deploy --only hosting
```

### 2. Deploy Server to Railway
```bash
cd server
railway login
railway deploy
```

### 3. Deploy ML Service to Railway
```bash
cd ml-service
railway deploy
```

### 4. Update Client Configuration
Update `client/.env.production` with the deployed service URLs, then redeploy client.

## Environment Setup

1. Copy `.env.example` files to `.env` in each service directory
2. Fill in your API keys and database URLs
3. Set environment variables in Railway dashboard

## URLs After Deployment

- **Client**: https://my-devops-journey-d3a08.web.app
- **Server**: Check Railway dashboard
- **ML Service**: Check Railway dashboard
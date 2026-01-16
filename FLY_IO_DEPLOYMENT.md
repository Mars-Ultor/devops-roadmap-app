# Fly.io Deployment Setup for DevOps Roadmap App

## 🚀 Quick Deploy to Fly.io

### Prerequisites
1. **Install Fly CLI:**
   ```bash
   # Windows PowerShell
   curl -L https://fly.io/install.sh | sh
   # Or download from: https://fly.io/docs/getting-started/installing-flyctl/
   ```

2. **Sign up/Login:**
   ```bash
   fly auth signup
   # Or: fly auth login
   ```

### Deploy Server
```bash
cd server
fly launch --name devops-server
# Follow prompts, accept defaults
```

### Deploy ML Service
```bash
cd ../ml-service
fly launch --name devops-ml-service
# Follow prompts, accept defaults
```

### Update Client Configuration
After deployment, update `client/.env.production` with your Fly.io URLs:

```bash
# Get your URLs
fly apps list

# Update client/.env.production
VITE_API_URL="https://devops-server.fly.dev"
VITE_ML_API_URL="https://devops-ml-service.fly.dev"
```

### Redeploy Client
```bash
cd client
firebase deploy --only hosting
```

## 📊 Fly.io Free Tier Benefits

- ✅ **Always-on** (no hourly limits)
- ✅ **Global deployment** (30+ regions)
- ✅ **256MB RAM** per service
- ✅ **3GB persistent storage**
- ✅ **Free SSL certificates**

## 🔧 Configuration Files Created

- ✅ `server/fly.toml` - Server deployment config
- ✅ `ml-service/fly.toml` - ML service deployment config

## 🌐 URLs After Deployment

- **Server:** `https://devops-server.fly.dev`
- **ML Service:** `https://devops-ml-service.fly.dev`
- **Client:** `https://my-devops-journey-d3a08.web.app` (unchanged)

## 🛠️ Troubleshooting

**If deployment fails:**
```bash
# Check app status
fly status

# View logs
fly logs

# Restart app
fly restart
```

**Scale up if needed:**
```bash
fly scale memory 512  # Upgrade to 512MB RAM
```

Ready to deploy? Run the commands above! 🚀
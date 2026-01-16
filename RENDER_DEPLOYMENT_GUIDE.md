# 🚀 Render Deployment Guide

## Prerequisites
1. **GitHub Account** - Required for automatic deployments
2. **Render Account** - Sign up at [render.com](https://render.com) (free, no credit card required)

## Step 1: Connect Your Repository
1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New" → "Blueprint"
3. Connect your GitHub repository: `your-username/devops-roadmap-app`
4. Render will automatically detect the `render.yaml` file

## Step 2: Deploy Services
Render will create all services automatically:
- ✅ **PostgreSQL Database** (devops-db)
- ✅ **Redis Cache** (devops-redis)
- ✅ **Node.js Server** (devops-server)
- ✅ **Python ML Service** (devops-ml-service)

## Step 3: Environment Setup
After deployment, note the service URLs:
- Server: `https://devops-server.onrender.com`
- ML Service: `https://devops-ml-service.onrender.com`

## Step 4: Update Client Configuration
Update `client/.env.production` with your actual URLs:

```bash
# Replace these with your actual Render service URLs
VITE_API_URL="https://your-server-name.onrender.com"
VITE_ML_API_URL="https://your-ml-service-name.onrender.com"
```

## Step 5: Deploy Client
1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your repository again
3. Configure:
   - **Name**: `devops-client`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Environment**: Production

## Step 6: Database Migration
After services are deployed, run database setup:

```bash
# Connect to your Render server via SSH or use Render's shell
cd server
npm run db:setup
```

## Step 7: Verify Deployment
1. **Test Server**: Visit `https://your-server-name.onrender.com/health`
2. **Test ML Service**: Visit `https://your-ml-service-name.onrender.com/health`
3. **Test Client**: Visit your static site URL

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failures**: Check logs in Render dashboard
2. **Database Connection**: Ensure DATABASE_URL is set correctly
3. **Redis Connection**: Verify REDIS_URL is configured
4. **Port Issues**: Services run on port 10000 by default

### Free Tier Limits:
- **750 hours/month** across all services
- **512MB RAM** per service
- **Database**: 256MB free storage
- **Redis**: 30MB free storage

## 📊 Monitoring
- View logs in Render dashboard
- Monitor usage to stay within free limits
- Set up alerts for service downtime

## 🚀 Going Live
Once everything is working:
1. Update your domain DNS (optional)
2. Share your client URL with users
3. Monitor performance and usage

## 💰 Cost Optimization
- Services sleep after 15 minutes of inactivity
- Monitor your usage in the Render dashboard
- Upgrade to paid plans when needed

---
**Need Help?** Check Render's documentation or their Discord community!
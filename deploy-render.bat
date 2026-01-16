@echo off
echo 🚀 Render Deployment Helper for DevOps Roadmap App
echo ===================================================

echo.
echo 📋 Prerequisites Check:
echo 1. GitHub repository pushed with latest code
echo 2. Render account created at https://render.com
echo 3. Repository connected to Render
echo.

echo 🔧 Step 1: Deploy Infrastructure (Database + Redis + Services)
echo -------------------------------------------------------------
echo Go to https://render.com and:
echo • Click "New" → "Blueprint"
echo • Connect your GitHub repo: your-username/devops-roadmap-app
echo • Render will auto-detect render.yaml and create all services
echo.

echo ⏳ Step 2: Wait for Deployment
echo -----------------------------
echo Wait 5-10 minutes for all services to deploy:
echo • PostgreSQL Database (devops-db)
echo • Redis Cache (devops-redis)
echo • Node.js Server (devops-server)
echo • Python ML Service (devops-ml-service)
echo.

echo 🔗 Step 3: Get Service URLs
echo --------------------------
echo After deployment, note these URLs from Render dashboard:
echo • Server URL: https://devops-server.onrender.com
echo • ML Service URL: https://devops-ml-service.onrender.com
echo.

echo ⚙️ Step 4: Update Client Environment
echo -----------------------------------
echo Update client/.env.production with your actual URLs:
echo.
echo VITE_API_URL="https://your-server-name.onrender.com"
echo VITE_ML_API_URL="https://your-ml-service-name.onrender.com"
echo.

echo 🌐 Step 5: Deploy Client
echo -----------------------
echo In Render dashboard:
echo • Click "New" → "Static Site"
echo • Connect your repo again
echo • Build Command: cd client && npm install && npm run build
echo • Publish Directory: client/dist
echo.

echo 🗄️ Step 6: Setup Database
echo ------------------------
echo After all services are running:
echo • Go to server service in Render
echo • Open Shell or SSH
echo • Run: cd server && npm run db:setup
echo.

echo ✅ Step 7: Verify Deployment
echo ---------------------------
echo Test these endpoints:
echo • Server Health: https://your-server/health
echo • ML Health: https://your-ml-service/health
echo • Client: Your static site URL
echo.

echo 📊 Step 8: Monitor Usage
echo -----------------------
echo • Check Render dashboard for usage
echo • Free tier: 750 hours/month total
echo • Services sleep after 15min inactivity
echo.

echo 🎉 Deployment Complete!
echo =====================
echo Your app is now live on Render with Redis caching! 🚀
echo.

pause
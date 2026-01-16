@echo off
echo 🚀 Render Client Deployment Setup
echo ================================

echo.
echo 📋 Current Status: Server, ML Service, and Database are deployed
echo.

echo 🔧 Step 1: Update Client Environment Variables
echo -----------------------------------------------
echo You need to update client/.env.production with your actual Render URLs:
echo.
echo Current placeholders:
echo VITE_API_URL="https://devops-server.onrender.com"
echo VITE_ML_API_URL="https://devops-ml-service.onrender.com"
echo.
echo Replace with your actual service URLs from Render dashboard
echo.

set /p SERVER_URL="Enter your Render Server URL (e.g., https://your-server-name.onrender.com): "
set /p ML_URL="Enter your Render ML Service URL (e.g., https://your-ml-service-name.onrender.com): "

echo.
echo Updating client/.env.production...
echo VITE_API_URL="%SERVER_URL%"> client\.env.production.tmp
echo VITE_ML_API_URL="%ML_URL%">> client\.env.production.tmp
echo.>> client\.env.production.tmp

REM Append the rest of the file
for /f "skip=3 delims=" %%i in (client\.env.production) do echo %%i>> client\.env.production.tmp

move /y client\.env.production.tmp client\.env.production

echo ✅ Client environment updated!
echo.

echo 🌐 Step 2: Deploy Client to Render
echo ---------------------------------
echo In Render Dashboard:
echo 1. Click "New" → "Static Site"
echo 2. Connect your GitHub repository again
echo 3. Configure:
echo    • Name: devops-client
echo    • Build Command: cd client ^&^& npm install ^&^& npm run build
echo    • Publish Directory: client/dist
echo    • Environment: Production
echo.

echo 🗄️ Step 3: Database Setup
echo ------------------------
echo After client deploys, set up your database:
echo 1. Go to your server service in Render dashboard
echo 2. Open "Shell" tab
echo 3. Run: cd server ^&^& npm run db:setup
echo.

echo ✅ Step 4: Verify Everything Works
echo ----------------------------------
echo Test these endpoints:
echo • Server Health: %SERVER_URL%/health
echo • ML Health: %ML_URL%/health
echo • Client: Your new static site URL
echo.

echo 🎉 Deployment Complete!
echo =====================
echo Your full-stack app with Redis caching is now live on Render!
echo.

pause
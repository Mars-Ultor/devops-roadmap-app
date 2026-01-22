@echo off
echo 🔧 Render Cleanup Helper
echo =======================

echo.
echo This script will help you clean up your Render deployment.
echo.

echo 📋 Steps to completely disconnect Render:
echo ----------------------------------------
echo 1. Go to https://dashboard.render.com/
echo 2. For each service (devops-server, devops-ml-service, devops-db, devops-redis):
echo    - Click on the service
echo    - Go to Settings tab
echo    - Click "Delete" at the bottom
echo.

echo 🔗 Disconnect GitHub webhook:
echo ----------------------------
echo 1. Go to https://github.com/Mars-Ultor/devops-roadmap-app/settings/hooks
echo 2. Look for any webhook pointing to render.com
echo 3. Click the "..." menu and select "Delete"
echo.

echo 📁 Remove Render files (optional):
echo ---------------------------------
echo After confirming everything is deleted from Render dashboard,
echo you can remove these files if you no longer need Render:
echo - render.yaml
echo - deploy-render.bat
echo - RENDER_DEPLOYMENT_GUIDE.md
echo - RENDER_STATUS.md
echo.

echo ✅ Verification:
echo ---------------
echo After cleanup, your builds should stop triggering on Render.
echo Only Fly.io deployments will continue.
echo.

pause
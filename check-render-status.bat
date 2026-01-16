@echo off
echo 📊 Render Usage Monitor
echo =====================

echo.
echo 🔍 Checking Render Service Status...
echo.

echo 🖥️ Server Status:
curl -s https://devops-roadmap-server.onrender.com/api/health | findstr /C:"status" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server: Running
) else (
    echo ⚠️ Server: Sleeping or unreachable
)

echo.
echo 🤖 ML Service Status:
curl -s https://devops-ml-service.onrender.com/health | findstr /C:"status" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ ML Service: Running
) else (
    echo ⚠️ ML Service: Sleeping or unreachable
)

echo.
echo 📋 Usage Monitoring Tips:
echo ========================
echo • Check Render Dashboard: https://render.com
echo • Monitor "Usage" tab for hours remaining
echo • Free tier: 750 hours/month total
echo • Services sleep after 15min inactivity
echo.

echo 💡 Prevention:
echo =============
echo • Monitor usage weekly
echo • Upgrade to paid tier (~$7/month) when needed
echo • Wait for monthly reset (1st of each month)
echo.

echo 🔄 Current Status:
echo =================
echo Your app is working! Services may sleep to save hours.
echo First request after sleep takes 30-60 seconds.
echo.

pause
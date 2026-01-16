@echo off
echo 🔍 Testing Deployed Render Services
echo ===================================

echo.
echo 🧪 Testing Server Health...
echo --------------------------
curl -s https://devops-roadmap-server.onrender.com/health
if %errorlevel% equ 0 (
    echo.
    echo ✅ Server is responding!
) else (
    echo.
    echo ❌ Server not responding - check Render logs
)
echo.

echo 🧪 Testing ML Service Health...
echo -----------------------------
curl -s https://devops-ml-service.onrender.com/health
if %errorlevel% equ 0 (
    echo.
    echo ✅ ML Service is responding!
) else (
    echo.
    echo ❌ ML Service not responding - check Render logs
)
echo.

echo 📋 Next Steps if Tests Pass:
echo ---------------------------
echo 1. Deploy client static site (if not done)
echo 2. Run database setup: cd server ^&^& npm run db:setup
echo 3. Test full app at your client URL
echo.

echo 🆘 If Tests Fail:
echo ----------------
echo 1. Check Render service logs for errors
echo 2. Verify environment variables are set
echo 3. Check database and Redis connections
echo 4. Ensure build commands completed successfully
echo.

echo 💡 Common Issues:
echo ----------------
echo • Services might be sleeping (normal for free tier)
echo • First request may take longer to wake up
echo • Check DATABASE_URL and REDIS_URL in service settings
echo.

echo 🎯 Your App URLs:
echo ================
echo • Server API: https://devops-roadmap-server.onrender.com
echo • ML Service: https://devops-ml-service.onrender.com
echo • Client: [Your static site URL from Render]
echo.

pause
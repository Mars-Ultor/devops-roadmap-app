@echo off
echo 🔍 Testing Render Deployment
echo ============================

echo.
echo 📋 Testing Checklist:
echo.

echo 1. Testing Server Health...
curl -s "%~1/health" > server_response.txt 2>nul
if %errorlevel% equ 0 (
    echo ✅ Server is responding
    type server_response.txt
) else (
    echo ❌ Server not responding - check Render logs
)
echo.

echo 2. Testing ML Service Health...
curl -s "%~2/health" > ml_response.txt 2>nul
if %errorlevel% equ 0 (
    echo ✅ ML Service is responding
    type ml_response.txt
) else (
    echo ❌ ML Service not responding - check Render logs
)
echo.

echo 3. Testing Database Connection...
echo   (This will be tested when you run db:setup)
echo.

echo 4. Testing Redis Connection...
echo   (This will be tested when services start up)
echo.

echo 📊 Next Steps:
echo -------------
echo If services are responding:
echo 1. Run database setup: cd server && npm run db:setup
echo 2. Deploy client static site
echo 3. Test full app functionality
echo.

echo If services are NOT responding:
echo 1. Check Render service logs
echo 2. Verify environment variables
echo 3. Check build/startup commands
echo.

echo 🆘 Common Issues:
echo ----------------
echo • DATABASE_URL not set → Check Render database connection
echo • REDIS_URL not set → Check Redis service connection
echo • Port conflicts → Services use port 10000
echo • Build failures → Check npm/pip install logs
echo.

del server_response.txt ml_response.txt 2>nul

pause
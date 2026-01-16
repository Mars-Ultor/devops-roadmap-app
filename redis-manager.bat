@echo off
REM Redis Manager Script for DevOps Roadmap App
REM This script helps manage Redis server for development

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="restart" goto restart

echo Usage: redis-manager.bat [start^|stop^|status^|restart]
echo.
echo Commands:
echo   start   - Start Redis server
echo   stop    - Stop Redis server
echo   status  - Check Redis status
echo   restart - Restart Redis server
goto end

:start
echo Starting Redis server...
cd "%USERPROFILE%\redis"
start "Redis Server" cmd /c "redis-server.exe && pause"
echo Redis server started in background window
goto end

:stop
echo Stopping Redis server...
taskkill /f /im redis-server.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Redis server stopped
) else (
    echo ℹ️  Redis server was not running
)
goto end

:status
echo Checking Redis status...
cd "%USERPROFILE%\redis"
redis-cli.exe ping >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis server is running
) else (
    echo ❌ Redis server is not running
)
goto end

:restart
echo Restarting Redis server...
call :stop
timeout /t 2 /nobreak >nul
call :start
goto end

:end
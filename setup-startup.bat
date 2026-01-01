@echo off
REM Setup Auto-Commit Watcher for Windows Startup
REM This script creates a Task Scheduler task to run the watcher on startup

echo 🤖 Setting up DevOps Auto-Commit Watcher for startup...
echo.

set "TASK_NAME=DevOps Auto-Commit Watcher"
set "SCRIPT_PATH=C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat"

REM Check if script exists
if not exist "%SCRIPT_PATH%" (
    echo ❌ Error: startup-watcher.bat not found at %SCRIPT_PATH%
    echo Please ensure the script is in the correct location.
    pause
    exit /b 1
)

REM Check if task already exists and remove it
schtasks /query /tn "%TASK_NAME%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Removing existing task...
    schtasks /delete /tn "%TASK_NAME%" /f >nul
)

REM Create new task
echo 📝 Creating scheduled task...
schtasks /create /tn "%TASK_NAME%" /tr "cmd /c \"%SCRIPT_PATH%\"" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo ✅ Task created successfully!
    echo.
    echo 📋 Task Details:
    echo    Name: %TASK_NAME%
    echo    Triggers: At user logon
    echo    Action: Runs %SCRIPT_PATH%
    echo.
    echo 🔧 To manage the task:
    echo    1. Open Task Scheduler (search for 'Task Scheduler')
    echo    2. Go to Task Scheduler Library
    echo    3. Find '%TASK_NAME%'
    echo    4. Right-click to modify/disable/delete
    echo.
    echo 🛑 To stop the watcher on startup:
    echo    - Disable the task in Task Scheduler
    echo    - Or delete the task
    echo.
    echo 🎉 Setup complete! The watcher will start automatically when you log in.
) else (
    echo ❌ Failed to create task. Please run as Administrator.
    echo.
    echo 💡 Try running this script as Administrator:
    echo    Right-click setup-startup.bat ^> Run as administrator
)

pause
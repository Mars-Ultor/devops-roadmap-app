@echo off
REM DevOps Auto-Commit Watcher Startup Script
REM This script is designed to run from Windows Task Scheduler

echo Starting DevOps Auto-Commit Watcher...
echo %DATE% %TIME%

REM Change to the project directory
cd /d "C:\Users\ayode\Desktop\devops-roadmap-app"

REM Check if we're in the right directory
if not exist "auto-commit-watcher.bat" (
    echo ERROR: auto-commit-watcher.bat not found in current directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Start the watcher
echo Launching auto-commit watcher...
call auto-commit-watcher.bat

REM This point should never be reached unless watcher exits
echo Watcher exited unexpectedly
pause
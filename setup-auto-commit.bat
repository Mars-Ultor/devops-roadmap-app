@echo off
REM DevOps Roadmap App - Auto-Commit Setup Script (Windows)
REM This script helps set up automatic GitHub pushes

echo 🤖 DevOps Roadmap App - Auto-Commit Setup
echo =========================================

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist ".github" (
    echo ❌ Error: .github directory not found
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Test git connection
echo 🔍 Testing Git connection...
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Warning: No git remote configured
) else (
    echo ✅ Git remote configured
)

REM Check current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📋 Current branch: %CURRENT_BRANCH%

REM Show available options
echo.
echo 🚀 Available Auto-Commit Options:
echo ==================================
echo.
echo 1. One-time commit and push:
echo    auto-commit.bat
echo.
echo 2. Continuous file watcher:
echo    auto-commit-watcher.bat
echo.
echo 3. GitHub Actions (manual trigger):
echo    Visit: https://github.com/Mars-Ultor/devops-roadmap-app/actions
echo    Run: 'Auto Commit' workflow
echo.
echo 4. Scheduled commits (advanced):
echo    Set up Windows Task Scheduler
echo.

REM Offer to run a test commit
set /p response="🧪 Would you like to run a test commit? (y/N): "
if /i "%response%"=="y" (
    echo 📝 Running test commit...
    if exist "auto-commit.bat" (
        call auto-commit.bat "%CURRENT_BRANCH%" "Test auto-commit: %date% %time%"
    ) else (
        echo ❌ auto-commit.bat not found
        pause
        exit /b 1
    )
)

echo.
echo 🎉 Setup complete!
echo.
echo 📖 For detailed instructions, see:
echo    - AUTO-COMMIT-README.md
echo    - README.md (Deployment section)
echo.
echo 🔗 Your CI/CD pipeline will trigger automatically on every push!
echo    Monitor: https://github.com/Mars-Ultor/devops-roadmap-app/actions
echo.
pause
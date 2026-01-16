@echo off
REM Auto-commit and push script for DevOps Roadmap App (Windows)
REM This script automatically commits and pushes changes to GitHub

setlocal enabledelayedexpansion

REM Configuration
set "REPO_PATH=%~dp0"
set "BRANCH=%~1"
if "%BRANCH%"=="" set "BRANCH=master"
set "COMMIT_MESSAGE=%~2"
if "%COMMIT_MESSAGE%"=="" set "COMMIT_MESSAGE=Auto-commit: %date% %time%"

echo 🤖 Auto-commit script starting...
echo Repository: %REPO_PATH%
echo Branch: %BRANCH%
echo Commit message: %COMMIT_MESSAGE%

REM Check if we're in a git repository
cd /d "%REPO_PATH%"
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not a git repository
    exit /b 1
)

REM Check if there are any changes to commit
git diff --quiet >nul 2>&1
set "HAS_CHANGES=%errorlevel%"
git diff --staged --quiet >nul 2>&1
set "HAS_STAGED=%errorlevel%"

if %HAS_CHANGES% equ 0 if %HAS_STAGED% equ 0 (
    echo ℹ️  No changes to commit
    exit /b 0
)

echo 📝 Committing changes...

REM Add all changes
git add .

REM Commit with the provided message
git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 (
    echo ❌ Failed to commit changes
    exit /b 1
) else (
    echo ✅ Changes committed successfully
)

REM Push to the specified branch
echo 🚀 Pushing to %BRANCH%...
git push origin "%BRANCH%"
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo 💡 Check your git credentials and network connection
    exit /b 1
) else (
    echo ✅ Successfully pushed to GitHub
    echo 🔗 Changes will trigger CI/CD pipeline automatically
)

echo 🎉 Auto-commit and push completed!
echo 📊 CI/CD pipeline should start automatically on GitHub
pause
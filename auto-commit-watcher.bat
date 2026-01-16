@echo off
REM Advanced Auto-commit Watcher for DevOps Roadmap App
REM This script watches for file changes and automatically commits/pushes

setlocal enabledelayedexpansion

REM Configuration
set "REPO_PATH=%~dp0"
set "BRANCH=master"
set "WATCH_INTERVAL=60"
set "CONFIG_FILE=auto-commit-config.yml"

echo 🤖 Advanced Auto-commit Watcher starting...
echo Repository: %REPO_PATH%
echo Watch interval: %WATCH_INTERVAL% seconds
echo Press Ctrl+C to stop

cd /d "%REPO_PATH%"

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not a git repository
    exit /b 1
)

REM Get initial file state
echo 📊 Getting initial file state...
for /f %%i in ('git ls-files') do (
    set "file_%%i=!date! !time!"
)

echo ✅ Watcher initialized. Monitoring for changes...

:watch_loop
timeout /t %WATCH_INTERVAL% /nobreak >nul

echo 🔍 Checking for changes...

REM Check for modified files
set "HAS_CHANGES=false"
for /f "tokens=*" %%i in ('git status --porcelain') do (
    set "HAS_CHANGES=true"
    goto :found_changes
)

if "!HAS_CHANGES!"=="false" (
    echo ℹ️  No changes detected
    goto :watch_loop
)

:found_changes
echo 📝 Changes detected! Committing...

REM Generate commit message with timestamp
set "TIMESTAMP=%date% %time%"
set "COMMIT_MESSAGE=Auto-commit: !TIMESTAMP!"

REM Add all changes
git add .

REM Commit with timestamp
git commit -m "!COMMIT_MESSAGE!" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Nothing to commit or commit failed
    goto :watch_loop
)

echo ✅ Changes committed: !COMMIT_MESSAGE!

REM Push to GitHub
echo 🚀 Pushing to %BRANCH%...
git push origin "%BRANCH%" >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo 💡 Check your git credentials
) else (
    echo ✅ Successfully pushed to GitHub
    echo 🔗 CI/CD pipeline triggered automatically
)

echo 🎉 Auto-commit cycle completed
goto :watch_loop
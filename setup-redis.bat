@echo off
REM Redis Setup Script for DevOps Roadmap App (Windows)
REM This script helps set up Redis for caching in development

echo 🚀 Setting up Redis for DevOps Roadmap App...

REM Check if running on Railway (production)
if defined RAILWAY_ENVIRONMENT (
    echo 📦 Railway environment detected

    if "%REDIS_URL%"=="" (
        echo ⚠️  Redis plugin not detected. Please add Redis to your Railway project:
        echo    1. Go to your Railway project dashboard
        echo    2. Click 'Add Plugin'
        echo    3. Search for 'Redis' and add it
        echo    4. The REDIS_URL environment variable will be automatically set
        exit /b 1
    ) else (
        echo ✅ Redis is configured (REDIS_URL found)
        echo 🔗 Redis URL: %REDIS_URL%
    )
) else (
    echo 💻 Local development environment detected

    REM Check if Docker is available
    docker --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo 🐳 Docker detected. Setting up Redis with Docker...

        REM Check if Redis container is already running
        docker ps | findstr redis >nul 2>&1
        if %errorlevel% equ 0 (
            echo ✅ Redis container is already running
        ) else (
            echo 📦 Starting Redis container...
            docker run -d --name devops-redis -p 6379:6379 redis:7-alpine
            if %errorlevel% equ 0 (
                echo ✅ Redis container started on localhost:6379
            ) else (
                echo ❌ Failed to start Redis container
                exit /b 1
            )
        )

        set REDIS_URL=redis://localhost:6379
        echo 🔗 Redis URL: %REDIS_URL%

    ) else (
        echo ⚠️  Docker not found. Please install Docker or Redis manually.
        echo 📦 Download Redis for Windows from: https://redis.io/download
        echo Or install via Chocolatey: choco install redis-64
        exit /b 1
    )
)

echo.
echo 🎉 Redis setup complete!
echo.
echo 📋 Next steps:
echo 1. Update your .env files with: REDIS_URL="%REDIS_URL%"
echo 2. Restart your applications to pick up the Redis configuration
echo 3. Monitor Redis performance with RedisInsight or redis-cli
echo.
echo 📊 Redis will cache:
echo    • User progress data (5 minutes)
echo    • Curriculum content (1 hour)
echo    • ML predictions (15 minutes)
echo    • Coach insights (10 minutes)

pause
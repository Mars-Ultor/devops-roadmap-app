#!/bin/bash
# Redis Setup Script for DevOps Roadmap App
# This script helps set up Redis for caching in development and production

set -e

echo "🚀 Setting up Redis for DevOps Roadmap App..."

# Check if running on Fly.io or Render (production)
if [ -n "$FLY_APP_NAME" ] || [ -n "$RENDER_SERVICE_ID" ]; then
    echo "📦 Fly.io/Render environment detected"

    # Check if Redis is already configured
    if [ -z "$REDIS_URL" ]; then
        echo "⚠️  Redis not detected. Please add Redis to your project:"
        echo "   For Fly.io:"
        echo "   1. Go to your Fly.io project dashboard"
        echo "   2. Click 'Add Machine' or use 'fly redis create'"
        echo "   3. Set REDIS_URL environment variable"
        echo ""
        echo "   For Render:"
        echo "   1. Go to your Render project dashboard"
        echo "   2. Add Redis service"
        echo "   3. Set REDIS_URL environment variable"
        exit 1
    else
        echo "✅ Redis is configured (REDIS_URL found)"
        echo "🔗 Redis URL: $REDIS_URL"
    fi
else
    echo "💻 Local development environment detected"

    # Check if Docker is available
    if command -v docker &> /dev/null; then
        echo "🐳 Docker detected. Setting up Redis with Docker..."

        # Check if Redis container is already running
        if docker ps | grep -q redis; then
            echo "✅ Redis container is already running"
        else
            echo "📦 Starting Redis container..."
            docker run -d \
                --name devops-redis \
                -p 6379:6379 \
                redis:7-alpine

            echo "✅ Redis container started on localhost:6379"
        fi

        # Set REDIS_URL for local development
        export REDIS_URL="redis://localhost:6379"
        echo "🔗 Redis URL: $REDIS_URL"

    elif command -v redis-server &> /dev/null; then
        echo "📦 Native Redis installation detected"

        # Check if Redis is running
        if pgrep -x "redis-server" > /dev/null; then
            echo "✅ Redis server is running"
        else
            echo "🚀 Starting Redis server..."
            redis-server --daemonize yes
            echo "✅ Redis server started"
        fi

        export REDIS_URL="redis://localhost:6379"
        echo "🔗 Redis URL: $REDIS_URL"

    else
        echo "⚠️  No Redis installation found."
        echo "📦 Installing Redis..."

        # Detect OS and install Redis
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get update
                sudo apt-get install -y redis-server
            elif command -v yum &> /dev/null; then
                sudo yum install -y redis
            else
                echo "❌ Unsupported Linux distribution. Please install Redis manually."
                exit 1
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install redis
            else
                echo "❌ Homebrew not found. Please install Redis manually or use Docker."
                exit 1
            fi
        else
            echo "❌ Unsupported OS. Please install Redis manually or use Docker."
            exit 1
        fi

        # Start Redis
        redis-server --daemonize yes
        echo "✅ Redis installed and started"
        export REDIS_URL="redis://localhost:6379"
    fi

    # Test Redis connection
    echo "🧪 Testing Redis connection..."
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping | grep -q "PONG"; then
            echo "✅ Redis connection successful"
        else
            echo "❌ Redis connection failed"
            exit 1
        fi
    fi
fi

echo ""
echo "🎉 Redis setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env files with: REDIS_URL=\"$REDIS_URL\""
echo "2. For Fly.io/Render: Set REDIS_URL in your platform dashboard"
echo "3. Restart your applications to pick up the Redis configuration"
echo "3. Monitor Redis performance with: redis-cli --stat"
echo ""
echo "📊 Redis will cache:"
echo "   • User progress data (5 minutes)"
echo "   • Curriculum content (1 hour)"
echo "   • ML predictions (15 minutes)"
echo "   • Coach insights (10 minutes)"
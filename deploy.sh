#!/bin/bash

# Auto-deploy script for DevOps Roadmap App
# This script builds and deploys all services: Client, Server, and ML Service

set -e

# Parse command line arguments
SKIP_CLIENT=false
SKIP_SERVER=false
SKIP_ML=false
PRODUCTION=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-client) SKIP_CLIENT=true ;;
    --skip-server) SKIP_SERVER=true ;;
    --skip-ml) SKIP_ML=true ;;
    --production) PRODUCTION=true ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

echo "🚀 Starting full deployment process..."
echo "Services to deploy:"
[ "$SKIP_CLIENT" = false ] && echo "  ✅ Client (Firebase Hosting)"
[ "$SKIP_SERVER" = false ] && echo "  ✅ Server (Railway)"
[ "$SKIP_ML" = false ] && echo "  ✅ ML Service (Railway)"

# Function to check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        echo "❌ Railway CLI not found. Please install it first:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
}

# Function to deploy to Railway
deploy_railway() {
    local service_name=$1
    local directory=$2

    echo "🚂 Deploying $service_name to Railway..."

    check_railway_cli

    cd "$directory"

    # Check if already logged in
    if ! railway status &> /dev/null; then
        echo "🔑 Please login to Railway:"
        railway login
    fi

    # Deploy
    railway deploy

    echo "✅ $service_name deployed successfully!"

    cd - > /dev/null
}

# Deploy Client (Firebase)
if [ "$SKIP_CLIENT" = false ]; then
    echo ""
    echo "🌐 Deploying Client to Firebase Hosting..."

    cd "$(dirname "$0")/client"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing client dependencies..."
        npm ci
    fi

    # Build the application
    echo "🔨 Building client application..."
    npm run build

    # Check build output
    if [ ! -d "dist" ]; then
        echo "❌ Client build failed - dist directory not found"
        exit 1
    fi

    echo "✅ Client build complete - Bundle size:"
    du -sh dist/

    # Deploy to Firebase
    echo "🔥 Deploying client to Firebase Hosting..."
    firebase deploy --only hosting

    echo "✅ Client deployment complete!"
    echo "🔗 Client live at: https://my-devops-journey-d3a08.web.app"

    cd "$(dirname "$0")"
fi

# Deploy Server (Railway)
if [ "$SKIP_SERVER" = false ]; then
    echo ""
    echo "🖥️  Deploying Server to Railway..."
    deploy_railway "Server" "$(dirname "$0")/server"
fi

# Deploy ML Service (Railway)
if [ "$SKIP_ML" = false ]; then
    echo ""
    echo "🤖 Deploying ML Service to Railway..."
    deploy_railway "ML Service" "$(dirname "$0")/ml-service"
fi

echo ""
echo "✨ Full deployment complete!"
echo "🔗 Services:"
echo "  🌐 Client: https://my-devops-journey-d3a08.web.app"
[ "$SKIP_SERVER" = false ] && echo "  🖥️  Server: Check Railway dashboard for URL"
[ "$SKIP_ML" = false ] && echo "  🤖 ML Service: Check Railway dashboard for URL"

echo ""
echo "📝 Next steps:"
echo "  1. Update client .env.production with deployed service URLs"
echo "  2. Redeploy client with updated API URLs"
echo "  3. Test all services are communicating properly"

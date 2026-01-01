#!/bin/bash

# Auto-deploy script for DevOps Roadmap App
# This script builds and deploys the application to Firebase Hosting

set -e

echo "🚀 Starting deployment process..."

# Navigate to client directory
cd "$(dirname "$0")/../client"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check build output
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not found"
  exit 1
fi

echo "✅ Build complete - Bundle size:"
du -sh dist/

# Deploy to Firebase
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✨ Deployment complete!"
echo "🔗 Live at: https://my-devops-journey-d3a08.web.app"

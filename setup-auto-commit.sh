#!/bin/bash

# DevOps Roadmap App - Auto-Commit Setup Script
# This script helps set up automatic GitHub pushes

set -e

echo "🤖 DevOps Roadmap App - Auto-Commit Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d ".github" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Make scripts executable
if [ -f "auto-commit.sh" ]; then
    chmod +x auto-commit.sh
    echo "✅ Made auto-commit.sh executable"
fi

# Test git connection
echo "🔍 Testing Git connection..."
if git remote -v | grep -q origin; then
    echo "✅ Git remote configured"
else
    echo "⚠️  Warning: No git remote configured"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# Show available options
echo ""
echo "🚀 Available Auto-Commit Options:"
echo "=================================="
echo ""
echo "1. One-time commit and push:"
echo "   Windows: auto-commit.bat"
echo "   Linux/Mac: ./auto-commit.sh"
echo ""
echo "2. Continuous file watcher:"
echo "   Windows: auto-commit-watcher.bat"
echo ""
echo "3. GitHub Actions (manual trigger):"
echo "   Visit: https://github.com/Mars-Ultor/devops-roadmap-app/actions"
echo "   Run: 'Auto Commit' workflow"
echo ""
echo "4. Scheduled commits (advanced):"
echo "   Set up cron job or Windows Task Scheduler"
echo ""

# Offer to run a test commit
echo "🧪 Would you like to run a test commit? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "📝 Running test commit..."
    if [ -f "auto-commit.sh" ]; then
        ./auto-commit.sh "$CURRENT_BRANCH" "Test auto-commit: $(date)"
    else
        echo "❌ auto-commit.sh not found"
        exit 1
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - AUTO-COMMIT-README.md"
echo "   - README.md (Deployment section)"
echo ""
echo "🔗 Your CI/CD pipeline will trigger automatically on every push!"
echo "   Monitor: https://github.com/Mars-Ultor/devops-roadmap-app/actions"
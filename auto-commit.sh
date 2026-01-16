#!/bin/bash

# Auto-commit and push script for DevOps Roadmap App
# This script automatically commits and pushes changes to GitHub

set -e

# Configuration
REPO_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="${1:-master}"
COMMIT_MESSAGE="${2:-"Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"}"

echo "🤖 Auto-commit script starting..."
echo "Repository: $REPO_PATH"
echo "Branch: $BRANCH"
echo "Commit message: $COMMIT_MESSAGE"

# Check if we're in a git repository
if ! git -C "$REPO_PATH" rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

cd "$REPO_PATH"

# Check if there are any changes to commit
if git diff --quiet && git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
    exit 0
fi

echo "📝 Committing changes..."

# Add all changes
git add .

# Commit with the provided message
if git commit -m "$COMMIT_MESSAGE"; then
    echo "✅ Changes committed successfully"
else
    echo "❌ Failed to commit changes"
    exit 1
fi

# Push to the specified branch
echo "🚀 Pushing to $BRANCH..."
if git push origin "$BRANCH"; then
    echo "✅ Successfully pushed to GitHub"
    echo "🔗 Changes will trigger CI/CD pipeline automatically"
else
    echo "❌ Failed to push to GitHub"
    echo "💡 Check your git credentials and network connection"
    exit 1
fi

echo "🎉 Auto-commit and push completed!"
echo "📊 CI/CD pipeline should start automatically on GitHub"
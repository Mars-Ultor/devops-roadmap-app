#!/bin/bash
# Quick code analysis for development workflow
# Runs essential checks without full test suites

set -e  # Exit on any error

echo "🔍 Running quick code analysis..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run check with status
run_check() {
    local check_name=$1
    local command=$2

    echo -e "${BLUE}➤ $check_name${NC}"
    if eval "$command" 2>/dev/null; then
        echo -e "${GREEN}  ✅ Passed${NC}"
    else
        echo -e "${RED}  ❌ Failed${NC}"
        return 1
    fi
    echo ""
}

errors=0

# ESLint Check
echo -e "${YELLOW}🔍 Linting...${NC}"
run_check "ESLint (Frontend)" "cd client && npm run lint --silent" || ((errors++))
run_check "ESLint (Backend)" "cd server && npm run lint --silent" || ((errors++))

# TypeScript Check
echo -e "${YELLOW}🔍 Type Checking...${NC}"
run_check "TypeScript (Frontend)" "cd client && npx tsc --noEmit --skipLibCheck" || ((errors++))
run_check "TypeScript (Backend)" "cd server && npx tsc --noEmit --skipLibCheck" || ((errors++))

# Python Check (if available)
echo -e "${YELLOW}🔍 Python Analysis...${NC}"
if [ -d "ml-service" ]; then
    run_check "Flake8 (ML Service)" "cd ml-service && python -m flake8 . --max-line-length=88 --extend-ignore=E203,W503 --count" || ((errors++))
else
    echo -e "${BLUE}➤ Python Analysis${NC}"
    echo -e "${YELLOW}  ⚠️  ML service directory not found, skipping${NC}"
    echo ""
fi

# Build Check
echo -e "${YELLOW}🔍 Build Verification...${NC}"
run_check "Frontend Build" "cd client && npm run build --silent" || ((errors++))

# Summary
echo "=================================="
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready to commit.${NC}"
    exit 0
else
    echo -e "${RED}❌ $errors check(s) failed. Please fix before committing.${NC}"
    exit 1
fi</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\scripts\quick-analyze.sh
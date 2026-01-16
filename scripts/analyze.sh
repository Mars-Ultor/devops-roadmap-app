#!/bin/bash
# Complete code analysis suite for DevOps Roadmap App
# This script runs all analysis tools and generates comprehensive reports

set -e  # Exit on any error

echo "🚀 Starting comprehensive code analysis for DevOps Roadmap App..."
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p reports
echo -e "${BLUE}📁 Created reports directory${NC}"

# Function to run command and capture output
run_analysis() {
    local tool_name=$1
    local command=$2
    local output_file=$3

    echo -e "${YELLOW}🔍 Running $tool_name...${NC}"

    if eval "$command" > "$output_file" 2>&1; then
        echo -e "${GREEN}✅ $tool_name completed successfully${NC}"
        # Show summary if output is not too long
        if [ $(wc -l < "$output_file") -lt 20 ]; then
            echo "   Output preview:"
            head -10 "$output_file" | sed 's/^/     /'
        fi
    else
        echo -e "${RED}❌ $tool_name failed${NC}"
        echo "   Check $output_file for details"
    fi
    echo ""
}

# Frontend Analysis
echo -e "${BLUE}📊 Analyzing Frontend (React/TypeScript)...${NC}"
echo "-------------------------------------------------"

cd client
run_analysis "ESLint (Frontend)" "npm run lint" "../reports/eslint-frontend.txt"
run_analysis "TypeScript Check (Frontend)" "npx tsc --noEmit" "../reports/tsc-frontend.txt"
run_analysis "Test Coverage (Frontend)" "npm run test:coverage" "../reports/coverage-frontend.txt"
cd ..

# Backend Analysis
echo -e "${BLUE}📊 Analyzing Backend (Node.js/TypeScript)...${NC}"
echo "--------------------------------------------------"

cd server
run_analysis "ESLint (Backend)" "npm run lint" "../reports/eslint-backend.txt"
run_analysis "TypeScript Check (Backend)" "npx tsc --noEmit" "../reports/tsc-backend.txt"
run_analysis "Test Coverage (Backend)" "npm run test:coverage" "../reports/coverage-backend.txt"
cd ..

# ML Service Analysis
echo -e "${BLUE}📊 Analyzing ML Service (Python)...${NC}"
echo "---------------------------------------"

cd ml-service
run_analysis "Flake8 (Python)" "python -m flake8 . --max-line-length=88 --extend-ignore=E203,W503" "../reports/flake8-ml.txt"
run_analysis "Pytest Coverage (ML)" "python -m pytest --cov=. --cov-report=html --cov-report=term" "../reports/coverage-ml.txt"
cd ..

# Security Analysis
echo -e "${BLUE}🔒 Running Security Scans...${NC}"
echo "-------------------------------"

# Check if tools are installed
if command -v snyk &> /dev/null; then
    run_analysis "Snyk (Frontend)" "cd client && snyk test --json" "reports/snyk-frontend.json"
    run_analysis "Snyk (Backend)" "cd server && snyk test --json" "reports/snyk-backend.json"
else
    echo -e "${YELLOW}⚠️  Snyk not installed. Install with: npm install -g snyk${NC}"
fi

if command -v trivy &> /dev/null; then
    run_analysis "Trivy Filesystem Scan" "trivy filesystem --format json ." "reports/trivy-filesystem.json"
else
    echo -e "${YELLOW}⚠️  Trivy not installed. Install from: https://aquasecurity.github.io/trivy/${NC}"
fi

# Performance Analysis
echo -e "${BLUE}⚡ Running Performance Analysis...${NC}"
echo "-------------------------------------"

# Check if Lighthouse is available
if command -v lighthouse &> /dev/null; then
    # Try to run Lighthouse on localhost, fallback to file-based analysis
    if curl -s http://localhost:3000 > /dev/null; then
        run_analysis "Lighthouse Performance" "lighthouse http://localhost:3000 --output json --output-path ./reports/lighthouse.json --quiet" "reports/lighthouse.log"
    else
        echo -e "${YELLOW}⚠️  Local server not running. Skipping Lighthouse analysis.${NC}"
        echo "   Start the app with 'npm run dev' in client/ and try again."
    fi
else
    echo -e "${YELLOW}⚠️  Lighthouse not installed. Install with: npm install -g lighthouse${NC}"
fi

# Bundle Analysis
echo -e "${BLUE}📦 Running Bundle Analysis...${NC}"
echo "-------------------------------"

cd client
if [ -d "dist" ]; then
    run_analysis "Bundle Analyzer" "npx vite-bundle-analyzer dist" "reports/bundle-analysis.txt"
else
    echo -e "${YELLOW}⚠️  Build directory not found. Run 'npm run build' first.${NC}"
fi
cd ..

# Code Quality Metrics
echo -e "${BLUE}📈 Generating Code Quality Metrics...${NC}"
echo "------------------------------------------"

# Count lines of code
echo "Lines of Code Summary:" > reports/loc-summary.txt
echo "=====================" >> reports/loc-summary.txt
echo "" >> reports/loc-summary.txt

echo "Frontend (TypeScript/React):" >> reports/loc-summary.txt
find client/src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs wc -l | tail -1 >> reports/loc-summary.txt

echo "" >> reports/loc-summary.txt
echo "Backend (TypeScript/Node.js):" >> reports/loc-summary.txt
find server/src -name "*.ts" -o -name "*.js" | xargs wc -l | tail -1 >> reports/loc-summary.txt

echo "" >> reports/loc-summary.txt
echo "ML Service (Python):" >> reports/loc-summary.txt
find ml-service -name "*.py" | xargs wc -l | tail -1 >> reports/loc-summary.txt

echo "" >> reports/loc-summary.txt
echo "Total:" >> reports/loc-summary.txt
(find client/src server/src ml-service -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" | xargs wc -l | tail -1) >> reports/loc-summary.txt

# Generate summary report
echo "📋 Generating Analysis Summary..."
echo "=================================" > reports/analysis-summary.txt
echo "DevOps Roadmap App - Code Analysis Report" >> reports/analysis-summary.txt
echo "Generated on: $(date)" >> reports/analysis-summary.txt
echo "" >> reports/analysis-summary.txt

echo "Analysis Results Summary:" >> reports/analysis-summary.txt
echo "------------------------" >> reports/analysis-summary.txt

# Check for critical issues
critical_issues=0
warnings=0

# Check ESLint results
if [ -f "reports/eslint-frontend.txt" ] && grep -q "error" reports/eslint-frontend.txt; then
    echo "❌ ESLint Frontend: ERRORS FOUND" >> reports/analysis-summary.txt
    ((critical_issues++))
else
    echo "✅ ESLint Frontend: Clean" >> reports/analysis-summary.txt
fi

if [ -f "reports/eslint-backend.txt" ] && grep -q "error" reports/eslint-backend.txt; then
    echo "❌ ESLint Backend: ERRORS FOUND" >> reports/analysis-summary.txt
    ((critical_issues++))
else
    echo "✅ ESLint Backend: Clean" >> reports/analysis-summary.txt
fi

# Check TypeScript results
if [ -f "reports/tsc-frontend.txt" ] && [ -s "reports/tsc-frontend.txt" ]; then
    echo "❌ TypeScript Frontend: ERRORS FOUND" >> reports/analysis-summary.txt
    ((critical_issues++))
else
    echo "✅ TypeScript Frontend: Clean" >> reports/analysis-summary.txt
fi

if [ -f "reports/tsc-backend.txt" ] && [ -s "reports/tsc-backend.txt" ]; then
    echo "❌ TypeScript Backend: ERRORS FOUND" >> reports/analysis-summary.txt
    ((critical_issues++))
else
    echo "✅ TypeScript Backend: Clean" >> reports/analysis-summary.txt
fi

echo "" >> reports/analysis-summary.txt
echo "Critical Issues: $critical_issues" >> reports/analysis-summary.txt
echo "Warnings: $warnings" >> reports/analysis-summary.txt
echo "" >> reports/analysis-summary.txt

echo "📁 Detailed reports available in: reports/" >> reports/analysis-summary.txt
echo "" >> reports/analysis-summary.txt
echo "Next Steps:" >> reports/analysis-summary.txt
if [ $critical_issues -gt 0 ]; then
    echo "- Fix critical issues before committing" >> reports/analysis-summary.txt
fi
echo "- Review warning-level issues" >> reports/analysis-summary.txt
echo "- Address security vulnerabilities" >> reports/analysis-summary.txt
echo "- Optimize performance bottlenecks" >> reports/analysis-summary.txt

# Final output
echo ""
echo -e "${GREEN}✅ Analysis complete!${NC}"
echo "=========================="
echo "📁 Reports generated in: reports/"
echo ""
echo "📋 Summary:"
cat reports/analysis-summary.txt | tail -10

if [ $critical_issues -gt 0 ]; then
    echo ""
    echo -e "${RED}⚠️  $critical_issues critical issues found. Please review and fix before proceeding.${NC}"
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 All critical checks passed! Code is ready for commit.${NC}"
fi</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\scripts\analyze.sh
#!/usr/bin/env bash
# Code Complexity Analysis Script
# Runs complexity analysis across all services in the DevOps Roadmap App

set -e

echo "🚀 DevOps Roadmap App - Code Complexity Analysis"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Initialize results
results_file="complexity-analysis-results.json"
echo "{}" > "$results_file"

# Function to run analysis for a service
analyze_service() {
    local service_name=$1
    local service_dir=$2
    local analysis_cmd=$3

    print_status "Analyzing $service_name..."

    if [ -d "$service_dir" ]; then
        cd "$service_dir"

        if eval "$analysis_cmd" > analysis_output.log 2>&1; then
            print_success "$service_name analysis completed"

            # Store results
            jq --arg service "$service_name" \
               --arg output "$(cat analysis_output.log)" \
               '. + {($service): {"status": "passed", "output": $output}}' \
               "../$results_file" > "../${results_file}.tmp" && mv "../${results_file}.tmp" "../$results_file"

        else
            print_error "$service_name analysis failed"

            # Store failure
            jq --arg service "$service_name" \
               --arg output "$(cat analysis_output.log 2>/dev/null || echo 'Command failed')" \
               '. + {($service): {"status": "failed", "output": $output}}' \
               "../$results_file" > "../${results_file}.tmp" && mv "../${results_file}.tmp" "../$results_file"
        fi

        cd - > /dev/null
    else
        print_warning "Directory $service_dir not found, skipping $service_name"
    fi
}

# Analyze Client (React/TypeScript)
analyze_service "client" "client" "npm run lint -- --format json > analysis_output.log 2>&1 || npx eslint src/ --format json > analysis_output.log 2>&1"

# Analyze Server (Node.js/TypeScript)
analyze_service "server" "server" "npm run lint > analysis_output.log 2>&1"

# Analyze ML Service (Python)
analyze_service "ml-service" "ml-service" "python analyze_complexity.py > analysis_output.log 2>&1"

# Generate summary report
echo ""
echo "📊 COMPLEXITY ANALYSIS SUMMARY"
echo "================================"

total_services=$(jq 'length' "$results_file")
passed_services=$(jq '[.[] | select(.status == "passed")] | length' "$results_file")
failed_services=$((total_services - passed_services))

echo "Total Services Analyzed: $total_services"
echo "Passed: $passed_services"
echo "Failed: $failed_services"
echo ""

if [ "$failed_services" -gt 0 ]; then
    print_error "Some services failed complexity analysis:"
    jq -r 'to_entries[] | select(.value.status == "failed") | "  - \(.key)"' "$results_file"
    echo ""
fi

# Complexity thresholds and recommendations
echo "🎯 COMPLEXITY THRESHOLDS & RECOMMENDATIONS"
echo "=========================================="
echo ""
echo "JavaScript/TypeScript:"
echo "  • Cyclomatic Complexity: ≤ 10 (client), ≤ 12 (server)"
echo "  • Cognitive Complexity: ≤ 15 (client), ≤ 18 (server)"
echo "  • Max Lines per Function: ≤ 50 (client), ≤ 60 (server)"
echo "  • Max Parameters: ≤ 4 (client), ≤ 5 (server)"
echo ""
echo "Python:"
echo "  • Cyclomatic Complexity: ≤ 10"
echo "  • Maintainability Index: ≥ 20"
echo "  • Max Lines per Function: ≤ 50"
echo ""

# Check for high complexity issues
echo "🔍 HIGH COMPLEXITY DETECTION"
echo "============================="

# Check client complexity
if [ -f "client/analysis_output.log" ]; then
    client_complexity=$(grep -c "complexity" client/analysis_output.log 2>/dev/null || echo "0")
    if [ "$client_complexity" -gt 0 ]; then
        print_warning "Client has $client_complexity complexity violations"
    fi
fi

# Check server complexity
if [ -f "server/analysis_output.log" ]; then
    server_complexity=$(grep -c "complexity" server/analysis_output.log 2>/dev/null || echo "0")
    if [ "$server_complexity" -gt 0 ]; then
        print_warning "Server has $server_complexity complexity violations"
    fi
fi

# Check ML service complexity
if [ -f "ml-service/complexity-report.json" ]; then
    ml_complexity=$(jq '.complexity_analysis | to_entries[] | select(.value.status == "completed") | .key' ml-service/complexity-report.json 2>/dev/null | wc -l)
    if [ "$ml_complexity" -gt 0 ]; then
        print_success "ML service complexity analysis completed with $ml_complexity tools"
    fi
fi

echo ""
echo "📄 Detailed results saved to: $results_file"
echo "📄 Individual service logs saved in respective directories"

# Final status
if [ "$failed_services" -eq 0 ]; then
    print_success "All complexity analyses completed successfully!"
    exit 0
else
    print_error "$failed_services service(s) failed complexity analysis"
    exit 1
fi
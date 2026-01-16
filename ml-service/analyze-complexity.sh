#!/usr/bin/env bash
# ML Service Complexity Analysis Script

echo "🔍 ML Service - Code Complexity Analysis"
echo "========================================"

# Check if required tools are installed
command -v radon >/dev/null 2>&1 || { echo "❌ radon is required but not installed. Install with: pip install radon"; exit 1; }
command -v flake8 >/dev/null 2>&1 || { echo "❌ flake8 is required but not installed. Install with: pip install flake8"; exit 1; }

echo "✅ All required tools are installed"

# Run complexity analysis
echo ""
echo "📊 Running complexity analysis..."

echo ""
echo "🔄 Cyclomatic Complexity (radon cc):"
echo "------------------------------------"
radon cc -s --total-average models/ main.py || echo "❌ Failed to analyze cyclomatic complexity"

echo ""
echo "🔄 Maintainability Index (radon mi):"
echo "-----------------------------------"
radon mi -s models/ main.py || echo "❌ Failed to analyze maintainability index"

echo ""
echo "🔄 Halstead Metrics (radon hal):"
echo "-------------------------------"
radon hal -f models/ main.py || echo "❌ Failed to analyze Halstead metrics"

echo ""
echo "🔄 Code Quality (flake8):"
echo "------------------------"
flake8 --config .complexity.cfg models/ main.py || echo "❌ Failed flake8 analysis"

echo ""
echo "📋 COMPLEXITY THRESHOLDS:"
echo "• Cyclomatic Complexity: ≤ 10"
echo "• Maintainability Index: ≥ 20"
echo "• Max Lines per Function: ≤ 50"
echo ""

echo "✅ Complexity analysis completed!"
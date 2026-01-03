#!/usr/bin/env python3
"""
Code Complexity Analysis Script for ML Service
Runs multiple complexity analysis tools and generates reports
"""

import subprocess
import sys
import os
from pathlib import Path
import json
from datetime import datetime

def run_command(cmd, description):
    """Run a command and return the result"""
    print(f"\n🔍 Running {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=Path(__file__).parent)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            return result.stdout
        else:
            print(f"❌ {description} failed:")
            print(result.stderr)
            return None
    except Exception as e:
        print(f"❌ Error running {description}: {e}")
        return None

def analyze_radon_cc():
    """Analyze cyclomatic complexity with radon"""
    return run_command("radon cc -s --total-average models/ main.py", "Radon Cyclomatic Complexity Analysis")

def analyze_radon_mi():
    """Analyze maintainability index with radon"""
    return run_command("radon mi -s models/ main.py", "Radon Maintainability Index Analysis")

def analyze_radon_halstead():
    """Analyze Halstead metrics with radon"""
    return run_command("radon hal -f models/ main.py", "Radon Halstead Metrics Analysis")

def analyze_flake8():
    """Analyze code with flake8 (includes McCabe complexity)"""
    return run_command("flake8 --config .complexity.cfg models/ main.py", "Flake8 Complexity Analysis")

def analyze_mccabe():
    """Analyze McCabe complexity directly"""
    return run_command("python -m mccabe --min 1 models/*.py main.py", "McCabe Complexity Analysis")

def generate_report(results):
    """Generate a comprehensive complexity report"""
    report = {
        "timestamp": datetime.now().isoformat(),
        "service": "ml-service",
        "complexity_analysis": {}
    }

    for tool, output in results.items():
        if output:
            report["complexity_analysis"][tool] = {
                "status": "completed",
                "output": output.strip()
            }
        else:
            report["complexity_analysis"][tool] = {
                "status": "failed",
                "output": ""
            }

    # Write JSON report
    with open("complexity-report.json", "w") as f:
        json.dump(report, f, indent=2)

    # Generate summary
    print("\n" + "="*60)
    print("📊 CODE COMPLEXITY ANALYSIS REPORT")
    print("="*60)
    print(f"Service: ml-service")
    print(f"Timestamp: {report['timestamp']}")
    print()

    total_tools = len(results)
    successful_tools = sum(1 for output in results.values() if output is not None)

    print(f"Analysis Tools Run: {successful_tools}/{total_tools}")

    for tool, output in results.items():
        status = "✅ PASSED" if output else "❌ FAILED"
        print(f"  {tool}: {status}")

    print("\n📋 RECOMMENDATIONS:")
    print("• Functions with CC > 10 should be refactored")
    print("• Maintainability Index < 20 indicates high maintenance cost")
    print("• Review functions with high Halstead metrics for simplification")
    print("• Consider breaking down complex functions into smaller units")

    print(f"\n📄 Detailed report saved to: complexity-report.json")
    print("="*60)

def main():
    """Main analysis function"""
    print("🚀 Starting Code Complexity Analysis for ML Service")
    print("This may take a few moments...")

    # Check if required tools are installed
    required_tools = ["radon", "flake8", "python"]
    missing_tools = []

    for tool in required_tools:
        try:
            subprocess.run([tool, "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing_tools.append(tool)

    if missing_tools:
        print(f"❌ Missing required tools: {', '.join(missing_tools)}")
        print("Please install with: pip install radon mccabe flake8")
        sys.exit(1)

    # Run all analysis tools
    results = {
        "radon_cc": analyze_radon_cc(),
        "radon_mi": analyze_radon_mi(),
        "radon_halstead": analyze_radon_halstead(),
        "flake8": analyze_flake8(),
        "mccabe": analyze_mccabe()
    }

    # Generate comprehensive report
    generate_report(results)

    # Exit with error if any tool failed
    if any(output is None for output in results.values()):
        print("\n⚠️  Some analysis tools failed. Check the output above for details.")
        sys.exit(1)
    else:
        print("\n🎉 All complexity analysis tools completed successfully!")

if __name__ == "__main__":
    main()
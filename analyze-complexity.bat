@echo off
REM Code Complexity Analysis Script for Windows
REM Runs complexity analysis across all services in the DevOps Roadmap App

echo 🚀 DevOps Roadmap App - Code Complexity Analysis
echo ================================================

REM Initialize results
set RESULTS_FILE=complexity-analysis-results.json
echo {} > %RESULTS_FILE%

REM Function to analyze a service
:analyze_service
set SERVICE_NAME=%1
set SERVICE_DIR=%2
set ANALYSIS_CMD=%3

echo.
echo [INFO] Analyzing %SERVICE_NAME%...

if exist "%SERVICE_DIR%" (
    cd "%SERVICE_DIR%"

    %ANALYSIS_CMD% > analysis_output.log 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] %SERVICE_NAME% analysis completed

        REM Store results (simplified - just mark as passed)
        echo Analysis completed for %SERVICE_NAME% >> "../%RESULTS_FILE%"
    ) else (
        echo [ERROR] %SERVICE_NAME% analysis failed
        echo Analysis failed for %SERVICE_NAME% >> "../%RESULTS_FILE%"
    )

    cd ..
) else (
    echo [WARNING] Directory %SERVICE_DIR% not found, skipping %SERVICE_NAME%
)
goto :eof

REM Analyze Client (React/TypeScript)
call :analyze_service "client" "client" "npm run lint"

REM Analyze Server (Node.js/TypeScript)
call :analyze_service "server" "server" "npm run lint"

REM Analyze ML Service (Python)
call :analyze_service "ml-service" "ml-service" "python analyze_complexity.py"

echo.
echo 📊 COMPLEXITY ANALYSIS SUMMARY
echo ================================

echo JavaScript/TypeScript Complexity Thresholds:
echo   • Cyclomatic Complexity: ≤ 10 (client), ≤ 12 (server)
echo   • Cognitive Complexity: ≤ 15 (client), ≤ 18 (server)
echo   • Max Lines per Function: ≤ 50 (client), ≤ 60 (server)
echo   • Max Parameters: ≤ 4 (client), ≤ 5 (server)
echo.
echo Python Complexity Thresholds:
echo   • Cyclomatic Complexity: ≤ 10
echo   • Maintainability Index: ≥ 20
echo   • Max Lines per Function: ≤ 50
echo.

echo 📄 Detailed results saved to: %RESULTS_FILE%
echo 📄 Individual service logs saved in respective directories

echo.
echo 🎉 Complexity analysis completed!
pause
# Auto-deploy script for DevOps Roadmap App (PowerShell)
# This script builds and deploys the application to Firebase Hosting

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Navigate to client directory
Set-Location "$PSScriptRoot\client"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm ci
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Check build output
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed - dist directory not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build complete - Bundle size:" -ForegroundColor Green
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Sum / 1MB)}}

# Deploy to Firebase
Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "✨ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Live at: https://my-devops-journey-d3a08.web.app" -ForegroundColor Cyan

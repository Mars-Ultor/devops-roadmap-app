# Auto-deploy script for DevOps Roadmap App (PowerShell)
# This script builds and deploys all services: Client, Server, and ML Service

param(
    [switch]$SkipClient,
    [switch]$SkipServer,
    [switch]$SkipML,
    [switch]$Production
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting full deployment process..." -ForegroundColor Cyan
Write-Host "Services to deploy:" -ForegroundColor Yellow
if (-not $SkipClient) { Write-Host "  ✅ Client (Firebase Hosting)" -ForegroundColor Green }
if (-not $SkipServer) { Write-Host "  ✅ Server (Railway)" -ForegroundColor Green }
if (-not $SkipML) { Write-Host "  ✅ ML Service (Railway)" -ForegroundColor Green }

# Function to check if Railway CLI is installed
function Test-RailwayCLI {
    try {
        $null = Get-Command railway -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to deploy to Railway
function Deploy-Railway {
    param([string]$ServiceName, [string]$Directory)

    Write-Host "🚂 Deploying $ServiceName to Railway..." -ForegroundColor Yellow

    if (-not (Test-RailwayCLI)) {
        Write-Host "❌ Railway CLI not found. Please install it first:" -ForegroundColor Red
        Write-Host "npm install -g @railway/cli" -ForegroundColor Yellow
        exit 1
    }

    Push-Location $Directory

    try {
        # Check if already logged in
        $loginStatus = railway status 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "🔑 Please login to Railway:" -ForegroundColor Yellow
            railway login
        }

        # Deploy
        railway deploy

        Write-Host "✅ $ServiceName deployed successfully!" -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

# Deploy Client (Firebase)
if (-not $SkipClient) {
    Write-Host "`n🌐 Deploying Client to Firebase Hosting..." -ForegroundColor Cyan

    Set-Location "$PSScriptRoot\client"

    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
        npm ci
    }

    # Build the application
    Write-Host "🔨 Building client application..." -ForegroundColor Yellow
    npm run build

    # Check build output
    if (-not (Test-Path "dist")) {
        Write-Host "❌ Client build failed - dist directory not found" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Client build complete - Bundle size:" -ForegroundColor Green
    Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Sum / 1MB)}}

    # Deploy to Firebase
    Write-Host "🔥 Deploying client to Firebase Hosting..." -ForegroundColor Yellow
    firebase deploy --only hosting

    Write-Host "✅ Client deployment complete!" -ForegroundColor Green
    Write-Host "🔗 Client live at: https://my-devops-journey-d3a08.web.app" -ForegroundColor Cyan

    Set-Location $PSScriptRoot
}

# Deploy Server (Railway)
if (-not $SkipServer) {
    Write-Host "`n🖥️  Deploying Server to Railway..." -ForegroundColor Cyan
    Deploy-Railway -ServiceName "Server" -Directory "$PSScriptRoot\server"
}

# Deploy ML Service (Railway)
if (-not $SkipML) {
    Write-Host "`n🤖 Deploying ML Service to Railway..." -ForegroundColor Cyan
    Deploy-Railway -ServiceName "ML Service" -Directory "$PSScriptRoot\ml-service"
}

Write-Host "`n✨ Full deployment complete!" -ForegroundColor Green
Write-Host "🔗 Services:" -ForegroundColor Cyan
Write-Host "  🌐 Client: https://my-devops-journey-d3a08.web.app" -ForegroundColor White
if (-not $SkipServer) { Write-Host "  🖥️  Server: Check Railway dashboard for URL" -ForegroundColor White }
if (-not $SkipML) { Write-Host "  🤖 ML Service: Check Railway dashboard for URL" -ForegroundColor White }

Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update client .env.production with deployed service URLs" -ForegroundColor White
Write-Host "  2. Redeploy client with updated API URLs" -ForegroundColor White
Write-Host "  3. Test all services are communicating properly" -ForegroundColor White

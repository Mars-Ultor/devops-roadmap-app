# DevOps Auto-Commit Watcher - Startup Setup Script
# This script creates a Windows Task Scheduler task to run the watcher on startup

Write-Host "🤖 Setting up DevOps Auto-Commit Watcher for startup..." -ForegroundColor Cyan

$taskName = "DevOps Auto-Commit Watcher"
$scriptPath = "C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat"

# Check if the script exists
if (!(Test-Path $scriptPath)) {
    Write-Host "❌ Error: startup-watcher.bat not found at $scriptPath" -ForegroundColor Red
    Write-Host "Please ensure the script is in the correct location." -ForegroundColor Yellow
    exit 1
}

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "⚠️  Task '$taskName' already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create new task
Write-Host "📝 Creating scheduled task..." -ForegroundColor Green

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Automatically commits and pushes DevOps Roadmap App changes to GitHub"

Write-Host "✅ Task created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Task Details:" -ForegroundColor Cyan
Write-Host "   Name: $taskName"
Write-Host "   Triggers: At logon"
Write-Host "   Action: Runs $scriptPath"
Write-Host ""
Write-Host "🔧 To manage the task:" -ForegroundColor Yellow
Write-Host "   1. Open Task Scheduler (taskschd.msc)"
Write-Host "   2. Navigate to Task Scheduler Library"
Write-Host "   3. Find '$taskName'"
Write-Host "   4. Right-click to modify/disable/delete"
Write-Host ""
Write-Host "🛑 To stop the watcher:" -ForegroundColor Red
Write-Host "   - Close the command window that opens on startup"
Write-Host "   - Or disable the task in Task Scheduler"
Write-Host ""
Write-Host "🎉 Setup complete! The watcher will start automatically when you log in." -ForegroundColor Green
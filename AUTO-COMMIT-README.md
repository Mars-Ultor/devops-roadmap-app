# Auto-Commit Scripts for DevOps Roadmap App

This directory contains scripts to automatically commit and push code changes to GitHub, triggering the CI/CD pipeline automatically.

## 🚀 Quick Start

### Option 1: One-time Auto-commit (Windows)
```batch
# Commit and push all current changes
auto-commit.bat

# Commit with custom message
auto-commit.bat master "Custom commit message"
```

### Option 2: Continuous File Watcher (Windows)
```batch
# Start watching for file changes (runs every 60 seconds)
auto-commit-watcher.bat
```

### Option 3: Manual Commit (Linux/Mac)
```bash
# Make script executable (first time only)
chmod +x auto-commit.sh

# Commit and push all current changes
./auto-commit.sh

# Commit with custom branch and message
./auto-commit.sh develop "Feature: Add new component"
```

## 📋 Available Scripts

### `auto-commit.bat` / `auto-commit.sh`
- **Purpose**: One-time commit and push of all current changes
- **Usage**: `auto-commit.bat [branch] [commit-message]`
- **Default branch**: `master`
- **Default message**: `"Auto-commit: [timestamp]"`

### `auto-commit-watcher.bat`
- **Purpose**: Continuously monitor for file changes and auto-commit
- **Watch interval**: 60 seconds (configurable)
- **Behavior**: Commits and pushes when changes are detected

### `auto-commit-config.yml`
- **Purpose**: Configuration file for auto-commit behavior
- **Features**: File inclusion/exclusion patterns, timing settings

## 🔧 Configuration

Edit `auto-commit-config.yml` to customize behavior:

```yaml
# Git settings
default_branch: master
commit_message_prefix: "Auto-commit"
include_timestamp: true

# File patterns
include_patterns:
  - "*.js"
  - "*.ts"
  - "*.py"
  - "*.md"

exclude_patterns:
  - "node_modules/**"
  - "*.log"
  - ".env*"
```

## ⚙️ Setting Up Automatic Commits

### Run on Windows Startup

**Option 1: Startup Folder (Easiest)**
1. Press `Win + R`, type `shell:startup`, press Enter
2. Create shortcut to: `C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat`
3. Name it: `DevOps Auto-Commit Watcher`

**Option 2: Task Scheduler (Administrator)**
1. Search for "Task Scheduler" in Start menu
2. Click "Create Task" (right panel)
3. Name: `DevOps Auto-Commit Watcher`
4. Triggers tab → New → "At log on"
5. Actions tab → New → Start program: `C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat`
6. Click OK (may need Administrator password)

See `STARTUP-SETUP-GUIDE.md` for detailed instructions.

### Windows Task Scheduler (Manual Scheduling)
1. Open Task Scheduler
2. Create new task
3. Set trigger (e.g., daily at 6 PM)
4. Set action: Start program
5. Program: `C:\path\to\auto-commit.bat`
6. Add arguments: `master "Daily auto-commit"`

### Linux/Mac Cron Job
```bash
# Edit crontab
crontab -e

# Add line for daily commits at 6 PM
0 18 * * * /path/to/devops-roadmap-app/auto-commit.sh
```

## 🔄 CI/CD Integration

When changes are pushed via auto-commit:

1. **GitHub Actions** triggers automatically
2. **CI/CD Pipeline** runs:
   - Security scans
   - Code quality checks
   - Tests
   - Deployment to staging/production

### Deployment Environments

- **Staging**: Automatic deployment on push to `master`
- **Production**: Manual approval required

## 📊 Monitoring

### Check Auto-commit Status
```batch
# See recent commits
git log --oneline -10

# Check if CI/CD is running
# Visit: https://github.com/Mars-Ultor/devops-roadmap-app/actions
```

### Troubleshooting

**"No changes to commit"**
- Files may be in `.gitignore`
- Check `auto-commit-config.yml` exclude patterns

**"Failed to push to GitHub"**
- Check git credentials
- Verify network connection
- Ensure branch exists on remote

**CI/CD not triggering**
- Check GitHub Actions tab
- Verify workflow files in `.github/workflows/`

## 🛡️ Safety Features

- **Confirmation prompts**: Can be enabled in config
- **File filtering**: Respects `.gitignore` and custom patterns
- **Error handling**: Won't overwrite uncommitted work
- **Dry-run mode**: Available for testing

## 📝 Best Practices

1. **Test locally first**: Run scripts manually before automating
2. **Use descriptive messages**: Customize commit messages when possible
3. **Monitor CI/CD**: Check that deployments succeed
4. **Backup important changes**: Don't rely solely on automation
5. **Review auto-commits**: Check commit history regularly

## 🔗 Related Files

- `.github/workflows/ci-cd-pipeline.yml` - Main CI/CD pipeline
- `DEPLOYMENT.md` - Deployment documentation
- `deploy.sh` / `deploy.ps1` - Manual deployment scripts
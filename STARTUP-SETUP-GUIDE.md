# Auto-Commit Watcher - Startup Setup Guide

## 🚀 **Manual Setup for Windows Startup**

Since Task Scheduler requires Administrator privileges, here's how to set it up manually:

### **Step 1: Create a Startup Script**

The `startup-watcher.bat` script has been created in your project folder.

### **Step 2: Add to Windows Startup**

#### **Option A: Startup Folder (Recommended)**

1. **Open Run dialog**: Press `Win + R`
2. **Type**: `shell:startup`
3. **Press Enter** - This opens your Startup folder

4. **Create a shortcut**:
   - Right-click in the Startup folder
   - Select **New → Shortcut**
   - **Location**: `C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat`
   - **Name**: `DevOps Auto-Commit Watcher`
   - Click **Finish**

#### **Option B: Task Scheduler (Administrator Required)**

1. **Open Task Scheduler**:
   - Search for "Task Scheduler" in Start menu
   - Or run: `taskschd.msc`

2. **Create new task**:
   - Click **Create Task** (right panel)
   - **Name**: `DevOps Auto-Commit Watcher`
   - **Description**: `Automatically commits and pushes DevOps Roadmap App changes`

3. **Configure Triggers**:
   - Go to **Triggers** tab
   - Click **New**
   - **Begin the task**: `At log on`
   - **Specific user**: Select your user account
   - Click **OK**

4. **Configure Actions**:
   - Go to **Actions** tab
   - Click **New**
   - **Action**: `Start a program`
   - **Program/script**: `C:\Users\ayode\Desktop\devops-roadmap-app\startup-watcher.bat`
   - Click **OK**

5. **Configure Conditions** (Optional):
   - Go to **Conditions** tab
   - Check **Start only if the following network connection is available**
   - Select your network

6. **Configure Settings**:
   - Go to **Settings** tab
   - Check **Allow task to be run on demand**
   - Check **Run task as soon as possible after a scheduled start is missed**
   - Check **If the task fails, restart every**: 1 minute, up to 3 times

7. **Save the task**:
   - Click **OK**
   - Enter your administrator password if prompted

### **Step 3: Test the Setup**

1. **Log off and log back on** (or restart your computer)
2. **Look for a command window** that opens automatically
3. **Check if it shows**: "🤖 Advanced Auto-commit Watcher starting..."

### **Step 4: Verify It's Working**

After making a file change:
1. **Wait 60 seconds** (or your configured interval)
2. **Check git log**: `git log --oneline -1`
3. **Check GitHub**: Verify commits are pushed
4. **Check CI/CD**: Verify pipeline is triggered

## 🛑 **How to Stop/Disable**

### **Startup Folder Method**:
1. Open Run dialog: `Win + R`
2. Type: `shell:startup`
3. Delete the `DevOps Auto-Commit Watcher` shortcut

### **Task Scheduler Method**:
1. Open Task Scheduler
2. Find `DevOps Auto-Commit Watcher`
3. Right-click → **Disable** or **Delete**

### **Temporary Stop**:
- Close the command window that opens on startup
- The watcher will restart on next logon

## ⚙️ **Configuration**

Edit `auto-commit-config.yml` to customize:

```yaml
# Change watch interval
watch_interval: 30  # Check every 30 seconds

# Change commit settings
default_branch: develop
commit_message_prefix: "Auto-update"
```

## 🔧 **Troubleshooting**

### **Watcher doesn't start**:
- Check if the shortcut/script path is correct
- Verify the script has execute permissions
- Check Windows Event Viewer for errors

### **Git authentication fails**:
- Ensure your Git credentials are saved
- Use Git Credential Manager
- Check if SSH keys are configured

### **Permission errors**:
- Run Task Scheduler as Administrator
- Check folder permissions for the project directory

## 📊 **Monitoring**

- **Task Status**: Task Scheduler → Task Scheduler Library
- **Watcher Logs**: Check the command window that opens
- **Git History**: `git log --oneline`
- **CI/CD Status**: GitHub Actions tab

## 🎯 **Best Practices**

1. **Test first**: Run manually before enabling startup
2. **Monitor initially**: Watch the first few automatic commits
3. **Backup important work**: Don't rely solely on automation
4. **Regular reviews**: Check commit history periodically
5. **Network dependency**: Ensure internet connection for GitHub pushes

---

**🎉 Once set up, your DevOps Roadmap App will automatically commit and deploy changes every time you save files!**
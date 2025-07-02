# QuickPrompts Desktop - Installation Guide

## 🚀 **Quick Installation**

### Option 1: Install the Packaged App (Recommended)
The app has been built and is ready to install:

1. **Copy the app to Applications folder:**
   ```bash
   cp -r "release/mac-arm64/QuickPrompts Desktop.app" /Applications/
   ```

2. **Launch from Applications folder:**
   - Open Finder → Applications
   - Double-click "QuickPrompts Desktop"
   - The app will appear in your menu bar and system tray

3. **Set up global shortcut:**
   - The app is configured to use `Cmd+Shift+P` by default
   - Press this combination from any application to open the quick prompt selector

### Option 2: Create a Symlink for Easy Access
If you want to keep the app in this project folder but make it easily accessible:

```bash
# Create symlink in Applications folder
ln -s "$PWD/release/mac-arm64/QuickPrompts Desktop.app" "/Applications/QuickPrompts Desktop.app"
```

### Option 3: Add to Dock for Quick Access
After installing (either method above):

1. Open the app from Applications
2. Right-click the app icon in the Dock
3. Select "Options" → "Keep in Dock"

## ✅ **Verification**

After installation, verify it's working:

1. **Check menu bar:** You should see the QuickPrompts icon in your menu bar
2. **Test global shortcut:** Press `Cmd+Shift+P` from any application
3. **Check title:** The window title should now show "QuickPrompts Desktop" (not "Electron")

## 🎯 **Usage After Installation**

### Launch Methods:
- **Applications folder:** Double-click "QuickPrompts Desktop"
- **Spotlight:** Press `Cmd+Space`, type "QuickPrompts"
- **Global shortcut:** `Cmd+Shift+P` (opens quick selector directly)

### First Time Setup:
1. Launch the app
2. Add your first prompts or import from Chrome extension
3. Test the global shortcut from any application
4. Optionally add your OpenAI API key in Settings for AI features

## 🔧 **Troubleshooting**

### App Won't Open
If macOS blocks the app:
1. Go to System Preferences → Security & Privacy
2. Click "Open Anyway" for QuickPrompts Desktop
3. Or run: `xattr -d com.apple.quarantine "/Applications/QuickPrompts Desktop.app"`

### Global Shortcut Not Working
1. Check System Preferences → Keyboard → Shortcuts
2. Make sure no other app is using `Cmd+Shift+P`
3. Try changing the shortcut in QuickPrompts Settings

### Remove Development Dependencies
Once installed, you can optionally clean up the development environment:
```bash
# Remove node_modules to save space (app is now self-contained)
rm -rf node_modules
```

## 📦 **App Details**

- **Location:** `/Applications/QuickPrompts Desktop.app`
- **Size:** ~150MB (includes Electron runtime)
- **Data storage:** `~/.quickprompts/data.json`
- **Auto-updates:** Not configured (manual updates for now)

## 🗑️ **Uninstall**

To remove QuickPrompts Desktop:
```bash
# Remove the application
rm -rf "/Applications/QuickPrompts Desktop.app"

# Remove user data (optional)
rm -rf ~/.quickprompts
```

Your QuickPrompts Desktop app is now ready to use! 🎉
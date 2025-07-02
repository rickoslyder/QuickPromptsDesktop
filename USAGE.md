# QuickPrompts Desktop - Quick Start Guide

## Current Status: ✅ **WORKING**

The desktop app is now functional! Here's how to use it:

## Launch Instructions

```bash
cd quickprompts-desktop
npm install
npm run build
npm start
```

## What You Should See

1. **Main Window**: A desktop app window with QuickPrompts interface
2. **Tabs**: "Prompts" and "Settings" tabs
3. **Empty State**: "No prompts yet. Click 'Add New Prompt' to get started!"

## First Steps

### 1. Add Your First Prompt
- Click "Add New Prompt"
- Fill in:
  - **Name**: "Code Review"
  - **Text**: "Please review this code for best practices and bugs"
  - **Category**: "Development"
- Choose a color and icon
- Click "Add Prompt"

### 2. Test Import from Chrome Extension
- Use the test file: `test-export.json` (already created)
- Click "Import" button
- Select `test-export.json`
- You should see 3 test prompts imported

### 3. Test Global Shortcut
- Press **Cmd+Shift+P** (macOS) or **Ctrl+Shift+P** (Windows/Linux)
- Quick selector window should appear
- Click a prompt to copy it to clipboard
- Paste anywhere with **Cmd+V** / **Ctrl+V**

## Current Features Working

✅ **Basic functionality**
- Add/edit/delete prompts
- Import/export JSON files
- Settings management

✅ **Data compatibility**
- Same JSON format as Chrome extension
- Perfect import/export compatibility

✅ **System integration**
- Global keyboard shortcuts
- Clipboard-based insertion
- Cross-platform support

## Known Limitations

- System tray icon not loading (cosmetic issue)
- No real icon files (using placeholders)
- OpenAI features need API key to test

## File Locations

- **App data**: `~/.quickprompts/data.json`
- **Test data**: `test-export.json` (Chrome extension compatible)

## Next Steps

The desktop app is ready for real-world use! You can:

1. **Import your existing Chrome extension data**
2. **Use global shortcuts to insert prompts anywhere**
3. **Manage prompts through the desktop interface**
4. **Export data back to Chrome extension**

The core functionality is complete and working as designed.
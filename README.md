# QuickPrompts Desktop

A cross-platform desktop application that provides system-wide access to your prompt library. Works with any application including desktop ChatGPT, Claude, CLI tools, and more.

## Features

- **System-wide keyboard shortcuts** - Access prompts from any application
- **Compatible with Chrome extension** - Import/export with identical data format
- **Cross-platform** - Works on Windows, macOS, and Linux
- **System tray integration** - Quick access from system tray
- **Clipboard-based insertion** - Works with any text field
- **AI-powered features** - OpenAI integration for categorization and enhancement
- **Searchable prompt library** - Quick filtering and selection

## Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Build from Source

1. Clone the repository:
```bash
git clone <repository-url>
cd quickprompts-desktop
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

### Development

For development with hot reload:
```bash
npm run dev
```

## Usage

### First Time Setup

1. Launch QuickPrompts Desktop
2. The app will appear in your system tray
3. Double-click the tray icon to open the main window
4. Add your first prompts or import from Chrome extension

### Adding Prompts

1. Click "Add New Prompt" in the main window
2. Fill in the prompt details:
   - **Name**: Descriptive name for the prompt
   - **Text**: The actual prompt content
   - **Category**: Optional categorization
   - **Color**: Visual identification
   - **Icon**: Emoji icon for quick recognition

### Using Prompts

#### Method 1: Global Shortcut (Recommended)
1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. The quick selector window appears
3. Search and click on a prompt
4. The prompt is copied to clipboard
5. Paste (`Cmd+V` or `Ctrl+V`) into any application

#### Method 2: System Tray
1. Right-click the system tray icon
2. Select "Quick Insert"
3. Choose a prompt from the list

### Import/Export

#### From Chrome Extension
1. In Chrome extension, go to Options → Export
2. Save the JSON file
3. In desktop app, click "Import"
4. Select the exported JSON file

#### To Chrome Extension
1. In desktop app, click "Export"
2. Save the JSON file
3. In Chrome extension, go to Options → Import
4. Select the exported JSON file

### Settings

Access settings from the main window:

- **OpenAI API Key**: Enable AI features
- **Global Shortcut**: Customize keyboard shortcut
- **Launch on Startup**: Auto-start with system
- **Minimize to Tray**: Hide instead of closing
- **Show Icons**: Display emoji icons

## Data Compatibility

The desktop app uses the **exact same data format** as the Chrome extension:

```json
{
  "version": 1,
  "exportedAt": "2025-01-02T12:00:00.000Z",
  "prompts": [
    {
      "id": "unique-id",
      "name": "Prompt Name",
      "text": "Prompt content...",
      "category": "Category",
      "color": "#007bff",
      "icon": "📝"
    }
  ]
}
```

## Storage Location

Prompts are stored locally in:
- **macOS**: `~/.quickprompts/data.json`
- **Windows**: `%USERPROFILE%\.quickprompts\data.json`
- **Linux**: `~/.quickprompts/data.json`

## Keyboard Shortcuts

- **Global**: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) - Open quick selector
- **In Quick Selector**: `Escape` - Close window
- **System Tray**: Double-click - Open main window

## Architecture

Built with:
- **Electron** - Cross-platform desktop framework
- **TypeScript** - Type-safe development
- **React** - UI components (reused from Chrome extension)
- **Node.js** - File system and system integration

### Project Structure
```
src/
├── main/           # Electron main process
├── renderer/       # React-based UI
├── shared/         # Shared types and utilities
└── assets/         # Icons and resources
```

## Development

### Building
```bash
npm run build          # Build for production
npm run build:watch    # Build with file watching
npm run dev            # Development with hot reload
```

### Packaging
```bash
npm run package        # Create distributable packages
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Global Shortcut Not Working
- Check if another app is using the same shortcut
- Try changing the shortcut in Settings
- Restart the application

### App Not Appearing in System Tray
- Check system tray settings in your OS
- Look for hidden/collapsed tray icons
- Try restarting the application

### Import/Export Issues
- Ensure JSON file is valid QuickPrompts format
- Check file permissions
- Verify the file isn't corrupted

### Performance Issues
- Close unused prompts windows
- Check available system memory
- Restart the application
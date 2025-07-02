import { app, BrowserWindow, globalShortcut, Menu, Tray, ipcMain, clipboard, dialog } from 'electron';
import * as path from 'path';
import { initializeStorage, getPrompts, getUserSettings, savePrompts, saveUserSettings, exportPrompts, importPrompts } from '../shared/storage';
import { Prompt, UserSettings, PromptExportData } from '../shared/types';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let promptWindow: BrowserWindow | null = null;

// Create the main application window
const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: 'QuickPrompts Desktop',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (tray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
};

// Create quick prompt selector window
const createPromptWindow = async (): Promise<void> => {
  if (promptWindow) {
    promptWindow.focus();
    return;
  }

  promptWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
  });

  // Load the modern prompt selector
  promptWindow.loadFile(path.join(__dirname, '../prompt-selector-modern.html'));

  promptWindow.on('blur', () => {
    promptWindow?.close();
  });

  promptWindow.on('closed', () => {
    promptWindow = null;
  });
};

// Create system tray
const createTray = (): void => {
  try {
    tray = new Tray(path.join(__dirname, '../assets/tray-icon.png'));
  } catch (error) {
    console.log('Could not load tray icon, skipping tray');
    return;
  }
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show QuickPrompts',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createMainWindow();
        }
      },
    },
    {
      label: 'Quick Insert',
      click: () => {
        createPromptWindow();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('QuickPrompts Desktop');

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
  });
};

// Register global shortcuts
const registerGlobalShortcuts = async (): Promise<void> => {
  try {
    // Unregister all shortcuts first
    globalShortcut.unregisterAll();
    
    const settings = await getUserSettings();
    const shortcut = settings.globalShortcut || 'CommandOrControl+Shift+P';
    
    const success = globalShortcut.register(shortcut, () => {
      createPromptWindow();
    });
    
    if (!success) {
      console.error('Failed to register global shortcut:', shortcut);
      // Notify user through main window if available
      if (mainWindow) {
        mainWindow.webContents.send('shortcut-registration-failed', shortcut);
      }
    } else {
      console.log('Successfully registered global shortcut:', shortcut);
    }
  } catch (error) {
    console.error('Failed to register global shortcut:', error);
  }
};

// Set up IPC handlers
const setupIPC = (): void => {
  // Get prompts
  ipcMain.handle('get-prompts', async () => {
    return await getPrompts();
  });

  // Save prompts
  ipcMain.handle('save-prompts', async (_, prompts: Prompt[]) => {
    return await savePrompts(prompts);
  });

  // Get settings
  ipcMain.handle('get-settings', async () => {
    return await getUserSettings();
  });

  // Save settings
  ipcMain.handle('save-settings', async (_, settings: UserSettings) => {
    const result = await saveUserSettings(settings);
    // Re-register shortcuts when settings change
    await registerGlobalShortcuts();
    return result;
  });

  // Insert prompt to clipboard and simulate paste
  ipcMain.handle('insert-prompt', async (_, promptText: string) => {
    try {
      clipboard.writeText(promptText);
      // Close the prompt window
      if (promptWindow) {
        promptWindow.close();
      }
      return true;
    } catch (error) {
      console.error('Failed to insert prompt:', error);
      return false;
    }
  });

  // Export prompts
  ipcMain.handle('export-prompts', async () => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      defaultPath: 'quickprompts-export.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!result.canceled && result.filePath) {
      try {
        await exportPrompts(result.filePath);
        return { success: true, filePath: result.filePath };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return { success: false, error: 'Export cancelled' };
  });

  // Import prompts
  ipcMain.handle('import-prompts', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      try {
        const importData = await importPrompts(result.filePaths[0]);
        return { success: true, data: importData };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return { success: false, error: 'Import cancelled' };
  });
};

// App ready event
app.whenReady().then(async () => {
  // Set app name for macOS
  if (process.platform === 'darwin') {
    app.setName('QuickPrompts Desktop');
  }
  
  await initializeStorage();
  
  createMainWindow();
  createTray();
  setupIPC();
  await registerGlobalShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up before quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
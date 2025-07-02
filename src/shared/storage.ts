import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { StorageData, Prompt, UserSettings, PromptExportData } from './types';

// Desktop storage location
const APP_DATA_DIR = path.join(os.homedir(), '.quickprompts');
const STORAGE_FILE = path.join(APP_DATA_DIR, 'data.json');

// Default settings for desktop app
const defaultUserSettings: UserSettings = {
  openAIApiKey: null,
  selectedModelId: null,
  debugModeEnabled: false,
  showPromptIcons: true,
  globalShortcut: 'CommandOrControl+Shift+P',
  launchOnStartup: false,
  minimizeToTray: true,
};

const defaultData: StorageData = {
  prompts: [],
  userSettings: defaultUserSettings,
};

/**
 * Ensure app data directory exists
 */
const ensureDataDir = (): void => {
  if (!fs.existsSync(APP_DATA_DIR)) {
    fs.mkdirSync(APP_DATA_DIR, { recursive: true });
  }
};

/**
 * Initialize storage with default data if it doesn't exist
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    ensureDataDir();
    if (!fs.existsSync(STORAGE_FILE)) {
      await setStorageData(defaultData);
    }
  } catch (error) {
    console.error("Failed to initialize storage:", error);
    await setStorageData(defaultData);
  }
};

/**
 * Get data from local storage file
 */
export const getStorageData = async (): Promise<StorageData> => {
  try {
    ensureDataDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const parsed = JSON.parse(data) as StorageData;
      
      // Merge with defaults to ensure all fields exist
      return {
        prompts: parsed.prompts || [],
        userSettings: { ...defaultUserSettings, ...parsed.userSettings },
      };
    }
  } catch (error) {
    console.error("Error reading storage file:", error);
  }
  
  return defaultData;
};

/**
 * Save data to local storage file
 */
export const setStorageData = async (data: StorageData): Promise<void> => {
  try {
    ensureDataDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing storage file:", error);
    throw new Error(`Failed to save data: ${error}`);
  }
};

/**
 * Save prompts to storage
 */
export const savePrompts = async (prompts: Prompt[]): Promise<void> => {
  try {
    const data = await getStorageData();
    data.prompts = prompts;
    await setStorageData(data);
  } catch (error) {
    console.error("Error saving prompts:", error);
    throw new Error(`Failed to save prompts: ${error}`);
  }
};

/**
 * Save user settings to storage
 */
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const data = await getStorageData();
    data.userSettings = { ...data.userSettings, ...settings };
    await setStorageData(data);
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw new Error(`Failed to save settings: ${error}`);
  }
};

/**
 * Get prompts from storage
 */
export const getPrompts = async (): Promise<Prompt[]> => {
  try {
    const data = await getStorageData();
    return data.prompts || [];
  } catch (error) {
    console.error("Error getting prompts:", error);
    return [];
  }
};

/**
 * Get user settings from storage
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const data = await getStorageData();
    return { ...defaultUserSettings, ...data.userSettings };
  } catch (error) {
    console.error("Error getting user settings:", error);
    return defaultUserSettings;
  }
};

/**
 * Export prompts to file (compatible with Chrome extension format)
 */
export const exportPrompts = async (filePath: string): Promise<void> => {
  try {
    const prompts = await getPrompts();
    const exportData: PromptExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      prompts,
    };
    
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8');
  } catch (error) {
    console.error("Error exporting prompts:", error);
    throw new Error(`Failed to export prompts: ${error}`);
  }
};

/**
 * Import prompts from file (compatible with Chrome extension format)
 */
export const importPrompts = async (filePath: string): Promise<PromptExportData> => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const importData = JSON.parse(data) as PromptExportData;
    
    // Validate the import data structure
    if (!importData.version || !Array.isArray(importData.prompts)) {
      throw new Error('Invalid import file format');
    }
    
    return importData;
  } catch (error) {
    console.error("Error importing prompts:", error);
    throw new Error(`Failed to import prompts: ${error}`);
  }
};

/**
 * Get the storage file path (for debugging)
 */
export const getStorageFilePath = (): string => {
  return STORAGE_FILE;
};
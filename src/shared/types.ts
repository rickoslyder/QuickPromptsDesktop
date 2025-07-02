// Shared types between Chrome extension and desktop app - ensures full compatibility

export interface Prompt {
  id: string;
  name: string;
  text: string;
  category: string;
  color: string;
  icon: string;
}

export interface PromptExportData {
  version: 1; // Schema version number
  exportedAt: string; // ISO 8601 timestamp string (e.g., new Date().toISOString())
  prompts: Prompt[]; // The array of prompt objects
}

export interface UserSettings {
  openAIApiKey?: string | null;
  selectedModelId?: string | null;
  debugModeEnabled?: boolean;
  showPromptIcons?: boolean;
  // Desktop-specific settings
  globalShortcut?: string;
  launchOnStartup?: boolean;
  minimizeToTray?: boolean;
}

export interface StorageData {
  prompts: Prompt[];
  userSettings: UserSettings;
}

// OpenAI API types
export interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
}

export interface CategorySuggestion {
  promptId: string;
  category: string;
}

export interface CategoryResult {
  success: boolean;
  suggestions?: CategorySuggestion[];
  error?: OpenAIError;
}

export interface ModelsResult {
  success: boolean;
  models?: OpenAIModel[];
  error?: OpenAIError;
}

export interface EnhancementHistoryItem {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface EnhancePromptResult {
  success: boolean;
  enhancedPrompt?: string;
  history?: EnhancementHistoryItem[];
  error?: OpenAIError;
}
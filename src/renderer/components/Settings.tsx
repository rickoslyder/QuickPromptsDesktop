import React, { useState, useEffect } from 'react';
import { UserSettings, OpenAIModel } from '../../shared/types';
import { getAvailableModels } from '../../shared/openaiApi';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>({});
  const [availableModels, setAvailableModels] = useState<OpenAIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Load models when API key changes
  useEffect(() => {
    if (formData.openAIApiKey) {
      loadModels();
    } else {
      setAvailableModels([]);
    }
  }, [formData.openAIApiKey]);

  const loadModels = async () => {
    if (!formData.openAIApiKey) return;
    
    setLoadingModels(true);
    try {
      const result = await getAvailableModels(formData.openAIApiKey);
      if (result.success && result.models) {
        setAvailableModels(result.models);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>OpenAI Integration</h3>
          <div className="form-group">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <input
              type="password"
              id="apiKey"
              value={formData.openAIApiKey || ''}
              onChange={(e) => handleChange('openAIApiKey', e.target.value)}
              placeholder="sk-..."
            />
            <small>Required for AI-powered categorization and prompt enhancement</small>
          </div>

          <div className="form-group">
            <label htmlFor="modelId">AI Model</label>
            <select
              id="modelId"
              value={formData.selectedModelId || ''}
              onChange={(e) => handleChange('selectedModelId', e.target.value)}
              disabled={!formData.openAIApiKey || loadingModels}
            >
              <option value="">
                {!formData.openAIApiKey 
                  ? 'Enter API key first' 
                  : loadingModels 
                    ? 'Loading models...' 
                    : 'Select a model'
                }
              </option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
            <small>Models will load automatically when you enter your API key</small>
          </div>
        </div>

        <div className="settings-section">
          <h3>Desktop Settings</h3>
          <div className="form-group">
            <label htmlFor="globalShortcut">Global Shortcut</label>
            <input
              type="text"
              id="globalShortcut"
              value={formData.globalShortcut || ''}
              onChange={(e) => handleChange('globalShortcut', e.target.value)}
              placeholder="CommandOrControl+Shift+P"
            />
            <small>System-wide keyboard shortcut to open quick prompt selector</small>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="launchOnStartup"
              checked={formData.launchOnStartup || false}
              onChange={(e) => handleChange('launchOnStartup', e.target.checked)}
            />
            <label htmlFor="launchOnStartup">Launch on system startup</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="minimizeToTray"
              checked={formData.minimizeToTray !== false} // Default to true
              onChange={(e) => handleChange('minimizeToTray', e.target.checked)}
            />
            <label htmlFor="minimizeToTray">Minimize to system tray</label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Display Settings</h3>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="showPromptIcons"
              checked={formData.showPromptIcons !== false} // Default to true
              onChange={(e) => handleChange('showPromptIcons', e.target.checked)}
            />
            <label htmlFor="showPromptIcons">Show icons on prompt buttons</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="debugMode"
              checked={formData.debugModeEnabled || false}
              onChange={(e) => handleChange('debugModeEnabled', e.target.checked)}
            />
            <label htmlFor="debugMode">Enable debug mode</label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
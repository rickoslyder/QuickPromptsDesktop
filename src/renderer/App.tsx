import React, { useState, useEffect } from 'react';
import { Prompt, UserSettings } from '../shared/types';
import PromptList from './components/PromptList';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import { ToastContainer, useToast } from './components/Toast';
import './App.css';

// Electron IPC for renderer process
declare global {
  interface Window {
    require: any;
  }
}

const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [settings, setSettings] = useState<UserSettings>({});
  const [activeTab, setActiveTab] = useState<'prompts' | 'settings'>('prompts');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedPrompts, loadedSettings] = await Promise.all([
        ipcRenderer.invoke('get-prompts'),
        ipcRenderer.invoke('get-settings'),
      ]);
      
      setPrompts(loadedPrompts || []);
      setSettings(loadedSettings || {});
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompts = async (updatedPrompts: Prompt[]) => {
    try {
      await ipcRenderer.invoke('save-prompts', updatedPrompts);
      setPrompts(updatedPrompts);
      showToast('Prompts saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save prompts:', error);
      showToast('Failed to save prompts', 'error');
    }
  };

  const handleSaveSettings = async (updatedSettings: UserSettings) => {
    try {
      await ipcRenderer.invoke('save-settings', updatedSettings);
      setSettings(updatedSettings);
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    }
  };

  const handleAddPrompt = (prompt: Prompt) => {
    const updatedPrompts = [...prompts, prompt];
    handleSavePrompts(updatedPrompts);
    setEditingPrompt(null);
  };

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    const updatedPrompts = prompts.map(p => 
      p.id === updatedPrompt.id ? updatedPrompt : p
    );
    handleSavePrompts(updatedPrompts);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (promptId: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== promptId);
    handleSavePrompts(updatedPrompts);
  };

  const handleExport = async () => {
    try {
      const result = await ipcRenderer.invoke('export-prompts');
      if (result.success) {
        showToast(`Exported to ${result.filePath}`, 'success');
      } else {
        showToast(`Export failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showToast(`Export failed: ${error}`, 'error');
    }
  };

  const handleImport = async () => {
    try {
      const result = await ipcRenderer.invoke('import-prompts');
      if (result.success) {
        // Simple merge - add all imported prompts
        const importedPrompts = result.data.prompts;
        const existingIds = new Set(prompts.map((p: Prompt) => p.id));
        const newPrompts = importedPrompts.filter((p: Prompt) => !existingIds.has(p.id));
        
        if (newPrompts.length > 0) {
          const updatedPrompts = [...prompts, ...newPrompts];
          handleSavePrompts(updatedPrompts);
          showToast(`Successfully imported ${newPrompts.length} new prompts`, 'success');
        } else {
          showToast('No new prompts found to import', 'info');
        }
      } else {
        showToast(`Import failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showToast(`Import failed: ${error}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="app loading">
        <div>Loading QuickPrompts...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="app-header">
        <h1>QuickPrompts Desktop</h1>
        <nav className="tab-nav">
          <button 
            className={activeTab === 'prompts' ? 'active' : ''}
            onClick={() => setActiveTab('prompts')}
          >
            Prompts ({prompts.length})
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'prompts' && (
          <div className="prompts-tab">
            <div className="prompts-header">
              <div className="prompts-actions">
                <button onClick={() => setEditingPrompt({} as Prompt)} className="btn-primary">
                  Add New Prompt
                </button>
                <button onClick={handleImport} className="btn-secondary">
                  Import
                </button>
                <button onClick={handleExport} className="btn-secondary">
                  Export
                </button>
              </div>
            </div>
            
            {editingPrompt ? (
              <PromptForm
                prompt={editingPrompt.id ? editingPrompt : undefined}
                onSave={editingPrompt.id ? handleUpdatePrompt : handleAddPrompt}
                onCancel={() => setEditingPrompt(null)}
                settings={settings}
              />
            ) : (
              <PromptList
                prompts={prompts}
                onEdit={setEditingPrompt}
                onDelete={handleDeletePrompt}
                settings={settings}
                showToast={showToast}
              />
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSave={handleSaveSettings}
          />
        )}
      </main>
    </div>
  );
};

export default App;
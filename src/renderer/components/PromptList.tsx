import React from 'react';
import { Prompt, UserSettings } from '../../shared/types';
import { convertIconToEmoji } from '../../shared/iconUtils';

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string) => void;
  settings: UserSettings;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PromptList: React.FC<PromptListProps> = ({ prompts, onEdit, onDelete, settings, showToast }) => {
  if (prompts.length === 0) {
    return (
      <div className="empty-state">
        <p>No prompts yet. Click "Add New Prompt" to get started!</p>
      </div>
    );
  }

  const handleDelete = (prompt: Prompt) => {
    if (window.confirm(`Are you sure you want to delete "${prompt.name}"?`)) {
      onDelete(prompt.id);
    }
  };

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      showToast(`Copied "${prompt.name}" to clipboard`, 'success');
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      showToast('Failed to copy prompt', 'error');
    }
  };

  return (
    <div className="prompts-grid">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="prompt-card">
          <div className="prompt-header">
            <h3 className="prompt-name" style={{ color: prompt.color || '#333' }}>
              {settings.showPromptIcons && prompt.icon && (
                <span className="prompt-icon" style={{ marginRight: '8px' }}>
                  {convertIconToEmoji(prompt.icon)}
                </span>
              )}
              {prompt.name}
            </h3>
            {prompt.category && (
              <span className="prompt-category">{prompt.category}</span>
            )}
          </div>
          
          <div className="prompt-text">
            {prompt.text}
          </div>
          
          <div className="prompt-actions">
            <button
              id={`copy-${prompt.id}`}
              className="btn-small btn-copy"
              onClick={() => handleCopy(prompt)}
              title="Copy to clipboard"
            >
              Copy
            </button>
            <button
              className="btn-small btn-edit"
              onClick={() => onEdit(prompt)}
            >
              Edit
            </button>
            <button
              className="btn-small btn-delete"
              onClick={() => handleDelete(prompt)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
import React, { useState, useEffect } from 'react';
import { Prompt, UserSettings } from '../../shared/types';

interface PromptFormProps {
  prompt?: Prompt;
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
  settings: UserSettings;
}

const defaultColors = [
  '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
  '#6610f2', '#e83e8c', '#fd7e14', '#20c997', '#6f42c1'
];

const defaultIcons = [
  '📝', '💡', '🚀', '⭐', '🔥', '💼', '🎯', '✨', '🛠️', '📊',
  '🎨', '🔍', '💻', '📱', '🌟', '🎪', '🎭', '🎨', '🎪', '🎨'
];

const PromptForm: React.FC<PromptFormProps> = ({ prompt, onSave, onCancel, settings }) => {
  const [formData, setFormData] = useState<Partial<Prompt>>({
    name: '',
    text: '',
    category: '',
    color: defaultColors[0],
    icon: defaultIcons[0],
  });

  useEffect(() => {
    if (prompt) {
      setFormData(prompt);
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.text?.trim()) {
      alert('Please fill in both name and text fields');
      return;
    }

    const promptToSave: Prompt = {
      id: prompt?.id || `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      text: formData.text.trim(),
      category: formData.category?.trim() || 'General',
      color: formData.color || defaultColors[0],
      icon: formData.icon || defaultIcons[0],
    };

    onSave(promptToSave);
  };

  const handleChange = (field: keyof Prompt, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="form-container">
      <h2>{prompt?.id ? 'Edit Prompt' : 'Add New Prompt'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Prompt Name *</label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter a descriptive name for your prompt"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="text">Prompt Text *</label>
          <textarea
            id="text"
            value={formData.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Enter your prompt text here..."
            required
            rows={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g., Writing, Coding, Analysis"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color">Color</label>
            <div className="color-picker">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('color', color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <div className="icon-picker">
              {defaultIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => handleChange('icon', icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {prompt?.id ? 'Update Prompt' : 'Add Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;
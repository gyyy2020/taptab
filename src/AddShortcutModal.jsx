import React, { useState } from 'react';
import './AddShortcutModal.css';

const AddShortcutModal = ({ visible, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  if (!visible) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, url });
    setName('');
    setUrl('');
  };

  return (
    <div className="add-shortcut-modal-overlay">
      <div className="add-shortcut-modal-content">
        <h3>Add Shortcut</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          <div className="add-shortcut-modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShortcutModal;

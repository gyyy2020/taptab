import React, { useState, useEffect } from 'react';
import './EditShortcutModal.css';

const EditShortcutModal = ({ visible, shortcut, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (shortcut) {
      setName(shortcut.name);
      setUrl(shortcut.url);
    }
  }, [shortcut]);

  if (!visible) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...shortcut, name, url });
  };

  return (
    <div className="edit-shortcut-modal-overlay">
      <div className="edit-shortcut-modal-content">
        <h3>Edit Shortcut</h3>
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
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShortcutModal;

// Import necessary React hooks and CSS for styling
import React, { useState, useEffect } from 'react';
import './EditShortcutModal.css';

// Component for the modal to edit a shortcut
const EditShortcutModal = ({ visible, shortcut, onSave, onCancel }) => {
  // State variables for the shortcut's name and URL
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // Effect to set the initial values of the input fields when the shortcut prop changes
  useEffect(() => {
    if (shortcut) {
      setName(shortcut.name);
      setUrl(shortcut.url);
    }
  }, [shortcut]);

  // If the modal is not visible, do not render it
  if (!visible) {
    return null;
  }

  // Handle form submission to save the updated shortcut
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...shortcut, name, url });
  };

  // Render the edit shortcut modal
  return (
    <div className="edit-shortcut-modal-overlay">
      <div className="edit-shortcut-modal-content">
        <h3>Edit Shortcut</h3>
        <form onSubmit={handleSubmit}>
          {/* Input field for the shortcut's name */}
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {/* Input field for the shortcut's URL */}
          <label>
            URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          {/* Buttons to save or cancel the changes */}
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
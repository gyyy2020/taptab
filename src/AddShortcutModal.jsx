// Import React and useState hook
import React, { useState } from 'react';
// Import modal-specific styles
import './AddShortcutModal.css';

// Modal component for adding a new shortcut
const AddShortcutModal = ({ visible, onSave, onCancel }) => {
  // State for shortcut name and URL input fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // If the modal is not visible, do not render anything
  if (!visible) {
    return null;
  }

  // Handle form submission: pass new shortcut to parent and reset fields
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, url });
    setName('');
    setUrl('');
  };


  // Render modal UI for adding a shortcut
  return (
    <div className="add-shortcut-modal-overlay">
      <div className="add-shortcut-modal-content">
        <h3>Add Shortcut</h3>
        <form onSubmit={handleSubmit}>
          {/* Name input field */}
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {/* URL input field */}
          <label>
            URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          {/* Action buttons */}
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

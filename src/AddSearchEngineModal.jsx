import React, { useState } from 'react';
import './AddSearchEngineModal.css';

function AddSearchEngineModal({ isOpen, onClose, onAddEngine }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAddEngine({ name, url, icon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}` });
      setName('');
      setUrl('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Search Engine</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">URL (e.g., https://example.com/search?q=):</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={handleSubmit}>Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSearchEngineModal;
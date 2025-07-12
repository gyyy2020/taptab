// Import React and useState hook
import React, { useState } from 'react';
// Import CSS styles for the modal
import './AddSearchEngineModal.css';

// Modal component for adding a new search engine
function AddSearchEngineModal({ isOpen, onClose, onAddEngine }) {
  // State for search engine name and URL input fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // If the modal is not open, do not render anything
  if (!isOpen) return null;

  // Handle form submission: validate and pass new engine to parent
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Only add if both name and url are provided
    if (name.trim() && url.trim()) {
      // Use the site's favicon as the icon
      onAddEngine({ name, url, icon: `https://favicon.im/${new URL(url).hostname}?larger=true` });
      // Reset name field
      setName('');
      // Reset url field
      setUrl('');
      // Close modal
      onClose();
    }
  };

  // Render modal UI for adding a search engine
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Search Engine</h2>
        <form onSubmit={handleSubmit}>
          {/* Name input field */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* URL input field */}
          <div className="form-group">
            <label htmlFor="url">URL (e.g., https://example.com/search?q=):</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {/* Action buttons */}
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
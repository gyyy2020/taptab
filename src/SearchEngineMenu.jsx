// Import necessary React hooks and CSS for styling
import React, { useEffect, useRef } from 'react';
import './SearchEngineMenu.css';

// Component for the search engine menu
function SearchEngineMenu({ isVisible, onSelectEngine, searchEngines, onAddEngineClick, onClose }) {
  // Create a ref to hold the menu element
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu to close it
  useEffect(() => {
    // Function to handle clicks outside the menu
    function handleClickOutside(event) {
      // If the click is outside the menu, call the onClose function
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Add event listener when the menu is visible
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // If the menu is not visible, do not render it
  if (!isVisible) return null;

  // Render the search engine menu
  return (
    <div className="search-engine-menu" ref={menuRef}>
      <ul>
        {/* Map through the search engines and create a list item for each */}
        {searchEngines.map((engine) => (
          <li key={engine.name} onClick={() => onSelectEngine(engine)}>
            <img src={engine.icon} alt={engine.name} />
            {engine.name}
          </li>
        ))}
        {/* List item to add a new search engine */}
        <li className="add-new" onClick={onAddEngineClick}>
          + Add
        </li>
      </ul>
    </div>
  );
}

export default SearchEngineMenu;
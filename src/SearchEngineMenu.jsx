import React from 'react';
import './SearchEngineMenu.css';

function SearchEngineMenu({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="search-engine-menu">
      
      <ul>
        <li>
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Google
        </li>
        <li>
          <img src="https://www.bing.com/favicon.ico" alt="Bing" />
          Bing
        </li>
        <li>
          <img src="https://duckduckgo.com/favicon.ico" alt="DuckDuckGo" />
          DuckDuckGo
        </li>
        <li className="add-new">
          + Add New
        </li>
      </ul>
    </div>
  );
}

export default SearchEngineMenu;

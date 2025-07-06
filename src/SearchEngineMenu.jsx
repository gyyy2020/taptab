import React from 'react';
import './SearchEngineMenu.css';

function SearchEngineMenu({ isVisible, onSelectEngine, searchEngines }) {
  if (!isVisible) return null;

  return (
    <div className="search-engine-menu">
      <ul>
        {searchEngines.map((engine) => (
          <li key={engine.name} onClick={() => onSelectEngine(engine)}>
            <img src={engine.icon} alt={engine.name} />
            {engine.name}
          </li>
        ))}
        <li className="add-new">
          + Add New
        </li>
      </ul>
    </div>
  );
}

export default SearchEngineMenu;

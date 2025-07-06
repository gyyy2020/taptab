import React from 'react';
import './SearchEngineMenu.css';

function SearchEngineMenu({ isVisible, onSelectEngine, searchEngines, onAddEngineClick }) {
  if (!isVisible) return null;

  console.log('Rendering SearchEngineMenu with engines:', searchEngines);

  return (
    <div className="search-engine-menu">
      <ul>
        {searchEngines.map((engine) => (
          <li key={engine.name} onClick={() => onSelectEngine(engine)}>
            <img src={engine.icon} alt={engine.name} />
            {engine.name}
          </li>
        ))}
        <li className="add-new" onClick={onAddEngineClick}>
          + Add New
        </li>
      </ul>
    </div>
  );
}

export default SearchEngineMenu;

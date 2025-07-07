import React, { useEffect, useRef } from 'react';
import './SearchEngineMenu.css';

function SearchEngineMenu({ isVisible, onSelectEngine, searchEngines, onAddEngineClick, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  console.log('Rendering SearchEngineMenu with engines:', searchEngines);

  return (
    <div className="search-engine-menu" ref={menuRef}>
      <ul>
        {searchEngines.map((engine) => (
          <li key={engine.name} onClick={() => onSelectEngine(engine)}>
            <img src={engine.icon} alt={engine.name} />
            {engine.name}
          </li>
        ))}
        <li className="add-new" onClick={onAddEngineClick}>
          + Add
        </li>
      </ul>
    </div>
  );
}

export default SearchEngineMenu;

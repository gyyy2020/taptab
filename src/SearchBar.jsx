import React, { useState, useEffect, useRef } from 'react';
import SearchEngineMenu from './SearchEngineMenu';
import AddSearchEngineModal from './AddSearchEngineModal';
import './SearchBar.css';

const SearchBar = React.forwardRef((props, ref) => {
  const initialSearchEngines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [searchEngines, setSearchEngines] = useState(() => {
    const savedEngines = localStorage.getItem('searchEngines');
    const loadedEngines = savedEngines ? JSON.parse(savedEngines) : initialSearchEngines;
    console.log('Loaded searchEngines from localStorage:', loadedEngines);
    return loadedEngines;
  });
  const [selectedEngine, setSelectedEngine] = useState(() => {
    const savedSelectedEngine = localStorage.getItem('selectedEngine');
    let initialSelected = initialSearchEngines[0];

    if (savedSelectedEngine) {
      const parsedEngine = JSON.parse(savedSelectedEngine);
      // Try to find the loaded engine in the currently available engines (which includes initial and potentially loaded ones)
      const foundEngine = searchEngines.find(engine => engine.name === parsedEngine.name && engine.url === parsedEngine.url);
      if (foundEngine) {
        initialSelected = foundEngine;
      } else {
        // If the selected engine from localStorage is not in the current list, default to the first initial engine
        console.warn('Selected engine from localStorage not found in current engines. Defaulting.', parsedEngine);
      }
    }
    console.log('Initial selectedEngine:', initialSelected);
    return initialSelected;
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchBarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    }

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  useEffect(() => {
    localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
    console.log('Saved searchEngines to localStorage:', searchEngines);
  }, [searchEngines]);

  useEffect(() => {
    localStorage.setItem('selectedEngine', JSON.stringify(selectedEngine));
    console.log('Saved selectedEngine to localStorage:', selectedEngine);
  }, [selectedEngine]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `${selectedEngine.url}${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleEngineSelect = (engine) => {
    setSelectedEngine(engine);
    setIsMenuVisible(false);
  };

  const handleAddEngine = (newEngine) => {
    setSearchEngines((prevEngines) => {
      const updatedEngines = [...prevEngines, newEngine];
      return updatedEngines;
    });
  };

  const openAddEngineModal = () => {
    setIsMenuVisible(false); // Close search engine menu
    setIsModalVisible(true);
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch} ref={ref}>
      <button type="button" className="search-icon-button" onClick={() => setIsMenuVisible(!isMenuVisible)}>
        <img src={selectedEngine.icon} alt={selectedEngine.name} className="search-engine-icon" />
      </button>
      <input
        type="text"
        className="search-input"
        placeholder={`Search ${selectedEngine.name} or type a URL`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="magnifier-button">
        <i className="fas fa-search"></i>
      </button>
      <SearchEngineMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onSelectEngine={handleEngineSelect}
        searchEngines={searchEngines}
        onAddEngineClick={openAddEngineModal}
      />
      <AddSearchEngineModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddEngine={handleAddEngine}
      />
    </form>
  );
});

export default SearchBar;

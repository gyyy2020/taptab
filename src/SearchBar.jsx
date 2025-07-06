import React, { useState, useEffect, useRef } from 'react';
import SearchEngineMenu from './SearchEngineMenu';
import AddSearchEngineModal from './AddSearchEngineModal';
import './SearchBar.css';

function SearchBar() {
  const initialSearchEngines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [searchEngines, setSearchEngines] = useState(initialSearchEngines);
  const [selectedEngine, setSelectedEngine] = useState(initialSearchEngines[0]); // Default to Google
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
      console.log('Updated search engines:', updatedEngines);
      return updatedEngines;
    });
  };

  const openAddEngineModal = () => {
    setIsMenuVisible(false); // Close search engine menu
    setIsModalVisible(true);
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch} ref={searchBarRef}>
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
}

export default SearchBar;

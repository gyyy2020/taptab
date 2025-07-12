// Import necessary React hooks and components
import React, { useState, useEffect, useRef } from 'react';
import SearchEngineMenu from './SearchEngineMenu';
import AddSearchEngineModal from './AddSearchEngineModal';
import './SearchBar.css';

// Component for the search bar
const SearchBar = React.forwardRef(({ openInNewTab, ...props }, ref) => {
  // Initial list of search engines
  const initialSearchEngines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  // State variables for search term, menu visibility, and modal visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to get a cache key for a favicon URL
  const getFaviconCacheKey = (iconUrl) => {
    try {
      const urlObj = new URL(iconUrl);
      return `favicon_${urlObj.hostname}`;
    } catch (e) {
      return null;
    }
  };

  // Function to fetch and cache a favicon as a Base64 data URL
  const fetchAndCacheFavicon = async (iconUrl) => {
    const cacheKey = getFaviconCacheKey(iconUrl);
    if (!cacheKey) return iconUrl;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    try {
      const response = await fetch(iconUrl);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            localStorage.setItem(cacheKey, reader.result);
          } catch (e) {
            // Storage quota might be exceeded
          }
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return iconUrl;
    }
  };

  // State for the list of search engines, initialized from local storage or the initial list
  const [searchEngines, setSearchEngines] = useState(() => {
    const savedEngines = localStorage.getItem('searchEngines');
    const loadedEngines = savedEngines ? JSON.parse(savedEngines) : initialSearchEngines;
    // Attach cached favicons if available
    return loadedEngines.map(engine => {
      const cacheKey = getFaviconCacheKey(engine.icon);
      const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
      return { ...engine, icon: cached || engine.icon };
    });
  });

  // State for the selected search engine, initialized from local storage or the first engine in the list
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
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const searchBarRef = useRef(null);

  // Effect to save the list of search engines to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
  }, [searchEngines]);

  // Effect to save the selected search engine to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedEngine', JSON.stringify(selectedEngine));
  }, [selectedEngine]);

  // Handle form submission to perform a search
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.open(`${selectedEngine.url}${encodeURIComponent(searchTerm)}`, openInNewTab ? '_blank' : '_self');
    }
  };

  // Handle selection of a search engine from the menu
  const handleEngineSelect = (engine) => {
    setSelectedEngine(engine);
    setIsMenuVisible(false);
  };

  // Handle adding a new search engine
  const handleAddEngine = async (newEngine) => {
    // Fetch and cache favicon, then add engine with cached icon
    const iconDataUrl = await fetchAndCacheFavicon(newEngine.icon);
    setSearchEngines((prevEngines) => {
      const updatedEngines = [...prevEngines, { ...newEngine, icon: iconDataUrl }];
      return updatedEngines;
    });
  };

  // Open the modal to add a new search engine
  const openAddEngineModal = () => {
    setIsMenuVisible(false); // Close search engine menu
    setIsModalVisible(true);
  };

  // Render the search bar
  return (
    <form className="search-bar-container" onSubmit={handleSearch} ref={ref}>
      {/* Button to open the search engine menu */}
      <button type="button" className="search-icon-button" onClick={() => setIsMenuVisible(!isMenuVisible)}>
        <img src={selectedEngine.icon} alt={selectedEngine.name} className="search-engine-icon" />
      </button>
      {/* Input field for the search term */}
      <input
        type="text"
        className="search-input"
        placeholder={`Search ${selectedEngine.name} or type a URL`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Button to submit the search */}
      <button type="submit" className="magnifier-button">
        <i className="fas fa-search"></i>
      </button>
      {/* Search engine menu */}
      <SearchEngineMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onSelectEngine={handleEngineSelect}
        searchEngines={searchEngines}
        onAddEngineClick={openAddEngineModal}
      />
      {/* Modal to add a new search engine */}
      <AddSearchEngineModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddEngine={handleAddEngine}
      />
    </form>
  );
});

export default SearchBar;
// Import necessary React hooks and components for building the search bar feature.
import React, { useState, useEffect, useRef } from 'react';
// Import custom components for the search engine menu and the modal to add a new search engine.
import SearchEngineMenu from './SearchEngineMenu';
import AddSearchEngineModal from './AddSearchEngineModal';
// Import the stylesheet for the search bar.
import './SearchBar.css';

/**
 * A functional component that renders a search bar with a selectable search engine.
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.openInNewTab - A boolean to determine if the search results should open in a new tab.
 * @param {React.Ref} ref - A ref forwarded to the form element for DOM manipulation.
 * @returns {JSX.Element} The rendered search bar component.
 */
const SearchBar = React.forwardRef(({ openInNewTab, ...props }, ref) => {
  // Define the initial list of search engines. This list is used if no search engines are found in local storage.
  const initialSearchEngines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  // Declare state variables for the search term, the visibility of the search engine menu, and the modal for adding a new search engine.
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Generates a cache key for a given favicon URL.
   * @param {string} iconUrl - The URL of the favicon.
   * @returns {string|null} The cache key or null if the URL is invalid.
   */
  const getFaviconCacheKey = (iconUrl) => {
    try {
      const urlObj = new URL(iconUrl);
      return `favicon_${urlObj.hostname}`;
    } catch (e) {
      // Return null if the URL is invalid.
      return null;
    }
  };

  /**
   * Fetches a favicon from a given URL and caches it in local storage as a Base64 data URL.
   * @param {string} iconUrl - The URL of the favicon.
   * @returns {Promise<string>} A promise that resolves to the Base64 data URL of the favicon.
   */
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
            // Storage quota might be exceeded, so we just ignore the error.
            console.error('Failed to cache favicon:', e);
          }
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error('Failed to fetch favicon:', e);
      // If fetching fails, return the original icon URL.
      return iconUrl;
    }
  };

  // Initialize the list of search engines from local storage or the initial list.
  const [searchEngines, setSearchEngines] = useState(() => {
    const savedEngines = localStorage.getItem('searchEngines');
    const loadedEngines = savedEngines ? JSON.parse(savedEngines) : initialSearchEngines;
    // Attach cached favicons if available.
    return loadedEngines.map(engine => {
      const cacheKey = getFaviconCacheKey(engine.icon);
      const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
      return { ...engine, icon: cached || engine.icon };
    });
  });

  // Initialize the selected search engine from local storage or the first engine in the list.
  const [selectedEngine, setSelectedEngine] = useState(() => {
    const savedSelectedEngine = localStorage.getItem('selectedEngine');
    let initialSelected = initialSearchEngines[0];

    if (savedSelectedEngine) {
      const parsedEngine = JSON.parse(savedSelectedEngine);
      // Try to find the loaded engine in the currently available engines.
      const foundEngine = searchEngines.find(engine => engine.name === parsedEngine.name && engine.url === parsedEngine.url);
      if (foundEngine) {
        initialSelected = foundEngine;
      } else {
        // If the selected engine from localStorage is not in the current list, default to the first initial engine.
        console.warn('Selected engine from localStorage not found in current engines. Defaulting.', parsedEngine);
      }
    }
    console.log('Initial selectedEngine:', initialSelected);
    return initialSelected;
  });

  // Save the list of search engines to local storage whenever it changes.
  useEffect(() => {
    localStorage.setItem('searchEngines', JSON.stringify(searchEngines));
  }, [searchEngines]);

  // Save the selected search engine to local storage whenever it changes.
  useEffect(() => {
    localStorage.setItem('selectedEngine', JSON.stringify(selectedEngine));
  }, [selectedEngine]);

  /**
   * Handles the form submission to perform a search.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.open(`${selectedEngine.url}${encodeURIComponent(searchTerm)}`, openInNewTab ? '_blank' : '_self');
    }
  };

  /**
   * Handles the selection of a search engine from the menu.
   * @param {object} engine - The selected search engine.
   */
  const handleEngineSelect = (engine) => {
    setSelectedEngine(engine);
    setIsMenuVisible(false);
  };

  /**
   * Handles adding a new search engine to the list.
   * @param {object} newEngine - The new search engine to add.
   */
  const handleAddEngine = async (newEngine) => {
    // Fetch and cache the favicon, then add the new engine with the cached icon.
    const iconDataUrl = await fetchAndCacheFavicon(newEngine.icon);
    setSearchEngines((prevEngines) => {
      const updatedEngines = [...prevEngines, { ...newEngine, icon: iconDataUrl }];
      return updatedEngines;
    });
  };

  /**
   * Opens the modal to add a new search engine.
   */
  const openAddEngineModal = () => {
    setIsMenuVisible(false); // Close the search engine menu.
    setIsModalVisible(true);
  };

  // Render the search bar component.
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
      {/* Search engine menu, which is displayed when isMenuVisible is true */}
      <SearchEngineMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onSelectEngine={handleEngineSelect}
        searchEngines={searchEngines}
        onAddEngineClick={openAddEngineModal}
      />
      {/* Modal to add a new search engine, which is displayed when isModalVisible is true */}
      <AddSearchEngineModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddEngine={handleAddEngine}
      />
    </form>
  );
});

export default SearchBar;
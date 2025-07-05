import React, { useState, useEffect, useRef } from 'react';
import SearchEngineMenu from './SearchEngineMenu';
import './SearchBar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch} ref={searchBarRef}>
      <button type="button" className="search-icon-button" onClick={() => setIsMenuVisible(!isMenuVisible)}>
        <img src="https://www.google.com/favicon.ico" alt="Google" className="search-engine-icon" />
      </button>
      <input
        type="text"
        className="search-input"
        placeholder="Search Google or type a URL"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="magnifier-button">
        <i className="fas fa-search"></i>
      </button>
      <SearchEngineMenu isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
    </form>
  );
}

export default SearchBar;

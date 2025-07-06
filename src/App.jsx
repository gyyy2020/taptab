import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import TimeZoneSelector from './TimeZoneSelector';
import DateTimeDisplay from './DateTimeDisplay';
import SearchBar from './SearchBar';
import ShortcutsDisplay from './ShortcutsDisplay';
import './App.css';
import './GridLayout.css'; // Import the new CSS file

const initialAllShortcuts = {
  Common: [
    { i: 'google', x: 0, y: 0, w: 1, h: 1, name: 'Google', url: 'https://www.google.com' },
    { i: 'youtube', x: 1, y: 0, w: 1, h: 1, name: 'YouTube', url: 'https://www.youtube.com' },
    { i: 'facebook', x: 2, y: 0, w: 1, h: 1, name: 'Facebook', url: 'https://www.facebook.com' },
  ],
  AI: [
    { i: 'chatgpt', x: 0, y: 0, w: 1, h: 1, name: 'ChatGPT', url: 'https://chat.openai.com' },
    { i: 'bard', x: 1, y: 0, w: 1, h: 1, name: 'Bard', url: 'https://bard.google.com' },
  ],
  Code: [
    { i: 'github', x: 0, y: 0, w: 1, h: 1, name: 'GitHub', url: 'https://github.com' },
    { i: 'stackoverflow', x: 1, y: 0, w: 1, h: 1, name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  ],
  Info: [
    { i: 'wikipedia', x: 0, y: 0, w: 1, h: 1, name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { i: 'bbcnews', x: 1, y: 0, w: 1, h: 1, name: 'BBC News', url: 'https://www.bbc.com/news' },
  ],
  Learn: [
    { i: 'coursera', x: 0, y: 0, w: 1, h: 1, name: 'Coursera', url: 'https://www.coursera.org' },
    { i: 'edx', x: 1, y: 0, w: 1, h: 1, name: 'edX', url: 'https://www.edx.org' },
  ],
  Fun: [
    { i: 'netflix', x: 0, y: 0, w: 1, h: 1, name: 'Netflix', url: 'https://www.netflix.com' },
    { i: 'spotify', x: 1, y: 0, w: 1, h: 1, name: 'Spotify', url: 'https://www.spotify.com' },
  ],
};

function App() {
  const [selectedShortcutCategory, setSelectedShortcutCategory] = useState('Common');
  const [selectedTimeZone, setSelectedTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); // Default to local timezone

  const [allShortcuts, setAllShortcuts] = useState(() => {
    const savedShortcuts = localStorage.getItem('allShortcuts');
    return savedShortcuts ? JSON.parse(savedShortcuts) : initialAllShortcuts;
  });

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('layouts');
    return savedLayouts ? JSON.parse(savedLayouts) : {};
  });

  const mainContentRef = useRef(null);
  const dateTimeRef = useRef(null);
  const searchBarRef = useRef(null);
  const mottoRef = useRef(null);
  const [shortcutsHeight, setShortcutsHeight] = useState(0);

  useEffect(() => {
    const calculateShortcutsHeight = () => {
      if (mainContentRef.current && dateTimeRef.current && searchBarRef.current && mottoRef.current) {
        const mainContentRect = mainContentRef.current.getBoundingClientRect();
        const dateTimeRect = dateTimeRef.current.getBoundingClientRect();
        const searchBarRect = searchBarRef.current.getBoundingClientRect();
        const mottoRect = mottoRef.current.getBoundingClientRect();

        const mainContentStyle = getComputedStyle(mainContentRef.current);
        const dateTimeStyle = getComputedStyle(dateTimeRef.current);
        const searchBarStyle = getComputedStyle(searchBarRef.current);
        const mottoStyle = getComputedStyle(mottoRef.current);

        const mainContentPaddingTop = parseFloat(mainContentStyle.paddingTop);
        const mainContentPaddingBottom = parseFloat(mainContentStyle.paddingBottom);

        const dateTimeMarginBottom = parseFloat(dateTimeStyle.marginBottom);
        const searchBarMarginBottom = parseFloat(searchBarStyle.marginBottom);

        const usedHeight = dateTimeRect.height + dateTimeMarginBottom +
                           searchBarRect.height + searchBarMarginBottom +
                           mottoRect.height;

        const availableHeight = mainContentRect.height - mainContentPaddingTop - mainContentPaddingBottom - usedHeight;

        console.log('--- Height Calculation Debug ---');
        console.log('mainContentHeight:', mainContentRect.height);
        console.log('dateTimeHeight (with margin):', dateTimeRect.height + dateTimeMarginBottom);
        console.log('searchBarHeight (with margin):', searchBarRect.height + searchBarMarginBottom);
        console.log('mottoHeight:', mottoRect.height);
        console.log('mainContentPaddingTop:', mainContentPaddingTop);
        console.log('mainContentPaddingBottom:', mainContentPaddingBottom);
        console.log('usedHeight:', usedHeight);
        console.log('availableHeight for shortcuts:', availableHeight);

        setShortcutsHeight(availableHeight > 0 ? availableHeight : 0);
      }
    };

    calculateShortcutsHeight();
    window.addEventListener('resize', calculateShortcutsHeight);

    return () => {
      window.removeEventListener('resize', calculateShortcutsHeight);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('allShortcuts', JSON.stringify(allShortcuts));
  }, [allShortcuts]);

  useEffect(() => {
    localStorage.setItem('layouts', JSON.stringify(layouts));
  }, [layouts]);

  const onLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
    setAllShortcuts(prevAllShortcuts => {
      const newShortcutsForCategory = prevAllShortcuts[selectedShortcutCategory].map(shortcut => {
        const layoutItem = layout.find(item => item.i === shortcut.i);
        if (layoutItem) {
          return { ...shortcut, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
        }
        return shortcut;
      });
      return {
        ...prevAllShortcuts,
        [selectedShortcutCategory]: newShortcutsForCategory,
      };
    });
  };

  return (
    <div className="app-container">
      <Sidebar onSelectCategory={setSelectedShortcutCategory} />
      <div className="main-content" ref={mainContentRef}>
        <TimeZoneSelector onSelectTimeZone={setSelectedTimeZone} />
        <DateTimeDisplay ref={dateTimeRef} timeZone={selectedTimeZone} />
        <SearchBar ref={searchBarRef} />
        <ShortcutsDisplay
          category={selectedShortcutCategory}
          shortcuts={allShortcuts[selectedShortcutCategory]}
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          height={shortcutsHeight}
        />
        <div className="motto-line" ref={mottoRef}>
          <p>"The only way to do great work is to love what you do." - Steve Jobs</p>
        </div>
      </div>
    </div>
  );
}

export default App;

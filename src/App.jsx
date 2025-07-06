import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import TimeZoneSelector from './TimeZoneSelector';
import DateTimeDisplay from './DateTimeDisplay';
import SearchBar from './SearchBar';
import ShortcutsDisplay from './ShortcutsDisplay';
import './App.css';

function App() {
  const [selectedShortcutCategory, setSelectedShortcutCategory] = useState('Common');
  const [selectedTimeZone, setSelectedTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); // Default to local timezone

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

  return (
    <div className="app-container">
      <Sidebar onSelectCategory={setSelectedShortcutCategory} />
      <div className="main-content" ref={mainContentRef}>
        <TimeZoneSelector onSelectTimeZone={setSelectedTimeZone} />
        <DateTimeDisplay ref={dateTimeRef} timeZone={selectedTimeZone} />
        <SearchBar ref={searchBarRef} />
        <ShortcutsDisplay category={selectedShortcutCategory} height={shortcutsHeight} />
        <div className="motto-line" ref={mottoRef}>
          <p>"The only way to do great work is to love what you do." - Steve Jobs</p>
        </div>
      </div>
    </div>
  );
}

export default App;

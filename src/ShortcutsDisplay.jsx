// Import necessary components and libraries from React and other modules
import React, { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './ShortcutsDisplay.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import BirthdayWidget from './BirthdayWidget';
import YearProgressWidget from './YearProgressWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ShortcutsDisplay = ({ category, shortcuts, layouts, onLayoutChange, height, onShortcutContextMenu, openInNewTab }) => {

  const getFaviconCacheKey = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return `favicon_${hostname}`;
    } catch (e) {
      return null;
    }
  };

  const fetchAndCacheFavicon = async (url, shortcutId) => {
    const cacheKey = getFaviconCacheKey(url);
    if (!cacheKey) return;

    try {
      const response = await fetch(`https://favicon.im/${new URL(url).hostname}?larger=true`);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result;
        try {
          localStorage.setItem(cacheKey, base64data);
          setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: base64data }));
        } catch (e) {
          console.error("Failed to save favicon to localStorage", e);
          setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: `https://favicon.im/${new URL(url).hostname}?larger=true` }));
        }
      };
      reader.onerror = () => {
        setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: `https://favicon.im/${new URL(url).hostname}?larger=true` }));
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching favicon:', error);
      setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: `https://favicon.im/${new URL(url).hostname}?larger=true` }));
    }
  };

  // Initialize shortcutIcons state synchronously with cached data
  const [shortcutIcons, setShortcutIcons] = useState(() => {
    const initialIcons = {};
    shortcuts.forEach(shortcut => {
      if (shortcut.url) {
        const cacheKey = getFaviconCacheKey(shortcut.url);
        const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
        if (cached) {
          initialIcons[shortcut.i] = cached;
        }
      }
    });
    return initialIcons;
  });

  // Use useEffect to fetch uncached icons
  useEffect(() => {
    shortcuts.forEach(shortcut => {
      if (shortcut.url) {
        const cacheKey = getFaviconCacheKey(shortcut.url);
        const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
        if (!cached) { // Only fetch if not already cached
          fetchAndCacheFavicon(shortcut.url, shortcut.i);
        }
      }
    });
  }, [shortcuts]); // Re-run when shortcuts change

  const currentLayout = layouts[category] || shortcuts.map(s => ({ i: s.i, x: s.x, y: s.y, w: s.w, h: s.h }));
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false); // Corrected: should be useRef

  const handleDragStart = () => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false; // Corrected: use .current
  };

  const handleDrag = () => {
    hasDraggedRef.current = true; // Corrected: use .current
  };

  const handleDragStop = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
      hasDraggedRef.current = false; // Corrected: use .current
    }, 50);
  };

  const handleClick = (e) => {
    if (hasDraggedRef.current) { // Corrected: use .current
      e.preventDefault();
      hasDraggedRef.current = false; // Corrected: use .current
    }
  };

  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 2 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
        width={1200}
        onLayoutChange={(layout, newLayouts) => onLayoutChange(layout, newLayouts, category)}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        isDraggable={true}
        isResizable={true}
      >
        {shortcuts.map((shortcut) => (
          <div key={shortcut.i} data-grid={{ x: shortcut.x, y: shortcut.y, w: shortcut.w, h: shortcut.h }} className="shortcut-app" onContextMenu={(e) => onShortcutContextMenu(e, shortcut)}>
            {shortcut.component === 'BirthdayWidget' ? (
              <BirthdayWidget
                onClick={handleClick}
                onDragStart={(e) => e.preventDefault()}
              />
            ) : shortcut.component === 'YearProgressWidget' ? (
              <YearProgressWidget w={shortcut.w} h={shortcut.h} />
            ) : (
              <a
                href={shortcut.url}
                target={openInNewTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="shortcut-link"
                onClick={handleClick}
                onDragStart={(e) => e.preventDefault()}
              >
                <img src={shortcutIcons[shortcut.i] || `https://favicon.im/${new URL(shortcut.url).hostname}?larger=true`} alt="" className="shortcut-icon" />
                <span className="shortcut-name">{shortcut.name}</span>
              </a>
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ShortcutsDisplay;
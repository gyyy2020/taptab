import React, { useRef, useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './ShortcutsDisplay.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import BirthdayWidget from './BirthdayWidget';
import YearProgressWidget from './YearProgressWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ShortcutsDisplay = ({ category, shortcuts, layouts, onLayoutChange, height, onShortcutContextMenu, openInNewTab }) => {
  // Cache state for shortcut icons
  const [cachedShortcuts, setCachedShortcuts] = useState(shortcuts);

  // Helper to get a cache key for each shortcut
  const getShortcutIconCacheKey = (url) => {
    try {
      const urlObj = new URL(url);
      return `shortcut_icon_${urlObj.hostname}`;
    } catch {
      return null;
    }
  };

  // Helper to fetch and cache icon as Base64
  const fetchAndCacheShortcutIcon = async (iconUrl, cacheKey) => {
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
          } catch (e) {}
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return iconUrl;
    }
  };

  // On category or shortcuts change, ensure icons are cached
  useEffect(() => {
    let isMounted = true;
    const cacheIcons = async () => {
      const updatedShortcuts = await Promise.all(shortcuts.map(async (shortcut) => {
        if (shortcut.component) return shortcut; // widgets
        const cacheKey = getShortcutIconCacheKey(shortcut.url);
        let icon = shortcut.icon;
        if (!icon) {
          icon = `https://favicon.im/${shortcut.url}&sz=32`;
        }
        const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
        if (cached) {
          return { ...shortcut, icon: cached };
        } else {
          const dataUrl = await fetchAndCacheShortcutIcon(icon, cacheKey);
          return { ...shortcut, icon: dataUrl };
        }
      }));
      if (isMounted) setCachedShortcuts(updatedShortcuts);
    };
    cacheIcons();
    return () => { isMounted = false; };
  }, [category, shortcuts]);

  const currentLayout = layouts[category] || shortcuts.map(s => ({ i: s.i, x: s.x, y: s.y, w: s.w, h: s.h }));
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
  };

  const handleDrag = () => {
    hasDraggedRef.current = true;
  };

  const handleDragStop = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleClick = (e) => {
    // Only prevent click if a drag actually happened
    if (hasDraggedRef.current) {
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
        width={1200} // This will be overridden by WidthProvider
        onLayoutChange={(layout, newLayouts) => onLayoutChange(layout, newLayouts, category)}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        isDraggable={true}
        isResizable={true}
      >
        {cachedShortcuts.map((shortcut) => (
          <div key={shortcut.i} data-grid={{ x: shortcut.x, y: shortcut.y, w: shortcut.w, h: shortcut.h }} className="shortcut-app" onContextMenu={(e) => onShortcutContextMenu(e, shortcut)}>
            {shortcut.component === 'BirthdayWidget' ? (
              <BirthdayWidget
                onClick={handleClick}
                onDragStart={(e) => e.preventDefault()} // Prevents browser's default drag behavior for links
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
                onDragStart={(e) => e.preventDefault()} // Prevents browser's default drag behavior for links
              >
                <img src={shortcut.icon || `https://favicon.im/${shortcut.url}&sz=32`} alt="" className="shortcut-icon" />
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

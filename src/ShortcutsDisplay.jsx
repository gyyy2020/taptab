// Import necessary React hooks and components
import React, { useState, useEffect, useRef } from 'react';
// Import Responsive and WidthProvider from react-grid-layout for creating a responsive grid
import { Responsive, WidthProvider } from 'react-grid-layout';
// Import CSS files for styling the shortcuts display and grid layout
import './ShortcutsDisplay.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
// Import custom widget components
import BirthdayWidget from './BirthdayWidget';
import YearProgressWidget from './YearProgressWidget';

// Create a responsive grid layout component by wrapping Responsive with WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * ShortcutsDisplay Component
 * Displays a grid of shortcuts and widgets, handling layout, drag-and-drop, and icon caching.
 *
 * @param {object} props - The component props.
 * @param {string} props.category - The currently selected shortcut category.
 * @param {Array<object>} props.shortcuts - An array of shortcut objects to display.
 * @param {object} props.layouts - An object containing layout configurations for different categories.
 * @param {function} props.onLayoutChange - Callback function triggered when the grid layout changes.
 * @param {number} props.height - The height of the shortcuts display area.
 * @param {function} props.onShortcutContextMenu - Callback function for handling right-click context menu on a shortcut.
 * @param {boolean} props.openInNewTab - Determines if shortcuts should open in a new tab.
 */
const ShortcutsDisplay = ({ category, shortcuts, layouts, onLayoutChange, height, onShortcutContextMenu, openInNewTab }) => {

  /**
   * Generates a cache key for a favicon based on the URL's hostname.
   * @param {string} url - The URL of the shortcut.
   * @returns {string|null} The cache key or null if the URL is invalid.
   */
  const getFaviconCacheKey = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return `favicon_${hostname}`;
    } catch (e) {
      // Return null if the URL is malformed and hostname cannot be extracted
      return null;
    }
  };

  /**
   * Fetches a favicon for a given URL and caches it in localStorage.
   * It tries multiple favicon sources (favicon.im, Google's service) sequentially.
   * Updates the `shortcutIcons` state with the fetched (or fallback) icon.
   * @param {string} url - The URL of the shortcut.
   * @param {string} shortcutId - The unique ID of the shortcut.
   */
  const fetchAndCacheFavicon = async (url, shortcutId) => {
    const cacheKey = getFaviconCacheKey(url);
    if (!cacheKey) return; // Do not proceed if a valid cache key cannot be generated

    const hostname = new URL(url).hostname;
    // Define an array of favicon sources to try in order of preference
    const faviconSources = [
      `https://favicon.im/${hostname}?larger=true`,
      `https://www.google.com/s2/favicons?domain=${hostname}`
    ];

    let fetchedBase64 = null; // Stores the base64 data of the fetched icon
    let finalIconUrl = null;  // Stores the URL from which the icon was successfully fetched

    // Iterate through favicon sources to find a working one
    for (const sourceUrl of faviconSources) {
      try {
        const response = await fetch(sourceUrl);
        if (response.ok) {
          const blob = await response.blob();
          // Convert the fetched blob to a Base64 data URL
          fetchedBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          finalIconUrl = sourceUrl; // Keep track of the successful source URL
          break; // Exit loop on first successful fetch
        }
      } catch (error) {
        console.warn(`Failed to fetch favicon from ${sourceUrl}:`, error); // Log warnings for failed attempts
      }
    }

    // If an icon was successfully fetched from any source
    if (fetchedBase64) {
      try {
        localStorage.setItem(cacheKey, fetchedBase64); // Cache the base64 data
        // Update the state with the new base64 icon
        setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: fetchedBase64 }));
      } catch (e) {
        console.error("Failed to save favicon to localStorage", e);
        // If localStorage fails (e.g., quota exceeded), use the fetched URL directly without caching
        setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: fetchedBase64 }));
      }
    } else {
      // If all sources fail to fetch an icon, fall back to the original favicon.im URL as a last resort
      // This ensures there's always a URL, even if it might lead to a broken image.
      setShortcutIcons(prevIcons => ({ ...prevIcons, [shortcutId]: `https://favicon.im/${hostname}?larger=true` }));
    }
  };

  // State to store the icon URLs for each shortcut. Initialized synchronously from localStorage.
  const [shortcutIcons, setShortcutIcons] = useState({});

  // useEffect hook to fetch uncached icons when the shortcuts prop changes.
  // This ensures that new shortcuts or shortcuts without cached icons are fetched in the background.
  useEffect(() => {
    const newShortcutIcons = {};
    const fetchPromises = [];

    shortcuts.forEach(shortcut => {
      if (shortcut.url) {
        const cacheKey = getFaviconCacheKey(shortcut.url);
        const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
        if (cached) {
          newShortcutIcons[shortcut.i] = cached; // Use cached icon if available
        } else {
          // If not cached, initiate fetch and add to promises
          fetchPromises.push(fetchAndCacheFavicon(shortcut.url, shortcut.i));
        }
      }
    });

    // Update state with immediately available cached icons
    setShortcutIcons(newShortcutIcons);

    // Wait for all fetch promises to resolve (though individual fetches update state directly)
    Promise.all(fetchPromises).then(() => {
      // Optional: log or handle completion of all fetches
    });

  }, [shortcuts]); // Dependency array: re-run this effect when the `shortcuts` array changes

  // Determine the current layout for the given category, or create a default layout if none exists.
  const currentLayout = layouts[category] || shortcuts.map(s => ({ i: s.i, x: s.x, y: s.y, w: s.w, h: s.h }));

  // useRef to track if a drag operation is currently in progress.
  const isDraggingRef = useRef(false);
  // useRef to track if a drag has occurred, used to prevent click events after a drag.
  const hasDraggedRef = useRef(false);

  // Handler for when a drag operation starts.
  const handleDragStart = () => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false; // Reset hasDraggedRef at the start of a new drag
  };

  // Handler for when a drag operation is in progress.
  const handleDrag = () => {
    hasDraggedRef.current = true; // Set to true as soon as dragging occurs
  };

  // Handler for when a drag operation stops.
  const handleDragStop = () => {
    // Use a small timeout to differentiate between a click and a drag-then-release
    setTimeout(() => {
      isDraggingRef.current = false;
      hasDraggedRef.current = false; // Reset after a short delay
    }, 50);
  };

  // Handler for click events on shortcuts.
  // Prevents the default click action if a drag has just occurred.
  const handleClick = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault(); // Prevent navigation if it was a drag-click
      hasDraggedRef.current = false; // Reset for next interaction
    }
  };

  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }} // Apply the layout for the large breakpoint
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 2 }} // Define responsive breakpoints
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Define number of columns for each breakpoint
        rowHeight={50} // Set the height of each row in the grid
        width={1200} // This width is a placeholder and will be overridden by WidthProvider
        onLayoutChange={(layout, newLayouts) => onLayoutChange(layout, newLayouts, category)} // Callback for layout changes
        onDragStart={handleDragStart} // Callback for drag start event
        onDrag={handleDrag} // Callback for drag in progress event
        onDragStop={handleDragStop} // Callback for drag stop event
        isDraggable={true} // Enable drag functionality for grid items
        isResizable={true} // Enable resize functionality for grid items
      >
        {/* Map through the shortcuts array and render each shortcut or widget */}
        {shortcuts.map((shortcut) => (
          // Each shortcut is rendered within a div that acts as a grid item
          <div key={shortcut.i} data-grid={{ x: shortcut.x, y: shortcut.y, w: shortcut.w, h: shortcut.h }} className="shortcut-app" onContextMenu={(e) => onShortcutContextMenu(e, shortcut)}>
            {/* Conditionally render different components based on the shortcut's component type */}
            {shortcut.component === 'BirthdayWidget' ? (
              <BirthdayWidget
                onClick={handleClick}
                onDragStart={(e) => e.preventDefault()} // Prevent default browser drag behavior for links within the widget
              />
            ) : shortcut.component === 'YearProgressWidget' ? (
              <YearProgressWidget w={shortcut.w} h={shortcut.h} />
            ) : (
              // Default rendering for a standard shortcut (link with icon and name)
              <a
                href={shortcut.url}
                target={openInNewTab ? "_blank" : "_self"} // Open link in new tab or same tab based on prop
                rel="noopener noreferrer" // Security best practice for target="_blank"
                className="shortcut-link"
                onClick={handleClick} // Handle click events, preventing if it was a drag
                onDragStart={(e) => e.preventDefault()} // Prevent default browser drag behavior for the link
              >
                {/* Display the shortcut's icon. Uses cached icon if available, otherwise fetches or uses fallback. */}
                <img src={shortcutIcons[shortcut.i] || `https://favicon.im/${new URL(shortcut.url).hostname}?larger=true`} alt="" className="shortcut-icon" />
                {/* Display the name of the shortcut */}
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
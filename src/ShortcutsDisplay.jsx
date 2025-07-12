// Import necessary components and libraries from React and other modules
import React, { useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
// Import CSS files for styling
import './ShortcutsDisplay.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
// Import custom widget components
import BirthdayWidget from './BirthdayWidget';
import YearProgressWidget from './YearProgressWidget';

// Create a responsive grid layout component
const ResponsiveGridLayout = WidthProvider(Responsive);

// Component to display shortcuts in a grid layout
const ShortcutsDisplay = ({ category, shortcuts, layouts, onLayoutChange, height, onShortcutContextMenu, openInNewTab }) => {
  // Determine the current layout for the given category
  const currentLayout = layouts[category] || shortcuts.map(s => ({ i: s.i, x: s.x, y: s.y, w: s.w, h: s.h }));
  // Refs to track dragging state
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  // Set dragging state to true when a drag starts
  const handleDragStart = () => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
  };

  // Set hasDraggedRef to true when dragging is in progress
  const handleDrag = () => {
    hasDraggedRef.current = true;
  };

  // Reset dragging state after a short delay when a drag stops
  const handleDragStop = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
    }, 50);
  };

  // Prevent click events after a drag has occurred
  const handleClick = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  // Render the shortcuts display
  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }} // Set the layout for the large breakpoint
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} // Define breakpoints for responsiveness
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} // Define number of columns for each breakpoint
        rowHeight={50} // Set the height of each row
        width={1200} // This will be overridden by WidthProvider
        onLayoutChange={(layout, newLayouts) => onLayoutChange(layout, newLayouts, category)} // Callback for layout changes
        onDragStart={handleDragStart} // Callback for when a drag starts
        onDrag={handleDrag} // Callback for when dragging is in progress
        onDragStop={handleDragStop} // Callback for when a drag stops
        isDraggable={true} // Enable dragging
        isResizable={true} // Enable resizing
      >
        {/* Map through shortcuts and render them in the grid */}
        {shortcuts.map((shortcut) => (
          <div key={shortcut.i} data-grid={{ x: shortcut.x, y: shortcut.y, w: shortcut.w, h: shortcut.h }} className="shortcut-app" onContextMenu={(e) => onShortcutContextMenu(e, shortcut)}>
            {/* Conditionally render different components based on the shortcut type */}
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
                target={openInNewTab ? "_blank" : "_self"} // Open link in a new tab or the same tab
                rel="noopener noreferrer"
                className="shortcut-link"
                onClick={handleClick} // Handle click events
                onDragStart={(e) => e.preventDefault()} // Prevents browser's default drag behavior for links
              >
                {/* Display the favicon of the shortcut's URL */}
                <img src={`https://favicon.im/${new URL(shortcut.url).hostname}?larger=true`} alt="" className="shortcut-icon" />
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
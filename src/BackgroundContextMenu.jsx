// Import necessary React hooks and CSS for styling
import React, { useEffect, useRef } from 'react';
import './BackgroundContextMenu.css';

// Component for the background context menu
const BackgroundContextMenu = ({ x, y, visible, onAddShortcut, onSetting, onChangeWallpaper, onClose }) => {
  // Create a ref to hold the menu element
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the menu, call the onClose function
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when the menu is visible
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when the menu is not visible
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  // If the menu is not visible, do not render it
  if (!visible) {
    return null;
  }

  // Render the context menu at the specified x and y coordinates
  return (
    <div ref={menuRef} className="background-context-menu" style={{ top: y, left: x }}>
      <ul>
        {/* Menu item to add a new shortcut */}
        <li onClick={onAddShortcut}>Add Shortcut</li>
        {/* Menu item to go to settings */}
        <li onClick={onSetting}>Setting</li>
        {/* Menu item to change the wallpaper */}
        <li onClick={onChangeWallpaper}>Change Wallpaper</li>
      </ul>
    </div>
  );
};

export default BackgroundContextMenu;
// Import necessary React hooks and CSS for styling
import React, { useEffect, useRef } from 'react';
import './CategoryContextMenu.css';

// Component for the category context menu
const CategoryContextMenu = ({ x, y, visible, onEdit, onDelete, onClose }) => {
  // Create a ref to hold the menu element
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu to close it
  useEffect(() => {
    // If the menu is not visible, do nothing
    if (!visible) return;

    // Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
      // If the click is outside the menu, call the onClose function
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when the menu is visible
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  // If the menu is not visible, do not render it
  if (!visible) return null;

  // Render the context menu at the specified x and y coordinates
  return (
    <div
      className="category-context-menu"
      style={{ top: y, left: x }}
      ref={menuRef}
    >
      <ul>
        {/* Menu item to edit the category */}
        <li onClick={onEdit}>Edit</li>
        {/* Menu item to delete the category */}
        <li onClick={onDelete}>Delete</li>
      </ul>
    </div>
  );
};

export default CategoryContextMenu;
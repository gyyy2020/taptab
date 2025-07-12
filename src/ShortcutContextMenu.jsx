// Import necessary React hooks and CSS for styling
import React, { useEffect, useRef } from 'react';
import './ShortcutContextMenu.css';

// Component for the shortcut context menu
const ShortcutContextMenu = ({ x, y, visible, onEdit, onDelete, onClose }) => {
  // Create a ref to hold the menu element
  const menuRef = useRef(null);

  // Effect to handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  // If the menu is not visible, do not render it
  if (!visible) {
    return null;
  }

  // Handle the edit action
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  // Handle the delete action
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  // Render the context menu at the specified x and y coordinates
  return (
    <div ref={menuRef} className="shortcut-context-menu" style={{ top: y, left: x }}>
      <ul>
        {/* Menu item to edit the shortcut */}
        <li onClick={handleEdit}>Edit</li>
        {/* Menu item to delete the shortcut */}
        <li onClick={handleDelete}>Delete</li>
      </ul>
    </div>
  );
};

export default ShortcutContextMenu;
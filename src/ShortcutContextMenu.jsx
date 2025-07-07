import React, { useEffect, useRef } from 'react';
import './ShortcutContextMenu.css';

const ShortcutContextMenu = ({ x, y, visible, onEdit, onDelete, onClose }) => {
  const menuRef = useRef(null);

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

  if (!visible) {
    return null;
  }

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div ref={menuRef} className="shortcut-context-menu" style={{ top: y, left: x }}>
      <ul>
        <li onClick={handleEdit}>Edit</li>
        <li onClick={handleDelete}>Delete</li>
      </ul>
    </div>
  );
};

export default ShortcutContextMenu;

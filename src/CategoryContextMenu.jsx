import React, { useEffect, useRef } from 'react';
import './CategoryContextMenu.css';

const CategoryContextMenu = ({ x, y, visible, onEdit, onDelete, onClose }) => {
  const menuRef = useRef(null);
  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);
  if (!visible) return null;
  return (
    <div
      className="category-context-menu"
      style={{ top: y, left: x }}
      ref={menuRef}
    >
      <ul>
        <li onClick={onEdit}>Edit</li>
        <li onClick={onDelete}>Delete</li>
      </ul>
    </div>
  );
};

export default CategoryContextMenu;

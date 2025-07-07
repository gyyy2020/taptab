import React, { useEffect, useRef } from 'react';
import './BackgroundContextMenu.css';

const BackgroundContextMenu = ({ x, y, visible, onAddShortcut, onSetting, onChangeWallpaper, onClose }) => {
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

  return (
    <div ref={menuRef} className="background-context-menu" style={{ top: y, left: x }}>
      <ul>
        <li onClick={onAddShortcut}>Add Shortcut</li>
        <li onClick={onSetting}>Setting</li>
        <li onClick={onChangeWallpaper}>Change Wallpaper</li>
      </ul>
    </div>
  );
};

export default BackgroundContextMenu;

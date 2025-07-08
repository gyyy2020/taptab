import React, { useState, useRef, useEffect } from 'react';
import CategoryContextMenu from './CategoryContextMenu';
import './Sidebar.css';

const Sidebar = ({ onSelectCategory, onCategoryChange, onShowContextMenu, onShowSettings }) => {
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    return savedAvatar ? savedAvatar : null;
  });
  const fileInputRef = useRef(null);
  const [shortcuts, setShortcuts] = useState(() => {
    const savedShortcuts = localStorage.getItem('shortcuts');
    return savedShortcuts ? JSON.parse(savedShortcuts) : ["Common", "AI", "Code", "Info", "Learn", "Fun"];
  });
  const [selectedCategory, setSelectedCategory] = useState("Common"); // Default selected category

  useEffect(() => {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        localStorage.setItem('userAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const handleCategoryRightClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
    if (onShowContextMenu) {
      onShowContextMenu(
        e.clientX,
        e.clientY,
        category,
        handleEditCategory,
        handleDeleteCategory
      );
    }
  };

  const handleEditCategory = (category) => {
    const newName = prompt('Edit category name:', category);
    if (newName && newName !== category) {
      if (shortcuts.includes(newName)) {
        alert(`Category "${newName}" already exists. Please choose a different name.`);
        return;
      }
      const updatedShortcuts = shortcuts.map(cat => (cat === category ? newName : cat));
      setShortcuts(updatedShortcuts);
      if (selectedCategory === category) {
        setSelectedCategory(newName);
        onSelectCategory(newName);
      }
      if (onCategoryChange) {
        onCategoryChange(updatedShortcuts, 'edit', category, newName);
      }
    }
  };

  const handleDeleteCategory = (category) => {
    if (category === 'Common') {
      alert('The "Common" category cannot be deleted.');
      return;
    }
    if (window.confirm(`Delete category "${category}" and all its shortcuts?`)) {
      const newShortcuts = shortcuts.filter(cat => cat !== category);
      setShortcuts(newShortcuts);
      if (selectedCategory === category) {
        const newSelected = newShortcuts[0] || '';
        setSelectedCategory(newSelected);
        onSelectCategory(newSelected);
      }
      if (onCategoryChange) {
        onCategoryChange(newShortcuts, 'delete', category);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="avatar-container" onClick={handleAvatarClick}>
        {avatar ? (
          <img src={avatar} alt="Avatar" className="avatar" />
        ) : (
          <div className="default-avatar"></div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
      <div className="shortcuts-category">
        <ul>
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut}
              onClick={() => handleCategoryClick(shortcut)}
              onContextMenu={(e) => handleCategoryRightClick(e, shortcut)}
              className={selectedCategory === shortcut ? 'active' : ''}
            >
              {shortcut}
            </li>
          ))}
        </ul>
      </div>
      <div id="context-menu-root" />
      <div className="add-button" onClick={() => {
        const newCategory = prompt('Enter new category name:');
        if (newCategory && !shortcuts.includes(newCategory)) {
          const updatedShortcuts = [...shortcuts, newCategory];
          setShortcuts(updatedShortcuts);
          setSelectedCategory(newCategory);
          onSelectCategory(newCategory);
          if (onCategoryChange) {
            onCategoryChange(updatedShortcuts, 'add', null, newCategory);
          }
        } else if (newCategory) {
          alert('Category already exists or name is invalid.');
        }
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className="settings-button" onClick={onShowSettings}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </div>
  );
};

export default Sidebar;
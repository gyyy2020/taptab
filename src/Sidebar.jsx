import React, { useState, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelectCategory }) => {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const shortcuts = ["Common", "AI", "Code", "Info", "Learn", "Fun"];
  const [selectedCategory, setSelectedCategory] = useState("Common"); // Default selected category

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
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
      <div className="shortcuts">
        <ul>
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut}
              onClick={() => handleCategoryClick(shortcut)}
              className={selectedCategory === shortcut ? 'active' : ''}
            >
              {shortcut}
            </li>
          ))}
        </ul>
      </div>
      <div className="add-button">
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
      <div className="settings-button">
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
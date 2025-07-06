import React from 'react';
import './ShortcutsDisplay.css';

const ShortcutsDisplay = ({ category, height }) => {
  const allShortcuts = {
    Common: [
      { name: 'Google', url: 'https://www.google.com' },
      { name: 'YouTube', url: 'https://www.youtube.com' },
      { name: 'Facebook', url: 'https://www.facebook.com' },
    ],
    AI: [
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Bard', url: 'https://bard.google.com' },
    ],
    Code: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    ],
    Info: [
      { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
      { name: 'BBC News', url: 'https://www.bbc.com/news' },
    ],
    Learn: [
      { name: 'Coursera', url: 'https://www.coursera.org' },
      { name: 'edX', url: 'https://www.edx.org' },
    ],
    Fun: [
      { name: 'Netflix', url: 'https://www.netflix.com' },
      { name: 'Spotify', url: 'https://www.spotify.com' },
    ],
  };

  const shortcutsToDisplay = allShortcuts[category] || [];

  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto', overflowY: 'auto' }}>
      {/* <h2>{category} Shortcuts</h2> */}
      <ul>
        {shortcutsToDisplay.map((shortcut) => (
          <li key={shortcut.name}>
            <a href={shortcut.url} target="_blank" rel="noopener noreferrer">
              {shortcut.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShortcutsDisplay;

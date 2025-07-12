// Import necessary React hooks and CSS for styling
import React, { useState, useEffect, useRef } from 'react';
import './SettingsPage.css';

// Component for the settings page
const SettingsPage = ({ visible, onClose, onSettingChange, currentSettings }) => {
  // State to hold temporary settings before saving
  const [tempSettings, setTempSettings] = useState(currentSettings);
  // Ref to the settings page element
  const settingsRef = useRef(null);

  // Effect to update temporary settings when current settings change
  useEffect(() => {
    setTempSettings(currentSettings);
  }, [currentSettings]);

  // Effect to handle clicks outside the settings page to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
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

  // If the settings page is not visible, do not render it
  if (!visible) {
    return null;
  }

  // Handle changes to settings inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedSettings = {
      ...tempSettings,
      [name]: type === 'checkbox' ? checked : value
    };
    setTempSettings(updatedSettings);
    onSettingChange(updatedSettings);
  };

  // Handle saving the settings
  const handleSave = () => {
    onSettingChange(tempSettings);
  };

  // Handle resetting all settings to default
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      const defaultSettings = {}; // Define your default settings here if needed
      onSettingChange(defaultSettings);
    }
  };

  // Handle backing up settings to a JSON file
  const handleBackup = () => {
    const keysToBackup = ['userAvatar', 'appSettings', 'allShortcuts', 'searchEngines', 'selectedEngine', 'layouts'];
    const backupData = {};

    keysToBackup.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          backupData[key] = JSON.parse(item);
        } catch (e) {
          backupData[key] = item;
        }
      }
    });

    const data = JSON.stringify(backupData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'new-tab-ext-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle importing settings from a JSON file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (window.confirm("Importing settings will overwrite current settings. Continue?")) {
            for (const key in importedData) {
              const value = importedData[key];
              localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
            alert("Settings imported successfully! Please refresh the page.");
            window.location.reload();
          }
        } catch (error) {
          alert(`Failed to import settings: ${error.message}. Please ensure the file is a valid backup JSON.`);
          console.error("Import error:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Render the settings page
  return (
    <div className={`settings-page-content ${visible ? 'visible' : ''}`} ref={settingsRef}>
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>General</h3>
        <label>
          <input
            type="checkbox"
            name="openShortcutsInNewTab"
            checked={tempSettings.openShortcutsInNewTab || false}
            onChange={handleChange}
          />
          Open shortcuts in new tab
        </label>
        <label>
          <input
            type="checkbox"
            name="openSearchResultsInNewTab"
            checked={tempSettings.openSearchResultsInNewTab || false}
            onChange={handleChange}
          />
          Open search results in new tab
        </label>

      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        <label>
          Font Size (Date/Time):
          <input
            type="range"
            name="dateTimeFontSize"
            min="10"
            max="50"
            value={tempSettings.dateTimeFontSize || 24}
            onChange={handleChange}
          />
          <span>{tempSettings.dateTimeFontSize || 24}px</span>
        </label>
        <label>
          Select Local Picture:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  onSettingChange({ ...tempSettings, wallpaper: event.target.result, wallpaperFileName: file.name });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </div>

      <div className="settings-section">
        <h3>Layout</h3>
        <label>
          <input
            type="checkbox"
            name="simpleMode"
            checked={tempSettings.simpleMode || false}
            onChange={handleChange}
          />
          Simple Mode (Search box only, centered)
        </label>
        <label>
          Motto:
          <input
            type="text"
            name="mottoText"
            value={tempSettings.mottoText || ''}
            onChange={handleChange}
            placeholder="Enter your motto"
          />
        </label>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <button onClick={handleBackup}>Backup Settings</button>
        <label className="import-button">
          Import Settings
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <button onClick={handleReset}>Reset All Settings</button>
      </div>

      <div className="settings-section">
        <h3>About</h3>
        <p>The Greatest Tab Extension v1.0.0</p>
        <p>Developed by LoveHipper</p>
      </div>


    </div>
  );
};

export default SettingsPage;
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ReactDOM from 'react-dom';
import CategoryContextMenu from './CategoryContextMenu';
import ShortcutContextMenu from './ShortcutContextMenu';
import BackgroundContextMenu from './BackgroundContextMenu';
import AddShortcutModal from './AddShortcutModal';
import EditShortcutModal from './EditShortcutModal';
import SettingsPage from './SettingsPage';
import TimeZoneSelector from './TimeZoneSelector';
import DateTimeDisplay from './DateTimeDisplay';
import SearchBar from './SearchBar';
import ShortcutsDisplay from './ShortcutsDisplay';
import './App.css';
import './GridLayout.css'; // Import the new CSS file
import BirthdayWidget from './BirthdayWidget';
import YearProgressWidget from './YearProgressWidget';
import WeatherWidget from './WeatherWidget';

const initialAllShortcuts = {
  Common: [
    { i: 'google', x: 0, y: 0, w: 1, h: 1, name: 'Google', url: 'https://www.google.com' },
    { i: 'youtube', x: 1, y: 0, w: 1, h: 1, name: 'YouTube', url: 'https://www.youtube.com' },
    { i: 'facebook', x: 2, y: 0, w: 1, h: 1, name: 'Facebook', url: 'https://www.facebook.com' },
    { i: 'birthday-widget', x: 3, y: 0, w: 1, h: 1, name: 'Birthday', component: 'BirthdayWidget' },
    { i: 'year-progress-widget', x: 4, y: 0, w: 1, h: 1, name: 'Year Progress', component: 'YearProgressWidget' },
  ],
  AI: [
    { i: 'chatgpt', x: 0, y: 0, w: 1, h: 1, name: 'ChatGPT', url: 'https://chat.openai.com' },
    { i: 'bard', x: 1, y: 0, w: 1, h: 1, name: 'Bard', url: 'https://bard.google.com' },
  ],
  Code: [
    { i: 'github', x: 0, y: 0, w: 1, h: 1, name: 'GitHub', url: 'https://github.com' },
    { i: 'stackoverflow', x: 1, y: 0, w: 1, h: 1, name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  ],
  Info: [
    { i: 'wikipedia', x: 0, y: 0, w: 1, h: 1, name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { i: 'bbcnews', x: 1, y: 0, w: 1, h: 1, name: 'BBC News', url: 'https://www.bbc.com/news' },
  ],
  Learn: [
    { i: 'coursera', x: 0, y: 0, w: 1, h: 1, name: 'Coursera', url: 'https://www.coursera.org' },
    { i: 'edx', x: 1, y: 0, w: 1, h: 1, name: 'edX', url: 'https://www.edx.org' },
  ],
  Fun: [
    { i: 'netflix', x: 0, y: 0, w: 1, h: 1, name: 'Netflix', url: 'https://www.netflix.com' },
    { i: 'spotify', x: 1, y: 0, w: 1, h: 1, name: 'Spotify', url: 'https://www.spotify.com' },
  ],
};

function App() {
  const [selectedShortcutCategory, setSelectedShortcutCategory] = useState('Common');
  const [selectedTimeZone, setSelectedTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); // Default to local timezone

  const [allShortcuts, setAllShortcuts] = useState(() => {
    const savedShortcuts = localStorage.getItem('allShortcuts');
    let shortcuts = savedShortcuts ? JSON.parse(savedShortcuts) : initialAllShortcuts;

    // Ensure birthday-widget is always in Common category
    if (shortcuts.Common && !shortcuts.Common.some(s => s.i === 'birthday-widget')) {
      shortcuts.Common.push({ i: 'birthday-widget', x: 3, y: 0, w: 2, h: 2, name: 'Birthday', component: 'BirthdayWidget' });
    }

    return shortcuts;
  });

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('layouts');
    return savedLayouts ? JSON.parse(savedLayouts) : {};
  });

  const mainContentRef = useRef(null);
  const dateTimeRef = useRef(null);
  const searchBarRef = useRef(null);
  const mottoRef = useRef(null);
  const sidebarRef = useRef(null);
  const weatherWidgetRef = useRef(null);
  const [shortcutsHeight, setShortcutsHeight] = useState(0);

  // Context menu state and handlers for category
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, category: null, onEdit: null, onDelete: null });

  // Pass handler to Sidebar to trigger context menu at root
  const handleSidebarContextMenu = (x, y, category, onEdit, onDelete) => {
    setContextMenu({
      visible: true,
      x,
      y,
      category,
      onEdit: () => { onEdit(category); setContextMenu((c) => ({ ...c, visible: false })); },
      onDelete: () => { onDelete(category); setContextMenu((c) => ({ ...c, visible: false })); },
    });
  };

  const handleCloseContextMenu = () => setContextMenu((c) => ({ ...c, visible: false }));

  useEffect(() => {
    const calculateShortcutsHeight = () => {
      if (mainContentRef.current && dateTimeRef.current && searchBarRef.current && mottoRef.current) {
        const mainContentRect = mainContentRef.current.getBoundingClientRect();
        const dateTimeRect = dateTimeRef.current.getBoundingClientRect();
        const searchBarRect = searchBarRef.current.getBoundingClientRect();
        const mottoRect = mottoRef.current.getBoundingClientRect();

        const mainContentStyle = getComputedStyle(mainContentRef.current);
        const dateTimeStyle = getComputedStyle(dateTimeRef.current);
        const searchBarStyle = getComputedStyle(searchBarRef.current);
        const mottoStyle = getComputedStyle(mottoRef.current);

        const mainContentPaddingTop = parseFloat(mainContentStyle.paddingTop);
        const mainContentPaddingBottom = parseFloat(mainContentStyle.paddingBottom);

        const dateTimeMarginBottom = parseFloat(dateTimeStyle.marginBottom);
        const searchBarMarginBottom = parseFloat(searchBarStyle.marginBottom);

        const usedHeight = dateTimeRect.height + dateTimeMarginBottom +
                           searchBarRect.height + searchBarMarginBottom +
                           mottoRect.height;

        const availableHeight = mainContentRect.height - mainContentPaddingTop - mainContentPaddingBottom - usedHeight;

        console.log('--- Height Calculation Debug ---');
        console.log('mainContentHeight:', mainContentRect.height);
        console.log('dateTimeHeight (with margin):', dateTimeRect.height + dateTimeMarginBottom);
        console.log('searchBarHeight (with margin):', searchBarRect.height + searchBarMarginBottom);
        console.log('mottoHeight:', mottoRect.height);
        console.log('mainContentPaddingTop:', mainContentPaddingTop);
        console.log('mainContentPaddingBottom:', mainContentPaddingBottom);
        console.log('usedHeight:', usedHeight);
        console.log('availableHeight for shortcuts:', availableHeight);

        setShortcutsHeight(availableHeight > 0 ? availableHeight : 0);
      }
    };

    calculateShortcutsHeight();
    window.addEventListener('resize', calculateShortcutsHeight);

    return () => {
      window.removeEventListener('resize', calculateShortcutsHeight);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('allShortcuts', JSON.stringify(allShortcuts));
  }, [allShortcuts]);

  useEffect(() => {
    localStorage.setItem('layouts', JSON.stringify(layouts));
  }, [layouts]);

  const onLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
    setAllShortcuts(prevAllShortcuts => {
      const newShortcutsForCategory = prevAllShortcuts[selectedShortcutCategory].map(shortcut => {
        const layoutItem = layout.find(item => item.i === shortcut.i);
        if (layoutItem) {
          return { ...shortcut, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
        }
        return shortcut;
      });
      return {
        ...prevAllShortcuts,
        [selectedShortcutCategory]: newShortcutsForCategory,
      };
    });
  };

  // Handler to sync category changes from Sidebar (add/edit/delete)
  const handleCategoryChange = (newCategoryList, action, oldCategory, newCategory) => {
    // If a category is added, add an empty shortcuts array and layout
    if (action === 'add' && newCategory) {
      setAllShortcuts(prev => ({ ...prev, [newCategory]: [] }));
      setLayouts(prev => ({ ...prev, [newCategory]: [] }));
      setSelectedShortcutCategory(newCategory);
    }
    // If a category is renamed, update allShortcuts and layouts keys
    if (action === 'edit' && oldCategory && newCategory) {
      setAllShortcuts(prev => {
        const updated = { ...prev };
        if (updated[oldCategory]) {
          updated[newCategory] = updated[oldCategory];
          delete updated[oldCategory];
        }
        return updated;
      });
      setLayouts(prev => {
        const updated = { ...prev };
        if (updated[oldCategory]) {
          updated[newCategory] = updated[oldCategory];
          delete updated[oldCategory];
        }
        return updated;
      });
      if (selectedShortcutCategory === oldCategory) {
        setSelectedShortcutCategory(newCategory);
      }
    }
    // If a category is deleted, remove from allShortcuts and layouts
    if (action === 'delete' && oldCategory) {
      setAllShortcuts(prev => {
        const updated = { ...prev };
        delete updated[oldCategory];
        return updated;
      });
      setLayouts(prev => {
        const updated = { ...prev };
        delete updated[oldCategory];
        return updated;
      });
      if (selectedShortcutCategory === oldCategory) {
        setSelectedShortcutCategory(newCategoryList[0] || '');
      }
    }
  };

  

  

  const [shortcutContextMenu, setShortcutContextMenu] = useState({ visible: false, x: 0, y: 0, shortcut: null });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [backgroundContextMenu, setBackgroundContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isSettingsPageVisible, setIsSettingsPageVisible] = useState(false);
  const [appSettings, setAppSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? { ...JSON.parse(savedSettings), simpleMode: JSON.parse(savedSettings).simpleMode || false } : { simpleMode: false };
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    console.log('App.jsx - appSettings.simpleMode:', appSettings.simpleMode);
  }, [appSettings]);

  const handleShowAddShortcutModal = () => {
    setIsAddModalVisible(true);
    handleCloseBackgroundContextMenu();
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setBackgroundContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleCloseBackgroundContextMenu = () => {
    setBackgroundContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleSetting = () => {
    setIsSettingsPageVisible(true);
    handleCloseBackgroundContextMenu();
  };

  const wallpaperInputRef = useRef(null);

  const handleChangeWallpaper = () => {
    wallpaperInputRef.current.click();
    handleCloseBackgroundContextMenu();
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAppSettings(prevSettings => ({
          ...prevSettings,
          wallpaper: event.target.result,
          wallpaperFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (newSettings) => {
    setAppSettings(newSettings);
  };

  const handleCloseSettings = () => {
    setIsSettingsPageVisible(false);
  };

  const handleSaveNewShortcut = ({ name, url }) => {
    const newShortcut = {
      i: `new-${new Date().getTime()}`,
      x: (allShortcuts[selectedShortcutCategory].length * 2) % 12,
      y: Infinity, // This will be handled by react-grid-layout
      w: 1,
      h: 1,
      name,
      url,
    };
    const updatedShortcuts = [...allShortcuts[selectedShortcutCategory], newShortcut];
    setAllShortcuts({ ...allShortcuts, [selectedShortcutCategory]: updatedShortcuts });
    setIsAddModalVisible(false);
  };

  const handleShortcutContextMenu = (e, shortcut) => {
    e.preventDefault();
    setShortcutContextMenu({ visible: true, x: e.clientX, y: e.clientY, shortcut });
  };

  const handleCloseShortcutContextMenu = () => {
    setShortcutContextMenu({ visible: false, x: 0, y: 0, shortcut: null });
  };

  const handleEditShortcut = () => {
    const { shortcut } = shortcutContextMenu;
    if (!shortcut) return;

    setEditingShortcut(shortcut);
    setIsEditModalVisible(true);
    handleCloseShortcutContextMenu();
  };

  const handleSaveShortcut = (updatedShortcut) => {
    const updatedShortcuts = allShortcuts[selectedShortcutCategory].map(s =>
      s.i === updatedShortcut.i ? updatedShortcut : s
    );
    setAllShortcuts({ ...allShortcuts, [selectedShortcutCategory]: updatedShortcuts });
    setIsEditModalVisible(false);
    setEditingShortcut(null);
  };

  const handleDeleteShortcut = () => {
    const { shortcut } = shortcutContextMenu;
    if (!shortcut) return;

    if (window.confirm(`Are you sure you want to delete ${shortcut.name}?`)) {
      const updatedShortcuts = allShortcuts[selectedShortcutCategory].filter(s => s.i !== shortcut.i);
      setAllShortcuts({ ...allShortcuts, [selectedShortcutCategory]: updatedShortcuts });
    }
    handleCloseShortcutContextMenu();
  };

  const handleGlobalContextMenu = (e) => {
    e.preventDefault();

    // Check if the click is on a shortcut element
    const shortcutElement = e.target.closest('.shortcut-app');
    if (shortcutElement) {
      // Find the shortcut object based on the element's data-grid-id or similar
      // This assumes you have a way to map the DOM element back to your shortcut data
      // For now, we'll just prevent default and let the shortcut's own handler take over
      return;
    }

    // Check if the click is on the sidebar
    if (sidebarRef.current && sidebarRef.current.contains(e.target)) {
      // Sidebar has its own context menu handling
      return;
    }

    // Check if the click is on the weather widget
    if (weatherWidgetRef.current && weatherWidgetRef.current.contains(e.target)) {
      // Weather widget has its own click handling, no context menu needed here
      return;
    }

    // If not on a specific element, show the background context menu
    setBackgroundContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="app-container" onContextMenu={handleGlobalContextMenu} style={appSettings.wallpaper ? { backgroundImage: `url(${appSettings.wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {!appSettings.simpleMode && (
        <Sidebar
          ref={sidebarRef}
          onSelectCategory={setSelectedShortcutCategory}
          onCategoryChange={handleCategoryChange}
          onShowContextMenu={handleSidebarContextMenu}
          onShowSettings={handleSetting}
        />
      )}
      {!appSettings.simpleMode && <WeatherWidget ref={weatherWidgetRef} />}
      <div className={`main-content ${appSettings.simpleMode ? 'simple-mode' : ''}`} ref={mainContentRef}>
        {appSettings.simpleMode ? null : <TimeZoneSelector onSelectTimeZone={setSelectedTimeZone} />}
        <DateTimeDisplay ref={dateTimeRef} timeZone={selectedTimeZone} />
        <SearchBar ref={searchBarRef} openInNewTab={appSettings.openSearchResultsInNewTab} />
        {!appSettings.simpleMode && (
          <ShortcutsDisplay
            category={selectedShortcutCategory}
            shortcuts={allShortcuts[selectedShortcutCategory]}
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            height={shortcutsHeight}
            onShortcutContextMenu={handleShortcutContextMenu}
            openInNewTab={appSettings.openShortcutsInNewTab}
          />
        )}
        {!appSettings.simpleMode && (
          <div className="motto-line" ref={mottoRef}>
            <p>{appSettings.mottoText || ""}</p>
          </div>
        )}
      </div>
      {typeof window !== 'undefined' && document.getElementById('context-menu-root') &&
        ReactDOM.createPortal(
          <CategoryContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            visible={contextMenu.visible}
            onEdit={contextMenu.onEdit}
            onDelete={contextMenu.onDelete}
            onClose={handleCloseContextMenu}
          />, document.getElementById('context-menu-root')
        )
      }
      <ShortcutContextMenu
        x={shortcutContextMenu.x}
        y={shortcutContextMenu.y}
        visible={shortcutContextMenu.visible}
        onEdit={handleEditShortcut}
        onDelete={handleDeleteShortcut}
        onClose={handleCloseShortcutContextMenu}
      />
      <EditShortcutModal
        visible={isEditModalVisible}
        shortcut={editingShortcut}
        onSave={handleSaveShortcut}
        onCancel={() => setIsEditModalVisible(false)}
      />
      <AddShortcutModal
        visible={isAddModalVisible}
        onSave={handleSaveNewShortcut}
        onCancel={() => setIsAddModalVisible(false)}
      />
      <BackgroundContextMenu
        x={backgroundContextMenu.x}
        y={backgroundContextMenu.y}
        visible={backgroundContextMenu.visible}
        onAddShortcut={handleShowAddShortcutModal}
        onSetting={handleSetting}
        onChangeWallpaper={handleChangeWallpaper}
        onClose={handleCloseBackgroundContextMenu}
      />
      <SettingsPage
        visible={isSettingsPageVisible}
        onClose={handleCloseSettings}
        onSettingChange={handleSaveSettings}
        currentSettings={appSettings}
      />
      <input
        type="file"
        accept="image/*"
        ref={wallpaperInputRef}
        onChange={handleWallpaperChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default App;

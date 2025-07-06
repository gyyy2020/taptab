import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './ShortcutsDisplay.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ShortcutsDisplay = ({ category, shortcuts, layouts, onLayoutChange, height }) => {
  const currentLayout = layouts[category] || shortcuts.map(s => ({ i: s.i, x: s.x, y: s.y, w: s.w, h: s.h }));

  return (
    <div className="shortcuts-display" style={{ height: height ? `${height}px` : 'auto' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
        width={1200} // This will be overridden by WidthProvider
        onLayoutChange={(layout, newLayouts) => onLayoutChange(layout, newLayouts, category)}
        isDraggable={true}
        isResizable={true}
      >
        {shortcuts.map((shortcut) => (
          <div key={shortcut.i} data-grid={{ x: shortcut.x, y: shortcut.y, w: shortcut.w, h: shortcut.h }}>
            <a href={shortcut.url} target="_blank" rel="noopener noreferrer">
              {shortcut.name}
            </a>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ShortcutsDisplay;

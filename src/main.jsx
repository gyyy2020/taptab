// Import necessary libraries from React and ReactDOM
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import the main CSS file for global styles
import './index.css';
// Import the main App component
import App from './App.jsx';

// Create a root element and render the App component within it
createRoot(document.getElementById('root')).render(
  // Use StrictMode for highlighting potential problems in an application
  <StrictMode>
    <App />
  </StrictMode>,
);
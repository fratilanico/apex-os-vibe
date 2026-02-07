
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 🛡️ P0 PROTECTION: Suppress malformed resource errors from browser extensions
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('data:;base64,=') || args[0]?.message?.includes?.('data:;base64,=')) {
      return;
    }
    originalError.apply(console, args);
  };
  
  // Also suppress runtime extension errors visible in user image
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('solana') || event.reason?.message?.includes('Phantom')) {
      event.preventDefault();
    }
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

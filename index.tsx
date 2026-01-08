import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode is temporarily removed to prevent double-init issues with LIFF/PeerJS in dev
  // <React.StrictMode> 
    <App />
  // </React.StrictMode>
);
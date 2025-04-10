
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React from 'react';

// Wrap the App component in StrictMode at the root level
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

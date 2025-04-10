
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root outside of StrictMode
createRoot(document.getElementById("root")!).render(<App />);

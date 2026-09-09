// Entry point of the app: mounts the React app onto the HTML page.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Render the main <App /> component into the <div id="root"> element.
// StrictMode helps catch bugs during development.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

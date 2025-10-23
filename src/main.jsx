import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { SidebarProvider } from './core/Components/sidebarCntext.jsx'
import { ToastProvider } from './core/Components/Toast.jsx'
import { ThemeProvider } from './core/context/ThemeContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

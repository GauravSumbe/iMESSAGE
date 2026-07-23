import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
   <StrictMode>
    <ClerkProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

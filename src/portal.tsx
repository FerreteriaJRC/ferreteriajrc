import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ClientPortalLogin from './components/ClientPortalLogin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientPortalLogin />
  </StrictMode>,
)

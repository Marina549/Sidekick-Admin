import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './pds/index.css';
import './styles/app.css';
import './styles/controls.css';
import './styles/screens.css';
import './styles/flow.css';
import './styles/responsive.css';
import { App } from './App';
import { AdminProvider } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </StrictMode>,
);

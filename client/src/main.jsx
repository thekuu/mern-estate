import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// In production, route all /api/* calls directly to the backend server.
// VITE_API_URL is empty in development so the Vite proxy handles it as normal.
const _fetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = (import.meta.env.VITE_API_URL ?? '') + input;
  }
  return _fetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

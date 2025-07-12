import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Aplica dark mode antes da renderização
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BookProvider } from './context/BookContext'; // Impor Provider kita
import App from './App';
import './App.css'; // Impor CSS Global (dari Fase 1)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Bungkus App dengan BrowserRouter, lalu BookProvider.
      Urutan ini penting.
    */}
    <BrowserRouter>
      <BookProvider>
        <App />
      </BookProvider>
    </BrowserRouter>
  </React.StrictMode>
);
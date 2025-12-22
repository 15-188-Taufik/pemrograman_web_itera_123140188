// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Uncomment (aktifkan) baris ini
import Header from './components/Header/Header';

// Impor halaman-halaman placeholder kita
import HomePage from './pages/HomePage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="App">
      {/* 2. Uncomment (aktifkan) baris ini */}
      <Header />
      
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddBookPage />} />
          <Route path="/edit/:id" element={<EditBookPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
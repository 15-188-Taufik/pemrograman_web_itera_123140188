// src/pages/AboutPage.js

import React from 'react';
import { useBookStats } from '../hooks/useBookStats'; // Impor hook statistik baru kita
import './AboutPage.css'; // Kita akan buat file CSS ini

const AboutPage = () => {
  // Panggil hook untuk mendapatkan data statistik terbaru
  const stats = useBookStats();

  return (
    <div className="about-page-container">
      {/* Card pertama untuk deskripsi aplikasi */}
      <div className="about-card card">
        <h2>About My Books</h2>
        <p>
          Aplikasi ini adalah manajer buku pribadi yang dibuat menggunakan React.
        </p>
        <p>
          Dibuat dengan fungsionalitas modern React termasuk:
        </p>
        <ul>
          <li>React Hooks (<code>useState</code>, <code>useEffect</code>, <code>useMemo</code>)</li>
          <li>Context API untuk Global State Management</li>
          <li>React Router untuk Navigasi Multi-Halaman</li>
          <li>Custom Hooks (<code>useLocalStorage</code>, <code>useBookStats</code>)</li>
          <li>Penyimpanan data persisten via <code>localStorage</code></li>
        </ul>
      </div>

      {/* Card kedua untuk statistik */}
      <div className="stats-card card">
        <h2>Your Collection Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Books</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.owned}</span>
            <span className="stat-label">Owned</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.reading}</span>
            <span className="stat-label">Reading</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.wishlist}</span>
            <span className="stat-label">Wishlist</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
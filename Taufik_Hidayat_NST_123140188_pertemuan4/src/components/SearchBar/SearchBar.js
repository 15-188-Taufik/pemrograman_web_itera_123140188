// src/components/SearchBar/SearchBar.js

import React from 'react';
import './SearchBar.css';
// Impor ikon (opsional, tapi disarankan)
// import { SearchIcon } from '../icons'; 

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar-container">
      {/* <SearchIcon className="search-icon" /> */}
      <input
        type="text"
        className="search-input"
        placeholder="Search books by title or author..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
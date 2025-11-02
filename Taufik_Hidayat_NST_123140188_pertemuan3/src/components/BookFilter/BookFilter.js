// src/components/BookFilter/BookFilter.js

import React from 'react';
import './BookFilter.css';

const BookFilter = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'Owned', 'Reading', 'Wishlist'];

  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default BookFilter;
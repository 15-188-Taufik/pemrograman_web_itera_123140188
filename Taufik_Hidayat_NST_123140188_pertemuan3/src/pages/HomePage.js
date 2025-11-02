// src/pages/HomePage.js

import React, { useState, useMemo } from 'react';
import { useBooks } from '../context/BookContext';
import BookList from '../components/BookList/BookList';
import BookFilter from '../components/BookFilter/BookFilter';
import SearchBar from '../components/SearchBar/SearchBar';
import './HomePage.css'; // Kita akan buat file CSS ini

const HomePage = () => {
  const { books } = useBooks(); // Ambil data buku dari context
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // useMemo untuk efisiensi filtering.
  // Logika ini hanya berjalan jika 'books', 'filterStatus', atau 'searchTerm' berubah
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Filter berdasarkan status
        if (filterStatus === 'All') return true;
        return book.status === filterStatus;
      })
      .filter(book => {
        // Filter berdasarkan pencarian (tidak case-sensitive)
        const term = searchTerm.toLowerCase();
        return (
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
        );
      });
  }, [books, filterStatus, searchTerm]);

  return (
    <div className="homepage-container">
      {/* Kontrol (Search & Filter) diletakkan di dalam 'card' */}
      <div className="controls-card card">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <BookFilter 
          currentFilter={filterStatus} 
          onFilterChange={setFilterStatus} 
        />
      </div>
      
      {/* Daftar Buku */}
      <BookList books={filteredBooks} />
    </div>
  );
};

export default HomePage;
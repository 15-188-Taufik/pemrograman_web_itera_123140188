// src/components/BookList/BookList.js

import React from 'react';
import BookCard from '../BookCard/BookCard';
import './BookList.css';

const BookList = ({ books }) => {

  if (books.length === 0) {
    return (
      <div className="empty-state">
        {/* Anda bisa tambahkan SVG ikon di sini */}
        <h3>No Books Found</h3>
        <p>Your book collection is empty. Try adding a new book!</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;